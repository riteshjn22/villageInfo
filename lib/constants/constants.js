export const REVALIDATE_TIME = false; // 1 hour in seconds

// deepak start - new code: resolve HOST per runtime.
// In the browser we always call our own origin, so client-side fetches stay
// same-origin on localhost, on Vercel preview builds and in production.
// This fixes the CORS error on preview deployments (/dashboard).
// Server-side: production (village.trendswe.com) always uses the production
// domain. Vercel PREVIEW deployments (VERCEL_ENV === "preview") use their
// own VERCEL_URL instead, so preview branches read from their own DB/API
// rather than silently reading production's data. This previously broke
// because the village-info Vercel project has "Vercel Authentication"
// (Require Log In) enabled on preview deployments - that intercepted the
// self-fetch to VERCEL_URL and returned an HTML login page instead of
// JSON. See VERCEL_BYPASS_HEADERS below, which is what actually makes this
// self-fetch work now. This HOST branch is deliberately scoped to
// VERCEL_ENV === "preview" only - it must NOT apply during production's own
// build/prerender step, since an earlier unconditional VERCEL_URL attempt
// broke production that way and was reverted.
export const HOST =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://village.trendswe.com";
// deepak end - new code

// deepak start - new code: bypass Vercel Deployment Protection for server-side
// self-fetches. The village-info Vercel project has "Vercel Authentication"
// (Require Log In) enabled on PREVIEW deployments only - this intercepts
// EVERY request to the preview domain, including this app's own server
// calling its own /api/* routes during SSR/SSG, and returns an HTML login
// page instead of JSON. VERCEL_AUTOMATION_BYPASS_SECRET (Protection Bypass
// for Automation, configured in Vercel Project Settings > Deployment
// Protection) lets trusted server-side requests skip that wall. This is a
// no-op on production - production has no Deployment Protection, so there
// is nothing to bypass there, and the header is simply ignored if present.
// Only ever attached server-side; browser requests already carry the
// user's own Vercel auth session cookie.
export const VERCEL_BYPASS_HEADERS =
  typeof window === "undefined" && process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    ? { "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
    : {};
// deepak end - new code

export const SITE_MAP_PER_PAGE = 10000;
export const SITE_NAME = "Village Trends";
export const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=31535400",
};
