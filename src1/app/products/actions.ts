"use server";

import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const session = await auth();
  const storeId = (session?.user as any)?.store_id;
  const userId = session?.user?.id;

  if (!storeId || !userId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const quantity = parseInt(formData.get("quantity") as string) || 0;

  await prisma.$transaction(async (tx) => {
    const newProduct = await tx.product.create({
      data: {
        name,
        sku,
        quantity,
        store_id: storeId,
      },
    });

    await tx.activityLog.create({
      data: {
        store_id: storeId,
        user_id: userId,
        action: "CREATE_PRODUCT",
        doc_id: newProduct.id,
        prev_state: null,
      },
    });
  });

  revalidatePath("/products");
}

export async function deleteProduct(productId: string) {
  const session = await auth();
  const storeId = (session?.user as any)?.store_id;
  const userId = session?.user?.id;

  if (!storeId || !userId) throw new Error("Unauthorized");

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) throw new Error("Product not found");

      await tx.product.update({
        where: { id: productId },
        data: { is_deleted: true },
      });

      await tx.activityLog.create({
        data: {
          store_id: storeId,
          user_id: userId,
          action: "DELETE_PRODUCT",
          doc_id: productId,
          prev_state: JSON.parse(JSON.stringify(product)),
        },
      });
    });

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Failed to delete product." };
  }
}

export async function updateProduct(
  productId: string,
  data: { name: string; sku: string; quantity: number },
) {
  const session = await auth();
  const storeId = (session?.user as any)?.store_id;
  const userId = session?.user?.id;

  if (!storeId || !userId) throw new Error("Unauthorized");

  try {
    await prisma.$transaction(async (tx) => {
      const currentProduct = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!currentProduct) throw new Error("Product not found");

      await tx.product.update({
        where: { id: productId },
        data: {
          name: data.name,
          sku: data.sku,
          quantity: data.quantity,
        },
      });

      await tx.activityLog.create({
        data: {
          store_id: storeId,
          user_id: userId,
          action: "UPDATE_PRODUCT",
          doc_id: productId,
          prev_state: JSON.parse(JSON.stringify(currentProduct)),
        },
      });
    });

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update product" };
  }
}
