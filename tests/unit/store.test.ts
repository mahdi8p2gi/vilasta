import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/store/app-store";
import { mockUsers } from "../fixtures/data";

describe("App Store — View Routing", () => {
  beforeEach(() => { useAppStore.setState({ view: "home", prevView: "home", selectedPropertyId: null, user: null, favorites: [] }); });
  it("starts on home view", () => { expect(useAppStore.getState().view).toBe("home"); });
  it("setView changes current view and tracks previous", () => { useAppStore.getState().setView("listing"); expect(useAppStore.getState().view).toBe("listing"); expect(useAppStore.getState().prevView).toBe("home"); });
  it("goProperty sets view to property and stores ID", () => { useAppStore.getState().goProperty("prop-123"); expect(useAppStore.getState().view).toBe("property"); expect(useAppStore.getState().selectedPropertyId).toBe("prop-123"); });
  it("goBooking sets view to booking and stores ID", () => { useAppStore.getState().goBooking("prop-456"); expect(useAppStore.getState().view).toBe("booking"); expect(useAppStore.getState().selectedPropertyId).toBe("prop-456"); });
  it("goBack returns to previous view", () => { useAppStore.getState().setView("listing"); useAppStore.getState().goProperty("prop-1"); useAppStore.getState().goBack(); expect(useAppStore.getState().view).toBe("listing"); });
  it("closing mobile menu when setting view", () => { useAppStore.getState().setMobileMenu(true); useAppStore.getState().setView("listing"); expect(useAppStore.getState().mobileMenuOpen).toBe(false); });
});

describe("App Store — Authentication & Roles", () => {
  beforeEach(() => { useAppStore.setState({ user: null }); });
  it("starts with no user", () => { expect(useAppStore.getState().user).toBeNull(); });
  it("login sets the user", () => { useAppStore.getState().login(mockUsers.customer); expect(useAppStore.getState().user).toEqual(mockUsers.customer); });
  it("logout clears the user", () => { useAppStore.getState().login(mockUsers.customer); useAppStore.getState().logout(); expect(useAppStore.getState().user).toBeNull(); });
  it("setUser replaces the user", () => { useAppStore.getState().login(mockUsers.customer); useAppStore.getState().setUser(mockUsers.host); expect(useAppStore.getState().user).toEqual(mockUsers.host); });
});

describe("App Store — Role-based access (hasRole)", () => {
  it("returns false when no user is logged in", () => { useAppStore.setState({ user: null }); expect(useAppStore.getState().hasRole("admin")).toBe(false); });
  it("returns true when user has the required role", () => { useAppStore.setState({ user: mockUsers.admin }); expect(useAppStore.getState().hasRole("admin")).toBe(true); });
  it("returns false when user does not have the required role", () => { useAppStore.setState({ user: mockUsers.customer }); expect(useAppStore.getState().hasRole("admin")).toBe(false); });
  it("returns true when user has any of the listed roles", () => { useAppStore.setState({ user: mockUsers.host }); expect(useAppStore.getState().hasRole("host", "admin")).toBe(true); });
  it("returns false when user has none of the listed roles", () => { useAppStore.setState({ user: mockUsers.guest }); expect(useAppStore.getState().hasRole("host", "admin")).toBe(false); });
});

describe("App Store — Favorites", () => {
  beforeEach(() => { useAppStore.setState({ favorites: [] }); });
  it("starts with empty favorites", () => { expect(useAppStore.getState().favorites).toEqual([]); });
  it("toggleFavorite adds a property to favorites", () => { useAppStore.getState().toggleFavorite("prop-1"); expect(useAppStore.getState().favorites).toContain("prop-1"); });
  it("toggleFavorite removes an existing favorite", () => { useAppStore.getState().toggleFavorite("prop-1"); useAppStore.getState().toggleFavorite("prop-1"); expect(useAppStore.getState().favorites).not.toContain("prop-1"); });
  it("isFavorite returns true for favorited properties", () => { useAppStore.getState().toggleFavorite("prop-1"); expect(useAppStore.getState().isFavorite("prop-1")).toBe(true); });
  it("isFavorite returns false for non-favorited properties", () => { expect(useAppStore.getState().isFavorite("prop-1")).toBe(false); });
  it("can have multiple favorites", () => { useAppStore.getState().toggleFavorite("prop-1"); useAppStore.getState().toggleFavorite("prop-2"); useAppStore.getState().toggleFavorite("prop-3"); expect(useAppStore.getState().favorites).toHaveLength(3); });
});

describe("App Store — Search params", () => {
  it("starts with default search params", () => { const s = useAppStore.getState().search; expect(s.q).toBe(""); expect(s.city).toBe(""); expect(s.type).toBe("all"); expect(s.guests).toBe(2); });
  it("setSearch merges partial updates", () => { useAppStore.getState().setSearch({ city: "کیش", guests: 4 }); const s = useAppStore.getState().search; expect(s.city).toBe("کیش"); expect(s.guests).toBe(4); expect(s.q).toBe(""); });
  it("setSearch preserves existing values", () => { useAppStore.getState().setSearch({ city: "تهران" }); useAppStore.getState().setSearch({ guests: 3 }); const s = useAppStore.getState().search; expect(s.city).toBe("تهران"); expect(s.guests).toBe(3); });
});

describe("App Store — Booking draft", () => {
  it("starts with default booking draft", () => { const d = useAppStore.getState().bookingDraft; expect(d.checkIn).toBeNull(); expect(d.checkOut).toBeNull(); expect(d.guests).toBe(2); });
  it("setBookingDraft merges partial updates", () => { useAppStore.getState().setBookingDraft({ guests: 5 }); expect(useAppStore.getState().bookingDraft.guests).toBe(5); });
});

describe("App Store — UI state", () => {
  it("auth modal starts closed", () => { expect(useAppStore.getState().authModalOpen).toBe(false); });
  it("openAuth opens the modal with specified mode", () => { useAppStore.getState().openAuth("register"); expect(useAppStore.getState().authModalOpen).toBe(true); expect(useAppStore.getState().authMode).toBe("register"); });
  it("openAuth defaults to login mode", () => { useAppStore.getState().openAuth(); expect(useAppStore.getState().authMode).toBe("login"); });
  it("closeAuth closes the modal", () => { useAppStore.getState().openAuth("login"); useAppStore.getState().closeAuth(); expect(useAppStore.getState().authModalOpen).toBe(false); });
  it("search modal starts closed", () => { expect(useAppStore.getState().searchModalOpen).toBe(false); });
  it("setSearchModal toggles search modal", () => { useAppStore.getState().setSearchModal(true); expect(useAppStore.getState().searchModalOpen).toBe(true); });
});
