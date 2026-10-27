import { HOST } from "@/lib/constants/constants";
import { getAllDistrictSlugs } from "@/lib/data";
import { NextResponse } from "next/server";

// Rebuilt at most once a day (was hourly) — saves function CPU + ISR writes
export const revalidate = 86400;

// Escape special XML characters in URLs/values
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  // One cached MongoDB query for all districts (was one HTTP call per state)
  const districts = (await getAllDistrictSlugs()) as {
    state_slug: string;
    district_slug: string;
  }[];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${districts
  .map(
    (d: { state_slug: string; district_slug: string }) => `  <url>
    <loc>${escapeXml(`${HOST}/${d.state_slug}/${d.district_slug}`)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
