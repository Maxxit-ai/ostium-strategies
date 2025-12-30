"use client";

import { Wallet, Activity, ChevronRight, Check, Shield } from "lucide-react";
import { theme, fonts } from "../ostium/theme";
import { hoverLiftClass } from "../ostium/ui";

interface WalletStepProps {
  authenticated: boolean;
  walletAddress?: string;
  onConnect: () => void;
  onContinue: () => void;
  checkingTelegram: boolean;
}

export function WalletStep({
  authenticated,
  walletAddress,
  onConnect,
  onContinue,
  checkingTelegram,
}: WalletStepProps) {
  return (
    <div className="text-center space-y-4 sm:space-y-6 py-2 sm:py-4">
      {/* Icon */}
      <div
        className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl flex items-center justify-center"
        style={{
          background: authenticated ? theme.successSoft : theme.primarySoft,
          border: `1px solid ${authenticated ? theme.success : theme.primaryBorder}`,
        }}
      >
        {authenticated ? (
          <Check className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.success }} />
        ) : (
          <Wallet className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.primary }} />
        )}
      </div>

      {/* Title */}
      <div>
        <h2
          className="text-lg sm:text-xl font-semibold mb-2 px-2"
          style={{ color: theme.text, fontFamily: fonts.heading }}
        >
          {authenticated ? "Wallet Connected" : "Connect Your Wallet"}
        </h2>
        <p
          className="text-xs sm:text-sm max-w-sm mx-auto px-2"
          style={{ color: theme.textMuted, fontFamily: fonts.body }}
        >
          {authenticated
            ? "Your wallet is connected. Continue to enable 1-click trading."
            : "Connect your wallet to start the setup process"}
        </p>
      </div>

      {authenticated && walletAddress ? (
        <div className="space-y-3 sm:space-y-4 px-2">
          {/* Connected Wallet */}
          <div
            className="p-3 sm:p-4 rounded-lg text-left max-w-sm mx-auto"
            style={{
              background: theme.surfaceAlt,
              border: `1px solid ${theme.stroke}`,
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: theme.successSoft }}
              >
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.success }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] sm:text-xs font-medium"
                  style={{ color: theme.success, fontFamily: fonts.body }}
                >
                  Connected
                </p>
                <p
                  className="text-xs sm:text-sm font-mono truncate"
                  style={{ color: theme.text }}
                >
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            </div>
          </div>

          {/* Next Step Info */}
          <div
            className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg max-w-sm mx-auto text-left"
            style={{
              background: theme.primarySoft,
              border: `1px solid ${theme.primaryBorder}`,
            }}
          >
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" style={{ color: theme.primary }} />
            <p className="text-[10px] sm:text-xs leading-relaxed" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              Next: Sign two transactions to enable delegation and approve USDC.
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className={`w-full cursor-pointer max-w-sm mx-auto py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 ${hoverLiftClass}`}
            style={{
              background: theme.primary,
              color: theme.bg,
              fontFamily: fonts.heading,
            }}
          >
            {checkingTelegram ? (
              <>
                <Activity className="w-4 h-4" />
                Checking...
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className={`w-full cursor-pointer max-w-sm mx-auto py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 ${hoverLiftClass}`}
          style={{
            background: theme.primary,
            color: theme.bg,
            fontFamily: fonts.heading,
          }}
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </button>
      )}
    </div>
  );
}
