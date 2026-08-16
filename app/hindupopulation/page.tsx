// deepak start - new file: Hindu Population feature (India-level index page)
// Placeholder list-of-states hub until a dedicated India-level template/Excel
// is supplied. Links into /hindupopulation/[state] for each state on file.
import type { Metadata } from "next";
import Link from "next/link";
import { getHinduPopulationStates } from "@/utils/common";
import { HOST, SITE_NAME } from "@/lib/constants/constants";

export const revalidate = false;

type StateListItem = {
  state: string;
  state_slug: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const title = `Hindu Population in India by State | ${SITE_NAME}`;
  const description =
    "Browse Hindu population, Hindu population percentage and Hindu sex ratio for every Indian state, based on Census data.";

  return {
    title,
    description,
    alternates: { canonical: `${HOST}/hindupopulation` },
    openGraph: { title, description, url: `${HOST}/hindupopulation` },
  };
}

export default async function HinduPopulationIndexPage() {
  const states = (await getHinduPopulationStates()) as StateListItem[];
  const stateList = Array.isArray(states) ? states : [];

  return (
    <main className="m-auto flex w-full flex-wrap p-4 md:max-w-275">
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
        <h1 className="text-lg font-bold md:text-2xl">
          Hindu Population in India — By State
        </h1>
        <p className="text-sm text-slate-700">
          Explore Hindu population figures, Hindu population percentage and
          Hindu sex ratio for each Indian state based on Census data. Select a
          state below to view detailed district-wise Hindu population data.
        </p>
      </div>

      {stateList.length > 0 ? (
        <div className="mt-4 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {stateList.map((s) => (
            <Link
              key={s.state_slug}
              href={`/hindupopulation/${s.state_slug}`}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-blue-400 hover:text-blue-600"
            >
              {s.state}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4 w-full text-sm text-slate-500">
          No Hindu population data has been uploaded yet. Add states from the
          admin dashboard to populate this page.
        </p>
      )}
    </main>
  );
}
// deepak end - new file
