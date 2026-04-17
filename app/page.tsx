"use client";

import { useState, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { LiveMarketTicker } from "@/components/live-market-ticker";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { MarketsDashboard } from "@/components/markets-dashboard";
import { RevenueDashboard } from "@/components/revenue-dashboard";
import { Investors } from "@/components/investors";
import { Compliance } from "@/components/compliance";
import { Footer } from "@/components/footer";
import { WaitlistModal } from "@/components/waitlist-modal";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Home() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(5);

  const handleWaitlistOpen = useCallback(() => {
    setIsWaitlistOpen(true);
  }, []);

  const handleWaitlistSuccess = useCallback(() => {
    setWaitlistCount((prev) => prev + 1);
  }, []);

  return (
    <TooltipProvider>
      <div className="relative min-h-screen">
        {/* Navigation */}
        <Navigation onWaitlistClick={handleWaitlistOpen} />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <Hero
            onWaitlistClick={handleWaitlistOpen}
            waitlistCount={waitlistCount}
          />

          {/* Features Section */}
          <Features />

          {/* How It Works Section */}
          <HowItWorks />

          {/* Live Markets Dashboard */}
          <MarketsDashboard />

          {/* Revenue Command Dashboard */}
          <RevenueDashboard />

          {/* Investors Section */}
          <Investors />

          {/* Compliance Section */}
          <Compliance />
        </main>

        {/* Footer */}
        <Footer onWaitlistClick={handleWaitlistOpen} />

        {/* Waitlist Modal */}
        <WaitlistModal
          open={isWaitlistOpen}
          onOpenChange={setIsWaitlistOpen}
          onSuccess={handleWaitlistSuccess}
        />
      </div>
    </TooltipProvider>
  );
}
