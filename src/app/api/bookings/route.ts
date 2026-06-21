import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { serializeBooking, json, error } from "@/lib/api";
import { nightsBetween } from "@/lib/persian";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return json({ items: [] });

  const items = await db.booking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { property: { include: { host: true } } },
  });
  return json({ items: items.map(serializeBooking) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { propertyId, userId, checkIn, checkOut, guests } = body;
  if (!propertyId || !userId || !checkIn || !checkOut)
    return error("اطلاعات ناقص است", 400);

  const [property, user] = await Promise.all([
    db.property.findUnique({ where: { id: propertyId } }),
    db.user.findUnique({ where: { id: userId } }),
  ]);
  if (!property) return error("اقامتگاه یافت نشد", 404);
  if (!user) return error("کاربر یافت نشد. لطفاً دوباره وارد شوید", 401);

  const ci = new Date(checkIn);
  const co = new Date(checkOut);
  const nights = nightsBetween(ci, co);
  const cleaningFee = property.cleaningFee;
  const serviceFee = property.serviceFee;
  const totalPrice = property.pricePerNight * nights + cleaningFee + serviceFee;

  const booking = await db.booking.create({
    data: {
      propertyId,
      userId,
      checkIn: ci,
      checkOut: co,
      guests: Number(guests) || 1,
      nights,
      pricePerNight: property.pricePerNight,
      cleaningFee,
      serviceFee,
      totalPrice,
      status: "confirmed",
      paymentStatus: "paid",
    },
    include: { property: { include: { host: true } } },
  });

  return json(serializeBooking(booking), 201);
}
