import { adminAccess } from "@/src/lib/access";
import { prisma } from "@/src/lib/prisma";
import { isLoggedIn } from "./isLoggedIn";

export async function canAdmin(store_id: string, permission: string) {
  const managerPermissions: string[] = [
    "view_reports",
    "revert",
    "create_products",
    "delete_products",
    "update_products",
  ];
  const clerkPermissions: string[] = [
    "view_reports",
    "create_products",
    "update_products",
  ];

  // Call adminAccess and store it
  const userRoles = await adminAccess();

  // If userRoles is null, return status 403
  if (!userRoles) {
    return { status: 403 };
  }

  // Check if store_id parameter is in the userRoles
  const storeAccess = userRoles.find((store) => store.store_id === store_id);

  // If not found, return status 403
  if (!storeAccess) {
    return { status: 403 };
  }

  // If role is "super", return status 200 immediately
  if (storeAccess.role === "super") {
    return { status: 200 };
  }

  // Check if the permission is inside the specific role array
  let isAllowed = false;

  if (storeAccess.role === "manager") {
    isAllowed = managerPermissions.includes(permission);
  } else if (storeAccess.role === "clerk") {
    isAllowed = clerkPermissions.includes(permission);
  }

  // If found in the array return 200, else 403
  if (isAllowed) {
    return { status: 200 };
  }

  return { status: 403 };
}

//2nd function canClient
export async function canClient(store_id: string) {
  // 1. Get the session and extract the userId
  const session = await isLoggedIn();

  if (!session || !session.user) {
    return { status: 403 };
  }

  const userId = session.user.userid;

  // 2. Look for the user's .is_client field in the database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { is_client: true },
  });

  // If the user doesn't exist or doesn't have the is_client array, deny access
  if (!user || !Array.isArray(user.is_client)) {
    return { status: 403 };
  }

  // 3. Check if the parameter store_id is inside the array of store_id
  const isFound = user.is_client.includes(store_id);

  // 4. Return the corresponding status
  if (isFound) {
    return { status: 200 };
  }

  return { status: 403 };
}

export async function canShowAdmin(store_id: string, permission: string) {
  const managerPermissions: string[] = [
    "view_reports", //test
    "logs",
    "dashboard",
    "report",
    "revenue",
    "low_stock",
    "trend",
    "products",
    "order",
  ];
  const clerkPermissions: string[] = [
    "revenue",
    "low_stock",
    "trend",
    "dashboard",
    "products",
  ];

  // Fetch the current session
  const session = await isLoggedIn();

  if (!session || !session.user || !Array.isArray(session.user.is_admin)) {
    return { status: 403 };
  }

  const storeAccess = session.user.is_admin.find(
    (store: { store_id: string; role: string }) => store.store_id === store_id,
  );

  if (!storeAccess) {
    return { status: 403 };
  }
  if (storeAccess.role === "super") {
    return { status: 200 };
  }

  let isAllowed = false;

  if (storeAccess.role === "manager") {
    isAllowed = managerPermissions.includes(permission);
  } else if (storeAccess.role === "clerk") {
    isAllowed = clerkPermissions.includes(permission);
  }

  if (!isAllowed) {
    return { status: 403 };
  }

  return { status: 200 };
}

export async function canShowClient(store_id: string) {
  // 1. Fetch the current session
  const session = await isLoggedIn();

  // If there's no session or is_client is not an array, deny access
  if (!session || !session.user || !Array.isArray(session.user.is_client)) {
    return { status: 403 };
  }

  // 2. Check if the session.is_client contains the store_id from the parameter
  const isFound = session.user.is_client.includes(store_id);

  // 3. Return the corresponding status
  if (!isFound) {
    return { status: 403 };
  }

  return { status: 200 };
}
