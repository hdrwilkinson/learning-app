import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
    test("should redirect to login when unauthenticated", async ({ page }) => {
        // Navigate to homepage - should redirect to login
        const response = await page.goto("/");

        // Should redirect to login page
        await expect(page).toHaveURL(/\/auth\/login/);

        // Verify login page has required elements
        await expect(page).toHaveTitle(/./);

        // Verify login form exists - check for email input
        const emailInput = page.getByLabel(/email/i);
        await expect(emailInput).toBeVisible();

        // Verify login title is visible (CardTitle component) - use first() to handle multiple matches
        const loginTitle = page.getByText("Login").first();
        await expect(loginTitle).toBeVisible();

        // Verify page has interactive elements (buttons)
        const loginButton = page.getByRole("button", { name: "Login" });
        await expect(loginButton).toBeVisible();
    });
});
