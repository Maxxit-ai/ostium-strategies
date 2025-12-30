"use client";

import { Send, CheckCircle, Activity, Copy, ExternalLink, ChevronRight } from "lucide-react";
import { theme, fonts } from "../ostium/theme";
import { hoverLiftClass } from "../ostium/ui";

interface TelegramUser {
  id: string;
  telegram_user_id: string;
  telegram_username: string | null;
  first_name: string | null;
  last_name: string | null;
}

interface TelegramStepProps {
  telegramUser: TelegramUser | null;
  linkCode: string;
  botUsername: string;
  deepLink: string;
  copied: boolean;
  loading: boolean;
  checkingTelegram: boolean;
  onGenerateLink: () => void;
  onCopyCode: () => void;
  onCheckStatus: () => void;
  onContinue: () => void;
}

export function TelegramStep({
  telegramUser,
  linkCode,
  botUsername,
  deepLink,
  copied,
  loading,
  checkingTelegram,
  onGenerateLink,
  onCopyCode,
  onCheckStatus,
  onContinue,
}: TelegramStepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center px-2">
        <div
          className="w-12 h-12 sm:w-16 sm:h-16 mx-auto border-2 flex items-center justify-center mb-3 sm:mb-4"
          style={{ borderColor: theme.primary }}
        >
          <Send className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: theme.primary }} />
        </div>
        <h2
          className="text-xl sm:text-2xl mb-2"
          style={{ color: theme.text, fontFamily: fonts.heading }}
        >
          CONNECT TELEGRAM
        </h2>
        <p className="text-xs sm:text-sm" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
          Link your Telegram to send trading signals
        </p>
      </div>

      {telegramUser ? (
        <div className="space-y-3 sm:space-y-4">
          <div
            className="p-4 sm:p-6 text-center"
            style={{
              border: `1px solid ${theme.primary}`,
              background: theme.primarySoft,
            }}
          >
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3" style={{ color: theme.primary }} />
            <p
              className="font-bold text-base sm:text-lg"
              style={{ color: theme.text, fontFamily: fonts.heading }}
            >
              TELEGRAM CONNECTED
            </p>
            <p className="mt-2 text-sm sm:text-base break-all px-2" style={{ color: theme.primary, fontFamily: fonts.body }}>
              {telegramUser.telegram_username
                ? `@${telegramUser.telegram_username}`
                : telegramUser.first_name || "Connected"}
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={onContinue}
              className={`w-full cursor-pointer py-3 sm:py-4 text-sm sm:text-base font-bold transition-colors flex items-center justify-center gap-2 ${hoverLiftClass}`}
              style={{
                background: theme.primary,
                color: theme.bg,
                fontFamily: fonts.heading,
              }}
            >
              CONTINUE
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={onCheckStatus}
              disabled={checkingTelegram}
              className="w-full cursor-pointer py-2 text-[10px] sm:text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                color: theme.textMuted,
                fontFamily: fonts.body,
              }}
            >
              {checkingTelegram ? (
                <>
                  <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                  Checking...
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Refresh Connection Status</span>
                  <span className="sm:hidden">Refresh</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : linkCode ? (
        <div className="space-y-3 sm:space-y-4">
          {/* Step 1: Copy Code */}
          <div
            className="p-3 sm:p-4"
            style={{
              border: `1px solid ${theme.stroke}`,
              background: theme.surface,
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-bold" style={{ color: theme.text, fontFamily: fonts.heading }}>
                Step 1: Copy Code
              </span>
              <span
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded"
                style={{
                  background: theme.primarySoft,
                  color: theme.primary,
                  fontFamily: fonts.body,
                }}
              >
                1 of 3
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code
                className="flex-1 px-2 sm:px-4 py-2 sm:py-3 font-mono text-sm sm:text-lg md:text-xl tracking-wider text-center break-all"
                style={{
                  background: theme.bg,
                  color: theme.primary,
                  fontFamily: fonts.body,
                }}
              >
                {linkCode}
              </code>
              <button
                onClick={onCopyCode}
                className="p-2 sm:p-3 transition-colors cursor-pointer shrink-0"
                style={{
                  border: `1px solid ${theme.stroke}`,
                }}
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.primary }} />
                ) : (
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.textMuted }} />
                )}
              </button>
            </div>
          </div>

          {/* Step 2: Open Bot */}
          <div
            className="p-3 sm:p-4"
            style={{
              border: `1px solid ${theme.stroke}`,
              background: theme.surface,
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-bold" style={{ color: theme.text, fontFamily: fonts.heading }}>
                Step 2: Open Bot
              </span>
              <span
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded"
                style={{
                  background: theme.primarySoft,
                  color: theme.primary,
                  fontFamily: fonts.body,
                }}
              >
                2 of 3
              </span>
            </div>
            <a
              href={deepLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full cursor-pointer py-2.5 sm:py-3 text-sm sm:text-base font-bold transition-colors flex items-center justify-center gap-2 ${hoverLiftClass}`}
              style={{
                border: `1px solid ${theme.primary}`,
                color: theme.primary,
                fontFamily: fonts.heading,
              }}
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Open @{botUsername}</span>
              <span className="sm:hidden">Open Bot</span>
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          </div>

          {/* Step 3: Start Bot */}
          <div
            className="p-3 sm:p-4"
            style={{
              border: `1px solid ${theme.stroke}`,
              background: theme.surface,
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-bold" style={{ color: theme.text, fontFamily: fonts.heading }}>
                Step 3: Start Bot
              </span>
              <span
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded"
                style={{
                  background: theme.primarySoft,
                  color: theme.primary,
                  fontFamily: fonts.body,
                }}
              >
                3 of 3
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              Click "Start" in Telegram to complete the connection. This page will update automatically.
            </p>
          </div>

          <div
            className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
            style={{
              border: `1px solid ${theme.primaryBorder}`,
              background: theme.primarySoft,
            }}
          >
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse shrink-0" style={{ color: theme.primary }} />
            <p className="text-xs sm:text-sm flex-1" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              Waiting for Telegram connection...
            </p>
          </div>

          <button
            onClick={onCheckStatus}
            disabled={checkingTelegram}
            className="w-full cursor-pointer py-2 text-[10px] sm:text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              color: theme.textMuted,
              fontFamily: fonts.body,
            }}
          >
            {checkingTelegram ? (
              <>
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                Checking...
              </>
            ) : (
              <>
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Refresh Connection Status</span>
                <span className="sm:hidden">Refresh</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <button
          onClick={onGenerateLink}
          disabled={loading}
          className={`w-full cursor-pointer py-3 sm:py-4 text-sm sm:text-base font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${hoverLiftClass}`}
          style={{
            background: theme.primary,
            color: theme.bg,
            fontFamily: fonts.heading,
          }}
        >
          {loading ? (
            <>
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              <span className="hidden sm:inline">GENERATING...</span>
              <span className="sm:hidden">GENERATING...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">GENERATE TELEGRAM LINK</span>
              <span className="sm:hidden">GENERATE LINK</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

