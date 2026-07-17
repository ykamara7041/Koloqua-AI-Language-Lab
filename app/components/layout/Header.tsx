"use client";

import { Bell, Menu, User } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

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
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "G";

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenu}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="lg:hidden font-bold text-forest-900">Koloqua AI</span>
        <span className="hidden lg:block text-sm text-slate-500">
          Platform / <span className="font-semibold text-slate-900">{viewNames[currentView] || "Dashboard"}</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-forest-50 text-forest-700 text-[10px] font-bold uppercase tracking-wider border border-forest-100">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
          Live Pilot
        </span>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-coral-500 border-2 border-white" />
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-forest-100 to-blue-100 border border-slate-200 flex items-center justify-center text-forest-800 font-bold text-xs">
          {user ? initials : <User className="w-4 h-4" />}
        </div>
      </div>
    </header>
  );
}
