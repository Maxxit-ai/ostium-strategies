"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Bell, Plus, ChevronDown, TrendingUp, BarChart3, Wallet, Zap, Settings, FileText, HelpCircle, Shield, Users } from "lucide-react";
import { fonts, theme } from "./theme";
import { hoverLiftClass } from "./ui";
import Image from "next/image";

type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: Array<{ label: string; href: string; icon?: any; description?: string }>;
};

const navItems: NavItem[] = [
  {
    label: "Trade",
    href: "/trade",
    hasDropdown: true,
    dropdownItems: [
      { label: "Trading", href: "https://app.ostium.com/trade" },
      { label: "Explore", href: "https://app.ostium.com/explore" },
      { label: "Strategies", href: "https://app.ostium.com/strategies" },
      { label: "Leaderboard", href: "https://app.ostium.com/leaderboard" },
    ],
  },
  { label: "Points", href: "https://app.ostium.com/points" },
  { label: "Vault", href: "https://app.ostium.com/vault" },
  { label: "Referrals", href: "https://app.ostium.com/referrals" },
  { label: "Portfolio", href: "https://app.ostium.com/portfolio" },
  {
    label: "More",
    href: "#",
    hasDropdown: true,
    dropdownItems: [
      { label: "Research", href: "https://www.ostium.com/blog" },
      { label: "Ostium SDK", href: "https://pypi.org/project/ostium-python-sdk/" },
      { label: "Docs", href: "https://ostium-labs.gitbook.io/ostium-docs/" },
      { label: "Stats", href: "https://dune.com/ostium_app/stats" },
      { label: "Ostiscan", href: "https://www.ostiscan.xyz/" },
    ],
  },
];

function NavDropdown({
  items,
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: {
  items: Array<{ label: string; href: string; icon?: any; description?: string }>;
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-1 w-52 rounded-xl shadow-2xl border backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        background: theme.surface,
        borderColor: theme.stroke,
        boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px ${theme.stroke}`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-2">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              onClick={onClose}
              className="flex items-start gap-3 px-4 py-3 rounded-lg transition-all group"
              style={{
                color: theme.text,
                fontFamily: fonts.body,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.surfaceAlt;
                e.currentTarget.style.color = theme.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = theme.text;
              }}
            >
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-medium group-hover:text-current transition-colors"
                  style={{ color: "inherit" }}
                >
                  {item.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function OstiumHeader({ currentTime }: { currentTime: string }) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150); // Small delay to allow moving cursor to dropdown
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{ background: `${theme.bg}F8`, borderColor: theme.stroke }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/ostium-logo.png" alt="Ostium" width={110} height={110} />
            </Link>
            <nav className="hidden lg:flex items-center gap-1 relative">
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${hoverLiftClass}`}
                        style={{
                          color:
                            openDropdown === item.label ? theme.primary : theme.textMuted,
                          fontFamily: fonts.body,
                          background:
                            openDropdown === item.label ? theme.primarySoft : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                      {item.dropdownItems && (
                        <NavDropdown
                          items={item.dropdownItems}
                          isOpen={openDropdown === item.label}
                          onClose={() => setOpenDropdown(null)}
                          onMouseEnter={() => handleMouseEnter(item.label)}
                          onMouseLeave={handleMouseLeave}
                        />
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${hoverLiftClass}`}
                      style={{
                        color: theme.textMuted,
                        fontFamily: fonts.body,
                        background: "transparent",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.primary;
                        e.currentTarget.style.background = theme.primarySoft;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.textMuted;
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
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

