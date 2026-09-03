"use client";

// deepak start - new file: Christian Population feature admin uploader.
// Same upload/download pattern as app/dashboard/upload/page.tsx, but scoped
// to the two new /api/christian-population/* endpoints and their exact Excel
// column sets (states_20260815.xlsx / district.xlsx). Fully separate from
// the existing States/Districts/Tehsils/Villages uploader.
import { useState } from "react";
import * as XLSX from "xlsx";
// deepak start - new code: Content tab (manage page wording for
// home/state/district), separate from the Excel upload/download tabs above.
import ChristianPopulationContentPage from "@/components/dashboard/christianPopulationContent";
// deepak end - new code

type UploadStats = {
  total: number;
  success: number;
  updated: number;
  failed: number;
  skipped: number;
};

type LogEntry = {
  index: number;
  name: string;
  status: "success" | "updated" | "error" | "skipped";
  message: string;
};

const SCHEMA_FIELDS: Record<string, string[]> = {
  "/api/christian-population/states": [
    "state_id",
    "capital",
    "census_year",
    "country",
    "christian_population",
    "christian_population_percent",
    "seo_title",
    "christian_sex_ratio_percent",
    "state",
    "state_slug",
    "total_area_sq_km",
    "total_districts",
    "total_population",
    "total_population_christian_females",
    "total_population_christian_males",
    "seo_description",
    "urban_christian_population",
    "rural_christian_population",
    "urban_christian_population_percenatge",
    "rural_christian_population_percentage",
  ],
  "/api/christian-population/districts": [
    "state_id",
    "capital",
    "census_year",
    "country",
    "christian_population",
    "christian_population_percent",
    "seo_title",
    "christian_sex_ratio_percent",
    "state",
    "state_slug",
    "total_area_sq_km",
    "total_population",
    "total_population_christian_females",
    "total_population_christian_males",
    "seo_description",
    "urban_christian_population",
    "rural_christian_population",
    "urban_christian_population_percenatge",
    "rural_christian_population_percentage",
    "district",
    "district_slug",
  ],
};

const ENDPOINTS = [
  {
    label: "Christian Population â States",
    value: "/api/christian-population/states",
  },
  {
    label: "Christian Population â Districts",
    value: "/api/christian-population/districts",
  },
];

const DOWNLOAD_ENDPOINTS = [
  {
    label: "Christian Population â States",
    value: "/api/christian-population/states",
  },
  {
    label: "Christian Population â Districts",
    value: "/api/christian-population/districts",
  },
];

const ENDPOINT_LABELS: Record<string, string> = {
  "/api/christian-population/states": "Christian Population â States",
  "/api/christian-population/districts": "Christian Population â Districts",
};

export default function ChristianPopulationUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [apiEndpoint, setApiEndpoint] = useState(
    "/api/christian-population/states",
  );
  const [activeTab, setActiveTab] = useState<"upload" | "download" | "content">(
    "upload",
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStats(null);
      setLogs([]);
    }
  };

  const handleDownload = async (endpoint: string, label: string) => {
    setDownloading(endpoint);
    try {
      const res = await fetch(`${endpoint}?all=true`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();

      let records: Record<string, unknown>[] = [];
      if (Array.isArray(data)) records = data;
      else if (data?.allStates) records = data.allStates;
      else if (data?.allDistricts) records = data.allDistricts;
      else {
        const arrayVal = Object.values(data).find((v) => Array.isArray(v));
        if (arrayVal) records = arrayVal as Record<string, unknown>[];
      }

      if (!records.length) throw new Error("No records found in response");

      const cleaned = records.map((r) => {
        const { _id, __v, createdAt, updatedAt, ...rest } = r as Record<
          string,
          unknown
        >;
        void _id;
        void __v;
        void createdAt;
        void updatedAt;
        return rest;
      });

      const worksheet = XLSX.utils.json_to_sheet(cleaned);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, label.slice(0, 31));

      const date = new Date().toISOString().split("T")[0];
      XLSX.writeFile(
        workbook,
        `${label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${date}.xlsx`,
      );
    } catch (error) {
      alert(
        `Download failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setDownloading(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStats({ total: 0, success: 0, updated: 0, failed: 0, skipped: 0 });
    setLogs([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        alert("Excel file is empty!");
        setUploading(false);
        return;
      }

      const firstRow = jsonData[0] as Record<string, unknown>;
      const excelColumns = Object.keys(firstRow);
      const schemaColumns = SCHEMA_FIELDS[apiEndpoint] || [];
      const unknownColumns = excelColumns.filter(
        (col) => !schemaColumns.includes(col),
      );

      if (unknownColumns.length > 0) {
        const proceed = window.confirm(
          `â ï¸ Unknown columns detected:\n\n${unknownColumns.join(", ")}\n\nThese will be filtered out. Continue?`,
        );
        if (!proceed) {
          setUploading(false);
          return;
        }
      }

      const total = jsonData.length;
      let success = 0,
        updatedCount = 0,
        failed = 0,
        skipped = 0;
      const newLogs: LogEntry[] = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i] as Record<string, unknown>;
        const filteredRow = Object.keys(row)
          .filter((key) => schemaColumns.includes(key))
          .reduce(
            (obj, key) => {
              obj[key] = row[key];
              return obj;
            },
            {} as Record<string, unknown>,
          );

        const rowName = (row.district || row.state || `Row ${i + 2}`) as string;

        try {
          const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filteredRow),
          });

          if (response.ok) {
            // deepak start - new code: the API pre-checks whether this
            // state_slug/district_slug (or state_id) already existed
            // before upserting, and returns that as __wasUpdate. Log and
            // count "Updated" separately from a true new-insert "Success"
            // so the Upload Log accurately reflects what happened.
            const responseData = await response.json();
            if (responseData?.__wasUpdate) {
              updatedCount++;
              newLogs.push({
                index: i + 2,
                name: rowName,
                status: "updated",
                message: "Updated existing record",
              });
            } else {
              success++;
              newLogs.push({
                index: i + 2,
                name: rowName,
                status: "success",
                message: "Inserted successfully",
              });
            }
            // deepak end - new code
          } else {
            const errorData = await response.json();
            if (response.status === 409) {
              skipped++;
              newLogs.push({
                index: i + 2,
                name: rowName,
                status: "skipped",
                message: "Already exists (duplicate)",
              });
            } else {
              failed++;
              const errorMsg = errorData.details
                ? Array.isArray(errorData.details)
                  ? errorData.details.join(", ")
                  : JSON.stringify(errorData.details)
                : errorData.error || "Unknown error";
              newLogs.push({
                index: i + 2,
                name: rowName,
                status: "error",
                message: `${response.status}: ${errorMsg}`,
              });
            }
          }
        } catch (error) {
          failed++;
          newLogs.push({
            index: i + 2,
            name: rowName,
            status: "error",
            message: error instanceof Error ? error.message : "Network error",
          });
        }

        setStats({ total, success, updated: updatedCount, failed, skipped });
        setLogs([...newLogs]);
      }
    } catch (error) {
      alert(
        `Failed to read Excel file: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-8">
      {/* deepak: widen the container on the Content tab â the content form
          needs more room than the narrow upload/download card */}
      <div
        className={
          activeTab === "content" ? "mx-auto max-w-5xl" : "mx-auto max-w-4xl"
        }
      >
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="bg-linear-to-r from-orange-600 to-orange-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">
              Christian Population Data Manager
            </h1>
            <p className="mt-1 text-sm text-orange-100">
              Upload & download Christian Population Excel data, and manage page
              content. Separate from the main States/Districts dataset.
            </p>
          </div>

          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === "upload"
                  ? "border-b-2 border-orange-600 bg-orange-50 text-orange-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              â¬ï¸ Upload Excel
            </button>
            <button
              onClick={() => setActiveTab("download")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === "download"
                  ? "border-b-2 border-orange-600 bg-orange-50 text-orange-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              â¬ï¸ Download Excel
            </button>
            {/* deepak start - new code: Content tab button */}
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === "content"
                  ? "border-b-2 border-orange-600 bg-orange-50 text-orange-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              ð Content
            </button>
            {/* deepak end - new code */}
          </div>

          <div className="p-8">
            {activeTab === "upload" && (
              <div>
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Select Collection
                  </label>
                  <select
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                    disabled={uploading}
                  >
                    {ENDPOINTS.map((ep) => (
                      <option key={ep.value} value={ep.value}>
                        {ep.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Excel File (.xlsx)
                  </label>
                  <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-orange-400">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="hidden"
                      id="hp-file-input"
                    />
                    <label htmlFor="hp-file-input" className="cursor-pointer">
                      <div className="mb-2 text-4xl">ð</div>
                      {file ? (
                        <div>
                          <p className="font-semibold text-gray-800">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024)?.toFixed(1)} KB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-gray-600">
                            Click to select file
                          </p>
                          <p className="mt-1 text-sm text-gray-400">
                            Supports .xlsx and .xls
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className={`w-full rounded-xl px-4 py-3 font-semibold transition-all ${
                    !file || uploading
                      ? "cursor-not-allowed bg-gray-200 text-gray-400"
                      : "bg-orange-600 text-white shadow-md hover:bg-orange-700 hover:shadow-lg"
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">â³</span> Uploading to{" "}
                      {ENDPOINT_LABELS[apiEndpoint]}...
                    </span>
                  ) : (
                    `Upload to ${ENDPOINT_LABELS[apiEndpoint]}`
                  )}
                </button>

                {stats && (
                  <div className="mt-6 grid grid-cols-5 gap-3">
                    {[
                      { label: "Total", value: stats.total, color: "gray" },
                      {
                        label: "Success",
                        value: stats.success,
                        color: "green",
                      },
                      {
                        label: "Updated",
                        value: stats.updated,
                        color: "blue",
                      },
                      {
                        label: "Skipped",
                        value: stats.skipped,
                        color: "yellow",
                      },
                      { label: "Failed", value: stats.failed, color: "red" },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className={`bg-${color}-50 border border-${color}-100 rounded-xl p-4 text-center`}
                      >
                        <div className={`text-2xl font-bold text-${color}-700`}>
                          {value}
                        </div>
                        <div
                          className={`text-xs font-medium text-${color}-500 mt-0.5`}
                        >
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {logs.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-gray-700">
                        Upload Log
                      </h2>
                      <span className="text-xs text-gray-400">
                        {logs.length} entries
                      </span>
                    </div>
                    <div className="max-h-80 space-y-1.5 overflow-y-auto rounded-xl bg-gray-50 p-4">
                      {logs.map((log, idx) => (
                        <div
                          key={idx}
                          className={`rounded-lg p-2.5 text-xs ${
                            log.status === "success"
                              ? "border border-green-100 bg-green-50 text-green-800"
                              : log.status === "skipped"
                                ? "border border-yellow-100 bg-yellow-50 text-yellow-800"
                                : log.status === "updated"
                                  ? "border border-blue-100 bg-blue-50 text-blue-800"
                                  : "border border-red-100 bg-red-50 text-red-800"
                          }`}
                        >
                          <span className="font-semibold">
                            Row {log.index}:
                          </span>{" "}
                          {log.name} â{" "}
                          <span className="italic">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "download" && (
              <div>
                <p className="mb-6 text-sm text-gray-500">
                  Download all records from a Christian Population collection as
                  an Excel file.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {DOWNLOAD_ENDPOINTS.map((ep) => (
                    <button
                      key={ep.value}
                      onClick={() => handleDownload(ep.value, ep.label)}
                      disabled={downloading !== null}
                      className={`flex items-center justify-between rounded-xl border-2 p-5 text-left transition-all ${
                        downloading === ep.value
                          ? "cursor-wait border-orange-300 bg-orange-50"
                          : downloading !== null
                            ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
                            : "hover:bz-orange-50 cursor-pointer border-gray-200 hover:border-orange-400 hover:shadow-md"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {ep.label}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-400">
                          {ep.value}
                        </div>
                      </div>
                      <div className="text-2xl">
                        {downloading === ep.value ? (
                          <span className="inline-block animate-spin">â³</span>
                        ) : (
                          "â¬ï¸"
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  <strong>Note:</strong> Downloads fetch all records from the
                  Christian Population database. This is separate from the main
                  States/Districts dataset.
                </div>
              </div>
            )}

            {/* deepak start - new code: Content tab panel */}
            {activeTab === "content" && <ChristianPopulationContentPage />}
            {/* deepak end - new code */}
          </div>
        </div>
      </div>
    </div>
  );
}
// deepak end - new file
