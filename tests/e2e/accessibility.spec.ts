import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = ["/", "/why", "/how-it-works", "/for-schools", "/safeguards", "/demo", "/demo/maths"];

for (const route of publicRoutes) {
  test(`${route} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""));
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}
