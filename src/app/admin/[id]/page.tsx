import DashboardCalendarControls from "@/src/app/admin/[id]/components/CalendarControls";
import RecentActivityLogs from "@/src/app/admin/[id]/components/Logs";
import GenerateReportAction from "@/src/app/admin/[id]/components/Report";
import Revenue from "@/src/app/admin/[id]/components/Revenue";

export default async function AdminDashboardPage({
  params,
  searchParams, // <-- 1. Add searchParams here
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ period?: string; date?: string }>; // <-- Next 15+ types it as a Promise
}) {
  // 2. Await both promises (Next.js handles this efficiently)
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const store_id = resolvedParams.id;

  return (
    <div className="space-y-6">
      <DashboardCalendarControls />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pass the resolved searchParams down to the component */}
        <GenerateReportAction
          store_id={store_id}
          searchParams={resolvedSearchParams}
        />

        <RecentActivityLogs store_id={store_id} />

        <Revenue store_id={store_id} searchParams={resolvedSearchParams} />
      </div>
    </div>
  );
}
