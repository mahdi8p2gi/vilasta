"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthModal } from "@/components/auth/auth-modal";
import { SearchModal } from "@/components/shared/search-modal";
import { useAppStore } from "@/store/app-store";
import { HomeView } from "@/components/home/home-view";
import { ListingView } from "@/components/property/listing-view";
import { PropertyDetailView } from "@/components/property/property-detail-view";
import { BookingView } from "@/components/booking/booking-view";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { HostDashboard } from "@/components/dashboard/host-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { DestinationsView } from "@/components/destinations/destinations-view";
import { ExperiencesView } from "@/components/experiences/experiences-view";
import { HostIntroView } from "@/components/host/host-intro-view";
import { BackToTop } from "@/components/shared/back-to-top";

const viewVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function AppShell() {
  const { view, selectedPropertyId } = useAppStore();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view, selectedPropertyId]);

  const renderView = () => {
    switch (view) {
      case "home":
        return <HomeView />;
      case "listing":
        return <ListingView />;
      case "property":
        return <PropertyDetailView propertyId={selectedPropertyId} />;
      case "booking":
        return <BookingView propertyId={selectedPropertyId} />;
      case "dashboard-user":
        return <UserDashboard />;
      case "dashboard-host":
        return <HostDashboard />;
      case "dashboard-admin":
        return <AdminDashboard />;
      case "destinations":
        return <DestinationsView />;
      case "experiences":
        return <ExperiencesView />;
      case "host-intro":
        return <HostIntroView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view + (selectedPropertyId ?? "")}
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />

      <AuthModal />
      <SearchModal />
      <BackToTop />
    </div>
  );
}
