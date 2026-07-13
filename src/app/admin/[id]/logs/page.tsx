import Link from "next/link";
import { getLogs } from "@/src/lib/data/log";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, History } from "lucide-react";
import { RevertButton } from "@/src/app/admin/[id]/logs/components/RevertBtn";
import { isLoggedIn } from "@/src/lib/isLoggedIn";
import { canShowAdmin } from "@/src/lib/canUser";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function LogsPage({ params, searchParams }: PageProps) {
  const session = await isLoggedIn();
  if (!session) {
    redirect(`/login`);
  }
  const { id: storeId } = await params;
  const { page } = await searchParams;

  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const logs = await getLogs(storeId, currentPage);

  const canShowLogs = await canShowAdmin(storeId, "logs");

  if (canShowLogs.status !== 200) {
    redirect("/admin");
  }

  return (
    <div className="w-full space-y-6 md:px-8 lg:px-12">
      <div className="flex p-6 items-center justify-between pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <History className="h-6 w-6 text-gray-500" />
            Store Activity Logs
          </h1>
          <p className="text-sm text-gray-500">
            Store ID:{" "}
            <span className="font-semibold text-gray-700">{storeId}</span>
          </p>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm relative overflow-hidden md:overflow-visible w-[95vw] md:w-full max-w-full flex flex-col">
        <div className="overflow-x-auto md:overflow-visible w-full flex-1 [scrollbar-width:thin] [scrollbar-color:#d6d3d1_transparent]">
          <table className="table-fixed text-left text-sm text-gray-600 border-collapse min-w-[900px] w-full">
            <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-semibold tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-44">Date / Time</th>
                <th className="px-6 py-4 min-w-[120px]">User</th>
                <th className="px-6 py-4 min-w-[180px]">Product</th>
                <th className="px-6 py-4 w-32">Action</th>
                <th className="px-6 py-4 min-w-[250px]">Changes</th>
                <th className="px-6 py-4 w-28 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 bg-gray-50/30"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-2xl mb-2">📋</span>
                      <p>No activity logs found for this page.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50/80 transition-colors duration-200"
                  >
                    {/* Date/Time */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                      {format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}
                    </td>

                    {/* User */}
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800 truncate">
                      {log.user}
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold text-gray-800 truncate max-w-[200px]">
                          {log.product.name}
                        </span>
                        <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                          SKU: {log.product.sku}
                        </span>
                      </div>
                    </td>

                    {/* Action badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`font-semibold px-2.5 py-1 rounded-lg border text-xs tracking-wide ${
                          log.action === "CREATE"
                            ? "text-green-700 bg-green-50 border-green-200"
                            : log.action === "UPDATE"
                              ? "text-blue-700 bg-blue-50 border-blue-200"
                              : "text-red-700 bg-red-50 border-red-200"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* Changes summary */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col w-full min-w-[100px] max-w-[300px]">
                        <details className="group flex flex-col">
                          {/* Trigger Button - Now at the bottom */}
                          <summary className="list-none cursor-pointer bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm hover:border-[#fc6022] hover:shadow-md transition-all flex items-center justify-between text-xs font-semibold text-gray-700">
                            <span>
                              {log.action === "UPDATE"
                                ? "View Changes"
                                : "View Snapshot"}
                            </span>
                            <span className="text-[10px] text-gray-400 group-open:rotate-180 transition-transform">
                              ▼
                            </span>
                          </summary>

                          {/* Expanded Content - Now appears above the trigger */}
                          <div className="mb-2 p-3 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                            {log.action === "UPDATE" ? (
                              Object.keys(log.changes).length > 0 ? (
                                <div className="space-y-3">
                                  {Object.entries(log.changes).map(
                                    ([key, value]) => (
                                      <div
                                        key={key}
                                        className="flex items-center gap-3 text-xs font-mono border-b border-gray-50 last:border-0 pb-2"
                                      >
                                        <span className="font-bold text-gray-500 w-20 truncate">
                                          {key}:
                                        </span>
                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                          <span className="text-red-500 line-through decoration-red-300 truncate">
                                            {String(value.from)}
                                          </span>
                                          <span className="text-gray-300">
                                            →
                                          </span>
                                          <span className="text-green-700 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-100 truncate">
                                            {String(value.to)}
                                          </span>
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 italic text-xs">
                                  No changes detected
                                </span>
                              )
                            ) : (
                              <pre className="text-xs bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-lg border border-gray-700 overflow-x-auto shadow-inner h-auto">
                                <code className="font-mono leading-relaxed block">
                                  {JSON.stringify(log.changes, null, 2)}
                                </code>
                              </pre>
                            )}
                          </div>
                        </details>
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

        {/* Unified Pagination Footer */}
        <div className="bg-gray-50/50 px-6 py-4 flex items-center justify-between border-t border-gray-100 rounded-b-2xl">
          {/* Mobile View */}
          <div className="flex-1 flex justify-between sm:hidden">
            <Link
              href={`?page=${Math.max(1, currentPage - 1)}`}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-semibold rounded-lg bg-white transition-all duration-200 shadow-sm ${
                currentPage <= 1
                  ? "border-gray-100 text-gray-300 pointer-events-none bg-gray-50/50"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#fc6022] hover:border-[#fc6022]/30 active:scale-[0.98]"
              }`}
            >
              Previous
            </Link>
            <Link
              href={`?page=${currentPage + 1}`}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-semibold rounded-lg bg-white transition-all duration-200 shadow-sm ${
                logs.length < 10
                  ? "border-gray-100 text-gray-300 pointer-events-none bg-gray-50/50"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#fc6022] hover:border-[#fc6022]/30 active:scale-[0.98]"
              }`}
            >
              Next
            </Link>
          </div>

          {/* Desktop View */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
            <div>
              <p className="text-sm text-gray-500">
                Showing page{" "}
                <span className="font-semibold text-gray-800">
                  {currentPage}
                </span>
              </p>
            </div>
            <div className="flex gap-2.5">
              <Link
                href={`?page=${Math.max(1, currentPage - 1)}`}
                className={`inline-flex items-center gap-1.5 px-4 py-2 border text-sm font-semibold rounded-lg bg-white transition-all duration-200 shadow-sm ${
                  currentPage <= 1
                    ? "border-gray-100 text-gray-300 pointer-events-none bg-gray-50/50"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#fc6022] hover:border-[#fc6022]/30 active:scale-[0.98]"
                }`}
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </Link>
              <Link
                href={`?page=${currentPage + 1}`}
                className={`inline-flex items-center gap-1.5 px-4 py-2 border text-sm font-semibold rounded-lg bg-white transition-all duration-200 shadow-sm ${
                  logs.length < 10
                    ? "border-gray-100 text-gray-300 pointer-events-none bg-gray-50/50"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#fc6022] hover:border-[#fc6022]/30 active:scale-[0.98]"
                }`}
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
