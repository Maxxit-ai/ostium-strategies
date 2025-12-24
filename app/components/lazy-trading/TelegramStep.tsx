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
    <div className="space-y-6">
      <div className="text-center">
        <div
          className="w-16 h-16 mx-auto border-2 flex items-center justify-center mb-4"
          style={{ borderColor: theme.primary }}
        >
          <Send className="w-8 h-8" style={{ color: theme.primary }} />
        </div>
        <h2
          className="text-2xl mb-2"
          style={{ color: theme.text, fontFamily: fonts.heading }}
        >
          CONNECT TELEGRAM
        </h2>
        <p style={{ color: theme.textMuted, fontFamily: fonts.body }}>
          Link your Telegram to send trading signals
        </p>
      </div>

      {telegramUser ? (
        <div className="space-y-4">
          <div
            className="p-6 text-center"
            style={{
              border: `1px solid ${theme.primary}`,
              background: theme.primarySoft,
            }}
          >
            <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: theme.primary }} />
            <p
              className="font-bold text-lg"
              style={{ color: theme.text, fontFamily: fonts.heading }}
            >
              TELEGRAM CONNECTED
            </p>
            <p className="mt-2" style={{ color: theme.primary, fontFamily: fonts.body }}>
              {telegramUser.telegram_username
                ? `@${telegramUser.telegram_username}`
                : telegramUser.first_name || "Connected"}
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={onContinue}
              className={`w-full cursor-pointer py-4 font-bold transition-colors flex items-center justify-center gap-2 ${hoverLiftClass}`}
              style={{
                background: theme.primary,
                color: theme.bg,
                fontFamily: fonts.heading,
              }}
            >
              CONTINUE
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={onCheckStatus}
              disabled={checkingTelegram}
              className="w-full cursor-pointer py-2 text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                color: theme.textMuted,
                fontFamily: fonts.body,
              }}
            >
              {checkingTelegram ? (
                <>
                  <Activity className="w-4 h-4 animate-pulse" />
                  Checking...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Refresh Connection Status
                </>
              )}
            </button>
          </div>
        </div>
      ) : linkCode ? (
        <div className="space-y-4">
          {/* Step 1: Copy Code */}
          <div
            className="p-4"
            style={{
              border: `1px solid ${theme.stroke}`,
              background: theme.surface,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold" style={{ color: theme.text, fontFamily: fonts.heading }}>
                Step 1: Copy Code
              </span>
              <span
                className="text-xs px-2 py-1 rounded"
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
                className="flex-1 px-4 py-3 font-mono text-xl tracking-wider text-center"
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
                className="p-3 transition-colors cursor-pointer"
                style={{
                  border: `1px solid ${theme.stroke}`,
                }}
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5" style={{ color: theme.primary }} />
                ) : (
                  <Copy className="w-5 h-5" style={{ color: theme.textMuted }} />
                )}
              </button>
            </div>
          </div>

          {/* Step 2: Open Bot */}
          <div
            className="p-4"
            style={{
              border: `1px solid ${theme.stroke}`,
              background: theme.surface,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold" style={{ color: theme.text, fontFamily: fonts.heading }}>
                Step 2: Open Bot
              </span>
              <span
                className="text-xs px-2 py-1 rounded"
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
              className={`w-full cursor-pointer py-3 font-bold transition-colors flex items-center justify-center gap-2 ${hoverLiftClass}`}
              style={{
                border: `1px solid ${theme.primary}`,
                color: theme.primary,
                fontFamily: fonts.heading,
              }}
            >
              <Send className="w-4 h-4" />
              Open @{botUsername}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Step 3: Start Bot */}
          <div
            className="p-4"
            style={{
              border: `1px solid ${theme.stroke}`,
              background: theme.surface,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold" style={{ color: theme.text, fontFamily: fonts.heading }}>
                Step 3: Start Bot
              </span>
              <span
                className="text-xs px-2 py-1 rounded"
                style={{
                  background: theme.primarySoft,
                  color: theme.primary,
                  fontFamily: fonts.body,
                }}
              >
                3 of 3
              </span>
            </div>
            <p className="text-sm" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              Click "Start" in Telegram to complete the connection. This page will update automatically.
            </p>
          </div>

          <div
            className="p-4 flex items-center gap-3"
            style={{
              border: `1px solid ${theme.primaryBorder}`,
              background: theme.primarySoft,
            }}
          >
            <Activity className="w-5 h-5 animate-pulse shrink-0" style={{ color: theme.primary }} />
            <p className="text-sm flex-1" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              Waiting for Telegram connection...
            </p>
          </div>

          <button
            onClick={onCheckStatus}
            disabled={checkingTelegram}
            className="w-full cursor-pointer py-2 text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              color: theme.textMuted,
              fontFamily: fonts.body,
            }}
          >
            {checkingTelegram ? (
              <>
                <Activity className="w-4 h-4 animate-pulse" />
                Checking...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Refresh Connection Status
              </>
            )}
          </button>
        </div>
      ) : (
        <button
          onClick={onGenerateLink}
          disabled={loading}
          className={`w-full cursor-pointer py-4 font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${hoverLiftClass}`}
          style={{
            background: theme.primary,
            color: theme.bg,
            fontFamily: fonts.heading,
          }}
        >
          {loading ? (
            <>
              <Activity className="w-5 h-5 animate-pulse" />
              GENERATING...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              GENERATE TELEGRAM LINK
            </>
          )}
        </button>
      )}
    </div>
  );
}

