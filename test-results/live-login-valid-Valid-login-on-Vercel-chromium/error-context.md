# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: live-login-valid.spec.ts >> Valid login on Vercel
- Location: tests/live-login-valid.spec.ts:3:5

# Error details

```
Error: locator.isVisible: Error: strict mode violation: locator('[role="alert"]') resolved to 2 elements:
    1) <p role="alert" class=" bg-red-50 p-3 text-sm text-red-700">Invalid email or password.</p> aka getByText('Invalid email or password.')
    2) <div role="alert" aria-live="assertive" id="__next-route-announcer__"></div> aka locator('[id="__next-route-announcer__"]')

Call log:
    - checking visibility of locator('[role="alert"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img "Luxury UK Property" [ref=e6]
      - generic [ref=e8]:
        - heading "Find Your Perfect Property Today" [level=2] [ref=e9]: Find Your PerfectProperty Today
        - paragraph [ref=e10]: Join the UK's premier platform and start exploring the best real estate opportunities tailored to your luxury lifestyle.
    - generic [ref=e11]:
      - link "← Back to site" [ref=e12] [cursor=pointer]:
        - /url: /
      - generic [ref=e13]:
        - link [ref=e14] [cursor=pointer]:
          - /url: /
        - heading "Sign In" [level=1] [ref=e20]
        - paragraph [ref=e21]: Welcome back! Please enter your details to access your portal.
      - generic [ref=e22]:
        - generic [ref=e23]:
          - generic [ref=e24]: Your email
          - textbox "Your email" [ref=e25]:
            - /placeholder: jane.doe@example.com
        - generic [ref=e26]:
          - generic [ref=e27]: Password
          - textbox "Password" [ref=e28]:
            - /placeholder: ••••••••
        - alert [ref=e29]: Invalid email or password.
        - button "Sign In" [ref=e30]
      - paragraph [ref=e31]:
        - text: Don't have an account?
        - link "Sign up" [ref=e32] [cursor=pointer]:
          - /url: /login
      - generic [ref=e33]: Or
      - generic [ref=e37]:
        - button "Google" [ref=e38]
        - button "Apple" [ref=e39]
  - alert [ref=e40]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Valid login on Vercel', async ({ page }) => {
  4  |   await page.goto('https://uk-property-platform-six.vercel.app/login');
  5  |   
  6  |   await page.getByRole('textbox', { name: 'Your email' }).fill('admin@gmail.com');
  7  |   await page.getByLabel('Password').fill('password123');
  8  |   
  9  |   // Start tracking requests
  10 |   page.on('response', response => {
  11 |     if (response.url().includes('login')) {
  12 |       console.log('Response from server action:', response.status(), response.url());
  13 |     }
  14 |   });
  15 | 
  16 |   await page.getByRole('button', { name: 'Sign In' }).click();
  17 |   
  18 |   // Wait to see what happens
  19 |   await page.waitForTimeout(5000);
  20 |   
  21 |   // Try to figure out if it redirected or showed an error
  22 |   const currentUrl = page.url();
  23 |   console.log('Current URL after login:', currentUrl);
  24 |   
  25 |   const errorAlert = page.locator('[role="alert"]');
> 26 |   if (await errorAlert.isVisible()) {
     |                        ^ Error: locator.isVisible: Error: strict mode violation: locator('[role="alert"]') resolved to 2 elements:
  27 |     console.log('Error displayed:', await errorAlert.textContent());
  28 |   }
  29 | 
  30 |   // Expect to be redirected to admin
  31 |   await expect(page).toHaveURL(/.*admin.*/, { timeout: 5000 });
  32 | });
  33 | 
```