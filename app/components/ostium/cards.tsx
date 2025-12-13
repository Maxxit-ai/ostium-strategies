import type { IconType } from "./theme";
import { fonts, theme } from "./theme";
import { Badge, Card, FeatureList } from "./ui";

export function AgentCard({
  name,
  role,
  description,
  icon: Icon,
  features,
}: {
  name: string;
  role: string;
  description: string;
  icon: IconType;
  features: string[];
}) {
  return (
    <Card interactive>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: theme.primarySoft,
              border: `1px solid ${theme.primaryBorder}`,
            }}
          >
            <Icon className="w-6 h-6" style={{ color: theme.primary }} />
          </div>
          <div>
            <p
              className="text-xs font-semibold tracking-wide mb-1"
              style={{ color: theme.primary, fontFamily: fonts.body }}
            >
              {role}
            </p>
            <h3
              className="text-xl font-semibold"
              style={{ color: theme.text, fontFamily: fonts.heading }}
            >
              {name}
            </h3>
          </div>
        </div>
        <Badge label="Live" tone="success" />
      </div>

      <p
        className="text-sm leading-relaxed mb-5"
        style={{ color: theme.textMuted, fontFamily: fonts.body }}
      >
        {description}
      </p>

      <FeatureList items={features} />
    </Card>
  );
}

export function AlphaSourceCard({
  type,
  name,
  description,
  icon: Icon,
  signalCount,
}: {
  type: string;
  name: string;
  description: string;
  icon: IconType;
  signalCount: number;
}) {
  return (
    <Card padding="p-5" interactive>
      <div className="flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: theme.primarySoft,
            border: `1px solid ${theme.primaryBorder}`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color: theme.primary }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge label={type} tone="primary" />
            <Badge label={`${signalCount} signals/mo`} tone="muted" />
          </div>
          <p
            className="font-semibold truncate"
            style={{ color: theme.text, fontFamily: fonts.heading }}
          >
            {name}
          </p>
          <p
            className="text-sm"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function ComparisonRow({
  feature,
  manual,
  ai,
}: {
  feature: string;
  manual: string;
  ai: string;
}) {
  return (
    <div
      className="grid grid-cols-3 gap-4 py-4 border-b last:border-none"
      style={{ borderColor: theme.stroke }}
    >
      <div
        className="text-sm font-medium"
        style={{ color: theme.text, fontFamily: fonts.body }}
      >
        {feature}
      </div>
      <div
        className="text-sm text-center"
        style={{ color: theme.textMuted, fontFamily: fonts.body }}
      >
        {manual}
      </div>
      <div
        className="text-sm text-center font-semibold"
        style={{ color: theme.primary, fontFamily: fonts.body }}
      >
        {ai}
      </div>
    </div>
  );
}

