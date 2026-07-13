import { test, expect } from "@playwright/test";

test("Auth.js session is valid", async ({ page }) => {
  const response = await page.request.get("/api/test/check-session");

  expect(response).not.toBeNull();
  expect(response!.ok()).toBeTruthy();

  const json = await response!.json();

  expect(json.authenticated).toBe(true);

  expect(json.user).toBeDefined();
  expect(json.user.email).toBe("admin@test.com");
  expect(json.user.userid).toBeTruthy();

  expect(Array.isArray(json.user.is_admin)).toBe(true);
  expect(json.user.is_admin).toContainEqual(
    expect.objectContaining({
      role: "super",
    }),
  );
  await page.goto("/login");
});
