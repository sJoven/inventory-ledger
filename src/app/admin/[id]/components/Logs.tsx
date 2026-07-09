import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { canShowAdmin } from "@/src/lib/canUser";
import { formatEnrichedLogs } from "@/src/lib/log-utils";

export default async function RecentActivityLogs({
  store_id,
}: {
  store_id: string;
}) {
  const canViewLogs = await canShowAdmin(store_id, "logs");
  if (canViewLogs.status !== 200) {
    return null;
  }

  const rawLogs = await prisma.activityLog.findMany({
    where: { store_id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  let enrichedLogs: Array<{ id: string; sentence: React.ReactNode }> = [];

  if (rawLogs.length > 0) {
    const productIds = rawLogs.map((log) => log.doc_id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    enrichedLogs = formatEnrichedLogs(rawLogs, products);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          Recent Activity
        </h3>
      </div>

      <div className="flex-1 p-2">
        {enrichedLogs.length === 0 ? (
          <div className="p-4 text-sm text-center text-gray-500">
            No recent activity found.
          </div>
        ) : (
          <ul className="space-y-1">
            {enrichedLogs.map((log, index) => (
              <li
                key={log.id}
                className={`p-3 rounded-lg hover:bg-orange-50/50 flex items-center transition-colors ${
                  index >= 3 ? "hidden sm:flex" : "flex"
                } ${index >= 4 ? "lg:flex" : ""}`}
              >
                <p className="text-sm truncate w-full">{log.sentence}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <Link
          href={`/admin/${store_id}/logs`}
          className="block w-full text-center text-sm font-medium text-[#fc6022] hover:text-[#e0551d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6022] rounded"
        >
          View all logs &rarr;
        </Link>
      </div>
    </div>
  );
}
