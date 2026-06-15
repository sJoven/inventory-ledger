"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { canAdmin } from "@/src/lib/canUser";

export async function updateStoreSettings(
  storeId: string,
  data: {
    store_name?: string;
    store_icon?: string;
    low_stock_threshold?: number;
    currency?: string;
    theme?: string;
    allow_negative_inventory?: boolean;
  },
) {
  try {
    // 🔒 AUTHORIZATION CHECK
    const authCheck = await canAdmin(storeId, "update_settings");
    if (authCheck.status !== 200) {
      return {
        success: false,
        error:
          "Forbidden: You do not have permission to update store settings.",
      };
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        store_name: data.store_name,
        settings: {
          update: {
            store_icon: data.store_icon,
            low_stock_threshold: data.low_stock_threshold,
            currency: data.currency,
            theme: data.theme,
            allow_negative_inventory: data.allow_negative_inventory,
          },
        },
      },
    });

    revalidatePath(`/dashboard/${storeId}/settings`);
    return { success: true, data: updatedStore };
  } catch (error) {
    console.error("Failed to update store settings:", error);
    return { success: false, error: "Could not update store settings." };
  }
}

export async function getStoreSettings(storeId: string) {
  try {
    // 🔒 AUTHORIZATION CHECK
    const authCheck = await canAdmin(storeId, "view_settings");
    if (authCheck.status !== 200) {
      return {
        success: false,
        error: "Forbidden: You do not have permission to view store settings.",
      };
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: {
        store_name: true,
        settings: true,
      },
    });
    return { success: true, data: store };
  } catch (error) {
    return { success: false, error: "Failed to fetch store." };
  }
}

export async function updateStoreMember(
  storeId: string,
  userId: string,
  role: string,
) {
  try {
    // 🔒 AUTHORIZATION CHECK
    const authCheck = await canAdmin(storeId, "update_member");
    if (authCheck.status !== 200) {
      return {
        success: false,
        error: "Forbidden: You do not have permission to update members.",
      };
    }

    // Add your Prisma update logic here in the future
    return { success: true, message: `User ${userId} updated to ${role}` };
  } catch (error) {
    console.error("Failed to update member:", error);
    return { success: false, error: "Could not update store member." };
  }
}

export async function addMember(email: string, store_id: string, role: string) {
  try {
    // 🔒 AUTHORIZATION CHECK
    const authCheck = await canAdmin(store_id, "add_member");
    if (authCheck.status !== 200) {
      return {
        success: false,
        error: "Forbidden: You do not have permission to add members.",
      };
    }

    // 1. Validate the role (Ensure it matches your DB requirements)
    const validRoles = ["super", "manager", "clerk"];
    if (!validRoles.includes(role)) {
      return {
        success: false,
        error: "Invalid role. Must be 'super', 'manager', or 'clerk'.",
      };
    }

    // 2. Define the new permission object (is_active is false as requested)
    const newPermission = {
      store_id: store_id,
      role: role,
      is_active: false,
    };

    // 3. Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { store_permissions: true }, // Only fetch what we need
    });

    if (existingUser) {
      // 🛡️ GUARD: Check if store_id already exists in permissions
      const existingPermission = existingUser.store_permissions?.find(
        (p) => p.store_id === store_id,
      );

      if (existingPermission) {
        if (existingPermission.is_active) {
          return {
            success: false,
            error: "User is already an active member of this store.",
          };
        } else {
          return {
            success: false,
            error: "User has already been invited and is pending acceptance.",
          };
        }
      }

      // 4a. Update existing user (safe to add new permission)
      const updatedPermissions = [
        ...(existingUser.store_permissions || []),
        { store_id, role, is_active: false },
      ];

      await prisma.user.update({
        where: { email },
        data: { store_permissions: updatedPermissions },
      });
    } else {
      // 4b. Create a new user
      await prisma.user.create({
        data: {
          email: email,
          store_permissions: [{ store_id, role, is_active: false }],
        },
      });
    }

    // 5. Revalidate the page so the UI updates immediately
    revalidatePath(`/admin/${store_id}/settings`);

    return { success: true, message: "Member added successfully." };
  } catch (error) {
    console.error("Failed to add member:", error);
    return { success: false, error: "Could not add member to the store." };
  }
}
