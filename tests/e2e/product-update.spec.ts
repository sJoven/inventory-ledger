import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { prisma } from "@/src/lib/prisma";

test("user can update a product and the action is logged", async ({ page }) => {
  const { storeId, userId } = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "playwright", ".auth", "test-data.json"),
      "utf8",
    ),
  );

  const unique = Date.now();
  const seededProduct = await prisma.product.create({
    data: {
      store_id: storeId,
      name: `Seed Product ${unique}`,
      sku: `SEED-${unique}`,
      image: "https://placehold.co/300x300",
      description: "Seeded for Playwright",
      quantity: 10,
      price: 100,
    },
  });

  const updated = {
    name: `Updated Product ${unique}`,
    sku: `UPDATED-${unique}`,
    quantity: "25",
    price: "499",
    image: "https://placehold.co/600x600",
    description: "Updated by Playwright",
  };

  await page.goto(`/admin/${storeId}/products`);

  await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();

  const row = page.getByRole("row").filter({
    has: page.getByText(seededProduct.name),
  });

  await expect(row).toBeVisible();

  await row.getByTestId("product-actions").click();

  await page.getByRole("button", { name: /Edit Product/i }).click();

  await page.getByTestId("product-name").fill(updated.name);
  await page.getByTestId("product-sku").fill(updated.sku);
  await page.getByTestId("product-price").fill(updated.price);
  await page.getByTestId("product-quantity").fill(updated.quantity);
  await page.getByTestId("product-image").fill(updated.image);
  await page.getByTestId("product-description").fill(updated.description);

  await page.getByTestId("save-product-submit").click();

  await expect(page.getByTestId("save-product-submit")).toBeHidden();

  await expect(page.getByText(updated.name)).toBeVisible();
  await expect(page.getByText(updated.sku)).toBeVisible();

  await page.goto(`/admin/${storeId}/logs`);

  await expect(
    page.getByRole("heading", { name: /Store Activity Logs/i }),
  ).toBeVisible();

  const logRow = page.getByRole("row").filter({
    has: page.getByText(updated.name),
  });

  await expect(logRow).toContainText(/update/i);
  await expect(logRow).toContainText(updated.sku);
});
