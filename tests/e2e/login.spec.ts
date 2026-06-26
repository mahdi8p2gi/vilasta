import { test, expect } from "@playwright/test";

test.describe("User Login", () => {
  test("customer can login via quick login button", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=اقامتگاه‌های منتخب", { timeout: 15_000 });
    await page.click('button:has-text("ورود")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.click('button:has-text("کاربر")');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 });
  });

  test("admin can login via quick login button", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=اقامتگاه‌های منتخب", { timeout: 15_000 });
    await page.click('button:has-text("ورود")');
    await page.click('button:has-text("مدیر")');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 });
  });

  test("host can login via quick login button", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=اقامتگاه‌های منتخب", { timeout: 15_000 });
    await page.click('button:has-text("ورود")');
    await page.click('button:has-text("میزبان")');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 });
  });

  test("can switch between login and register modes", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=اقامتگاه‌های منتخب", { timeout: 15_000 });
    await page.click('button:has-text("ورود")');
    await expect(page.locator("h2:has-text('ورود به حساب')")).toBeVisible();
    await page.click('button:has-text("ثبت‌نام کنید")');
    await expect(page.locator("h2:has-text('ساخت حساب جدید')").first()).toBeVisible();
    await expect(page.locator('input[placeholder*="سپهر"]')).toBeVisible();
    await page.click('button:has-text("وارد شوید")');
    await expect(page.locator("h2:has-text('ورود به حساب')").first()).toBeVisible();
  });
});
