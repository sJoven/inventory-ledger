//Product Update

import { describe, test, expect, vi, beforeEach } from "vitest";
import { updateProductAction } from "@/src/app/admin/[id]/products/actions"; // Adjust path
import { canAdmin } from "@/src/lib/canUser";
import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/src/lib/canUser", () => ({
  canAdmin: vi.fn(),
}));

describe("updateProductAction - Real Database Integration Test", () => {
  const storeId = "integration-test-store";
  const userId = "integration-test-user";
  const productId = "integration-test-product";

  beforeEach(async () => {
    vi.clearAllMocks();

    await prisma.activityLog.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.user.deleteMany({});

    await prisma.user.create({
      data: {
        id: userId,
        email: "test-owner@example.com",
      },
    });

    await prisma.store.create({
      data: {
        id: storeId,
        store_name: "Integration Test Store",
        owner_id: userId,
      },
    });
  });

  test("should successfully write updates and log audit trail to the actual database", async () => {
    await prisma.product.create({
      data: {
        id: productId,
        store_id: storeId,
        sku: "ORIGINAL-SKU",
        name: "Vintage Camera",
        quantity: 5,
        price: 15000,
        image: "old.jpg",
        description: "A classic film camera.",
        version: 1,
      },
    });

    vi.mocked(canAdmin).mockResolvedValueOnce({ status: 200 } as any);

    const updatedFormData = {
      name: "Modern DSLR Camera",
      sku: "NEW-DSLR-99",
      quantity: 12,
      price: 89900,
      image: "new.jpg",
      description: "Upgraded digital sensor model.",
    };

    const result = await updateProductAction(
      productId,
      updatedFormData,
      storeId,
      userId,
    );

    expect(result).toEqual({ success: true });
    expect(revalidatePath).toHaveBeenCalledWith(`/admin/${storeId}/products`);

    const updatedProductInDb = await prisma.product.findUnique({
      where: { id: productId },
    });

    expect(updatedProductInDb).not.toBeNull();
    expect(updatedProductInDb?.name).toBe("Modern DSLR Camera");
    expect(updatedProductInDb?.sku).toBe("NEW-DSLR-99");
    expect(updatedProductInDb?.quantity).toBe(12);
    expect(updatedProductInDb?.version).toBe(2);

    const writtenLog = await prisma.activityLog.findFirst({
      where: { store_id: storeId, doc_id: productId },
    });

    expect(writtenLog).not.toBeNull();
    expect(writtenLog?.action).toBe("update");
    expect(writtenLog?.user_id).toBe(userId);

    const prevState = writtenLog?.prev_state as any;
    expect(prevState.name).toBe("Vintage Camera");
    expect(prevState.sku).toBe("ORIGINAL-SKU");
    expect(prevState.version).toBe(1);
  });

  test("should completely abort and roll back transaction if product does not exist", async () => {
    vi.mocked(canAdmin).mockResolvedValueOnce({ status: 200 } as any);

    const fakeFormData = {
      name: "Ghost Item",
      sku: "GHOST",
      quantity: 1,
      price: 100,
    };

    const result = await updateProductAction(
      "non-existent-id",
      fakeFormData,
      storeId,
      userId,
    );

    expect(result).toEqual({
      success: false,
      error: "Failed to update product and log activity.",
    });

    const totalLogsCount = await prisma.activityLog.count();
    expect(totalLogsCount).toBe(0);
  });
});
