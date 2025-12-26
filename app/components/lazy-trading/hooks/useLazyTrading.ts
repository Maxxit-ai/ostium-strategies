import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { TradingPreferences } from "../TradingPreferencesModal";
import { apiGet } from "@/app/lib/api";

// Updated step order: wallet → ostium → preferences → telegram → complete
export type Step =
  | "wallet"
  | "ostium"
  | "preferences"
  | "telegram"
  | "complete";

export interface TelegramUser {
  id: string;
  telegram_user_id: string;
  telegram_username: string | null;
  first_name: string | null;
  last_name: string | null;
}

export function useLazyTrading() {
  const { authenticated, user } = usePrivy();

  const [step, setStep] = useState<Step>("wallet");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Telegram state
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [linkCode, setLinkCode] = useState<string>("");
  const [botUsername, setBotUsername] = useState<string>("");
  const [deepLink, setDeepLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [checkingTelegram, setCheckingTelegram] = useState(false);

  // Trading preferences
  const [tradingPreferences, setTradingPreferences] =
    useState<TradingPreferences | null>(null);

  // Ostium state
  const [ostiumAgentAddress, setOstiumAgentAddress] = useState<string>("");
  const [hyperliquidAgentAddress, setHyperliquidAgentAddress] =
    useState<string>("");
  const [delegationComplete, setDelegationComplete] = useState(false);
  const [allowanceComplete, setAllowanceComplete] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [signingStep, setSigningStep] = useState<
    "idle" | "delegation" | "allowance" | "done"
  >("idle");

  // ETH sending state
  const [ethAmount, setEthAmount] = useState<string>("0.005");
  const [sendingEth, setSendingEth] = useState(false);
  const [ethTxHash, setEthTxHash] = useState<string | null>(null);
  const [ethError, setEthError] = useState<string | null>(null);

  // Agent state
  const [agentId, setAgentId] = useState<string>("");
  const [deploymentId, setDeploymentId] = useState<string>("");
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Load existing setup status when wallet is connected
  useEffect(() => {
    if (authenticated && user?.wallet?.address && !initialLoadDone) {
      loadExistingSetup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, user?.wallet?.address, initialLoadDone]);

  const loadExistingSetup = async () => {
    if (!user?.wallet?.address) return;

    try {
      const data = await apiGet("/api/lazy-trading/get-setup-status", {
        userWallet: user.wallet.address,
      });

      if (data.success && data.hasSetup) {
        if (data.agent) {
          setAgentId(data.agent.id);
        }
        if (data.telegramUser) {
          setTelegramUser(data.telegramUser);
        }
        if (data.deployment) {
          setDeploymentId(data.deployment.id);
        }
        if (data.tradingPreferences) {
          setTradingPreferences(data.tradingPreferences);
        }
        if (data.ostiumAgentAddress) {
          setOstiumAgentAddress(data.ostiumAgentAddress);
        }
        if (data.hyperliquidAgentAddress) {
          setHyperliquidAgentAddress(data.hyperliquidAgentAddress);
        }

        if (data.isDelegatedToAgent) {
          setDelegationComplete(true);
        }
        if (data.hasUsdcApproval) {
          setAllowanceComplete(true);
        }

        // Map the API step to new step order
        // API returns: wallet, telegram, preferences, ostium, complete
        // New order: wallet, ostium, preferences, telegram, complete
        const stepMapping: Record<string, Step> = {
          wallet: "wallet",
          telegram: "telegram",
          preferences: "preferences",
          ostium: "ostium",
          complete: "complete",
        };
        setStep(stepMapping[data.step] || "wallet");
      } else {
        if (data.hasExistingOstiumAddress && data.ostiumAgentAddress) {
          setOstiumAgentAddress(data.ostiumAgentAddress);
          if (data.isDelegatedToAgent) {
            setDelegationComplete(true);
          }
          if (data.hasUsdcApproval) {
            setAllowanceComplete(true);
          }
        }
        if (data.hyperliquidAgentAddress) {
          setHyperliquidAgentAddress(data.hyperliquidAgentAddress);
        }
        // Start at ostium step after wallet connection
        setStep("ostium");
      }
    } catch (err) {
      console.error("Error loading existing setup:", err);
      setStep("ostium");
    } finally {
      setInitialLoadDone(true);
    }
  };

  // Auto-proceed when both delegation and allowance are done (on ostium step)
  useEffect(() => {
    if (step === "ostium" && delegationComplete && allowanceComplete) {
      setSigningStep("done");
      // Small delay to show success state, then proceed
      setTimeout(() => {
        setStep("preferences");
      }, 1000);
    }
  }, [step, delegationComplete, allowanceComplete]);

  return {
    step,
    setStep,
    loading,
    setLoading,
    error,
    setError,
    telegramUser,
    setTelegramUser,
    linkCode,
    setLinkCode,
    botUsername,
    setBotUsername,
    deepLink,
    setDeepLink,
    copied,
    setCopied,
    checkingTelegram,
    setCheckingTelegram,
    tradingPreferences,
    setTradingPreferences,
    ostiumAgentAddress,
    setOstiumAgentAddress,
    hyperliquidAgentAddress,
    setHyperliquidAgentAddress,
    delegationComplete,
    setDelegationComplete,
    allowanceComplete,
    setAllowanceComplete,
    txHash,
    setTxHash,
    signingStep,
    setSigningStep,
    ethAmount,
    setEthAmount,
    sendingEth,
    setSendingEth,
    ethTxHash,
    setEthTxHash,
    ethError,
    setEthError,
    agentId,
    setAgentId,
    deploymentId,
    setDeploymentId,
    initialLoadDone,
  };
}
