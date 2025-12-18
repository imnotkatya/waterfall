import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByText('Нажмите в любом месте или перетащите Excel файл').click();
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('dist/waterfall.xlsx');
  await expect(page.locator('rect').first()).toBeVisible();

  await expect(page.locator('rect').nth(4)).toBeVisible();

  await expect(page.locator('rect:nth-child(11)')).toBeVisible();


  await expect(page.locator('.legend-rect').first()).toBeVisible();
  await expect(page.locator('rect:nth-child(2)')).toBeVisible();


  await expect(page.getByRole('img')).toContainText('Change,%');
  await expect(page.getByRole('img')).toContainText('Patients (N= 92)');
  await expect(page.locator('g').filter({ hasText: '−100−80−60−40−' }).locator('path')).toBeVisible();
  await expect(page.getByRole('heading')).toContainText('Waterfall Plot');
  await expect(page.getByRole('img')).toContainText('P21');



const barsAmount = page.locator('.bars');
await expect(barsAmount).toHaveCount(25);

const barsTitle = page.locator('.bar-labels');
await expect(barsTitle).toHaveCount(25);

const legendSquares = page.locator('.legend-rect');
await expect(legendSquares).toHaveCount(4);

const legendLabel = page.locator('.legend-label');
await expect(legendLabel).toHaveCount(4);
const axisPlusTicks = page.locator(' .tick line');
await expect(axisPlusTicks).toHaveCount(11);


const count = await legendSquares.count();


let  colors = new Set();
for (let i = 0; i < count; i++) {
  const color = await legendSquares.nth(i).getAttribute('fill');
  if (color) colors.add(color);
}

expect(colors.size).toBe(4);
})