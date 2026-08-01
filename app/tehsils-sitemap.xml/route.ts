import { HOST } from "@/lib/constants/constants";
import { getStates, getDistricts, getTehsils } from "@/utils/common";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
    const states = await getStates();

    // deepak start - old code (replaced below):
    // const districtsByState = await Promise.all(
    //   states.map((s: { state_slug: string }) =>
    //     getDistricts({ state_slug: s.state_slug }),
    //   ),
    // );
    // const districts = districtsByState.flat();
    //
    // const tehsilsByDistrict = await Promise.all(
    //   districts.map((d: { state_slug: string; district_slug: string }) =>
    //     getTehsils({ state_slug: d.state_slug, district_slug: d.district_slug }),
    //   ),
    // );
    //
    // const tehsils = tehsilsByDistrict.flat();
    // deepak end - old code

    // deepak start - new code: guard against getStates()/getDistricts()/getTehsils()
    // returning a non-array error object (e.g. on transient DB failure) so the build doesn't crash
    const statesList = Array.isArray(states) ? states : [];

    const districtsByState = await Promise.all(
          statesList.map((s: { state_slug: string }) =>
                  getDistricts({ state_slug: s.state_slug }),
                             ),
        );
    const districts = districtsByState.filter((d) => Array.isArray(d)).flat();

    const tehsilsByDistrict = await Promise.all(
          districts.map((d: { state_slug: string; district_slug: string }) =>
                  getTehsils({ state_slug: d.state_slug, district_slug: d.district_slug }),
                            ),
        );
    const tehsils = tehsilsByDistrict.filter((t) => Array.isArray(t)).flat();
    // deepak end - new code

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${tehsils
  .map(
    (t: {
      state_slug: string;
      district_slug: string;
      tehsil_slug: string;
    }) => `  <url>
    <loc>${HOST}/${t.state_slug}/${t.district_slug}/${t.tehsil_slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
