// ============================================================================
//  App Store — view routing, auth, booking, favorites (client-side SPA)
// ============================================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Property, User, UserRole } from "@/types";

export type AppView =
  | "home"
  | "listing"
  | "property"
  | "booking"
  | "dashboard-user"
  | "dashboard-host"
  | "dashboard-admin"
  | "destinations"
  | "experiences"
  | "host-intro"
  | "auth";

export type DashboardTab =
  | "profile"
  | "bookings"
  | "favorites"
  | "notifications"
  | "reviews"
  | "security"
  | "properties"
  | "add-property"
  | "revenue"
  | "calendar"
  | "users"
  | "analytics"
  | "reports";

export interface SearchParams {
  q: string;
  city: string;
  type: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface BookingDraft {
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
}

interface AppState {
  // --- view routing ---
  view: AppView;
  dashboardTab: DashboardTab;
  selectedPropertyId: string | null;
  prevView: AppView;

  setView: (v: AppView) => void;
  goProperty: (id: string) => void;
  goBooking: (id: string) => void;
  goDashboard: (tab?: DashboardTab) => void;
  goBack: () => void;

  // --- search ---
  search: SearchParams;
  setSearch: (s: Partial<SearchParams>) => void;

  // --- booking draft ---
  bookingDraft: BookingDraft;
  setBookingDraft: (d: Partial<BookingDraft>) => void;

  // --- auth (mock client session) ---
  user: User | null;
  setUser: (u: User | null) => void;
  login: (u: User) => void;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;

  // --- favorites (client-side, persisted) ---
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // --- UI ---
  authModalOpen: boolean;
  authMode: "login" | "register" | "forgot";
  openAuth: (mode?: "login" | "register" | "forgot") => void;
  closeAuth: () => void;

  mobileMenuOpen: boolean;
  setMobileMenu: (o: boolean) => void;

  searchModalOpen: boolean;
  setSearchModal: (o: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // view routing
      view: "home",
      dashboardTab: "profile",
      selectedPropertyId: null,
      prevView: "home",

      setView: (v) =>
        set((s) => ({ view: v, prevView: s.view, mobileMenuOpen: false })),
      goProperty: (id) =>
        set((s) => ({ view: "property", selectedPropertyId: id, prevView: s.view })),
      goBooking: (id) =>
        set((s) => ({ view: "booking", selectedPropertyId: id, prevView: s.view })),
      goDashboard: (tab) =>
        set((s) => ({
          view: s.user?.role === "host" ? "dashboard-host"
            : s.user?.role === "admin" ? "dashboard-admin"
            : "dashboard-user",
          dashboardTab: tab ?? s.dashboardTab,
          prevView: s.view,
        })),
      goBack: () => set((s) => ({ view: s.prevView })),

      // search
      search: {
        q: "",
        city: "",
        type: "all",
        checkIn: "",
        checkOut: "",
        guests: 2,
      },
      setSearch: (s) => set((state) => ({ search: { ...state.search, ...s } })),

      // booking draft
      bookingDraft: { checkIn: null, checkOut: null, guests: 2 },
      setBookingDraft: (d) =>
        set((s) => ({ bookingDraft: { ...s.bookingDraft, ...d } })),

      // auth
      user: null,
      setUser: (u) => set({ user: u }),
      login: (u) => set({ user: u }),
      logout: () => set({ user: null, view: "home" }),
      hasRole: (...roles) => {
        const r = get().user?.role;
        return !!r && roles.includes(r);
      },

      // favorites
      favorites: [],
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),

      // UI
      authModalOpen: false,
      authMode: "login",
      openAuth: (mode = "login") => set({ authModalOpen: true, authMode: mode }),
      closeAuth: () => set({ authModalOpen: false }),

      mobileMenuOpen: false,
      setMobileMenu: (o) => set({ mobileMenuOpen: o }),

      searchModalOpen: false,
      setSearchModal: (o) => set({ searchModalOpen: o }),
    }),
    {
      name: "vilasta-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        favorites: s.favorites,
        user: s.user,
        search: s.search,
        view: s.view === "property" || s.view === "booking" ? "home" : s.view,
      }),
    }
  )
);
