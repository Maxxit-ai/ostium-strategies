import { Bot, Shield, Target, TrendingUp } from "lucide-react";
import { Card, SectionHeader, SectionShell } from "../ui";
import { fonts, theme } from "../theme";

const stats = [
  { label: "Avg 30D Return", value: "+47%", icon: TrendingUp },
  { label: "Win Rate", value: "68%", icon: Target },
  { label: "Max Drawdown", value: "-12%", icon: Shield },
  { label: "Active Clones", value: "156", icon: Bot },
];

export function PerformanceSection() {
  return (
    <SectionShell background={theme.surface} bordered>
      <SectionHeader eyebrow="PERFORMANCE" title="Results That Speak" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="p-5">
            <stat.icon className="w-6 h-6 mb-3" style={{ color: theme.primary }} />
            <p
              className="text-3xl font-semibold mb-1"
              style={{ color: theme.text, fontFamily: fonts.heading }}
            >
              {stat.value}
            </p>
            <p
              className="text-sm"
              style={{ color: theme.textMuted, fontFamily: fonts.body }}
            >
              {stat.label}
            </p>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

