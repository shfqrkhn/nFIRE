import { test, expect } from "@playwright/test";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = path.resolve(".");
const types = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".txt", "text/plain; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"]
]);

let server;
let baseUrl;

async function attachRuntimeGuards(page) {
  const failures = [];
  page.on("dialog", async (dialog) => {
    failures.push(`browser dialog opened: ${dialog.type()} ${dialog.message()}`);
    await dialog.dismiss();
  });
  page.on("pageerror", (error) => failures.push(`page error: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`console error: ${message.text()}`);
  });
  await page.addInitScript(() => {
    for (const name of ["alert", "confirm", "prompt"]) {
      window[name] = () => {
        throw new Error(`Browser popup API called: ${name}`);
      };
    }
  });
  return failures;
}

async function openApp(page, { welcomeSeen = false } = {}) {
  await page.addInitScript((seen) => {
    if (seen) localStorage.setItem("nfire_welcome_seen", "true");
  }, welcomeSeen);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).not.toContainText("nFIRE :: SYSTEM LOADING");
}

async function expectUsableApp(page) {
  await expect(page.locator("#root")).toBeVisible();
  await expect(page.locator("body")).toContainText(/CONTROL PANEL|TARGET|SOLVENCY ENGINE/);
  await expect(page.locator("body")).toContainText(/Planning aid only/);

  const readMetrics = () => page.evaluate(() => {
    const isVisible = (el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    };
    const visibleControlName = (control) => {
      const id = control.getAttribute("id");
      const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
      return [
        control.getAttribute("aria-label"),
        control.getAttribute("title"),
        control.textContent,
        label?.textContent,
        control.closest("label")?.textContent,
        control.getAttribute("placeholder")
      ]
        .map((value) => (value || "").replace(/\s+/g, " ").trim())
        .find(Boolean);
    };
    const controls = [
      ...document.querySelectorAll("button, [role='button'], a, input:not([type='hidden']), select, textarea")
    ].filter((control) => isVisible(control) && control.getAttribute("aria-hidden") !== "true");
    const unnamedControls = controls
      .filter((control) => !visibleControlName(control))
      .map((control) => {
        const rect = control.getBoundingClientRect();
        return `${control.tagName.toLowerCase()} ${control.className || ""} ${Math.round(rect.width)}x${Math.round(rect.height)}`.trim();
      });
    return {
      bodyHeight: document.body.scrollHeight,
      focusableCount: controls.filter((control) => !control.disabled && control.tabIndex !== -1).length,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      unnamedControls
    };
  });

  await expect.poll(async () => (await readMetrics()).unnamedControls, {
    message: "all visible controls should have an accessible name after the UI settles",
    timeout: 5000
  }).toEqual([]);

  const metrics = await readMetrics();

  expect(metrics.bodyHeight).toBeGreaterThan(400);
  expect(metrics.focusableCount).toBeGreaterThan(5);
  expect(metrics.horizontalOverflow).toBeLessThanOrEqual(2);
}

async function tabUntilFocused(page, searchTerms, label) {
  const terms = searchTerms.map((term) => term.toLowerCase());
  for (let index = 0; index < 80; index += 1) {
    const matched = await page.evaluate((expected) => {
      const el = document.activeElement;
      if (!el || el === document.body) return false;
      const id = el.getAttribute("id");
      const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
      const sources = [
        el.getAttribute("aria-label"),
        el.getAttribute("title"),
        el.getAttribute("placeholder"),
        el.textContent,
        label?.textContent,
        el.closest("label")?.textContent
      ].map((value) => (value || "").replace(/\s+/g, " ").trim().toLowerCase());
      return expected.some((term) => sources.some((source) => source.includes(term)));
    }, terms);
    if (matched) return;
    await page.keyboard.press("Tab");
  }
  throw new Error(`Could not focus ${label} with keyboard-only tab navigation`);
}

test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    const requestPath = decodeURIComponent(new URL(req.url || "/", "http://localhost").pathname)
      .replace(/^\/+/, "") || "index.html";
    const file = path.resolve(root, requestPath);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": types.get(path.extname(file)) || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}/`;
});

test.afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("first-run onboarding can be completed without blocking the app", async ({ page }) => {
  const failures = await attachRuntimeGuards(page);
  await openApp(page);

  await expect(page.getByRole("button", { name: /initialize/i })).toBeVisible();
  await page.getByRole("button", { name: /initialize/i }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expectUsableApp(page);

  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName || "");
  expect(focused).not.toBe("BODY");
  expect(failures).toEqual([]);
});

test("planning controls, export/import, reset confirmation, and reload stay usable", async ({ page }) => {
  const failures = await attachRuntimeGuards(page);
  await openApp(page, { welcomeSeen: true });
  await expectUsableApp(page);

  await page.getByLabel(/Annual Income/i).fill("95000");
  await page.getByLabel(/Current Age/i).fill("33");
  await page.keyboard.press("Tab");
  await expect(page.locator("body")).toContainText(/TARGET|nFIRE DATE/);

  const downloadPromise = page.waitForEvent("download");
  await page.getByTitle("Export JSON").click();
  const download = await downloadPromise;
  const exportedPath = await download.path();
  expect(exportedPath).toBeTruthy();
  expect(download.suggestedFilename()).toMatch(/\.json$/);

  await page.locator("input[type='file']").setInputFiles(exportedPath);
  await expectUsableApp(page);

  await page.getByRole("button", { name: /restore default planning data/i }).click();
  await expect(page.getByRole("status")).toContainText(/Press reset again/i);
  await expectUsableApp(page);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expectUsableApp(page);
  expect(failures).toEqual([]);
});

test("single-input keyboard-only path initializes and edits planning inputs", async ({ page }) => {
  const failures = await attachRuntimeGuards(page);
  await openApp(page);

  await page.keyboard.press("Tab");
  await tabUntilFocused(page, ["initialize"], "initialize button");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expectUsableApp(page);

  await tabUntilFocused(page, ["annual income"], "Annual Income input");
  await page.keyboard.press("Control+A");
  await page.keyboard.type("97000");
  await page.keyboard.press("Tab");
  await expect(page.locator("body")).toContainText(/TARGET|nFIRE DATE/);
  await expectUsableApp(page);
  expect(failures).toEqual([]);
});

test("single-input pointer path initializes, exports, and recovers without shortcuts", async ({ page }) => {
  const failures = await attachRuntimeGuards(page);
  await openApp(page);

  await page.getByRole("button", { name: /initialize/i }).click();
  await expectUsableApp(page);

  const downloadPromise = page.waitForEvent("download");
  await page.getByTitle("Export JSON").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.json$/);

  await page.getByRole("button", { name: /restore default planning data/i }).click();
  await expect(page.getByRole("status")).toContainText(/Press reset again/i);
  await expectUsableApp(page);
  expect(failures).toEqual([]);
});

test("single-input touch path initializes and recovers on mobile", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "touch-only coverage runs in the mobile project");
  const failures = await attachRuntimeGuards(page);
  await openApp(page);

  await page.getByRole("button", { name: /initialize/i }).tap();
  await expectUsableApp(page);
  await page.getByRole("button", { name: /restore default planning data/i }).tap();
  await expect(page.getByRole("status")).toContainText(/Press reset again/i);
  await expectUsableApp(page);
  expect(failures).toEqual([]);
});
