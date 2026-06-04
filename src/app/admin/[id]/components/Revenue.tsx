import { getRevenueStats } from "@/src/lib/revenue-utils";
import { canShowAdmin } from "@/src/lib/canUser";

export default async function Revenue({
  store_id,
  searchParams,
}: {
  store_id: string;
  searchParams: { period?: string; date?: string };
}) {
  const canShowRevenue = await canShowAdmin(store_id, "revenue");

  if (!canShowRevenue) {
    return null;
  }
  const { currentRev, percentageChange } = await getRevenueStats(searchParams);

  // Format the currency nicely for the UI
  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(currentRev);

  // Determine the correct text color based on the 3 states
  const colorClass =
    percentageChange === 0
      ? "text-gray-500"
      : percentageChange > 0
        ? "text-green-500"
        : "text-red-500";

  return (
    <div className="p-6 border rounded-lg shadow-sm max-w-sm">
      <h2 className="text-gray-500 text-sm font-medium">Total Revenue</h2>
      <div className="flex items-end gap-2 mt-2">
        <span className="text-3xl font-bold">{formattedRevenue}</span>

        {/* Dynamic styling for Positive, Negative, and Neutral performance */}
        <span className={`text-sm font-medium mb-1 ${colorClass}`}>
          {percentageChange > 0 ? "+" : ""}
          {percentageChange}%
        </span>
      </div>
    </div>
  );
}
