import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
    test("should load and display core content", async ({ page }) => {
        // Navigate and verify page loads successfully
        const response = await page.goto("/");
        expect(response?.status()).toBe(200);

        // Verify page has a title (without checking specific text)
        await expect(page).toHaveTitle(/./);

        // Check that main heading (h1) exists and is visible
        const mainHeading = page.locator("h1").first();
        await expect(mainHeading).toBeVisible();
        await expect(mainHeading).not.toBeEmpty();

        // Verify page has interactive elements (buttons)
        const buttons = page.getByRole("button");
        await expect(buttons.first()).toBeVisible();

        // Verify page has body content (paragraphs or sections)
        const hasContent = await page.locator("main, article, section").count();
        expect(hasContent).toBeGreaterThan(0);
    });
});
