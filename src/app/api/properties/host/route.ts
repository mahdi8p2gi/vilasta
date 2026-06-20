import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { serializeProperty, json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const hostId = req.nextUrl.searchParams.get("hostId");
  if (!hostId) return json({ items: [] });

  const items = await db.property.findMany({
    where: { hostId },
    orderBy: { createdAt: "desc" },
    include: { host: true },
  });
  return json({ items: items.map(serializeProperty) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { hostId, title, description, type, city, province, address,
    pricePerNight, maxGuests, bedrooms, beds, bathrooms, size, amenities, images } = body;

  if (!hostId || !title || !type || !city || !pricePerNight)
    return error("اطلاعات ناقص است", 400);

  const property = await db.property.create({
    data: {
      hostId,
      title,
      description: description || "",
      type,
      city,
      province: province || city,
      address: address || city,
      pricePerNight: Number(pricePerNight),
      maxGuests: Number(maxGuests) || 2,
      bedrooms: Number(bedrooms) || 1,
      beds: Number(beds) || 1,
      bathrooms: Number(bathrooms) || 1,
      size: size ? Number(size) : null,
      amenities: JSON.stringify(amenities || []),
      images: JSON.stringify(images || ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"]),
      rules: JSON.stringify([]),
      cleaningFee: Math.round(Number(pricePerNight) * 0.1),
      serviceFee: Math.round(Number(pricePerNight) * 0.05),
      status: "active",
    },
    include: { host: true },
  });

  return json(serializeProperty(property), 201);
}
