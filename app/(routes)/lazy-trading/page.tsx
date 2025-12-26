"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { theme } from "@/app/components/ostium/theme";
import { OstiumHeader, OstiumFooter } from "@/app/components/ostium/header";
import { ProgressSteps } from "@/app/components/lazy-trading/ProgressSteps";
import { WalletStep } from "@/app/components/lazy-trading/WalletStep";
import { TelegramStep } from "@/app/components/lazy-trading/TelegramStep";
import { OstiumStep } from "@/app/components/lazy-trading/OstiumStep";
import { CompleteStep } from "@/app/components/lazy-trading/CompleteStep";
import { LazyTradingLanding } from "@/app/components/lazy-trading/LazyTradingLanding";
import {
  TradingPreferencesForm,
  TradingPreferences,
} from "@/app/components/lazy-trading/TradingPreferencesModal";
import { useLazyTrading, Step } from "@/app/components/lazy-trading/hooks/useLazyTrading";
import { useTelegram } from "@/app/components/lazy-trading/hooks/useTelegram";
import { useOstium } from "@/app/components/lazy-trading/hooks/useOstium";
import { useEthSending } from "@/app/components/lazy-trading/hooks/useEthSending";
import { AlertCircle, Zap } from "lucide-react";
import { fonts } from "@/app/components/ostium/theme";
import { apiPost } from "@/app/lib/api";

function LazyTradingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authenticated, user, login } = usePrivy();
  const [currentTime, setCurrentTime] = useState("");

  // Update current time for header
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

  // Show setup wizard
  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <OstiumHeader currentTime={currentTime} />
      <LazyTradingLanding />
      <OstiumFooter />
    </div>
  );
}

export default function LazyTrading() {
  return (
    <Suspense fallback={
      <div className="min-h-screen" style={{ background: theme.bg }}>
        <OstiumHeader currentTime="" />
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: theme.textMuted, fontFamily: fonts.body }}>Loading...</p>
        </div>
        <OstiumFooter />
      </div>
    }>
      <LazyTradingContent />
    </Suspense>
  );
}
