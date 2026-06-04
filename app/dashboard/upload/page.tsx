"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

type UploadStats = {
  total: number;
  success: number;
  failed: number;
  skipped: number;
};

type LogEntry = {
  index: number;
  name: string;
  status: "success" | "error" | "skipped";
  message: string;
};

const SCHEMA_FIELDS: Record<string, string[]> = {
  "/api/states": [
    "state_id",
    "state",
    "state_slug",
    "country",
    "census_year",
    "total_districts",
    "total_tehsils",
    "total_villages",
    "number_of_households",
    "total_population",
    "total_population_males",
    "total_population_females",
    "sex_ratio_percent",
    "population_0_6_years_total",
    "population_0_6_years_males",
    "population_0_6_years_females",
    "scheduled_caste_population_total",
    "scheduled_caste_population_males",
    "scheduled_caste_population_females",
    "scheduled_tribe_population_total",
    "scheduled_tribe_population_males",
    "scheduled_tribe_population_females",
    "scheduled_caste_population_total_percent",
    "scheduled_tribe_population_total_percent",
    "hindu_population",
    "muslim_population",
    "christian_population",
    "sikh_population",
    "jain_population",
    "buddhist_population",
    "hindu_population_percent",
    "muslim_population_percent",
    "christian_population_percent",
    "sikh_population_percent",
    "jain_population_percent",
    "Buddhist_population_percent",
    "literates_total",
    "literates_males",
    "literates_females",
    "literates_total_percent",
    "literates_males_percent",
    "literates_females_percent",
    "total_workers",
    "total_workers_males",
    "total_workers_females",
    "total_workers_percent",
    "total_workers_males_percent",
    "total_workers_females_percent",
    "capital",
    "high_court",
    "total_area_sq_km",
    "seo_title",
    "seo_description",
  ],
  "/api/districts": [
    "district_id",
    "district",
    "district_slug",
    "state",
    "state_slug",
    "country",
    "census_year",
    "total_tehsils",
    "total_villages",
    "number_of_households",
    "total_population",
    "total_population_males",
    "total_population_females",
    "sex_ratio_percent",
    "population_0_6_years_total",
    "population_0_6_years_males",
    "population_0_6_years_females",
    "scheduled_caste_population_total",
    "scheduled_caste_population_males",
    "scheduled_caste_population_females",
    "scheduled_tribe_population_total",
    "scheduled_tribe_population_males",
    "scheduled_tribe_population_females",
    "scheduled_caste_population_total_percent",
    "scheduled_tribe_population_total_percent",
    "hindu_population",
    "muslim_population",
    "christian_population",
    "sikh_population",
    "jain_population",
    "buddhist_population",
    "hindu_population_percent",
    "muslim_population_percent",
    "christian_population_percent",
    "sikh_population_percent",
    "jain_population_percent",
    "buddhist_population_percent",
    "literates_total",
    "literates_males",
    "literates_females",
    "literates_total_percent",
    "literates_males_percent",
    "literates_females_percent",
    "total_workers",
    "total_workers_males",
    "total_workers_females",
    "total_workers_percent",
    "total_workers_males_percent",
    "total_workers_females_percent",
    "total_area_sq_km",
    "nearest_railway_station",
    "nearest_airport",
    "seo_title",
    "seo_description",
    "latitude",
    "longitude",
  ],
  "/api/tehsil": [
    "tehsil_id",
    "tehsil",
    "tehsil_slug",
    "district",
    "district_slug",
    "state",
    "state_slug",
    "country",
    "census_year",
    "total_villages",
    "number_of_households",
    "total_population",
    "total_population_males",
    "total_population_females",
    "sex_ratio_percent",
    "population_0_6_years_total",
    "population_0_6_years_males",
    "population_0_6_years_females",
    "scheduled_caste_population_total",
    "scheduled_caste_population_males",
    "scheduled_caste_population_females",
    "scheduled_tribe_population_total",
    "scheduled_tribe_population_males",
    "scheduled_tribe_population_females",
    "scheduled_caste_population_total_percent",
    "scheduled_tribe_population_total_percent",
    "literates_total",
    "literates_males",
    "literates_females",
    "literates_total_percent",
    "literates_males_percent",
    "literates_females_percent",
    "total_workers",
    "total_workers_males",
    "total_workers_females",
    "total_workers_percent",
    "total_workers_males_percent",
    "total_workers_females_percent",
    "total_area_sq_km",
    "seo_title",
    "seo_description",
  ],
  "/api/village": [
    "village_id",
    "village",
    "village_slug",
    "tehsil",
    "tehsil_slug",
    "district",
    "district_slug",
    "state",
    "state_slug",
    "country",
    "census_year",
    "pin_code",
    "number_of_households",
    "total_population",
    "total_population_males",
    "total_population_females",
    "sex_ratio_percent",
    "population_0_6_years_total",
    "population_0_6_years_males",
    "population_0_6_years_females",
    "scheduled_caste_population_total",
    "scheduled_caste_population_males",
    "scheduled_caste_population_females",
    "scheduled_tribe_population_total",
    "scheduled_tribe_population_males",
    "scheduled_tribe_population_females",
    "scheduled_caste_population_total_percent",
    "scheduled_tribe_population_total_percent",
    "literates_total",
    "literates_males",
    "literates_females",
    "literates_total_percent",
    "literates_males_percent",
    "literates_females_percent",
    "total_workers",
    "total_workers_males",
    "total_workers_females",
    "total_workers_percent",
    "total_workers_males_percent",
    "total_workers_females_percent",
    "total_area_sq_km",
    "education_facilities",
    "medical_facilities",
    "drinking_water_facilities",
    "bank_facilities",
    "nearest_town",
    "main_occupation",
    "latitude",
    "longitude",
    "seo_title",
    "seo_description",
  ],
};

const ENDPOINTS = [
  { label: "States", value: "/api/states", downloadParam: "all=true" },
  { label: "Districts", value: "/api/districts", downloadParam: "all=true" },
  { label: "Tehsils", value: "/api/tehsil", downloadParam: "all=true" },
  { label: "Villages", value: "/api/village", downloadParam: "all=true" },
];

const DOWNLOAD_ENDPOINTS = [
  { label: "States", value: "/api/download/states", downloadParam: "all=true" },
  {
    label: "Districts",
    value: "/api/download/districts",
    downloadParam: "all=true",
  },
  {
    label: "Tehsils",
    value: "/api/download/tehsil",
    downloadParam: "all=true",
  },
  {
    label: "Villages",
    value: "/api/download/village",
    downloadParam: "all=true",
  },
];

const ENDPOINT_LABELS: Record<string, string> = {
  "/api/states": "States",
  "/api/districts": "Districts",
  "/api/tehsil": "Tehsils",
  "/api/village": "Villages",
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [apiEndpoint, setApiEndpoint] = useState("/api/village");
  const [activeTab, setActiveTab] = useState<"upload" | "download">("upload");

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

      // Try to extract array from common response shapes
      let records: Record<string, unknown>[] = [];
      if (Array.isArray(data)) records = data;
      else if (data?.allVillages) records = data.allVillages;
      else if (data?.allDistricts) records = data.allDistricts;
      else if (data?.allStates) records = data.allStates;
      else if (data?.allTehsils) records = data.allTehsils;
      else if (data?.data) records = data.data;
      else {
        // Try first array value in response
        const arrayVal = Object.values(data).find((v) => Array.isArray(v));
        if (arrayVal) records = arrayVal as Record<string, unknown>[];
      }

      if (!records.length) throw new Error("No records found in response");

      // Remove MongoDB internal fields
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
      XLSX.utils.book_append_sheet(workbook, worksheet, label);

      const date = new Date().toISOString().split("T")[0];
      XLSX.writeFile(workbook, `${label.toLowerCase()}_${date}.xlsx`);
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
    setStats({ total: 0, success: 0, failed: 0, skipped: 0 });
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
      console.log(excelColumns);
      const schemaColumns = SCHEMA_FIELDS[apiEndpoint] || [];
      const unknownColumns = excelColumns.filter(
        (col) => !schemaColumns.includes(col),
      );

      if (unknownColumns.length > 0) {
        const proceed = window.confirm(
          `⚠️ Unknown columns detected:\n\n${unknownColumns.join(", ")}\n\nThese will be filtered out. Continue?`,
        );
        if (!proceed) {
          setUploading(false);
          return;
        }
      }

      const total = jsonData.length;
      let success = 0,
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

        const rowName = (row.village_name ||
          row.district ||
          row.state ||
          row.block_tehsil ||
          `Row ${i + 2}`) as string;

        try {
          const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filteredRow),
          });

          if (response.ok) {
            success++;
            newLogs.push({
              index: i + 2,
              name: rowName,
              status: "success",
              message: "Inserted successfully",
            });
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

        setStats({ total, success, failed, skipped });
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
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">
              MongoDB Data Manager
            </h1>
            <p className="mt-1 text-sm text-blue-100">
              Upload & download Excel data from your database
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === "upload"
                  ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              ⬆️ Upload Excel
            </button>
            <button
              onClick={() => setActiveTab("download")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === "download"
                  ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              ⬇️ Download Excel
            </button>
          </div>

          <div className="p-8">
            {/* UPLOAD TAB */}
            {activeTab === "upload" && (
              <div>
                {/* API Endpoint Selector */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Select Collection
                  </label>
                  <select
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    disabled={uploading}
                  >
                    {ENDPOINTS.map((ep) => (
                      <option key={ep.value} value={ep.value}>
                        {ep.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Input */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Excel File (.xlsx)
                  </label>
                  <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-400">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      <div className="mb-2 text-4xl">📂</div>
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

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className={`w-full rounded-xl px-4 py-3 font-semibold transition-all ${
                    !file || uploading
                      ? "cursor-not-allowed bg-gray-200 text-gray-400"
                      : "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg"
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Uploading to{" "}
                      {ENDPOINT_LABELS[apiEndpoint]}...
                    </span>
                  ) : (
                    `Upload to ${ENDPOINT_LABELS[apiEndpoint]}`
                  )}
                </button>

                {/* Stats */}
                {stats && (
                  <div className="mt-6 grid grid-cols-4 gap-3">
                    {[
                      { label: "Total", value: stats.total, color: "gray" },
                      {
                        label: "Success",
                        value: stats.success,
                        color: "green",
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

                {/* Logs */}
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
                                : "border border-red-100 bg-red-50 text-red-800"
                          }`}
                        >
                          <span className="font-semibold">
                            Row {log.index}:
                          </span>{" "}
                          {log.name} —{" "}
                          <span className="italic">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DOWNLOAD TAB */}
            {activeTab === "download" && (
              <div>
                <p className="mb-6 text-sm text-gray-500">
                  Download all records from a collection as an Excel file.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {DOWNLOAD_ENDPOINTS.map((ep) => (
                    <button
                      key={ep.value}
                      onClick={() => handleDownload(ep.value, ep.label)}
                      disabled={downloading !== null}
                      className={`flex items-center justify-between rounded-xl border-2 p-5 text-left transition-all ${
                        downloading === ep.value
                          ? "cursor-wait border-blue-300 bg-blue-50"
                          : downloading !== null
                            ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
                            : "cursor-pointer border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md"
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
                          <span className="inline-block animate-spin">⏳</span>
                        ) : (
                          "⬇️"
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  <strong>Note:</strong> Downloads fetch all records from the
                  database. Large collections (e.g. villages) may take a moment.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
