import mongoose from "mongoose";

// deepak start - new file: Buddhist Population feature (state level)
// Schema mirrors the uploaded "states_20260815.xlsx" column set exactly so the
// admin uploader can POST rows straight from the sheet without transformation.
const BuddhistPopulationStateSchema = new mongoose.Schema(
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
    total_population_buddhist_males: { type: Number, default: 0 },
    total_population_buddhist_females: { type: Number, default: 0 },

    buddhist_population: { type: Number, default: 0 },
    buddhist_population_percent: { type: Number, default: 0 },
    buddhist_sex_ratio_percent: { type: Number, default: 0 },

    urban_buddhist_population: { type: Number, default: 0 },
    rural_buddhist_population: { type: Number, default: 0 },
    urban_buddhist_population_percenatge: { type: Number, default: 0 },
    rural_buddhist_population_percentage: { type: Number, default: 0 },

    seo_title: { type: String, trim: true },
    seo_description: { type: String, trim: true },
  },
  { timestamps: true },
);

BuddhistPopulationStateSchema.index({ state_slug: 1 });

const BuddhistPopulationState =
  mongoose.models.BuddhistPopulationState ||
  mongoose.model("BuddhistPopulationState", BuddhistPopulationStateSchema);

export default BuddhistPopulationState;
// deepak end - new file
