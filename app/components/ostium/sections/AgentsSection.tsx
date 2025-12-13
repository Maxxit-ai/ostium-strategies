import { Brain, Globe, Radio } from "lucide-react";
import { AgentCard } from "../cards";
import { SectionHeader, SectionShell, Card, StatPill } from "../ui";
import { fonts, theme } from "../theme";

export function AgentsSection() {
  return (
    <SectionShell id="how-it-works" background={theme.surface} bordered>
      <SectionHeader
        eyebrow="HOW IT WORKS"
        title="Three Agents Build Your Trading Clone"
        description="Agent WHAT sources alpha, Agent HOW becomes you, Agent WHERE executes natively on Ostium."
      />

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <AgentCard
          name="Agent WHAT"
          role="Alpha Finder"
          icon={Radio}
          description="Pulls real-time signals from 47+ curated research, Twitter, and Telegram streams. Filters noise and routes only high conviction calls."
          features={[
            "47+ curated alpha sources",
            "Signal scoring + deduplication",
            "Context attached to each alert",
          ]}
        />
        <AgentCard
          name="Agent HOW"
          role="Your Trading Clone"
          icon={Brain}
          description="Learns your playbook—risk tolerance, sizing, timing—and mirrors those decisions automatically with zero drift."
          features={["Mirrors your risk rules", "Position sizing templates", "Continuously improves"]}
        />
        <AgentCard
          name="Agent WHERE"
          role="Ostium Executor"
          icon={Globe}
          description="Executes on Ostium with best-pair routing, gasless execution, and full non-custodial control preserved."
          features={["61 Ostium pairs", "Gasless routing", "Non-custodial controls"]}
        />
      </div>

      <Card>
        <p
          className="text-xs font-semibold tracking-[0.3em] text-center mb-4"
          style={{ color: theme.textMuted, letterSpacing: "0.3em", fontFamily: fonts.body }}
        >
          SIGNAL FLOW
        </p>
        <div className="grid md:grid-cols-4 gap-4 items-center">
          <StatPill label="Signal" value="Long XAU/USD" />
          <StatPill label="Sizing" value="5% | 3x" />
          <StatPill label="Route" value="Ostium Executor" />
          <StatPill label="Status" value="Live" />
        </div>
      </Card>
    </SectionShell>
  );
}

