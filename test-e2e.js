const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');

async function testFrontend() {
  console.log('1. Starting Vite preview server...');
  const vite = spawn('npx.cmd', ['vite', 'preview', '--port', '5173'], {
    cwd: 'd:\\GitHub\\Kalaganaka\\frontend',
    shell: true
  });

  vite.stdout.on('data', (d) => process.stdout.write('[Vite] ' + d));
  vite.stderr.on('data', (d) => process.stderr.write('[Vite Err] ' + d));

  await new Promise((r) => setTimeout(r, 2500));

  console.log('2. Launching Chrome with puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const logs = [];
  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    logs.push(`[CONSOLE ${type.toUpperCase()}] ${text}`);
    console.log(`[CONSOLE ${type.toUpperCase()}] ${text}`);
  });

  page.on('pageerror', (err) => {
    logs.push(`[PAGE ERROR] ${err.toString()}`);
    console.error(`[PAGE ERROR]`, err);
  });

  page.on('requestfailed', (req) => {
    logs.push(`[REQUEST FAILED] ${req.url()} - ${req.failure().errorText}`);
    console.warn(`[REQUEST FAILED] ${req.url()}: ${req.failure().errorText}`);
  });

  console.log('3. Navigating to http://localhost:5173...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 15000 });
  } catch (e) {
    console.log('Navigation event:', e.message);
  }

  await new Promise((r) => setTimeout(r, 2000));

  // Take screenshot of Guide view
  await page.screenshot({ path: 'd:\\GitHub\\Kalaganaka\\guide-view.png' });
  console.log('Screenshot saved: guide-view.png');

  // Click on "3D Simulator" button
  console.log('4. Switching to 3D Simulator view...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const simBtn = buttons.find(b => b.textContent.includes('3D Simulator'));
    if (simBtn) simBtn.click();
    else if (window.useKalaStore) window.useKalaStore.getState().setActiveAppView('SIMULATOR');
  });

  await new Promise((r) => setTimeout(r, 3000));

  // Check canvas presence and bounding box
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { found: false };
    const rect = canvas.getBoundingClientRect();
    return {
      found: true,
      width: rect.width,
      height: rect.height,
      visible: rect.width > 0 && rect.height > 0
    };
  });
  console.log('Canvas diagnostic:', canvasInfo);

  // Take screenshot of Simulator view
  await page.screenshot({ path: 'd:\\GitHub\\Kalaganaka\\simulator-view.png' });
  console.log('Screenshot saved: simulator-view.png');

  // Test opening the Loupe
  console.log('5. Testing Shadow Reading Loupe...');
  await page.evaluate(() => {
    if (window.useKalaStore) window.useKalaStore.getState().openLoupe();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'd:\\GitHub\\Kalaganaka\\loupe-view.png' });
  console.log('Screenshot saved: loupe-view.png');

  await browser.close();
  vite.kill();
  console.log('Done test!');
}

testFrontend().catch(console.error);
