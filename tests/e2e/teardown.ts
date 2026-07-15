import { prisma } from "@/src/lib/prisma";
import fs from "fs";
import path from "path";

async function globalTeardown() {
  if (!process.env.DATABASE_URL?.includes("withered-band-aohzslu5-pooler")) {
    throw new Error("Refusing to teardown a non-test database.");
  }

  const dataPath = path.join(
    process.cwd(),
    "playwright",
    ".auth",
    "test-data.json",
  );

  if (!fs.existsSync(dataPath)) {
    return;
  }

  const { userId, storeId } = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  try {
    await prisma.$transaction(async (tx) => {
      // Remove logs
      await tx.activityLog.deleteMany({
        where: {
          store_id: storeId,
        },
      });

      // Remove products
      await tx.product.deleteMany({
        where: {
          store_id: storeId,
        },
      });

      // Remove permissions
      await tx.storePermission.deleteMany({
        where: {
          store_id: storeId,
        },
      });

      // Remove store
      await tx.store.delete({
        where: {
          id: storeId,
        },
      });

      // Remove user
      await tx.user.delete({
        where: {
          id: userId,
        },
      });
    });

    console.log("✓ Playwright test data cleaned up.");
  } catch (err) {
    console.error("Playwright teardown failed:", err);
  } finally {
    await prisma.$disconnect();

    // Remove auth files
    fs.rmSync(path.join(process.cwd(), "playwright", ".auth"), {
      recursive: true,
      force: true,
    });
  }
}

export default globalTeardown;
