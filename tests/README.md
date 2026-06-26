# 🧪 Testing — Vilasta

This project uses **Vitest**, **React Testing Library**, and **Playwright** for comprehensive test coverage.

## 📁 Test Structure

```
tests/
├── setup.ts                     # Vitest global setup (jsdom, mocks)
├── fixtures/
│   └── data.ts                  # Realistic test data (users, properties, reviews)
├── helpers/
│   └── render.tsx               # Render with providers (QueryClient, etc.)
├── unit/                        # Unit tests (pure functions)
│   ├── persian.test.ts          # Persian digit/date/currency formatters
│   ├── image.test.ts            # Image URL optimization helpers
│   ├── api.test.ts              # API serialization & response helpers
│   ├── date-utils.test.ts       # Jalali date utilities
│   ├── booking.test.ts          # Booking price calculations & validation
│   ├── cn.test.ts               # className merge utility
│   └── store.test.ts            # Zustand store (routing, auth, favorites)
├── component/                   # Component tests (RTL)
│   ├── button.test.tsx          # Button variants, click, disabled
│   ├── dialog.test.tsx          # Modal open/close, ARIA
│   ├── table.test.tsx           # Table rendering, actions
│   ├── pagination.test.tsx      # Page navigation, active state
│   ├── theme-toggle.test.tsx    # Dark/light toggle
│   ├── rating-stars.test.tsx    # Star rating display
│   └── auth-modal.test.tsx      # Login/register/forgot forms
├── integration/                 # Integration tests
│   ├── login-flow.test.tsx      # Complete login → API → state update
│   └── search-filter-flow.test.ts  # Search params, favorites, delete flow
└── e2e/                         # E2E tests (Playwright)
    ├── login.spec.ts            # User login flows
    ├── logout.spec.ts           # Logout flow
    ├── dashboard-navigation.spec.ts  # Dashboard tab switching
    ├── property-crud.spec.ts    # Create/delete properties, submit reviews
    └── theme-switching.spec.ts  # Dark/light toggle + persistence
```

## 🚀 Running Tests

### Prerequisites
```bash
bun install
```

### Unit + Component + Integration Tests (Vitest)
```bash
bun run test              # Run all tests once
bun run test:watch        # Watch mode
bun run test:ui           # With UI dashboard
bun run test:coverage     # With coverage report
```

### E2E Tests (Playwright)
```bash
bun run test:e2e          # Run E2E tests
bun run test:e2e:ui       # With interactive UI
bun run test:e2e:report   # View HTML report
```

## 📊 Coverage Targets

| Category | Target | Current |
|----------|--------|---------|
| Utilities (`src/lib/`) | 70%+ | ~85% |
| Store (`src/store/`) | 70%+ | ~93% |
| Critical user flows | 100% E2E | ✅ |

## 🎯 Testing Best Practices

- **User behavior**, not implementation details
- **Public API** of components and functions
- **Realistic test data** (Persian text, real Toman amounts)
- **Accessibility** (ARIA attributes, keyboard navigation)
- **Descriptive test names** explaining the behavior
