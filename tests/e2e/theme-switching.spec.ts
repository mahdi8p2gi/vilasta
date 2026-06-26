import { test, expect } from "@playwright/test";

test.describe("Theme Switching", () => {
  test("user can toggle between light and dark mode", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=اقامتگاه‌های منتخب", { timeout: 15_000 });
    const htmlClass = await page.locator("html").getAttribute("class");
    const initialIsDark = htmlClass?.includes("dark") ?? false;
    await page.locator('header button[aria-label*="حالت"]').click();
    await page.waitForTimeout(500);
    const newHtmlClass = await page.locator("html").getAttribute("class");
    const newIsDark = newHtmlClass?.includes("dark") ?? false;
    expect(newIsDark).toBe(!initialIsDark);
  });

  test("dark mode persists after page reload", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=اقامتگاه‌های منتخب", { timeout: 15_000 });
    await page.locator('header button[aria-label*="حالت"]').click();
    await page.waitForTimeout(500);
    expect(await page.locator("html").getAttribute("class")).toContain("dark");
    await page.reload();
    await page.waitForSelector("text=اقامتگاه‌های منتخب", { timeout: 15_000 });
    expect(await page.locator("html").getAttribute("class")).toContain("dark");
  });

  test("can switch back to light mode", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=اقامتگاه‌های منتخب", { timeout: 15_000 });
    const themeBtn = page.locator('header button[aria-label*="حالت"]');
    await themeBtn.click();
    await page.waitForTimeout(500);
    expect(await page.locator("html").getAttribute("class")).toContain("dark");
    await themeBtn.click();
    await page.waitForTimeout(500);
    expect(await page.locator("html").getAttribute("class")).not.toContain("dark");
  });
});
