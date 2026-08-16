// deepak start - new file: Hindu Population feature (district API)
// Mirrors app/api/districts/route.js exactly, scoped to the
// HinduPopulationDistrict collection so it never touches /api/districts data.
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HinduPopulationDistrict from "@/lib/models/HinduPopulationDistrict";
import { revalidatePath } from "next/cache";
import { CACHE_HEADERS } from "@/lib/constants/constants";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const state_slug = searchParams.get("state_slug");
    const district_slug = searchParams.get("district_slug");

    // "all=true" (download tool) → every record, every field
    if (searchParams.get("all") === "true") {
      const districts = await HinduPopulationDistrict.find()
        .sort({ state: 1, district: 1 })
        .lean();
      return NextResponse.json(
        { allDistricts: districts },
        { status: 200, headers: CACHE_HEADERS },
      );
    }

    // ── Case 0: No slugs → used by generateStaticParams ──────────────────────
    if (!state_slug && !district_slug) {
      const totalDistricts = await HinduPopulationDistrict.countDocuments();
      return NextResponse.json({ totalDistricts }, { status: 200 });
    }

    // ── Case 1: Both slugs → single district detail ───────────────────────────
    if (state_slug && district_slug) {
      const district = await HinduPopulationDistrict.findOne({
        state_slug,
        district_slug,
      }).lean();

      if (!district) {
        return NextResponse.json(
          { error: "District not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(district, {
        status: 200,
        headers: CACHE_HEADERS,
      });
    }

    // ── Case 2: state + limit → top N sorted ─────────────────────────────────
    if (state_slug && searchParams.get("limit")) {
      const limit = parseInt(searchParams.get("limit"));

      const districts = await HinduPopulationDistrict.find({ state_slug })
        .sort({ hindu_population: -1 })
        .limit(limit)
        .select("district district_slug state_slug hindu_population")
        .lean();

      return NextResponse.json(
        { allDistricts: districts },
        { status: 200, headers: CACHE_HEADERS },
      );
    }

    // ── Case 3: state only → all districts for that state ───────────────────
    if (state_slug) {
      const districts = await HinduPopulationDistrict.find({ state_slug })
        .sort({ district: 1 })
        .select(
          "district district_slug state_slug hindu_population hindu_population_percent total_population",
        )
        .lean();

      return NextResponse.json(
        { allDistricts: districts },
        { status: 200, headers: CACHE_HEADERS },
      );
    }

    return NextResponse.json(
      { error: "state_slug parameter is required" },
      { status: 400 },
    );
  } catch (error) {
    console.error("GET /api/hindu-population/districts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch districts", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Request body is empty or invalid" },
        { status: 400 },
      );
    }

    Object.keys(body).forEach((key) => {
      const value = body[key];
      if (value === null || value === undefined || value === "") {
        body[key] = null;
      }
    });

    const district = await HinduPopulationDistrict.findOneAndUpdate(
      { state_slug: body.state_slug, district_slug: body.district_slug },
      { $set: body },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        overwrite: false,
      },
    );

    // ── Targeted cache invalidation ───────────────────────────────────────────
    const { state_slug, district_slug } = body;

    if (state_slug && district_slug) {
      revalidatePath(`/hindupopulation/${state_slug}/${district_slug}`);
      revalidatePath(`/hindupopulation/${state_slug}`);
    }

    return NextResponse.json(district, { status: 201 });
  } catch (error) {
    console.error("POST /api/hindu-population/districts error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { error: "Validation failed", details: messages },
        { status: 422 },
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate entry", details: error.keyValue },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create district", details: error.message },
      { status: 500 },
    );
  }
}
// deepak end - new file
