"use client";

import { TraderCard, Trader } from "./TraderCard";
import { theme, fonts } from "../ostium/theme";
import { Users, AlertCircle, Loader2 } from "lucide-react";

interface TraderListProps {
    traders: Trader[];
    isLoading: boolean;
    error: string | null;
}

function TraderSkeleton() {
    return (
        <div
            className="p-5 rounded-2xl animate-pulse"
            style={{ background: theme.surface, border: `1px solid ${theme.stroke}` }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl" style={{ background: theme.surfaceAlt }} />
                    <div>
                        <div className="h-4 w-24 rounded mb-2" style={{ background: theme.surfaceAlt }} />
                        <div className="h-3 w-16 rounded" style={{ background: theme.surfaceAlt }} />
                    </div>
                </div>
                <div className="w-16 h-14 rounded-lg" style={{ background: theme.surfaceAlt }} />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-xl" style={{ background: theme.surfaceAlt }} />
                ))}
            </div>
            <div className="h-8 rounded-lg mb-4" style={{ background: theme.surfaceAlt }} />
            <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 rounded" style={{ background: theme.surfaceAlt }} />
                ))}
            </div>
        </div>
    );
}

export function TraderList({ traders, isLoading, error }: TraderListProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <TraderSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl"
                style={{ background: theme.surface, border: `1px solid ${theme.stroke}` }}
            >
                <AlertCircle className="w-12 h-12 mb-4" style={{ color: "#EF4444" }} />
                <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: theme.text, fontFamily: fonts.heading }}
                >
                    Failed to Load Traders
                </h3>
                <p className="text-sm text-center max-w-md" style={{ color: theme.textMuted }}>
                    {error}
                </p>
            </div>
        );
    }

    if (traders.length === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl"
                style={{ background: theme.surface, border: `1px solid ${theme.stroke}` }}
            >
                <Users className="w-12 h-12 mb-4" style={{ color: theme.textMuted }} />
                <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: theme.text, fontFamily: fonts.heading }}
                >
                    No Traders Found
                </h3>
                <p className="text-sm text-center max-w-md" style={{ color: theme.textMuted }}>
                    There are no top traders to display at this time.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {traders.map((trader) => (
                <TraderCard key={trader.id} trader={trader} />
            ))}
        </div>
    );
}
