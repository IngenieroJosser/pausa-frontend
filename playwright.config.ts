import { defineConfig } from "@playwright/test";

// Puerto aislado: Playwright no puede reutilizar por accidente un Next.js
// antiguo que esté sirviendo /api/v1/health en el puerto 3000.
const port = Number(process.env.PAUSA_E2E_PORT || 3109);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 70_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL,
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `pnpm dev --hostname 127.0.0.1 --port ${port}`,
    url: `${baseURL}/api/v1/health`,
    // El E2E debe usar la versión recién compilada, no un proceso viejo.
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
