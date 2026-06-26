import { test, expect } from "@playwright/test";

test.describe("Dashboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=اقامتگاه‌های منتخب", { timeout: 15_000 });
    await page.click('button:has-text("ورود")');
    await page.click('button:has-text("کاربر")');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 });
  });

  test("user can navigate to dashboard", async ({ page }) => {
    await page.click('header button:has(img)');
    await page.click('[role="menuitem"]:has-text("داشبورد")');
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('button:has-text("پروفایل")')).toBeVisible();
  });

  test("user can switch between dashboard tabs", async ({ page }) => {
    await page.click('header button:has(img)');
    await page.click('[role="menuitem"]:has-text("داشبورد")');
    await page.waitForSelector('button:has-text("پروفایل")', { timeout: 10_000 });
    await page.click('button:has-text("رزروهای من")');
    await expect(page.locator("h1").first()).toContainText(/رزرو/);
    await page.click('button:has-text("اعلان‌ها")');
    await expect(page.locator("h1").first()).toContainText(/اعلان/);
  });

  test("back to site button works", async ({ page }) => {
    await page.click('header button:has(img)');
    await page.click('[role="menuitem"]:has-text("داشبورد")');
    await page.waitForSelector('button:has-text("پروفایل")', { timeout: 10_000 });
    await page.click('button:has-text("بازگشت به سایت")');
    await expect(page.locator("h1").first()).toContainText(/اقامتگاه/);
  });
});
