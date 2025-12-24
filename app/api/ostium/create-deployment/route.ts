/**
 * Create or update deployment for Ostium agent
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

interface TradingPreferences {
  risk_tolerance: number;
  trade_frequency: number;
  social_sentiment_weight: number;
  price_momentum_focus: number;
  market_rank_priority: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, userWallet, tradingPreferences } = body as {
      agentId: string;
      userWallet: string;
      tradingPreferences?: TradingPreferences;
    };

    if (!agentId || !userWallet) {
      return NextResponse.json(
        { error: "Missing required fields: agentId, userWallet" },
        { status: 400 }
      );
    }

    console.log("[Ostium Create Deployment] Creating deployment:", {
      agentId,
      userWallet,
      hasPreferences: !!tradingPreferences,
    });

    // Get agent to check venue
    const agent = await prisma.agents.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Verify user has an agent address
    const userAddress = await prisma.user_agent_addresses.findUnique({
      where: { user_wallet: userWallet.toLowerCase() },
      select: {
        ostium_agent_address: true,
      },
    });

    if (!userAddress || !userAddress.ostium_agent_address) {
      return NextResponse.json(
        { error: "User agent address not found. Please generate address first." },
        { status: 400 }
      );
    }

    const normalizedWallet = userWallet.toLowerCase();

    // Check if deployment already exists
    const existingDeployment = await prisma.agent_deployments.findFirst({
      where: {
        agent_id: agentId,
        user_wallet: normalizedWallet,
      },
    });

    if (existingDeployment) {
      const currentVenues = existingDeployment.enabled_venues || [];
      const needsVenueUpdate = !currentVenues.includes("OSTIUM");

      const updatedDeployment = await prisma.agent_deployments.update({
        where: { id: existingDeployment.id },
        data: {
          status: "ACTIVE",
          sub_active: true,
          module_enabled: true,
          ...(needsVenueUpdate && { enabled_venues: [...currentVenues, "OSTIUM"] }),
          ...(tradingPreferences && {
            risk_tolerance: tradingPreferences.risk_tolerance,
            trade_frequency: tradingPreferences.trade_frequency,
            social_sentiment_weight: tradingPreferences.social_sentiment_weight,
            price_momentum_focus: tradingPreferences.price_momentum_focus,
            market_rank_priority: tradingPreferences.market_rank_priority,
          }),
        },
      });

      console.log(
        "[Ostium Create Deployment] Updated existing deployment:",
        updatedDeployment.id
      );

      return NextResponse.json({
        success: true,
        deployment: {
          id: updatedDeployment.id,
          agentId: updatedDeployment.agent_id,
          userWallet: updatedDeployment.user_wallet,
          agentAddress: userAddress.ostium_agent_address,
          status: updatedDeployment.status,
        },
        message: "Deployment updated",
      });
    }

    // Create new deployment
    let deployment;
    try {
      console.log("[Ostium Create Deployment] Creating new deployment");

      deployment = await prisma.agent_deployments.create({
        data: {
          agent_id: agentId,
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
    } catch (error: any) {
      // Handle race condition
      if (error.code === "P2002") {
        console.log("[Ostium Create Deployment] Race condition detected");
        const racedDeployment = await prisma.agent_deployments.findFirst({
          where: {
            agent_id: agentId,
            user_wallet: normalizedWallet,
          },
        });

        if (racedDeployment) {
          return NextResponse.json({
            success: true,
            deployment: {
              id: racedDeployment.id,
              agentId: racedDeployment.agent_id,
              userWallet: racedDeployment.user_wallet,
              agentAddress: userAddress.ostium_agent_address,
              status: racedDeployment.status,
            },
            message: "Deployment created (concurrent)",
          });
        }
      }
      throw error;
    }

    console.log("[Ostium Create Deployment] ✅ Deployment created:", deployment.id);

    return NextResponse.json({
      success: true,
      deployment: {
        id: deployment.id,
        agentId: deployment.agent_id,
        userWallet: deployment.user_wallet,
        agentAddress: userAddress.ostium_agent_address,
        status: deployment.status,
      },
      message: existingDeployment ? "Deployment updated" : "Deployment created",
    });
  } catch (error: any) {
    console.error("[Ostium Create Deployment API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create deployment" },
      { status: 500 }
    );
  }
}

