import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/**
 * Check if user's telegram is connected for lazy trading
 * GET /api/lazy-trading/check-telegram-status?userWallet=0x...&linkCode=LTXXXXXX
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userWallet = searchParams.get("userWallet");
    const linkCode = searchParams.get("linkCode");

    if (!userWallet) {
      return NextResponse.json({ error: "userWallet is required" }, { status: 400 });
    }

    const normalizedWallet = userWallet.toLowerCase();

    // First check if user already has a lazy trading agent with telegram linked
    const existingLazyAgent = await prisma.agents.findFirst({
      where: {
        creator_wallet: normalizedWallet,
        name: { startsWith: "Lazy Trader -" },
      },
      include: {
        agent_telegram_users: {
          include: {
            telegram_alpha_users: true,
          },
        },
      },
    });

    if (
      existingLazyAgent &&
      existingLazyAgent.agent_telegram_users.length > 0
    ) {
      const telegramUser =
        existingLazyAgent.agent_telegram_users[0].telegram_alpha_users;
      return NextResponse.json({
        success: true,
        connected: true,
        telegramUser: {
          id: telegramUser.id,
          telegram_user_id: telegramUser.telegram_user_id,
          telegram_username: telegramUser.telegram_username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
        },
        agentId: existingLazyAgent.id,
      });
    }

    // Check for lazy trader alpha users that belong to THIS specific wallet
    console.log(
      "[CheckTelegramStatus] Looking for lazy trader with wallet:",
      normalizedWallet
    );

    const lazyTraderForWallet = await prisma.telegram_alpha_users.findFirst({
      where: {
        lazy_trader: true,
        user_wallet: normalizedWallet,
        agent_telegram_users: {
          none: {},
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (lazyTraderForWallet) {
      console.log(
        "[CheckTelegramStatus] ✅ Found lazy trader:",
        lazyTraderForWallet.id,
        "telegram_user_id:",
        lazyTraderForWallet.telegram_user_id,
        "wallet:",
        lazyTraderForWallet.user_wallet
      );
      return NextResponse.json({
        success: true,
        connected: true,
        telegramUser: {
          id: lazyTraderForWallet.id,
          telegram_user_id: lazyTraderForWallet.telegram_user_id,
          telegram_username: lazyTraderForWallet.telegram_username,
          first_name: lazyTraderForWallet.first_name,
          last_name: lazyTraderForWallet.last_name,
        },
        agentId: null,
      });
    } else {
      console.log(
        "[CheckTelegramStatus] ❌ No lazy trader found for wallet:",
        normalizedWallet
      );
    }

    return NextResponse.json({
      success: true,
      connected: false,
      telegramUser: null,
      agentId: null,
    });
  } catch (error: any) {
    console.error("[API] Check lazy trading telegram status error:", error);
    return NextResponse.json(
      {
        error: "Failed to check status",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

