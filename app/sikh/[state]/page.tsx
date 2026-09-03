// deepak start - new file: Sikh Population feature (state-level page)
// Layout + wording ported from the uploaded template8 HTML file. Field
// placeholders like {sikh_population[1]} are replaced with live data from
// SikhPopulationState via getSikhPopulationStates().
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import {
  getSikhPopulationStates,
  getSikhPopulationDistricts,
  getSikhPopulationContent,
} from "@/utils/common";
import { HOST } from "@/lib/constants/constants";
// deepak start - new code: optional managed content (title/description/top/
// bottom/blog) from the Sikh Population admin Content tab
import HtmlContent from "@/components/htmlContent";
import BlogSection from "@/components/BlogSection";
// deepak end - new code

export const revalidate = false;
export const dynamicParams = true;

const getCachedState = cache((state: string) =>
  getSikhPopulationStates({ state_slug: state }),
);
// deepak start - new code: cached content fetch for this state page
const getCachedStateContent = cache((state: string) =>
  getSikhPopulationContent("state", { state_slug: state }),
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
  sikh_population?: number | string;
  sikh_population_percent?: number | string;
  sikh_sex_ratio_percent?: number | string;
  total_population_sikh_males?: number | string;
  total_population_sikh_females?: number | string;
  urban_sikh_population?: number | string;
  rural_sikh_population?: number | string;
  urban_sikh_population_percenatge?: number | string;
  rural_sikh_population_percentage?: number | string;
  seo_title?: string;
  seo_description?: string;
  status?: number;
};

type DistrictListItem = {
  district: string;
  district_slug: string;
  sikh_population?: number;
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
    `Sikh Population in ${stateData?.state ?? state} – Sikh Sex Ratio`;
  const description =
    (hasContent && content.description) ||
    stateData?.seo_description ||
    `Sikh population, Sikh population percentage and Sikh sex ratio data for ${stateData?.state ?? state}.`;

  return {
    title,
    description,
    alternates: { canonical: `${HOST}/sikh/${state}` },
    openGraph: {
      title,
      description,
      url: `${HOST}/sikh/${state}`,
    },
  };
}

export default async function SikhPopulationStatePage({ params }: Props) {
  const { state } = await params;

  const [stateData, districts, content] = await Promise.all([
    getCachedState(state) as Promise<StateData>,
    getSikhPopulationDistricts({ state_slug: state }) as Promise<
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
    sikh_population = "—",
    sikh_population_percent = "—",
    sikh_sex_ratio_percent = "—",
    total_population_sikh_males = "—",
    total_population_sikh_females = "—",
    urban_sikh_population = "—",
    rural_sikh_population = "—",
    urban_sikh_population_percenatge = "—",
    rural_sikh_population_percentage = "—",
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
            "@id": `${HOST}/sikh/${state}/`,
            name: stateName,
            alternateName: `${stateName} State`,
            description: `Sikh population and Sikh sex ratio data for ${stateName} based on Census ${census_year}.`,
            url: `${HOST}/sikh/${state}/`,
            address: {
              "@type": "PostalAddress",
              addressRegion: stateName,
              addressCountry: "IN",
            },
            containedInPlace: { "@type": "Country", name: country },
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Sikh Population",
                value: String(sikh_population),
              },
              {
                "@type": "PropertyValue",
                name: "Sikh Population Percentage",
                value: `${sikh_population_percent}%`,
              },
              {
                "@type": "PropertyValue",
                name: "Sikh Sex Ratio",
                value: `${sikh_sex_ratio_percent} females per 1,000 males`,
              },
              {
                "@type": "PropertyValue",
                name: "Total Population",
                value: String(total_population),
              },
              {
                "@type": "PropertyValue",
                name: "Sikh Male Population",
                value: String(total_population_sikh_males),
              },
              {
                "@type": "PropertyValue",
                name: "Sikh Female Population",
                value: String(total_population_sikh_females),
              },
              {
                "@type": "PropertyValue",
                name: "Urban Sikh Population",
                value: String(urban_sikh_population),
              },
              {
                "@type": "PropertyValue",
                name: "Rural Sikh Population",
                value: String(rural_sikh_population),
              },
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
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${HOST}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Sikh Population",
                item: `${HOST}/sikh/`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: stateName,
                item: `${HOST}/sikh/${state}/`,
              },
            ],
          }),
        }}
      />

      <div className="vp-wrap">
        <nav className="vp-breadcrumb" aria-label="Breadcrumb">
          <Link href="/sikh">Sikh Population</Link>
          <span>›</span>
          <strong>{stateName}</strong>
        </nav>

        <div className="vp-hero">
          <div className="vp-hero-top">
            <div>
              <h1 className="vp-h1">
                Sikh Population in {stateName} – Sikh Male, Female &amp; Sex
                Ratio
              </h1>
              <p className="vp-intro">
                As per <strong>Census {census_year}</strong>, {stateName} has a
                Sikh population of <strong>{sikh_population}</strong>,
                accounting for <strong>{sikh_population_percent}%</strong> of
                the state's total population. The Sikh sex ratio is{" "}
                <strong>{sikh_sex_ratio_percent}</strong> females per 1,000 Sikh
                males.
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
              <div className="vp-stat-k">Sikh Population</div>
              <div className="vp-stat-v">{sikh_population}</div>
            </div>
            <div className="vp-stat">
              <div className="vp-stat-k">Sikh Population %</div>
              <div className="vp-stat-v">{sikh_population_percent}%</div>
            </div>
            <div className="vp-stat">
              <div className="vp-stat-k">Sikh Sex Ratio</div>
              <div className="vp-stat-v">{sikh_sex_ratio_percent}</div>
              <div className="vp-stat-sub">females per 1,000 males</div>
            </div>
          </div>
        </div>

        <div className="vp-layout">
          <main>
            <div className="vp-section" id="sikh-population">
              <div className="vp-section-hd">
                <h2>Sikh Population at a Glance</h2>
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
                      <th>Sikh Population</th>
                      <td>{sikh_population}</td>
                    </tr>
                    <tr>
                      <th>Sikh Population Percentage</th>
                      <td>{sikh_population_percent}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="vp-section" id="gender">
              <div className="vp-section-hd">
                <h2>Sikh Male &amp; Female Population in {stateName}</h2>
                <div className="vp-hd-line"></div>
              </div>
              <div className="vp-card">
                <div className="vp-card-title">Sikh Population by Gender</div>
                <div className="vp-triblock">
                  <div className="vp-tri">
                    <div className="vp-tri-k">Sikh Population</div>
                    <div className="vp-tri-v">{sikh_population}</div>
                  </div>
                  <div className="vp-tri">
                    <div className="vp-tri-k">Sikh Male</div>
                    <div className="vp-tri-v">
                      {total_population_sikh_males}
                    </div>
                  </div>
                  <div className="vp-tri">
                    <div className="vp-tri-k">Sikh Female</div>
                    <div className="vp-tri-v">
                      {total_population_sikh_females}
                    </div>
                  </div>
                </div>
                <table className="vp-kv">
                  <tbody>
                    <tr>
                      <th>Sikh Sex Ratio</th>
                      <td>
                        {sikh_sex_ratio_percent}{" "}
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
                <h2>Urban &amp; Rural Sikh Population</h2>
                <div className="vp-hd-line"></div>
              </div>
              <div className="vp-card">
                <div className="vp-card-title">
                  Sikh Population by Residence
                </div>
                <div className="vp-duoblock">
                  <div className="vp-duo">
                    <div className="vp-duo-label">Urban Sikh Population</div>
                    <div className="vp-duo-row">
                      <span>Population</span>
                      <b>{urban_sikh_population}</b>
                    </div>
                    <div className="vp-duo-row">
                      <span>Share</span>
                      <b>
                        <span className="vp-pill">
                          {urban_sikh_population_percenatge}
                        </span>
                      </b>
                    </div>
                  </div>
                  <div className="vp-duo">
                    <div className="vp-duo-label">Rural Sikh Population</div>
                    <div className="vp-duo-row">
                      <span>Population</span>
                      <b>{rural_sikh_population}</b>
                    </div>
                    <div className="vp-duo-row">
                      <span>Share</span>
                      <b>
                        <span className="vp-pill">
                          {rural_sikh_population_percentage}
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
                              href={`/sikh/${state}/${d.district_slug}`}
                              style={{ color: "#2563eb", fontWeight: 500 }}
                            >
                              {d.district}
                            </Link>
                          </th>
                          <td>{d.sikh_population ?? "—"} Sikh population</td>
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
                This page presents Sikh population figures for {stateName} based
                on Census {census_year}. Sikh population percentage represents
                the share of Sikhs in the total population. Sikh sex ratio
                represents females per 1,000 Sikh males.
              </p>
            </div>

            <div className="vp-sidecard">
              <h3>Explore</h3>
              <Link className="vp-sidelink" href="/sikh">
                Sikh Population in India
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
// deepak end - new file
