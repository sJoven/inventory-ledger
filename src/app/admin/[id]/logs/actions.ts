"use server";

import { revalidatePath } from "next/cache";
import { getExistingSKUs } from "@/src/lib/data/product";
import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { canAdmin } from "@/src/lib/canUser";

export async function revertProductState(
  storeId: string,
  logId: string,
  userId: string,
) {
  try {
    const authCheck = await canAdmin(storeId, "revert");

    if (authCheck.status !== 200) {
      return {
        success: false,
        error: "Forbidden: You do not have permission to revert products.",
      };
    }

    const log = await prisma.activityLog.findUnique({
      where: { id: logId },
    });
    if (!log || log.store_id !== storeId) {
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
    const stateBeforeRevert = currentProduct ? currentProduct : {};

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: {
          ...cleanProductData,
          version: nextVersion,
          is_deleted: false,
        },
      });

      await tx.activityLog.create({
        data: {
          store_id: storeId,
          doc_id: productId,
          user_id: userId,
          action: "revert",
          prev_state: stateBeforeRevert as Prisma.InputJsonValue,
        },
      });
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
