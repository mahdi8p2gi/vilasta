import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

/** PATCH /api/properties/[id]/status — update property status (approve/suspend) */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body;
  if (!["active", "pending", "suspended"].includes(status))
    return error("وضعیت نامعتبر است", 400);

  const updated = await db.property.update({
    where: { id },
    data: { status },
    include: { host: true },
  });
  return json({ property: { ...updated, amenities: JSON.parse(updated.amenities), images: JSON.parse(updated.images), rules: JSON.parse(updated.rules) } });
}
