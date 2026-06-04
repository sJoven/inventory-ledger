import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { canShowAdmin } from "@/src/lib/canUser";

// Helper function to turn database actions into human-readable verbs
function getReadableAction(action: string) {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes("create")) return "Created";
  if (lowerAction.includes("update")) return "Updated";
  if (lowerAction.includes("delete")) return "Deleted";
  return "Modified"; // Fallback just in case
}

export default async function RecentActivityLogs({
  store_id,
}: {
  store_id: string;
}) {
  // 1. Check permissions
  const canViewLogs = await canShowAdmin(store_id, "logs");

  if (canViewLogs.status !== 200) {
    return null;
  }

  // 2. Get the 5 most recent logs
  const logs = await prisma.activityLog.findMany({
    where: { store_id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // 3. Extract doc_ids and fetch corresponding product names
  const productIds = logs.map((log) => log.doc_id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p.name]));

  // Combine and format the data
  const enrichedLogs = logs.map((log) => {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(log.createdAt);

    return {
      id: log.id,
      // Create the human-readable sentence directly
      sentence: (
        <>
          <span className="font-semibold text-gray-900">
            {getReadableAction(log.action)}
          </span>{" "}
          <span className="font-medium text-gray-800">
            {productMap.get(log.doc_id) || "Unknown/Deleted Product"}
          </span>{" "}
          <span className="text-gray-500">at {formattedDate}</span>
        </>
      ),
    };
  });

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
                // Hides elements on smaller screens based on index
                className={`p-3 rounded-lg hover:bg-gray-50 flex items-center transition-colors ${
                  index >= 3 ? "hidden sm:flex" : "flex"
                } ${index >= 4 ? "lg:flex" : ""}`}
              >
                {/* Single sentence representation */}
                <p className="text-sm truncate w-full">{log.sentence}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <Link
          href={`/admin/${store_id}/logs`}
          className="block w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all logs &rarr;
        </Link>
      </div>
    </div>
  );
}
