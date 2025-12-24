"use client";

import { ethers } from "ethers";
import { getOstiumConfig } from "@/app/lib/ostium-config";

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
      console.log("[Ostium] Checking status for wallet:", userWallet, "agent:", ostiumAgentAddress);

      // Check delegation status
      const delegationResponse = await fetch(
        `/api/ostium/check-delegation-status?userWallet=${userWallet}&agentAddress=${ostiumAgentAddress}`
      );

      if (delegationResponse.ok) {
        const delegationData = await delegationResponse.json();
        console.log("[Ostium] Delegation status:", delegationData);
        setDelegationComplete(delegationData.isDelegatedToAgent === true);
      }

      // Check USDC allowance
      const allowanceResponse = await fetch(
        `/api/ostium/check-approval-status?userWallet=${userWallet}`
      );

      if (allowanceResponse.ok) {
        const allowanceData = await allowanceResponse.json();
        console.log("[Ostium] Allowance status:", allowanceData);
        setAllowanceComplete(allowanceData.hasApproval === true);
      }
    } catch (err) {
      console.error("[Ostium] Error checking Ostium status:", err);
    }
  };

  /**
   * Step 1: Approve delegation - allows agent to trade on user's behalf
   * Matches the reference implementation from maxxit-latest
   */
  const approveDelegation = async (): Promise<boolean> => {
    if (!userWallet) {
      setError("Please connect your wallet first");
      return false;
    }

    if (!ostiumAgentAddress) {
      setError("Agent address not found. Please refresh the page.");
      return false;
    }

    const { OSTIUM_TRADING_CONTRACT, ARBITRUM_CHAIN_ID } = getConfig();

    try {
      const provider = (window as any).ethereum;
      if (!provider) {
        throw new Error("No wallet provider found. Please install MetaMask.");
      }

      // Request account access first - this triggers MetaMask popup if needed
      await provider.request({ method: "eth_requestAccounts" });

      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const network = await ethersProvider.getNetwork();

      console.log("[Ostium] Current network:", network.chainId, "Required:", ARBITRUM_CHAIN_ID);

      // Check network and switch if needed
      if (network.chainId !== ARBITRUM_CHAIN_ID) {
        console.log("[Ostium] Switching to Arbitrum network...");
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
      const freshProvider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = freshProvider.getSigner();
      const contract = new ethers.Contract(
        OSTIUM_TRADING_CONTRACT,
        OSTIUM_TRADING_ABI,
        signer
      );

      console.log("[Ostium] Setting delegate to:", ostiumAgentAddress);
      console.log("[Ostium] Trading Contract:", OSTIUM_TRADING_CONTRACT);

      const gasEstimate = await contract.estimateGas.setDelegate(ostiumAgentAddress);
      const gasLimit = gasEstimate.mul(150).div(100);

      console.log("[Ostium] Gas estimate:", gasEstimate.toString(), "with buffer:", gasLimit.toString());

      const tx = await contract.setDelegate(ostiumAgentAddress, { gasLimit });
      console.log("[Ostium] Delegation tx hash:", tx.hash);
      setTxHash(tx.hash);

      await tx.wait();

      console.log("[Ostium] ✅ Delegation complete!");
      setDelegationComplete(true);
      setTxHash(null);
      return true;
    } catch (err: any) {
      console.error("[Ostium] Delegation error:", err);
      if (err.code === 4001) {
        setError("Transaction rejected");
      } else if (err.code === -32603) {
        setError("Transaction failed. Please check your wallet balance.");
      } else {
        setError(err.message || "Failed to approve delegation");
      }
      return false;
    }
  };

  /**
   * Step 2: Approve USDC spending - allows Ostium to use user's USDC for trades
   * Uses the same pattern as maxxit-latest reference implementation
   */
  const approveUsdc = async (): Promise<boolean> => {
    if (!userWallet) {
      setError("Please connect your wallet first");
      return false;
    }

    const { USDC_TOKEN, OSTIUM_STORAGE } = getConfig();

    try {
      const provider = (window as any).ethereum;
      if (!provider) {
        throw new Error("No wallet provider found. Please install MetaMask.");
      }

      const ethersProvider = new ethers.providers.Web3Provider(provider);
      await ethersProvider.send("eth_requestAccounts", []);

      const signer = ethersProvider.getSigner();
      const usdcContract = new ethers.Contract(USDC_TOKEN, USDC_ABI, signer);

      // Max approval amount (1 million USDC with 6 decimals)
      const allowanceAmount = ethers.utils.parseUnits("1000000", 6);

      console.log("[Ostium] Creating USDC approval...");
      console.log("[Ostium] USDC Contract:", USDC_TOKEN);
      console.log("[Ostium] Spender (Storage):", OSTIUM_STORAGE);
      console.log("[Ostium] Amount:", allowanceAmount.toString());

      // Encode the approve function data (matching reference implementation)
      const approveData = usdcContract.interface.encodeFunctionData("approve", [
        OSTIUM_STORAGE,
        allowanceAmount,
      ]);

      // Estimate gas
      const gasEstimate = await ethersProvider.estimateGas({
        to: USDC_TOKEN,
        from: userWallet,
        data: approveData,
      });

      const gasWithBuffer = gasEstimate.mul(150).div(100);

      console.log("[Ostium] Gas estimate:", gasEstimate.toString(), "with buffer:", gasWithBuffer.toString());

      // Send transaction using eth_sendTransaction (matching reference)
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

      console.log("[Ostium] USDC approval tx hash:", txHash);
      setTxHash(txHash);

      // Wait for transaction confirmation
      await ethersProvider.waitForTransaction(txHash);

      console.log("[Ostium] ✅ USDC approval complete!");
      setAllowanceComplete(true);
      setTxHash(null);
      return true;
    } catch (err: any) {
      console.error("[Ostium] USDC approval error:", err);
      if (err.code === 4001 || err.message?.includes("rejected")) {
        setError("Transaction rejected");
      } else {
        setError(err.message || "Failed to approve USDC");
      }
      return false;
    }
  };

  /**
   * Enable 1-click trading - performs both delegation and allowance in sequence
   * One button triggers both signatures sequentially
   */
  const enable1ClickTrading = async () => {
    if (!userWallet) {
      setError("Please connect your wallet first");
      return;
    }

    if (!ostiumAgentAddress) {
      setError("Agent address not found. Please refresh the page.");
      return;
    }

    const config = getConfig();
    
    setLoading(true);
    setError("");
    setSigningStep("idle");

    try {
      console.log("[Ostium] Starting 1-click trading setup...");
      console.log("[Ostium] Config:", config);
      console.log("[Ostium] Agent Address:", ostiumAgentAddress);

      // Step 1: Check and perform delegation if needed
      console.log("[Ostium] Step 1: Checking delegation status...");
      const delegationResponse = await fetch(
        `/api/ostium/check-delegation-status?userWallet=${userWallet}&agentAddress=${ostiumAgentAddress}`
      );
      const delegationData = await delegationResponse.json();
      console.log("[Ostium] Delegation check result:", delegationData);

      if (!delegationData.isDelegatedToAgent) {
        console.log("[Ostium] Delegation not set, requesting signature...");
        setSigningStep("delegation");
        
        const delegationSuccess = await approveDelegation();
        if (!delegationSuccess) {
          console.log("[Ostium] Delegation failed or rejected");
          setSigningStep("idle");
          setLoading(false);
          return;
        }
        console.log("[Ostium] Delegation successful!");
      } else {
        console.log("[Ostium] Delegation already complete, skipping...");
        setDelegationComplete(true);
      }

      // Step 2: Check and perform USDC approval if needed
      console.log("[Ostium] Step 2: Checking USDC allowance status...");
      const allowanceResponse = await fetch(
        `/api/ostium/check-approval-status?userWallet=${userWallet}`
      );
      const allowanceData = await allowanceResponse.json();
      console.log("[Ostium] Allowance check result:", allowanceData);

      if (!allowanceData.hasApproval) {
        console.log("[Ostium] Allowance not set, requesting signature...");
        setSigningStep("allowance");
        
        const allowanceSuccess = await approveUsdc();
        if (!allowanceSuccess) {
          console.log("[Ostium] Allowance approval failed or rejected");
          setSigningStep("idle");
          setLoading(false);
          return;
        }
        console.log("[Ostium] USDC approval successful!");
      } else {
        console.log("[Ostium] Allowance already set, skipping...");
        setAllowanceComplete(true);
      }

      console.log("[Ostium] ✅ 1-click trading setup complete!");
      setSigningStep("done");
    } catch (err: any) {
      console.error("[Ostium] Enable 1-click trading error:", err);
      setError(err.message || "Failed to enable 1-click trading");
      setSigningStep("idle");
    } finally {
      setLoading(false);
    }
  };

  return {
    checkOstiumStatus,
    approveDelegation,
    approveUsdc,
    enable1ClickTrading,
  };
}
