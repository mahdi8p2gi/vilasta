// ============================================================================
//  API helpers — serialization, parsing, responses
// ============================================================================

import type { Property, Review, Booking } from "@/types";

/** Parse a Prisma property row (JSON string fields) into a typed Property */
export function serializeProperty(p: any): Property {
  return {
    ...p,
    amenities: safeParse(p.amenities, []),
    images: safeParse(p.images, []),
    rules: safeParse(p.rules, []),
    host: p.host
      ? {
          id: p.host.id,
          name: p.host.name,
          avatar: p.host.avatar,
          bio: p.host.bio,
          role: p.host.role,
        }
      : undefined,
  };
}

export function serializeReview(r: any): Review {
  return {
    ...r,
    user: r.user
      ? { id: r.user.id, name: r.user.name, avatar: r.user.avatar }
      : undefined,
  };
}

export function serializeBooking(b: any): Booking {
  return {
    ...b,
    property: b.property ? serializeProperty(b.property) : undefined,
  };
}

export function safeParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function error(message: string, status = 400) {
  return json({ error: message }, status);
}
