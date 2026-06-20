import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { json } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return json({ items: [] });

  const items = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return json({ items });
}
