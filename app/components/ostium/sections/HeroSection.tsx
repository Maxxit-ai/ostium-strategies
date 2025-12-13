"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, Card, hoverLiftClass } from "../ui";
import { fonts, theme } from "../theme";
import PixelBlast from "../PixelBlast";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden border-b"
      style={{ borderColor: theme.stroke, background: theme.bg }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#262625"
          patternScale={3}
          patternDensity={1.3}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>
      <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-20 text-center z-10">
        <div className="text-sm font-semibold tracking-[0.25em] mb-4" style={{ color: theme.textMuted }}>Build a strategy</div>
        <h1
          className="text-4xl md:text-5xl font-semibold mt-5 mb-6"
          style={{ color: theme.text, fontFamily: fonts.heading }}
        >
          Your Trading Clone
          <br />
          <span style={{ color: theme.primary }}>Built on Ostium</span>
        </h1>
        <p
          className="text-lg max-w-3xl mx-auto leading-relaxed mb-10"
          style={{ color: theme.text, fontFamily: fonts.body }}
        >
          An AI that mirrors your risk, sizing, and tempo. Fed by 47+ curated alpha
          sources and executes automatically on Ostium—without ever touching your keys.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="https://www.maxxit.ai/">
            <button
              className={`group flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold ${hoverLiftClass}`}
              style={{
                background: theme.primary,
                color: "#0B0603",
                fontFamily: fonts.heading,
                cursor: "pointer",
              }}
            >
              Create Your Trading Clone
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <button
            className={`flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border backdrop-blur-sm ${hoverLiftClass}`}
            style={{
              borderColor: theme.stroke,
              color: theme.text,
              fontFamily: fonts.heading,
              cursor: "pointer",
            }}
            onClick={() =>
              document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            How It Works
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { label: "Alpha Sources", value: "47+" },
            { label: "Avg Win Rate", value: "68%" },
            { label: "Ostium Pairs", value: "61" },
            { label: "Uptime", value: "99.9%" },
          ].map((stat) => (
            <Card key={stat.label} padding="p-4">
              <p
                className="text-2xl font-semibold"
                style={{ color: theme.primary, fontFamily: fonts.heading }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: theme.textMuted, fontFamily: fonts.body }}
              >
                {stat.label}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

