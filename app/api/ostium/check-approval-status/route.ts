/**
 * Check Ostium On-Chain Approval Status
 * 
 * Checks if user has actually approved USDC spending on-chain
 */

import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { getOstiumConfig } from "@/app/lib/ostium-config";

const { usdcContract, tradingContract, storageContract, rpcUrl } = getOstiumConfig();

const USDC_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userWallet = searchParams.get("userWallet");

    if (!userWallet) {
      return NextResponse.json({ error: "User wallet required" }, { status: 400 });
    }

    const checksummedAddress = ethers.utils.getAddress(userWallet);

    // Connect to the appropriate network
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const usdcContractInstance = new ethers.Contract(usdcContract, USDC_ABI, provider);

    // Check USDC allowance - SDK checks STORAGE_CONTRACT
    const allowanceStorage = await usdcContractInstance.allowance(checksummedAddress, storageContract);
    const allowanceTrading = await usdcContractInstance.allowance(checksummedAddress, tradingContract);
    const allowanceUsdc = parseFloat(ethers.utils.formatUnits(allowanceStorage, 6));

    // Check USDC balance
    const balance = await usdcContractInstance.balanceOf(checksummedAddress);
    const balanceUsdc = parseFloat(ethers.utils.formatUnits(balance, 6));

    // Minimum trade size on Ostium is $5
    const hasApproval = allowanceUsdc >= 5;
    const hasSufficientBalance = balanceUsdc >= 5;

    return NextResponse.json({
      success: true,
      userWallet: checksummedAddress,
      usdcBalance: balanceUsdc,
      usdcAllowance: allowanceUsdc,
      usdcAllowanceStorage: parseFloat(ethers.utils.formatUnits(allowanceStorage, 6)),
      usdcAllowanceTrading: parseFloat(ethers.utils.formatUnits(allowanceTrading, 6)),
      hasApproval,
      hasSufficientBalance,
      needsApproval: !hasApproval,
      storageContract: storageContract,
      tradingContract: tradingContract,
    });
  } catch (error: any) {
    console.error("[CheckApprovalStatus] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to check approval status",
      },
      { status: 500 }
    );
  }
}

