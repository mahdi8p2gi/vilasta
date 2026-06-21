import { db } from "@/lib/db";
import { json } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const [users, properties, bookings, reviews] = await Promise.all([
    db.user.findMany({ orderBy: { createdAt: "desc" } }),
    db.property.findMany({
      orderBy: { createdAt: "desc" },
      include: { host: true },
      take: 50,
    }),
    db.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { property: true, user: true },
      take: 50,
    }),
    db.review.findMany({
      orderBy: { createdAt: "desc" },
      include: { property: true, user: true },
      take: 50,
    }),
  ]);

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((s, b) => s + b.totalPrice, 0);

  // User role breakdown
  const roleBreakdown = {
    admin: users.filter((u) => u.role === "admin").length,
    host: users.filter((u) => u.role === "host").length,
    customer: users.filter((u) => u.role === "customer").length,
    guest: users.filter((u) => u.role === "guest").length,
  };

  // Property type breakdown
  const typeBreakdown: Record<string, number> = {};
  properties.forEach((p) => {
    typeBreakdown[p.type] = (typeBreakdown[p.type] || 0) + 1;
  });

  // Monthly growth (last 8 months)
  const months: { label: string; revenue: number; bookings: number; users: number }[] = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const mBookings = bookings.filter((b) => {
      const ci = new Date(b.checkIn);
      return ci >= d && ci < next && b.paymentStatus === "paid";
    });
    const mUsers = users.filter((u) => {
      const cu = new Date(u.createdAt);
      return cu >= d && cu < next;
    });
    months.push({
      label: new Intl.DateTimeFormat("fa-IR", { month: "short" }).format(d),
      revenue: mBookings.reduce((s, b) => s + b.totalPrice, 0),
      bookings: mBookings.length,
      users: mUsers.length,
    });
  }

  return json({
    stats: {
      totalUsers: users.length,
      totalProperties: properties.length,
      totalBookings: bookings.length,
      totalReviews: reviews.length,
      totalRevenue,
      avgRating:
        properties.reduce((s, p) => s + p.rating, 0) / (properties.length || 1),
    },
    roleBreakdown,
    typeBreakdown,
    growth: months,
    users: users.slice(0, 20),
    properties: properties.slice(0, 20),
    bookings: bookings.slice(0, 20),
    reviews: reviews.slice(0, 20),
  });
}
