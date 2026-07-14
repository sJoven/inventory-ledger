import { prisma } from "@/src/lib/prisma";
export async function countLogs(storeId: string): Promise<number> {
  try {
    const count = await prisma.activityLog.count({
      where: {
        store_id: storeId,
      },
    });

    return count;
  } catch (error) {
    console.error(`Failed to count logs for store ${storeId}:`, error);
    throw new Error("Could not retrieve log count.");
  }
}

export async function getLogs(storeId: string, page: number) {
  const pageSize = 10;
  const pageNum = Math.max(1, page);
  const skip = (pageNum - 1) * pageSize;

  try {
    const logs = await prisma.activityLog.findMany({
      where: {
        store_id: storeId,
      },
      select: {
        id: true,
        createdAt: true,
        action: true,
        prev_state: true,
        doc_id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: pageSize,
    });

    const productIds = logs.map((log) => log.doc_id);
    const fullProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const productMap = new Map(fullProducts.map((p) => [p.id, p]));

    return logs.map((log) => {
      const currentProduct = productMap.get(log.doc_id);

      const changes: Record<string, { from: any; to: any }> = {};
      const prevState = (log.prev_state as Record<string, any>) || {};

      if (log.action === "update" && currentProduct) {
        Object.keys(prevState).forEach((key) => {
          const oldVal = prevState[key];
          const newVal = (currentProduct as Record<string, any>)[key];

          if (oldVal !== newVal) {
            changes[key] = {
              from: oldVal,
              to: newVal,
            };
          }
        });
      }

      return {
        id: log.id,
        createdAt: log.createdAt,
        action: log.action,
        user: log.user?.name || "Unknown User",
        product: currentProduct
          ? {
              id: currentProduct.id,
              name: currentProduct.name,
              sku: currentProduct.sku,
            }
          : { id: log.doc_id, name: "Unknown/Deleted Product", sku: "N/A" },
        changes: log.action === "update" ? changes : prevState,
      };
    });
  } catch (error) {
    console.error(
      `Failed to fetch logs for store ${storeId} on page ${page}:`,
      error,
    );
    throw new Error("Could not retrieve activity logs.");
  }
}
