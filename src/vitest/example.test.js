import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { chromium } from "playwright";

describe("Waterfall Plot integration tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Загрузка Excel файла", async () => {
    await page.goto("http://localhost:5173/");

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles("dist/waterfall.xlsx");

    await page.waitForTimeout(2000);

    const svg = await page.locator("svg");
    expect(svg).not.toBeNull();

    const img = await page.locator("img");
    expect(img).not.toBeNull();

    const heading = await page.locator("h1");
    const headingText = await heading?.textContent();
    expect(headingText).toBe("Waterfall Plot");

    const bodyText = await page.textContent("body");
    expect(bodyText).toContain("first_category");
    expect(bodyText).toContain("second_category");
    expect(bodyText).toContain("third_category");
    expect(bodyText).toContain("fourth_category");

    expect(bodyText).toContain("Change,%");
    expect(bodyText).toMatch("Patients (N= 92)");

    expect(bodyText).toContain("P21");
    expect(bodyText).toContain("P1");
  });
});
