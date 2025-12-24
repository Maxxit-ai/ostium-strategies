/**
 * Check Ostium Delegation Status
 * 
 * Checks if user has delegated their trading permissions to their Ostium agent address
 */

import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { getOstiumConfig } from "@/app/lib/ostium-config";

const { tradingContract, rpcUrl } = getOstiumConfig();

const TRADING_ABI = [
  "function delegations(address delegator) view returns (address)",
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userWallet = searchParams.get("userWallet");
    const agentAddress = searchParams.get("agentAddress");

    if (!userWallet) {
      return NextResponse.json({ error: "User wallet required" }, { status: 400 });
    }

    const checksummedUserAddress = ethers.utils.getAddress(userWallet);
    
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const tradingContractInstance = new ethers.Contract(tradingContract, TRADING_ABI, provider);

    const delegatedAddress = await tradingContractInstance.delegations(checksummedUserAddress);
    
    let isDelegatedToAgent = false;
    if (agentAddress && typeof agentAddress === "string") {
      const checksummedAgentAddress = ethers.utils.getAddress(agentAddress);
      isDelegatedToAgent = delegatedAddress.toLowerCase() === checksummedAgentAddress.toLowerCase();
    }

    // Check if there's any delegation at all
    const hasDelegation = delegatedAddress !== ethers.constants.AddressZero;

    return NextResponse.json({
      success: true,
      userWallet: checksummedUserAddress,
      hasDelegation,
      delegatedAddress,
      isDelegatedToAgent,
      agentAddress: agentAddress || null,
    });
  } catch (error: any) {
    console.error("[CheckDelegationStatus] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to check delegation status",
      },
      { status: 500 }
    );
  }
}

