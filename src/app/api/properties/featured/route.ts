import { db } from "@/lib/db";
import { serializeProperty, json } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await db.property.findMany({
    where: { status: "active", rating: { gte: 4.7 } },
    orderBy: { rating: "desc" },
    take: 8,
    include: { host: true },
  });
  return json({ items: items.map(serializeProperty) });
}
