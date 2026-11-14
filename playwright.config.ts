import { defineConfig } from "@playwright/test";
const externalUrl = process.env.CODEATLAS_BASE_URL;
const proxyUrl =
  externalUrl && (process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY);
export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: externalUrl ?? "http://127.0.0.1:5173",
    ...(proxyUrl ? { proxy: { server: proxyUrl } } : {}),
    trace: "retain-on-failure",
    launchOptions: {
      ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
        ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
        : {}),
      args: ["--no-sandbox"],
    },
  },
  ...(externalUrl
    ? {}
    : {
        webServer: {
          command: "npm run dev",
          url: "http://127.0.0.1:5173",
          reuseExistingServer: !process.env.CI,
          timeout: 60000,
        },
      }),
});
