"use client";

import { useState, useEffect } from "react";
import { Check, Activity, ExternalLink, Shield, Zap, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { theme, fonts } from "../ostium/theme";
import { hoverLiftClass } from "../ostium/ui";
import { blockExplorerUrl } from "@/app/lib/ostium-config";

interface OstiumStepProps {
  ostiumAgentAddress: string;
  delegationComplete: boolean;
  allowanceComplete: boolean;
  loading: boolean;
  signingStep: "idle" | "delegation" | "allowance" | "done";
  txHash: string | null;
  onApproveDelegation: () => void;
  onApproveUsdc: () => void;
  onCheckStatus: () => void;
  onContinue?: () => void;
}

// Loading step indicator component
function LoadingStepIndicator({
  signingStep,
  delegationComplete,
  allowanceComplete,
  txHash
}: {
  signingStep: "idle" | "delegation" | "allowance" | "done";
  delegationComplete: boolean;
  allowanceComplete: boolean;
  txHash: string | null;
}) {
  const getStepInfo = () => {
    if (signingStep === "delegation") {
      return {
        title: "Signing Delegation",
        description: "Please confirm the delegation transaction in your wallet...",
        step: 1,
        total: 2,
      };
    }
    if (signingStep === "allowance") {
      return {
        title: "Signing Allowance",
        description: "Please confirm the USDC allowance transaction in your wallet...",
        step: 2,
        total: 2,
      };
    }
    if (txHash) {
      return {
        title: "Confirming Transaction",
        description: "Waiting for blockchain confirmation...",
        step: delegationComplete ? 2 : 1,
        total: 2,
      };
    }
    // Checking status - show whenever signingStep is idle (we're checking before signing)
    if (signingStep === "idle") {
      return {
        title: "Checking Status",
        description: "Verifying your current delegation and allowance status...",
        step: 0,
        total: 2,
      };
    }
    return null;
  };

  const stepInfo = getStepInfo();
  if (!stepInfo) return null;

  return (
    <div
      className="p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3"
      style={{
        background: theme.primarySoft,
        border: `1px solid ${theme.primaryBorder}`,
      }}
    >
      {/* Progress indicator */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: theme.primary,
          }}
        >
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" style={{ color: theme.bg }} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-xs sm:text-sm font-semibold"
            style={{ color: theme.primary, fontFamily: fonts.heading }}
          >
            {stepInfo.title}
          </p>
          <p
            className="text-[10px] sm:text-xs"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            {stepInfo.description}
          </p>
        </div>
        {stepInfo.step > 0 && (
          <span
            className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-1 rounded shrink-0"
            style={{
              background: theme.surface,
              color: theme.primary,
              fontFamily: fonts.body,
            }}
          >
            {stepInfo.step}/{stepInfo.total}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: theme.surface }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            background: theme.primary,
            width: stepInfo.step === 0 ? "10%" : `${(stepInfo.step / stepInfo.total) * 100}%`,
          }}
        />
      </div>

      {/* Step labels */}
      <div className="flex justify-between text-xs" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
        <span style={{ color: stepInfo.step >= 1 ? theme.primary : theme.textMuted }}>
          Delegation
        </span>
        <span style={{ color: stepInfo.step >= 2 ? theme.primary : theme.textMuted }}>
          Allowance
        </span>
      </div>
    </div>
  );
}

export function OstiumStep({
  ostiumAgentAddress,
  delegationComplete,
  allowanceComplete,
  loading,
  signingStep,
  txHash,
  onApproveDelegation,
  onApproveUsdc,
  onCheckStatus,
  onContinue,
}: OstiumStepProps) {
  const isComplete = delegationComplete && allowanceComplete;
  const [doingBothActions, setDoingBothActions] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Handle status check with loading state
  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    try {
      await onCheckStatus();
    } finally {
      setCheckingStatus(false);
    }
  };

  // Auto-trigger allowance after delegation completes when doing both actions
  useEffect(() => {
    if (doingBothActions && delegationComplete && !allowanceComplete && !loading && signingStep === "idle") {
      // Delegation just completed, now trigger allowance
      setDoingBothActions(false); // Reset flag
      onApproveUsdc();
    }
  }, [doingBothActions, delegationComplete, allowanceComplete, loading, signingStep, onApproveUsdc]);

  // Reset flag when both actions are complete
  useEffect(() => {
    if (isComplete) {
      setDoingBothActions(false);
    }
  }, [isComplete]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center px-2">
        <div
          className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl flex items-center justify-center mb-3 sm:mb-4"
          style={{
            background: isComplete ? theme.successSoft : theme.primarySoft,
            border: `1px solid ${isComplete ? theme.success : theme.primaryBorder}`,
          }}
        >
          {isComplete ? (
            <Check className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.success }} />
          ) : (
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.primary }} />
          )}
        </div>

        <h2
          className="text-lg sm:text-xl font-semibold mb-2"
          style={{ color: theme.text, fontFamily: fonts.heading }}
        >
          {isComplete ? "1-Click Trading Enabled" : "Enable 1-Click Trading"}
        </h2>
        <p className="text-xs sm:text-sm px-2" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
          {isComplete
            ? "You're all set for gasless transactions."
            : "Enable gasless transactions and 1-click trading on Ostium."}
        </p>
      </div>

      {/* Steps Card */}
      <div
        className="p-3 sm:p-4 rounded-lg"
        style={{
          background: theme.surfaceAlt,
          border: `1px solid ${theme.stroke}`,
        }}
      >
        <p
          className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-3 sm:mb-4"
          style={{ color: theme.textMuted, fontFamily: fonts.body }}
        >
          Required Steps
        </p>

        {/* Step 1: Delegation */}
        <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: delegationComplete ? theme.primary : theme.surface,
              border: `1px solid ${delegationComplete ? theme.primary : theme.stroke}`,
            }}
          >
            {delegationComplete ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.bg }} />
            ) : signingStep === "delegation" ? (
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.primary }} />
            ) : (
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.textMuted }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-xs sm:text-sm font-medium"
              style={{ color: delegationComplete ? theme.primary : theme.text, fontFamily: fonts.heading }}
            >
              Enable Account Delegation
            </p>
            <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              Delegate signatures to a smart wallet.
            </p>
          </div>
          {delegationComplete && (
            <span
              className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded shrink-0"
              style={{ background: theme.successSoft, color: theme.success }}
            >
              Done
            </span>
          )}
        </div>

        {/* Step 2: Allowance */}
        <div className="flex items-start gap-2 sm:gap-3">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: allowanceComplete ? theme.primary : theme.surface,
              border: `1px solid ${allowanceComplete ? theme.primary : theme.stroke}`,
            }}
          >
            {allowanceComplete ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.bg }} />
            ) : signingStep === "allowance" ? (
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.primary }} />
            ) : (
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.textMuted }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-xs sm:text-sm font-medium"
              style={{ color: allowanceComplete ? theme.primary : theme.text, fontFamily: fonts.heading }}
            >
              Set USDC Allowance
            </p>
            <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              Set maximum allowance for trades.
            </p>
          </div>
          {allowanceComplete && (
            <span
              className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded shrink-0"
              style={{ background: theme.successSoft, color: theme.success }}
            >
              Done
            </span>
          )}
        </div>
      </div>

      {/* Loading Status Indicator - Show when loading */}
      {loading && (
        <LoadingStepIndicator
          signingStep={signingStep}
          delegationComplete={delegationComplete}
          allowanceComplete={allowanceComplete}
          txHash={txHash}
        />
      )}

      {/* Enable 1 CT Button - Handles both actions or specific remaining action */}
      {!isComplete && (
        <div className="space-y-2">
          <button
            onClick={async () => {
              // If both are incomplete, do delegation first, then allowance will auto-trigger
              if (!delegationComplete && !allowanceComplete) {
                setDoingBothActions(true);
                await onApproveDelegation();
              } else if (!delegationComplete) {
                // Only delegation needed
                await onApproveDelegation();
              } else if (!allowanceComplete) {
                // Only allowance needed
                await onApproveUsdc();
              }
            }}
            disabled={loading || checkingStatus || !ostiumAgentAddress}
            className={`w-full py-2.5 sm:py-3 cursor-pointer rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 disabled:opacity-50 ${hoverLiftClass}`}
            style={{
              background: theme.primary,
              color: theme.bg,
              fontFamily: fonts.heading,
            }}
          >
            {loading ? (
              <>
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="text-xs sm:text-sm">
                  {signingStep === "delegation" ? "SIGNING DELEGATION..." :
                    signingStep === "allowance" ? "SIGNING ALLOWANCE..." :
                      "PROCESSING..."}
                </span>
              </>
            ) : (
              !delegationComplete && !allowanceComplete
                ? "ENABLE 1 CT"
                : !delegationComplete
                  ? "APPROVE DELEGATION"
                  : "APPROVE USDC"
            )}
          </button>
          {ostiumAgentAddress && (
            <button
              onClick={handleCheckStatus}
              disabled={loading || checkingStatus}
              className="w-full py-2 text-[10px] sm:text-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ color: theme.textMuted, fontFamily: fonts.body }}
            >
              {checkingStatus ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Checking Status...
                </>
              ) : (
                "Refresh Status"
              )}
            </button>
          )}
        </div>
      )}

      {/* Continue Button - Show when complete */}
      {isComplete && onContinue && (
        <button
          onClick={onContinue}
          className={`w-full py-2.5 sm:py-3 cursor-pointer rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 ${hoverLiftClass}`}
          style={{
            background: theme.success,
            color: theme.bg,
            fontFamily: fonts.heading,
          }}
        >
          <Check className="w-4 h-4" />
          <span className="hidden sm:inline">Continue to Next Step</span>
          <span className="sm:hidden">Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}


      {/* Transaction Hash */}
      {txHash && (
        <div
          className="p-2.5 sm:p-3 rounded-lg"
          style={{
            background: theme.primarySoft,
            border: `1px solid ${theme.primaryBorder}`,
          }}
        >
          <p className="text-xs sm:text-sm mb-1" style={{ color: theme.primary, fontFamily: fonts.heading }}>
            Transaction Submitted
          </p>
          <a
            href={`${blockExplorerUrl}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] sm:text-xs flex items-center gap-1 break-all"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            View on Explorer <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
      )}

      {/* Security Info */}
      <div
        className="p-3 sm:p-4 rounded-lg"
        style={{
          background: theme.surface,
          border: `1px solid ${theme.stroke}`,
        }}
      >
        <div className="flex items-start gap-2 sm:gap-3">
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" style={{ color: theme.success }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium mb-1" style={{ color: theme.text, fontFamily: fonts.heading }}>
              Security
            </p>
            <ul className="space-y-1">
              {[
                "Agent can only trade — cannot withdraw funds",
                "You can revoke access at any time",
                "Funds remain in your wallet",
              ].map((item, i) => (
                <li
                  key={i}
                  className="text-[10px] sm:text-xs flex items-start gap-2"
                  style={{ color: theme.textMuted, fontFamily: fonts.body }}
                >
                  <span className="shrink-0 mt-0.5" style={{ color: theme.success }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
