"use client";

import {
  LayoutDashboard,
  Mic,
  ClipboardCheck,
  Headphones,
  BookOpen,
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
  Award,
  LogOut,
} from "lucide-react";
import { clsx } from "clsx";
import type { View } from "@/app/lib/types";
import { useAuth } from "@/app/contexts/AuthContext";
import { canAccess } from "@/app/lib/data";

interface NavItem {
  id: View;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  adminOnly?: boolean;
}

const sections: { label: string; items: NavItem[] }[] = [
  {
    label: "Platform",
    items: [
      { id: "overview" as View, label: "Overview", icon: LayoutDashboard },
      { id: "contribute" as View, label: "Contribute", icon: Mic, badge: "3" },
      { id: "validate" as View, label: "Validate", icon: Headphones, badge: "5" },
      { id: "sentences" as View, label: "Sentences", icon: BookOpen, badge: "2" },
      { id: "review" as View, label: "Review", icon: ClipboardCheck, badge: "12" },
    ],
  },
  {
    label: "Community",
    items: [
      { id: "institutions" as View, label: "Institutions", icon: School },
      { id: "campaigns" as View, label: "Campaigns", icon: Target },
      { id: "leaderboard" as View, label: "Leaderboard", icon: Trophy },
      { id: "achievements" as View, label: "Achievements", icon: Award },
      { id: "earnings" as View, label: "Earnings", icon: Wallet },
    ],
  },
  {
    label: "Governance",
    items: [
      { id: "consent" as View, label: "Consent", icon: FileCheck },
      { id: "audit" as View, label: "Audit log", icon: ScrollText, adminOnly: true },
      { id: "export" as View, label: "Dataset", icon: Database, adminOnly: true },
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
      {open && <div className="fixed inset-0 bg-charcoal/40 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={clsx(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] flex flex-col bg-surface-dark text-cream border-r border-cream-dark/10 transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-5 border-b border-cream-dark/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-terracotta to-terracotta-light flex items-center justify-center text-white font-bold">K</div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm leading-tight">Koloqua AI</span>
              <span className="text-[10px] font-semibold tracking-[0.15em] text-cream/50 uppercase">Language Lab</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {sections.map((section) => {
            const visible = section.items.filter((item) => {
              if (!canAccess(item.id, role)) return false;
              if (item.adminOnly && role !== "admin") return false;
              return true;
            });
            if (visible.length === 0) return null;
            return (
              <div key={section.label} className="mb-5">
                <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-cream/40 uppercase">{section.label}</div>
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
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                          isActive
                            ? "bg-terracotta/20 text-white shadow-sm"
                            : "text-cream/70 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon className="w-[18px] h-[18px] shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="bg-terracotta text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-cream-dark/10">
          <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-terracotta/20 flex items-center justify-center text-terracotta-light mb-2">
              <Leaf className="w-4 h-4" />
            </div>
            <strong className="block text-white text-xs mb-1">Pilot mission</strong>
            <p className="text-[11px] text-cream/60 leading-relaxed">Collect, verify, and publish 5,000 Koloqua sentences with community consent.</p>
          </div>

          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-terracotta to-terracotta-light flex items-center justify-center text-white text-xs font-bold">
                {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <strong className="block text-white text-xs truncate">{user.name}</strong>
                <span className="block text-[10px] text-cream/50 truncate capitalize">{user.role} · {user.institution || "Independent"}</span>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-cream/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {user ? "Sign out" : "Guest session"}
          </button>
        </div>
      </aside>
    </>
  );
}
