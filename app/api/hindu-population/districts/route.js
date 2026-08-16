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

    // "all=true" (download tool) â every record, every field
    if (searchParams.get("all") === "true") {
      const districts = await HinduPopulationDistrict.find()
        .sort({ state: 1, district: 1 })
        .lean();
      return NextResponse.json(
        { allDistricts: districts },
        { status: 200, headers: CACHE_HEADERS },
      );
    }

    // ââ Case 0: No slugs â used by generateStaticParams ââââââââââââââââââââââ
    if (!state_slug && !district_slug) {
      const totalDistricts = await HinduPopulationDistrict.countDocuments();
      return NextResponse.json({ totalDistricts }, { status: 200 });
    }

    // ââ Case 1: Both slugs â single district detail âââââââââââââââââââââââââââ
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

    // ââ Case 2: state + limit â top N sorted âââââââââââââââââââââââââââââââââ
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

    // ââ Case 3: state only â all districts for that state âââââââââââââââââââ
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

    // deepak start - new code: pre-check whether this state_slug +
    // district_slug combination already exists BEFORE the upsert, so the
    // dashboard uploader can distinguish a brand-new insert from an update
    // to an existing district row (used to drive the "Updated"
    // counter/log status in the Upload Log UI). The same district_slug is
    // allowed to repeat across different states - only an exact
    // state_slug + district_slug match counts as an existing record,
    // matching the compound unique index on the schema.
    const existingDistrict = await HinduPopulationDistrict.findOne({
      state_slug: body.state_slug,
      district_slug: body.district_slug,
    })
      .select("_id")
      .lean();
    const wasUpdate = Boolean(existingDistrict);
    // deepak end - new code

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

    // ââ Targeted cache invalidation âââââââââââââââââââââââââââââââââââââââââââ
    const { state_slug, district_slug } = body;

    if (state_slug && district_slug) {
      revalidatePath(`/hindupopulation/${state_slug}/${district_slug}`);
      revalidatePath(`/hindupopulation/${state_slug}`);
    }

    // deepak start - new code: surface wasUpdate to the caller (dashboard
    // uploader) without changing the shape of the persisted document.
    const responseBody =
      district && typeof district.toObject === "function"
        ? { ...district.toObject(), __wasUpdate: wasUpdate }
        : { ...district, __wasUpdate: wasUpdate };
    // deepak end - new code

    return NextResponse.json(responseBody, { status: 201 });
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
