import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { serializeProperty, json } from "@/lib/api";
import type { PropertyFilters } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filters: PropertyFilters = {
    q: sp.get("q") || undefined,
    type: (sp.get("type") as any) || "all",
    city: sp.get("city") || undefined,
    minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
    minRating: sp.get("minRating") ? Number(sp.get("minRating")) : undefined,
    guests: sp.get("guests") ? Number(sp.get("guests")) : undefined,
    bedrooms: sp.get("bedrooms") ? Number(sp.get("bedrooms")) : undefined,
    amenities: sp.get("amenities")?.split(",").filter(Boolean) || undefined,
    sort: (sp.get("sort") as any) || "recommended",
    page: sp.get("page") ? Number(sp.get("page")) : 1,
    limit: sp.get("limit") ? Number(sp.get("limit")) : 12,
  };

  const where: any = { status: "active" };
  if (filters.type && filters.type !== "all") where.type = filters.type;
  if (filters.city) where.city = { contains: filters.city };
  if (filters.minPrice) where.pricePerNight = { gte: filters.minPrice };
  if (filters.maxPrice)
    where.pricePerNight = {
      ...(where.pricePerNight || {}),
      lte: filters.maxPrice,
    };
  if (filters.minRating) where.rating = { gte: filters.minRating };
  if (filters.guests) where.maxGuests = { gte: filters.guests };
  if (filters.bedrooms) where.bedrooms = { gte: filters.bedrooms };
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q } },
      { description: { contains: filters.q } },
      { city: { contains: filters.q } },
      { province: { contains: filters.q } },
    ];
  }

  const orderBy: any =
    filters.sort === "price_asc"
      ? [{ pricePerNight: "asc" }]
      : filters.sort === "price_desc"
      ? [{ pricePerNight: "desc" }]
      : filters.sort === "rating"
      ? [{ rating: "desc" }]
      : filters.sort === "newest"
      ? [{ createdAt: "desc" }]
      : [{ rating: "desc" }, { reviewCount: "desc" }];

  const page = filters.page || 1;
  const limit = filters.limit || 12;

  const [total, items] = await Promise.all([
    db.property.count({ where }),
    db.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { host: true },
    }),
  ]);

  let serialized = items.map(serializeProperty);

  if (filters.amenities && filters.amenities.length) {
    serialized = serialized.filter((p) =>
      filters.amenities!.every((a) => p.amenities.includes(a))
    );
  }

  return json({
    items: serialized,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
