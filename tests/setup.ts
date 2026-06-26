import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => { cleanup(); });

class MockIntersectionObserver {
  readonly root = null; readonly rootMargin = ""; readonly thresholds = [];
  observe() {} unobserve() {} disconnect() {} takeRecords() { return []; }
}
vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
vi.stubGlobal("matchMedia", vi.fn().mockImplementation((query: string) => ({
  matches: false, media: query, onchange: null, addListener: vi.fn(), removeListener: vi.fn(),
  addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
})));
vi.stubGlobal("scrollTo", vi.fn());
class MockResizeObserver { observe() {} unobserve() {} disconnect() {} }
vi.stubGlobal("ResizeObserver", MockResizeObserver);
