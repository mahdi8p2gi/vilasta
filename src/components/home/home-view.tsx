"use client";

import { Hero } from "@/components/home/hero";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { PopularDestinations } from "@/components/home/popular-destinations";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { HostCta } from "@/components/home/host-cta";
import { HowItWorks } from "@/components/home/how-it-works";

export function HomeView() {
  return (
    <div className="flex flex-col">
      <Hero />
      <CategoriesSection />
      <FeaturedProperties title="اقامتگاه‌های منتخب هفته" />
      <PopularDestinations />
      <HowItWorks />
      <FeaturedProperties title="جدیدترین اقامتگاه‌ها" limit={4} />
      <Testimonials />
      <HostCta />
      <Faq />
    </div>
  );
}
