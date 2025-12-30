"use client";

import { ethers } from "ethers";
import { getOstiumConfig } from "@/app/lib/ostium-config";
import { apiGet } from "@/app/lib/api";

// ABI for Ostium Trading Contract - setDelegate function
const OSTIUM_TRADING_ABI = ["function setDelegate(address delegate) external"];

// ABI for USDC Token - approve function
const USDC_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

export function useOstium(
  userWallet: string | undefined,
  ostiumAgentAddress: string,
  setDelegationComplete: (complete: boolean) => void,
  setAllowanceComplete: (complete: boolean) => void,
  setTxHash: (hash: string | null) => void,
  setError: (error: string) => void,
  setLoading: (loading: boolean) => void,
  setSigningStep: (step: "idle" | "delegation" | "allowance" | "done") => void
) {
  // Get config inside the hook (client-side)
  const getConfig = () => {
    const config = getOstiumConfig();
    return {
      OSTIUM_TRADING_CONTRACT: config.tradingContract,
      USDC_TOKEN: config.usdcContract,
      OSTIUM_STORAGE: config.storageContract,
      ARBITRUM_CHAIN_ID: config.chainId,
    };
  };

  const checkOstiumStatus = async () => {
    if (!userWallet) {
      console.log("[Ostium] Cannot check status: no wallet address");
      return;
    }

    if (!ostiumAgentAddress) {
      console.log("[Ostium] Cannot check status: no agent address yet");
      return;
    }

    try {
      console.log(
        "[Ostium] Checking delegation status for:",
        userWallet,
        "->",
        ostiumAgentAddress
      );

      // Check delegation status - matches reference implementation
      const delegationData = await apiGet(
        "/api/ostium/check-delegation-status",
        {
          userWallet,
          agentAddress: ostiumAgentAddress,
        }
      );
      console.log("[Ostium] Delegation check result:", delegationData);

      if (delegationData.isDelegatedToAgent) {
        console.log("[Ostium] ✅ Delegation is complete");
        setDelegationComplete(true);
      } else {
        console.log(
          "[Ostium] ⚠️ Delegation not found or to different address:",
          delegationData.delegatedAddress,
          "expected:",
          ostiumAgentAddress
        );
        setDelegationComplete(false);
      }

      // Check USDC allowance - matches reference implementation
      const allowanceData = await apiGet("/api/ostium/check-approval-status", {
        userWallet,
      });
      console.log("[Ostium] Allowance check result:", allowanceData);

      if (allowanceData.hasApproval) {
        console.log("[Ostium] ✅ Allowance is complete");
        setAllowanceComplete(true);
      } else {
        setAllowanceComplete(false);
      }
    } catch (err) {
      console.error("[Ostium] Error checking Ostium status:", err);
    }
  };

  /**
   * Step 1: Approve delegation - allows agent to trade on user's behalf
   * Matches the reference implementation from maxxit-latest
   */
  const approveDelegation = async (): Promise<void> => {
    if (!userWallet) {
      setError("Please connect your wallet first");
      return;
    }

    if (!ostiumAgentAddress) {
      setError("Agent address not found. Please refresh the page.");
      return;
    }

    const { OSTIUM_TRADING_CONTRACT, ARBITRUM_CHAIN_ID } = getConfig();

    setLoading(true);
    setError("");
    setSigningStep("delegation");

    try {
      const provider = (window as any).ethereum;
      if (!provider) {
        throw new Error("No wallet provider found. Please install MetaMask.");
      }

      // Request account access first - this triggers MetaMask popup if needed
      await provider.request({ method: "eth_requestAccounts" });

      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const network = await ethersProvider.getNetwork();

      // Check network (Arbitrum One = 42161)
      if (network.chainId !== ARBITRUM_CHAIN_ID) {
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${ARBITRUM_CHAIN_ID.toString(16)}` }],
          });
          // Re-create provider after network switch
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            throw new Error("Please add Arbitrum to your wallet");
          }
          throw new Error("Please switch to Arbitrum network");
        }
      }

      // Get fresh provider after potential network switch
      const freshProvider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = freshProvider.getSigner();
      const contract = new ethers.Contract(
        OSTIUM_TRADING_CONTRACT,
        OSTIUM_TRADING_ABI,
        signer
      );

      console.log("[Ostium] Setting delegate to:", ostiumAgentAddress);

      const gasEstimate = await contract.estimateGas.setDelegate(
        ostiumAgentAddress
      );
      const gasLimit = gasEstimate.mul(150).div(100);

      const tx = await contract.setDelegate(ostiumAgentAddress, { gasLimit });
      setTxHash(tx.hash);

      await tx.wait();

      setDelegationComplete(true);
      setTxHash(null);
      setSigningStep("idle");
    } catch (err: any) {
      console.error("[Ostium] Delegation error:", err);
      setSigningStep("idle");
      if (err.code === 4001) {
        setError("Transaction rejected");
      } else if (err.code === -32603) {
        setError("Transaction failed. Please check your wallet balance.");
      } else {
        setError(err.message || "Failed to approve delegation");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: Approve USDC spending - allows Ostium to use user's USDC for trades
   * Matches the reference implementation from maxxit-latest
   */
  const approveUsdc = async (): Promise<void> => {
    if (!userWallet) {
      setError("Please connect your wallet first");
      return;
    }

    const { USDC_TOKEN, OSTIUM_STORAGE } = getConfig();

    setLoading(true);
    setError("");
    setSigningStep("allowance");

    try {
      const provider = (window as any).ethereum;
      if (!provider) {
        throw new Error("No wallet provider found.");
      }

      const ethersProvider = new ethers.providers.Web3Provider(provider);
      await ethersProvider.send("eth_requestAccounts", []);

      const signer = ethersProvider.getSigner();
      const usdcContract = new ethers.Contract(USDC_TOKEN, USDC_ABI, signer);

      const allowanceAmount = ethers.utils.parseUnits("1000000", 6);

      const approveData = usdcContract.interface.encodeFunctionData("approve", [
        OSTIUM_STORAGE,
        allowanceAmount,
      ]);
      const gasEstimate = await ethersProvider.estimateGas({
        to: USDC_TOKEN,
        from: userWallet,
        data: approveData,
      });

      const gasWithBuffer = gasEstimate.mul(150).div(100);

      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: userWallet,
            to: USDC_TOKEN,
            data: approveData,
            gas: gasWithBuffer.toHexString(),
          },
        ],
      });

      setTxHash(txHash);
      await ethersProvider.waitForTransaction(txHash);

      setAllowanceComplete(true);
      setTxHash(null);
      setSigningStep("idle");
    } catch (err: any) {
      console.error("[Ostium] USDC approval error:", err);
      setSigningStep("idle");
      if (err.code === 4001 || err.message?.includes("rejected")) {
        setError("Transaction rejected");
      } else {
        setError(err.message || "Failed to approve USDC");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    checkOstiumStatus,
    approveDelegation,
    approveUsdc,
  };
}
