import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { serializeProperty, serializeReview, json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const p = await db.property.findUnique({
    where: { id },
    include: { host: true },
  });
  if (!p) return error("اقامتگاه یافت نشد", 404);

  const reviews = await db.review.findMany({
    where: { propertyId: id },
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 6,
  });

  return json({
    property: serializeProperty(p),
    reviews: reviews.map(serializeReview),
  });
}

/** DELETE /api/properties/[id] — delete a property */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await db.property.delete({ where: { id } });
    return json({ success: true });
  } catch {
    return error("اقامتگاه یافت نشد", 404);
  }
}

/** PATCH /api/properties/[id] — update a property */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, description, pricePerNight, maxGuests, bedrooms, beds, bathrooms, size, amenities, images } = body;

  const data: any = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (pricePerNight !== undefined) data.pricePerNight = Number(pricePerNight);
  if (maxGuests !== undefined) data.maxGuests = Number(maxGuests);
  if (bedrooms !== undefined) data.bedrooms = Number(bedrooms);
  if (beds !== undefined) data.beds = Number(beds);
  if (bathrooms !== undefined) data.bathrooms = Number(bathrooms);
  if (size !== undefined) data.size = size ? Number(size) : null;
  if (amenities !== undefined) data.amenities = JSON.stringify(amenities);
  if (images !== undefined) data.images = JSON.stringify(images);

  const updated = await db.property.update({
    where: { id },
    data,
    include: { host: true },
  });
  return json({ property: serializeProperty(updated) });
}

