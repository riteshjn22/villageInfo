import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Village from "../../../lib/models/village";
import { revalidatePath } from "next/cache";
import { SITE_MAP_PER_PAGE, CACHE_HEADERS } from "@/lib/constants/constants";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const state_slug = searchParams.get("state_slug");
    const district_slug = searchParams.get("district_slug");
    const block_slug =
      searchParams.get("block_slug") || searchParams.get("tehsil_slug");
    const village_slug = searchParams.get("village_slug");
    const pageIndex = searchParams.get("pageIndex");

    // Case 1B: state + district + block + limit → top N sorted villages
    if (
      state_slug &&
      district_slug &&
      block_slug &&
      searchParams.get("limit")
    ) {
      const limit = parseInt(searchParams.get("limit"));
      const sortBy = searchParams.get("sortBy");

      const sortMap = {
        population: { total_population: -1 },
        literate: { literates_total_percent: -1 },
      };

      let query = Village.find({
        state_slug,
        district_slug,
        tehsil_slug: block_slug,
      })
        .limit(limit)
        .select("village village_slug state_slug district_slug tehsil_slug");

      if (sortBy && sortMap[sortBy]) {
        query = query.sort(sortMap[sortBy]);
      }

      const villages = await query.lean();
      return NextResponse.json(
        { allVillages: villages },
        {
          status: 200,
          headers: CACHE_HEADERS,
        },
      );
    }

    // Case 1: All 4 slugs → single village detail
    if (state_slug && district_slug && block_slug && village_slug) {
      const village = await Village.findOne({
        state_slug,
        district_slug,
        tehsil_slug: block_slug,
        village_slug,
      }).lean();

      if (!village) {
        return NextResponse.json(
          { error: "Village not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(village, {
        status: 200,
        headers: CACHE_HEADERS,
      });
    }

    // Case 2: state + district + block → all villages for that block
    if (state_slug && district_slug && block_slug) {
      const villages = await Village.find({
        state_slug,
        district_slug,
        tehsil_slug: block_slug,
      })
        .sort({ village: 1 })
        .select(
          "village village_slug total_population nearest_town number_of_households sex_ratio_percent literates_total_percent state_slug district_slug tehsil_slug",
        )
        .lean();

      return NextResponse.json(
        { allVillages: villages },
        {
          status: 200,
          headers: CACHE_HEADERS,
        },
      );
    }

    // Case 3: pageIndex → paginated villages for generateStaticParams / sitemap
    if (pageIndex) {
      const villages = await Village.find()
        .sort({ village: 1 })
        .skip(parseInt(pageIndex) * SITE_MAP_PER_PAGE)
        .limit(SITE_MAP_PER_PAGE)
        .select(
          "village village_slug state state_slug district district_slug tehsil_slug block_tehsil total_population updatedAt",
        )
        .lean();

      return NextResponse.json(
        { allVillages: villages },
        {
          status: 200,
          headers: CACHE_HEADERS,
        },
      );
    }

    // Case 4: No params → total count for generateStaticParams
    if (!state_slug && !district_slug && !block_slug && !village_slug) {
      const totalVillages = await Village.countDocuments();
      return NextResponse.json({ totalVillages }, { status: 200 });
    }

    return NextResponse.json(
      {
        error:
          "state_slug, district_slug and tehsil_slug parameters are required",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("GET /villages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch villages", details: error.message },
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

    const village = await Village.findOneAndUpdate(
      { village_id: body.village_id },
      body,
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        overwrite: false,
      },
    );

    // ── Targeted cache invalidation ───────────────────────────────────────────
    // Requires these slug fields to be present in the POST body
    const { state_slug, district_slug, tehsil_slug, village_slug } = body;

    if (state_slug && district_slug && tehsil_slug && village_slug) {
      const villagePath = `/${state_slug}/${district_slug}/${tehsil_slug}/${village_slug}`;
      const tehsilPath = `/${state_slug}/${district_slug}/${tehsil_slug}`;

      revalidatePath(villagePath); // clears the specific village page
      revalidatePath(tehsilPath); // clears the tehsil listing page (shows village list)
    }

    return NextResponse.json(village, { status: 201 });
  } catch (error) {
    console.error("POST /villages error:", error);

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
      { error: "Failed to create village", details: error.message },
      { status: 500 },
    );
  }
}
