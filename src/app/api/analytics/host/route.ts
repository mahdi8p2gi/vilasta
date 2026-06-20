import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { json } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const hostId = req.nextUrl.searchParams.get("hostId");
  if (!hostId) return json({ stats: null, revenue: [], bookings: [] });

  const properties = await db.property.findMany({
    where: { hostId },
    select: { id: true, title: true, pricePerNight: true, rating: true, reviewCount: true },
  });
  const propertyIds = properties.map((p) => p.id);

  const bookings = await db.booking.findMany({
    where: { propertyId: { in: propertyIds } },
    include: { property: true },
    orderBy: { checkIn: "asc" },
  });

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((s, b) => s + b.totalPrice, 0);

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;

  // Monthly revenue series (last 8 months)
  const months: { label: string; revenue: number; bookings: number }[] = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthBookings = bookings.filter((b) => {
      const ci = new Date(b.checkIn);
      return ci >= d && ci < next && b.paymentStatus === "paid";
    });
    months.push({
      label: new Intl.DateTimeFormat("fa-IR", { month: "short" }).format(d),
      revenue: monthBookings.reduce((s, b) => s + b.totalPrice, 0),
      bookings: monthBookings.length,
    });
  }

  // Top properties by revenue
  const propertyStats = properties.map((p) => {
    const pBookings = bookings.filter((b) => b.propertyId === p.id);
    return {
      id: p.id,
      title: p.title,
      rating: p.rating,
      reviewCount: p.reviewCount,
      bookings: pBookings.length,
      revenue: pBookings
        .filter((b) => b.paymentStatus === "paid")
        .reduce((s, b) => s + b.totalPrice, 0),
    };
  }).sort((a, b) => b.revenue - a.revenue);

  return json({
    stats: {
      totalProperties: properties.length,
      totalBookings: bookings.length,
      totalRevenue,
      confirmed,
      completed,
      pending,
      avgRating:
        properties.reduce((s, p) => s + p.rating, 0) / (properties.length || 1),
    },
    revenue: months,
    propertyStats,
  });
}
