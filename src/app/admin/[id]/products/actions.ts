"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProductAction(
  productId: string,
  formData: any,
  storeId: string,
  userId: string,
) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Fetch current state to save as prev_state
      const oldProduct = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!oldProduct) throw new Error("Product not found");

      // 2. Perform the update
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

      // 3. Create the activity log
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
    await prisma.$transaction(async (tx) => {
      // 1. Fetch current state for the audit log
      const oldProduct = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!oldProduct) throw new Error("Product not found");

      // 2. Perform the soft delete
      await tx.product.update({
        where: { id: productId },
        data: { is_deleted: true },
      });

      // 3. Create the activity log
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
          prev_state: null,
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
