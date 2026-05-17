import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import District from "@/lib/models/district";
import { revalidatePath } from "next/cache";
import { CACHE_HEADERS } from "@/lib/constants/constants";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const state_slug = searchParams.get("state_slug");
    const district_slug = searchParams.get("district_slug");
    const pageIndex = searchParams.get("pageIndex");

    // ── Case 0: No slugs → used by generateStaticParams ──────────────────────
    if (!state_slug && !district_slug) {
      if (pageIndex !== null) {
        const LIMIT = 1000;
        const skip = parseInt(pageIndex) * LIMIT;
        const allDistricts = await District.find({})
          .skip(skip)
          .limit(LIMIT)
          .select("district_slug state_slug")
          .lean();
        return NextResponse.json(
          { allDistricts },
          {
            status: 200,
            headers: CACHE_HEADERS,
          },
        );
      }

      // Total count only — no browser cache needed (build-time only)
      const totalDistricts = await District.countDocuments();
      return NextResponse.json({ totalDistricts }, { status: 200 });
    }

    // ── Case 1: Both slugs → single district detail ───────────────────────────
    if (state_slug && district_slug) {
      const district = await District.findOne({
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
      const sortBy = searchParams.get("sortBy");

      if (!sortBy) {
        const districts = await District.find({ state_slug })
          .limit(limit)
          .select("district district_slug state_slug")
          .lean();

        return NextResponse.json(
          { allDistricts: districts },
          {
            status: 200,
            headers: CACHE_HEADERS,
          },
        );
      }

      const sortMap = {
        population: { total_population: -1 },
        literate: { literates_total_percent: -1 },
      };

      const sortQuery = sortMap[sortBy] ?? { district: 1 };

      const districts = await District.find({ state_slug })
        .sort(sortQuery)
        .limit(limit)
        .select("district district_slug state_slug")
        .lean();

      return NextResponse.json(
        { allDistricts: districts },
        {
          status: 200,
          headers: CACHE_HEADERS,
        },
      );
    }

    // ── Case 3: state only → all districts for that state ────────────────────
    if (state_slug) {
      const districts = await District.find({ state_slug })
        .sort({ district: 1 })
        .select(
          "district district_slug total_population total_tehsils state_slug sex_ratio_percent literates_total_percent",
        )
        .lean();

      return NextResponse.json(
        { allDistricts: districts },
        {
          status: 200,
          headers: CACHE_HEADERS,
        },
      );
    }

    return NextResponse.json(
      { error: "state_slug parameter is required" },
      { status: 400 },
    );
  } catch (error) {
    console.error("GET /districts error:", error);
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

    // Convert empty values to null
    Object.keys(body).forEach((key) => {
      const value = body[key];
      if (value === null || value === undefined || value === "") {
        body[key] = null;
      }
    });

    const district = await District.findOneAndUpdate(
      { district_id: body.district_id },
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
      const districtPath = `/${state_slug}/${district_slug}`;
      const statePath = `/${state_slug}`;

      revalidatePath(districtPath); // clears the specific district page
      revalidatePath(statePath); // clears the state listing page (shows district list)
    }

    return NextResponse.json(district, { status: 201 });
  } catch (error) {
    console.error("POST /districts error:", error);

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
