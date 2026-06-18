import { getRevenueStats } from "@/src/lib/revenue-utils";
import { canShowAdmin } from "@/src/lib/canUser";
import { getStoreCurrency } from "@/src/lib/data/store";

export default async function Revenue({
  store_id,
  searchParams,
}: {
  store_id: string;
  searchParams: { period?: string; date?: string };
}) {
  const canShowRevenue = await canShowAdmin(store_id, "revenue");
  const currencyResult = await getStoreCurrency(store_id);
  const currency = currencyResult.success ? currencyResult.data : "PHP";

  if (!canShowRevenue) {
    return null;
  }

  // Pass both the search parameters and the specific storeId to the utility function
  const { currentRev, percentageChange } = await getRevenueStats({
    ...searchParams,
    storeId: store_id,
  });

  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(currentRev);

  const colorClass =
    percentageChange === 0
      ? "text-gray-500"
      : percentageChange > 0
        ? "text-green-500"
        : "text-red-500";
  return (
    <div className="p-6 w-full">
      <h2 className="text-gray-500 text-sm font-medium">Total Revenue</h2>
      <div className="flex items-end gap-2 mt-2">
        <span className="text-3xl font-bold">{formattedRevenue}</span>
        <span className={`text-sm font-medium mb-1 ${colorClass}`}>
          {percentageChange > 0 ? "+" : ""}
          {percentageChange}%
        </span>
      </div>
    </div>
  );
}
