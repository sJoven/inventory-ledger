import { test as setup, expect } from "@playwright/test";
import path from "path";
import { prisma } from "@/src/lib/prisma";
import fs from "fs";

const authFile = path.join(process.cwd(), "playwright", ".auth", "user.json");
console.log("Playwright DATABASE_URL:", process.env.DATABASE_URL);
setup("authenticate", async ({ page }) => {
  if (!process.env.DATABASE_URL?.includes("withered-band-aohzslu5-pooler")) {
    throw new Error("Refusing to run Playwright against a non-test database.");
  }
  const user = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      name: "Test Admin",
    },
  });
  const store = await prisma.store.create({
    data: {
      store_name: "Test Store",
      owner_id: user.id,
    },
  });

  await prisma.storePermission.create({
    data: {
      user_id: user.id,
      store_id: store.id,
      role: "super",
      is_active: true,
    },
  });

  const dataPath = path.join(
    process.cwd(),
    "playwright",
    ".auth",
    "test-data.json",
  );

  fs.writeFileSync(
    dataPath,
    JSON.stringify({
      userId: user.id,
      storeId: store.id,
    }),
  );

  await page.goto("/login");

  await page.getByTestId("playwright-login").click();

  await expect
    .poll(async () => {
      const res = await page.request.get("/api/test/check-session");
      const json = await res.json();
      return json.authenticated;
    })
    .toBe(true);

  fs.mkdirSync(path.dirname(authFile), {
    recursive: true,
  });

  await page.context().storageState({
    path: authFile,
  });
});
