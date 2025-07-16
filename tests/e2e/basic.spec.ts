import { test, expect } from '@playwright/test';

test('basic page loads', async ({ page }) => {
  await page.goto('/');

  // Check that the main heading is present
  await expect(page.locator('h1')).toContainText('Tiptop Rich Text Editor');

  // Check that the editor placeholder is present
  await expect(
    page.locator('text=Editor will be initialized here')
  ).toBeVisible();
});

test('has correct page title', async ({ page }) => {
  await page.goto('/');

  // Check page title
  await expect(page).toHaveTitle(/Tiptop/);
});
