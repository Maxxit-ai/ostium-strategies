"use client";

import { useState } from "react";
import {
  Zap,
  MessageCircle,
  Brain,
  TrendingUp,
  ArrowRight,
  Coffee,
  Moon,
  Gamepad2,
  Shield,
  Clock,
  Target,
  Sparkles,
  Send,
  ChevronRight,
} from "lucide-react";
import { theme, fonts } from "../ostium/theme";
import { hoverLiftClass, Card } from "../ostium/ui";

interface LazyTradingLandingProps {
  onGetStarted: () => void;
}

export function LazyTradingLanding({ onGetStarted }: LazyTradingLandingProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const workflowSteps = [
    {
      icon: MessageCircle,
      title: "Send a Signal",
      description: "Text your trade idea to Telegram. No charts, no dashboards.",
      example: '"Buy BTC if market looks bullish"',
      color: "#0088cc",
    },
    {
      icon: Brain,
      title: "AI Analyzes",
      description: "Agent validates your signal with market data and context.",
      example: "Checks sentiment, technicals, risk factors",
      color: theme.primary,
    },
    {
      icon: TrendingUp,
      title: "Auto Execute",
      description: "Trade is sized to your preferences and executed on Ostium.",
      example: "Risk-managed, 24/7 monitoring",
      color: theme.success,
    },
  ];

  const useCases = [
    {
      icon: Coffee,
      title: "Morning Alpha",
      description: "Forward that interesting tweet before your coffee gets cold. Agent handles the rest.",
    },
    {
      icon: Gamepad2,
      title: "Gaming Session",
      description: "Friend shares a hot tip? Text it to the bot. Never pause your game.",
    },
    {
      icon: Moon,
      title: "Late Night Insight",
      description: "Great trade idea at 2am? Send it and sleep. Agent watches the position.",
    },
  ];

  const benefits = [
    { icon: Clock, label: "Save hours of chart-watching" },
    { icon: Target, label: "Never miss a trade idea" },
    { icon: Shield, label: "Non-custodial & secure" },
    { icon: Sparkles, label: "Your style, automated" },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${theme.primarySoft} 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: theme.primarySoft,
              border: `1px solid ${theme.primaryBorder}`,
            }}
          >
            <Zap className="w-4 h-4" style={{ color: theme.primary }} />
            <span
              className="text-sm font-semibold"
              style={{ color: theme.primary, fontFamily: fonts.heading }}
            >
              LAZY TRADING
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ color: theme.text, fontFamily: fonts.heading }}
          >
            Trade with a<br />
            <span
              className="relative"
              style={{
                background: `linear-gradient(135deg, ${theme.primary} 0%, #FF8C5A 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Telegram Message
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            Got an alpha? Just text it. Your AI agent analyzes, validates,
            and executes—while you live your life.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button
              onClick={onGetStarted}
              className={`group flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold ${hoverLiftClass}`}
              style={{
                background: theme.primary,
                color: theme.bg,
                fontFamily: fonts.heading,
                cursor: "pointer",
              }}
            >
              <Zap className="w-5 h-5" />
              Start Trading Lazy
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://www.maxxit.ai/blog"
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border ${hoverLiftClass}`}
              style={{
                borderColor: theme.stroke,
                color: theme.text,
                fontFamily: fonts.heading,
                cursor: "pointer",
              }}
            >
              Read the Blog
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Quick benefits */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <benefit.icon className="w-4 h-4" style={{ color: theme.primary }} />
                <span
                  className="text-sm"
                  style={{ color: theme.textMuted, fontFamily: fonts.body }}
                >
                  {benefit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="py-20 border-t border-b"
        style={{ borderColor: theme.stroke, background: theme.surface }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p
              className="text-xs font-semibold tracking-[0.3em] mb-4"
              style={{ color: theme.textMuted }}
            >
              HOW IT WORKS
            </p>
            <h2
              className="text-3xl md:text-4xl font-semibold mb-4"
              style={{ color: theme.text, fontFamily: fonts.heading }}
            >
              Three Steps. Zero Effort.
            </h2>
            <p
              className="text-lg max-w-xl mx-auto"
              style={{ color: theme.textMuted, fontFamily: fonts.body }}
            >
              From idea to execution without opening a single chart
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="relative">
            {/* Connection line */}
            <div
              className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5"
              style={{ background: theme.stroke }}
            />

            <div className="grid md:grid-cols-3 gap-8">
              {workflowSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <div
                    className={`p-8 rounded-2xl border transition-all duration-300 ${
                      hoveredStep === idx ? "transform -translate-y-2" : ""
                    }`}
                    style={{
                      background: hoveredStep === idx ? theme.surfaceAlt : theme.bg,
                      borderColor: hoveredStep === idx ? theme.primaryBorder : theme.stroke,
                      boxShadow:
                        hoveredStep === idx
                          ? "0 25px 50px rgba(0,0,0,0.4)"
                          : "none",
                    }}
                  >
                    {/* Step number */}
                    <div
                      className="absolute -top-3 left-8 px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: theme.primary,
                        color: theme.bg,
                        fontFamily: fonts.heading,
                      }}
                    >
                      {idx + 1}
                    </div>

                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                      style={{
                        background: `${step.color}20`,
                        border: `1px solid ${step.color}40`,
                      }}
                    >
                      <step.icon className="w-7 h-7" style={{ color: step.color }} />
                    </div>

                    <h3
                      className="text-xl font-semibold mb-3"
                      style={{ color: theme.text, fontFamily: fonts.heading }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm mb-4 leading-relaxed"
                      style={{ color: theme.textMuted, fontFamily: fonts.body }}
                    >
                      {step.description}
                    </p>

                    {/* Example */}
                    <div
                      className="px-4 py-3 rounded-lg text-xs italic"
                      style={{
                        background: theme.surfaceAlt,
                        color: theme.textMuted,
                        fontFamily: fonts.body,
                      }}
                    >
                      {step.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Case Example */}
      <section className="py-20" style={{ background: theme.bg }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Chat Mockup */}
            <div
              className="p-6 rounded-2xl border order-2 lg:order-1"
              style={{ background: theme.surface, borderColor: theme.stroke }}
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: theme.stroke }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "#0088cc" }}
                >
                  <Send className="w-5 h-5" style={{ color: "white" }} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: theme.text, fontFamily: fonts.heading }}>
                    Maxxit Trading Bot
                  </p>
                  <p className="text-xs" style={{ color: theme.textMuted }}>Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div
                    className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md"
                    style={{ background: theme.primary }}
                  >
                    <p className="text-sm" style={{ color: theme.bg, fontFamily: fonts.body }}>
                      Hey buy BTC now if the market looks bullish and close with good profit 📈
                    </p>
                  </div>
                </div>

                {/* Bot analyzing */}
                <div className="flex justify-start">
                  <div
                    className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md"
                    style={{ background: theme.surfaceAlt, border: `1px solid ${theme.stroke}` }}
                  >
                    <p className="text-sm" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
                      <span style={{ color: theme.primary }}>🔍 Analyzing signal...</span>
                    </p>
                  </div>
                </div>

                {/* Bot response */}
                <div className="flex justify-start">
                  <div
                    className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md"
                    style={{ background: theme.surfaceAlt, border: `1px solid ${theme.stroke}` }}
                  >
                    <div className="text-sm space-y-2" style={{ color: theme.text, fontFamily: fonts.body }}>
                      <p style={{ color: theme.success }}>✅ Signal validated</p>
                      <p>Market sentiment: Bullish</p>
                      <p>Opening LONG on BTC/USD</p>
                      <p>Size: $250 (your risk setting)</p>
                      <p className="text-xs" style={{ color: theme.textMuted }}>Monitoring for exit...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p
                className="text-xs font-semibold tracking-[0.3em] mb-4"
                style={{ color: theme.textMuted }}
              >
                REAL EXAMPLE
              </p>
              <h2
                className="text-3xl md:text-4xl font-semibold mb-6"
                style={{ color: theme.text, fontFamily: fonts.heading }}
              >
                Trade While Living<br />
                <span style={{ color: theme.primary }}>Your Life</span>
              </h2>
              <p
                className="text-lg mb-8 leading-relaxed"
                style={{ color: theme.textMuted, fontFamily: fonts.body }}
              >
                You're watching the game. Your friend shares a tip. Instead of
                rushing to open charts and set up the trade, just forward it to
                the bot. Done.
              </p>

              {/* Use case cards */}
              <div className="space-y-4">
                {useCases.map((useCase, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-xl border transition-colors"
                    style={{
                      borderColor: theme.stroke,
                      background: theme.surfaceAlt,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: theme.primarySoft }}
                    >
                      <useCase.icon className="w-5 h-5" style={{ color: theme.primary }} />
                    </div>
                    <div>
                      <p
                        className="font-semibold mb-1"
                        style={{ color: theme.text, fontFamily: fonts.heading }}
                      >
                        {useCase.title}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: theme.textMuted, fontFamily: fonts.body }}
                      >
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section
        className="py-16 border-t"
        style={{ borderColor: theme.stroke, background: theme.surface }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="p-8 rounded-2xl border text-center"
            style={{
              background: theme.bg,
              borderColor: theme.stroke,
            }}
          >
            <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: theme.success }} />
            <h3
              className="text-2xl font-semibold mb-3"
              style={{ color: theme.text, fontFamily: fonts.heading }}
            >
              Your Funds Stay Yours
            </h3>
            <p
              className="text-lg mb-6 max-w-xl mx-auto"
              style={{ color: theme.textMuted, fontFamily: fonts.body }}
            >
              Non-custodial trading. The agent can only execute trades—never
              withdraw. Revoke access anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                "Agent cannot withdraw",
                "Funds in your wallet",
                "Revoke anytime",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{ background: theme.successSoft }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: theme.success }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: theme.success, fontFamily: fonts.body }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20" style={{ background: theme.bg }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: theme.primarySoft, border: `1px solid ${theme.primaryBorder}` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: theme.primary }} />
            <span className="text-sm" style={{ color: theme.primary, fontFamily: fonts.body }}>
              Setup takes 3 minutes
            </span>
          </div>

          <h2
            className="text-3xl md:text-5xl font-bold mb-6"
            style={{ color: theme.text, fontFamily: fonts.heading }}
          >
            Ready to Trade<br />
            <span style={{ color: theme.primary }}>the Lazy Way?</span>
          </h2>

          <p
            className="text-lg mb-10 max-w-xl mx-auto"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            Connect your wallet, link Telegram, set your preferences.
            Start sending signals.
          </p>

          <button
            onClick={onGetStarted}
            className={`group inline-flex items-center gap-3 px-10 py-5 rounded-xl text-xl font-bold ${hoverLiftClass}`}
            style={{
              background: theme.primary,
              color: theme.bg,
              fontFamily: fonts.heading,
              cursor: "pointer",
            }}
          >
            <Zap className="w-6 h-6" />
            Get Started Now
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}

