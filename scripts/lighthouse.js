/**
 * Lighthouse audit against the production build.
 *
 * Usage:
 *   1. npm run build && npm run start (in another terminal)
 *   2. node scripts/lighthouse.js
 *
 * Requires Edge (or set LIGHTHOUSE_CHROME_PATH to a Chrome/Chromium binary).
 * Scores are printed per route; anything below 0.9 is listed as failing.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const lighthouse = require("lighthouse").default;
const puppeteer = require("puppeteer-core");

const CHROME_PATH =
  process.env.LIGHTHOUSE_CHROME_PATH ??
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const ROUTES = [
  ["home", "http://localhost:3000/"],
  ["project", "http://localhost:3000/work/suirikyou"],
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
  });
  const port = new URL(browser.wsEndpoint()).port;

  let failed = false;
  for (const [name, url] of ROUTES) {
    const result = await lighthouse(url, {
      port,
      output: "json",
      logLevel: "error",
    });
    const { categories, audits } = result.lhr;

    console.log(`\n=== ${name} (${url}) ===`);
    for (const key of ["performance", "accessibility", "best-practices", "seo"]) {
      const score = Math.round(categories[key].score * 100);
      if (score < 90) failed = true;
      console.log(`${key}: ${score}`);
    }
    console.log(
      `LCP: ${audits["largest-contentful-paint"].displayValue} | CLS: ${audits["cumulative-layout-shift"].displayValue} | TBT: ${audits["total-blocking-time"].displayValue}`,
    );

    const failures = Object.values(audits)
      .filter(
        (a) =>
          a.score !== null &&
          a.score < 0.9 &&
          a.scoreDisplayMode !== "notApplicable" &&
          a.scoreDisplayMode !== "informative",
      )
      .map((a) => `  - [${a.score?.toFixed(2)}] ${a.id}: ${a.title}`);
    if (failures.length) console.log("failing audits:\n" + failures.join("\n"));
  }

  await browser.close();
  process.exit(failed ? 1 : 0);
})();
