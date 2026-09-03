import mongoose from "mongoose";

// deepak start - new file: Christian Population feature (district level)
// Schema mirrors the uploaded "district.xlsx" column set exactly so the admin
// uploader can POST rows straight from the sheet without transformation.
const ChristianPopulationDistrictSchema = new mongoose.Schema(
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

// compound unique key: same district_slug can repeat across different states
ChristianPopulationDistrictSchema.index(
  { state_slug: 1, district_slug: 1 },
  { unique: true },
);

const ChristianPopulationDistrict =
  mongoose.models.ChristianPopulationDistrict ||
  mongoose.model(
    "ChristianPopulationDistrict",
    ChristianPopulationDistrictSchema,
  );

export default ChristianPopulationDistrict;
// deepak end - new file
