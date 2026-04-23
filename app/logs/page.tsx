import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UndoButton from "./undo-button";
import PaginationControls from "@/components/PaginationControls";

export default async function ActivityLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  const storeId = (session?.user as any)?.store_id;

  if (!session || !storeId) {
    redirect("/");
  }

  // --- Pagination Setup ---
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  // Fetch logs and total count in parallel
  const [logs, totalCount] = await Promise.all([
    prisma.activityLog.findMany({
      where: { store_id: storeId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
    }),
    prisma.activityLog.count({
      where: { store_id: storeId },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  if (logs.length < 1 && currentPage === 1) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Store Activity Logs</h1>
        <div className="p-12 border-2 border-dashed rounded-lg bg-gray-50">
          <p className="text-gray-500 italic">
            There are no logs related to this store.
          </p>
        </div>
      </div>
    );
  }

  // Fetch products associated with these specific logs
  const productIds = logs.map((log) => log.doc_id);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      store_id: storeId,
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Store Activity Logs</h1>
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold">Date/Time</th>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">Action</th>
              <th className="p-4 font-semibold">Changes Detected</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const currentProduct = productMap.get(log.doc_id);
              const changes = getDiff(log.prev_state as any, currentProduct);

              const isComplete = !!(log.user && currentProduct);
              const hasDiff = changes && changes.length > 0;
              const canUndo = isComplete && log.action !== "CREATE" && hasDiff;

              return (
                <tr
                  key={log.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 whitespace-nowrap text-sm">
                    {log.createdAt.toLocaleString()}
                  </td>
                  <td className="p-4">
                    {log.user?.name ?? (
                      <span className="text-red-400 italic">Missing User</span>
                    )}
                  </td>
                  <td className="p-4 font-medium">
                    {currentProduct?.name ?? (
                      <span className="text-red-400 italic">
                        Missing Product
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {renderChanges(changes)}
                  </td>
                  <td className="p-4 text-center">
                    {canUndo ? (
                      <UndoButton logId={log.id} />
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        {log.action === "CREATE"
                          ? "Initial Entry"
                          : "No changes to revert"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Added Pagination Controls */}
      <div className="mt-6">
        <PaginationControls total={totalPages} current={currentPage} />
      </div>
    </div>
  );
}

// Helper functions remain the same
function getDiff(prev: any, current: any) {
  if (!prev || !current) return null;
  const diffs: string[] = [];
  const ignoreFields = ["id", "_id", "updatedAt", "createdAt", "store_id"];

  for (const key in prev) {
    if (ignoreFields.includes(key)) continue;
    if (key in current && prev[key] !== current[key]) {
      diffs.push(`${key}: ${prev[key]} → ${current[key]}`);
    }
  }
  return diffs;
}

function renderChanges(changes: string[] | null) {
  if (!changes || changes.length === 0)
    return <span className="text-gray-400">No changes detected</span>;
  return (
    <ul className="list-disc list-inside space-y-1">
      {changes.map((change, i) => (
        <li key={i}>{change}</li>
      ))}
    </ul>
  );
}
