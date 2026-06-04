"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

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

  // 3. Check if invitation is already active
  if (user.store_permissions[permissionIndex].is_active === true) {
    throw new Error("Invitation already accepted");
  }

  // 4. Update the specific permission's is_active field to true
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
