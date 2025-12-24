/**
 * Trading Preferences Modal - Agent HOW Configuration
 * 
 * Allows users to personalize their trading behavior by setting preferences
 * These preferences adjust position sizing weights (Agent HOW layer)
 */

import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { X, Activity } from 'lucide-react';
import { Slider, SliderRange, SliderThumb, SliderTrack } from '@radix-ui/react-slider';
import { theme, fonts } from '../ostium/theme';

export interface TradingPreferences {
  risk_tolerance: number;
  trade_frequency: number;
  social_sentiment_weight: number;
  price_momentum_focus: number;
  market_rank_priority: number;
}

interface TradingPreferencesModalProps {
  userWallet: string;
  onClose: () => void;
  onSave?: () => void;
  onBack?: () => void;
  /**
   * If true, preferences are returned via onSaveLocal instead of being saved to API.
   * Used when we want to collect preferences but save them later (e.g., after approvals)
   */
  localOnly?: boolean;
  /**
   * Callback when localOnly is true - returns preferences without saving to API
   */
  onSaveLocal?: (preferences: TradingPreferences) => void;
  /**
   * Initial preferences to pre-populate the form
   */
  initialPreferences?: TradingPreferences;
  /**
   * Override primary button label (defaults based on mode)
   */
  primaryLabel?: string;
}

/**
 * Core trading preferences form UI + logic.
 * Can be embedded inside other flows (e.g. OstiumConnect) without creating a new modal layer.
 */
export function TradingPreferencesForm({
  userWallet,
  onClose,
  onSave,
  onBack,
  localOnly = false,
  onSaveLocal,
  initialPreferences,
  primaryLabel,
}: TradingPreferencesModalProps) {
  const [preferences, setPreferences] = useState<TradingPreferences>(
    initialPreferences || {
      risk_tolerance: 50,
      trade_frequency: 50,
      social_sentiment_weight: 50,
      price_momentum_focus: 50,
      market_rank_priority: 50,
    }
  );
  const [loading, setLoading] = useState(!localOnly && !initialPreferences);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Only load from API if not in localOnly mode and no initial preferences provided
    if (!localOnly && !initialPreferences) {
      loadPreferences();
    }
  }, [userWallet, localOnly, initialPreferences]);

  const loadPreferences = async () => {
    try {
      const response = await fetch(`/api/user/trading-preferences?wallet=${userWallet}`);
      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          // Ensure all values default to 50 if missing
          setPreferences({
            risk_tolerance: data.preferences.risk_tolerance ?? 50,
            trade_frequency: data.preferences.trade_frequency ?? 50,
            social_sentiment_weight: data.preferences.social_sentiment_weight ?? 50,
            price_momentum_focus: data.preferences.price_momentum_focus ?? 50,
            market_rank_priority: data.preferences.market_rank_priority ?? 50,
          });
        }
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Force blur on any focused input to commit pending changes
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Small delay to ensure blur event completes
    await new Promise(resolve => setTimeout(resolve, 50));

    setSaving(true);
    setError('');

    try {
      // If localOnly mode, just return preferences via callback without saving to API
      if (localOnly) {
        console.log('[TradingPreferencesModal] Saving preferences:', preferences);
        if (onSaveLocal) {
          onSaveLocal(preferences);
          // Don't call onClose() here - onSaveLocal will handle closing the modal
          // Calling onClose() causes the fallback handler to trigger and reset to defaults
        } else {
          // Only close if there's no callback (shouldn't happen)
          onClose();
        }
        return;
      }

      // Otherwise, save to API as usual
      const response = await fetch('/api/user/trading-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userWallet,
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      if (onSave) {
        onSave();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getLabel = (value: number) => {
    if (value < 33) return 'Low';
    if (value < 67) return 'Medium';
    return 'High';
  };

  const getMomentumLabel = (value: number) => {
    if (value < 33) return 'Contrarian';
    if (value < 67) return 'Balanced';
    return 'Momentum';
  };

  const getFrequencyLabel = (value: number) => {
    if (value < 33) return 'Patient';
    if (value < 67) return 'Moderate';
    return 'Active';
  };

  const getRankLabel = (value: number) => {
    if (value < 33) return 'Any Coin';
    if (value < 67) return 'Balanced';
    return 'Top Only';
  };

  const SliderRow = ({
    title,
    helper,
    value,
    onChange,
    left,
    right,
    badge,
    description,
  }: {
    title: string;
    helper: string;
    value: number;
    onChange: (val: number) => void;
    left: string;
    right: string;
    badge: string;
    description: string;
  }) => {
    const [inputValue, setInputValue] = useState(value.toString());
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const sliderRowRef = useRef<HTMLDivElement>(null);

    // Only sync input with slider value when input is not focused
    useEffect(() => {
      if (!isInputFocused) {
        setInputValue(value.toString());
      }
      if (!isDragging) {
        setTempValue(value);
      }
    }, [value, isInputFocused, isDragging]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      // Allow empty string or valid numbers with optional decimals
      if (val === '' || /^\d*\.?\d*$/.test(val)) {
        setInputValue(val);
      }
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsInputFocused(true);
      // Prevent browser from scrolling input into view
      e.target.scrollIntoView = () => { };
    };

    const handleInputBlur = () => {
      setIsInputFocused(false);

      // Preserve scroll position before state update
      const container = scrollContainerRef.current;
      const scrollPosition = container?.scrollTop ?? 0;
      const activeElement = document.activeElement as HTMLElement;
      const elementPosition = sliderRowRef.current?.offsetTop ?? 0;

      // Validate and correct on blur
      const num = parseFloat(inputValue);
      if (isNaN(num) || num < 0 || inputValue === '') {
        onChange(0);
        setInputValue('0');
      } else if (num > 100) {
        onChange(100);
        setInputValue('100');
      } else {
        const rounded = Math.round(num);
        onChange(rounded);
        setInputValue(rounded.toString());
      }

      // Restore scroll position after state update
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = scrollPosition;
        }
        // Prevent focus from causing scroll
        if (activeElement && activeElement !== document.body) {
          activeElement.blur();
        }
      });
    };

    return (
      <div
        ref={sliderRowRef}
        className="border p-5 space-y-4 rounded-lg"
        style={{
          borderColor: theme.primaryBorder,
          background: theme.primarySoft,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-bold" style={{ color: theme.text, fontFamily: fonts.heading }}>
              {title}
            </h3>
            <p className="text-xs mt-1" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              {helper}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-bold uppercase px-2 py-1 rounded"
              style={{
                color: theme.primary,
                background: theme.primarySoft,
                fontFamily: fonts.body,
              }}
            >
              {badge}
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={(e) => {
                handleInputFocus(e);
                e.currentTarget.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                handleInputBlur();
                e.currentTarget.style.borderColor = theme.primaryBorder;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleInputBlur();
                  e.currentTarget.blur();
                }
              }}
              className="w-16 px-2 py-1.5 text-center border-2 font-mono font-bold text-sm rounded focus:outline-none transition-colors"
              style={{
                borderColor: theme.primaryBorder,
                background: theme.bg,
                color: theme.primary,
                fontFamily: fonts.body,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
              }}
              onMouseLeave={(e) => {
                if (document.activeElement !== e.currentTarget) {
                  e.currentTarget.style.borderColor = theme.primaryBorder;
                }
              }}
              placeholder="0-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs px-1 font-medium" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
            <span>{left}</span>
            <span>{right}</span>
          </div>

          <Slider
            className="relative flex items-center select-none touch-none w-full h-12 group cursor-pointer"
            value={[tempValue]}
            onValueChange={(vals) => {
              const v = Math.min(100, Math.max(0, vals[0]));
              setTempValue(v);
              setIsDragging(true);
              if (!isInputFocused) {
                setInputValue(Math.round(v).toString());
              }
            }}
            onValueCommit={(vals) => {
              const v = Math.min(100, Math.max(0, vals[0]));
              const rounded = Math.round(v);

              // Preserve scroll position when committing slider value
              const container = scrollContainerRef.current;
              const scrollPosition = container?.scrollTop ?? 0;

              onChange(rounded);
              setTempValue(rounded);
              setIsDragging(false);

              // Restore scroll position after state update
              requestAnimationFrame(() => {
                if (container) {
                  container.scrollTop = scrollPosition;
                }
              });
            }}
            max={100}
            min={0}
            step={0.1}
            draggable={true}
          >
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(to right, ${theme.primary}15, transparent, ${theme.primary}10)`,
              }}
            />
            <SliderTrack
              className="relative grow rounded-full h-3 cursor-pointer transition-colors shadow-inner overflow-hidden"
              style={{
                background: `${theme.textMuted}60`,
              }}
            >
              <SliderRange
                className="absolute h-full rounded-full"
                style={{
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.primary}60)`,
                  boxShadow: `0 0 10px rgba(0,0,0,0.45)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-60 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 10% 50%, rgba(255,255,255,0.18), transparent 35%), radial-gradient(circle at 90% 50%, rgba(255,255,255,0.18), transparent 35%)`,
                }}
              />
            </SliderTrack>
            <SliderThumb
              className="relative flex items-center justify-center w-10 h-10 text-[11px] font-bold border-[3px] rounded-full hover:scale-110 focus:outline-none transition-all duration-150 cursor-grab active:cursor-grabbing active:scale-105 shadow-xl"
              style={{
                background: theme.primary,
                color: theme.bg,
                borderColor: theme.bg,
                fontFamily: fonts.heading,
              }}
              aria-label={title}
            >
              {Math.round(tempValue)}
            </SliderThumb>
          </Slider>

          <div className="flex justify-between text-xs px-1 font-mono" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        <p className="text-xs leading-relaxed" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
          {description}
        </p>
      </div>
    );
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Helper function to preserve scroll position during state updates
  const preserveScrollPosition = (callback: () => void) => {
    const container = scrollContainerRef.current;
    const scrollPosition = container?.scrollTop ?? 0;

    callback();

    // Restore scroll position after state update
    requestAnimationFrame(() => {
      if (container) {
        container.scrollTop = scrollPosition;
      }
    });
  };

  return (
    <div
      ref={scrollContainerRef}
      className="p-6 space-y-4 overflow-y-auto flex-1 modal-scrollable"
      style={{
        overscrollBehavior: 'contain',
        background: theme.bg,
      }}
      onWheel={(e) => {
        const target = e.currentTarget;
        const isAtTop = target.scrollTop === 0;
        const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 1;

        if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
          e.stopPropagation();
        }
      }}
    >
      {loading ? (
        <div className="text-center py-10 space-y-3">
          <Activity className="h-10 w-10 mx-auto animate-pulse" style={{ color: theme.primary }} />
          <p className="text-sm" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
            Loading preferences...
          </p>
        </div>
      ) : (
        <>
          <SliderRow
            title="Risk Tolerance"
            helper="How aggressive should sizing be?"
            value={preferences.risk_tolerance}
            onChange={(v) => preserveScrollPosition(() => setPreferences({ ...preferences, risk_tolerance: v }))}
            left="Conservative"
            right="Aggressive"
            badge={getLabel(preferences.risk_tolerance)}
            description={
              preferences.risk_tolerance < 33
                ? 'Smaller positions (0.5-3% of balance)'
                : preferences.risk_tolerance < 67
                  ? 'Moderate positions (2-7% of balance)'
                  : 'Larger positions (5-10% of balance)'
            }
          />

          <SliderRow
            title="Trade Frequency"
            helper="How often to take trades?"
            value={preferences.trade_frequency}
            onChange={(v) => preserveScrollPosition(() => setPreferences({ ...preferences, trade_frequency: v }))}
            left="Patient"
            right="Active"
            badge={getFrequencyLabel(preferences.trade_frequency)}
            description={
              preferences.trade_frequency < 33
                ? 'Only high-confidence signals (>60%)'
                : preferences.trade_frequency < 67
                  ? 'Moderate confidence (>40%)'
                  : 'Most signals, including lower confidence'
            }
          />

          <SliderRow
            title="Social Sentiment Impact"
            helper="Weight social media sentiment"
            value={preferences.social_sentiment_weight}
            onChange={(v) => preserveScrollPosition(() => setPreferences({ ...preferences, social_sentiment_weight: v }))}
            left="Ignore"
            right="Follow"
            badge={getLabel(preferences.social_sentiment_weight)}
            description={
              preferences.social_sentiment_weight < 33
                ? 'Minimal impact on sizing'
                : preferences.social_sentiment_weight < 67
                  ? 'Balanced consideration of social signals'
                  : 'Strong weight on social buzz'
            }
          />

          <SliderRow
            title="Price Momentum Strategy"
            helper="Trend follow or contrarian?"
            value={preferences.price_momentum_focus}
            onChange={(v) => preserveScrollPosition(() => setPreferences({ ...preferences, price_momentum_focus: v }))}
            left="Contrarian"
            right="Momentum"
            badge={getMomentumLabel(preferences.price_momentum_focus)}
            description={
              preferences.price_momentum_focus < 33
                ? 'Prefer buying dips / fading rallies'
                : preferences.price_momentum_focus < 67
                  ? 'Balanced approach to price action'
                  : 'Follow strong trends and momentum'
            }
          />

          <SliderRow
            title="Market Cap Preference"
            helper="Focus on large caps or any token"
            value={preferences.market_rank_priority}
            onChange={(v) => preserveScrollPosition(() => setPreferences({ ...preferences, market_rank_priority: v }))}
            left="Any Coin"
            right="Top Only"
            badge={getRankLabel(preferences.market_rank_priority)}
            description={
              preferences.market_rank_priority < 33
                ? 'Trade any token regardless of market cap'
                : preferences.market_rank_priority < 67
                  ? 'Slight preference for established tokens'
                  : 'Strong preference for top-ranked, liquid tokens'
            }
          />

          <div
            className="border p-4"
            style={{
              borderColor: theme.primaryBorder,
              background: theme.primarySoft,
            }}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              HOW THIS WORKS
            </p>
            <ul className="text-xs space-y-1" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              <li>• Preferences adjust position sizing weights (Agent HOW)</li>
              <li>• Combines with LLM classification and LunarCrush data</li>
              <li>• Creates a personalized trade profile across deployments</li>
            </ul>
          </div>

          {error && (
            <div
              className="border p-3 text-sm"
              style={{
                borderColor: theme.primary,
                background: theme.primarySoft,
                color: theme.primary,
                fontFamily: fonts.body,
              }}
            >
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 cursor-pointer py-3 border font-semibold transition-colors"
                style={{
                  borderColor: theme.primaryBorder,
                  color: theme.text,
                  fontFamily: fonts.heading,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.primaryBorder;
                }}
                type="button"
              >
                Back
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 cursor-pointer py-3 font-bold transition-colors disabled:opacity-50"
              style={{
                background: theme.primary,
                color: theme.bg,
                fontFamily: fonts.heading,
              }}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4 animate-spin" /> Saving...
                </span>
              ) : (
                primaryLabel || (localOnly ? 'Save & Continue' : 'Save Preferences')
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Modal wrapper around `TradingPreferencesForm`.
 * Keeps existing API for places that still want a standalone modal.
 */
export function TradingPreferencesModal(props: TradingPreferencesModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div
        className="max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        style={{
          background: theme.bg,
          border: `1px solid ${theme.primary}`,
        }}
      >
        <div
          className="border-b p-6 flex items-center justify-between shrink-0"
          style={{
            borderColor: theme.primary,
          }}
        >
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              AGENT HOW
            </p>
            <h2 className="text-2xl" style={{ color: theme.primary, fontFamily: fonts.heading }}>
              Trading Preferences
            </h2>
            <p className="text-sm" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
              Tune your sizing and filters
            </p>
          </div>
          <button
            onClick={props.onClose}
            className="p-2 transition-colors cursor-pointer"
            style={{
              color: theme.textMuted,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.textMuted;
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <TradingPreferencesForm {...props} />
      </div>
    </div>
  );
}

