import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
    test("should load and display the main heading", async ({ page }) => {
        await page.goto("/");

        // Check that the page loads
        await expect(page).toHaveTitle("Learning App");

        // Check for main heading
        const heading = page.getByRole("heading", { name: /Learning App/i });
        await expect(heading).toBeVisible();

        // Check for description text
        await expect(
            page.getByText(/GenAI-powered learning platform/i)
        ).toBeVisible();
    });
});
