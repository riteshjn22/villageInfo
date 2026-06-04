/** Page + fetch cache TTL (seconds). Regenerates on next visit after this window. */
export const REVALIDATE_TIME = 60 * 60 * 24; // 24 hours
/** Same origin for page fetches → ISR/full-route cache works on `next start`. */
export const HOST =
  process.env.HOST ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://village.trendswe.com");
export const SITE_MAP_PER_PAGE = 10000;
export const SITE_NAME = "Village Trends";
export const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=31535400",
};
