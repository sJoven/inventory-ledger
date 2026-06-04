import Link from "next/link";
import { canShowAdmin } from "@/src/lib/canUser";

interface GenerateReportProps {
  store_id: string;
  searchParams?: {
    period?: string;
    date?: string;
  };
}

export default async function GenerateReportAction({
  store_id,
  searchParams,
}: GenerateReportProps) {
  // 1. Check Manager+ permissions
  const canGenerate = await canShowAdmin(store_id, "report");

  if (!canGenerate) {
    return null; // Hide the button entirely if they don't have permission
  }

  // 2. Safely extract and validate URL parameters
  const period =
    searchParams?.period &&
    ["day", "week", "month"].includes(searchParams.period)
      ? searchParams.period
      : "month";

  const date = searchParams?.date || new Date().toISOString().split("T")[0];

  // 3. Construct the query string (removed store_id from here)
  const queryString = new URLSearchParams({
    period,
    date,
  }).toString();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
      <div>
        <h3 className="text-base font-semibold text-gray-900">
          Generate Report
        </h3>
        <p className="text-sm text-gray-500">
          Export a PDF summary for this {period}.
        </p>
      </div>

      {/* 4. Opens in a new tab with the clean path + query string */}
      <Link
        href={`/admin/${store_id}/generate-report?${queryString}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Export PDF
      </Link>
    </div>
  );
}
