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
import { isLoggedIn } from "@/src/lib/isLoggedIn";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ period?: string; date?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const session = await isLoggedIn();
  const store_id = resolvedParams.id;

  const canShowDashboard = await canShowAdmin(store_id, "dashboard");

  if (canShowDashboard.status !== 200) {
    redirect("/admin");
  }

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
  const canShowReport = await canShowAdmin(store_id, "report");
  const canShowLogs = await canShowAdmin(store_id, "logs");
  const canShowRevenue = await canShowAdmin(store_id, "revenue");

  // Conditionally fetch trend data ONLY if the admin is allowed to see it
  const trendPayload = canShowTrend
    ? await getTrendData(store_id, resolvedSearchParams)
    : null;

  const currencyResult = await getStoreCurrency(store_id);
  const currency = currencyResult.success
    ? (currencyResult.data as string)
    : "PHP";

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Row 1: Calendar and Print Action */}
      <div className="grid grid-cols-[1fr,auto] items-center gap-4">
        <DashboardCalendarControls />
        {canShowReport.status === 200 && (
          <GenerateReportAction
            store_id={store_id}
            searchParams={resolvedSearchParams}
          />
        )}
      </div>

      {/* Row 2: Revenue and Low Stock (Side-by-side on desktop, stacked on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {canShowRevenue.status === 200 && (
          <Revenue store_id={store_id} searchParams={resolvedSearchParams} />
        )}
        {canShowLowStock.status === 200 && (
          <LowStockCard store_id={store_id} lowStockItems={lowStockItems} />
        )}
      </div>

      {/* Row 3: Trend Chart (Full width) */}
      {canShowTrend.status === 200 && trendPayload && (
        <div className="w-full">
          <Trend
            data={trendPayload.chartData}
            totalRevenue={trendPayload.totalRevenue}
            currency={currency}
          />
        </div>
      )}

      {/* Row 4: Recent Activity Logs (Full width) */}
      {canShowLogs.status === 200 && (
        <div className="w-full">
          <RecentActivityLogs store_id={store_id} />
        </div>
      )}
    </div>
  );
}
