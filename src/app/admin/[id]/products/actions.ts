"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { canAdmin } from "@/src/lib/canUser";

export async function updateProductAction(
  productId: string,
  formData: any,
  storeId: string,
  userId: string,
) {
  try {
    const authCheck = await canAdmin(storeId, "update_products");
    if (authCheck.status !== 200) {
      return {
        success: false,
        error: "Forbidden: You do not have permission to update products.",
      };
    }

    await prisma.$transaction(async (tx) => {
      const oldProduct = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!oldProduct) throw new Error("Product not found");

      await tx.product.update({
        where: { id: productId },
        data: {
          name: formData.name,
          sku: formData.sku,
          quantity: formData.quantity,
          image: formData.image,
          description: formData.description,
          price: formData.price,
          version: { increment: 1 },
        },
      });

      await tx.activityLog.create({
        data: {
          store_id: storeId,
          user_id: userId,
          action: "update",
          doc_id: productId,
          prev_state: oldProduct as any, // Storing full object as JSON
        },
      });
    });

    revalidatePath(`/admin/${storeId}/products`);
    return { success: true };
  } catch (error: any) {
    console.error("Transaction failed:", error);
    return {
      success: false,
      error: "Failed to update product and log activity.",
    };
  }
}

export async function deleteProductAction(
  productId: string,
  storeId: string,
  userId: string,
) {
  try {
    const authCheck = await canAdmin(storeId, "delete_products");
    if (authCheck.status !== 200) {
      return {
        success: false,
        error: "Forbidden: You do not have permission to delete products.",
      };
    }

    await prisma.$transaction(async (tx) => {
      const oldProduct = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!oldProduct) throw new Error("Product not found");

      await tx.product.update({
        where: { id: productId },
        data: { is_deleted: true },
      });

      await tx.activityLog.create({
        data: {
          store_id: storeId,
          user_id: userId,
          action: "delete",
          doc_id: productId,
          prev_state: oldProduct as any,
        },
      });
    });

    revalidatePath(`/admin/${storeId}/products`);
    return { success: true };
  } catch (error) {
    console.error("Database transaction failed:", error);
    return {
      success: false,
      error: "Failed to delete product and log activity.",
    };
  }
}

export async function createProductAction(
  formData: any,
  storeId: string,
  userId: string,
) {
  try {
    const authCheck = await canAdmin(storeId, "create_products");
    if (authCheck.status !== 200) {
      return {
        success: false,
        error: "Forbidden: You do not have permission to create products.",
      };
    }

    await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          store_id: storeId,
          sku: formData.sku,
          name: formData.name,
          image: formData.image,
          description: formData.description,
          quantity: formData.quantity,
          price: formData.price,
          version: 0,
        },
      });

      // 2. Log the creation activity
      await tx.activityLog.create({
        data: {
          store_id: storeId,
          user_id: userId,
          action: "create",
          doc_id: newProduct.id,
        },
      });
    });

    revalidatePath(`/admin/${storeId}/products`);
    return { success: true };
  } catch (error: any) {
    console.error("Database creation transaction failed:", error);
    return {
      success: false,
      error: "Failed to create product and log activity.",
    };
  }
}
