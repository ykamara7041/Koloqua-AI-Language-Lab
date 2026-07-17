"use client";

import { Mic, CheckCircle, Users, ShieldCheck, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Progress } from "@/app/components/ui/Progress";
import { ChartCard } from "@/app/components/ui/ChartCard";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { PageTitle } from "@/app/components/layout/PageTitle";

const weeklyData = [
  { day: "Mon", contributions: 45, reviews: 32 },
  { day: "Tue", contributions: 62, reviews: 48 },
  { day: "Wed", contributions: 58, reviews: 41 },
  { day: "Thu", contributions: 86, reviews: 67 },
  { day: "Fri", contributions: 74, reviews: 55 },
  { day: "Sat", contributions: 38, reviews: 29 },
  { day: "Sun", contributions: 52, reviews: 40 },
];

const categoryData = [
  { name: "Daily life", value: 320, color: "#10b981" },
  { name: "Health", value: 198, color: "#3b82f6" },
  { name: "Market", value: 156, color: "#f59e0b" },
  { name: "Environment", value: 94, color: "#8b5cf6" },
  { name: "Education", value: 250, color: "#ef4444" },
];

const recentActivity = [
  { text: "KL-1051 submitted for review", time: "2 min ago" },
  { text: "Health campaign reached 66%", time: "1 hour ago" },
  { text: "James Kollie approved KL-1049", time: "3 hours ago" },
  { text: "Dataset v0.3.0 released", time: "Yesterday" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export function Overview({ onNavigate }: { onNavigate: (view: "contribute" | "review") => void }) {
  return (
    <section className="space-y-8">
      <PageTitle
        eyebrow="Dashboard"
        title="Overview"
        description="Track pilot progress, quality metrics, and your next contribution opportunity."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 p-8 lg:p-12 text-white"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-forest-400 to-transparent" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-forest-100 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-300 animate-pulse" />
            Live Pilot
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">Preserving Liberia&apos;s voice for the age of AI</h2>
          <p className="text-forest-100/80 text-lg leading-relaxed mb-8 max-w-2xl">
            A community-powered platform to collect, verify, and publish Koloqua language data with dignity and consent.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => onNavigate("contribute")} variant="white">
              Start contributing <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => onNavigate("review")}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
            >
              Review queue
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" variants={container} initial="hidden" animate="show">
        {[
          { label: "Contributions", value: "1,248", sub: "+86 this week", icon: Mic, color: "bg-emerald-50 text-emerald-700", trend: "+12%" },
          { label: "Approved items", value: "1,062", sub: "Two-review minimum", icon: CheckCircle, color: "bg-blue-50 text-blue-700", trend: "+8%" },
          { label: "Active speakers", value: "312", sub: "From 4 institutions", icon: Users, color: "bg-violet-50 text-violet-700", trend: "+5%" },
          { label: "Quality score", value: "87%", sub: "Approval rate", icon: ShieldCheck, color: "bg-amber-50 text-amber-700", trend: "+2%" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} variants={item}>
              <Card className="p-5 card-hover">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-500 mb-0.5">{s.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{s.sub}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" /> {s.trend}
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-5" variants={container} initial="hidden" animate="show">
        <motion.div className="lg:col-span-2" variants={item}>
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="section-title">Pilot Progress</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Building our first 5,000 sentences</h3>
              </div>
              <div className="text-right">
                <strong className="text-3xl font-bold text-forest-700">25%</strong>
                <p className="text-xs text-slate-500">1,248 of 5,000</p>
              </div>
            </div>
            <Progress value={1248} max={5000} size="lg" color="forest" />
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: "Foundation", value: "1,000", done: true },
                { label: "Model test", value: "2,500", done: false },
                { label: "Pilot goal", value: "5,000", done: false },
              ].map((m) => (
                <div key={m.label} className={`p-4 rounded-xl border text-center ${m.done ? "bg-forest-50 border-forest-100" : "bg-slate-50 border-slate-100"}`}>
                  <strong className={`block text-lg font-bold ${m.done ? "text-forest-800" : "text-slate-500"}`}>{m.value}</strong>
                  <span className="text-xs text-slate-500">{m.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6 h-full bg-gradient-to-br from-forest-800 to-forest-900 text-white">
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest-300">Next Step</span>
                <h3 className="text-xl font-bold mt-1">12 recordings need review</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold">12</div>
            </div>
            <p className="text-forest-100/80 text-sm mb-6">Independent review keeps the dataset accurate and trustworthy.</p>
            <Button onClick={() => onNavigate("review")} variant="white" className="w-full">
              Open review queue
            </Button>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-5" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <ChartCard title="Weekly activity" subtitle="Contributions vs. reviews">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorReview" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="contributions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorContrib)" />
                  <Area type="monotone" dataKey="reviews" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReview)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={item}>
          <ChartCard title="Contributions by category">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={90} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-5" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <Card className="p-5">
            <span className="section-title">Recent Activity</span>
            <div className="mt-4 space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-forest-500 mt-2 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{a.text}</p>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {a.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div className="lg:col-span-2" variants={item}>
          <Card className="p-6">
            <span className="section-title">Built With Purpose</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 mb-6 font-display">Technology that respects the people behind the data</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { num: "01", title: "Community ownership", desc: "Liberians shape how the language is recorded, represented and used." },
                { num: "02", title: "Clear consent", desc: "Every contributor knows what their data supports before submitting." },
                { num: "03", title: "Verified quality", desc: "Two independent reviewers approve every item used for training." },
              ].map((p) => (
                <div key={p.num} className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-forest-600">{p.num}</span>
                  <h4 className="font-semibold text-slate-900 mt-2 mb-1">{p.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
