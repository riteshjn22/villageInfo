// deepak start - new file: Jain Population feature (content model)
// Mirrors lib/models/content.js but kept fully separate so it never touches
// the main site's Content collection. Scoped to the three Jain Population
// page levels only: home (the /jainpopulation hub), state, district.
import mongoose from "mongoose";

const JainPopulationContentSchema = new mongoose.Schema(
  {
    page_id: {
      type: String,
      required: true,
      trim: true,
      enum: ["home", "state", "district"],
    },
    state_slug: {
      type: String,
      default: null,
    },
    district_slug: {
      type: String,
      default: null,
    },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    top_content: { type: String, default: "" },
    bottom_content: { type: String, default: "" },
    blog_content: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
  },
);

// Compound unique index — each combination of page_id + slugs is unique
JainPopulationContentSchema.index(
  {
    page_id: 1,
    state_slug: 1,
    district_slug: 1,
  },
  { unique: true },
);

const JainPopulationContent =
  mongoose.models.JainPopulationContent ||
  mongoose.model("JainPopulationContent", JainPopulationContentSchema);

export default JainPopulationContent;
// deepak end - new file
