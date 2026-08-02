import { HOST } from "@/lib/constants/constants";
import { getStates } from "@/utils/common";
import { MetadataRoute } from "next";

export const revalidate = 3600;

interface State {
  _id: string;
  state: string;
  state_slug: string;
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const states = await getStates();
// deepak start - old code (replaced below):
      // const stateUrls: MetadataRoute.Sitemap = states.map((state: State) => ({
      // deepak end - old code
      // deepak start - new code: guard against getStates() returning a non-array
      // error object (e.g. on transient DB failure) so the build doesn't crash
      const statesList = Array.isArray(states) ? states : [];
      const stateUrls: MetadataRoute.Sitemap = statesList.map((state: State) => ({
            // deepak end - new code
        url: `${HOST}/${state?.state_slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  }));

  return [
    {
      url: HOST,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...stateUrls,
  ];
}
