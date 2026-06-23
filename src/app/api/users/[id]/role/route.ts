import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

/** PATCH /api/users/[id]/role — update a user's role */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { role } = body;
  if (!["guest", "customer", "host", "admin"].includes(role))
    return error("نقش نامعتبر است", 400);

  const updated = await db.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, bio: true, createdAt: true },
  });
  return json({ user: updated });
}
