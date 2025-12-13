import { FileText, LineChart, MessageSquare, Radio } from "lucide-react";
import { AlphaSourceCard } from "../cards";
import { SectionHeader, SectionShell } from "../ui";
import { fonts, theme } from "../theme";

export function AlphaSourcesSection() {
  return (
    <SectionShell bordered>
      <SectionHeader
        eyebrow="ALPHA SOURCES"
        title="Intelligence From 47+ Streams"
        description="Curated feeds across research, social, and premium communities with freshness scoring baked in."
      />

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <AlphaSourceCard
          type="Research"
          name="DeFi Research Institute"
          description="Institutional-grade macro + DeFi quant calls."
          icon={FileText}
          signalCount={12}
        />
        <AlphaSourceCard
          type="Twitter"
          name="@MacroAlpha"
          description="RWA and forex signals with on-chain context."
          icon={MessageSquare}
          signalCount={28}
        />
        <AlphaSourceCard
          type="Telegram"
          name="Gold & Commodities Pro"
          description="Premium commodity momentum alerts."
          icon={Radio}
          signalCount={18}
        />
        <AlphaSourceCard
          type="Research"
          name="Crypto Quant Lab"
          description="Quant-driven crypto pairs coverage."
          icon={LineChart}
          signalCount={35}
        />
      </div>

      <p
        className="text-sm text-center"
        style={{ color: theme.textMuted, fontFamily: fonts.body }}
      >
        +43 more sources spanning forex, commodities, indices, and crypto.
      </p>
    </SectionShell>
  );
}

