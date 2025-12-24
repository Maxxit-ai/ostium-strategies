import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getOrCreateOstiumAgentAddress } from "@/app/lib/deployment-agent-address";

interface TradingPreferences {
  risk_tolerance: number;
  trade_frequency: number;
  social_sentiment_weight: number;
  price_momentum_focus: number;
  market_rank_priority: number;
}

/**
 * Create a lazy trading agent using the standard agent/deployment flow
 * POST /api/lazy-trading/create-agent
 * Body: {
 *   userWallet: string,
 *   telegramAlphaUserId: string,
 *   tradingPreferences?: TradingPreferences
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userWallet, telegramAlphaUserId, tradingPreferences } = body;

    if (!userWallet || typeof userWallet !== "string") {
      return NextResponse.json({ error: "userWallet is required" }, { status: 400 });
    }

    if (!telegramAlphaUserId || typeof telegramAlphaUserId !== "string") {
      return NextResponse.json({ error: "telegramAlphaUserId is required" }, { status: 400 });
    }

    const normalizedWallet = userWallet.toLowerCase();

    // Get the telegram alpha user info
    const telegramUser = await prisma.telegram_alpha_users.findUnique({
      where: { id: telegramAlphaUserId },
    });

    if (!telegramUser) {
      return NextResponse.json({ error: "Telegram user not found" }, { status: 404 });
    }

    // Check if user already has a lazy trading agent
    const existingAgent = await prisma.agents.findFirst({
      where: {
        creator_wallet: normalizedWallet,
        name: { startsWith: "Lazy Trader -" },
      },
      include: {
        agent_deployments: {
          where: { status: "ACTIVE" },
        },
      },
    });

    if (existingAgent) {
      // Check if telegram is already linked
      const existingLink = await prisma.agent_telegram_users.findFirst({
        where: {
          agent_id: existingAgent.id,
          telegram_alpha_user_id: telegramAlphaUserId,
        },
      });

      if (!existingLink) {
        await prisma.agent_telegram_users.create({
          data: {
            agent_id: existingAgent.id,
            telegram_alpha_user_id: telegramAlphaUserId,
          },
        });
      }

      await prisma.telegram_alpha_users.update({
        where: { id: telegramAlphaUserId },
        data: {
          lazy_trader: true,
          user_wallet: normalizedWallet,
        },
      });

      // Get or create Ostium agent address
      const ostiumResult = await getOrCreateOstiumAgentAddress({ userWallet: normalizedWallet });

      return NextResponse.json({
        success: true,
        alreadyExists: true,
        agent: {
          id: existingAgent.id,
          name: existingAgent.name,
          venue: existingAgent.venue,
          status: existingAgent.status,
        },
        deployment: existingAgent.agent_deployments[0] || null,
        ostiumAgentAddress: ostiumResult.address,
        needsDeployment: existingAgent.agent_deployments.length === 0,
      });
    }

    // Generate agent name with telegram username and timestamp
    const timestamp = new Date();
    const formattedTimestamp = `${String(timestamp.getDate()).padStart(
      2,
      "0"
    )}${String(timestamp.getMonth() + 1).padStart(2, "0")}${String(
      timestamp.getFullYear()
    ).slice(2)}${String(timestamp.getHours()).padStart(2, "0")}${String(
      timestamp.getMinutes()
    ).padStart(2, "0")}${String(timestamp.getSeconds()).padStart(2, "0")}`;

    const displayName = telegramUser.telegram_username
      ? `@${telegramUser.telegram_username}`
      : telegramUser.first_name || "User";

    const agentName = `Lazy Trader - ${displayName} - ${formattedTimestamp}`;

    // Create the agent
    const agent = await prisma.agents.create({
      data: {
        creator_wallet: normalizedWallet,
        profit_receiver_address: normalizedWallet,
        name: agentName,
        venue: "OSTIUM",
        weights: [50, 50, 50, 50, 50, 50, 50, 50],
        status: "PRIVATE",
        proof_of_intent_message: null,
        proof_of_intent_signature: null,
        proof_of_intent_timestamp: null,
      },
    });

    // Link the telegram alpha user to this agent
    await prisma.agent_telegram_users.create({
      data: {
        agent_id: agent.id,
        telegram_alpha_user_id: telegramAlphaUserId,
      },
    });

    // Mark the telegram user as lazy trader
    await prisma.telegram_alpha_users.update({
      where: { id: telegramAlphaUserId },
      data: {
        lazy_trader: true,
        user_wallet: normalizedWallet,
      },
    });

    console.log(
      `[LazyTrading] Created agent ${agent.id} for wallet ${normalizedWallet}`
    );

    // Get or create Ostium agent address
    const ostiumResult = await getOrCreateOstiumAgentAddress({ userWallet: normalizedWallet });

    // Create deployment
    const deployment = await prisma.agent_deployments.create({
      data: {
        agent_id: agent.id,
        user_wallet: normalizedWallet,
        safe_wallet: normalizedWallet,
        enabled_venues: ["OSTIUM"],
        status: "ACTIVE",
        sub_active: true,
        module_enabled: true,
        ...(tradingPreferences && {
          risk_tolerance: tradingPreferences.risk_tolerance,
          trade_frequency: tradingPreferences.trade_frequency,
          social_sentiment_weight: tradingPreferences.social_sentiment_weight,
          price_momentum_focus: tradingPreferences.price_momentum_focus,
          market_rank_priority: tradingPreferences.market_rank_priority,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      alreadyExists: false,
      agent: {
        id: agent.id,
        name: agent.name,
        venue: agent.venue,
        status: agent.status,
      },
      deployment: {
        id: deployment.id,
        status: deployment.status,
      },
      ostiumAgentAddress: ostiumResult.address,
      needsDeployment: false,
    });
  } catch (error: any) {
    console.error("[API] Create lazy trading agent error:", error);
    return NextResponse.json(
      {
        error: "Failed to create agent",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

