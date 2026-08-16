import mongoose from "mongoose";

// deepak start - new file: Hindu Population feature (state level)
// Schema mirrors the uploaded "states_20260815.xlsx" column set exactly so the
// admin uploader can POST rows straight from the sheet without transformation.
const HinduPopulationStateSchema = new mongoose.Schema(
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
    total_population_hindu_males: { type: Number, default: 0 },
    total_population_hindu_females: { type: Number, default: 0 },

    hindu_population: { type: Number, default: 0 },
    hindu_population_percent: { type: Number, default: 0 },
    hindu_sex_ratio_percent: { type: Number, default: 0 },

    urban_hindu_population: { type: Number, default: 0 },
    rural_hindu_population: { type: Number, default: 0 },
    urban_hindu_population_percenatge: { type: Number, default: 0 },
    rural_hindu_population_percentage: { type: Number, default: 0 },

    seo_title: { type: String, trim: true },
    seo_description: { type: String, trim: true },
  },
  { timestamps: true },
);

HinduPopulationStateSchema.index({ state_slug: 1 });

const HinduPopulationState =
  mongoose.models.HinduPopulationState ||
  mongoose.model("HinduPopulationState", HinduPopulationStateSchema);

export default HinduPopulationState;
// deepak end - new file
