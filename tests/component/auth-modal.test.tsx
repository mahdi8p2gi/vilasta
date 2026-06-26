import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAppStore } from "@/store/app-store";

describe("AuthModal (Login Form)", () => {
  beforeEach(() => { useAppStore.setState({ authModalOpen: false, authMode: "login", user: null }); });
  it("does not render when closed", () => { render(<AuthModal />); expect(screen.queryByText("ورود به حساب")).not.toBeInTheDocument(); });
  it("renders login form when open", () => { useAppStore.setState({ authModalOpen: true, authMode: "login" }); render(<AuthModal />); expect(screen.getAllByText("ورود به حساب").length).toBeGreaterThan(0); });
  it("renders email and password inputs", () => { useAppStore.setState({ authModalOpen: true, authMode: "login" }); render(<AuthModal />); expect(screen.getByPlaceholderText(/you@example.com/)).toBeInTheDocument(); expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument(); });
  it("renders submit button", () => { useAppStore.setState({ authModalOpen: true, authMode: "login" }); render(<AuthModal />); expect(screen.getByRole("button", { name: /ورود به حساب/ })).toBeInTheDocument(); });
  it("shows register form when mode is register", () => { useAppStore.setState({ authModalOpen: true, authMode: "register" }); render(<AuthModal />); expect(screen.getAllByText("ساخت حساب جدید").length).toBeGreaterThan(0); expect(screen.getByPlaceholderText(/سپهر کاظمی/)).toBeInTheDocument(); });
  it("shows forgot password form when mode is forgot", () => { useAppStore.setState({ authModalOpen: true, authMode: "forgot" }); render(<AuthModal />); expect(screen.getAllByText("بازیابی رمز عبور").length).toBeGreaterThan(0); expect(screen.queryByPlaceholderText(/••••••••/)).not.toBeInTheDocument(); });
  it("allows typing in email field", async () => { const user = userEvent.setup(); useAppStore.setState({ authModalOpen: true, authMode: "login" }); render(<AuthModal />); const email = screen.getByPlaceholderText(/you@example.com/); await user.type(email, "test@example.com"); expect(email).toHaveValue("test@example.com"); });
  it("toggles password visibility", async () => { const user = userEvent.setup(); useAppStore.setState({ authModalOpen: true, authMode: "login" }); render(<AuthModal />); const pass = screen.getByPlaceholderText(/••••••••/); expect(pass).toHaveAttribute("type", "password"); await user.click(screen.getByLabelText(/نمایش رمز|پنهان کردن رمز/)); expect(pass).toHaveAttribute("type", "text"); });
  it("renders quick login buttons in login mode", () => { useAppStore.setState({ authModalOpen: true, authMode: "login" }); render(<AuthModal />); expect(screen.getByText("مدیر")).toBeInTheDocument(); expect(screen.getByText("میزبان")).toBeInTheDocument(); expect(screen.getByText("کاربر")).toBeInTheDocument(); });
  it("switches to register mode when clicking switch link", async () => { const user = userEvent.setup(); useAppStore.setState({ authModalOpen: true, authMode: "login" }); render(<AuthModal />); await user.click(screen.getByText("ثبت‌نام کنید")); expect(useAppStore.getState().authMode).toBe("register"); });
  it("shows forgot password link in login mode", () => { useAppStore.setState({ authModalOpen: true, authMode: "login" }); render(<AuthModal />); expect(screen.getByText(/رمز عبور را فراموش کرده‌اید/)).toBeInTheDocument(); });
});
