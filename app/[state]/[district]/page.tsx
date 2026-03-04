import { getContent, getDistricts, getTehsils } from "@/utils/common";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HtmlContent from "@/components/htmlContent";
import BlogSection from "@/components/BlogSection";
import Breadcrumb from "@/components/Breadcrumb";
import TopLeft from "@/components/TopLeft";
import TopChip from "@/components/TopChip";
import Administrative from "@/components/Administrative";
import Population from "@/components/Population";
import Religion from "@/components/Religion";
import Literacy from "@/components/Literacy";
import Workers from "@/components/Workers";
import List from "@/components/List";
import About from "@/components/About";
import PopularList from "@/components/PopularList";
import DistrictSchema from "@/components/Districtschema";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ state: string; district: string }>;
};

type TehsilItem = {
  tehsil: string;
  tehsil_slug: string;
  total_population: number;
  total_villages: number;
  sex_ratio_percent: number;
  literates_total_percent: number;
  state_slug: string;
  district_slug: string;
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, district } = await params;

  const [content, districtData] = await Promise.all([
    getContent("district", { state_slug: state, district_slug: district }),
    getDistricts({ state_slug: state, district_slug: district }),
  ]);

  const title =
    content?.title && !content?.error ? content.title : districtData?.seo_title;
  const description =
    content?.description && !content?.error
      ? content.description
      : districtData?.seo_description;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DistrictPage({ params }: Props) {
  const { state, district } = await params;

  const [content, districtData, tehsilsData] = await Promise.all([
    getContent("district", { state_slug: state, district_slug: district }),
    getDistricts({ state_slug: state, district_slug: district }),
    getTehsils({ state_slug: state, district_slug: district }) as Promise<
      TehsilItem[]
    >,
  ]);

  if (!districtData || districtData?.status === 404) notFound();

  const { district: districtName, census_year } = districtData;

  // ─── Data Shapes ─────────────────────────────────────────────────────────────

  const breadcrumbData = [
    { label: "Home", redirectionUrl: "/" },
    { label: districtData.state, redirectionUrl: `/${state}` },
    { label: districtName, redirectionUrl: null },
  ];

  const adminData = [
    { label: "District", value: districtName },
    { label: "State", value: districtData.state },
    { label: "Country", value: districtData.country },
    { label: "Total Area", value: districtData.total_area_sq_km },
    { label: "Total Tehsils", value: districtData.total_tehsils },
    { label: "Total Villages", value: districtData.total_villages },
    { label: "Total Households", value: districtData.number_of_households },
    {
      label: "Nearest Railway Station",
      value: districtData.nearest_railway_station,
    },
    { label: "Nearest Airport", value: districtData.nearest_airport },
    {
      label: "Latitude / Longitude",
      value: `${districtData.latitude}, ${districtData.longitude}`,
    },
    { label: "Census Year", value: census_year },
  ];

  const overAllPopulation = [
    { label: "Total", value: districtData.total_population },
    { label: "Male", value: districtData.total_population_males },
    { label: "Female", value: districtData.total_population_females },
    { label: "Sex Ratio", value: districtData.sex_ratio_percent },
  ];

  const childrenPopulation = [
    {
      label: "Total (0-6 Yrs)",
      value: districtData.population_0_6_years_total,
    },
    { label: "Male (0-6 Yrs)", value: districtData.population_0_6_years_males },
    {
      label: "Female (0-6 Yrs)",
      value: districtData.population_0_6_years_females,
    },
  ];

  const scStPopulation = [
    {
      label: "SC",
      value: [
        {
          label: "Total",
          value: districtData.scheduled_caste_population_total,
        },
        { label: "Male", value: districtData.scheduled_caste_population_males },
        {
          label: "Female",
          value: districtData.scheduled_caste_population_females,
        },
        {
          label: "% Share",
          value: districtData.scheduled_caste_population_total_percent,
        },
      ],
    },
    {
      label: "ST",
      value: [
        {
          label: "Total",
          value: districtData.scheduled_tribe_population_total,
        },
        { label: "Male", value: districtData.scheduled_tribe_population_males },
        {
          label: "Female",
          value: districtData.scheduled_tribe_population_females,
        },
        {
          label: "% Share",
          value: districtData.scheduled_tribe_population_total_percent,
        },
      ],
    },
  ];

  const religionData = [
    {
      label: "Hindu",
      value: districtData.hindu_population,
      percent: districtData.hindu_population_percent,
    },
    {
      label: "Muslim",
      value: districtData.muslim_population,
      percent: districtData.muslim_population_percent,
    },
    {
      label: "Sikh",
      value: districtData.sikh_population,
      percent: districtData.sikh_population_percent,
    },
    {
      label: "Christian",
      value: districtData.christian_population,
      percent: districtData.christian_population_percent,
    },
    {
      label: "Jain",
      value: districtData.jain_population,
      percent: districtData.jain_population_percent,
    },
    {
      label: "Buddhist",
      value: districtData.buddhist_population,
      percent: districtData.buddhist_population_percent,
    },
  ];

  const literacyData = [
    {
      label: "Total Literates",
      value: districtData.literates_total,
      percent: districtData.literates_total_percent,
    },
    {
      label: "Male Literates",
      value: districtData.literates_males,
      percent: districtData.literates_males_percent,
    },
    {
      label: "Female Literates",
      value: districtData.literates_females,
      percent: districtData.literates_females_percent,
    },
  ];

  const workerData = [
    {
      label: "Total Workers",
      value: districtData.total_workers,
      percent: districtData.total_workers_percent,
    },
    {
      label: "Male Workers",
      value: districtData.total_workers_males,
      percent: districtData.total_workers_males_percent,
    },
    {
      label: "Female Workers",
      value: districtData.total_workers_females,
      percent: districtData.total_workers_females_percent,
    },
  ];

  const tehsilData = tehsilsData?.map((item) => ({
    name: item.tehsil,
    population: item.total_population,
    total: item.total_villages,
    sex_ratio: item?.sex_ratio_percent,
    literacy_rate: item?.literates_total_percent,
    state_slug: item?.state_slug,
    district_slug: item?.district_slug,
    tehsil_slug: item?.tehsil_slug,
  }));

  // TODO: replace with real API data
  const topPopulatedDistricts = [
    { name: "Kaithal", redirectionUrl: "/" },
    { name: "Kaithal", redirectionUrl: "/" },
    { name: "Kaithal", redirectionUrl: "/" },
    { name: "Kaithal", redirectionUrl: "/" },
    { name: "Kaithal", redirectionUrl: "/" },
    { name: "Kaithal", redirectionUrl: "/" },
    { name: "View All States", redirectionUrl: "/" },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <DistrictSchema
        d={districtData}
        state_slug={state}
        tehsils={tehsilsData}
      />
      <main className="flex w-full md:max-w-275 m-auto p-4 flex-wrap">
        <Breadcrumb data={breadcrumbData} />

        <div className="flex w-full flex-col border gap-4 border-gray-200 rounded-2xl bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
          <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
            <div className="flex w-full md:w-2/3 flex-col gap-4">
              <h1 className="text-lg md:text-2xl font-bold">
                {districtName} - Population, Sex Ratio &amp; Literacy Rate
              </h1>

              {content.top_content ? (
                <HtmlContent
                  type="top"
                  content={content.top_content}
                  customClass="mb-0"
                />
              ) : (
                <>
                  <p className="text-slate-700 text-sm">
                    {districtName} is a district in {districtData.state},{" "}
                    {districtData.country}, with {districtData.total_tehsils}{" "}
                    tehsils and {districtData.total_villages} villages. As per
                    Census {census_year}, the total population is{" "}
                    {districtData.total_population}, sex ratio is{" "}
                    {districtData.sex_ratio_percent} females per 1,000 males,
                    and the overall literacy rate is{" "}
                    {districtData.literates_total_percent}%.
                  </p>
                  <p className="text-slate-700 text-sm p-2 border border-gray-200 rounded-md bg-gray-100">
                    ℹ️ Source: Office of the Registrar General &amp; Census
                    Commissioner, India — Census {census_year}
                  </p>
                </>
              )}
            </div>

            <TopLeft
              title="District at a Glance"
              subHeading={districtName}
              data={[
                { label: "State", value: districtData.state },
                {
                  label: "Area",
                  value: `${districtData.total_area_sq_km} sq km`,
                },
                {
                  label: "Nearest Railway",
                  value: districtData.nearest_railway_station,
                },
                {
                  label: "Nearest Airport",
                  value: districtData.nearest_airport,
                },
                { label: "District Code", value: districtData.district_id },
                { label: "Census Year", value: census_year },
              ]}
            />
          </div>

          <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
            <TopChip
              heading="Total Population"
              value={districtData.total_population}
            />
            <TopChip
              heading="Sex Ratio"
              value={districtData.sex_ratio_percent}
              isShowPercent
            />
            <TopChip
              heading="Literacy Rate"
              value={districtData.literates_total_percent}
              isShowPercent
            />
            <TopChip
              heading="Total Tehsils"
              value={districtData.total_tehsils}
            />
            <TopChip
              heading="Total Villages"
              value={districtData.total_villages}
            />
            <TopChip
              heading="Households"
              value={districtData.number_of_households}
            />
          </div>
        </div>

        <div className="flex w-full gap-4 mt-4 flex-wrap md:flex-nowrap">
          <div className="w-full md:w-2/3">
            <Administrative heading={districtName} data={adminData} />
            <Population
              heading={districtName}
              year={census_year}
              overAllPopulation={overAllPopulation}
              childrenPopulation={childrenPopulation}
              scStPopulation={scStPopulation}
            />
            <Religion heading={districtName} religionData={religionData} />
            <Literacy heading={districtName} data={literacyData} />
            <Workers heading={districtName} data={workerData} />
            <List type="district" heading={districtName} data={tehsilData} />
          </div>

          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <About type="district" name={districtName} />
            <PopularList
              heading={`Top Populated ${districtName} Tehsils`}
              listData={topPopulatedDistricts}
            />
            <PopularList
              heading={`Top Literate ${districtName} Tehsils`}
              listData={topPopulatedDistricts}
            />
            <PopularList
              heading="Explore Other Districts"
              listData={topPopulatedDistricts}
            />
          </div>
        </div>

        {content?.blog_content && (
          <BlogSection blogData={content.blog_content} />
        )}
        {content?.bottom_content && (
          <HtmlContent type="bottom" content={content.bottom_content} />
        )}
      </main>
    </>
  );
}
