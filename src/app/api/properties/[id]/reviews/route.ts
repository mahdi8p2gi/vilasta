import { db } from "@/lib/db";
import { serializeReview, json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reviews = await db.review.findMany({
    where: { propertyId: id },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
  if (!reviews.length) return json({ items: [], summary: null });

  const avg = (key: keyof (typeof reviews)[0]) =>
    reviews.reduce((s, r) => s + (r[key] as number), 0) / reviews.length;

  const summary = {
    total: reviews.length,
    rating: avg("rating"),
    cleanliness: avg("cleanliness"),
    communication: avg("communication"),
    checkIn: avg("checkIn"),
    accuracy: avg("accuracy"),
    location: avg("location"),
    value: avg("value"),
  };

  return json({
    items: reviews.map(serializeReview),
    summary,
  });
}
