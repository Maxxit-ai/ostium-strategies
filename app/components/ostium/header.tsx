import Link from "next/link";
import { Bell, Plus } from "lucide-react";
import { fonts, theme } from "./theme";
import { hoverLiftClass } from "./ui";

export function OstiumHeader({ currentTime }: { currentTime: string }) {
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{ background: `${theme.bg}F8`, borderColor: theme.stroke }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 4L12 12M12 12L20 4M12 12L4 20M12 12L20 20"
                  stroke={theme.primary}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="font-semibold text-lg"
                style={{ color: theme.primary, fontFamily: fonts.heading }}
              >
                OSTIUM
              </span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {["Trade", "Points", "Vault", "Referrals", "Portfolio", "More"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${hoverLiftClass}`}
                  style={{
                    color: theme.textMuted,
                    fontFamily: fonts.body,
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="hidden md:flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-md"
              style={{
                color: theme.textMuted,
                background: theme.accentSubtle,
                border: `1px solid ${theme.stroke}`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: theme.success }}
              />
              {currentTime}
            </div>
            <button
              className={`hidden sm:flex px-4 py-2 rounded-lg text-sm font-medium border ${hoverLiftClass}`}
              style={{
                borderColor: theme.stroke,
                color: theme.text,
                fontFamily: fonts.body,
                cursor: "pointer",
              }}
            >
              Enable 1CT
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg ${hoverLiftClass}`}
              style={{
                background: theme.primary,
                color: "#0B0603",
                fontFamily: fonts.heading,
                cursor: "pointer",
              }}
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg ${hoverLiftClass}`}
              style={{
                background: theme.surfaceAlt,
                border: `1px solid ${theme.stroke}`,
                cursor: "pointer",
              }}
            >
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: theme.text, fontFamily: fonts.heading }}
              >
                7,807.02
              </span>
              <div
                className="w-5 h-5 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, #FFC371)`,
                }}
              />
            </div>
            <button
              className={`p-2 rounded-lg ${hoverLiftClass}`}
              style={{ color: theme.textMuted, cursor: "pointer" }}
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function OstiumFooter() {
  return (
    <footer
      className="py-8 border-t"
      style={{ borderColor: theme.stroke, background: theme.surfaceAlt }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 4L12 12M12 12L20 4M12 12L4 20M12 12L20 20"
              stroke={theme.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <span
            className="font-semibold"
            style={{ color: theme.primary, fontFamily: fonts.heading }}
          >
            OSTIUM
          </span>
        </div>
        <p
          className="text-xs text-center"
          style={{ color: theme.textMuted, fontFamily: fonts.body }}
        >
          Trading involves risk. Past performance is not indicative of future results.
        </p>
        <p className="text-xs" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
          © 2025
        </p>
      </div>
    </footer>
  );
}

