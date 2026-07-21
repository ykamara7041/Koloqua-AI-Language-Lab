"use client";

import { ArrowRight, Building2, Users, Award, MapPin } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import { institutions } from "@/app/lib/data";
import { toast } from "sonner";
import { motion } from "framer-motion";

const tierStyles = {
  platinum: "bg-surface-dark text-white",
  gold: "bg-amber-400 text-amber-950",
  silver: "bg-cream-dark text-charcoal",
};

export function Institutions() {
  return (
    <section className="max-w-6xl">
      <PageTitle
        eyebrow="Partner Network"
        title="Schools and Institutions"
        description="Coordinate trained contributors and reviewers through trusted Liberian institutions."
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        initial="hidden"
        animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      >
        {institutions.map((inst) => {
          const total = inst.approvedItems + inst.pendingItems;
          return (
            <motion.div key={inst.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <Card className="p-6 card-hover">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${tierStyles[inst.tier]} flex items-center justify-center shadow-md`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-charcoal">{inst.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-charcoal-light">
                        <MapPin className="w-3 h-3" /> {inst.city}, Liberia
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={inst.verified ? "success" : "warning"}>{inst.verified ? "Verified" : "Pending"}</Badge>
                    <Badge variant="default" className="capitalize">{inst.tier}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="p-3 rounded-lg bg-cream-light border border-cream-dark">
                    <div className="flex items-center gap-1 text-charcoal-light mb-1">
                      <Users className="w-3 h-3" />
                      <span className="text-[10px] font-semibold uppercase">Contributors</span>
                    </div>
                    <strong className="text-xl font-bold text-charcoal">{inst.contributors}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-cream-light border border-cream-dark">
                    <div className="flex items-center gap-1 text-charcoal-light mb-1">
                      <Award className="w-3 h-3" />
                      <span className="text-[10px] font-semibold uppercase">Approved</span>
                    </div>
                    <strong className="text-xl font-bold text-charcoal">{inst.approvedItems}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-cream-light border border-cream-dark">
                    <div className="flex items-center gap-1 text-charcoal-light mb-1">
                      <ArrowRight className="w-3 h-3" />
                      <span className="text-[10px] font-semibold uppercase">Pending</span>
                    </div>
                    <strong className="text-xl font-bold text-charcoal">{inst.pendingItems}</strong>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-charcoal-light">Approval rate</span>
                    <span className="font-bold text-forest-700">{Math.round((inst.approvedItems / total) * 100)}%</span>
                  </div>
                  <Progress value={inst.approvedItems} max={total} size="sm" barClassName="bg-forest-600" />
                </div>

                <Button variant="secondary" size="sm" onClick={() => toast.info(`Opening ${inst.name} details...`)}>
                  View institution <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <Button className="mt-6" onClick={() => toast.info("Institution invite flow will open once admin APIs are wired.")}>
        + Invite an institution
      </Button>
    </section>
  );
}
