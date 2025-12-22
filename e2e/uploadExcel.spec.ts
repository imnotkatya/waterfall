import { test, expect } from '@playwright/test';

test('waterfall svg load e2e test', async ({ page }) => {

  await page.goto('http://localhost:5173/');
  await page.getByText('Нажмите в любом месте или перетащите Excel файл').click();
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('dist/waterfall.xlsx');
  await expect(page.locator('svg')).toBeVisible();


});