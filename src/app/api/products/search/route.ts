import { prisma } from "@/src/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const storeId = searchParams.get("storeId") ?? "";
  const page = searchParams.get("page") ?? "1";
  const query = searchParams.get("query") ?? "";

  const products = await getTenProducts(storeId, page, query);

  return Response.json(products);
}

//PLEASE READ: This is a copy of @/src/lib/data/product.ts
//getTenProducts() function without the guard rails
//for easier performance testing.

export async function getTenProducts(
  id: string,
  page: string | number,
  query: string = "",
) {
  const pageNum = Number(page) || 1;
  const skip = (pageNum - 1) * 10;

  const whereClause = {
    store_id: id,
    is_deleted: false,
    OR: [
      { name: { contains: query, mode: "insensitive" as const } },
      { sku: { contains: query, mode: "insensitive" as const } },
    ],
  };

  try {
    return await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        image: true,
        sku: true,
        description: true,
        quantity: true,
        price: true,
      },
      take: 10,
      skip: skip,
    });
  } catch (error) {
    console.error("Error executing getTenProducts:", error);
    return [];
  }
}
