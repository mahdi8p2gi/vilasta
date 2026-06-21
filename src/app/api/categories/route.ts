import { db } from "@/lib/db";
import { json } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await db.category.findMany({
    orderBy: { propertyCount: "desc" },
  });
  return json({ items });
}
