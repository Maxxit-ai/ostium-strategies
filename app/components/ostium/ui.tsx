import { useState } from "react";
import type { ReactNode } from "react";
import { fonts, theme } from "./theme";
import type { IconType } from "./theme";

export const hoverLiftClass =
  "transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]";

export function SectionShell({
  id,
  children,
  background,
  bordered = false,
}: {
  id?: string;
  children: ReactNode;
  background?: string;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-16 ${bordered ? "border-b" : ""}`}
      style={{
        background: background ?? "transparent",
        borderColor: theme.stroke,
      }}
    >
      <div className="max-w-6xl mx-auto px-6">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center mb-12 max-w-3xl mx-auto">
      <p
        className="text-xs font-semibold tracking-[0.25em] mb-4"
        style={{ color: theme.textMuted, letterSpacing: "0.25em" }}
      >
        {eyebrow}
      </p>
      <h2
        className="text-3xl md:text-4xl font-semibold mb-4"
        style={{ color: theme.text, fontFamily: fonts.heading }}
      >
        {title}
      </h2>
      {description ? (
        <p
          className="text-lg leading-relaxed"
          style={{ color: theme.textMuted, fontFamily: fonts.body }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  as = "div",
  interactive,
  padding = "p-6",
}: {
  children: ReactNode;
  as?: React.ElementType;
  interactive?: boolean;
  padding?: string;
}) {
  const Component = as;
  const [hovered, setHovered] = useState(false);
  const className = [
    padding,
    "rounded-2xl transition-all",
    interactive ? "hover:-translate-y-1" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      style={{
        background: hovered ? theme.surfaceAlt : theme.surface,
        border: `1px solid ${hovered ? theme.primaryBorder : theme.stroke}`,
        boxShadow: hovered
          ? "0 25px 60px rgba(0,0,0,0.45)"
          : "0 1px 0 rgba(255,255,255,0.03)",
        transition: "transform 200ms ease, box-shadow 200ms ease, background 200ms ease, border 200ms ease",
        cursor: interactive ? "pointer" : "default",
      }}
    >
      {children}
    </Component>
  );
}

export function Badge({
  label,
  tone = "primary",
  icon: Icon,
}: {
  label: string;
  tone?: "primary" | "muted" | "success";
  icon?: IconType;
}) {
  const styles = {
    primary: { bg: theme.primarySoft, color: theme.primary },
    muted: { bg: theme.accentSubtle, color: theme.textMuted },
    success: { bg: theme.successSoft, color: theme.success },
  }[tone];

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
      style={styles}
    >
      {Icon ? <Icon className="w-3.5 h-3.5" /> : null}
      {label}
    </span>
  );
}

export function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      className={`px-4 py-3 rounded-xl flex items-center justify-between ${hoverLiftClass}`}
      style={{
        background: theme.surfaceAlt,
        border: `1px solid ${theme.stroke}`,
        fontFamily: fonts.body,
        transition: "all 180ms ease",
      }}
    >
      <span style={{ color: theme.textMuted }} className="text-xs uppercase">
        {label}
      </span>
      <span style={{ color: theme.primary }} className="text-lg font-semibold">
        {value}
      </span>
    </div>
  );
}

export function FeatureList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
            style={{ background: theme.primarySoft }}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: theme.textMuted, fontFamily: fonts.body }}
          >
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

