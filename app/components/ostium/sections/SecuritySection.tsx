import { Lock } from "lucide-react";
import { FeatureList } from "../ui";
import { Card, SectionHeader, SectionShell } from "../ui";
import { fonts, theme } from "../theme";

export function SecuritySection() {
  return (
    <SectionShell bordered>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <SectionHeader
            eyebrow="SECURITY"
            title="Non-Custodial by Design"
            description="Your funds never leave your wallet. Delegations are scoped and revocable at any moment."
          />
          <FeatureList
            items={[
              "Funds stay in your wallet",
              "Delegate trade only—never withdraw",
              "One-click revoke access",
              "Audited smart contracts",
            ]}
          />
        </div>
        <Card>
          <div className="text-center mb-5">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ background: theme.successSoft }}
            >
              <Lock className="w-7 h-7" style={{ color: theme.success }} />
            </div>
            <h3
              className="text-xl font-semibold mb-1"
              style={{ color: theme.text, fontFamily: fonts.heading }}
            >
              Your Keys, Your Crypto
            </h3>
            <p
              className="text-sm"
              style={{ color: theme.textMuted, fontFamily: fonts.body }}
            >
              We never touch your private keys.
            </p>
          </div>
          <div
            className="p-4 rounded-xl space-y-2"
            style={{ background: theme.surfaceAlt, border: `1px solid ${theme.stroke}` }}
          >
            <div className="flex justify-between text-sm" style={{ color: theme.textMuted }}>
              <span>Delegation</span>
              <span style={{ color: theme.success, fontFamily: fonts.body }}>Trade Only</span>
            </div>
            <div className="flex justify-between text-sm" style={{ color: theme.textMuted }}>
              <span>Withdrawals</span>
              <span style={{ color: "#EF4444", fontFamily: fonts.body }}>Blocked</span>
            </div>
            <div className="flex justify-between text-sm" style={{ color: theme.textMuted }}>
              <span>Control</span>
              <span style={{ color: theme.primary, fontFamily: fonts.body }}>You</span>
            </div>
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}

