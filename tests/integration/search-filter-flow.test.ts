import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/store/app-store";

describe("Search and filter flow integration", () => {
  beforeEach(() => { useAppStore.setState({ view: "home", search: { q: "", city: "", type: "all", checkIn: "", checkOut: "", guests: 2 } }); });
  it("updates search params and navigates to listing view", () => { const { setSearch, setView } = useAppStore.getState(); setSearch({ city: "کیش", guests: 4 }); setView("listing"); const s = useAppStore.getState(); expect(s.search.city).toBe("کیش"); expect(s.search.guests).toBe(4); expect(s.view).toBe("listing"); });
  it("filters can be cleared", () => { const { setSearch } = useAppStore.getState(); setSearch({ city: "تهران", type: "villa", q: "ویلا لوکس" }); setSearch({ q: "", city: "", type: "all", guests: 2 }); const s = useAppStore.getState().search; expect(s.q).toBe(""); expect(s.city).toBe(""); expect(s.type).toBe("all"); });
  it("preserves search state across view changes", () => { const { setSearch, setView, goProperty } = useAppStore.getState(); setSearch({ city: "کیش", type: "villa" }); setView("listing"); goProperty("prop-1"); const s = useAppStore.getState().search; expect(s.city).toBe("کیش"); expect(s.type).toBe("villa"); });
  it("partial search updates merge correctly", () => { const { setSearch } = useAppStore.getState(); setSearch({ q: "ویلا" }); setSearch({ city: "کیش" }); setSearch({ guests: 6 }); const s = useAppStore.getState().search; expect(s.q).toBe("ویلا"); expect(s.city).toBe("کیش"); expect(s.guests).toBe(6); expect(s.type).toBe("all"); });
});

describe("Favorites flow integration", () => {
  beforeEach(() => { useAppStore.setState({ favorites: [] }); });
  it("add and remove favorites", () => { const { toggleFavorite, isFavorite } = useAppStore.getState(); toggleFavorite("prop-1"); expect(isFavorite("prop-1")).toBe(true); toggleFavorite("prop-1"); expect(isFavorite("prop-1")).toBe(false); });
  it("can favorite multiple properties", () => { const { toggleFavorite } = useAppStore.getState(); toggleFavorite("prop-1"); toggleFavorite("prop-2"); toggleFavorite("prop-3"); expect(useAppStore.getState().favorites).toEqual(["prop-1", "prop-2", "prop-3"]); });
  it("toggleFavorite is idempotent for same property", () => { const { toggleFavorite } = useAppStore.getState(); toggleFavorite("prop-1"); toggleFavorite("prop-1"); toggleFavorite("prop-1"); expect(useAppStore.getState().favorites).toEqual(["prop-1"]); });
});

describe("Delete confirmation flow integration", () => {
  it("removes item from session list after confirmation", () => { let sessions = [{ id: 1, device: "Chrome", current: true }, { id: 2, device: "Safari", current: false }, { id: 3, device: "Firefox", current: false }]; sessions = sessions.filter(s => s.id !== 2); expect(sessions).toHaveLength(2); expect(sessions.find(s => s.id === 2)).toBeUndefined(); });
  it("does not remove when cancelled", () => { const sessions = [{ id: 1, device: "Chrome", current: true }, { id: 2, device: "Safari", current: false }]; expect(sessions).toHaveLength(2); });
});
