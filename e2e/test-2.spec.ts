import { test, expect } from '@playwright/test';

test('test things to be visible', async ({ page }) => {

  await page.goto('http://localhost:5173/');
  await expect(page.getByRole('heading', { name: 'Waterfall Plot' })).toBeVisible();
  await expect(page.getByText('Нажмите в любом месте или перетащите Excel файл Поддерживаются файлы .xlsx, .xls')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Пример графика' })).toBeVisible();
  await expect(page.getByText('Для работы с данной программой нужно')).toBeVisible();
  await page.getByText('Нажмите в любом месте или перетащите Excel файл Поддерживаются файлы .xlsx, .xls').click();

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('dist/data.json');
  await expect(page.getByRole('heading', { name: 'Waterfall Plot' })).toBeVisible();
  await expect(page.getByText('first_category')).toBeVisible();
  await expect(page.getByText('second_category')).toBeVisible();
  await expect(page.getByText('third_category')).toBeVisible();
  await expect(page.getByText('fourth_category')).toBeVisible();
  await expect(page.getByRole('img')).toBeVisible();
});