// deepak start - new file: Jain Population feature (India-level index page)
// Placeholder list-of-states hub until a dedicated India-level template/Excel
// is supplied. Links into /jainpopulation/[state] for each state on file.
import type { Metadata } from "next";
import Link from "next/link";
import {
  getJainPopulationStates,
  getJainPopulationContent,
} from "@/utils/common";
import { HOST, SITE_NAME } from "@/lib/constants/constants";
// deepak start - new code: optional managed content (title/description/top/
// bottom/blog) from the Jain Population admin Content tab
import HtmlContent from "@/components/htmlContent";
import BlogSection from "@/components/BlogSection";
// deepak end - new code

export const revalidate = false;
export const dynamic = "force-dynamic";

type StateListItem = {
  state: string;
  state_slug: string;
};

export async function generateMetadata(): Promise<Metadata> {
  // deepak start - new code: let managed content override the default SEO copy
  const content = await getJainPopulationContent("home", {});
  const title =
    (content && !content.error && content.title) ||
    `Jain Population in India by State | ${SITE_NAME}`;
  const description =
    (content && !content.error && content.description) ||
    "Browse Jain population, Jain population percentage and Jain sex ratio for every Indian state, based on Census data.";
  // deepak end - new code

  return {
    title,
    description,
    alternates: { canonical: `${HOST}/jainpopulation` },
    openGraph: { title, description, url: `${HOST}/jainpopulation` },
  };
}

export default async function JainPopulationIndexPage() {
  const states = (await getJainPopulationStates()) as StateListItem[];
  const stateList = Array.isArray(states) ? states : [];
  // deepak start - new code: fetch managed content for this page
  const content = await getJainPopulationContent("home", {});
  const hasContent = content && !content.error;
  // deepak end - new code

  return (
    <main className="m-auto flex w-full flex-wrap p-4 md:max-w-275">
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
        <h1 className="text-lg font-bold md:text-2xl">
          {(hasContent && content.title) ||
            "Jain Population in India â By State"}
        </h1>
        {/* deepak start - new code: managed top_content overrides the default intro paragraph */}
        {hasContent && content.top_content ? (
          <HtmlContent
            type="top"
            content={content.top_content}
            customClass="mb-0"
          />
        ) : (
          <p className="text-sm text-slate-700">
            {(hasContent && content.description) ||
              "Explore Jain population figures, Jain population percentage and Jain sex ratio for each Indian state based on Census data. Select a state below to view detailed district-wise Jain population data."}
          </p>
        )}
        {/* deepak end - new code */}
      </div>

      {stateList.length > 0 ? (
        <div className="mt-4 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {stateList.map((s) => (
            <Link
              key={s.state_slug}
              href={`/jainpopulation/${s.state_slug}`}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-blue-400 hover:text-blue-600"
            >
              {s.state}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4 w-full text-sm text-slate-500">
          No Jain population data has been uploaded yet. Add states from the
          admin dashboard to populate this page.
        </p>
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
  );
}
// deepak end - new file
