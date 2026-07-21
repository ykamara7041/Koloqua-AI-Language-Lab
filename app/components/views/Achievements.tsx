"use client";

import { Trophy, Medal, Star, Flame, Shield, CheckCircle, BookOpen, Heart, Award, Mic, Lock, Share2 } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import { achievements, leaderboard } from "@/app/lib/data";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Achievement } from "@/app/lib/types";

const iconMap = {
  mic: Mic,
  check: CheckCircle,
  flame: Flame,
  target: Trophy,
  shield: Shield,
  star: Star,
  book: BookOpen,
  heart: Heart,
  award: Award,
};


function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const Icon = iconMap[achievement.icon];
  const unlocked = !!achievement.unlockedAt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={clsx("p-5 h-full transition-all", unlocked && "border-forest-200 bg-gradient-to-br from-white to-forest-50/40")}>
        <div className="flex items-start gap-4">
          <div className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
            unlocked ? "bg-forest-600 text-white" : "bg-slate-100 text-slate-400"
          )}>
            {unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className={clsx("font-bold text-slate-900", !unlocked && "text-slate-500")}>{achievement.title}</h3>
              <Badge variant={achievement.rarity === "epic" ? "info" : achievement.rarity === "rare" ? "success" : "default"} className="capitalize">
                {achievement.rarity}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mb-3">{achievement.description}</p>

            <div className="flex items-center gap-3 mb-2">
              <Progress value={achievement.progress} max={achievement.total} size="sm" barClassName={unlocked ? "bg-forest-600" : "bg-gold-500"} className="flex-1" />
              <span className="text-xs font-semibold text-slate-600 shrink-0">
                {achievement.progress}/{achievement.total}
              </span>
            </div>

            {unlocked ? (
              <p className="text-xs text-forest-600 font-medium">Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}</p>
            ) : (
              <p className="text-xs text-slate-400">{achievement.total - achievement.progress} more to unlock</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function Achievements() {
  const unlocked = achievements.filter((a) => a.unlockedAt);
  const inProgress = achievements.filter((a) => !a.unlockedAt);
  const nextRank = leaderboard[3];

  const share = () => {
    toast.success("Achievement card copied to clipboard (demo).");
  };

  return (
    <section className="max-w-6xl space-y-8">
      <PageTitle
        eyebrow="Gamification"
        title="Achievements"
        description="Earn recognition for quality contributions, streaks, reviews, and community participation."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-forest-800 to-forest-950 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-300">Your progress</span>
              <div className="flex items-baseline gap-3 mt-2">
                <h2 className="text-5xl font-bold">{unlocked.length}</h2>
                <span className="text-forest-200">of {achievements.length} achievements unlocked</span>
              </div>
              <p className="text-sm text-forest-200/80 mt-2">
                You are {nextRank ? nextRank.approved - 176 : 50} approved contributions away from the next leaderboard rank.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-forest-700 border-4 border-forest-500 flex items-center justify-center text-white font-bold text-2xl">
                {unlocked.length * 125}
              </div>
              <div>
                <strong className="block text-white">Achievement points</strong>
                <span className="text-xs text-forest-300">+25 per unlock</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-center items-center text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Share your impact</h3>
          <p className="text-sm text-slate-500 mb-4">Post your achievement card to inspire other contributors.</p>
          <Button variant="secondary" size="sm" onClick={share}>
            <Share2 className="w-4 h-4" /> Copy card
          </Button>
        </Card>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Medal className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-bold text-slate-900">Unlocked</h2>
          <Badge variant="success">{unlocked.length}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unlocked.map((a, i) => (
            <AchievementCard key={a.id} achievement={a} index={i} />
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">In progress</h2>
          <Badge variant="warning">{inProgress.length}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inProgress.map((a, i) => (
            <AchievementCard key={a.id} achievement={a} index={i + unlocked.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
