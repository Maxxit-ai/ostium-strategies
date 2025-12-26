"use client";

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
  onEnable1ClickTrading: () => void;
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
      className="p-4 rounded-lg space-y-3"
      style={{
        background: theme.primarySoft,
        border: `1px solid ${theme.primaryBorder}`,
      }}
    >
      {/* Progress indicator */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: theme.primary,
          }}
        >
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: theme.bg }} />
        </div>
        <div className="flex-1">
          <p
            className="text-sm font-semibold"
            style={{ color: theme.primary, fontFamily: fonts.heading }}
          >
            {stepInfo.title}
          </p>
          <p
            className="text-xs"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            {stepInfo.description}
          </p>
        </div>
        {stepInfo.step > 0 && (
          <span
            className="text-xs font-bold px-2 py-1 rounded"
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
  onEnable1ClickTrading,
  onCheckStatus,
  onContinue,
}: OstiumStepProps) {
  const isComplete = delegationComplete && allowanceComplete;

  const getButtonText = () => {
    if (signingStep === "delegation") return "Sign Delegation (1/2)...";
    if (signingStep === "allowance") return "Sign Allowance (2/2)...";
    if (loading || signingStep === "idle") return "Processing...";

    // Show specific action when only one step is pending
    if (!delegationComplete && allowanceComplete) return "Sign Delegation";
    if (delegationComplete && !allowanceComplete) return "Sign Allowance";

    return "Enable 1-Click Trading";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div
          className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4"
          style={{
            background: isComplete ? theme.successSoft : theme.primarySoft,
            border: `1px solid ${isComplete ? theme.success : theme.primaryBorder}`,
          }}
        >
          {isComplete ? (
            <Check className="w-6 h-6" style={{ color: theme.success }} />
          ) : (
            <Shield className="w-6 h-6" style={{ color: theme.primary }} />
          )}
        </div>

        <h2
          className="text-xl font-semibold mb-2"
          style={{ color: theme.text, fontFamily: fonts.heading }}
        >
          {isComplete ? "1-Click Trading Enabled" : "Enable 1-Click Trading"}
        </h2>
        <p className="text-sm" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
          {isComplete
            ? "You're all set for gasless transactions."
            : "Enable gasless transactions and 1-click trading on Ostium."}
        </p>
      </div>

      {/* Steps Card */}
      <div
        className="p-4 rounded-lg"
        style={{
          background: theme.surfaceAlt,
          border: `1px solid ${theme.stroke}`,
        }}
      >
        <p
          className="text-xs font-medium uppercase tracking-wide mb-4"
          style={{ color: theme.textMuted, fontFamily: fonts.body }}
        >
          Required Steps
        </p>

        {/* Step 1: Delegation */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: delegationComplete ? theme.primary : theme.surface,
              border: `1px solid ${delegationComplete ? theme.primary : theme.stroke}`,
            }}
          >
            {delegationComplete ? (
              <Check className="w-4 h-4" style={{ color: theme.bg }} />
            ) : signingStep === "delegation" ? (
              <Activity className="w-4 h-4" style={{ color: theme.primary }} />
            ) : (
              <Shield className="w-4 h-4" style={{ color: theme.textMuted }} />
            )}
          </div>
          <div className="flex-1">
            <p
              className="text-sm font-medium"
              style={{ color: delegationComplete ? theme.primary : theme.text, fontFamily: fonts.heading }}
            >
              Enable Account Delegation
            </p>
            <p className="text-xs mt-0.5" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              Delegate signatures to a smart wallet.
            </p>
          </div>
          {delegationComplete && (
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: theme.successSoft, color: theme.success }}
            >
              Done
            </span>
          )}
        </div>

        {/* Step 2: Allowance */}
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: allowanceComplete ? theme.primary : theme.surface,
              border: `1px solid ${allowanceComplete ? theme.primary : theme.stroke}`,
            }}
          >
            {allowanceComplete ? (
              <Check className="w-4 h-4" style={{ color: theme.bg }} />
            ) : signingStep === "allowance" ? (
              <Activity className="w-4 h-4" style={{ color: theme.primary }} />
            ) : (
              <Sparkles className="w-4 h-4" style={{ color: theme.textMuted }} />
            )}
          </div>
          <div className="flex-1">
            <p
              className="text-sm font-medium"
              style={{ color: allowanceComplete ? theme.primary : theme.text, fontFamily: fonts.heading }}
            >
              Set USDC Allowance
            </p>
            <p className="text-xs mt-0.5" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              Set maximum allowance for trades.
            </p>
          </div>
          {allowanceComplete && (
            <span
              className="text-xs px-2 py-0.5 rounded"
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

      {/* Action Button - Show Enable button when not complete and not loading */}
      {!isComplete && !loading && (
        <button
          onClick={onEnable1ClickTrading}
          disabled={!ostiumAgentAddress || loading || signingStep === "idle"}
          className={`w-full py-3 cursor-pointer rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 ${hoverLiftClass}`}
          style={{
            background: theme.primary,
            color: theme.bg,
            fontFamily: fonts.heading,
          }}
        >
          <Zap className="w-4 h-4" />
          {getButtonText()}
        </button>
      )}

      {/* Continue Button - Show when complete */}
      {isComplete && onContinue && (
        <button
          onClick={onContinue}
          className={`w-full py-3 cursor-pointer rounded-lg font-medium flex items-center justify-center gap-2 ${hoverLiftClass}`}
          style={{
            background: theme.success,
            color: theme.bg,
            fontFamily: fonts.heading,
          }}
        >
          <Check className="w-4 h-4" />
          Continue to Next Step
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Refresh Status */}
      {ostiumAgentAddress && !isComplete && (
        <button
          onClick={onCheckStatus}
          disabled={loading}
          className="w-full py-2 text-xs cursor-pointer"
          style={{ color: theme.textMuted, fontFamily: fonts.body }}
        >
          Already enabled? Refresh Status
        </button>
      )}

      {/* Transaction Hash */}
      {txHash && (
        <div
          className="p-3 rounded-lg"
          style={{
            background: theme.primarySoft,
            border: `1px solid ${theme.primaryBorder}`,
          }}
        >
          <p className="text-sm mb-1" style={{ color: theme.primary, fontFamily: fonts.heading }}>
            Transaction Submitted
          </p>
          <a
            href={`${blockExplorerUrl}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            View on Explorer <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Security Info */}
      <div
        className="p-4 rounded-lg"
        style={{
          background: theme.surface,
          border: `1px solid ${theme.stroke}`,
        }}
      >
        <div className="flex items-start gap-3">
          <Shield className="w-4 h-4 shrink-0 mt-0.5" style={{ color: theme.success }} />
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: theme.text, fontFamily: fonts.heading }}>
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
                  className="text-xs flex items-center gap-2"
                  style={{ color: theme.textMuted, fontFamily: fonts.body }}
                >
                  <span style={{ color: theme.success }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
