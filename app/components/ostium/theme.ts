import type { CSSProperties } from "react";

export type IconType = React.ComponentType<{
  className?: string;
  style?: CSSProperties;
}>;

export const theme = {
  primary: "#FF5A19",
  primarySoft: "rgba(255, 90, 25, 0.12)",
  primaryBorder: "rgba(255, 90, 25, 0.3)",
  accentSubtle: "rgba(208, 219, 218, 0.1)",
  bg: "#070606",
  surface: "#0C0A0A",
  surfaceAlt: "#11100F",
  text: "#F5F5F4",
  textMuted: "#A6A6A6",
  stroke: "rgba(255,255,255,0.08)",
  success: "#4ADE80",
  successSoft: "rgba(74, 222, 128, 0.12)",
};

export const fonts = {
  heading: "var(--font-plex-sans), 'IBM Plex Sans', 'Inter', system-ui, -apple-system, sans-serif",
  body: "var(--font-plex-sans), 'IBM Plex Sans', 'Inter', system-ui, -apple-system, sans-serif",
};

