import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { serializeProperty, json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return json({ items: [] });

  const favs = await db.favorite.findMany({
    where: { userId },
    include: { property: { include: { host: true } } },
    orderBy: { createdAt: "desc" },
  });
  return json({
    items: favs.map((f) => serializeProperty(f.property)),
  });
}

export async function POST(req: NextRequest) {
  const { userId, propertyId } = await req.json();
  if (!userId || !propertyId) return error("اطلاعات ناقص است", 400);

  const existing = await db.favorite.findUnique({
    where: { userId_propertyId: { userId, propertyId } },
  });
  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
    return json({ favorited: false });
  }

  await db.favorite.create({ data: { userId, propertyId } });
  return json({ favorited: true }, 201);
}
