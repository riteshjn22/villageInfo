import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Free-plan: serve images as-is instead of through Vercel Image Optimization
    // (was over the Hobby transformation + cache-write limits, and hostname "**"
    // let any site use our optimizer).
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    // Keep visited pages in the browser's router cache so back/forward and
    // revisits don't re-request them from Vercel.
    staleTimes: {
      dynamic: 600, // 10 minutes
      static: 3600, // 1 hour
    },
  },
  // Browser caching for files in /public (Next serves them with max-age=0 by default)
  async headers() {
    const longCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=2592000, stale-while-revalidate=86400",
      },
    ];
    return [
      { source: "/images/:path*", headers: longCache },
      { source: "/icons/:path*", headers: longCache },
    ];
  },
  async redirects() {
    const host = { type: "host" as const, value: "village-info.vercel.app" };

    const blogSlugs = [
      "cleanest-village-in-india-mawlynnong",
      "the-richest-village-of-maharashtra",
      "richest-village-in-india",
      "top-10-richest-villages-in-india",
      "haunted-village-in-rajasthan",
      "black-magic-village-in-assam",
      "1st-solar-village-in-india",
      "sanskrit-speaking-village-in-india",
      "largest-village-in-punjab",
      "largest-village-in-india",
      "largest-village-in-nagaland",
      "biggest-village-in-haryana",
      "strongest-village-in-india",
      "smallest-village-in-india",
      "smallest-village-in-odisha",
      "twins-village-in-kerala",
      "ias-village-in-up-india",
      "ias-village-in-bihar",
      "cyber-crime-village-in-india",
      "smartest-village-in-india",
      "first-digital-village-in-andhra-pradesh",
      "india-last-village-in-south",
      "first-digital-village-in-india",
      "first-bio-village-in-india",
    ];

    return [
      // Specific blog slugs — single hop, host-scoped
      ...blogSlugs.map((slug) => ({
        source: `/${slug}`,
        has: [host],
        destination: `https://village.trendswe.com/blog/${slug}`,
        permanent: true,
      })),

      // Catch-all — must come LAST
      {
        source: "/:path*",
        has: [host],
        destination: "https://village.trendswe.com/:path*",
        permanent: true,
      },

      // Village pages → their parent tehsil page
      // e.g. /haryana/ambala/naraingarh/ahmadpur → /haryana/ambala/naraingarh
      // Matches exactly 4 segments; reserved top-level paths are excluded.
      {
        source:
          "/:state((?!(?:api|_next|blog|dashboard|login)/)[^/.]+)/:district/:tehsil/:village",
        destination: "/:state/:district/:tehsil",
        permanent: true,
      },

      // Village sitemaps were removed — send old sitemap URLs to the main sitemap
      {
        source: "/villages-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/villages-sitemap/:page",
        destination: "/sitemap.xml",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
