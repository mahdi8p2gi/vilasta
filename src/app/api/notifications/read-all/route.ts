import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

/** PATCH /api/notifications/read-all — mark all notifications as read for a user */
export async function PATCH(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return error("شناسه کاربر الزامی است", 400);

  await db.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  return json({ success: true });
}
