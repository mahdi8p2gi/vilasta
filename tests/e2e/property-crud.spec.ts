import { test, expect } from "@playwright/test";

test.describe("Property Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=اقامتگاه‌های منتخب", { timeout: 15_000 });
    await page.click('button:has-text("ورود")');
    await page.click('button:has-text("میزبان")');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 });
  });

  test("host can add a new property", async ({ page }) => {
    await page.click('header button:has(img)');
    await page.click('[role="menuitem"]:has-text("داشبورد")');
    await page.waitForSelector('button:has-text("افزودن اقامتگاه")', { timeout: 10_000 });
    await page.click('button:has-text("افزودن اقامتگاه")');
    await expect(page.locator("h1").first()).toContainText(/اقامتگاه/);
  });

  test("host can see property list", async ({ page }) => {
    await page.click('header button:has(img)');
    await page.click('[role="menuitem"]:has-text("داشبورد")');
    await page.waitForSelector('button:has-text("اقامتگاه‌های من")', { timeout: 10_000 });
    await expect(page.locator('button:has-text("اقامتگاه‌های من")')).toBeVisible();
  });
});

test.describe("Review Submission", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=اقامتگاه‌های منتخب", { timeout: 15_000 });
    await page.click('button:has-text("ورود")');
    await page.click('button:has-text("کاربر")');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 });
  });

  test("user can open review form on property detail", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    const firstProperty = page.locator("article").first();
    if (await firstProperty.count() > 0) {
      await firstProperty.click();
      await page.waitForSelector("text=نظرات میهمانان", { timeout: 15_000 });
      await page.click('button:has-text("نظر خود را بنویسید")');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    }
  });
});
