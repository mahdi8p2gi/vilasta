import { test, expect } from "@playwright/test";

test.describe("User Logout", () => {
  test("logged in user can logout", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=اقامتگاه‌های منتخب", { timeout: 15_000 });
    await page.click('button:has-text("ورود")');
    await page.click('button:has-text("کاربر")');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 });
    await page.click('header button:has(img)');
    await page.click('[role="menuitem"]:has-text("خروج از حساب")');
    await expect(page.locator('button:has-text("ورود")')).toBeVisible({ timeout: 5_000 });
  });
});
