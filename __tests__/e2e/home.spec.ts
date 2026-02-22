import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page and show the typing area', async ({ page }) => {
    await page.goto('/');

    // Increased timeout for client-side hydration and compilation
    await expect(page.getByText('quicktype')).toBeVisible({ timeout: 30000 });

    // Check for the first word in the typing area
    await expect(page.locator('.word').first()).toBeVisible({ timeout: 30000 });
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.goto('/');

    // Wait for the settings link to be visible (it's in the header)
    const settingsLink = page.locator('a[href="/settings"]');
    await settingsLink.waitFor({ state: 'visible', timeout: 30000 });
    await settingsLink.click();

    // Verify we are on the settings page
    await expect(page).toHaveURL(/.*\/settings/, { timeout: 30000 });

    // The settings page DOES have an h1
    await expect(page.locator('h1')).toContainText(/settings/i, { timeout: 30000 });
  });
});
