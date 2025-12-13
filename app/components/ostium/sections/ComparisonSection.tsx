import { Card, SectionHeader, SectionShell } from "../ui";
import { ComparisonRow } from "../cards";
import { fonts, theme } from "../theme";

export function ComparisonSection() {
  return (
    <SectionShell bordered>
      <SectionHeader
        eyebrow="WHY A TRADING CLONE?"
        title="You Trade vs Your Trading Clone"
        description="Human intuition meets automated discipline. Stay in control while your clone executes flawlessly."
      />

      <Card padding="p-0">
        <div
          className="grid grid-cols-3 gap-4 p-4 border-b rounded-t-2xl"
          style={{ borderColor: theme.stroke, background: theme.surfaceAlt }}
        >
          <div
            className="text-sm font-semibold"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            Feature
          </div>
          <div
            className="text-sm font-semibold text-center"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            You Trade
          </div>
          <div
            className="text-sm font-semibold text-center"
            style={{ color: theme.primary, fontFamily: fonts.body }}
          >
            Your Trading Clone
          </div>
        </div>

        <div className="p-4">
          <ComparisonRow feature="Alpha Sources" manual="Your research only" ai="47+ curated sources" />
          <ComparisonRow feature="Position Sizing" manual="Manual judgement" ai="Your rules, automated" />
          <ComparisonRow feature="Trading Hours" manual="When awake" ai="24/7 with zero misses" />
          <ComparisonRow feature="Emotion" manual="Fear & greed" ai="Disciplined execution" />
          <ComparisonRow feature="Ostium Pairs" manual="Pairs you monitor" ai="Full 61 pair coverage" />
          <ComparisonRow feature="Execution" manual="Manual clicks" ai="Instant, gasless on Ostium" />
        </div>
      </Card>
    </SectionShell>
  );
}

