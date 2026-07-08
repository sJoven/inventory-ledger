// src/lib/getEnrichedLogs.tsx (Adjust path as needed)
import { prisma } from "@/src/lib/prisma";

// Helper function to turn database actions into human-readable verbs
export function getReadableAction(action: string) {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes("create")) return "Created";
  if (lowerAction.includes("update")) return "Updated";
  if (lowerAction.includes("delete")) return "Deleted";
  return "Modified"; // Fallback just in case
}

export async function getEnrichedLogs(store_id: string) {
  // Fetch logs
  const logs = await prisma.activityLog.findMany({
    where: { store_id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  if (logs.length === 0) return [];

  // Fetch associated products
  const productIds = logs.map((log) => log.doc_id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p.name]));

  // Enrich logs with formatting and JSX
  return logs.map((log) => {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(log.createdAt);

    return {
      id: log.id,
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
}
