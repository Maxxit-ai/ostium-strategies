/**
 * User Trading Preferences API
 * GET: Fetch user's trading preferences
 * POST: Save user's trading preferences
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    const normalizedWallet = wallet.toLowerCase();

    const preferences = await prisma.user_trading_preferences.findUnique({
      where: { user_wallet: normalizedWallet },
    });

    if (!preferences) {
      return NextResponse.json({
        success: true,
        preferences: null,
      });
    }

    return NextResponse.json({
      success: true,
      preferences: {
        risk_tolerance: preferences.risk_tolerance,
        trade_frequency: preferences.trade_frequency,
        social_sentiment_weight: preferences.social_sentiment_weight,
        price_momentum_focus: preferences.price_momentum_focus,
        market_rank_priority: preferences.market_rank_priority,
      },
    });
  } catch (error: any) {
    console.error("[TradingPreferences GET] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get preferences" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userWallet, preferences } = body;

    if (!userWallet) {
      return NextResponse.json({ error: "userWallet is required" }, { status: 400 });
    }

    if (!preferences) {
      return NextResponse.json({ error: "preferences is required" }, { status: 400 });
    }

    const normalizedWallet = userWallet.toLowerCase();

    const savedPreferences = await prisma.user_trading_preferences.upsert({
      where: { user_wallet: normalizedWallet },
      create: {
        user_wallet: normalizedWallet,
        risk_tolerance: preferences.risk_tolerance ?? 50,
        trade_frequency: preferences.trade_frequency ?? 50,
        social_sentiment_weight: preferences.social_sentiment_weight ?? 50,
        price_momentum_focus: preferences.price_momentum_focus ?? 50,
        market_rank_priority: preferences.market_rank_priority ?? 50,
      },
      update: {
        risk_tolerance: preferences.risk_tolerance ?? 50,
        trade_frequency: preferences.trade_frequency ?? 50,
        social_sentiment_weight: preferences.social_sentiment_weight ?? 50,
        price_momentum_focus: preferences.price_momentum_focus ?? 50,
        market_rank_priority: preferences.market_rank_priority ?? 50,
      },
    });

    return NextResponse.json({
      success: true,
      preferences: {
        risk_tolerance: savedPreferences.risk_tolerance,
        trade_frequency: savedPreferences.trade_frequency,
        social_sentiment_weight: savedPreferences.social_sentiment_weight,
        price_momentum_focus: savedPreferences.price_momentum_focus,
        market_rank_priority: savedPreferences.market_rank_priority,
      },
    });
  } catch (error: any) {
    console.error("[TradingPreferences POST] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save preferences" },
      { status: 500 }
    );
  }
}

