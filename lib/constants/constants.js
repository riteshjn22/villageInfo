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
// Server-side behaviour is unchanged.
export const HOST =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://village.trendswe.com";
// deepak end - new code

export const SITE_MAP_PER_PAGE = 10000;
export const SITE_NAME = "Village Trends";
export const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=31535400",
};
