import mongoose from "mongoose";

// deepak start - new file: Christian Population feature (state level)
// Schema mirrors the uploaded "states_20260815.xlsx" column set exactly so the
// admin uploader can POST rows straight from the sheet without transformation.
const ChristianPopulationStateSchema = new mongoose.Schema(
  {
    state_id: { type: String, required: true, unique: true, trim: true },
    state: { type: String, required: true, trim: true },
    state_slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    country: { type: String, trim: true, default: "India" },
    census_year: { type: Number, required: true },

    capital: { type: String, trim: true },
    total_area_sq_km: { type: Number, default: 0 },
    total_districts: { type: Number, default: 0 },

    total_population: { type: Number, default: 0 },
    total_population_christian_males: { type: Number, default: 0 },
    total_population_christian_females: { type: Number, default: 0 },

    christian_population: { type: Number, default: 0 },
    christian_population_percent: { type: Number, default: 0 },
    christian_sex_ratio_percent: { type: Number, default: 0 },

    urban_christian_population: { type: Number, default: 0 },
    rural_christian_population: { type: Number, default: 0 },
    urban_christian_population_percenatge: { type: Number, default: 0 },
    rural_christian_population_percentage: { type: Number, default: 0 },

    seo_title: { type: String, trim: true },
    seo_description: { type: String, trim: true },
  },
  { timestamps: true },
);

ChristianPopulationStateSchema.index({ state_slug: 1 });

const ChristianPopulationState =
  mongoose.models.ChristianPopulationState ||
  mongoose.model("ChristianPopulationState", ChristianPopulationStateSchema);

export default ChristianPopulationState;
// deepak end - new file
