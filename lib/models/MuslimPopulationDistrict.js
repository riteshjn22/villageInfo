import mongoose from "mongoose";

// deepak start - new file: Muslim Population feature (district level)
// Schema mirrors the uploaded "district.xlsx" column set exactly so the admin
// uploader can POST rows straight from the sheet without transformation.
const MuslimPopulationDistrictSchema = new mongoose.Schema(
  {
    state_id: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    state_slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    district: { type: String, required: true, trim: true },
    district_slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    country: { type: String, trim: true, default: "India" },
    census_year: { type: Number, required: true },

    capital: { type: String, trim: true },
    total_area_sq_km: { type: Number, default: 0 },

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

// compound unique key: same district_slug can repeat across different states
MuslimPopulationDistrictSchema.index(
  { state_slug: 1, district_slug: 1 },
  { unique: true },
);

const MuslimPopulationDistrict =
  mongoose.models.MuslimPopulationDistrict ||
  mongoose.model("MuslimPopulationDistrict", MuslimPopulationDistrictSchema);

export default MuslimPopulationDistrict;
// deepak end - new file
