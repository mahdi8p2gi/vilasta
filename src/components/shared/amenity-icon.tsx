"use client";

import {
  Wifi, Waves, Car, Snowflake, ChefHat, Tv, WashingMachine, Flame,
  Utensils, Dumbbell, Sparkles, PanelTop, Flower2, Mountain, ArrowUpDown,
  ShieldCheck, PawPrint, type LucideIcon,
} from "lucide-react";
import { amenityMeta } from "@/config/site";

const iconMap: Record<string, LucideIcon> = {
  wifi: Wifi,
  pool: Waves,
  parking: Car,
  ac: Snowflake,
  kitchen: ChefHat,
  tv: Tv,
  washer: WashingMachine,
  heater: Flame,
  breakfast: Utensils,
  gym: Dumbbell,
  spa: Sparkles,
  balcony: PanelTop,
  garden: Flower2,
  bbq: Flame,
  fireplace: Flame,
  elevator: ArrowUpDown,
  security: ShieldCheck,
  seaView: Waves,
  mountainView: Mountain,
  petFriendly: PawPrint,
};

export function AmenityIcon({
  amenity,
  className,
  size = 18,
}: {
  amenity: string;
  className?: string;
  size?: number;
}) {
  const Icon = iconMap[amenity] ?? Sparkles;
  return <Icon className={className} style={{ width: size, height: size }} />;
}

export function AmenityBadge({ amenity }: { amenity: string }) {
  const meta = amenityMeta[amenity];
  const Icon = iconMap[amenity] ?? Sparkles;
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-1 py-2">
      <Icon className="h-5 w-5 text-emerald-brand shrink-0" />
      <span className="text-sm">{meta?.label ?? amenity}</span>
    </div>
  );
}
