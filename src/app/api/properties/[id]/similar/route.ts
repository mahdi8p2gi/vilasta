import { db } from "@/lib/db";
import { serializeProperty, json } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const current = await db.property.findUnique({
    where: { id },
    select: { type: true, city: true, pricePerNight: true },
  });
  if (!current) return json({ items: [] });

  const items = await db.property.findMany({
    where: {
      id: { not: id },
      status: "active",
      OR: [{ type: current.type }, { city: current.city }],
    },
    orderBy: { rating: "desc" },
    take: 4,
    include: { host: true },
  });
  return json({ items: items.map(serializeProperty) });
}
