// Action Reversion

import { describe, test, expect, vi, beforeEach } from "vitest";
import { revertProductState } from "@/src/app/admin/[id]/logs/actions"; // Adjust path
import { canAdmin } from "@/src/lib/canUser";
import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/src/lib/canUser", () => ({
  canAdmin: vi.fn(),
}));

describe("revertProductState - Real Database Integration Test", () => {
  const storeId = "test-store-id";
  const userId = "test-user-id";
  const productId = "test-product-id";
  const logId = "test-log-id";

  beforeEach(async () => {
    vi.clearAllMocks();

    await prisma.activityLog.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.user.deleteMany({});

    await prisma.user.create({
      data: {
        id: userId,
        email: "admin@teststore.com",
      },
    });

    await prisma.store.create({
      data: {
        id: storeId,
        store_name: "Integration Retro Shop",
        owner_id: userId,
      },
    });
  });

  test("should successfully execute rollback transaction across product and logs on a real DB", async () => {
    const currentProductOnDisk = {
      id: productId,
      store_id: storeId,
      sku: "SHOES-V2",
      name: "Ultra Running Shoes (Modified Name)",
      quantity: 10,
      price: 12000,
      version: 5,
      image: "test-shoes.jpg",
      description: "A modified product.",
    };

    await prisma.product.create({
      data: currentProductOnDisk,
    });

    const oldStateSnapshot = {
      id: productId,
      store_id: storeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 2,
      name: "Classic OG Running Shoes",
      sku: "SHOES-OG",
      quantity: 100,
      price: 9500,
    };

    await prisma.activityLog.create({
      data: {
        id: logId,
        store_id: storeId,
        user_id: userId,
        action: "update",
        doc_id: productId,
        prev_state: oldStateSnapshot,
      },
    });

    vi.mocked(canAdmin).mockResolvedValueOnce({ status: 200 } as any);

    const result = await revertProductState(storeId, logId, userId);

    expect(result).toEqual({ success: true });
    expect(revalidatePath).toHaveBeenCalledWith(`/admin/${storeId}/logs`);

    const updatedProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct?.name).toBe("Classic OG Running Shoes");
    expect(updatedProduct?.sku).toBe("SHOES-OG");
    expect(updatedProduct?.price).toBe(9500);
    expect(updatedProduct?.is_deleted).toBe(false);
    expect(updatedProduct?.version).toBe(6);

    const latestRevertLog = await prisma.activityLog.findFirst({
      where: {
        store_id: storeId,
        action: "revert",
      },
    });

    expect(latestRevertLog).not.toBeNull();
    expect(latestRevertLog?.doc_id).toBe(productId);
    expect(latestRevertLog?.user_id).toBe(userId);

    const loggedPrevState = latestRevertLog?.prev_state as any;
    expect(loggedPrevState.name).toBe("Ultra Running Shoes (Modified Name)");
    expect(loggedPrevState.version).toBe(5);
  });

  test("should abort and roll back completely if the targeted SKU has been taken by another item", async () => {
    await prisma.product.create({
      data: {
        id: productId,
        store_id: storeId,
        sku: "CURRENT-SKU",
        name: "Item Pro",
        quantity: 1,
        price: 500,
        version: 1,
        image: "item-pro.jpg",
        description: "An active item",
      },
    });

    await prisma.product.create({
      data: {
        id: "some-other-product-id",
        store_id: storeId,
        sku: "STOLEN-SKU",
        name: "I have this SKU now",
        quantity: 5,
        price: 1000,
        version: 1,
        image: "other.jpg",
        description: "Sneaky squatter item",
      },
    });

    await prisma.activityLog.create({
      data: {
        id: logId,
        store_id: storeId,
        user_id: userId,
        action: "update",
        doc_id: productId,
        prev_state: { sku: "STOLEN-SKU", name: "Item Original" },
      },
    });

    vi.mocked(canAdmin).mockResolvedValueOnce({ status: 200 } as any);

    const result = await revertProductState(storeId, logId, userId);

    expect(result).toEqual({
      success: false,
      error: 'SKU \"STOLEN-SKU\" is already in use by another product.',
    });
  });
});
