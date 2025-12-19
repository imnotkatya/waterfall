import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
 
  await page.goto('http://localhost:5173/');
  await page.getByText('Нажмите в любом месте или перетащите Excel файл Поддерживаются файлы .xlsx, .xls').click();



  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('dist/data.json');
await expect(page.getByRole('img'))
  .toMatchAriaSnapshot(`- img: /Patients\\s*\\(N=\\s*\\d+\\)\\s*Change,%\\s*−\\d+\\s*−\\d+\\s*−\\d+\\s*−\\d+\\s*−\\d+\\s*0\\s*\\d+\\s*\\d+\\s*\\d+\\s*\\d+\\s*\\d+\\s*P21\\s*P7\\s*P5\\s*P25\\s*P15\\s*P17\\s*P3\\s*P22\\s*P11\\s*P12\\s*P13\\s*P14\\s*P19\\s*P20\\s*P10\\s*P9\\s*P8\\s*P6\\s*P18\\s*P4\\s*P2\\s*P23\\s*P16\\s*P24\\s*P1\\s*first_category\\s*second_category\\s*third_category\\s*fourth_category/`)
  await expect(page.getByRole('img')).toBeVisible();
});