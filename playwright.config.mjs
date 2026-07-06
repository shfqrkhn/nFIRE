import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: /ui-smoke\.spec\.mjs/,
  timeout: 30000,
  expect: {
    timeout: 8000
  },
  reporter: "line",
  use: {
    acceptDownloads: true,
    actionTimeout: 10000,
    navigationTimeout: 15000,
    serviceWorkers: "block",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1366, height: 900 }
      }
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 5"]
      }
    }
  ]
});
