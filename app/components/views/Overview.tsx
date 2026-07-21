"use client";

import { Mic, CheckCircle, Users, ShieldCheck, TrendingUp, Clock, ArrowRight, Target, Headphones, BookOpen } from "lucide-react";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Progress } from "@/app/components/ui/Progress";
import { ChartCard } from "@/app/components/ui/ChartCard";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { contributionGoals } from "@/app/lib/data";
import type { View } from "@/app/lib/types";

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
  { name: "Daily life", value: 320, color: "#9A3412" },
  { name: "Health", value: 198, color: "#059669" },
  { name: "Market", value: 156, color: "#D97706" },
  { name: "Environment", value: 94, color: "#7C3AED" },
  { name: "Education", value: 250, color: "#2563EB" },
];

const recentActivity = [
  { text: "KL-1051 submitted for review", time: "2 min ago" },
  { text: "Health campaign reached 66%", time: "1 hour ago" },
  { text: "James Kollie approved KL-1049", time: "3 hours ago" },
  { text: "Dataset v0.3.0 released", time: "Yesterday" },
];

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easing } } };

export function Overview({ onNavigate }: { onNavigate: (view: View) => void }) {
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
        transition={{ duration: 0.5, ease: easing }}
        className="relative overflow-hidden rounded-2xl bg-surface-dark p-8 lg:p-12 text-white"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-terracotta via-transparent to-transparent" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-terracotta-light text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                <Target className="w-3.5 h-3.5" /> Next milestone: 5,000 sentences
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-display">The pilot is 67% to its first milestone</h2>
              <p className="text-sm text-cream/70 leading-relaxed mb-6">
                With consistent daily contributions, the community can reach the 5,000-sentence goal before the end of the quarter. Every validated clip brings Liberian AI closer to home.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => onNavigate("contribute")}>
                  <Mic className="w-4 h-4" /> Record now
                </Button>
                <Button variant="secondary" onClick={() => onNavigate("sentences")}>
                  <BookOpen className="w-4 h-4" /> Add sentences
                </Button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 w-full lg:w-[340px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-cream/80">Goal progress</span>
                <span className="text-sm font-bold text-terracotta-light">3,352 / 5,000</span>
              </div>
              <Progress value={3352} max={5000} className="bg-white/10" barClassName="bg-terracotta-light" />
              <div className="mt-5 grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/5 rounded-xl p-3">
                  <strong className="block text-xl font-bold text-white">1,248</strong>
                  <span className="text-[10px] text-cream/60 uppercase tracking-wider">Clips</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <strong className="block text-xl font-bold text-white">87%</strong>
                  <span className="text-[10px] text-cream/60 uppercase tracking-wider">Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={container} initial="hidden" animate="show">
        {[
          { label: "Contributions", value: "1,248", change: "+12%", icon: Mic },
          { label: "Reviews", value: "4,102", change: "+8%", icon: CheckCircle },
          { label: "Active speakers", value: "312", change: "+5", icon: Users },
          { label: "Verified clips", value: "1,087", change: "94%", icon: ShieldCheck },
        ].map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-charcoal-light font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-charcoal mt-1">{stat.value}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-terracotta/10 flex items-center justify-center text-terracotta">
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-forest-600 font-medium mt-3 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {stat.change} this week
              </p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-5" variants={container} initial="hidden" animate="show">
        <motion.div className="lg:col-span-2" variants={item}>
          <ChartCard title="Weekly activity" subtitle="Contributions vs reviews" className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9A3412" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#9A3412" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
                  }}
                  itemStyle={{ color: "var(--text)" }}
                />
                <Area type="monotone" dataKey="contributions" stroke="#9A3412" strokeWidth={2} fill="url(#colorContrib)" />
                <Area type="monotone" dataKey="reviews" stroke="#059669" strokeWidth={2} fill="url(#colorReview)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        <motion.div variants={item}>
          <ChartCard title="By category" subtitle="Validated clips" className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                  }}
                  itemStyle={{ color: "var(--text)" }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-5" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <Card className="p-5">
            <span className="section-title">Recent Activity</span>
            <div className="mt-4 space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b border-cream-dark last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-terracotta/60 mt-2 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-charcoal">{a.text}</p>
                    <span className="text-xs text-charcoal-light flex items-center gap-1 mt-0.5">
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
            <h3 className="text-xl font-bold text-charcoal mt-1 mb-6 font-display">Technology that respects the people behind the data</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { num: "01", title: "Community ownership", desc: "Liberians shape how the language is recorded, represented and used." },
                { num: "02", title: "Clear consent", desc: "Every contributor knows what their data supports before submitting." },
                { num: "03", title: "Verified quality", desc: "Two independent reviewers approve every item used for training." },
              ].map((p) => (
                <div key={p.num} className="p-5 rounded-xl bg-cream border border-cream-dark">
                  <span className="text-xs font-bold text-terracotta">{p.num}</span>
                  <h4 className="font-semibold text-charcoal mt-2 mb-1">{p.title}</h4>
                  <p className="text-sm text-charcoal-light leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="section-title">Your goals</span>
              <h3 className="text-lg font-bold text-charcoal mt-1">This week&apos;s contribution targets</h3>
            </div>
            <Button size="sm" variant="secondary" onClick={() => onNavigate("contribute")}>
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {contributionGoals.map((goal) => (
              <div key={goal.id} className="p-5 rounded-xl bg-cream border border-cream-dark">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center text-terracotta">
                    {goal.label.toLowerCase().includes("record") && <Mic className="w-5 h-5" />}
                    {goal.label.toLowerCase().includes("review") && <Headphones className="w-5 h-5" />}
                    {goal.label.toLowerCase().includes("sentence") && <BookOpen className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{goal.label}</p>
                    <p className="text-xs text-charcoal-light">{goal.current} / {goal.target} {goal.unit}</p>
                  </div>
                </div>
                <Progress value={goal.current} max={goal.target} />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
