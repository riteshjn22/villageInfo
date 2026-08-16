// deepak start - new file: Hindu Population feature (state API)
// Mirrors app/api/states/route.js exactly, scoped to the HinduPopulationState
// collection so it never touches the existing /api/states data.
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HinduPopulationState from "@/lib/models/HinduPopulationState";
import { revalidatePath } from "next/cache";
import { CACHE_HEADERS } from "@/lib/constants/constants";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const hasParams = searchParams.toString().length > 0;

    if (hasParams) {
      const filter = {};
      let limit = null;

      searchParams.forEach((value, key) => {
        if (key === "limit") limit = parseInt(value);
        else if (key !== "all") filter[key] = value;
      });

      // limit with no other filters → top N states (name + slug only)
      if (limit && Object.keys(filter).length === 0) {
        const states = await HinduPopulationState.find()
          .sort({ state: 1 })
          .limit(limit)
          .select("state state_slug")
          .lean();

        return NextResponse.json(
          { allStates: states },
          { status: 200, headers: CACHE_HEADERS },
        );
      }

      // "all=true" (download tool) → every record, every field
      if (searchParams.get("all") === "true") {
        const states = await HinduPopulationState.find().sort({ state: 1 }).lean();
        return NextResponse.json(
          { allStates: states },
          { status: 200, headers: CACHE_HEADERS },
        );
      }

      // filter provided → single state detail
      const state = await HinduPopulationState.findOne(filter).lean();

      if (!state) {
        return NextResponse.json({ error: "State not found" }, { status: 404 });
      }

      return NextResponse.json(state, { status: 200, headers: CACHE_HEADERS });
    } else {
      // No params → all states (list / generateStaticParams)
      const states = await HinduPopulationState.find()
        .sort({ state: 1 })
        .select("state state_slug")
        .lean();

      return NextResponse.json(
        { allStates: states },
        { status: 200, headers: CACHE_HEADERS },
      );
    }
  } catch (error) {
    console.error("GET /api/hindu-population/states error:", error);
    return NextResponse.json(
      { error: "Failed to fetch states", details: error.message },
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

    const state = await HinduPopulationState.findOneAndUpdate(
      { state_id: body.state_id },
      { $set: body },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        overwrite: false,
      },
    );

    // ── Targeted cache invalidation ──────────────────────────────────────────
    const { state_slug } = body;

    if (state_slug) {
      revalidatePath(`/hindupopulation/${state_slug}`);
      revalidatePath("/hindupopulation");
    }

    return NextResponse.json(state, { status: 201 });
  } catch (error) {
    console.error("POST /api/hindu-population/states error:", error);

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
      { error: "Failed to create state", details: error.message },
      { status: 500 },
    );
  }
}
// deepak end - new file
