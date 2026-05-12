import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { cache } from "react";

export const getStoreAccess = cache(async (storeId: string) => {
  if (!storeId || typeof storeId !== "string") {
    return { authorized: false, status: 400 } as const;
  }

  const session = await auth();

  // 1. Check if user is logged in
  if (!session?.user?.id) {
    return {
      authorized: false,
      status: 401, // Unauthorized
      redirectTo: "/login",
    } as const;
  }

  const userId = session.user.id;

  const [store, dbUser] = await Promise.all([
    prisma.store.findUnique({ where: { id: storeId } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, store_permissions: true },
    }),
  ]);

  // 2. Check if store exists
  if (!store) {
    return { authorized: false, status: 404 } as const;
  }

  const permission = dbUser?.store_permissions.find(
    (p) => p.store_id === storeId,
  );
  const isOwner = store.owner_id === userId;

  // 3. Check permissions
  if (!isOwner) {
    if (!permission || permission.is_active === false) {
      return {
        authorized: false,
        status: 403,
        message: permission
          ? "Your account is deactivated for this store."
          : "No access.",
      } as const;
    }
  }

  return {
    authorized: true,
    status: 200,
    userId,
    userName: dbUser?.name,
    store,
    //Possible: Owner, Manager, Clerk
    role: isOwner ? "Owner" : permission?.role || "Clerk",
  } as const;
});
