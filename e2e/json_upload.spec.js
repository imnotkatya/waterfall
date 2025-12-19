import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page
    .getByText("Нажмите в любом месте или перетащите Excel файл")
    .click();
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles("dist/data.json");
  await expect(page.locator("rect").first()).toBeVisible();
  await expect(page.locator("rect").nth(4)).toBeVisible();
  await expect(page.locator("rect:nth-child(11)")).toBeVisible();
  await expect(page.locator(".legend-rect").first()).toBeVisible();
  await expect(page.locator("rect:nth-child(2)")).toBeVisible();
  await expect(page.getByRole("img")).toContainText("Change,%");
  await expect(page.getByRole("img")).toContainText("Patients (N= 92)");
  await expect(
    page.locator("g").filter({ hasText: "−100−80−60−40−" }).locator("path")
  ).toBeVisible();
  await expect(page.getByRole("heading")).toContainText("Waterfall Plot");
  await expect(page.getByRole("img")).toContainText("P21");
});
