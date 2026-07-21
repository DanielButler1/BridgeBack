import { expect, test, type Page } from "@playwright/test";

async function enterDemoAs(page: Page, role: "teacher" | "pupil") {
  if (process.env.PLAYWRIGHT_BASE_URL) {
    await page.goto(`/api/demo/sign-in/${role}`);
    return;
  }

  await page.goto(`/demo/${role}`);
}

test("credential-free teacher demo exposes a mobile prerequisite list", async ({ page }) => {
  await enterDemoAs(page, "teacher");
  await expect(page.getByRole("heading", { name: "Make tomorrow's lesson feel possible." })).toBeVisible();
  await expect(page.getByText("Concept dependency map", { exact: true })).toBeVisible();
});

test("pupil demo retains its active learning material after refresh", async ({ page }) => {
  test.setTimeout(240_000);
  await enterDemoAs(page, "pupil");
  await page.getByRole("button", { name: "Begin step one" }).click();
  await expect(page.getByText(/Step 1 of \d+/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Talk it through" })).toBeVisible();
  await page.getByRole("button", { name: "Create a visual" }).click();
  const visualName = process.env.PLAYWRIGHT_BASE_URL ? /Visual explanation of/ : /sorted row of seven numbers/;
  await expect(page.getByRole("img", { name: visualName })).toBeVisible({ timeout: 180_000 });
  await page.reload();
  await expect(page.getByText(/Step 1 of \d+/)).toBeVisible();
});

test("mathematics journey diagnoses, teaches and resumes", async ({ page }) => {
  await page.goto("/demo/maths");
  await expect(page.getByRole("heading", { name: /Prepare Amina for simultaneous equations/ })).toBeVisible();
  await page.getByRole("button", { name: "Pupil" }).click();
  await expect(page.getByRole("heading", { name: "You don't need to catch up on everything today." })).toBeVisible();
  await page.getByRole("button", { name: "Start my check-in" }).click();
  for (const answer of ["-5", "5x - 4", "6", "y = 10 - x"]) {
    await page.getByRole("button").filter({ hasText: answer }).first().click();
    await page.getByRole("button", { name: /Next question|Build my pathway/ }).click();
  }
  await expect(page.getByText("Your next steps are ready.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Begin step one" }).click();
  await expect(page.getByText("Step 1 of 2")).toBeVisible();
  await page.getByRole("button", { name: "Create a visual" }).click();
  await expect(page.getByRole("img", { name: /equation x plus y equals ten/ })).toBeVisible();
  await page.getByRole("button").filter({ hasText: "y = 13 - 2x" }).click();
  await page.getByRole("button", { name: "Check and continue" }).click();
  await expect(page.getByText("Step 2 of 2")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Step 2 of 2")).toBeVisible();
});
