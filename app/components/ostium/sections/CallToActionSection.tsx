import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";
import { Badge, SectionShell, hoverLiftClass } from "../ui";
import { fonts, theme } from "../theme";

export function CallToActionSection() {
  return (
    <SectionShell background={theme.surface}>
      <div className="max-w-3xl mx-auto text-center">
        <Badge label="Start now" icon={Bot} />
        <h2
          className="text-4xl font-semibold mt-5 mb-4"
          style={{ color: theme.text, fontFamily: fonts.heading }}
        >
          Ready to Deploy Your Trading Clone?
        </h2>
        <p
          className="text-xl mb-10 leading-relaxed"
          style={{ color: theme.textMuted, fontFamily: fonts.body }}
        >
          Set your risk profile, connect your wallet, approve delegation, and let your clone
          trade non-stop on Ostium.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
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
              <Bot className="w-5 h-5" />
              Create Your Trading Clone
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="https://www.maxxit.ai/docs">
            <button
              className={`px-8 py-4 rounded-xl text-lg font-semibold border ${hoverLiftClass}`}
              style={{
                borderColor: theme.stroke,
                color: theme.text,
                fontFamily: fonts.heading,
                cursor: "pointer",
              }}
            >
              Read Documentation
            </button>
          </Link>
        </div>
        <p
          className="mt-8 text-sm"
          style={{ color: theme.textMuted, fontFamily: fonts.body }}
        >
          Non-custodial • You stay in control • Cancel anytime
        </p>
      </div>
    </SectionShell>
  );
}

