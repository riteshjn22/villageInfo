// deepak start - new file: Buddhist Population feature (content API)
// Mirrors app/api/content/route.js but reads/writes the separate
// BuddhistPopulationContent collection, scoped to home/state/district only.
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BuddhistPopulationContent from "@/lib/models/BuddhistPopulationContent";
import { CACHE_HEADERS } from "@/lib/constants/constants";

// GET /api/buddhist-population/content?page_id=home
// GET /api/buddhist-population/content?page_id=state&state_slug=andhra_pradesh
// GET /api/buddhist-population/content?page_id=district&state_slug=andhra_pradesh&district_slug=visakhapatnam
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page_id = searchParams.get("page_id");
    const state_slug = searchParams.get("state_slug");
    const district_slug = searchParams.get("district_slug");

    if (!page_id) {
      return NextResponse.json(
        { error: "page_id is required" },
        { status: 400 },
      );
    }

    const query = buildSlugQuery(page_id, { state_slug, district_slug });

    const content = await BuddhistPopulationContent.findOne(query).lean();

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(content, {
      status: 200,
      headers: CACHE_HEADERS,
    });
  } catch (error) {
    console.error("GET /buddhist-population/content error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content", details: error.message },
      { status: 500 },
    );
  }
}

// POST /api/buddhist-population/content
// Body for home:     { page_id: "home", title, description, top_content, bottom_content, blog_content }
// Body for state:    { page_id: "state", state_slug, ...fields }
// Body for district: { page_id: "district", state_slug, district_slug, ...fields }
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      page_id,
      state_slug,
      district_slug,
      title,
      description,
      top_content,
      bottom_content,
      blog_content,
    } = body;

    if (!page_id) {
      return NextResponse.json(
        { error: "page_id is required" },
        { status: 400 },
      );
    }

    const slugError = validateSlugs(page_id, { state_slug, district_slug });
    if (slugError) {
      return NextResponse.json({ error: slugError }, { status: 400 });
    }

    const filter = buildSlugQuery(page_id, { state_slug, district_slug });

    const content = await BuddhistPopulationContent.findOneAndUpdate(
      filter,
      {
        $set: {
          title,
          description,
          top_content,
          bottom_content,
          // save null instead of empty string for blog_content
          blog_content: blog_content || null,
        },
        $setOnInsert: {
          page_id,
          ...(state_slug !== undefined && { state_slug }),
          ...(district_slug !== undefined && { district_slug }),
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      },
    );
    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error("POST /buddhist-population/content error:", error);
    return NextResponse.json(
      { error: "Failed to save content", details: error.message },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function buildSlugQuery(page_id, { state_slug, district_slug }) {
  const query = { page_id };

  switch (page_id.toLowerCase()) {
    case "district":
      if (district_slug) query.district_slug = district_slug;
    // falls through
    case "state":
      if (state_slug) query.state_slug = state_slug;
      break;
    // "home" needs no slugs
  }

  return query;
}

function validateSlugs(page_id, { state_slug, district_slug }) {
  switch (page_id.toLowerCase()) {
    case "state":
      if (!state_slug) return "state_slug is required for page_id=state";
      break;
    case "district":
      if (!state_slug) return "state_slug is required for page_id=district";
      if (!district_slug)
        return "district_slug is required for page_id=district";
      break;
  }
  return null;
}
// deepak end - new file
