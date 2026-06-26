import type { Property, User, Review, Booking, Notification } from "@/types";

export const mockUsers: Record<string, User> = {
  admin: { id: "user-admin-001", email: "admin@villa.ir", name: "مدیر سیستم", role: "admin", avatar: "https://i.pravatar.cc/150?img=12", phone: "09120000001", bio: "مدیر پلتفرم", createdAt: "2024-01-01T00:00:00.000Z" },
  host: { id: "user-host-001", email: "host@villa.ir", name: "مهدی صادقی", role: "host", avatar: "https://i.pravatar.cc/150?img=33", phone: "09120000002", bio: "میزبان حرفه‌ای", createdAt: "2024-02-15T00:00:00.000Z" },
  customer: { id: "user-customer-001", email: "user@villa.ir", name: "سپهر کاظمی", role: "customer", avatar: "https://i.pravatar.cc/150?img=68", phone: "09120000003", createdAt: "2024-03-20T00:00:00.000Z" },
  guest: { id: "user-guest-001", email: "guest@example.com", name: null, role: "guest", avatar: null, createdAt: "2024-06-01T00:00:00.000Z" },
};

export const mockProperty: Property = {
  id: "prop-001", title: "ویلا لوکس ساحلی کیش", description: "ویلایی فوق‌العاده لوکس در بهترین موقعیت ساحلی جزیره کیش",
  type: "villa", status: "active", city: "کیش", province: "هرمزگان", address: "کیش، بلوار ساحل، ویلاهای لوکس",
  lat: 26.5501, lng: 53.9792, pricePerNight: 4_500_000, cleaningFee: 450_000, serviceFee: 225_000,
  weeklyDiscount: 10, monthlyDiscount: 20, maxGuests: 8, bedrooms: 4, beds: 5, bathrooms: 3, size: 320,
  rating: 4.9, reviewCount: 62, amenities: ["wifi", "pool", "parking", "ac", "kitchen", "tv", "seaView"],
  images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200", "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200"],
  rules: ["بدون مهمانی", "بدون سیگار"], hostId: "user-host-001",
  host: { id: "user-host-001", name: "مهدی صادقی", avatar: "https://i.pravatar.cc/150?img=33", bio: "میزبان حرفه‌ای", role: "host" },
  createdAt: "2024-01-10T00:00:00.000Z", updatedAt: "2024-06-15T00:00:00.000Z",
};

export const mockProperties: Property[] = [
  mockProperty,
  { ...mockProperty, id: "prop-002", title: "هتل ۵ ستاره پارسیان", type: "hotel", city: "تهران", province: "تهران", pricePerNight: 2_200_000, rating: 4.7, reviewCount: 35, maxGuests: 3, bedrooms: 1 },
  { ...mockProperty, id: "prop-003", title: "اقامتگاه بوم‌گردی یزد", type: "resort", city: "یزد", province: "یزد", pricePerNight: 1_450_000, rating: 4.8, reviewCount: 28 },
];

export const mockReview: Review = {
  id: "rev-001", rating: 5, comment: "اقامتگاه فوق‌العاده‌ای بود! از لحظه ورود تا خروج همه چیز بی‌نقص بود.",
  cleanliness: 5, communication: 5, checkIn: 5, accuracy: 5, location: 4.8, value: 4.9,
  propertyId: "prop-001", userId: "user-customer-001",
  user: { id: "user-customer-001", name: "سپهر کاظمی", avatar: "https://i.pravatar.cc/150?img=68" },
  createdAt: "2024-06-10T10:00:00.000Z",
};

export const mockBooking: Booking = {
  id: "book-001", checkIn: "2024-07-01T00:00:00.000Z", checkOut: "2024-07-05T00:00:00.000Z",
  guests: 2, nights: 4, pricePerNight: 4_500_000, cleaningFee: 450_000, serviceFee: 225_000,
  totalPrice: 18_675_000, status: "confirmed", paymentStatus: "paid",
  propertyId: "prop-001", property: mockProperty, userId: "user-customer-001", createdAt: "2024-06-20T00:00:00.000Z",
};

export const mockNotification: Notification = {
  id: "notif-001", title: "رزرو شما تأیید شد", message: "اقامتگاه شما با موفقیت رزرو شد.", type: "success", read: false, createdAt: "2024-06-20T12:00:00.000Z",
};

export const mockNotifications: Notification[] = [
  mockNotification,
  { ...mockNotification, id: "notif-002", title: "پیشنهاد ویژه", message: "تخفیف ۲۰ درصدی برای رزرو بعدی شما در کیش!", type: "info", read: true, createdAt: "2024-06-19T08:00:00.000Z" },
  { ...mockNotification, id: "notif-003", title: "نظر خود را ثبت کنید", message: "از اقامت اخیر خود چه فکر می‌کنید؟", type: "warning", read: false, createdAt: "2024-06-18T14:00:00.000Z" },
];
