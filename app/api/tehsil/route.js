import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Tehsil from "../../../lib/models/tehsil";
import { revalidatePath } from "next/cache";
import { CACHE_HEADERS } from "@/lib/constants/constants";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const state_slug = searchParams.get("state_slug");
    const district_slug = searchParams.get("district_slug");
    const tehsil_slug = searchParams.get("block_slug");
    const pageIndex = searchParams.get("pageIndex");

    // ── Case 0: No slugs → used by generateStaticParams ──────────────────────
    if (!state_slug && !district_slug && !tehsil_slug) {
      if (pageIndex !== null) {
        const LIMIT = 1000;
        const skip = parseInt(pageIndex) * LIMIT;
        const allTehsils = await Tehsil.find({})
          .skip(skip)
          .limit(LIMIT)
          .select("tehsil_slug state_slug district_slug")
          .lean();
        return NextResponse.json(
          { allTehsils },
          {
            status: 200,
            headers: CACHE_HEADERS,
          },
        );
      }

      // Total count only — no browser cache needed (build-time only)
      const totalTehsils = await Tehsil.countDocuments();
return NextResponse.json(
  { totalTehsils },
  {
    status: 200,
    headers: CACHE_HEADERS    // ← add this line
  }
);
    }

    // ── Case 1: All three slugs → single tehsil detail ───────────────────────
    if (state_slug && district_slug && tehsil_slug) {
      const tehsil = await Tehsil.findOne({
        state_slug,
        district_slug,
        tehsil_slug,
      }).lean();

      if (!tehsil) {
        return NextResponse.json(
          { error: "Tehsil not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(tehsil, {
        status: 200,
        headers: CACHE_HEADERS,
      });
    }

    // ── Case 2: state + district + limit → top N sorted ──────────────────────
    if (state_slug && district_slug && searchParams.get("limit")) {
      const limit = parseInt(searchParams.get("limit"));
      const sortBy = searchParams.get("sortBy");

      const sortMap = {
        population: { total_population: -1 },
        literate: { literates_total_percent: -1 },
      };

      const sortQuery = sortMap[sortBy] ?? { tehsil: 1 };

      const tehsils = await Tehsil.find({ state_slug, district_slug })
        .sort(sortQuery)
        .limit(limit)
        .select("tehsil tehsil_slug state_slug district_slug")
        .lean();

      return NextResponse.json(
        { allTehsils: tehsils },
        {
          status: 200,
          headers: CACHE_HEADERS,
        },
      );
    }

    // ── Case 3: state + district → all tehsils for that district ─────────────
    if (state_slug && district_slug) {
      const tehsils = await Tehsil.find({ state_slug, district_slug })
        .sort({ block_tehsil: 1 })
        .select(
          "tehsil tehsil_slug total_population total_tehsils state_slug district_slug total_villages sex_ratio_percent literates_total_percent",
        )
        .lean();

      return NextResponse.json(
        { allTehsils: tehsils },
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
    console.error("GET /tehsils error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tehsils", details: error.message },
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

    const tehsil = await Tehsil.findOneAndUpdate(
      { tehsil_id: body.tehsil_id },
      { $set: body },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        overwrite: false,
      },
    );

    // ── Targeted cache invalidation ───────────────────────────────────────────
    const { state_slug, district_slug, tehsil_slug } = body;

    if (state_slug && district_slug && tehsil_slug) {
      const tehsilPath = `/${state_slug}/${district_slug}/${tehsil_slug}`;
      const districtPath = `/${state_slug}/${district_slug}`;

      revalidatePath(tehsilPath); // clears the specific tehsil page
      revalidatePath(districtPath); // clears the district listing page (shows tehsil list)
    }

    return NextResponse.json(tehsil, { status: 201 });
  } catch (error) {
    console.error("POST /tehsils error:", error);

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
      { error: "Failed to create tehsil", details: error.message },
      { status: 500 },
    );
  }
}
