/**
 * Generate Ostium agent address for a user
 */

import { NextRequest, NextResponse } from "next/server";
import { getOrCreateOstiumAgentAddress } from "@/app/lib/deployment-agent-address";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userWallet } = body;

    if (!userWallet) {
      return NextResponse.json({ error: "userWallet is required" }, { status: 400 });
    }

    // Get or create Ostium agent address
    const result = await getOrCreateOstiumAgentAddress({ userWallet });

    console.log("[Ostium Generate Agent] Created/Retrieved agent wallet:", result.address);

    return NextResponse.json({
      success: true,
      agentAddress: result.address,
    });
  } catch (error: any) {
    console.error("[Ostium Generate Agent API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate agent wallet" },
      { status: 500 }
    );
  }
}

