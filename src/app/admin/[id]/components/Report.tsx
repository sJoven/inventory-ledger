import Link from "next/link";
import { canShowAdmin } from "@/src/lib/canUser";
import { subDays, format } from "date-fns";

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
  const canGenerate = await canShowAdmin(store_id, "report");

  if (!canGenerate) {
    return null;
  }

  const period =
    searchParams?.period &&
    ["day", "week", "month"].includes(searchParams.period)
      ? searchParams.period
      : "week";

  const threeDaysAgo = subDays(new Date(), 3);
  const startDateStr = format(threeDaysAgo, "yyyy-MM-dd");
  const date =
    searchParams?.date || new Date(startDateStr).toISOString().split("T")[0];

  const queryString = new URLSearchParams({
    period,
    date,
  }).toString();

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
      <div>
        <h3 className="text-base font-semibold text-gray-900">
          Generate Report
        </h3>
        <p className="text-sm text-gray-500">
          Export a PDF summary for this {period}.
        </p>
      </div>

      <Link
        href={`/admin/${store_id}/generate-report?${queryString}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-[#fc6022] text-white text-sm font-medium rounded-lg hover:bg-[#e0551d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#fc6022]"
      >
        Export PDF
      </Link>
    </div>
  );
}
