# Playwright Patterns

E2E testing patterns with Playwright.

## Project Structure

```
e2e/
├── web/
│   ├── tests/
│   │   ├── auth.spec.ts
│   │   ├── homepage.spec.ts
│   │   └── feature-one.spec.ts
│   ├── fixtures/
│   │   └── test-data.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── playwright.config.ts
│   └── global-setup.ts
└── mobile/
    └── README.md
```

## Basic Test Structure

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should do expected behavior", async ({ page }) => {
        // Arrange - navigate, setup
        await page.goto("/feature");

        // Act - perform actions
        await page.click('button[data-testid="submit"]');

        // Assert - verify results
        await expect(page.locator(".success")).toBeVisible();
    });
});
```

## Locator Strategies

### Recommended (in order)

```typescript
// 1. Role-based (best)
page.getByRole("button", { name: "Submit" });
page.getByRole("textbox", { name: "Email" });
page.getByRole("link", { name: "Learn more" });

// 2. Label-based
page.getByLabel("Email address");
page.getByPlaceholder("Enter your email");

// 3. Text-based
page.getByText("Welcome");
page.getByText(/welcome/i); // Case insensitive

// 4. Test ID (last resort)
page.getByTestId("submit-button");
page.locator('[data-testid="submit-button"]');
```

### Avoid

```typescript
// Fragile selectors
page.locator(".btn-primary"); // Class names change
page.locator("#submit"); // IDs change
page.locator("div > span"); // Structure changes
```

## Common Actions

### Navigation

```typescript
await page.goto("/path");
await page.goBack();
await page.goForward();
await page.reload();
```

### Clicks and Input

```typescript
// Click
await page.click("button");
await page.getByRole("button").click();

// Type
await page.fill('input[name="email"]', "test@example.com");
await page.getByLabel("Email").fill("test@example.com");

// Clear and type
await page.getByLabel("Email").clear();
await page.getByLabel("Email").type("new@example.com");

// Select
await page.selectOption("select", "value");
await page.getByRole("combobox").selectOption({ label: "Option" });

// Checkbox/Radio
await page.check('input[type="checkbox"]');
await page.uncheck('input[type="checkbox"]');
```

### Waiting

```typescript
// Wait for element
await page.waitForSelector(".loaded");
await page.getByText("Loading").waitFor({ state: "hidden" });

// Wait for navigation
await page.waitForURL("/dashboard");

// Wait for network
await page.waitForResponse("/api/data");
await page.waitForLoadState("networkidle");

// Custom wait
await expect(page.getByText("Success")).toBeVisible({ timeout: 10000 });
```

## Assertions

```typescript
// Visibility
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).not.toBeVisible();

// Text content
await expect(locator).toHaveText("Expected text");
await expect(locator).toContainText("partial");

// Attributes
await expect(locator).toHaveAttribute("href", "/path");
await expect(locator).toHaveClass("active");

// Input values
await expect(locator).toHaveValue("input value");
await expect(locator).toBeChecked();
await expect(locator).toBeDisabled();

// Page
await expect(page).toHaveURL("/expected-path");
await expect(page).toHaveTitle("Page Title");

// Count
await expect(locator).toHaveCount(3);
```

## Page Object Model

```typescript
// pages/LoginPage.ts
export class LoginPage {
    constructor(private page: Page) {}

    get emailInput() {
        return this.page.getByLabel("Email");
    }

    get passwordInput() {
        return this.page.getByLabel("Password");
    }

    get submitButton() {
        return this.page.getByRole("button", { name: "Log in" });
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async goto() {
        await this.page.goto("/login");
    }
}

// tests/auth.spec.ts
test("should login successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("user@example.com", "password");
    await expect(page).toHaveURL("/dashboard");
});
```

## Fixtures and Hooks

```typescript
// Custom fixture
import { test as base } from "@playwright/test";

type MyFixtures = {
    authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
    authenticatedPage: async ({ page }, use) => {
        // Setup: login
        await page.goto("/login");
        await page.fill('[name="email"]', "test@example.com");
        await page.fill('[name="password"]', "password");
        await page.click('button[type="submit"]');
        await page.waitForURL("/dashboard");

        // Use the authenticated page
        await use(page);

        // Teardown: logout (optional)
        await page.goto("/logout");
    },
});

// Use in test
test("authenticated user can access dashboard", async ({
    authenticatedPage,
}) => {
    await authenticatedPage.goto("/dashboard");
    await expect(authenticatedPage.getByText("Welcome")).toBeVisible();
});
```

## Visual Testing

```typescript
test("should match screenshot", async ({ page }) => {
    await page.goto("/page");
    await expect(page).toHaveScreenshot("page.png");
});

// With options
await expect(page).toHaveScreenshot("page.png", {
    maxDiffPixels: 100,
    threshold: 0.2,
});
```

## Tips

1. **Focus on user journeys** - Test complete flows, not isolated actions
2. **Use realistic data** - Avoid test-specific edge cases
3. **Minimize mocking** - E2E should test real integrations
4. **Stable selectors** - Prefer role/label over class/id
5. **Handle flakiness** - Use proper waits, not arbitrary delays
6. **Isolate tests** - Each test should start from a known state
