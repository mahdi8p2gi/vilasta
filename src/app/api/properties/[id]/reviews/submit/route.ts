import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

/** POST /api/properties/[id]/reviews/submit — submit a new review */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: propertyId } = await params;
  const body = await req.json();
  const { userId, rating, comment, cleanliness, communication, checkIn, accuracy, location, value } = body;

  if (!userId || !rating || !comment) return error("اطلاعات ناقص است", 400);

  const property = await db.property.findUnique({ where: { id: propertyId } });
  if (!property) return error("اقامتگاه یافت نشد", 404);

  const review = await db.review.create({
    data: {
      propertyId,
      userId,
      rating: Number(rating),
      comment,
      cleanliness: Number(cleanliness) || Number(rating),
      communication: Number(communication) || Number(rating),
      checkIn: Number(checkIn) || Number(rating),
      accuracy: Number(accuracy) || Number(rating),
      location: Number(location) || Number(rating),
      value: Number(value) || Number(rating),
    },
    include: { user: true },
  });

  // Recalculate property rating & reviewCount
  const allReviews = await db.review.findMany({ where: { propertyId } });
  const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await db.property.update({
    where: { id: propertyId },
    data: { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length },
  });

  return json({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    cleanliness: review.cleanliness,
    communication: review.communication,
    checkIn: review.checkIn,
    accuracy: review.accuracy,
    location: review.location,
    value: review.value,
    propertyId: review.propertyId,
    userId: review.userId,
    user: review.user ? { id: review.user.id, name: review.user.name, avatar: review.user.avatar } : null,
    createdAt: review.createdAt,
  }, 201);
}
