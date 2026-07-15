import { defineConfig, devices } from "@playwright/test";
import path from "path";

const authFile = path.join(process.cwd(), "playwright", ".auth", "user.json");

export default defineConfig({
  testDir: "./tests/e2e",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: "html",

  globalTeardown: "./playwright/teardown.ts",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  webServer: {
    command: "npm run dev:test",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      PLAYWRIGHT: "true",
    },
  },

  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      use: {
        storageState: undefined,
      },
    },

    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: authFile,
      },
      dependencies: ["setup"],
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        storageState: authFile,
      },
      dependencies: ["setup"],
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        storageState: authFile,
      },
      dependencies: ["setup"],
    },
  ],
});
