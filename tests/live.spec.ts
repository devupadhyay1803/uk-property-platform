import { test, expect } from '@playwright/test';

test.describe('Live Site E2E Tests', () => {
  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    // Verify the hero text exists
    await expect(page.locator('h1')).toContainText('Find your next home');
    
    // Check navigation links
    await expect(page.getByRole('link', { name: 'Find a property', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in', exact: true }).first()).toBeVisible();
  });

  test('Properties page loads and search filters appear', async ({ page }) => {
    await page.goto('/properties');
    
    // Check for search filters
    await expect(page.getByRole('searchbox', { name: 'Keyword' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
    
    // Should display properties (or empty state if none, but at least the layout)
    await expect(page.locator('h1')).toContainText('Properties to let');
  });

  test('Login page renders and allows interactions', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login form elements
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    
    // Attempt invalid login to ensure the database/auth connection handles it gracefully on the frontend
    await page.getByRole('textbox', { name: 'Email' }).fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for error state
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 });
  });
});
