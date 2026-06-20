import { db } from "@/lib/db";
import { serializeProperty, serializeReview, json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
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
