"use client";

import { Wallet, Send, Sliders, Shield, Check, Sparkles } from "lucide-react";
import { theme, fonts } from "../ostium/theme";

// Step order: wallet → ostium → preferences → telegram → complete
export type Step = "wallet" | "ostium" | "preferences" | "telegram" | "complete";

interface ProgressStepsProps {
  currentStep: Step;
}

const steps = [
  { id: "wallet" as Step, label: "Wallet", icon: Wallet },
  { id: "ostium" as Step, label: "1-Click CT", icon: Shield },
  { id: "preferences" as Step, label: "Preferences", icon: Sliders },
  { id: "telegram" as Step, label: "Telegram", icon: Send },
  { id: "complete" as Step, label: "Complete", icon: Sparkles },
];

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="mb-10">
      {/* Steps Container */}
      <div className="flex items-center justify-between">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isCompleted = index < currentStepIndex;
          const isCurrent = s.id === currentStep;

          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-initial">
              {/* Step Item */}
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: isCompleted
                      ? theme.primary
                      : isCurrent
                        ? theme.primarySoft
                        : theme.surfaceAlt,
                    border: `2px solid ${isCompleted || isCurrent ? theme.primary : theme.stroke
                      }`,
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" style={{ color: theme.bg }} />
                  ) : (
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color: isCurrent ? theme.primary : theme.textMuted,
                      }}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className="mt-2 text-xs hidden sm:block"
                  style={{
                    color: isCompleted
                      ? theme.primary
                      : isCurrent
                        ? theme.text
                        : theme.textMuted,
                    fontFamily: fonts.body,
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-4 sm:mb-5`}
                  style={{
                    background:
                      index < currentStepIndex ? theme.primary : theme.stroke,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Info */}
      <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: `1px solid ${theme.stroke}` }}>
        <span className="text-xs" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
          Step {currentStepIndex + 1} of {steps.length}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: theme.stroke }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                background: theme.primary,
              }}
            />
          </div>
          <span className="text-xs" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
            {Math.round((currentStepIndex / (steps.length - 1)) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
