import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
    try {
        const traders = await prisma.top_traders.findMany({
            orderBy: {
                impact_factor: 'desc',
            },
            take: 1000, // Fetch top 1000 traders
        });

        // Format the data for frontend consumption
        const formattedTraders = traders.map((trader, index) => ({
            id: trader.id,
            rank: index + 1,
            walletAddress: trader.wallet_address,
            totalVolume: trader.total_volume.toString(),
            totalClosedVolume: trader.total_closed_volume.toString(),
            totalPnl: trader.total_pnl.toString(),
            totalProfitTrades: trader.total_profit_trades,
            totalLossTrades: trader.total_loss_trades,
            totalTrades: trader.total_trades,
            lastActiveAt: trader.last_active_at.toISOString(),
            edgeScore: trader.edge_score,
            consistencyScore: trader.consistency_score,
            stakeScore: trader.stake_score,
            freshnessScore: trader.freshness_score,
            impactFactor: trader.impact_factor,
        }));

        return NextResponse.json({ traders: formattedTraders });
    } catch (error) {
        console.error('Error fetching top traders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch top traders' },
            { status: 500 }
        );
    }
}
