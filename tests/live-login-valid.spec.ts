import { test, expect } from '@playwright/test';

test('Valid login on Vercel', async ({ page }) => {
  await page.goto('https://uk-property-platform-six.vercel.app/login');
  
  await page.getByRole('textbox', { name: 'Your email' }).fill('admin@gmail.com');
  await page.getByLabel('Password').fill('password123');
  
  // Start tracking requests
  page.on('response', response => {
    if (response.url().includes('login')) {
      console.log('Response from server action:', response.status(), response.url());
    }
  });

  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Wait to see what happens
  await page.waitForTimeout(5000);
  
  // Try to figure out if it redirected or showed an error
  const currentUrl = page.url();
  console.log('Current URL after login:', currentUrl);
  
  const errorAlert = page.locator('[role="alert"]');
  if (await errorAlert.isVisible()) {
    console.log('Error displayed:', await errorAlert.textContent());
  }

  // Expect to be redirected to admin
  await expect(page).toHaveURL(/.*admin.*/, { timeout: 5000 });
});
