import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test("user can create a product and the action is logged", async ({ page }) => {
  const { storeId } = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "playwright", ".auth", "test-data.json"),
      "utf8",
    ),
  );

  const unique = Date.now();

  const product = {
    name: `Playwright Product ${unique}`,
    sku: `PW-${unique}`,
    price: "199",
    quantity: "12",
    image: "https://placehold.co/300x300",
    description: "Created by Playwright",
  };

  await page.goto(`/admin/${storeId}/products`);

  await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();

  await page.getByTestId("add-product-btn").click();

  await page.getByTestId("product-name").fill(product.name);
  await page.getByTestId("product-sku").fill(product.sku);
  await page.getByTestId("product-price").fill(product.price);
  await page.getByTestId("product-quantity").fill(product.quantity);
  await page.getByTestId("product-image").fill(product.image);
  await page.getByTestId("product-description").fill(product.description);

  await page.getByTestId("create-product-submit").click();

  await expect(page.getByTestId("create-product-submit")).toBeHidden();

  await expect(page.getByText(product.name)).toBeVisible();
  await expect(page.getByText(product.sku)).toBeVisible();

  await page.goto(`/admin/${storeId}/logs`);

  await expect(
    page.getByRole("heading", { name: /Store Activity Logs/i }),
  ).toBeVisible();

  const row = page.getByRole("row").filter({
    has: page.getByText(product.name),
  });

  await expect(row).toContainText("create");
  await expect(row).toContainText(product.sku);
});
