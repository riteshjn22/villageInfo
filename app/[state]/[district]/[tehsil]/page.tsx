import About from "@/components/About";
import Administrative from "@/components/Administrative";
import BlogSection from "@/components/BlogSection";
import Breadcrumb from "@/components/Breadcrumb";
import HtmlContent from "@/components/htmlContent";
import List from "@/components/List";
import Literacy from "@/components/Literacy";
import PopularList from "@/components/PopularList";
import Population from "@/components/Population";
import TopChip from "@/components/TopChip";
import TopLeft from "@/components/TopLeft";
import Workers from "@/components/Workers";
import { getContent, getTehsils, getVillages } from "@/utils/common";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ state: string; district: string; tehsil: string }>;
};

type VillageItem = {
  village: string;
  total_population: number;
  number_of_households: number;
  sex_ratio_percent: number;
  literates_total_percent: number;
  state_slug: string;
  district_slug: string;
  tehsil_slug: string;
  village_slug: string;
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, district, tehsil } = await params;

  const [content, tehsilData] = await Promise.all([
    getContent("tehsil", {
      state_slug: state,
      district_slug: district,
      block_slug: tehsil,
    }),
    getTehsils({
      state_slug: state,
      district_slug: district,
      block_slug: tehsil,
    }),
  ]);

  const title =
    content?.title && !content?.error ? content.title : tehsilData?.seo_title;
  const description =
    content?.description && !content?.error
      ? content.description
      : tehsilData?.seo_description;

  return { title, description, openGraph: { title, description } };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TehsilPage({ params }: Props) {
  const { state, district, tehsil } = await params;

  const slugs = {
    state_slug: state,
    district_slug: district,
    block_slug: tehsil,
  };

  const [content, tehsilData, villagesData] = await Promise.all([
    getContent("tehsil", slugs),
    getTehsils(slugs),
    getVillages(slugs) as Promise<VillageItem[]>,
  ]);

  if (!tehsilData || tehsilData?.status === 404) notFound();

  const { tehsil: tehsilName, census_year } = tehsilData;

  // ─── Data Shapes ─────────────────────────────────────────────────────────────

  const breadcrumbData = [
    { label: "Home", redirectionUrl: "/" },
    { label: state, redirectionUrl: `/${state}` },
    { label: district, redirectionUrl: `/${state}/${district}` },
    { label: tehsilName, redirectionUrl: null },
  ];

  const adminData = [
    { label: "Tehsil", value: tehsilName },
    { label: "District", value: tehsilData.district },
    { label: "State", value: tehsilData.state },
    { label: "Country", value: tehsilData.country },
    { label: "Total Area", value: tehsilData.total_area_sq_km },
    { label: "Total Villages", value: tehsilData.total_villages },
    { label: "Total Households", value: tehsilData.number_of_households },
    { label: "Census Year", value: census_year },
  ];

  const overAllPopulation = [
    { label: "Total", value: tehsilData.total_population },
    { label: "Male", value: tehsilData.total_population_males },
    { label: "Female", value: tehsilData.total_population_females },
    { label: "Sex Ratio", value: tehsilData.sex_ratio_percent },
  ];

  const childrenPopulation = [
    { label: "Total (0-6 Yrs)", value: tehsilData.population_0_6_years_total },
    { label: "Male (0-6 Yrs)", value: tehsilData.population_0_6_years_males },
    {
      label: "Female (0-6 Yrs)",
      value: tehsilData.population_0_6_years_females,
    },
  ];

  const scStPopulation = [
    {
      label: "SC",
      value: [
        { label: "Total", value: tehsilData.scheduled_caste_population_total },
        { label: "Male", value: tehsilData.scheduled_caste_population_males },
        {
          label: "Female",
          value: tehsilData.scheduled_caste_population_females,
        },
        {
          label: "% Share",
          value: tehsilData.scheduled_caste_population_total_percent,
        },
      ],
    },
    {
      label: "ST",
      value: [
        { label: "Total", value: tehsilData.scheduled_tribe_population_total },
        { label: "Male", value: tehsilData.scheduled_tribe_population_males },
        {
          label: "Female",
          value: tehsilData.scheduled_tribe_population_females,
        },
        {
          label: "% Share",
          value: tehsilData.scheduled_tribe_population_total_percent,
        },
      ],
    },
  ];

  const literacyData = [
    {
      label: "Total Literates",
      value: tehsilData.literates_total,
      percent: tehsilData.literates_total_percent,
    },
    {
      label: "Male Literates",
      value: tehsilData.literates_males,
      percent: tehsilData.literates_males_percent,
    },
    {
      label: "Female Literates",
      value: tehsilData.literates_females,
      percent: tehsilData.literates_females_percent,
    },
  ];

  const workerData = [
    {
      label: "Total Workers",
      value: tehsilData.total_workers,
      percent: tehsilData.total_workers_percent,
    },
    {
      label: "Male Workers",
      value: tehsilData.total_workers_males,
      percent: tehsilData.total_workers_males_percent,
    },
    {
      label: "Female Workers",
      value: tehsilData.total_workers_females,
      percent: tehsilData.total_workers_females_percent,
    },
  ];

  const villageData = villagesData?.map((item) => ({
    name: item.village,
    population: item.total_population,
    total: item.number_of_households,
    sex_ratio: item.sex_ratio_percent,
    literacy_rate: item.literates_total_percent,
    state_slug: item.state_slug,
    district_slug: item.district_slug,
    tehsil_slug: item.tehsil_slug,
    village_slug: item.village_slug,
  }));

  // TODO: replace with real API data
  const topPopulatedTehsils = [
    { name: "Kaithal", redirectionUrl: "/" },
    { name: "Kaithal", redirectionUrl: "/" },
    { name: "Kaithal", redirectionUrl: "/" },
    { name: "Kaithal", redirectionUrl: "/" },
    { name: "Kaithal", redirectionUrl: "/" },
    { name: "Kaithal", redirectionUrl: "/" },
    { name: "View All Tehsils", redirectionUrl: "/" },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <main className="flex w-full md:max-w-275 m-auto p-4 flex-wrap">
      <Breadcrumb data={breadcrumbData} />

      <div className="flex w-full flex-col border gap-4 border-gray-200 rounded-2xl bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
        <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4">
            <h1 className="text-lg md:text-2xl font-bold">
              {tehsilName} - Population, Sex Ratio &amp; Literacy Rate
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
                  {tehsilName} is a tehsil in {tehsilData.district} district,{" "}
                  {tehsilData.state}, {tehsilData.country}, with{" "}
                  {tehsilData.total_villages} villages. As per Census{" "}
                  {census_year}, the total population is{" "}
                  {tehsilData.total_population}, sex ratio is{" "}
                  {tehsilData.sex_ratio_percent} females per 1,000 males, and
                  the overall literacy rate is{" "}
                  {tehsilData.literates_total_percent}%.
                </p>
                <p className="text-slate-700 text-sm p-2 border border-gray-200 rounded-md bg-gray-100">
                  ℹ️ Source: Office of the Registrar General &amp; Census
                  Commissioner, India — Census {census_year}
                </p>
              </>
            )}
          </div>

          <TopLeft
            title="Tehsil at a Glance"
            subHeading={tehsilName}
            data={[
              { label: "District", value: tehsilData.district },
              { label: "State", value: tehsilData.state },
              { label: "Country", value: tehsilData.country },
              { label: "Area", value: `${tehsilData.total_area_sq_km} sq km` },
              { label: "Tehsil Code", value: tehsilData.tehsil_id },
              { label: "Census Year", value: census_year },
            ]}
          />
        </div>

        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <TopChip
            heading="Total Population"
            value={tehsilData.total_population}
          />
          <TopChip
            heading="Sex Ratio"
            value={tehsilData.sex_ratio_percent}
            isShowPercent
          />
          <TopChip
            heading="Literacy Rate"
            value={tehsilData.literates_total_percent}
            isShowPercent
          />
          <TopChip heading="Total Villages" value={tehsilData.total_villages} />
          <TopChip
            heading="Households"
            value={tehsilData.number_of_households}
          />
          <TopChip heading="Area" value={tehsilData.total_area_sq_km} />
        </div>
      </div>

      <div className="flex w-full gap-4 mt-4 flex-wrap md:flex-nowrap">
        <div className="w-full md:w-2/3">
          <Administrative heading={tehsilName} data={adminData} />
          <Population
            heading={tehsilName}
            year={census_year}
            overAllPopulation={overAllPopulation}
            childrenPopulation={childrenPopulation}
            scStPopulation={scStPopulation}
          />
          <Literacy heading={tehsilName} data={literacyData} />
          <Workers heading={tehsilName} data={workerData} />
          <List type="tehsil" heading={tehsilName} data={villageData} />
        </div>

        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <About type="tehsil" name={tehsilName} />
          <PopularList
            heading={`Top Populated ${tehsilName} Villages`}
            listData={topPopulatedTehsils}
          />
          <PopularList
            heading={`Top Literate ${tehsilName} Villages`}
            listData={topPopulatedTehsils}
          />
          <PopularList
            heading="Explore Other Tehsils"
            listData={topPopulatedTehsils}
          />
        </div>
      </div>

      {content?.blog_content && <BlogSection blogData={content.blog_content} />}
      {content?.bottom_content && (
        <HtmlContent type="bottom" content={content.bottom_content} />
      )}
    </main>
  );
}
