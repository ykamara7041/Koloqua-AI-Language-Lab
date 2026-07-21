"use client";

import { Target, Calendar, PauseCircle, PlayCircle, Users, Wallet } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import { campaigns } from "@/app/lib/data";
import { toast } from "sonner";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export function Campaigns() {
  return (
    <section className="max-w-6xl">
      <PageTitle
        eyebrow="Campaigns"
        title="Collection Drives"
        description="Track progress, deadlines, and targets for each themed collection campaign."
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        initial="hidden"
        animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      >
        {campaigns.map((campaign) => (
          <motion.div key={campaign.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <Card className="p-6 card-hover">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-11 h-11 rounded-xl flex items-center justify-center",
                    campaign.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  )}>
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{campaign.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Calendar className="w-3 h-3" /> Deadline: {campaign.deadline}
                    </div>
                  </div>
                </div>
                <Badge variant={campaign.status === "active" ? "success" : campaign.status === "paused" ? "warning" : "default"}>
                  {campaign.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <Users className="w-3 h-3" />
                    <span className="text-[10px] font-semibold uppercase">Collected</span>
                  </div>
                  <strong className="text-xl font-bold text-slate-900">{campaign.collected}</strong>
                  <span className="text-xs text-slate-500"> / {campaign.target}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <Wallet className="w-3 h-3" />
                    <span className="text-[10px] font-semibold uppercase">Reward/item</span>
                  </div>
                  <strong className="text-xl font-bold text-slate-900">L${campaign.rewardPerItem}</strong>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-forest-700">{Math.round((campaign.collected / campaign.target) * 100)}%</span>
                </div>
                <Progress value={campaign.collected} max={campaign.target} size="md" barClassName={campaign.status === "active" ? "bg-forest-600" : "bg-gold-500"} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Sponsored by {campaign.sponsor}</span>
                <Button variant="secondary" size="sm" onClick={() => toast.info(`${campaign.name} status toggled (demo).`)}>
                  {campaign.status === "active" ? (
                    <> <PauseCircle className="w-4 h-4" /> Pause</>
                  ) : (
                    <> <PlayCircle className="w-4 h-4" /> Resume</>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
