"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function undoAction(logId: string) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  const userStoreId = (session?.user as any)?.store_id;

  if (!session || !userId || !userStoreId) {
    throw new Error("Unauthorized");
  }

  // 1. Fetch the specific log entry
  const log = await prisma.activityLog.findUnique({
    where: { id: logId },
  });

  // Basic validation
  if (!log || !log.prev_state || log.action === "CREATE") {
    throw new Error("Cannot undo this action");
  }

  // 2. Fetch the CURRENT state of the product before we change it
  // We use userStoreId for security to ensure they aren't undoing a product they don't own
  const currentProduct = await prisma.product.findUnique({
    where: {
      id: log.doc_id,
      store_id: userStoreId,
    },
  });

  if (!currentProduct) {
    throw new Error("Product no longer exists");
  }

  const { id, _id, ...dataToRestore } = log.prev_state as any;
  if (dataToRestore.sku) {
    const existingSkuOwner = await prisma.product.findFirst({
      where: {
        sku: dataToRestore.sku,
        store_id: userStoreId,
        is_deleted: false,
        id: { not: log.doc_id },
      },
    });

    if (existingSkuOwner) {
      throw new Error(
        `SKU collision: The SKU "${dataToRestore.sku}" is already in use by another active product ("${existingSkuOwner.name}").`,
      );
    }
  }
  await prisma.$transaction([
    prisma.product.update({
      where: { id: log.doc_id },
      data: dataToRestore,
    }),
    prisma.activityLog.create({
      data: {
        store_id: log.store_id,
        user_id: userId,
        action: `UNDO_${log.action}`,
        doc_id: log.doc_id,
        prev_state: currentProduct as any,
      },
    }),
  ]);

  revalidatePath("/logs");
}
