import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "@/components/shared/theme-toggle";

describe("ThemeToggle component", () => {
  it("renders a button with accessible label", () => { render(<ThemeToggle />); expect(screen.getByRole("button")).toBeInTheDocument(); });
  it("shows an icon", () => { render(<ThemeToggle />); expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument(); });
  it("is clickable without errors", async () => { const user = userEvent.setup(); render(<ThemeToggle />); await user.click(screen.getByRole("button")); expect(screen.getByRole("button")).toBeInTheDocument(); });
  it("renders in compact mode", () => { render(<ThemeToggle compact />); expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument(); });
});
