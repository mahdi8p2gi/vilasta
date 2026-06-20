"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  Property, Destination, Category, Review, Booking, Notification, Paginated, PropertyFilters,
} from "@/types";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ["properties", "featured"],
    queryFn: () => fetchJson<{ items: Property[] }>("/api/properties/featured").then((r) => r.items),
  });
}

export function useProperties(filters: Partial<PropertyFilters> = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) {
      params.set(k, Array.isArray(v) ? v.join(",") : String(v));
    }
  });
  return useQuery({
    queryKey: ["properties", "list", filters],
    queryFn: () =>
      fetchJson<Paginated<Property>>(`/api/properties?${params.toString()}`),
  });
}

export function useProperty(id: string | null) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () =>
      fetchJson<{ property: Property; reviews: Review[] }>(`/api/properties/${id}`),
    enabled: !!id,
  });
}

export function usePropertyReviews(id: string | null) {
  return useQuery({
    queryKey: ["property", id, "reviews"],
    queryFn: () =>
      fetchJson<{ items: Review[]; summary: any }>(`/api/properties/${id}/reviews`),
    enabled: !!id,
  });
}

export function useSimilarProperties(id: string | null) {
  return useQuery({
    queryKey: ["property", id, "similar"],
    queryFn: () => fetchJson<{ items: Property[] }>(`/api/properties/${id}/similar`).then((r) => r.items),
    enabled: !!id,
  });
}

export function useDestinations() {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: () => fetchJson<{ items: Destination[] }>("/api/destinations").then((r) => r.items),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchJson<{ items: Category[] }>("/api/categories").then((r) => r.items),
  });
}

export function useBookings(userId: string | null) {
  return useQuery({
    queryKey: ["bookings", userId],
    queryFn: () => fetchJson<{ items: Booking[] }>(`/api/bookings?userId=${userId}`).then((r) => r.items),
    enabled: !!userId,
  });
}

export function useFavorites(userId: string | null) {
  return useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => fetchJson<{ items: Property[] }>(`/api/favorites?userId=${userId}`).then((r) => r.items),
    enabled: !!userId,
  });
}

export function useNotifications(userId: string | null) {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => fetchJson<{ items: Notification[] }>(`/api/notifications?userId=${userId}`).then((r) => r.items),
    enabled: !!userId,
  });
}

export function useHostProperties(hostId: string | null) {
  return useQuery({
    queryKey: ["properties", "host", hostId],
    queryFn: () => fetchJson<{ items: Property[] }>(`/api/properties/host?hostId=${hostId}`).then((r) => r.items),
    enabled: !!hostId,
  });
}

export function useHostAnalytics(hostId: string | null) {
  return useQuery({
    queryKey: ["analytics", "host", hostId],
    queryFn: () => fetchJson<any>(`/api/analytics/host?hostId=${hostId}`),
    enabled: !!hostId,
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["analytics", "admin"],
    queryFn: () => fetchJson<any>(`/api/analytics/admin`),
  });
}
