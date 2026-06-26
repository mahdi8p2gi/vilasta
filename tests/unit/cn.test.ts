import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (className merge utility)", () => {
  it("merges multiple class names", () => { expect(cn("foo", "bar")).toBe("foo bar"); });
  it("handles conditional classes (falsy values ignored)", () => { expect(cn("base", false && "hidden", true && "visible")).toBe("base visible"); });
  it("handles undefined and null", () => { expect(cn("base", undefined, null, "end")).toBe("base end"); });
  it("deduplicates conflicting Tailwind classes (twMerge)", () => { expect(cn("px-2", "px-4")).toBe("px-4"); expect(cn("text-sm", "text-lg")).toBe("text-lg"); });
  it("preserves non-conflicting classes", () => { expect(cn("px-2", "py-4")).toBe("px-2 py-4"); });
  it("handles empty input", () => { expect(cn()).toBe(""); });
  it("handles objects with conditional keys", () => { expect(cn({ active: true, disabled: false })).toBe("active"); });
  it("handles nested arrays", () => { expect(cn(["a", "b"], ["c"])).toBe("a b c"); });
});
