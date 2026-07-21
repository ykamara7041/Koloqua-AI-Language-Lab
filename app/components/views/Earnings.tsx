"use client";

import { useState } from "react";
import { Wallet, Mic, ClipboardCheck, TrendingUp, ArrowUpRight, Download, Lock, ShieldCheck, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Badge } from "@/app/components/ui/Badge";
import { ChartCard } from "@/app/components/ui/ChartCard";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSecurity } from "@/app/hooks/useSecurity";
import { ledgerRows } from "@/app/lib/data";
import { payoutSchema } from "@/app/lib/validation";
import { toast } from "sonner";
import type { PayoutRequest } from "@/app/lib/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const monthlyData = [
  { month: "Jan", earnings: 420 },
  { month: "Feb", earnings: 680 },
  { month: "Mar", earnings: 540 },
  { month: "Apr", earnings: 860 },
  { month: "May", earnings: 720 },
  { month: "Jun", earnings: 980 },
  { month: "Jul", earnings: 640 },
];

const MIN_BALANCE = 500;
const MAX_DAILY = 5000;
const AVAILABLE_BALANCE = 1860;

export function Earnings() {
  const { user } = useAuth();
  const { paymentPin } = useSecurity();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payouts, setPayouts] = useState<PayoutRequest[]>([
    { id: "P-001", userId: "u-001", amount: 1200, phone: "+231 77 123 4567", status: "paid", requestedAt: "2026-07-05", processedAt: "2026-07-06" },
  ]);

  const requestPayout = () => {
    setErrors({});
    const parsed = payoutSchema.safeParse({ amount: Number(amount), phone, pin });
    if (!parsed.success) {
      const mapped: Record<string, string> = {};
      parsed.error.issues.forEach((e) => (mapped[String(e.path[0])] = e.message));
      setErrors(mapped);
      return;
    }

    if (Number(amount) > AVAILABLE_BALANCE) {
      setErrors({ amount: "Amount exceeds your available balance of L$1,860." });
      return;
    }

    if (paymentPin && pin !== paymentPin) {
      setErrors({ pin: "Incorrect payment PIN." });
      return;
    }

    const newPayout: PayoutRequest = {
      id: `P-${String(payouts.length + 1).padStart(3, "0")}`,
      userId: user?.id || "unknown",
      amount: Number(amount),
      phone,
      status: "pending",
      requestedAt: new Date().toISOString().slice(0, 10),
    };
    setPayouts((prev) => [newPayout, ...prev]);

    toast.success(`Payout request for L$${amount} submitted for review.`);
    setAmount("");
    setPhone("");
    setPin("");
  };

  return (
    <section className="max-w-6xl">
      <PageTitle
        eyebrow="Contributor Rewards"
        title="Earnings"
        description="Transparent rewards recognize high-quality language work when sponsored campaigns are active."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-forest-800 to-forest-950 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-300">Available Balance</span>
              <h2 className="text-5xl font-bold mt-2">L$ {AVAILABLE_BALANCE.toLocaleString()}</h2>
              <p className="text-forest-200/80 text-sm mt-1">From 84 approved contributions</p>
            </div>
            <div className="flex-1 max-w-md">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                  error={errors.amount}
                />
                <Input
                  placeholder="Mobile money number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                />
              </div>
              <div className="mb-3">
                <Input
                  placeholder="Payment PIN"
                  type="password"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  error={errors.pin}
                  icon={<Lock className="w-4 h-4" />}
                />
              </div>
              <Button onClick={requestPayout} className="w-full bg-white text-forest-800 hover:bg-forest-50">
                <Wallet className="w-4 h-4" /> Request payout
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-300" />
              <span className="text-forest-200">Min: L${MIN_BALANCE}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-forest-300" />
              <span className="text-forest-200">Daily max: L${MAX_DAILY}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-forest-300" />
              <span className="text-forest-200">PIN required</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-2xl font-bold text-slate-900">L$ 4,240</strong>
              <span className="text-xs text-slate-500">Total lifetime earnings</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <ArrowUpRight className="w-4 h-4" />
            <span className="font-semibold">+18%</span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <ChartCard title="Earnings history" subtitle="Last 7 months">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="earnings" radius={[6, 6, 0, 0]} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Contribution value" subtitle="Cumulative approved value">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorEarn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2} fill="url(#colorEarn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <Card className="overflow-hidden mb-5">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="section-title">Activity</span>
            <h3 className="text-base font-bold text-slate-900 mt-1">Contribution ledger</h3>
          </div>
          <Badge variant="warning">Demo payments</Badge>
        </div>
        <div className="divide-y divide-slate-100">
          {ledgerRows.map((row) => (
            <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors" key={row.id}>
              <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center text-forest-700">
                {row.type.includes("review") ? <ClipboardCheck className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <strong className="block text-sm text-slate-900">{row.type}</strong>
                <span className="text-xs text-slate-500">{row.reference} · {row.date}</span>
              </div>
              <Badge variant={row.status === "Approved" ? "success" : row.status === "Rejected" ? "danger" : "warning"}>{row.status}</Badge>
              <strong className="text-sm min-w-[70px] text-right">{row.amount}</strong>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" /> Export statement
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <span className="section-title">Payouts</span>
          <h3 className="text-base font-bold text-slate-900 mt-1">Withdrawal history</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {payouts.map((p) => (
            <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors" key={p.id}>
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                {p.status === "paid" ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <Clock className="w-5 h-5 text-amber-500" />}
              </div>
              <div className="flex-1">
                <strong className="block text-sm text-slate-900">{p.id}</strong>
                <span className="text-xs text-slate-500">{p.phone} · Requested {p.requestedAt}</span>
              </div>
              <Badge variant={p.status === "paid" ? "success" : "warning"} className="capitalize">{p.status}</Badge>
              <strong className="text-sm min-w-[80px] text-right">L${p.amount.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
