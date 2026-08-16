// deepak start - new file: Hindu Population feature (state-level page)
// Layout + wording ported from the uploaded template8 HTML file. Field
// placeholders like {hindu_population[1]} are replaced with live data from
// HinduPopulationState via getHinduPopulationStates().
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import {
  getHinduPopulationStates,
  getHinduPopulationDistricts,
  getHinduPopulationContent,
} from "@/utils/common";
import { HOST } from "@/lib/constants/constants";
// deepak start - new code: optional managed content (title/description/top/
// bottom/blog) from the Hindu Population admin Content tab
import HtmlContent from "@/components/htmlContent";
import BlogSection from "@/components/BlogSection";
// deepak end - new code

export const revalidate = false;
export const dynamicParams = true;

const getCachedState = cache((state: string) =>
  getHinduPopulationStates({ state_slug: state }),
);
// deepak start - new code: cached content fetch for this state page
const getCachedStateContent = cache((state: string) =>
  getHinduPopulationContent("state", { state_slug: state }),
);
// deepak end - new code

type Props = {
  params: Promise<{ state: string }>;
};

type StateData = {
  state: string;
  state_slug: string;
  country?: string;
  capital?: string;
  census_year?: number | string;
  total_area_sq_km?: number | string;
  total_districts?: number | string;
  state_id?: string;
  total_population?: number | string;
  hindu_population?: number | string;
  hindu_population_percent?: number | string;
  hindu_sex_ratio_percent?: number | string;
  total_population_hindu_males?: number | string;
  total_population_hindu_females?: number | string;
  urban_hindu_population?: number | string;
  rural_hindu_population?: number | string;
  urban_hindu_population_percenatge?: number | string;
  rural_hindu_population_percentage?: number | string;
  seo_title?: string;
  seo_description?: string;
  status?: number;
};

type DistrictListItem = {
  district: string;
  district_slug: string;
  hindu_population?: number;
};

export async function generateStaticParams() {
  // deepak: on-demand rendering, same convention as app/[state]/page.tsx
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const stateData = (await getCachedState(state)) as StateData;
  // deepak start - new code: managed content can override the SEO title/description
  const content = await getCachedStateContent(state);
  const hasContent = content && !content.error;
  // deepak end - new code

  const title =
    (hasContent && content.title) ||
    stateData?.seo_title ||
    `Hindu Population in ${stateData?.state ?? state} – Hindu Sex Ratio`;
  const description =
    (hasContent && content.description) ||
    stateData?.seo_description ||
    `Hindu population, Hindu population percentage and Hindu sex ratio data for ${stateData?.state ?? state}.`;

  return {
    title,
    description,
    alternates: { canonical: `${HOST}/hindupopulation/${state}` },
    openGraph: {
      title,
      description,
      url: `${HOST}/hindupopulation/${state}`,
    },
  };
}

export default async function HinduPopulationStatePage({ params }: Props) {
  const { state } = await params;

  const [stateData, districts, content] = await Promise.all([
    getCachedState(state) as Promise<StateData>,
    getHinduPopulationDistricts({ state_slug: state }) as Promise<
      DistrictListItem[]
    >,
    getCachedStateContent(state),
  ]);

  if (!stateData || stateData?.status === 404) notFound();

  const districtList = Array.isArray(districts) ? districts : [];
  // deepak start - new code: managed content for this state page
  const hasContent = content && !content.error;
  // deepak end - new code

  const {
    state: stateName,
    country = "India",
    capital = "—",
    census_year = "—",
    total_area_sq_km = "—",
    total_districts = "—",
    state_id = "—",
    total_population = "—",
    hindu_population = "—",
    hindu_population_percent = "—",
    hindu_sex_ratio_percent = "—",
    total_population_hindu_males = "—",
    total_population_hindu_females = "—",
    urban_hindu_population = "—",
    rural_hindu_population = "—",
    urban_hindu_population_percenatge = "—",
    rural_hindu_population_percentage = "—",
  } = stateData;

  return (
    <>
      <style
        // deepak: scoped styles ported verbatim from the uploaded template8 file
        dangerouslySetInnerHTML={{
          __html: `
.vp-wrap{max-width:1140px;margin:0 auto;padding:20px 18px 40px}
.vp-layout{display:grid;grid-template-columns:1fr 290px;gap:22px;margin-top:22px}
@media(max-width:960px){.vp-layout{grid-template-columns:1fr}}
.vp-breadcrumb{display:flex;flex-wrap:wrap;gap:5px;align-items:center;font-size:13px;color:#64748b;margin-bottom:12px}
.vp-breadcrumb a{color:#2563eb;text-decoration:none}
.vp-breadcrumb a:hover{text-decoration:underline}
.vp-breadcrumb span{color:#94a3b8}
.vp-hero{border:1px solid #dde3ef;border-radius:18px;background:linear-gradient(155deg,#eef3ff 0%,#ffffff 55%);padding:22px 24px;box-shadow:0 6px 24px rgba(15,23,42,.06)}
.vp-hero-top{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:start}
@media(max-width:820px){.vp-hero-top{grid-template-columns:1fr}}
.vp-h1{font-family:'DM Serif Display',serif;font-size:28px;line-height:1.25;color:#0f172a;margin-bottom:10px}
.vp-intro{color:#475569;font-size:14.5px;max-width:650px}
.vp-source-note{display:inline-flex;align-items:center;gap:6px;margin-top:12px;font-size:12.5px;color:#64748b;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;padding:5px 10px}
.vp-snapshot{border:1px solid #c7d7fb;border-radius:14px;background:#eff6ff;padding:16px;min-width:220px;flex-shrink:0}
.vp-snap-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#3b82f6;margin-bottom:6px}
.vp-snap-name{font-family:'DM Serif Display',serif;font-size:19px;color:#1e3a8a;margin-bottom:10px;line-height:1.2}
.vp-snap-row{display:flex;justify-content:space-between;gap:8px;font-size:13px;padding:5px 0;border-bottom:1px solid #dbeafe}
.vp-snap-row:last-child{border-bottom:none}
.vp-snap-row span{color:#4b6fa5}
.vp-snap-row b{color:#1e3a8a;text-align:right}
.vp-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:18px}
@media(max-width:900px){.vp-stats{grid-template-columns:repeat(3,1fr)}}
@media(max-width:520px){.vp-stats{grid-template-columns:repeat(2,1fr)}}
.vp-stat{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;box-shadow:0 2px 6px rgba(2,6,23,.04)}
.vp-stat-k{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#64748b;margin-bottom:5px}
.vp-stat-v{font-size:17px;font-weight:700;color:#0f172a;line-height:1.2}
.vp-stat-sub{font-size:11.5px;color:#94a3b8;margin-top:3px}
.vp-section{margin:26px 0}
.vp-section-hd{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.vp-section-hd h2{font-family:'DM Serif Display',serif;font-size:21px;color:#0f172a;line-height:1.2;white-space:nowrap}
.vp-hd-line{flex:1;height:1px;background:#e2e8f0}
.vp-card{border:1px solid #e2e8f0;border-radius:14px;background:#fff;overflow:hidden;box-shadow:0 3px 12px rgba(2,6,23,.04)}
.vp-card-title{font-size:11.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#64748b;padding:11px 16px 9px;background:#f8fafc;border-bottom:1px solid #f1f5f9}
.vp-kv{width:100%;border-collapse:collapse}
.vp-kv tr:last-child th,.vp-kv tr:last-child td{border-bottom:none}
.vp-kv th,.vp-kv td{padding:9px 16px;border-bottom:1px solid #f1f5f9;font-size:13.5px;text-align:left;vertical-align:middle}
.vp-kv th{width:48%;background:#f8fafc;color:#475569;font-weight:500}
.vp-kv td{color:#0f172a;font-weight:600}
.vp-triblock{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #f1f5f9}
.vp-tri{padding:14px 16px;border-right:1px solid #f1f5f9;text-align:center}
.vp-tri:last-child{border-right:none}
.vp-tri-k{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#64748b}
.vp-tri-v{font-size:17px;font-weight:700;color:#0f172a;margin-top:4px}
.vp-duoblock{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #f1f5f9}
.vp-duo{padding:14px 16px;border-right:1px solid #f1f5f9}
.vp-duo:last-child{border-right:none}
.vp-duo-label{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#2563eb;margin-bottom:8px}
.vp-duo-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f8fafc;font-size:13px}
.vp-duo-row:last-child{border-bottom:none}
.vp-duo-row span{color:#64748b}
.vp-duo-row b{color:#0f172a;font-weight:600}
.vp-pill{display:inline-block;padding:2px 9px;border-radius:99px;font-size:12px;font-weight:600;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe}
.vp-sidebar{display:flex;flex-direction:column;gap:16px}
.vp-sidecard{border:1px solid #e2e8f0;border-radius:14px;background:#fff;padding:16px;box-shadow:0 3px 12px rgba(2,6,23,.04)}
.vp-sidecard h3{font-family:'DM Serif Display',serif;font-size:16px;color:#0f172a;margin-bottom:10px}
.vp-sidecard p{font-size:13px;color:#64748b;line-height:1.65}
.vp-sidecard-note{border-left:3px solid #f59e0b;background:#fffbeb}
.vp-sidelink{display:block;padding:7px 0;border-bottom:1px solid #f1f5f9;font-size:13.5px;color:#2563eb;text-decoration:none;font-weight:500}
.vp-sidelink:last-child{border-bottom:none;padding-bottom:0}
.vp-sidelink:hover{text-decoration:underline}
.vp-muted{color:#64748b}
@media(max-width:720px){
  .vp-triblock,.vp-duoblock{grid-template-columns:1fr}
  .vp-tri,.vp-duo{border-right:none;border-bottom:1px solid #f1f5f9}
  .vp-tri:last-child,.vp-duo:last-child{border-bottom:none}
}
`,
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Place", "AdministrativeArea"],
            "@id": `${HOST}/hindupopulation/${state}/`,
            name: stateName,
            alternateName: `${stateName} State`,
            description: `Hindu population and Hindu sex ratio data for ${stateName} based on Census ${census_year}.`,
            url: `${HOST}/hindupopulation/${state}/`,
            address: {
              "@type": "PostalAddress",
              addressRegion: stateName,
              addressCountry: "IN",
            },
            containedInPlace: { "@type": "Country", name: country },
            additionalProperty: [
              { "@type": "PropertyValue", name: "Hindu Population", value: String(hindu_population) },
              { "@type": "PropertyValue", name: "Hindu Population Percentage", value: `${hindu_population_percent}%` },
              { "@type": "PropertyValue", name: "Hindu Sex Ratio", value: `${hindu_sex_ratio_percent} females per 1,000 males` },
              { "@type": "PropertyValue", name: "Total Population", value: String(total_population) },
              { "@type": "PropertyValue", name: "Hindu Male Population", value: String(total_population_hindu_males) },
              { "@type": "PropertyValue", name: "Hindu Female Population", value: String(total_population_hindu_females) },
              { "@type": "PropertyValue", name: "Urban Hindu Population", value: String(urban_hindu_population) },
              { "@type": "PropertyValue", name: "Rural Hindu Population", value: String(rural_hindu_population) },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${HOST}/` },
              { "@type": "ListItem", position: 2, name: "Hindu Population", item: `${HOST}/hindupopulation/` },
              { "@type": "ListItem", position: 3, name: stateName, item: `${HOST}/hindupopulation/${state}/` },
            ],
          }),
        }}
      />

      <div className="vp-wrap">
        <nav className="vp-breadcrumb" aria-label="Breadcrumb">
          <Link href="/hindupopulation">Hindu Population</Link>
          <span>›</span>
          <strong>{stateName}</strong>
        </nav>

        <div className="vp-hero">
          <div className="vp-hero-top">
            <div>
              <h1 className="vp-h1">
                Hindu Population in {stateName} – Hindu Male, Female &amp; Sex
                Ratio
              </h1>
              <p className="vp-intro">
                As per <strong>Census {census_year}</strong>, {stateName} has
                a Hindu population of <strong>{hindu_population}</strong>,
                accounting for{" "}
                <strong>{hindu_population_percent}%</strong> of the state's
                total population. The Hindu sex ratio is{" "}
                <strong>{hindu_sex_ratio_percent}</strong> females per 1,000
                Hindu males.
              </p>
              <div className="vp-source-note">
                ℹ️ Source: Census of India — Census {census_year}
              </div>
              {/* deepak start - new code: managed top_content, rendered under the intro */}
              {hasContent && content.top_content && (
                <HtmlContent
                  type="top"
                  content={content.top_content}
                  customClass="mb-0 mt-3"
                />
              )}
              {/* deepak end - new code */}
            </div>

            <div className="vp-snapshot">
              <p className="vp-snap-label">State at a Glance</p>
              <p className="vp-snap-name">{stateName}</p>
              <div className="vp-snap-row">
                <span>Capital</span>
                <b>{capital}</b>
              </div>
              <div className="vp-snap-row">
                <span>Area</span>
                <b>{total_area_sq_km} sq km</b>
              </div>
              <div className="vp-snap-row">
                <span>Districts</span>
                <b>{total_districts}</b>
              </div>
              <div className="vp-snap-row">
                <span>State ID</span>
                <b>{state_id}</b>
              </div>
              <div className="vp-snap-row">
                <span>Census Year</span>
                <b>{census_year}</b>
              </div>
            </div>
          </div>

          <div className="vp-stats">
            <div className="vp-stat">
              <div className="vp-stat-k">Total Population</div>
              <div className="vp-stat-v">{total_population}</div>
            </div>
            <div className="vp-stat">
              <div className="vp-stat-k">Hindu Population</div>
              <div className="vp-stat-v">{hindu_population}</div>
            </div>
            <div className="vp-stat">
              <div className="vp-stat-k">Hindu Population %</div>
              <div className="vp-stat-v">{hindu_population_percent}%</div>
            </div>
            <div className="vp-stat">
              <div className="vp-stat-k">Hindu Sex Ratio</div>
              <div className="vp-stat-v">{hindu_sex_ratio_percent}</div>
              <div className="vp-stat-sub">females per 1,000 males</div>
            </div>
          </div>
        </div>

        <div className="vp-layout">
          <main>
            <div className="vp-section" id="hindu-population">
              <div className="vp-section-hd">
                <h2>Hindu Population at a Glance</h2>
                <div className="vp-hd-line"></div>
              </div>
              <div className="vp-card">
                <table className="vp-kv">
                  <tbody>
                    <tr>
                      <th>State</th>
                      <td>{stateName}</td>
                    </tr>
                    <tr>
                      <th>Country</th>
                      <td>{country}</td>
                    </tr>
                    <tr>
                      <th>Capital</th>
                      <td>{capital}</td>
                    </tr>
                    <tr>
                      <th>Total Area</th>
                      <td>{total_area_sq_km} sq km</td>
                    </tr>
                    <tr>
                      <th>Total Districts</th>
                      <td>{total_districts}</td>
                    </tr>
                    <tr>
                      <th>Census Year</th>
                      <td>{census_year}</td>
                    </tr>
                    <tr>
                      <th>Total Population</th>
                      <td>{total_population}</td>
                    </tr>
                    <tr>
                      <th>Hindu Population</th>
                      <td>{hindu_population}</td>
                    </tr>
                    <tr>
                      <th>Hindu Population Percentage</th>
                      <td>{hindu_population_percent}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="vp-section" id="gender">
              <div className="vp-section-hd">
                <h2>Hindu Male &amp; Female Population in {stateName}</h2>
                <div className="vp-hd-line"></div>
              </div>
              <div className="vp-card">
                <div className="vp-card-title">
                  Hindu Population by Gender
                </div>
                <div className="vp-triblock">
                  <div className="vp-tri">
                    <div className="vp-tri-k">Hindu Population</div>
                    <div className="vp-tri-v">{hindu_population}</div>
                  </div>
                  <div className="vp-tri">
                    <div className="vp-tri-k">Hindu Male</div>
                    <div className="vp-tri-v">
                      {total_population_hindu_males}
                    </div>
                  </div>
                  <div className="vp-tri">
                    <div className="vp-tri-k">Hindu Female</div>
                    <div className="vp-tri-v">
                      {total_population_hindu_females}
                    </div>
                  </div>
                </div>
                <table className="vp-kv">
                  <tbody>
                    <tr>
                      <th>Hindu Sex Ratio</th>
                      <td>
                        {hindu_sex_ratio_percent}{" "}
                        <span
                          className="vp-muted"
                          style={{ fontSize: "12px", fontWeight: 400 }}
                        >
                          females per 1,000 males
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="vp-section" id="urban-rural">
              <div className="vp-section-hd">
                <h2>Urban &amp; Rural Hindu Population</h2>
                <div className="vp-hd-line"></div>
              </div>
              <div className="vp-card">
                <div className="vp-card-title">
                  Hindu Population by Residence
                </div>
                <div className="vp-duoblock">
                  <div className="vp-duo">
                    <div className="vp-duo-label">
                      Urban Hindu Population
                    </div>
                    <div className="vp-duo-row">
                      <span>Population</span>
                      <b>{urban_hindu_population}</b>
                    </div>
                    <div className="vp-duo-row">
                      <span>Share</span>
                      <b>
                        <span className="vp-pill">
                          {urban_hindu_population_percenatge}
                        </span>
                      </b>
                    </div>
                  </div>
                  <div className="vp-duo">
                    <div className="vp-duo-label">
                      Rural Hindu Population
                    </div>
                    <div className="vp-duo-row">
                      <span>Population</span>
                      <b>{rural_hindu_population}</b>
                    </div>
                    <div className="vp-duo-row">
                      <span>Share</span>
                      <b>
                        <span className="vp-pill">
                          {rural_hindu_population_percentage}
                        </span>
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {districtList.length > 0 && (
              <div className="vp-section" id="districts">
                <div className="vp-section-hd">
                  <h2>Districts in {stateName}</h2>
                  <div className="vp-hd-line"></div>
                </div>
                <div className="vp-card">
                  <table className="vp-kv">
                    <tbody>
                      {districtList.map((d) => (
                        <tr key={d.district_slug}>
                          <th>
                            <Link
                              href={`/hindupopulation/${state}/${d.district_slug}`}
                              style={{ color: "#2563eb", fontWeight: 500 }}
                            >
                              {d.district}
                            </Link>
                          </th>
                          <td>
                            {d.hindu_population ?? "—"} Hindu population
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* deepak start - new code: managed blog + bottom content */}
            {hasContent && content.blog_content && (
              <BlogSection blogData={content.blog_content} />
            )}
            {hasContent && content.bottom_content && (
              <HtmlContent type="bottom" content={content.bottom_content} />
            )}
            {/* deepak end - new code */}
          </main>

          <aside className="vp-sidebar">
            <div className="vp-sidecard vp-sidecard-note">
              <h3>ⓘ About This Data</h3>
              <p>
                This page presents Hindu population figures for {stateName}{" "}
                based on Census {census_year}. Hindu population percentage
                represents the share of Hindus in the total population.
                Hindu sex ratio represents females per 1,000 Hindu males.
              </p>
            </div>

            <div className="vp-sidecard">
              <h3>Explore</h3>
              <Link className="vp-sidelink" href="/hindupopulation">
                Hindu Population in India
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
// deepak end - new file
