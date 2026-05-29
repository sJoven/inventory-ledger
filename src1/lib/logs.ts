import { prisma } from "@/src/lib/prisma";
import { cache } from "react";

export const getActivityLogs = cache(async (storeId: string, page = 1) => {
  const limit = 10;
  const skip = (page - 1) * limit;

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

  const productIds = logs.map((log) => log.doc_id);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      store_id: storeId,
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  return {
    logs,
    productMap,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
});
