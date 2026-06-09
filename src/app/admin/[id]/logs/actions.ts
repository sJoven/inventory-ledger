"use server";

import { revalidatePath } from "next/cache";
import { getExistingSKUs } from "@/src/lib/data/product";
import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";

export async function revertProductState(
  storeId: string,
  logId: string,
  userId: string,
) {
  try {
    const log = await prisma.activityLog.findUnique({
      where: { id: logId, store_id: storeId },
    });

    if (!log) {
      throw new Error("Activity log entry not found.");
    }

    if (log.action === "create" || log.action === "revert") {
      return {
        success: false,
        error: `Actions of type "${log.action}" cannot be reverted.`,
      };
    }

    if (!log.prev_state) {
      throw new Error("No previous state found to revert to.");
    }

    const prevState = log.prev_state as Record<string, any>;
    const productId = log.doc_id;

    // 🔄 FIX 1: Fetch the ENTIRE product object instead of just filtering a few fields
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (prevState.sku) {
      const activeSKUs = await getExistingSKUs(storeId);

      if (
        prevState.sku !== currentProduct?.sku &&
        activeSKUs.includes(prevState.sku)
      ) {
        return {
          success: false,
          error: `SKU "${prevState.sku}" is already in use by another product.`,
        };
      }
    }

    const {
      id,
      store_id,
      createdAt,
      updatedAt,
      version,
      store,
      ...cleanProductData
    } = prevState;

    const nextVersion = (currentProduct?.version ?? 0) + 1;
    const productPayload =
      cleanProductData as Prisma.ProductUncheckedCreateInput;

    if (log.action === "delete") {
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          ...productPayload,
          version: nextVersion,
          is_deleted: false,
        },
      });
    } else if (log.action === "update") {
      await prisma.product.update({
        where: { id: productId },
        data: {
          ...productPayload,
          version: nextVersion,
          is_deleted: false,
        },
      });
    }

    // 🔄 FIX 2: Store the true full state snapshot in your activity log
    const stateBeforeRevert = currentProduct ? currentProduct : null;

    await prisma.activityLog.create({
      data: {
        store_id: storeId,
        doc_id: productId,
        user_id: userId,
        action: "revert",
        prev_state: stateBeforeRevert as Prisma.InputJsonValue,
      },
    });

    revalidatePath(`/admin/${storeId}/logs`);
    return { success: true };
  } catch (error: any) {
    console.error("Revert failed:", error);
    return {
      success: false,
      error: error.message || "Failed to revert changes.",
    };
  }
}
