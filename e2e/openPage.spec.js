import { test, expect } from "@playwright/test";

test("page opens", async ({ page }) => {
  const response = await page.goto("http://localhost:5173/");
  expect(response).not.toBeNull();
  expect(response?.ok()).toBeTruthy();
});
