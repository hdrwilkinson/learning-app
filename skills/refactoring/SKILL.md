---
name: refactoring
description: Safe code restructuring patterns and extract methods. Use when improving code structure without changing behavior. Triggers include "refactor", "extract", "restructure code", "clean up".
---

# Refactoring Skill

## Purpose & Context (WHY)

Refactoring improves code structure without changing behavior. This skill provides patterns for safe restructuring that maintains functionality while improving readability and maintainability.

**When to use**: Code is hard to understand, duplicated, or needs restructuring before adding features.

**When to skip**: If you need to fix behavior, use `debugging` first. Never refactor and add features simultaneously.

## Golden Rules

1. **Have tests first**: Never refactor without test coverage
2. **Small steps**: One change at a time, verify after each
3. **Don't mix with features**: Refactor OR add features, not both
4. **Verify behavior**: Run tests after each change

## Common Refactorings

### Extract Function

**Before**:

```typescript
function processOrder(order: Order) {
    // Calculate total
    let total = 0;
    for (const item of order.items) {
        total += item.price * item.quantity;
        if (item.discount) {
            total -= item.discount;
        }
    }

    // Apply shipping
    if (total < 50) {
        total += 5.99;
    }

    return total;
}
```

**After**:

```typescript
function calculateItemsTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => {
        const itemTotal = item.price * item.quantity;
        return sum + itemTotal - (item.discount ?? 0);
    }, 0);
}

function calculateShipping(subtotal: number): number {
    return subtotal < 50 ? 5.99 : 0;
}

function processOrder(order: Order): number {
    const subtotal = calculateItemsTotal(order.items);
    return subtotal + calculateShipping(subtotal);
}
```

### Extract Component

**Before**:

```tsx
function UserProfile({ user }: { user: User }) {
    return (
        <div>
            <div className="flex items-center gap-2">
                <img src={user.avatar} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {user.email}
                    </p>
                </div>
            </div>
            {/* More profile content */}
        </div>
    );
}
```

**After**:

```tsx
function UserAvatar({ user }: { user: User }) {
    return (
        <div className="flex items-center gap-2">
            <img src={user.avatar} className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
        </div>
    );
}

function UserProfile({ user }: { user: User }) {
    return (
        <div>
            <UserAvatar user={user} />
            {/* More profile content */}
        </div>
    );
}
```

### Consolidate Conditionals

**Before**:

```typescript
if (user.role === "admin") {
    return true;
}
if (user.role === "moderator") {
    return true;
}
if (user.permissions.includes("edit")) {
    return true;
}
return false;
```

**After**:

```typescript
function canEdit(user: User): boolean {
    const isPrivilegedRole = ["admin", "moderator"].includes(user.role);
    const hasEditPermission = user.permissions.includes("edit");
    return isPrivilegedRole || hasEditPermission;
}
```

### Replace Magic Numbers

**Before**:

```typescript
if (password.length < 8) {
    return "Too short";
}
if (retryCount > 3) {
    return "Too many attempts";
}
```

**After**:

```typescript
const MIN_PASSWORD_LENGTH = 8;
const MAX_RETRY_ATTEMPTS = 3;

if (password.length < MIN_PASSWORD_LENGTH) {
    return "Too short";
}
if (retryCount > MAX_RETRY_ATTEMPTS) {
    return "Too many attempts";
}
```

## Refactoring Workflow

### 1. Identify Code Smell

Common smells:

- Long functions (>20 lines)
- Duplicated code
- Deep nesting (>3 levels)
- Magic numbers/strings
- God objects (does too much)

### 2. Ensure Test Coverage

```bash
# Check current coverage
npm test -- --coverage

# If coverage is low, write tests FIRST
```

### 3. Make Small Change

One refactoring at a time:

- Extract one function
- Rename one variable
- Move one piece of logic

### 4. Run Tests

```bash
npm test
```

### 5. Commit

```bash
git commit -m "refactor(scope): Extract calculateTotal function"
```

### 6. Repeat

Continue until code is clean.

## Resources

**This Skill**:

- `reference/refactoring-patterns.md` - More refactoring patterns

**Related Skills**:

- `testing` - Ensure test coverage before refactoring
- `debugging` - Fix bugs before refactoring

## Key Principle

Small, verified changes maintain stability.

---

_Skill established November 2025 for the Learning App (Cognia) project._
