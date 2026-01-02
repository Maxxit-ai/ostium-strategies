"use client";

import { useState } from "react";
import { fonts, theme } from "../ostium/theme";
import { ExternalLink, TrendingUp, TrendingDown, Activity, Award, Target, Flame, Clock } from "lucide-react";

export interface Trader {
    id: string;
    rank: number;
    walletAddress: string;
    totalVolume: string;
    totalClosedVolume: string;
    totalPnl: string;
    totalProfitTrades: number;
    totalLossTrades: number;
    totalTrades: number;
    lastActiveAt: string;
    edgeScore: number;
    consistencyScore: number;
    stakeScore: number;
    freshnessScore: number;
    impactFactor: number;
}

function formatPnl(pnl: string): { formatted: string; isPositive: boolean } {
    const value = parseFloat(pnl);
    // Convert from raw units (assuming 6 decimals for USDC-like values)
    const usdValue = value / 1e6;
    const isPositive = usdValue >= 0;
    const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Math.abs(usdValue));
    return { formatted: isPositive ? `+${formatted}` : `-${formatted}`, isPositive };
}

function formatVolume(volume: string): string {
    const value = parseFloat(volume) / 1e6;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
}

function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

function ScoreBar({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
    const percentage = Math.min(value * 100, 100);

    return (
        <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5" style={{ color: theme.textMuted }} />
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase tracking-wide" style={{ color: theme.textMuted }}>
                        {label}
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: theme.text }}>
                        {(value * 100).toFixed(0)}%
                    </span>
                </div>
                <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: theme.surfaceAlt }}
                >
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, ${theme.primary}, #FFC371)`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export function TraderCard({ trader }: { trader: Trader }) {
    const [hovered, setHovered] = useState(false);
    const { formatted: pnlFormatted, isPositive: isPnlPositive } = formatPnl(trader.totalPnl);
    const winRate = trader.totalTrades > 0
        ? ((trader.totalProfitTrades / trader.totalTrades) * 100).toFixed(1)
        : "0";
    const truncatedAddress = `${trader.walletAddress.slice(0, 6)}...${trader.walletAddress.slice(-4)}`;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="p-5 rounded-2xl transition-all duration-200"
            style={{
                background: hovered ? theme.surfaceAlt : theme.surface,
                border: `1px solid ${hovered ? theme.primaryBorder : theme.stroke}`,
                boxShadow: hovered
                    ? "0 25px 60px rgba(0,0,0,0.45)"
                    : "0 1px 0 rgba(255,255,255,0.03)",
                transform: hovered ? "translateY(-4px)" : "none",
            }}
        >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                        style={{
                            background: trader.rank <= 3
                                ? `linear-gradient(135deg, ${theme.primary}, #FFC371)`
                                : theme.surfaceAlt,
                            color: trader.rank <= 3 ? "#0B0603" : theme.text,
                            fontFamily: fonts.heading,
                            border: trader.rank > 3 ? `1px solid ${theme.stroke}` : "none",
                        }}
                    >
                        {trader.rank}
                    </div>
                    <div>
                        <a
                            href={`https://arbiscan.io/address/${trader.walletAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 group"
                        >
                            <span
                                className="font-mono text-sm font-medium group-hover:underline"
                                style={{ color: theme.text }}
                            >
                                {truncatedAddress}
                            </span>
                            <ExternalLink
                                className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity"
                                style={{ color: theme.primary }}
                            />
                        </a>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Clock className="w-3 h-3" style={{ color: theme.textMuted }} />
                            <span className="text-xs" style={{ color: theme.textMuted }}>
                                {getRelativeTime(trader.lastActiveAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Impact Factor Badge */}
                <div
                    className="px-3 py-1.5 rounded-lg"
                    style={{
                        background: theme.primarySoft,
                        border: `1px solid ${theme.primaryBorder}`,
                    }}
                >
                    <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: theme.textMuted }}>
                        Impact
                    </div>
                    <div className="text-lg font-bold" style={{ color: theme.primary, fontFamily: fonts.heading }}>
                        {trader.impactFactor.toFixed(1)}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {/* PnL */}
                <div
                    className="p-3 rounded-xl"
                    style={{ background: theme.surfaceAlt, border: `1px solid ${theme.stroke}` }}
                >
                    <div className="flex items-center gap-1 mb-1">
                        {isPnlPositive ? (
                            <TrendingUp className="w-3 h-3" style={{ color: theme.success }} />
                        ) : (
                            <TrendingDown className="w-3 h-3" style={{ color: "#EF4444" }} />
                        )}
                        <span className="text-[10px] uppercase tracking-wide" style={{ color: theme.textMuted }}>
                            PnL
                        </span>
                    </div>
                    <div
                        className="text-sm font-bold"
                        style={{
                            color: isPnlPositive ? theme.success : "#EF4444",
                            fontFamily: fonts.heading,
                        }}
                    >
                        {pnlFormatted}
                    </div>
                </div>

                {/* Win Rate */}
                <div
                    className="p-3 rounded-xl"
                    style={{ background: theme.surfaceAlt, border: `1px solid ${theme.stroke}` }}
                >
                    <div className="text-[10px] uppercase tracking-wide mb-1" style={{ color: theme.textMuted }}>
                        Win Rate
                    </div>
                    <div className="text-sm font-bold" style={{ color: theme.text, fontFamily: fonts.heading }}>
                        {winRate}%
                    </div>
                </div>

                {/* Trades */}
                <div
                    className="p-3 rounded-xl"
                    style={{ background: theme.surfaceAlt, border: `1px solid ${theme.stroke}` }}
                >
                    <div className="text-[10px] uppercase tracking-wide mb-1" style={{ color: theme.textMuted }}>
                        Trades
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold" style={{ color: theme.text, fontFamily: fonts.heading }}>
                            {trader.totalTrades}
                        </span>
                        <span className="text-[10px]" style={{ color: theme.textMuted }}>
                            ({trader.totalProfitTrades}W / {trader.totalLossTrades}L)
                        </span>
                    </div>
                </div>
            </div>

            {/* Volume */}
            <div className="flex items-center justify-between mb-4 py-2 px-3 rounded-lg" style={{ background: theme.surfaceAlt }}>
                <span className="text-xs" style={{ color: theme.textMuted }}>Total Volume</span>
                <span className="text-sm font-semibold" style={{ color: theme.text, fontFamily: fonts.heading }}>
                    {formatVolume(trader.totalVolume)}
                </span>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-2.5">
                <div className="text-[10px] uppercase tracking-wide mb-2" style={{ color: theme.textMuted }}>
                    Score Breakdown
                </div>
                <ScoreBar label="Edge" value={trader.edgeScore} icon={Target} />
                <ScoreBar label="Consistency" value={trader.consistencyScore} icon={Activity} />
                <ScoreBar label="Stake" value={trader.stakeScore} icon={Award} />
                <ScoreBar label="Freshness" value={trader.freshnessScore} icon={Flame} />
            </div>
        </div>
    );
}
