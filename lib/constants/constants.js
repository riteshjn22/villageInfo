export const REVALIDATE_TIME = false; // 1 hour in seconds

// deepak start - new code: resolve HOST per runtime.
// In the browser we always call our own origin, so client-side fetches stay
// same-origin on localhost, on Vercel preview builds and in production.
// This fixes the CORS error on preview deployments (/dashboard).
// Server-side: production (village.trendswe.com) always uses the production
// domain. Vercel PREVIEW deployments (VERCEL_ENV === "preview") use their
// own VERCEL_URL instead, so preview branches read from their own DB/API
// rather than silently reading production's data. This is deliberately
// scoped to VERCEL_ENV === "preview" only - it must NOT apply during
// production's own build/prerender step, because VERCEL_URL there can point
// at a deployment domain that isn't serving traffic yet during that same
// deployment's own build step, causing fetch failures that - combined with
// revalidate = false - got cached permanently as empty pages. (This is why
// an earlier unconditional VERCEL_URL attempt was reverted.)
export const HOST =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://village.trendswe.com";
// deepak end - new code

export const SITE_MAP_PER_PAGE = 10000;
export const SITE_NAME = "Village Trends";
export const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=31535400",
};
