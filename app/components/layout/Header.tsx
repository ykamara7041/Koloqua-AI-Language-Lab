"use client";

import { Bell, Menu, User, Sun, Moon } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import { motion } from "framer-motion";

const viewNames: Record<string, string> = {
  overview: "Dashboard",
  contribute: "Contribute",
  review: "Review queue",
  institutions: "Institutions",
  earnings: "Earnings",
  campaigns: "Campaigns",
  leaderboard: "Leaderboard",
  consent: "Consent",
  audit: "Audit log",
  export: "Dataset",
  admin: "Administration",
  profile: "Profile",
};

export function Header({ onMenu, currentView = "overview" }: { onMenu: () => void; currentView?: string }) {
  const { user } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "G";

  const ThemeIcon = resolvedTheme === "dark" ? Sun : Moon;

  return (
    <header className="sticky top-0 z-30 h-16 bg-cream/80 backdrop-blur-xl border-b border-cream-dark/50 px-4 sm:px-6 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenu}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-cream-dark text-charcoal-light hover:bg-cream-dark transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="lg:hidden font-bold text-charcoal">Koloqua AI</span>
        <span className="hidden lg:block text-sm text-charcoal-light">
          Platform / <span className="font-semibold text-charcoal">{viewNames[currentView] || "Dashboard"}</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-forest-50 text-forest-700 text-[10px] font-bold uppercase tracking-wider border border-cream-dark transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-pulse" />
          Live Pilot
        </span>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-cream-dark text-charcoal-light hover:text-terracotta hover:border-terracotta/30 hover:bg-cream-dark transition-colors"
          aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <motion.div
            key={resolvedTheme}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 30, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ThemeIcon className="w-4 h-4" />
          </motion.div>
        </button>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-cream-dark text-charcoal-light hover:bg-cream-dark hover:text-charcoal transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-coral-500 border-2 border-cream-100" />
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-terracotta to-terracotta-light border border-cream-dark flex items-center justify-center text-white font-bold text-xs">
          {user ? initials : <User className="w-4 h-4" />}
        </div>
      </div>
    </header>
  );
}
