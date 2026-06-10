import DashboardCalendarControls from "@/src/app/admin/[id]/components/CalendarControls";
import RecentActivityLogs from "@/src/app/admin/[id]/components/Logs";
import GenerateReportAction from "@/src/app/admin/[id]/components/Report";
import Revenue from "@/src/app/admin/[id]/components/Revenue";
import { canShowAdmin } from "@/src/lib/canUser";
import LowStockCard from "./components/StockAlerts";
import Trend from "@/src/app/admin/[id]/components/Trend";
import { getTrendData } from "@/src/lib/trend";
import { prisma } from "@/src/lib/prisma";
import { getStoreCurrency } from "@/src/lib/data/store";

export default async function AdminDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ period?: string; date?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const store_id = resolvedParams.id;

  const store = await prisma.store.findUnique({
    where: { id: store_id },
    select: { settings: true },
  });

  if (!store) {
    return <div>Store not found.</div>;
  }

  const threshold = store.settings.low_stock_threshold;

  const products = await prisma.product.findMany({
    where: {
      store_id: store_id,
      quantity: { lte: threshold },
      is_deleted: false,
    },
    select: {
      name: true,
      quantity: true,
    },
  });

  const lowStockItems = products.map((product) => ({
    name: product.name,
    qty: product.quantity,
  }));

  const canShowLowStock = await canShowAdmin(store_id, "low_stock");
  const canShowTrend = await canShowAdmin(store_id, "trend");

  // Conditionally fetch trend data ONLY if the admin is allowed to see it
  const trendPayload = canShowTrend
    ? await getTrendData(store_id, resolvedSearchParams)
    : null;

  const currencyResult = await getStoreCurrency(store_id);
  const currency = currencyResult.success
    ? (currencyResult.data as string)
    : "PHP";

  return (
    <div className="space-y-6">
      <DashboardCalendarControls />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GenerateReportAction
          store_id={store_id}
          searchParams={resolvedSearchParams}
        />

        <RecentActivityLogs store_id={store_id} />

        <Revenue store_id={store_id} searchParams={resolvedSearchParams} />

        {canShowLowStock ? (
          <LowStockCard store_id={store_id} lowStockItems={lowStockItems} />
        ) : null}
      </div>

      {canShowTrend && trendPayload ? (
        <Trend
          data={trendPayload.chartData}
          totalRevenue={trendPayload.totalRevenue}
          currency={currency}
        />
      ) : null}
    </div>
  );
}
