"use client";

import { useEffect, useState } from "react";
import { theme } from "./ostium/theme";
import { OstiumFooter, OstiumHeader } from "./ostium/header";
import { HeroSection } from "./ostium/sections/HeroSection";
import { ComparisonSection } from "./ostium/sections/ComparisonSection";
import { AgentsSection } from "./ostium/sections/AgentsSection";
import { AlphaSourcesSection } from "./ostium/sections/AlphaSourcesSection";
import { PerformanceSection } from "./ostium/sections/PerformanceSection";
import { SecuritySection } from "./ostium/sections/SecuritySection";
import { CallToActionSection } from "./ostium/sections/CallToActionSection";

export default function OstiumStrategies() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <OstiumHeader currentTime={currentTime} />
      <HeroSection />
      <ComparisonSection />
      <AgentsSection />
      <AlphaSourcesSection />
      <PerformanceSection />
      <SecuritySection />
      <CallToActionSection />
      <OstiumFooter />
    </div>
  );
}
