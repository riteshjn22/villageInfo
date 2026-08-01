// deepak start - new file: this entire file is newly added (no old code to replace)
// It exposes a secret-protected POST endpoint to batch-revalidate cache tags/paths on demand
// deepak end - new file
import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

// POST /api/revalidate
// Header: Authorization: Bearer <REVALIDATE_SECRET>
// Body: { "tags": ["state-chhattisgarh", "district-raipur"], "paths": ["/chhattisgarh"] }
//
// Lets you refresh the cached static output for one or many pages at once
// without triggering a full redeploy/rebuild.
export async function POST(req) {
    try {
          if (!process.env.REVALIDATE_SECRET) {
                  return NextResponse.json(
                    { error: "REVALIDATE_SECRET is not configured on the server" },
                    { status: 500 },
                          );
          }

      const authHeader = req.headers.get("authorization") || "";
          const token = authHeader.replace("Bearer ", "").trim();

      if (token !== process.env.REVALIDATE_SECRET) {
              return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await req.json().catch(() => ({}));
          const tags = Array.isArray(body.tags) ? body.tags : [];
          const paths = Array.isArray(body.paths) ? body.paths : [];

      if (tags.length === 0 && paths.length === 0) {
              return NextResponse.json(
                { error: "Provide at least one of 'tags' or 'paths'" },
                { status: 400 },
                      );
      }

      const results = [];

      for (const tag of tags) {
              try {
                        revalidateTag(tag);
                        results.push({ type: "tag", value: tag, success: true });
              } catch (error) {
                        results.push({
                                    type: "tag",
                                    value: tag,
                                    success: false,
                                    error: error.message,
                        });
              }
      }

      for (const path of paths) {
              try {
                        revalidatePath(path);
                        results.push({ type: "path", value: path, success: true });
              } catch (error) {
                        results.push({
                                    type: "path",
                                    value: path,
                                    success: false,
                                    error: error.message,
                        });
              }
      }

      return NextResponse.json({ revalidated: true, results }, { status: 200 });
    } catch (error) {
          console.error("POST /api/revalidate error:", error);
          return NextResponse.json(
            { error: "Failed to revalidate", details: error.message },
            { status: 500 },
                );
    }
}
