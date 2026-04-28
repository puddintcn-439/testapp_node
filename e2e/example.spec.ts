import { test, expect } from '@playwright/test';

test('API docs loads', async ({ page }) => {
  await page.goto('http://localhost:3000/api-docs/');
  await expect(page).toHaveTitle(/Swagger|API/);
});
