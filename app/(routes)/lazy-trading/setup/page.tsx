"use client";

import React, { useState } from 'react'
import { useLazyTrading } from '@/app/components/lazy-trading/hooks/useLazyTrading';
import { useTelegram } from '@/app/components/lazy-trading/hooks/useTelegram';
import { useOstium } from '@/app/components/lazy-trading/hooks/useOstium';
import { useEthSending } from '@/app/components/lazy-trading/hooks/useEthSending';
import { useEffect } from 'react';
import { apiPost } from '@/app/lib/api';
import { theme } from '@/app/components/ostium/theme';
import { fonts } from '@/app/components/ostium/theme';
import { AlertCircle, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { OstiumHeader } from '@/app/components/ostium/header';
import { ProgressSteps } from '@/app/components/lazy-trading/ProgressSteps';
import { WalletStep } from '@/app/components/lazy-trading/WalletStep';
import { OstiumStep } from '@/app/components/lazy-trading/OstiumStep';
import { TradingPreferencesForm } from '@/app/components/lazy-trading/TradingPreferencesModal';
import { TelegramStep } from '@/app/components/lazy-trading/TelegramStep';
import { CompleteStep } from '@/app/components/lazy-trading/CompleteStep';
import { TradingPreferences } from '@/app/components/lazy-trading/TradingPreferencesModal';

export default function LazyTradingSetup() {

  const router = useRouter();
  const { authenticated, user, login } = usePrivy();
  const [currentTime, setCurrentTime] = useState("");

  // Main state management hook
  const {
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
  } = useLazyTrading();

  // Telegram hooks
  const { checkTelegramStatus, generateTelegramLink } = useTelegram(
    user?.wallet?.address,
    setTelegramUser,
    setLinkCode,
    setBotUsername,
    setDeepLink,
    setCheckingTelegram,
    setError,
    setLoading,
    setAgentId
  );

  // Ostium hooks - matches reference implementation with separate functions
  const { checkOstiumStatus, approveDelegation, approveUsdc } = useOstium(
    user?.wallet?.address,
    ostiumAgentAddress,
    setDelegationComplete,
    setAllowanceComplete,
    setTxHash,
    setError,
    setLoading,
    setSigningStep
  );

  // ETH sending hook
  const { handleSendETH } = useEthSending(
    user?.wallet?.address,
    ostiumAgentAddress,
    setSendingEth,
    setEthTxHash,
    setEthError
  );

  // Poll for telegram connection
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (step === "telegram" && linkCode && !telegramUser) {
      interval = setInterval(() => {
        checkTelegramStatus(linkCode);
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, linkCode, telegramUser]);

  // Check Ostium status when on ostium step
  useEffect(() => {
    if (step === "ostium" && user?.wallet?.address && ostiumAgentAddress) {
      checkOstiumStatus();
    }
  }, [step, user?.wallet?.address, ostiumAgentAddress]);

  // Generate Ostium address when entering ostium step
  useEffect(() => {
    if (step === "ostium" && user?.wallet?.address && !ostiumAgentAddress) {
      generateOstiumAddress();
    }
  }, [step, user?.wallet?.address, ostiumAgentAddress]);

  const copyCode = () => {
    navigator.clipboard.writeText(linkCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreferencesSave = (prefs: TradingPreferences) => {
    setTradingPreferences(prefs);
    // Move to telegram step after saving preferences
    setStep("telegram");
  };

  const createAgentAndProceed = async () => {
    if (!user?.wallet?.address || !telegramUser) return;

    setLoading(true);
    setError("");

    try {
      const data = await apiPost("/api/lazy-trading/create-agent", {
        userWallet: user.wallet.address,
        telegramAlphaUserId: telegramUser.id,
        tradingPreferences: tradingPreferences,
      });

      if (data.success) {
        setAgentId(data.agent.id);
        setStep("complete");
      } else {
        setError(data.error || "Failed to create agent");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create agent");
    } finally {
      setLoading(false);
    }
  };

  const generateOstiumAddress = async () => {
    if (!user?.wallet?.address) return;

    try {
      const data = await apiPost("/api/ostium/generate-agent", {
        userWallet: user.wallet.address,
      });

      if (data.success) {
        setOstiumAgentAddress(data.agentAddress);
      }
    } catch (err) {
      console.error("Error generating Ostium address:", err);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(ostiumAgentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle continue from telegram step
  const handleTelegramContinue = () => {
    if (telegramUser) {
      createAgentAndProceed();
    }
  };

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <OstiumHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border mb-3 sm:mb-4"
            style={{
              borderColor: theme.primary,
              background: theme.primarySoft,
            }}
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.primary }} />
            <span
              className="text-xs sm:text-sm font-bold"
              style={{ color: theme.primary, fontFamily: fonts.heading }}
            >
              LAZY TRADING
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4"
            style={{ color: theme.text, fontFamily: fonts.heading }}
          >
            QUICK SETUP
          </h1>
          <p className="text-sm sm:text-base px-2" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
            Connect, configure, and start trading in minutes
          </p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps currentStep={step} />

        {/* Error Display */}
        {error && (
          <div
            className="mb-4 sm:mb-6 p-3 sm:p-4 border flex items-start gap-2 sm:gap-3"
            style={{
              borderColor: theme.primary,
              background: theme.primarySoft,
            }}
          >
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" style={{ color: theme.primary }} />
            <p className="text-xs sm:text-sm" style={{ color: theme.primary, fontFamily: fonts.body }}>
              {error}
            </p>
          </div>
        )}

        {/* Step Content */}
        <div
          className="border p-4 sm:p-6 md:p-8"
          style={{
            borderColor: theme.stroke,
            background: theme.surface,
          }}
        >
          {/* Step 1: Connect Wallet */}
          {step === "wallet" && (
            <WalletStep
              authenticated={authenticated}
              walletAddress={user?.wallet?.address}
              onConnect={login}
              onContinue={() => {
                // Generate Ostium address and move to ostium step
                setStep("ostium");
              }}
              checkingTelegram={checkingTelegram}
            />
          )}

          {/* Step 2: Ostium Setup (Enable 1-Click Trading) */}
          {step === "ostium" && (
            <OstiumStep
              ostiumAgentAddress={ostiumAgentAddress}
              delegationComplete={delegationComplete}
              allowanceComplete={allowanceComplete}
              loading={loading}
              signingStep={signingStep}
              txHash={txHash}
              onApproveDelegation={approveDelegation}
              onApproveUsdc={approveUsdc}
              onCheckStatus={checkOstiumStatus}
              onContinue={() => setStep("preferences")}
            />
          )}

          {/* Step 3: Trading Preferences */}
          {step === "preferences" && (
            <div className="space-y-4">
              <div className="text-center mb-4 sm:mb-6">
                <h2
                  className="text-xl sm:text-2xl mb-2"
                  style={{ color: theme.text, fontFamily: fonts.heading }}
                >
                  TRADING PREFERENCES
                </h2>
                <p className="text-sm sm:text-base" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
                  Configure how your agent should trade
                </p>
              </div>

              <TradingPreferencesForm
                userWallet={user?.wallet?.address || ""}
                onClose={() => router.push("/")}
                onBack={() => setStep("ostium")}
                localOnly={true}
                onSaveLocal={handlePreferencesSave}
                initialPreferences={tradingPreferences || undefined}
                primaryLabel={loading ? "Saving..." : "Save & Continue"}
              />
            </div>
          )}

          {/* Step 4: Connect Telegram */}
          {step === "telegram" && (
            <TelegramStep
              telegramUser={telegramUser}
              linkCode={linkCode}
              botUsername={botUsername}
              deepLink={deepLink}
              copied={copied}
              loading={loading}
              checkingTelegram={checkingTelegram}
              onGenerateLink={generateTelegramLink}
              onCopyCode={copyCode}
              onCheckStatus={() => checkTelegramStatus(linkCode)}
              onContinue={handleTelegramContinue}
            />
          )}

          {/* Step 5: Complete */}
          {step === "complete" && (
            <CompleteStep
              ostiumAgentAddress={ostiumAgentAddress}
              copied={copied}
              ethAmount={ethAmount}
              sendingEth={sendingEth}
              ethTxHash={ethTxHash}
              ethError={ethError}
              onCopyAddress={handleCopyAddress}
              onEthAmountChange={setEthAmount}
              onSendETH={() => handleSendETH(ethAmount)}
              onViewDeployments={() => router.push("https://www.maxxit.ai/my-deployments")}
              onBackToHome={() => router.push("/")}
            />
          )}
        </div>
      </div>
    </div>
  )
}
