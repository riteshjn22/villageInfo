import { HOST } from "@/lib/constants/constants";
import { getVillages } from "@/utils/common";
// deepak start - new code: escape XML special characters in slug values so a literal
// "&" (e.g. the "north_&_middle_andaman" tehsil slug) doesn't produce invalid XML
function escapeXml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
}
// deepak end - new code



export async function GET(
  _req: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page: pageParam } = await params; // ← await params
  const page = parseInt(pageParam) - 1;

  const villages = await getVillages({ pageIndex: page });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${villages.map((v: any) => `
  <url>
// deepak start - old code (replaced below):
    // <loc>${HOST}/${v.state_slug}/${v.district_slug}/${v.tehsil_slug}/${v.village_slug}</loc>
        // deepak end - old code
            // deepak start - new code: escape slug values to keep XML valid
                <loc>${HOST}/${escapeXml(v.state_slug)}/${escapeXml(v.district_slug)}/${escapeXml(v.tehsil_slug)}/${escapeXml(v.village_slug)}</loc>
                    // deepak end - new code
                    <lastmod>${new Date(v.updatedAt).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join("")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

