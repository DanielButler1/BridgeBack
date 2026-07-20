import { defineConfig, devices } from "@playwright/test";

const productionBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const fakeRealtimeAudio = process.env.PLAYWRIGHT_REALTIME_FAKE_AUDIO === "true";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: productionBaseUrl ?? "http://127.0.0.1:3199",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: fakeRealtimeAudio ? {
          args: [
            "--autoplay-policy=no-user-gesture-required",
            "--use-fake-device-for-media-stream",
            "--use-fake-ui-for-media-stream",
          ],
        } : undefined,
      },
    },
    { name: "mobile", use: { ...devices["iPhone 13"], browserName: "chromium" } },
  ],
  webServer: productionBaseUrl ? undefined : {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3199",
    url: "http://127.0.0.1:3199",
    reuseExistingServer: false,
    // The repository may live on a mapped drive, where the first Next.js
    // compilation is substantially slower than a local SSD.
    timeout: 300_000,
    env: { ...process.env, NEXT_PUBLIC_E2E_FORCE_FALLBACK: "true" },
  },
});
