// deepak start - new file: Jain Population feature (district-level page)
// Layout + wording ported from the uploaded template1 HTML file. Field
// placeholders like {jain_population[1]} are replaced with live data from
// JainPopulationDistrict via getJainPopulationDistricts().
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import {
  getJainPopulationDistricts,
  getJainPopulationContent,
} from "@/utils/common";
import { HOST } from "@/lib/constants/constants";
// deepak start - new code: optional managed content (title/description/top/
// bottom/blog) from the Jain Population admin Content tab
import HtmlContent from "@/components/htmlContent";
import BlogSection from "@/components/BlogSection";
// deepak end - new code

export const revalidate = false;
export const dynamicParams = true;

const getCachedDistrict = cache((state: string, district: string) =>
  getJainPopulationDistricts({ state_slug: state, district_slug: district }),
);
// deepak start - new code: cached content fetch for this district page
const getCachedDistrictContent = cache((state: string, district: string) =>
  getJainPopulationContent("district", {
    state_slug: state,
    district_slug: district,
  }),
);
// deepak end - new code

type Props = {
  params: Promise<{ state: string; district: string }>;
};

type DistrictData = {
  district: string;
  district_slug: string;
  state: string;
  state_slug: string;
  census_year?: number | string;
  total_area_sq_km?: number | string;
  total_population?: number | string;
  jain_population?: number | string;
  jain_population_percent?: number | string;
  jain_sex_ratio_percent?: number | string;
  total_population_jain_males?: number | string;
  total_population_jain_females?: number | string;
  urban_jain_population?: number | string;
  rural_jain_population?: number | string;
  urban_jain_population_percenatge?: number | string;
  rural_jain_population_percentage?: number | string;
  seo_title?: string;
  seo_description?: string;
  status?: number;
};

export async function generateStaticParams() {
  // deepak: on-demand rendering, same convention as app/[state]/[district]/page.tsx
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, district } = await params;
  const data = (await getCachedDistrict(state, district)) as DistrictData;
  // deepak start - new code: managed content can override the SEO title/description
  const content = await getCachedDistrictContent(state, district);
  const hasContent = content && !content.error;
  // deepak end - new code

  const title =
    (hasContent && content.title) ||
    data?.seo_title ||
    `Jain Population in ${data?.district ?? district}, ${data?.state ?? state} – Jain Sex Ratio`;
  const description =
    (hasContent && content.description) ||
    data?.seo_description ||
    `Jain population, Jain population percentage and Jain sex ratio data for ${data?.district ?? district}, ${data?.state ?? state}.`;

  return {
    title,
    description,
    alternates: { canonical: `${HOST}/jain/${state}/${district}` },
    openGraph: {
      title,
      description,
      url: `${HOST}/jain/${state}/${district}`,
    },
  };
}

export default async function JainPopulationDistrictPage({ params }: Props) {
  const { state, district } = await params;
  const [data, content] = await Promise.all([
    getCachedDistrict(state, district) as Promise<DistrictData>,
    getCachedDistrictContent(state, district),
  ]);

  if (!data || data?.status === 404) notFound();
  // deepak start - new code: managed content for this district page
  const hasContent = content && !content.error;
  // deepak end - new code

  const {
    district: districtName,
    state: stateName,
    census_year = "—",
    total_area_sq_km = "—",
    total_population = "—",
    jain_population = "—",
    jain_population_percent = "—",
    jain_sex_ratio_percent = "—",
    total_population_jain_males = "—",
    total_population_jain_females = "—",
    urban_jain_population = "—",
    rural_jain_population = "—",
    urban_jain_population_percenatge = "—",
    rural_jain_population_percentage = "—",
  } = data;

  return (
    <>
      <style
        // deepak: scoped styles ported verbatim from the uploaded template1 file
        dangerouslySetInnerHTML={{
          __html: `
.vp-wrap{max-width:1140px;margin:0 auto;padding:20px 18px 40px}
.vp-layout{display:grid;grid-template-columns:1fr 290px;gap:22px;margin-top:22px}
@media(max-width:960px){.vp-layout{grid-template-columns:1fr}}
.vp-breadcrumb{display:flex;flex-wrap:wrap;gap:5px;align-items:center;font-size:13px;color:#64748b;margin-bottom:12px}
.vp-breadcrumb a{color:#2563eb;text-decoration:none}.vp-breadcrumb a:hover{text-decoration:underline}
.vp-breadcrumb span{color:#94a3b8}
.vp-hero{border:1px solid #dde3ef;border-radius:18px;background:linear-gradient(155deg,#eef3ff 0%,#fff 55%);padding:22px 24px;box-shadow:0 6px 24px rgba(15,23,42,.06)}
.vp-hero-top{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:start}
@media(max-width:820px){.vp-hero-top{grid-template-columns:1fr}}
.vp-h1{font-family:'DM Serif Display',serif;font-size:28px;line-height:1.25;color:#0f172a;margin-bottom:10px}
.vp-intro{color:#475569;font-size:14.5px;max-width:650px}
.vp-source-note{display:inline-flex;align-items:center;gap:6px;margin-top:12px;font-size:12.5px;color:#64748b;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;padding:5px 10px}
.vp-snapshot{border:1px solid #c7d7fb;border-radius:14px;background:#eff6ff;padding:16px;min-width:220px;flex-shrink:0}
.vp-snap-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#3b82f6;margin-bottom:6px}
.vp-snap-name{font-family:'DM Serif Display',serif;font-size:19px;color:#1e3a8a;margin-bottom:10px;line-height:1.2}
.vp-snap-row{display:flex;justify-content:space-between;gap:8px;font-size:13px;padding:5px 0;border-bottom:1px solid #dbeafe}
.vp-snap-row:last-child{border-bottom:none}.vp-snap-row span{color:#4b6fa5}.vp-snap-row b{color:#1e3a8a;text-align:right}
.vp-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:18px}
@media(max-width:720px){.vp-stats{grid-template-columns:repeat(2,1fr)}}
.vp-stat{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;box-shadow:0 2px 6px rgba(2,6,23,.04)}
.vp-stat-k{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#64748b;margin-bottom:5px}
.vp-stat-v{font-size:17px;font-weight:700;color:#0f172a;line-height:1.2}.vp-stat-sub{font-size:11.5px;color:#94a3b8;margin-top:3px}
.vp-section{margin:26px 0}.vp-section-hd{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.vp-section-hd h2{font-family:'DM Serif Display',serif;font-size:21px;color:#0f172a;line-height:1.2;white-space:nowrap}
.vp-hd-line{flex:1;height:1px;background:#e2e8f0}
.vp-card{border:1px solid #e2e8f0;border-radius:14px;background:#fff;overflow:hidden;box-shadow:0 3px 12px rgba(2,6,23,.04)}
.vp-card-title{font-size:11.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#64748b;padding:11px 16px 9px;background:#f8fafc;border-bottom:1px solid #f1f5f9}
.vp-kv{width:100%;border-collapse:collapse}.vp-kv tr:last-child th,.vp-kv tr:last-child td{border-bottom:none}
.vp-kv th,.vp-kv td{padding:9px 16px;border-bottom:1px solid #f1f5f9;font-size:13.5px;text-align:left;vertical-align:middle}
.vp-kv th{width:48%;background:#f8fafc;color:#475569;font-weight:500}.vp-kv td{color:#0f172a;font-weight:600}
.vp-triblock{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #f1f5f9}
.vp-tri{padding:14px 16px;border-right:1px solid #f1f5f9;text-align:center}.vp-tri:last-child{border-right:none}
.vp-tri-k{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#64748b}
.vp-tri-v{font-size:17px;font-weight:700;color:#0f172a;margin-top:4px}
.vp-duoblock{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #f1f5f9}
.vp-duo{padding:14px 16px;border-right:1px solid #f1f5f9}.vp-duo:last-child{border-right:none}
.vp-duo-label{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#2563eb;margin-bottom:8px}
.vp-duo-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f8fafc;font-size:13px}
.vp-duo-row:last-child{border-bottom:none}.vp-duo-row span{color:#64748b}.vp-duo-row b{color:#0f172a;font-weight:600}
.vp-pill{display:inline-block;padding:2px 9px;border-radius:99px;font-size:12px;font-weight:600;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe}
.vp-content-box{max-width:850px}.vp-content-box .vp-card{max-width:850px}
@media(max-width:960px){.vp-content-box{max-width:100%}.vp-content-box .vp-card{max-width:100%}}
.vp-sidebar{display:flex;flex-direction:column;gap:16px}.vp-sidecard{border:1px solid #e2e8f0;border-radius:14px;background:#fff;padding:16px;box-shadow:0 3px 12px rgba(2,6,23,.04)}
.vp-sidecard h3{font-family:'DM Serif Display',serif;font-size:16px;color:#0f172a;margin-bottom:10px}.vp-sidecard p{font-size:13px;color:#64748b;line-height:1.65}
.vp-sidecard-note{border-left:3px solid #f59e0b;background:#fffbeb}.vp-sidelink{display:block;padding:7px 0;border-bottom:1px solid #f1f5f9;font-size:13.5px;color:#2563eb;text-decoration:none;font-weight:500}
.vp-sidelink:last-child{border-bottom:none;padding-bottom:0}.vp-sidelink:hover{text-decoration:underline}.vp-muted{color:#64748b}
@media(max-width:720px){.vp-triblock,.vp-duoblock{grid-template-columns:1fr}.vp-tri,.vp-duo{border-right:none;border-bottom:1px solid #f1f5f9}.vp-tri:last-child,.vp-duo:last-child{border-bottom:none}}
`,
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Place", "AdministrativeArea"],
            "@id": `${HOST}/jain/${state}/${district}/`,
            name: districtName,
            description: `Jain population data for ${districtName}, ${stateName} based on Census ${census_year}.`,
            url: `${HOST}/jain/${state}/${district}/`,
            address: {
              "@type": "PostalAddress",
              addressRegion: stateName,
              addressCountry: "IN",
            },
            containedInPlace: {
              "@type": ["Place", "AdministrativeArea"],
              name: stateName,
              url: `${HOST}/jain/${state}/`,
            },
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Total Population",
                value: String(total_population),
              },
              {
                "@type": "PropertyValue",
                name: "Jain Population",
                value: String(jain_population),
              },
              {
                "@type": "PropertyValue",
                name: "Jain Population Percentage",
                value: `${jain_population_percent}%`,
              },
              {
                "@type": "PropertyValue",
                name: "Jain Male Population",
                value: String(total_population_jain_males),
              },
              {
                "@type": "PropertyValue",
                name: "Jain Female Population",
                value: String(total_population_jain_females),
              },
              {
                "@type": "PropertyValue",
                name: "Jain Sex Ratio",
                value: `${jain_sex_ratio_percent} females per 1,000 males`,
              },
              {
                "@type": "PropertyValue",
                name: "Urban Jain Population",
                value: String(urban_jain_population),
              },
              {
                "@type": "PropertyValue",
                name: "Rural Jain Population",
                value: String(rural_jain_population),
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
                name: "Jain Population",
                item: `${HOST}/jain/`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: stateName,
                item: `${HOST}/jain/${state}/`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: `Jain Population in ${districtName}`,
                item: `${HOST}/jain/${state}/${district}/`,
              },
            ],
          }),
        }}
      />

      <div className="vp-wrap">
        <nav className="vp-breadcrumb" aria-label="Breadcrumb">
          <Link href="/jain">Jain Population</Link>
          <span>›</span>
          <Link href={`/jain/${state}`}>{stateName}</Link>
          <span>›</span>
          <strong>Jain Population in {districtName}</strong>
        </nav>

        <div className="vp-hero">
          <div className="vp-hero-top">
            <div>
              <h1 className="vp-h1">
                Jain Population in {districtName}, {stateName} – Male, Female
                &amp; Sex Ratio
              </h1>
              <p className="vp-intro">
                As per <strong>Census {census_year}</strong>, {districtName}{" "}
                district in {stateName} has a Jain population of{" "}
                <strong>{jain_population}</strong>, accounting for{" "}
                <strong>{jain_population_percent}%</strong> of the
                district&apos;s total population. The Jain sex ratio is{" "}
                <strong>{jain_sex_ratio_percent}</strong> females per 1,000 Jain
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
              <p className="vp-snap-label">District at a Glance</p>
              <p className="vp-snap-name">{districtName}</p>
              <div className="vp-snap-row">
                <span>State</span>
                <b>{stateName}</b>
              </div>
              <div className="vp-snap-row">
                <span>Total Population</span>
                <b>{total_population}</b>
              </div>
              <div className="vp-snap-row">
                <span>Total Area</span>
                <b>{total_area_sq_km} sq km</b>
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
              <div className="vp-stat-k">Jain Population</div>
              <div className="vp-stat-v">{jain_population}</div>
            </div>
            <div className="vp-stat">
              <div className="vp-stat-k">Jain Population %</div>
              <div className="vp-stat-v">{jain_population_percent}%</div>
            </div>
            <div className="vp-stat">
              <div className="vp-stat-k">Jain Sex Ratio</div>
              <div className="vp-stat-v">{jain_sex_ratio_percent}</div>
              <div className="vp-stat-sub">females per 1,000 males</div>
            </div>
          </div>
        </div>

        <div className="vp-layout">
          <main>
            <div className="vp-content-box">
              <div className="vp-section">
                <div className="vp-section-hd">
                  <h2>Jain Population at a Glance</h2>
                  <div className="vp-hd-line"></div>
                </div>
                <div className="vp-card">
                  <table className="vp-kv">
                    <tbody>
                      <tr>
                        <th>District</th>
                        <td>{districtName}</td>
                      </tr>
                      <tr>
                        <th>State</th>
                        <td>{stateName}</td>
                      </tr>
                      <tr>
                        <th>Total Area</th>
                        <td>{total_area_sq_km} sq km</td>
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
                        <th>Jain Population</th>
                        <td>{jain_population}</td>
                      </tr>
                      <tr>
                        <th>Jain Population Percentage</th>
                        <td>{jain_population_percent}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="vp-section">
                <div className="vp-section-hd">
                  <h2>Jain Male &amp; Female Population in {districtName}</h2>
                  <div className="vp-hd-line"></div>
                </div>
                <div className="vp-card">
                  <div className="vp-card-title">Jain Population by Gender</div>
                  <div className="vp-triblock">
                    <div className="vp-tri">
                      <div className="vp-tri-k">Jain Population</div>
                      <div className="vp-tri-v">{jain_population}</div>
                    </div>
                    <div className="vp-tri">
                      <div className="vp-tri-k">Jain Male</div>
                      <div className="vp-tri-v">
                        {total_population_jain_males}
                      </div>
                    </div>
                    <div className="vp-tri">
                      <div className="vp-tri-k">Jain Female</div>
                      <div className="vp-tri-v">
                        {total_population_jain_females}
                      </div>
                    </div>
                  </div>
                  <table className="vp-kv">
                    <tbody>
                      <tr>
                        <th>Jain Sex Ratio</th>
                        <td>
                          {jain_sex_ratio_percent}{" "}
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

              <div className="vp-section">
                <div className="vp-section-hd">
                  <h2>Urban &amp; Rural Jain Population in {districtName}</h2>
                  <div className="vp-hd-line"></div>
                </div>
                <div className="vp-card">
                  <div className="vp-card-title">
                    Jain Population by Residence
                  </div>
                  <div className="vp-duoblock">
                    <div className="vp-duo">
                      <div className="vp-duo-label">Urban Jain Population</div>
                      <div className="vp-duo-row">
                        <span>Population</span>
                        <b>{urban_jain_population}</b>
                      </div>
                      <div className="vp-duo-row">
                        <span>Share</span>
                        <b>
                          <span className="vp-pill">
                            {urban_jain_population_percenatge}
                          </span>
                        </b>
                      </div>
                    </div>
                    <div className="vp-duo">
                      <div className="vp-duo-label">Rural Jain Population</div>
                      <div className="vp-duo-row">
                        <span>Population</span>
                        <b>{rural_jain_population}</b>
                      </div>
                      <div className="vp-duo-row">
                        <span>Share</span>
                        <b>
                          <span className="vp-pill">
                            {rural_jain_population_percentage}
                          </span>
                        </b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* deepak start - new code: managed blog + bottom content */}
              {hasContent && content.blog_content && (
                <BlogSection blogData={content.blog_content} />
              )}
              {hasContent && content.bottom_content && (
                <HtmlContent type="bottom" content={content.bottom_content} />
              )}
              {/* deepak end - new code */}
            </div>
          </main>

          <aside className="vp-sidebar">
            <div className="vp-sidecard vp-sidecard-note">
              <h3>ⓘ About This Data</h3>
              <p>
                This page presents Jain population figures for {districtName}{" "}
                based on Census {census_year}. Jain population percentage
                represents the share of Jains in the total population. Jain sex
                ratio represents females per 1,000 Jain males.
              </p>
            </div>

            <div className="vp-sidecard">
              <h3>Explore</h3>
              <Link className="vp-sidelink" href={`/jain/${state}`}>
                Jain Population in {stateName}
              </Link>
              <Link className="vp-sidelink" href="/jain">
                Jain Population in India
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
// deepak end - new file
