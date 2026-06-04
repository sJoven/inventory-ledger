import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";

interface InvitationResult {
  store_id: string;
  store_name: string;
  role: string;
}

export async function getPendingInvitations(): Promise<InvitationResult[]> {
  const session = await auth();
  const userId = session?.user?.userid;

  if (!userId) {
    return [];
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        store_permissions: true,
      },
    });

    if (!user || !user.store_permissions) {
      return [];
    }

    const pendingPermissions = user.store_permissions.filter(
      (permission) => permission.is_active === false,
    );

    if (pendingPermissions.length === 0) {
      return [];
    }

    const storeIds = pendingPermissions.map((p) => p.store_id);

    const stores = await prisma.store.findMany({
      where: {
        id: { in: storeIds },
      },
      select: {
        id: true,
        store_name: true,
      },
    });

    const storeNameMap = new Map(stores.map((s) => [s.id, s.store_name]));

    return pendingPermissions.map((permission) => ({
      store_id: permission.store_id,
      store_name: storeNameMap.get(permission.store_id) || "Unknown Store",
      role: permission.role,
    }));
  } catch (error) {
    console.error("Error fetching pending invitations:", error);
    return [];
  }
}
