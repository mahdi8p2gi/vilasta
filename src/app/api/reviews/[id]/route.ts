import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

/** DELETE /api/reviews/[id] — delete a review */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await db.review.delete({ where: { id } });
    return json({ success: true });
  } catch {
    return error("نظر یافت نشد", 404);
  }
}
