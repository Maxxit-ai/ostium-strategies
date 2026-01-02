"use client";

import { useState, useEffect, Suspense } from "react";
import { theme, fonts } from "@/app/components/ostium/theme";
import { OstiumHeader, OstiumFooter } from "@/app/components/ostium/header";
import { TraderTable } from "@/app/components/top-traders/TraderTable";
import { Trader } from "@/app/components/top-traders/TraderCard";
import { Trophy, TrendingUp, Users, Zap } from "lucide-react";

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div
            className="p-4 rounded-xl flex items-center gap-3"
            style={{
                background: theme.surface,
                border: `1px solid ${theme.stroke}`,
            }}
        >
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: theme.primarySoft }}
            >
                <Icon className="w-5 h-5" style={{ color: theme.primary }} />
            </div>
            <div>
                <div className="text-xs uppercase tracking-wide" style={{ color: theme.textMuted }}>
                    {label}
                </div>
                <div className="text-lg font-bold" style={{ color: theme.text, fontFamily: fonts.heading }}>
                    {value}
                </div>
            </div>
        </div>
    );
}

function TopTradersContent() {
    const [traders, setTraders] = useState<Trader[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTraders() {
            try {
                const response = await fetch("/api/top-traders");
                if (!response.ok) {
                    throw new Error("Failed to fetch traders");
                }
                const data = await response.json();
                setTraders(data.traders);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsLoading(false);
            }
        }

        fetchTraders();
    }, []);

    // Calculate aggregate stats
    const totalPnl = traders.reduce((sum, t) => sum + parseFloat(t.totalPnl) / 1e6, 0);
    const totalTrades = traders.reduce((sum, t) => sum + t.totalTrades, 0);
    const avgImpact = traders.length > 0
        ? traders.reduce((sum, t) => sum + t.impactFactor, 0) / traders.length
        : 0;

    return (
        <div className="min-h-screen" style={{ background: theme.bg }}>
            <OstiumHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Page Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: theme.primarySoft }}>
                        <Trophy className="w-4 h-4" style={{ color: theme.primary }} />
                        <span className="text-sm font-semibold" style={{ color: theme.primary }}>
                            Ostium Leaderboard
                        </span>
                    </div>
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                        style={{ color: theme.text, fontFamily: fonts.heading }}
                    >
                        Top Traders
                    </h1>
                    <p
                        className="text-base sm:text-lg max-w-2xl mx-auto"
                        style={{ color: theme.textMuted, fontFamily: fonts.body }}
                    >
                        Discover the most successful traders on Ostium, ranked by their impact factor score —
                        a metric combining edge, consistency, stake, and freshness.
                    </p>
                </div>

                {/* Stats Overview */}
                {!isLoading && !error && traders.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
                        <StatCard icon={Users} label="Top Traders" value={traders.length.toString()} />
                        <StatCard
                            icon={TrendingUp}
                            label="Combined PnL"
                            value={`$${(totalPnl / 1e6).toFixed(1)}M`}
                        />
                        <StatCard icon={Zap} label="Total Trades" value={totalTrades.toLocaleString()} />
                        <StatCard icon={Trophy} label="Avg Impact" value={avgImpact.toFixed(1)} />
                    </div>
                )}

                {/* Trader Table */}
                <TraderTable traders={traders} isLoading={isLoading} error={error} />
            </main>

            <OstiumFooter />
        </div>
    );
}

export default function TopTradersPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen" style={{ background: theme.bg }}>
                    <OstiumHeader />
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <div
                                className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-4"
                                style={{ borderColor: theme.stroke, borderTopColor: theme.primary }}
                            />
                            <p style={{ color: theme.textMuted, fontFamily: fonts.body }}>Loading...</p>
                        </div>
                    </div>
                    <OstiumFooter />
                </div>
            }
        >
            <TopTradersContent />
        </Suspense>
    );
}
