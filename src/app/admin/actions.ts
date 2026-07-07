"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth, unstable_update } from "@/src/lib/auth";
import { addDays } from "date-fns";

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

    const result = await prisma.$transaction(async (tx) => {
      const newStore = await tx.store.create({
        data: {
          store_name: data.storeName,
          owner_id: userId,
          settings: {
            create: {
              low_stock_threshold: data.settings.lowStockThreshold,
              currency: data.settings.currency,
              theme: data.settings.theme,
              allow_negative_inventory: data.settings.allowNegativeInventory,
              store_icon: data.settings.storeIcon || null,
            },
          },
        },
      });

      await tx.storePermission.create({
        data: {
          user_id: userId,
          store_id: newStore.id,
          role: "super",
          is_active: true,
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
          price: 4500,
        },
      });

      await tx.activityLog.createMany({
        data: [
          {
            store_id: newStore.id,
            user_id: userId,
            action: "create",
            doc_id: mockProduct1.id,
          },
          {
            store_id: newStore.id,
            user_id: userId,
            action: "create",
            doc_id: mockProduct2.id,
          },
        ],
      });

      const now = new Date();
      const threeDaysFromNow = addDays(now, 3);
      const orderTimestamp = threeDaysFromNow.getTime();
      await tx.order.create({
        data: {
          transactionid: `tx_${orderTimestamp}_${Math.random().toString(36).substring(2, 7)}`,
          ordernum: `ORD-${orderTimestamp}`,
          store_id: newStore.id,
          customerid: userId,
          items: {
            create: [
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
          },
          totalPrice: mockProduct1.price + mockProduct2.price * 2, // Total in cents
          payment: {
            create: {
              customerPaymentId: `pay_${Math.random().toString(36).substring(2, 9)}`,
              method: "credit_card",
              status: "COMPLETED",
            },
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
  const permission = await prisma.storePermission.findFirst({
    where: {
      user_id: userId,
      store_id: storeId,
    },
  });

  if (!permission) {
    throw new Error("Invitation doesn't exist");
  }

  if (permission.is_active) {
    throw new Error("Invitation already accepted");
  }

  await prisma.storePermission.update({
    where: { id: permission.id },
    data: {
      is_active: true,
    },
  });

  await unstable_update({ user: {} });

  revalidatePath("/admin");
}

export async function declineInvite(userId: string, storeId: string) {
  const permission = await prisma.storePermission.findFirst({
    where: {
      user_id: userId,
      store_id: storeId,
    },
  });

  if (!permission) {
    throw new Error("Invitation doesn't exist");
  }

  if (permission.is_active) {
    throw new Error("Invitation already accepted");
  }

  await prisma.storePermission.delete({
    where: { id: permission.id },
  });

  revalidatePath("/admin");
}
