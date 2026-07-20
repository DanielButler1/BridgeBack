import { expect, test } from "@playwright/test";

test("production pupil can start and end a lesson-grounded Realtime conversation", async ({ context, page }) => {
  test.skip(
    !process.env.PLAYWRIGHT_BASE_URL || process.env.PLAYWRIGHT_REALTIME_FAKE_AUDIO !== "true",
    "Requires an explicit production target and a synthetic audio device.",
  );

  const origin = new URL(process.env.PLAYWRIGHT_BASE_URL!).origin;
  await context.grantPermissions(["microphone"], { origin });
  await page.goto("/api/demo/sign-in/pupil");
  await page.goto("/demo/maths");
  await page.getByRole("button", { name: "Pupil" }).click();
  await page.getByRole("button", { name: "Start my check-in" }).click();

  for (const answer of ["-5", "5x - 4", "6", "y = 10 - x"]) {
    await page.getByRole("button").filter({ hasText: answer }).first().click();
    await page.getByRole("button", { name: /Next question|Build my pathway/ }).click();
  }

  await page.getByRole("button", { name: "Begin step one" }).click();
  await page.getByRole("button", { name: "Start a 5-minute conversation" }).click();
  await expect(page.getByText("Conversation active", { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("button", { name: "Mute" })).toBeVisible();
  await page.getByRole("button", { name: "End" }).click();
  await expect(page.getByText("Conversation complete.", { exact: false })).toBeVisible();
});
