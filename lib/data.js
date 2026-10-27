// Server-only data layer used by pages and sitemaps.
//
// Why this file exists (free-plan optimisation):
// Pages used to call our own /api/* routes over HTTP (fetch(`${HOST}/api/...`)).
// Every page render therefore triggered several extra Vercel function
// invocations, each opening its own MongoDB connection. Here we call the same
// route handlers *in-process* (no HTTP hop, no extra invocation) and wrap each
// result in a permanent Data Cache entry, so MongoDB Atlas is queried only once
// per unique query until the matching tag is revalidated via /api/revalidate.
//
// The Data Cache survives redeploys, so a new deployment does NOT re-query
// Atlas for every page.
//
// Error handling: 404s are cached (they are real answers). Any other failure
// (Atlas throttled / down) THROWS, so the broken result is never cached and
// Next.js keeps serving the last good version of the page.
import "server-only";
import { unstable_cache } from "next/cache";
import { GET as statesGET } from "@/app/api/states/route";
import { GET as districtsGET } from "@/app/api/districts/route";
import { GET as tehsilGET } from "@/app/api/tehsil/route";
import { GET as villageGET } from "@/app/api/village/route";
import { GET as contentGET } from "@/app/api/content/route";
import { connectDB } from "@/lib/mongodb";
import State from "@/lib/models/State";
import District from "@/lib/models/district";
import Tehsil from "@/lib/models/tehsil";

const INTERNAL_ORIGIN = "http://internal.local";

function cleanParams(params = {}) {
  const out = {};
  Object.keys(params)
    .sort()
    .forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null) out[key] = String(value);
    });
  return out;
}

// Calls a route handler directly and returns its parsed JSON body.
async function callHandler(handler, path, params) {
  const url = new URL(path, INTERNAL_ORIGIN);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const res = await handler(new Request(url.toString()));
  const body = await res.json().catch(() => ({}));

  if (res.status === 404) {
    // Same shape the old fetch helpers returned for a non-OK response.
    return { error: body?.error || "Not found", status: 404 };
  }
  if (!res.ok) {
    // Do NOT cache failures — throw so the last good page keeps being served.
    throw new Error(
      `${path} failed (${res.status}): ${body?.details || body?.error || ""}`,
    );
  }
  return body;
}

function cachedCall(name, handler, path, params, tags, pick) {
  const clean = cleanParams(params);
  return unstable_cache(
    async () => {
      const body = await callHandler(handler, path, clean);
      return pick ? pick(body) : body;
    },
    ["data-v1", name, JSON.stringify(clean)],
    { revalidate: false, tags: ["all-data", ...tags] },
  )();
}

const tagFor = (prefix, value) => (value ? [`${prefix}-${value}`] : []);

export function getStates(params = {}) {
  return cachedCall(
    "states",
    statesGET,
    "/api/states",
    params,
    ["states", ...tagFor("state", params.state_slug)],
    (d) => (d?.allStates ? d.allStates : d),
  );
}

export function getDistricts(params = {}) {
  return cachedCall(
    "districts",
    districtsGET,
    "/api/districts",
    params,
    [
      "districts",
      ...tagFor("state", params.state_slug),
      ...tagFor("district", params.district_slug),
    ],
    (d) => (d?.allDistricts ? d.allDistricts : d),
  );
}

export function getTehsils(params = {}) {
  return cachedCall(
    "tehsils",
    tehsilGET,
    "/api/tehsil",
    params,
    [
      "tehsils",
      ...tagFor("state", params.state_slug),
      ...tagFor("district", params.district_slug),
      ...tagFor("tehsil", params.block_slug),
    ],
    (d) => (d?.allTehsils ? d.allTehsils : d),
  );
}

export function getVillages(params = {}) {
  return cachedCall(
    "villages",
    villageGET,
    "/api/village",
    params,
    [
      "villages",
      ...tagFor("state", params.state_slug),
      ...tagFor("district", params.district_slug),
      ...tagFor("tehsil", params.block_slug),
      ...tagFor("village", params.village_slug),
    ],
    (d) => (d?.allVillages ? d.allVillages : d),
  );
}

export function getContent(page_id, params = {}) {
  const id = String(page_id).toLowerCase();
  return cachedCall(
    "content",
    contentGET,
    "/api/content",
    { ...params, page_id: id },
    [
      "content",
      `content-${id}`,
      ...tagFor("state", params.state_slug),
      ...tagFor("district", params.district_slug),
      ...tagFor("tehsil", params.block_slug || params.tehsil_slug),
      ...tagFor("village", params.village_slug),
    ],
  );
}

// ─── Helpers for cheap guards and sitemaps ───────────────────────────────────

// True if `slug` is a real state. Uses the cached all-states list, so junk
// URLs from bots (e.g. /wp-admin/x/y) never reach MongoDB.
export async function isValidStateSlug(slug) {
  const states = await getStates();
  return Array.isArray(states) && states.some((s) => s?.state_slug === slug);
}

// One query for every district (sitemap) instead of one query per state.
export const getAllDistrictSlugs = unstable_cache(
  async () => {
    await connectDB();
    return District.find({})
      .select("state_slug district_slug -_id")
      .sort({ state_slug: 1, district_slug: 1 })
      .lean();
  },
  ["data-v1", "all-district-slugs"],
  { revalidate: 86400, tags: ["all-data", "districts"] },
);

// One query for every tehsil (sitemap) instead of ~700 queries per district.
export const getAllTehsilSlugs = unstable_cache(
  async () => {
    await connectDB();
    return Tehsil.find({})
      .select("state_slug district_slug tehsil_slug -_id")
      .sort({ state_slug: 1, district_slug: 1, tehsil_slug: 1 })
      .lean();
  },
  ["data-v1", "all-tehsil-slugs"],
  { revalidate: 86400, tags: ["all-data", "tehsils"] },
);

export const getAllStateSlugs = unstable_cache(
  async () => {
    await connectDB();
    return State.find({})
      .select("state_slug -_id")
      .sort({ state_slug: 1 })
      .lean();
  },
  ["data-v1", "all-state-slugs"],
  { revalidate: 86400, tags: ["all-data", "states"] },
);
