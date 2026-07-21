"use client";

import { Shield, Users, Lock, Flag, Database, KeyRound, AlertTriangle, CheckCircle } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { ChartCard } from "@/app/components/ui/ChartCard";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const userGrowth = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 165 },
  { month: "Mar", users: 210 },
  { month: "Apr", users: 248 },
  { month: "May", users: 290 },
  { month: "Jun", users: 312 },
];

const roleData = [
  { name: "Contributors", value: 245, color: "#10b981" },
  { name: "Reviewers", value: 42, color: "#3b82f6" },
  { name: "Admins", value: 8, color: "#f59e0b" },
];

export function Admin() {
  const { user } = useAuth();

  return (
    <section className="max-w-6xl">
      <PageTitle
        eyebrow="Administration"
        title="Project Controls"
        description="Manage access, monitor quality risks, and configure release policies."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {[
          { label: "Active users", value: "312", change: "+12 this week", icon: Users, color: "bg-blue-50 text-blue-700" },
          { label: "Quality alerts", value: "3", change: "2 synthetic flags", icon: AlertTriangle, color: "bg-amber-50 text-amber-700" },
          { label: "Approved today", value: "47", change: "+8 vs yesterday", icon: CheckCircle, color: "bg-emerald-50 text-emerald-700" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-charcoal-light">{stat.change}</span>
              </div>
              <strong className="block text-2xl font-bold text-charcoal mt-3">{stat.value}</strong>
              <span className="text-xs text-charcoal-light">{stat.label}</span>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <ChartCard title="User growth" subtitle="Active contributors over time">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Role distribution" subtitle="Active users by role">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {roleData.map((r) => (
              <div key={r.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                <span className="text-charcoal-light">{r.name} ({r.value})</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { icon: KeyRound, title: "Invite-only access", desc: "Require email invitations and role approval before first login.", action: "Configure invites" },
          { icon: Flag, title: "Quality checks", desc: "Enable silence, duration, duplicate, and synthetic-voice detectors.", badges: ["Silence", "Duration", "Synthetic"] },
          { icon: Database, title: "Dataset policy", desc: "Current license: CC-BY-SA 4.0 with governance approval required.", action: "Edit policy" },
          { icon: Users, title: "User management", desc: "Active users: 312 · Pending role approvals: 4", action: "Manage users" },
          { icon: Lock, title: "Security headers", desc: "CSP, HSTS, and frame-options are configured in next.config.ts.", badge: "Active" },
          { icon: Shield, title: "Session info", desc: `Signed in as ${user?.name || "guest"} with ${user?.role || "guest"} privileges.`, badge: user?.role.toUpperCase() },
        ].map((card, i) => (
          <Card key={i} className="p-5">
            <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center text-forest-700 mb-4">
              <card.icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-charcoal mb-1">{card.title}</h3>
            <p className="text-sm text-charcoal-light mb-4">{card.desc}</p>
            {card.badges && (
              <div className="flex flex-wrap gap-2 mb-3">
                {card.badges.map((b) => <Badge key={b} variant={b === "Synthetic" ? "warning" : "success"}>{b}</Badge>)}
              </div>
            )}
            {card.badge && <Badge variant="success">{card.badge}</Badge>}
            {card.action && <Button variant="secondary" size="sm" onClick={() => toast.info(`${card.action} panel opened.`)}>{card.action}</Button>}
          </Card>
        ))}
      </div>
    </section>
  );
}
