import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/**
 * Get the current lazy trading setup status for a user
 * Used to restore state when user refreshes the page
 * GET /api/lazy-trading/get-setup-status?userWallet=0x...
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userWallet = searchParams.get("userWallet");

    if (!userWallet) {
      return NextResponse.json({ error: "userWallet is required" }, { status: 400 });
    }

    const normalizedWallet = userWallet.toLowerCase();

    // Check user_agent_addresses first
    const userAgentAddress = await prisma.user_agent_addresses.findUnique({
      where: { user_wallet: normalizedWallet },
      select: {
        ostium_agent_address: true,
        hyperliquid_agent_address: true,
      },
    });

    const hasExistingOstiumAddress = !!userAgentAddress?.ostium_agent_address;

    // Check on-chain delegation and approval status if address exists
    let isDelegatedToAgent = false;
    let hasUsdcApproval = false;

    if (hasExistingOstiumAddress && userAgentAddress?.ostium_agent_address) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("host") || "";
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

      try {
        const delegationResponse = await fetch(
          `${protocol}://${baseUrl}/api/ostium/check-delegation-status?userWallet=${normalizedWallet}&agentAddress=${userAgentAddress.ostium_agent_address}`
        );
        if (delegationResponse.ok) {
          const delegationData = await delegationResponse.json();
          isDelegatedToAgent = delegationData.isDelegatedToAgent === true;
        }
      } catch (err) {
        console.warn("[LazyTrading] Could not check delegation status:", err);
      }

      try {
        const approvalResponse = await fetch(
          `${protocol}://${baseUrl}/api/ostium/check-approval-status?userWallet=${normalizedWallet}`
        );
        if (approvalResponse.ok) {
          const approvalData = await approvalResponse.json();
          hasUsdcApproval = approvalData.hasApproval === true;
        }
      } catch (err) {
        console.warn("[LazyTrading] Could not check approval status:", err);
      }
    }

    // Find existing lazy trading agent for this wallet
    const existingAgent = await prisma.agents.findFirst({
      where: {
        creator_wallet: normalizedWallet,
        name: { startsWith: "Lazy Trader -" },
      },
      select: {
        id: true,
        name: true,
        venue: true,
        status: true,
        agent_telegram_users: {
          select: {
            telegram_alpha_users: {
              select: {
                id: true,
                telegram_user_id: true,
                telegram_username: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    // Get telegram user if linked via agent
    let telegramUser =
      existingAgent && existingAgent.agent_telegram_users.length > 0
        ? existingAgent.agent_telegram_users[0].telegram_alpha_users
        : null;

    // If no agent exists, check for lazy trader telegram user directly
    if (!existingAgent) {
      const lazyTraderForWallet = await prisma.telegram_alpha_users.findFirst({
        where: {
          lazy_trader: true,
          user_wallet: normalizedWallet,
          agent_telegram_users: {
            none: {},
          },
        },
        select: {
          id: true,
          telegram_user_id: true,
          telegram_username: true,
          first_name: true,
          last_name: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      if (lazyTraderForWallet) {
        telegramUser = lazyTraderForWallet;
        return NextResponse.json({
          success: true,
          hasSetup: true,
          step: "preferences",
          agent: null,
          telegramUser: {
            id: telegramUser.id,
            telegram_user_id: telegramUser.telegram_user_id,
            telegram_username: telegramUser.telegram_username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
          },
          deployment: null,
          tradingPreferences: null,
          ostiumAgentAddress: userAgentAddress?.ostium_agent_address || null,
          hyperliquidAgentAddress: userAgentAddress?.hyperliquid_agent_address || null,
          hasExistingOstiumAddress,
          isDelegatedToAgent,
          hasUsdcApproval,
        });
      } else {
        return NextResponse.json({
          success: true,
          hasSetup: false,
          step: "wallet",
          hasExistingOstiumAddress,
          isDelegatedToAgent,
          hasUsdcApproval,
          ostiumAgentAddress: userAgentAddress?.ostium_agent_address || null,
          hyperliquidAgentAddress: userAgentAddress?.hyperliquid_agent_address || null,
        });
      }
    }

    // Get deployment and trading preferences
    const deployment = await prisma.agent_deployments.findFirst({
      where: {
        agent_id: existingAgent.id,
        user_wallet: normalizedWallet,
      },
      select: {
        id: true,
        status: true,
        enabled_venues: true,
        risk_tolerance: true,
        trade_frequency: true,
        social_sentiment_weight: true,
        price_momentum_focus: true,
        market_rank_priority: true,
      },
      orderBy: {
        sub_started_at: "desc",
      },
    });

    // Determine which step the user should be on
    let currentStep: string;

    if (!telegramUser) {
      currentStep = "telegram";
    } else if (!deployment) {
      currentStep = "preferences";
    } else if (isDelegatedToAgent && hasUsdcApproval) {
      currentStep = "complete";
    } else {
      currentStep = "ostium";
    }

    // Build trading preferences from deployment if exists
    const tradingPreferences = deployment
      ? {
          risk_tolerance: deployment.risk_tolerance,
          trade_frequency: deployment.trade_frequency,
          social_sentiment_weight: deployment.social_sentiment_weight,
          price_momentum_focus: deployment.price_momentum_focus,
          market_rank_priority: deployment.market_rank_priority,
        }
      : null;

    return NextResponse.json({
      success: true,
      hasSetup: true,
      step: currentStep,
      agent: {
        id: existingAgent.id,
        name: existingAgent.name,
        venue: existingAgent.venue,
        status: existingAgent.status,
      },
      telegramUser: telegramUser
        ? {
            id: telegramUser.id,
            telegram_user_id: telegramUser.telegram_user_id,
            telegram_username: telegramUser.telegram_username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
          }
        : null,
      deployment: deployment
        ? {
            id: deployment.id,
            status: deployment.status,
            enabled_venues: deployment.enabled_venues,
          }
        : null,
      tradingPreferences,
      ostiumAgentAddress: userAgentAddress?.ostium_agent_address || null,
      hyperliquidAgentAddress: userAgentAddress?.hyperliquid_agent_address || null,
      hasExistingOstiumAddress,
      isDelegatedToAgent,
      hasUsdcApproval,
    });
  } catch (error: any) {
    console.error("[API] Get lazy trading setup status error:", error);
    return NextResponse.json(
      {
        error: "Failed to get setup status",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

