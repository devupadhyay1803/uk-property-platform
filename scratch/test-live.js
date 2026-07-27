const url = 'https://uk-property-platform-six.vercel.app';

async function runTests() {
  console.log(`Starting Lightweight E2E checks against ${url}...\n`);
  let passed = 0;
  let failed = 0;

  async function check(name, endpoint, expectedText) {
    try {
      const res = await fetch(url + endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (expectedText && !text.includes(expectedText)) {
        throw new Error(`Missing expected text: "${expectedText}"`);
      }
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.log(`❌ FAIL: ${name} - ${e.message}`);
      failed++;
    }
  }

  await check('Homepage Loads', '/', 'Find your next home');
  await check('Properties Page Loads', '/properties', 'Find a property');
  await check('Login Page Loads', '/login', 'Sign in to your account');
  await check('About Page Loads', '/about', 'About UK Property');

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
}

runTests();
