# Jest Patterns

Detailed Jest testing patterns and examples.

## File Organization

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx    # Co-located test
│   │   └── index.ts
│   └── __tests__/             # Alternative: grouped tests
│       └── Button.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── hooks/
    ├── useAuth.ts
    └── __tests__/
        └── useAuth.test.ts
```

## Basic Test Structure

```typescript
describe("ComponentName", () => {
    // Setup shared across tests
    beforeEach(() => {
        // Reset state, mocks, etc.
    });

    afterEach(() => {
        // Cleanup
        jest.clearAllMocks();
    });

    describe("feature or method", () => {
        it("should do expected behavior when condition", () => {
            // Arrange
            const input = "test";

            // Act
            const result = functionUnderTest(input);

            // Assert
            expect(result).toBe("expected");
        });
    });
});
```

## Mocking Patterns

### Mock Functions

```typescript
// Simple mock
const mockFn = jest.fn();
const mockWithReturn = jest.fn().mockReturnValue("value");
const mockWithImpl = jest.fn().mockImplementation((x) => x * 2);

// Async mock
const mockAsync = jest.fn().mockResolvedValue({ data: [] });
const mockAsyncError = jest.fn().mockRejectedValue(new Error("fail"));
```

### Mock Modules

```typescript
// Mock entire module
jest.mock("@/lib/api");

// Mock with implementation
jest.mock("@/lib/api", () => ({
    fetchData: jest.fn().mockResolvedValue({ items: [] }),
}));

// Partial mock (keep some real implementations)
jest.mock("@/lib/utils", () => ({
    ...jest.requireActual("@/lib/utils"),
    formatDate: jest.fn().mockReturnValue("2024-01-01"),
}));
```

### Spy on Methods

```typescript
const spy = jest.spyOn(object, "method");
spy.mockReturnValue("mocked");

// Restore original
spy.mockRestore();
```

## React Testing Library Patterns

### Render and Query

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button', { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Query Priority

1. `getByRole` - Accessible queries (preferred)
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Inputs
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

### Async Testing

```typescript
it('should show loading then data', async () => {
  render(<DataComponent />);

  // Wait for loading to appear
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for data to appear
  await screen.findByText(/data loaded/i);

  // Assert loading is gone
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});
```

## Testing Hooks

```typescript
import { renderHook, act } from "@testing-library/react";

describe("useCounter", () => {
    it("should increment", () => {
        const { result } = renderHook(() => useCounter());

        act(() => {
            result.current.increment();
        });

        expect(result.current.count).toBe(1);
    });
});
```

## Common Assertions

```typescript
// Equality
expect(value).toBe(exact);
expect(value).toEqual(deepEqual);
expect(value).toStrictEqual(strictDeepEqual);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(num).toBeGreaterThan(3);
expect(num).toBeLessThanOrEqual(5);
expect(num).toBeCloseTo(0.3, 5);

// Strings
expect(str).toMatch(/regex/);
expect(str).toContain("substring");

// Arrays/Iterables
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(array).toContainEqual({ id: 1 });

// Objects
expect(obj).toHaveProperty("key");
expect(obj).toMatchObject({ key: "value" });

// Exceptions
expect(() => throwingFn()).toThrow();
expect(() => throwingFn()).toThrow("message");

// DOM
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toHaveClass("active");
expect(element).toHaveAttribute("href", "/path");
```

## Snapshot Testing

```typescript
it('should match snapshot', () => {
  const { container } = render(<Component />);
  expect(container).toMatchSnapshot();
});

// Inline snapshot
it('should match inline snapshot', () => {
  expect(formatOutput(data)).toMatchInlineSnapshot(`
    "expected output"
  `);
});
```

## Tips

1. **Don't test implementation details** - Test behavior, not internals
2. **One assertion per test** - Or related assertions
3. **Descriptive test names** - Should read like requirements
4. **Setup/teardown** - Use `beforeEach`/`afterEach` for shared setup
5. **Isolate tests** - Each test should be independent
