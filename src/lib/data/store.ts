"use server";

import { prisma } from "@/src/lib/prisma"; // Adjust this import based on your Prisma client path

export async function getStoreCurrency(store_id: string) {
  try {
    const store = await prisma.store.findUnique({
      where: {
        id: store_id,
      },
      select: {
        settings: true,
      },
    });

    if (!store) {
      return {
        success: false,
        error: "Store not found.",
      };
    }

    return {
      success: true,
      data: store.settings?.currency || "PHP",
    };
  } catch (error) {
    console.error("Failed to fetch store currency:", error);
    return {
      success: false,
      error: "An unexpected error occurred while fetching the currency.",
    };
  }
}
