"use client";

import {
  LayoutDashboard,
  Mic,
  ClipboardCheck,
  School,
  Wallet,
  Target,
  FileCheck,
  ScrollText,
  Database,
  Shield,
  UserCircle,
  Leaf,
  Trophy,
  LogOut,
} from "lucide-react";
import { clsx } from "clsx";
import type { View } from "@/app/lib/types";
import { useAuth } from "@/app/contexts/AuthContext";
import { canAccess } from "@/app/lib/data";

const sections = [
  {
    label: "Platform",
    items: [
      { id: "overview" as View, label: "Overview", icon: LayoutDashboard },
      { id: "contribute" as View, label: "Contribute", icon: Mic, badge: "3" },
      { id: "review" as View, label: "Review", icon: ClipboardCheck, badge: "12" },
    ],
  },
  {
    label: "Community",
    items: [
      { id: "institutions" as View, label: "Institutions", icon: School },
      { id: "campaigns" as View, label: "Campaigns", icon: Target },
      { id: "leaderboard" as View, label: "Leaderboard", icon: Trophy },
      { id: "earnings" as View, label: "Earnings", icon: Wallet },
    ],
  },
  {
    label: "Governance",
    items: [
      { id: "consent" as View, label: "Consent", icon: FileCheck },
      { id: "audit" as View, label: "Audit log", icon: ScrollText },
      { id: "export" as View, label: "Dataset", icon: Database },
    ],
  },
  {
    label: "System",
    items: [
      { id: "admin" as View, label: "Admin", icon: Shield },
      { id: "profile" as View, label: "Profile", icon: UserCircle },
    ],
  },
];

export function Sidebar({
  active,
  onNavigate,
  open,
  onClose,
}: {
  active: View;
  onNavigate: (v: View) => void;
  open: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuth();
  const role = user?.role || "guest";

  return (
    <>
      {open && <div className="fixed inset-0 bg-slate-950/40 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={clsx(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] bg-forest-950 text-forest-100 flex flex-col border-r border-forest-800/50 transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              K
            </div>
            <div>
              <strong className="block text-white text-[15px] leading-tight">Koloqua AI</strong>
              <span className="text-[10px] font-semibold tracking-[0.15em] text-forest-300 uppercase">Language Lab</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {sections.map((section) => {
            const visible = section.items.filter((item) => canAccess(item.id, role));
            if (visible.length === 0) return null;
            return (
              <div key={section.label} className="mb-5">
                <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-forest-400 uppercase">{section.label}</div>
                <div className="space-y-0.5">
                  {visible.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          onClose();
                        }}
                        className={clsx(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-forest-800/80 text-white"
                            : "text-forest-200 hover:bg-forest-900 hover:text-white"
                        )}
                      >
                        <Icon className="w-[18px] h-[18px] shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="bg-forest-700 text-forest-100 text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-forest-800/50">
          <div className="bg-forest-900/50 rounded-xl p-4 mb-4 border border-forest-800/50">
            <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-forest-300 mb-2">
              <Leaf className="w-4 h-4" />
            </div>
            <strong className="block text-white text-xs mb-1">Pilot mission</strong>
            <p className="text-[11px] text-forest-300 leading-relaxed">Collect, verify, and publish 5,000 Koloqua sentences with community consent.</p>
          </div>

          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-forest-900/50 border border-forest-800/50">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <strong className="block text-white text-xs truncate">{user.name}</strong>
                <span className="block text-[10px] text-forest-300 truncate">{user.role} · {user.institution || "Independent"}</span>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-forest-300 hover:text-white hover:bg-forest-900 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {user ? "Sign out" : "Guest session"}
          </button>
        </div>
      </aside>
    </>
  );
}
