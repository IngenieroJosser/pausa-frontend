import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 70_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm dev --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000/api/v1/health",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
