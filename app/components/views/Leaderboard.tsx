"use client";

import { Trophy, Medal, Flame, TrendingUp, Users } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import { leaderboard } from "@/app/lib/data";
import { clsx } from "clsx";

export function Leaderboard() {
  return (
    <section className="max-w-6xl">
      <PageTitle
        eyebrow="Community"
        title="Leaderboard"
        description="Top contributors this month. Quality and consistency matter more than quantity."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Top contributors</h3>
                <p className="text-xs text-slate-500">Ranked by approved contributions this month</p>
              </div>
            </div>
            <Badge tone="gold">This month</Badge>
          </div>

          <div className="divide-y divide-slate-100">
            {leaderboard.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                  entry.rank === 1 ? "bg-amber-400 text-amber-950" : entry.rank === 2 ? "bg-slate-300 text-slate-800" : entry.rank === 3 ? "bg-amber-700 text-white" : "bg-slate-100 text-slate-500"
                )}>
                  {entry.rank <= 3 ? <Medal className="w-4 h-4" /> : entry.rank}
                </div>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {entry.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <strong className="block text-sm text-slate-900 truncate">{entry.name}</strong>
                  <span className="text-xs text-slate-500">{entry.institution}</span>
                </div>

                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <strong className="block text-slate-900">{entry.approved}</strong>
                    <span className="text-xs text-slate-500">Approved</span>
                  </div>
                  <div className="text-center">
                    <strong className="block text-slate-900">{entry.streak}</strong>
                    <span className="text-xs text-slate-500">Day streak</span>
                  </div>
                </div>

                <div className="text-right">
                  <strong className="block text-forest-700">L${entry.earnings.toLocaleString()}</strong>
                  <span className="text-xs text-slate-500">Earned</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-slate-900">Top streak</strong>
                <span className="text-xs text-slate-500">15 days by Sarah Weah</span>
              </div>
            </div>
            <Progress value={15} max={30} size="md" color="gold" />
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-slate-900">Monthly growth</strong>
                <span className="text-xs text-slate-500">+18% vs last month</span>
              </div>
            </div>
            <Progress value={86} max={100} size="md" color="blue" />
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-slate-900">Active today</strong>
                <span className="text-xs text-slate-500">47 contributors recording</span>
              </div>
            </div>
            <Progress value={47} max={100} size="md" color="purple" />
          </Card>
        </div>
      </div>
    </section>
  );
}
