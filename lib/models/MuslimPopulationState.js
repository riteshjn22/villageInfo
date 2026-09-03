import mongoose from "mongoose";

// deepak start - new file: Muslim Population feature (state level)
// Schema mirrors the uploaded "states_20260815.xlsx" column set exactly so the
// admin uploader can POST rows straight from the sheet without transformation.
const MuslimPopulationStateSchema = new mongoose.Schema(
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
    total_population_muslim_males: { type: Number, default: 0 },
    total_population_muslim_females: { type: Number, default: 0 },

    muslim_population: { type: Number, default: 0 },
    muslim_population_percent: { type: Number, default: 0 },
    muslim_sex_ratio_percent: { type: Number, default: 0 },

    urban_muslim_population: { type: Number, default: 0 },
    rural_muslim_population: { type: Number, default: 0 },
    urban_muslim_population_percenatge: { type: Number, default: 0 },
    rural_muslim_population_percentage: { type: Number, default: 0 },

    seo_title: { type: String, trim: true },
    seo_description: { type: String, trim: true },
  },
  { timestamps: true },
);

MuslimPopulationStateSchema.index({ state_slug: 1 });

const MuslimPopulationState =
  mongoose.models.MuslimPopulationState ||
  mongoose.model("MuslimPopulationState", MuslimPopulationStateSchema);

export default MuslimPopulationState;
// deepak end - new file
