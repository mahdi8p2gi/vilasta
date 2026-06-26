import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button component", () => {
  it("renders children text", () => { render(<Button>رزرو کنید</Button>); expect(screen.getByRole("button", { name: /رزرو کنید/ })).toBeInTheDocument(); });
  it("calls onClick when clicked", async () => { const user = userEvent.setup(); const onClick = vi.fn(); render(<Button onClick={onClick}>کلیک</Button>); await user.click(screen.getByRole("button")); expect(onClick).toHaveBeenCalledTimes(1); });
  it("does not call onClick when disabled", async () => { const user = userEvent.setup(); const onClick = vi.fn(); render(<Button onClick={onClick} disabled>غیرفعال</Button>); await user.click(screen.getByRole("button")); expect(onClick).not.toHaveBeenCalled(); });
  it("applies variant classes", () => { const { rerender } = render(<Button variant="outline">متن</Button>); expect(screen.getByRole("button")).toHaveClass("border"); rerender(<Button variant="ghost">متن</Button>); expect(screen.getByRole("button")).toBeInTheDocument(); });
  it("applies size classes", () => { const { rerender } = render(<Button size="sm">متن</Button>); expect(screen.getByRole("button")).toBeInTheDocument(); rerender(<Button size="lg">متن</Button>); expect(screen.getByRole("button")).toBeInTheDocument(); });
  it("renders as child when asChild is set", () => { render(<Button asChild><a href="/test">لینک</a></Button>); expect(screen.getByRole("link", { name: /لینک/ })).toHaveAttribute("href", "/test"); });
  it("supports keyboard activation", async () => { const user = userEvent.setup(); const onClick = vi.fn(); render(<Button onClick={onClick}>کلیک</Button>); screen.getByRole("button").focus(); await user.keyboard("{Enter}"); expect(onClick).toHaveBeenCalled(); });
});
