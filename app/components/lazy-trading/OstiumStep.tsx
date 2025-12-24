"use client";

import { Check, Activity, ExternalLink, Shield, Zap, Sparkles } from "lucide-react";
import { theme, fonts } from "../ostium/theme";
import { hoverLiftClass } from "../ostium/ui";

interface OstiumStepProps {
  ostiumAgentAddress: string;
  delegationComplete: boolean;
  allowanceComplete: boolean;
  loading: boolean;
  signingStep: "idle" | "delegation" | "allowance" | "done";
  txHash: string | null;
  onEnable1ClickTrading: () => void;
  onCheckStatus: () => void;
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
}: OstiumStepProps) {
  const isComplete = delegationComplete && allowanceComplete;

  const getButtonText = () => {
    if (isComplete) return "Enabled";
    if (signingStep === "delegation") return "Sign Delegation (1/2)...";
    if (signingStep === "allowance") return "Sign Allowance (2/2)...";
    if (loading) return "Processing...";
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

      {/* Action Button */}
      {!isComplete && (
        <button
          onClick={onEnable1ClickTrading}
          disabled={loading || isComplete || !ostiumAgentAddress}
          className={`w-full py-3  cursor-pointer rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 ${hoverLiftClass}`}
          style={{
            background: theme.primary,
            color: theme.bg,
            fontFamily: fonts.heading,
          }}
        >
          {loading ? (
            <>
              <Activity className="w-4 h-4" />
              {getButtonText()}
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              {getButtonText()}
            </>
          )}
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
            href={`https://arbiscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            View on Arbiscan <ExternalLink className="w-3 h-3" />
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
