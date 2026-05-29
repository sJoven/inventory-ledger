import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { cache } from "react";

interface GetProductsOptions {
  query?: string;
  page?: number;
  limit?: number;
  includeCount?: boolean;
  includeProducts?: boolean;
}

export const getStoreProducts = cache(
  async (storeId: string, options: GetProductsOptions = {}) => {
    const {
      query = "",
      page = 1,
      limit = 10,
      includeCount = true,
      includeProducts = true,
    } = options;

    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProductWhereInput = {
      store_id: storeId,
      is_deleted: false,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { sku: { contains: query, mode: "insensitive" } },
      ],
    };

    const allSkusPromise = prisma.product.findMany({
      where: { store_id: storeId, is_deleted: false },
      select: { sku: true },
    });

    const promises: any = {
      allSkus: allSkusPromise,
    };

    if (includeProducts) {
      promises.products = prisma.product.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          sku: true,
          quantity: true,
        },
        orderBy: { id: "desc" },
        take: limit,
        skip: skip,
      });
    }

    if (includeCount) {
      promises.count = prisma.product.count({ where: whereClause });
    }

    // Execute all queries in parallel
    const keys = Object.keys(promises);
    const results = await Promise.all(Object.values(promises));

    // Map results back to a data object
    const data = keys.reduce((acc, key, index) => {
      acc[key] = results[index];
      return acc;
    }, {} as any);

    return {
      products: data.products || [],
      totalCount: data.count || 0,
      totalPages: data.count ? Math.ceil(data.count / limit) : 0,
      existingSkus: (data.allSkus || []).map((p: { sku: string }) =>
        p.sku.toLowerCase(),
      ),
    };
  },
);
