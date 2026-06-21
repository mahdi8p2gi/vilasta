// ============================================================================
//  Domain Types — shared across the platform
// ============================================================================

export type UserRole = "guest" | "customer" | "host" | "admin";

export type PropertyType = "villa" | "hotel" | "apartment" | "resort" | "cottage";

export type PropertyStatus = "active" | "pending" | "suspended";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  city: string;
  province: string;
  address: string;
  lat: number | null;
  lng: number | null;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  size: number | null;
  rating: number;
  reviewCount: number;
  amenities: string[];
  images: string[];
  rules: string[];
  hostId: string;
  host?: HostSummary;
  createdAt: string;
  updatedAt: string;
}

export interface HostSummary {
  id: string;
  name: string | null;
  avatar: string | null;
  bio?: string | null;
  role: UserRole;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  cleanliness: number;
  communication: number;
  checkIn: number;
  accuracy: number;
  location: number;
  value: number;
  propertyId: string;
  userId: string;
  user?: { id: string; name: string | null; avatar: string | null };
  createdAt: string;
}

export interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  propertyId: string;
  property?: Property;
  userId: string;
  createdAt: string;
}

export interface Destination {
  id: string;
  name: string;
  province: string;
  image: string;
  propertyCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  propertyCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  phone?: string | null;
  name?: string | null;
  avatar?: string | null;
  role: UserRole;
  bio?: string | null;
  emailVerified?: string | null;
  createdAt: string;
}

// ---- Query / filter DTOs ----
export interface PropertyFilters {
  q?: string;
  type?: PropertyType | "all";
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  guests?: number;
  bedrooms?: number;
  amenities?: string[];
  sort?: "recommended" | "price_asc" | "price_desc" | "rating" | "newest";
  page?: number;
  limit?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
