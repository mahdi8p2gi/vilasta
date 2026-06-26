import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAppStore } from "@/store/app-store";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("Login flow integration", () => {
  beforeEach(() => { useAppStore.setState({ authModalOpen: false, authMode: "login", user: null }); mockFetch.mockReset(); });

  it("completes login flow: open modal → enter credentials → submit → user logged in", async () => {
    const user = userEvent.setup();
    const mockUser = { id: "user-1", email: "user@villa.ir", name: "سپهر کاظمی", role: "customer", avatar: "https://example.com/avatar.jpg" };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockUser });
    useAppStore.setState({ authModalOpen: true, authMode: "login" });
    render(<AuthModal />);
    await user.type(screen.getByPlaceholderText(/you@example.com/), "user@villa.ir");
    await user.type(screen.getByPlaceholderText(/••••••••/), "password123");
    await user.click(screen.getByRole("button", { name: /ورود به حساب/ }));
    await waitFor(() => { expect(mockFetch).toHaveBeenCalledWith("/api/auth/login", expect.objectContaining({ method: "POST", body: JSON.stringify({ email: "user@villa.ir", password: "password123" }) })); });
    await waitFor(() => { expect(useAppStore.getState().user).toEqual(mockUser); });
    await waitFor(() => { expect(useAppStore.getState().authModalOpen).toBe(false); });
  });

  it("shows error when login fails", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: "ایمیل یا رمز عبور اشتباه است" }) });
    useAppStore.setState({ authModalOpen: true, authMode: "login" });
    render(<AuthModal />);
    await user.type(screen.getByPlaceholderText(/you@example.com/), "wrong@example.com");
    await user.type(screen.getByPlaceholderText(/••••••••/), "wrongpass");
    await user.click(screen.getByRole("button", { name: /ورود به حساب/ }));
    await waitFor(() => { expect(useAppStore.getState().user).toBeNull(); });
  });

  it("quick login buttons call API with demo credentials", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "admin-1", email: "admin@villa.ir", name: "مدیر سیستم", role: "admin" }) });
    useAppStore.setState({ authModalOpen: true, authMode: "login" });
    render(<AuthModal />);
    await user.click(screen.getByText("مدیر"));
    await waitFor(() => { expect(mockFetch).toHaveBeenCalledWith("/api/auth/login", expect.objectContaining({ method: "POST" })); });
    await waitFor(() => { expect(useAppStore.getState().user?.role).toBe("admin"); });
  });
});
