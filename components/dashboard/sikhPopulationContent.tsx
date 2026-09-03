// deepak start - new file: Sikh Population feature (admin content manager)
// Mirrors components/dashboard/content.tsx but scoped to the three Sikh
// Population page levels (Home/State/District) and pointed at the separate
// getSikhPopulationContent/saveSikhPopulationContent + getSikhPopulationStates/
// getSikhPopulationDistricts helpers, so it never touches the main site's
// Content collection or States/Districts collection.
"use client";
import { useState, useEffect } from "react";
import {
  getSikhPopulationContent,
  saveSikhPopulationContent,
  getSikhPopulationStates,
  getSikhPopulationDistricts,
} from "@/utils/common";

const TABS = ["Home", "State", "District"];

const initialFormState = {
  title: "",
  description: "",
  top_content: "",
  bottom_content: "",
  blog_content: "",
};

type FormField = keyof typeof initialFormState;

type StateItem = { state: string; state_slug: string };
type DistrictItem = { district: string; district_slug: string };

const FIELDS: { name: FormField; label: string; type: string }[] = [
  { name: "title", label: "Title", type: "input" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "top_content", label: "Top Content", type: "textarea" },
  { name: "bottom_content", label: "Bottom Content", type: "textarea" },
  { name: "blog_content", label: "Blog Content", type: "textarea" },
];

function parseFormData(data: any) {
  return {
    title: data.title ?? "",
    description: data.description ?? "",
    top_content: data.top_content ?? "",
    bottom_content: data.bottom_content ?? "",
    blog_content:
      typeof data.blog_content === "object" && data.blog_content !== null
        ? JSON.stringify(data.blog_content, null, 2)
        : (data.blog_content ?? ""),
  };
}

function SikhPopulationContentPage() {
  const [activeTab, setActiveTab] = useState("Home");
  const [forms, setForms] = useState(
    Object.fromEntries(TABS.map((tab) => [tab, { ...initialFormState }])),
  );
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState("");

  // ── selection state ──
  const [states, setStates] = useState<StateItem[]>([]);
  const [districts, setDistricts] = useState<DistrictItem[]>([]);

  const [selectedState, setSelectedState] = useState<StateItem | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictItem | null>(
    null,
  );

  const [statesLoading, setStatesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  // ── reset only deeper selections on tab change ──
  useEffect(() => {
    if (activeTab === "Home") {
      setSelectedState(null);
      setSelectedDistrict(null);
      setDistricts([]);
    } else if (activeTab === "State") {
      setSelectedDistrict(null);
      setDistricts([]);
    }
    // District — keep state/district selections intact
    setSuccess("");
  }, [activeTab]);

  // ── fetch states list ──
  useEffect(() => {
    if (!["State", "District"].includes(activeTab)) return;
    setStatesLoading(true);
    getSikhPopulationStates()
      .then((data) => setStates(Array.isArray(data) ? data : []))
      .catch(() => setStates([]))
      .finally(() => setStatesLoading(false));
  }, [activeTab]);

  // ── fetch districts when state selected ──
  useEffect(() => {
    if (!selectedState || activeTab !== "District") return;
    setSelectedDistrict(null);
    setDistricts([]);
    setDistrictsLoading(true);
    getSikhPopulationDistricts({ state_slug: selectedState.state_slug })
      .then((data) => setDistricts(Array.isArray(data) ? data : []))
      .catch(() => setDistricts([]))
      .finally(() => setDistrictsLoading(false));
  }, [selectedState, activeTab]);

  // ── fetch Home content ──
  useEffect(() => {
    if (activeTab !== "Home") return;
    fetchAndSetContent("Home", {});
  }, [activeTab]);

  // ── fetch State content when state selected ──
  useEffect(() => {
    if (activeTab !== "State" || !selectedState) return;
    fetchAndSetContent("State", { state_slug: selectedState.state_slug });
  }, [selectedState, activeTab]);

  // ── fetch District content when district selected ──
  useEffect(() => {
    if (activeTab !== "District" || !selectedState || !selectedDistrict) return;
    fetchAndSetContent("District", {
      state_slug: selectedState.state_slug,
      district_slug: selectedDistrict.district_slug,
    });
  }, [selectedDistrict, activeTab]);

  async function fetchAndSetContent(
    tab: string,
    params: Record<string, string>,
  ) {
    setFetching(true);
    setSuccess("");
    try {
      const data = await getSikhPopulationContent(tab, params);
      if (data?.error) {
        setForms((prev) => ({ ...prev, [tab]: { ...initialFormState } }));
        return;
      }
      setForms((prev) => ({ ...prev, [tab]: parseFormData(data) }));
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setFetching(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForms((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [name]: value },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const slugParams: Record<string, string> = {};
      if (selectedState) slugParams.state_slug = selectedState.state_slug;
      if (selectedDistrict)
        slugParams.district_slug = selectedDistrict.district_slug;

      const result = await saveSikhPopulationContent(
        activeTab,
        forms[activeTab],
        slugParams,
      );

      if (result?.error) {
        setSuccess(`Failed to save: ${result.error}`);
        return;
      }
      setSuccess("Saved successfully!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to save.";
      setSuccess(`Failed to save: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  const editingLabel =
    activeTab === "District"
      ? selectedDistrict?.district
      : activeTab === "State"
        ? selectedState?.state
        : "Home";

  const showForm =
    activeTab === "Home" ||
    (activeTab === "State" && !!selectedState) ||
    (activeTab === "District" && !!selectedDistrict);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">
        Sikh Population Content Manager
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        Manage the wording shown on the Sikh Population pages (
        <code>/sikhpopulation</code>, state and district pages). Separate from
        the main Content Manager.
      </p>

      {/* Tabs */}
      <div className="mb-6 flex border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`-mb-px cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cascading selectors */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* State */}
        {["State", "District"].includes(activeTab) && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">State</label>
            {statesLoading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              <select
                className="w-52 rounded border p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                value={selectedState?.state_slug ?? ""}
                onChange={(e) => {
                  setSelectedState(
                    states.find((s) => s.state_slug === e.target.value) ?? null,
                  );
                  setSuccess("");
                }}
              >
                <option value="">-- Select State --</option>
                {states.map((s) => (
                  <option key={s.state_slug} value={s.state_slug}>
                    {s.state}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* District */}
        {activeTab === "District" && selectedState && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              District
            </label>
            {districtsLoading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              <select
                className="w-52 rounded border p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                value={selectedDistrict?.district_slug ?? ""}
                onChange={(e) => {
                  setSelectedDistrict(
                    districts.find((d) => d.district_slug === e.target.value) ??
                      null,
                  );
                  setSuccess("");
                }}
              >
                <option value="">-- Select District --</option>
                {districts.map((d) => (
                  <option key={d.district_slug} value={d.district_slug}>
                    {d.district}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fetching ? (
            <p className="text-sm text-gray-400">Loading content...</p>
          ) : (
            <>
              {activeTab !== "Home" && (
                <p className="text-sm font-medium text-orange-600">
                  Editing: {editingLabel}
                </p>
              )}

              {FIELDS.map(({ name, label, type }) => (
                <div key={name} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    {label}
                    {name === "blog_content" && (
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        (JSON)
                      </span>
                    )}
                    {(name === "top_content" || name === "bottom_content") && (
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        (HTML)
                      </span>
                    )}
                  </label>
                  {type === "input" ? (
                    <input
                      name={name}
                      value={forms[activeTab][name]}
                      onChange={handleChange}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className="rounded border p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  ) : (
                    <textarea
                      name={name}
                      value={forms[activeTab][name]}
                      onChange={handleChange}
                      rows={name === "blog_content" ? 6 : 4}
                      placeholder={
                        name === "blog_content"
                          ? `{ "key": "value" }`
                          : name === "top_content" || name === "bottom_content"
                            ? `<p>Enter HTML content</p>`
                            : `Enter ${label.toLowerCase()}`
                      }
                      className="resize-y rounded border p-2 font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  )}
                </div>
              ))}

              {success && (
                <p
                  className={`text-sm ${
                    success.includes("Failed") || success.includes("Invalid")
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || fetching}
                className="w-fit rounded bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : `Save ${editingLabel} Content`}
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}

export default SikhPopulationContentPage;
// deepak end - new file
