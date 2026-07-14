import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { prisma } from "@/src/lib/prisma";

test("user can delete a product and the action is logged", async ({ page }) => {
  const { storeId } = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "playwright", ".auth", "test-data.json"),
      "utf8",
    ),
  );

  const unique = Date.now();

  const product = await prisma.product.create({
    data: {
      store_id: storeId,
      name: `Delete Product ${unique}`,
      sku: `DELETE-${unique}`,
      image: "https://placehold.co/300x300",
      description: "Seeded for Playwright",
      quantity: 10,
      price: 100,
    },
  });

  await page.goto(`/admin/${storeId}/products`);

  await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();

  const row = page.getByRole("row").filter({
    has: page.getByText(product.name),
  });

  await expect(row).toBeVisible();

  await row.getByTestId("product-actions").click();

  await page.getByTestId("delete-product-btn").click();

  await page.getByTestId("delete-product-submit").click();

  await expect(page.getByTestId("delete-product-submit")).toBeHidden();
  await page.reload();
  await expect(page.getByText(product.name)).toHaveCount(0);
  await expect(page.getByText(product.sku)).toHaveCount(0);

  await page.goto(`/admin/${storeId}/logs`);

  await expect(
    page.getByRole("heading", { name: /Store Activity Logs/i }),
  ).toBeVisible();

  const logRow = page.getByRole("row").filter({
    has: page.getByText(product.name),
  });

  await expect(logRow).toContainText("delete");
  await expect(logRow).toContainText(product.sku);
});
