import { expect, test } from "@playwright/test";

test("credential-free teacher demo exposes a mobile prerequisite list", async ({ page }) => {
  await page.goto("/demo/teacher");
  await expect(page.getByRole("heading", { name: "Make tomorrow's lesson feel possible." })).toBeVisible();
  await expect(page.getByText("Concept dependency map", { exact: true })).toBeVisible();
});

test("pupil demo retains its active learning material after refresh", async ({ page }) => {
  await page.goto("/demo/pupil");
  await page.getByRole("button", { name: "Begin step one" }).click();
  await expect(page.getByText("Step 1 of 2")).toBeVisible();
  await page.getByRole("button", { name: "Create a visual" }).click();
  await expect(page.getByRole("img", { name: "A sorted row of seven numbers with the middle value highlighted, showing one half discarded and the search continuing in the other half." })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Step 1 of 2")).toBeVisible();
});

test("mathematics example switches from teacher map to pupil pathway", async ({ page }) => {
  await page.goto("/demo/maths");
  await expect(page.getByRole("heading", { name: "Prepare Amina for simultaneous equations—not every lesson she missed." })).toBeVisible();
  await page.getByRole("button", { name: "Pupil" }).click();
  await expect(page.getByRole("heading", { name: "Two ideas before simultaneous equations." })).toBeVisible();
  await page.getByRole("button", { name: "Create a visual" }).click();
  await expect(page.getByRole("img", { name: "The equation x plus y equals 10 being rearranged to y equals 10 minus x" })).toBeVisible();
});
