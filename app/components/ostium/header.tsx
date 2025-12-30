"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Bell, Plus, ChevronDown, Wallet, LogOut, Menu, X } from "lucide-react";
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
  isMobile = false,
}: {
  items: Array<{ label: string; href: string; icon?: any; description?: string }>;
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isMobile?: boolean;
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
      className={`${isMobile ? 'relative w-full' : 'absolute top-full left-0 mt-1 w-52'} rounded-xl shadow-2xl border backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200`}
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
          return (
            <Link
              key={idx}
              href={item.href}
              onClick={onClose}
              className="flex items-start gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all group"
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
                  className="text-xs sm:text-sm font-medium group-hover:text-current transition-colors"
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

function WalletDropdown({
  isOpen,
  onClose,
  walletAddress,
  onDisconnect,
  isMobile = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  onDisconnect: () => void;
  isMobile?: boolean;
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

  const truncatedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <div
      ref={dropdownRef}
      className={`${isMobile ? 'relative w-full mt-2' : 'absolute top-full right-0 mt-2 w-56'} rounded-xl shadow-2xl border backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200`}
      style={{
        background: theme.surface,
        borderColor: theme.stroke,
        boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px ${theme.stroke}`,
      }}
    >
      <div className="p-2 sm:p-3">
        <div className="px-2 sm:px-3 py-1.5 sm:py-2 mb-2">
          <p className="text-[10px] sm:text-xs mb-1" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
            Connected Wallet
          </p>
          <p className="text-xs sm:text-sm font-mono break-all" style={{ color: theme.text }}>
            {truncatedAddress}
          </p>
        </div>
        <div
          className="h-px mb-2"
          style={{ background: theme.stroke }}
        />
        <button
          onClick={() => {
            onDisconnect();
            onClose();
          }}
          className="flex items-center gap-2 w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-left"
          style={{
            color: theme.text,
            fontFamily: fonts.body,
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
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">Disconnect</span>
        </button>
      </div>
    </div>
  );
}

export function OstiumHeader() {
  const { authenticated, user, login, logout } = usePrivy();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

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
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const truncatedAddress = user?.wallet?.address
    ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
    : "";

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden transition-opacity"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <header
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{ background: `${theme.bg}F8`, borderColor: theme.stroke }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
              <Link href="/" className="flex items-center gap-2 sm:gap-2.5">
                <Image
                  src="/ostium-logo.png"
                  alt="Ostium"
                  width={110}
                  height={110}
                />
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
                          className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${hoverLiftClass}`}
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
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""
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
                        className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${hoverLiftClass}`}
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

            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div
                className="hidden md:flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono px-2 sm:px-3 py-0.5 sm:py-1 rounded-md"
                style={{
                  color: theme.textMuted,
                  background: theme.accentSubtle,
                  border: `1px solid ${theme.stroke}`,
                }}
              >
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
                  style={{ background: theme.success }}
                />
                {currentTime}
              </div>

              {/* Wallet Connect Button */}
              {authenticated && user?.wallet?.address ? (
                <div className="relative">
                  <button
                    onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border ${hoverLiftClass}`}
                    style={{
                      borderColor: walletDropdownOpen ? theme.primary : theme.stroke,
                      background: walletDropdownOpen ? theme.primarySoft : "transparent",
                      color: theme.text,
                      fontFamily: fonts.body,
                      cursor: "pointer",
                    }}
                  >
                    <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.primary }} />
                    <span className="hidden sm:inline">{truncatedAddress}</span>
                    <span className="sm:hidden">{truncatedAddress.slice(0, 4)}...</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${walletDropdownOpen ? "rotate-180" : ""}`}
                      style={{ color: theme.textMuted }}
                    />
                  </button>
                  <WalletDropdown
                    isOpen={walletDropdownOpen}
                    onClose={() => setWalletDropdownOpen(false)}
                    walletAddress={user.wallet.address}
                    onDisconnect={logout}
                  />
                </div>
              ) : (
                <button
                  onClick={() => login()}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-lg ${hoverLiftClass}`}
                  style={{
                    background: theme.primary,
                    color: "#0B0603",
                    fontFamily: fonts.heading,
                    cursor: "pointer",
                  }}
                >
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Connect Wallet</span>
                  <span className="sm:hidden">Connect</span>
                </button>
              )}

              <button
                className={`hidden sm:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-lg ${hoverLiftClass}`}
                style={{
                  background: theme.primary,
                  color: "#0B0603",
                  fontFamily: fonts.heading,
                  cursor: "pointer",
                }}
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Add
              </button>
              <div
                className={`hidden md:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg ${hoverLiftClass}`}
                style={{
                  background: theme.surfaceAlt,
                  border: `1px solid ${theme.stroke}`,
                  cursor: "pointer",
                }}
              >
                <span
                  className="text-xs sm:text-sm font-semibold tabular-nums"
                  style={{ color: theme.text, fontFamily: fonts.heading }}
                >
                  7,807.02
                </span>
                <div
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, #FFC371)`,
                  }}
                />
              </div>
              <button
                className={`p-1.5 hidden md:block sm:p-2 rounded-lg ${hoverLiftClass}`}
                style={{ color: theme.textMuted, cursor: "pointer" }}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg transition-all"
                style={{
                  color: theme.textMuted,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.primarySoft;
                  e.currentTarget.style.color = theme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = theme.textMuted;
                }}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

            </div>


          </div>

        </div>
      </header>

      {/* Mobile Menu Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{
          background: theme.bg,
          borderLeft: `1px solid ${theme.stroke}`,
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.stroke }}>
            <h2 className="text-lg font-bold" style={{ color: theme.text, fontFamily: fonts.heading }}>
              Menu
            </h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg transition-all"
              style={{
                color: theme.textMuted,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.primarySoft;
                e.currentTarget.style.color = theme.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = theme.textMuted;
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* Navigation Items */}
            <nav className="py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.label} className="px-4">
                  {item.hasDropdown ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          // Toggle dropdown - close if already open, open if closed
                          setMobileDropdownOpen(mobileDropdownOpen === item.label ? null : item.label);
                        }}
                        className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                        style={{
                          color: mobileDropdownOpen === item.label ? theme.primary : theme.text,
                          background: mobileDropdownOpen === item.label ? theme.primarySoft : "transparent",
                          fontFamily: fonts.body,
                          cursor: "pointer",
                        }}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${mobileDropdownOpen === item.label ? "rotate-180" : ""}`}
                        />
                      </button>
                      {item.dropdownItems && (
                        <NavDropdown
                          items={item.dropdownItems}
                          isOpen={mobileDropdownOpen === item.label}
                          onClose={() => setMobileDropdownOpen(null)}
                          isMobile={true}
                        />
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        color: theme.text,
                        fontFamily: fonts.body,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme.primarySoft;
                        e.currentTarget.style.color = theme.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = theme.text;
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Panel Content */}
            <div className="px-4 py-4 space-y-4 border-t" style={{ borderColor: theme.stroke }}>
              {/* Time Display */}
              <div
                className="flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-md"
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

              {/* Wallet Section */}
              {authenticated && user?.wallet?.address ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 rounded-lg" style={{ background: theme.surfaceAlt }}>
                    <p className="text-xs mb-1" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
                      Connected Wallet
                    </p>
                    <p className="text-sm font-mono break-all" style={{ color: theme.text }}>
                      {truncatedAddress}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all text-left"
                    style={{
                      color: theme.text,
                      fontFamily: fonts.body,
                      background: theme.surfaceAlt,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.primarySoft;
                      e.currentTarget.style.color = theme.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = theme.surfaceAlt;
                      e.currentTarget.style.color = theme.text;
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Disconnect</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    login();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg transition-all"
                  style={{
                    background: theme.primary,
                    color: "#0B0603",
                    fontFamily: fonts.heading,
                    cursor: "pointer",
                  }}
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </button>
              )}

              {/* Add Button */}
              <button
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg transition-all"
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

              {/* Balance Display */}
              <div
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{
                  background: theme.surfaceAlt,
                  border: `1px solid ${theme.stroke}`,
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

              {/* Notifications */}
              <button
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all text-left"
                style={{
                  color: theme.text,
                  fontFamily: fonts.body,
                  background: theme.surfaceAlt,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.primarySoft;
                  e.currentTarget.style.color = theme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = theme.surfaceAlt;
                  e.currentTarget.style.color = theme.text;
                }}
              >
                <Bell className="w-4 h-4" />
                <span className="text-sm">Notifications</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function OstiumFooter() {
  return (
    <footer
      className="py-6 sm:py-8 border-t"
      style={{ borderColor: theme.stroke, background: theme.surfaceAlt }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/ostium-logo.png"
            alt="Ostium"
            width={110}
            height={110}
          />
        </Link>
        <p
          className="text-[10px] sm:text-xs text-center px-2"
          style={{ color: theme.textMuted, fontFamily: fonts.body }}
        >
          Trading involves risk. Past performance is not indicative of future results.
        </p>
        <p className="text-[10px] sm:text-xs whitespace-nowrap" style={{ color: theme.textMuted, fontFamily: fonts.body }}>
          © 2025
        </p>
      </div>
    </footer>
  );
}
