//Member Invitation

import { describe, test, expect, vi, beforeEach } from "vitest";
import { addMember } from "@/src/app/admin/[id]/settings/actions";
import { canAdmin } from "@/src/lib/canUser";
import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/src/lib/canUser", () => ({
  canAdmin: vi.fn(),
}));

describe("addMember - Integration Test", () => {
  const storeId = "member-test-store-id";
  const ownerId = "owner-user-id";

  beforeEach(async () => {
    vi.clearAllMocks();

    await prisma.storePermission.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.user.deleteMany({});

    await prisma.user.create({
      data: {
        id: ownerId,
        email: "owner@teststore.com",
      },
    });

    await prisma.store.create({
      data: {
        id: storeId,
        store_name: "Team Integration Store",
        owner_id: ownerId,
      },
    });
  });

  test("should successfully create a new user and a pending invite if email doesn't exist yet", async () => {
    vi.mocked(canAdmin).mockResolvedValueOnce({ status: 200 } as any);
    const targetEmail = "new-employee@example.com";

    const result = await addMember(targetEmail, storeId, "manager");

    expect(result).toEqual({
      success: true,
      message: "Member added successfully.",
    });
    expect(revalidatePath).toHaveBeenCalledWith(`/admin/${storeId}/settings`);

    const userOnDisk = await prisma.user.findUnique({
      where: { email: targetEmail },
    });
    expect(userOnDisk).not.toBeNull();

    const permissionOnDisk = await prisma.storePermission.findFirst({
      where: { user_id: userOnDisk!.id, store_id: storeId },
    });
    expect(permissionOnDisk).not.toBeNull();
    expect(permissionOnDisk?.role).toBe("manager");
    expect(permissionOnDisk?.is_active).toBe(false);
  });

  test("should successfully attach pending invite to an already existing user who has no store connection", async () => {
    vi.mocked(canAdmin).mockResolvedValueOnce({ status: 200 } as any);
    const targetEmail = "existing-shopper@example.com";

    const existingUser = await prisma.user.create({
      data: {
        id: "pre-existing-user-id",
        email: targetEmail,
      },
    });

    const result = await addMember(targetEmail, storeId, "clerk");

    expect(result).toEqual({
      success: true,
      message: "Member added successfully.",
    });

    const permissionOnDisk = await prisma.storePermission.findFirst({
      where: { user_id: existingUser.id, store_id: storeId },
    });
    expect(permissionOnDisk).not.toBeNull();
    expect(permissionOnDisk?.role).toBe("clerk");
    expect(permissionOnDisk?.is_active).toBe(false);
  });

  test("should block action with 403 response if administrator permission check fails", async () => {
    vi.mocked(canAdmin).mockResolvedValueOnce({ status: 403 } as any);

    const result = await addMember("anyone@test.com", storeId, "clerk");

    expect(result).toEqual({
      success: false,
      error: "Forbidden: You do not have permission to add members.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  test("should reject request early if role string fails client validation criteria", async () => {
    vi.mocked(canAdmin).mockResolvedValueOnce({ status: 200 } as any);

    const result = await addMember(
      "valid-email@test.com",
      storeId,
      "hacker-role",
    );

    expect(result).toEqual({
      success: false,
      error: "Invalid role. Must be 'super', 'manager', or 'clerk'.",
    });
  });

  test("should flag error if targeted email is already an active member", async () => {
    vi.mocked(canAdmin).mockResolvedValueOnce({ status: 200 } as any);
    const targetEmail = "active-clerk@example.com";

    const activeUser = await prisma.user.create({
      data: { email: targetEmail },
    });

    await prisma.storePermission.create({
      data: {
        user_id: activeUser.id,
        store_id: storeId,
        role: "clerk",
        is_active: true,
      },
    });

    const result = await addMember(targetEmail, storeId, "manager");

    expect(result).toEqual({
      success: false,
      error: "User is already an active member of this store.",
    });
  });

  test("should flag error if targeted email already has a pending invitation pending acceptance", async () => {
    vi.mocked(canAdmin).mockResolvedValueOnce({ status: 200 } as any);
    const targetEmail = "waiting-clerk@example.com";

    const pendingUser = await prisma.user.create({
      data: { email: targetEmail },
    });

    await prisma.storePermission.create({
      data: {
        user_id: pendingUser.id,
        store_id: storeId,
        role: "clerk",
        is_active: false,
      },
    });

    const result = await addMember(targetEmail, storeId, "clerk");

    expect(result).toEqual({
      success: false,
      error: "User has already been invited and is pending acceptance.",
    });
  });

  test("should catch database unexpected crashes safely without leaking logs to stdout", async () => {
    vi.mocked(canAdmin).mockResolvedValueOnce({ status: 200 } as any);

    const dbSpy = vi
      .spyOn(prisma.user, "findUnique")
      .mockRejectedValueOnce(
        new Error("Database connection dropped timed out."),
      );

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await addMember("crash@test.com", storeId, "clerk");

    expect(result).toEqual({
      success: false,
      error: "Could not add member to the store.",
    });
    errorSpy.mockRestore();
    dbSpy.mockRestore();
  });
});
