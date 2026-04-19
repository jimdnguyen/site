/**
 * One-shot Playwright script to capture a full-page screenshot of the portfolio site.
 * Usage: node scripts/screenshot.js
 */
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  // Let reveal animations settle
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(__dirname, "../public/preview.png"),
    fullPage: false,
  });
  console.log("Screenshot saved to public/preview.png");
  await browser.close();
})();
