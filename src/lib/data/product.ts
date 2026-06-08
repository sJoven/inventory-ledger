import { prisma } from "@/src/lib/prisma";
export async function getExistingSKUs(storeId: string): Promise<string[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        store_id: storeId,
        is_deleted: false,
      },
      select: {
        sku: true,
      },
    });
    return products.map((product) => product.sku);
  } catch (error) {
    console.error(`Failed to fetch SKUs for store ${storeId}:`, error);
    throw new Error("Could not retrieve existing SKUs.");
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return null;
    }

    return product;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw new Error("Failed to retrieve product information.");
  }
}
