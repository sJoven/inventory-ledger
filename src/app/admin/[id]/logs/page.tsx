import Link from "next/link";
import { getLogs } from "@/src/lib/data/log";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, History } from "lucide-react";
import { RevertButton } from "@/src/app/admin/[id]/logs/components/RevertBtn";
import { isLoggedIn } from "@/src/lib/isLoggedIn";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function LogsPage({ params, searchParams }: PageProps) {
  const session = await isLoggedIn();
  const { id: storeId } = await params;
  const { page } = await searchParams;

  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const logs = await getLogs(storeId, currentPage);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <History className="h-6 w-6 text-gray-500" />
            Store Activity Logs
          </h1>
          <p className="text-sm text-gray-500">
            Track and revert system changes for Store ID: {storeId}
          </p>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-600 tracking-wider">
              <tr>
                <th className="px-6 py-3">Date / Time</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Changes</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No activity logs found for this page.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Date/Time */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}
                    </td>

                    {/* User */}
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {log.user}
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {log.product.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          SKU: {log.product.sku}
                        </span>
                      </div>
                    </td>

                    {/* Action badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          log.action === "CREATE"
                            ? "bg-green-100 text-green-800"
                            : log.action === "UPDATE"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* Changes summary */}
                    <td className="px-6 py-4 max-w-xs md:max-w-md">
                      <div className="text-xs bg-gray-50 p-2 rounded max-h-24 overflow-y-auto space-y-1 font-mono">
                        {log.action === "UPDATE" ? (
                          Object.keys(log.changes).length > 0 ? (
                            Object.entries(log.changes).map(
                              ([key, value]: [string, any]) => (
                                <div
                                  key={key}
                                  className="border-b border-gray-100 pb-1 last:border-0"
                                >
                                  <span className="font-semibold text-gray-700">
                                    {key}:
                                  </span>{" "}
                                  <span className="text-red-600 line-through">
                                    {String(value.from)}
                                  </span>{" "}
                                  <span className="text-gray-400">→</span>{" "}
                                  <span className="text-green-600 font-semibold">
                                    {String(value.to)}
                                  </span>
                                </div>
                              ),
                            )
                          ) : (
                            <span className="text-gray-400 italic">
                              No field differences detected
                            </span>
                          )
                        ) : (
                          // Fallback rendering for full states (CREATE / DELETE)
                          <details className="cursor-pointer text-gray-600">
                            <summary className="hover:text-gray-900 font-sans font-medium text-[11px]">
                              View full snapshot
                            </summary>
                            <pre className="mt-1 text-[10px] bg-gray-900 text-gray-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.changes, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {(log.action === "update" || log.action === "delete") && (
                        <RevertButton
                          storeId={storeId}
                          logId={log.id}
                          actionType={log.action}
                          userId={session.user.userid}
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Simple Pagination Footer */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Link
              href={`?page=${Math.max(1, currentPage - 1)}`}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md bg-white text-gray-700 ${currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-gray-50"}`}
            >
              Previous
            </Link>
            <Link
              href={`?page=${currentPage + 1}`}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md bg-white text-gray-700 ${logs.length < 10 ? "pointer-events-none opacity-50" : "hover:bg-gray-50"}`}
            >
              Next
            </Link>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`?page=${Math.max(1, currentPage - 1)}`}
                className={`inline-flex items-center gap-1 px-3 py-1.5 border text-sm font-medium rounded bg-white text-gray-700 ${currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`}
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </Link>
              <Link
                href={`?page=${currentPage + 1}`}
                className={`inline-flex items-center gap-1 px-3 py-1.5 border text-sm font-medium rounded bg-white text-gray-700 ${logs.length < 10 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`}
              >
                Next <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
