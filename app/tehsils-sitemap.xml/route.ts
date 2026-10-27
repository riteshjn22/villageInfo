import { HOST } from "@/lib/constants/constants";
import { getAllTehsilSlugs } from "@/lib/data";
import { NextResponse } from "next/server";
// deepak start - new code: escape XML special characters in slug values so a literal
// "&" (e.g. the "north_&_middle_andaman" tehsil slug) doesn't produce invalid XML
function escapeXml(str: string): string {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
// deepak end - new code

// Rebuilt at most once a day (was hourly) — saves function CPU + ISR writes
export const revalidate = 86400;

export async function GET() {
  // One cached MongoDB query for all tehsils (was ~700 HTTP calls, one per district)
  const tehsils = (await getAllTehsilSlugs()) as {
    state_slug: string;
    district_slug: string;
    tehsil_slug: string;
  }[];

  // deepak: slug values below are wrapped in escapeXml() to prevent invalid XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${tehsils
  .map(
    (t: {
      state_slug: string;
      district_slug: string;
      tehsil_slug: string;
    }) => `  <url>
                <loc>${HOST}/${escapeXml(t.state_slug)}/${escapeXml(t.district_slug)}/${escapeXml(t.tehsil_slug)}</loc>
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
