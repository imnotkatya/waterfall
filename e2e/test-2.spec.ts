import { test, expect } from '@playwright/test';

test('test by snapshot', async ({ page }) => {

  await page.goto('http://localhost:5173/');
  await page.getByText('Нажмите в любом месте или перетащите Excel файл Поддерживаются файлы .xlsx, .xls').click();


  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('dist/waterfall.xlsx');

  await expect(page.getByRole('img')).toMatchAriaSnapshot(`- img: /−\\d+ −\\d+ −\\d+ −\\d+ −\\d+ 0 \\d+ \\d+ \\d+ \\d+ \\d+ P21 P7 P5 P25 P15 P17 P3 P22 P11 P12 P13 P14 P19 P20 P10 P9 P8 P6 P18 P4 P2 P23 P16 P24 P1 first_category second_category third_category fourth_category/`);
});