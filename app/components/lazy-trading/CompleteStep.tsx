"use client";

import { CheckCircle, Copy, Send, ExternalLink, Activity } from "lucide-react";
import { theme, fonts } from "../ostium/theme";
import { hoverLiftClass } from "../ostium/ui";

interface CompleteStepProps {
  ostiumAgentAddress: string;
  copied: boolean;
  ethAmount: string;
  sendingEth: boolean;
  ethTxHash: string | null;
  ethError: string | null;
  onCopyAddress: () => void;
  onEthAmountChange: (amount: string) => void;
  onSendETH: () => void;
  onViewDeployments: () => void;
  onBackToHome: () => void;
}

export function CompleteStep({
  ostiumAgentAddress,
  copied,
  ethAmount,
  sendingEth,
  ethTxHash,
  ethError,
  onCopyAddress,
  onEthAmountChange,
  onSendETH,
  onViewDeployments,
  onBackToHome,
}: CompleteStepProps) {
  return (
    <div className="space-y-6 py-4">
      {/* Success Header */}
      <div className="text-center">
        <div
          className="w-20 h-20 mx-auto border-2 flex items-center justify-center mb-4"
          style={{
            borderColor: theme.primary,
            background: theme.primary,
          }}
        >
          <CheckCircle className="w-10 h-10" style={{ color: theme.bg }} />
        </div>
        <h2
          className="text-2xl mb-2"
          style={{ color: theme.text, fontFamily: fonts.heading }}
        >
          YOU'RE ALL SET!
        </h2>
        <p style={{ color: theme.textMuted, fontFamily: fonts.body }}>
          Your Lazy Trading agent is ready to execute trades
        </p>
      </div>

      {/* Checklist */}
      <div
        className="p-4 text-left space-y-2"
        style={{
          border: `1px solid ${theme.primary}`,
          background: theme.primarySoft,
        }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" style={{ color: theme.primary }} />
          <span className="text-sm" style={{ color: theme.text, fontFamily: fonts.body }}>
            Wallet connected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" style={{ color: theme.primary }} />
          <span className="text-sm" style={{ color: theme.text, fontFamily: fonts.body }}>
            Telegram linked as signal source
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" style={{ color: theme.primary }} />
          <span className="text-sm" style={{ color: theme.text, fontFamily: fonts.body }}>
            Trading preferences configured
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" style={{ color: theme.primary }} />
          <span className="text-sm" style={{ color: theme.text, fontFamily: fonts.body }}>
            Ostium delegation approved
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" style={{ color: theme.primary }} />
          <span className="text-sm" style={{ color: theme.text, fontFamily: fonts.body }}>
            USDC spending approved
          </span>
        </div>
      </div>

      {/* Agent Address Display */}
      {ostiumAgentAddress && (
        <div
          className="p-4"
          style={{
            border: `1px solid ${theme.stroke}`,
            background: theme.surface,
          }}
        >
          <p
            className="text-xs font-bold mb-2"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            YOUR OSTIUM TRADING ADDRESS
          </p>
          <div
            className="flex items-center gap-2 p-3 border"
            style={{
              background: theme.bg,
              borderColor: theme.stroke,
            }}
          >
            <code
              className="flex-1 text-xs font-mono break-all"
              style={{ color: theme.text, fontFamily: fonts.body }}
            >
              {ostiumAgentAddress}
            </code>
            <button
              onClick={onCopyAddress}
              className="p-2 transition-colors cursor-pointer"
              style={{
                color: theme.textMuted,
              }}
              title="Copy address"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4" style={{ color: theme.primary }} />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* ETH Funding Section */}
      {ostiumAgentAddress && (
        <div
          className="p-4"
          style={{
            border: `1px solid ${theme.primaryBorder}`,
            background: theme.primarySoft,
          }}
        >
          <p
            className="text-xs font-bold mb-2 flex items-center gap-2"
            style={{ color: theme.text, fontFamily: fonts.heading }}
          >
            <Send className="w-3.5 h-3.5" style={{ color: theme.primary }} />
            Fund Agent with ETH
          </p>
          <p
            className="text-xs mb-3"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            Send ETH to your trading address so it can pay for gas fees when executing trades.
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.001"
              min="0"
              placeholder="0.005"
              value={ethAmount}
              onChange={(e) => onEthAmountChange(e.target.value)}
              className="flex-1 px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{
                background: theme.surface,
                border: `1px solid ${theme.stroke}`,
                color: theme.text,
                fontFamily: fonts.body,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.stroke;
              }}
            />
            <button
              onClick={onSendETH}
              disabled={sendingEth || !ethAmount || parseFloat(ethAmount) <= 0}
              className={`cursor-pointer px-4 py-2 font-bold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${hoverLiftClass}`}
              style={{
                background: theme.primary,
                color: theme.bg,
                fontFamily: fonts.heading,
              }}
            >
              {sendingEth ? (
                <>
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  SENDING...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  SEND ETH
                </>
              )}
            </button>
          </div>
          {ethTxHash && (
            <p className="text-xs mt-2 font-mono" style={{ color: theme.primary, fontFamily: fonts.body }}>
              TX:{" "}
              <a
                href={`https://arbiscan.io/tx/${ethTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {ethTxHash.slice(0, 20)}...
              </a>
            </p>
          )}
          {ethError && (
            <p className="text-xs mt-2" style={{ color: theme.primary, fontFamily: fonts.body }}>
              {ethError}
            </p>
          )}
        </div>
      )}

      {/* Ostium Registration */}
      <div
        className="p-4"
        style={{
          border: `1px solid ${theme.stroke}`,
          background: theme.surface,
        }}
      >
        <p
          className="text-xs font-bold mb-2 flex items-center gap-2"
          style={{ color: theme.text, fontFamily: fonts.heading }}
        >
          <ExternalLink className="w-3.5 h-3.5" style={{ color: theme.primary }} />
          Register on Ostium Platform
        </p>
        <p
          className="text-xs mb-3"
          style={{ color: theme.textMuted, fontFamily: fonts.body }}
        >
          To enable trading, you need to register on the Ostium platform and deposit USDC:
        </p>
        <ol className="space-y-1 text-xs ml-4 list-decimal mb-3" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
          <li>
            Visit{" "}
            <a
              href="https://app.ostium.com/trade"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: theme.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              app.ostium.com/trade
            </a>
          </li>
          <li>Connect your wallet and set a username</li>
          <li>Deposit USDC to your account</li>
          <li>The agent will trade using the USDC you deposit</li>
        </ol>
        <a
          href="https://app.ostium.com/trade"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2 font-bold text-xs transition-colors ${hoverLiftClass}`}
          style={{
            background: theme.primary,
            color: theme.bg,
            fontFamily: fonts.heading,
          }}
        >
          Open Ostium Platform
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* How to Send Signals */}
      <div
        className="p-4 text-sm"
        style={{
          border: `1px solid ${theme.stroke}`,
          background: theme.surface,
          color: theme.textMuted,
          fontFamily: fonts.body,
        }}
      >
        <p className="font-bold mb-2" style={{ color: theme.text, fontFamily: fonts.heading }}>
          📱 How to Send Signals
        </p>
        <p className="text-xs">
          Send trading signals to the Telegram bot, and your agent will execute them automatically.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onViewDeployments}
          className={`flex-1 py-4 font-bold transition-colors cursor-pointer ${hoverLiftClass}`}
          style={{
            background: theme.primary,
            color: theme.bg,
            fontFamily: fonts.heading,
          }}
        >
          VIEW MY DEPLOYMENTS
        </button>
        <button
          onClick={onBackToHome}
          className={`flex-1 py-4 font-bold transition-colors border cursor-pointer ${hoverLiftClass}`}
          style={{
            borderColor: theme.stroke,
            color: theme.text,
            fontFamily: fonts.heading,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.stroke;
          }}
        >
          BACK TO HOME
        </button>
      </div>
    </div>
  );
}

