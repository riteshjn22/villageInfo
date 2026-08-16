export const REVALIDATE_TIME = false; // 1 hour in seconds

// deepak start - old code (replaced below):
//   export const HOST =
//     process.env.NODE_ENV === "development"
//       ? "http://localhost:3000"
//       : "https://village.trendswe.com";
// deepak end - old code

// deepak start - new code: resolve HOST per runtime.
// In the browser we always call our own origin, so client-side fetches stay
// same-origin on localhost, on Vercel preview builds and in production.
// This fixes the CORS error on preview deployments (/dashboard).
// Server-side: use Vercel's own deployment URL (VERCEL_URL) when present so
// server components on a preview deployment fetch from that SAME preview
// (which has this branch's new API routes + data) instead of always hitting
// production village.trendswe.com, which doesn't have unreleased routes/data
// yet. VERCEL_URL is set automatically for every Vercel deployment (preview
// and production) to that deployment's own domain, without a protocol.
export const HOST =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://village.trendswe.com";
// deepak end - new code

export const SITE_MAP_PER_PAGE = 10000;
export const SITE_NAME = "Village Trends";
export const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=31535400",
};
