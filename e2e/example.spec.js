// @ts-check
import { test, expect } from "@playwright/test";

test("страница  открывается", async ({ page }) => {
  const response = await page.goto("http://localhost:5173/");

  expect(response).not.toBeNull();
  expect(response?.ok()).toBeTruthy();
});
