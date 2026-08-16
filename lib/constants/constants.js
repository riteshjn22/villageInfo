export const REVALIDATE_TIME = false; // 1 hour in seconds

// deepak start - new code: resolve HOST per runtime.
// In the browser we always call our own origin, so client-side fetches stay
// same-origin on localhost, on Vercel preview builds and in production.
// This fixes the CORS error on preview deployments (/dashboard).
// Server-side: always use production village.trendswe.com. (Reverted an
// attempt to use process.env.VERCEL_URL here - it broke server-rendered
// pages, because VERCEL_URL points at a deployment domain that isn't
// serving traffic yet during that same deployment's own build/prerender
// step, causing fetch failures that - combined with revalidate = false -
// got cached permanently as empty pages.)
export const HOST =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
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
