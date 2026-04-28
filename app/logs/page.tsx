import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ActivityLogTable from "@/components/ActivityLogTable";
import PaginationWrapper from "@/components/PaginationWrapper";
import TableSkeleton from "@/components/TableSkeleton";

export default async function ActivityLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  const storeId = (session?.user as any)?.store_id;

  if (!session || !storeId) redirect("/login");

  const params = await searchParams;
  const page = Number(params.page) || 1;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Store Activity Logs</h1>

      <Suspense
        key={`page-content-${page}`}
        fallback={
          <div className="space-y-6">
            <TableSkeleton />
            <div className="h-10 w-full animate-pulse bg-gray-100 rounded" />
          </div>
        }
      >
        <ActivityLogTable storeId={storeId} page={page} />

        <div className="mt-6">
          <PaginationWrapper type="logs" storeId={storeId} currentPage={page} />
        </div>
      </Suspense>
    </div>
  );
}
