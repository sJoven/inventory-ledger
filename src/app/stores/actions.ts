"use server";

import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createStore(formData: FormData) {
  const session = await auth();
  const storeName = formData.get("storeName") as string;

  // 1. Basic Validation
  if (!session?.user?.id) {
    throw new Error("Unauthorized: No session found.");
  }

  if (!storeName || storeName.length < 3) {
    throw new Error("Store name must be at least 3 characters long.");
  }

  try {
    // 2. Verify user still exists in DB
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (!dbUser) {
      throw new Error("User no longer exists in the database.");
    }

    // 3. Create the Store
    const newStore = await prisma.store.create({
      data: {
        store_name: storeName,
        owner_id: dbUser.id,
      },
    });

    // 4. Update the User's store_permissions array
    // Since it's a 'type' in MongoDB, we push a new object into the array
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        store_permissions: {
          push: {
            store_id: newStore.id,
            role: "admin", // The creator is the admin
          },
        },
      },
    });

    // 5. Refresh the page data
    revalidatePath("/stores");

    return { success: true, storeId: newStore.id };
  } catch (error) {
    console.error("CREATE_STORE_ERROR:", error);
    return { success: false, error: "Failed to create store." };
  }
}
