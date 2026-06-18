"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth, unstable_update } from "@/src/lib/auth";

interface CreateStoreInput {
  storeName: string;
  settings: {
    lowStockThreshold: number;
    currency: string;
    theme: string;
    allowNegativeInventory: boolean;
    storeIcon?: string | null;
  };
}

export async function createStore(data: CreateStoreInput) {
  try {
    const session = await auth();

    // 1. Authenticate user
    if (!session?.user?.userid) {
      return {
        success: false,
        error: "You must be logged in to create a store.",
      };
    }

    if (!data.storeName) {
      return { success: false, error: "Store name is required." };
    }

    const userId = session.user.userid;

    // 2. Use a Prisma transaction to ensure ALL actions succeed together
    const result = await prisma.$transaction(async (tx) => {
      // Step A: Create the Store
      const newStore = await tx.store.create({
        data: {
          store_name: data.storeName,
          owner_id: userId,
          settings: {
            low_stock_threshold: data.settings.lowStockThreshold,
            currency: data.settings.currency,
            theme: data.settings.theme,
            allow_negative_inventory: data.settings.allowNegativeInventory,
            store_icon: data.settings.storeIcon || null,
          },
        },
      });

      // Step B: Fetch current user permissions so we don't overwrite existing ones
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { store_permissions: true },
      });

      const currentPermissions = user?.store_permissions || [];

      // Step C: Append the new 'super' permission for this new store
      const updatedPermissions = [
        ...currentPermissions,
        {
          store_id: newStore.id,
          role: "super",
          is_active: true,
        },
      ];

      // Step D: Update the user document in MongoDB
      await tx.user.update({
        where: { id: userId },
        data: {
          store_permissions: updatedPermissions,
        },
      });

      const mockProduct1 = await tx.product.create({
        data: {
          store_id: newStore.id,
          sku: "MOCK-PROD-001",
          name: "Sample Wireless Headphones",
          image: "",
          description: "Premium sound quality with active noise cancellation.",
          quantity: 50,
          price: 9900,
        },
      });

      const mockProduct2 = await tx.product.create({
        data: {
          store_id: newStore.id,
          sku: "MOCK-PROD-002",
          name: "Minimalist Leather Wallet",
          image: "",
          description:
            "Sleek front-pocket wallet made from full-grain genuine leather.",
          quantity: 35,
          price: 4500, // Stored in cents ($45.00)
        },
      });

      await tx.activityLog.createMany({
        data: [
          {
            store_id: newStore.id,
            user_id: userId,
            action: "create",
            doc_id: mockProduct1.id,
            prev_state: null,
          },
          {
            store_id: newStore.id,
            user_id: userId,
            action: "create",
            doc_id: mockProduct2.id,
            prev_state: null,
          },
        ],
      });

      const orderTimestamp = Date.now();
      await tx.order.create({
        data: {
          transactionid: `tx_${orderTimestamp}_${Math.random().toString(36).substring(2, 7)}`,
          ordernum: `ORD-${orderTimestamp}`,
          store_id: newStore.id,
          customerid: userId,
          items: [
            {
              productid: mockProduct1.id,
              productname: mockProduct1.name,
              quantity: 1,
            },
            {
              productid: mockProduct2.id,
              productname: mockProduct2.name,
              quantity: 2,
            },
          ],
          totalPrice: mockProduct1.price + mockProduct2.price * 2, // Total in cents
          payment: {
            customerPaymentId: `pay_${Math.random().toString(36).substring(2, 9)}`,
            method: "credit_card",
            status: "COMPLETED",
          },
        },
      });

      return newStore;
    });

    revalidatePath("/admin");

    return { success: true, data: result };
  } catch (error) {
    console.error("FAILED_TO_CREATE_STORE:", error);
    return {
      success: false,
      error: "Something went wrong while creating the store.",
    };
  }
}

export async function acceptInvite(userId: string, storeId: string) {
  // 1. Look for the unique user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User doesn't exist");
  }

  // 2. Look for the store_id inside store_permissions
  const permissionIndex = user.store_permissions.findIndex(
    (p) => p.store_id === storeId,
  );

  if (permissionIndex === -1) {
    throw new Error("Invitation doesn't exist");
  }

  if (user.store_permissions[permissionIndex].is_active === true) {
    throw new Error("Invitation already accepted");
  }

  // 3. Update the specific permission's is_active field to true
  const updatedPermissions = [...user.store_permissions];
  updatedPermissions[permissionIndex] = {
    ...updatedPermissions[permissionIndex],
    is_active: true,
  };

  await prisma.user.update({
    where: { id: userId },
    data: {
      store_permissions: updatedPermissions,
    },
  });

  await unstable_update({ user: {} });

  revalidatePath("/admin");
}

/**
 * Declines a store invitation by removing it from the user's permissions
 */
export async function declineInvite(userId: string, storeId: string) {
  // 1. Look for the unique user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User doesn't exist");
  }

  // 2. Look for the store_id inside store_permissions
  const permissionIndex = user.store_permissions.findIndex(
    (p) => p.store_id === storeId,
  );

  if (permissionIndex === -1) {
    throw new Error("Invitation doesn't exist");
  }

  // 3. Check if invitation is already active (per your logic requirement)
  if (user.store_permissions[permissionIndex].is_active === true) {
    throw new Error("Invitation already accepted");
  }

  // 4. Update store_permissions by removing (deleting) the object with that store_id
  const updatedPermissions = user.store_permissions.filter(
    (p) => p.store_id !== storeId,
  );

  await prisma.user.update({
    where: { id: userId },
    data: {
      store_permissions: updatedPermissions,
    },
  });
  revalidatePath("/admin");
}
