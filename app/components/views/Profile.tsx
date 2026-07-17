"use client";

import { useState } from "react";
import { UserCircle, Mail, Building2, ShieldCheck, Trophy, Mic, CheckCircle } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import { useAuth } from "@/app/contexts/AuthContext";
import { achievements } from "@/app/lib/data";
import { toast } from "sonner";

const iconMap: Record<string, React.ReactNode> = {
  mic: <Mic className="w-4 h-4" />,
  check: <CheckCircle className="w-4 h-4" />,
  flame: <Trophy className="w-4 h-4" />,
  target: <Trophy className="w-4 h-4" />,
  shield: <ShieldCheck className="w-4 h-4" />,
};

export function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [institution, setInstitution] = useState(user?.institution || "");

  if (!user) {
    return <p className="text-slate-500">Please sign in to view your profile.</p>;
  }

  return (
    <section className="max-w-5xl">
      <PageTitle
        eyebrow="Account"
        title="Your Profile"
        description="Manage your identity and institution affiliation."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-forest-500 to-forest-700 text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-lg">
              {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <h3 className="font-bold text-xl text-slate-900">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.email}</p>
            <Badge tone="green" className="mt-3">
              <ShieldCheck className="w-3 h-3" /> {user.role}
            </Badge>
            <div className="w-full border-t border-slate-100 mt-6 pt-6 text-left">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500">Joined</span>
                <span className="font-medium text-slate-900">{user.joinedAt}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500">Contributions</span>
                <span className="font-medium text-slate-900">86</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Approval rate</span>
                <span className="font-medium text-slate-900">91%</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-5">
          <Card className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-5">Personal information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<UserCircle className="w-4 h-4" />}
              />
              <Input
                label="Email"
                type="email"
                value={user.email}
                disabled
                icon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                icon={<Building2 className="w-4 h-4" />}
              />
              <Input
                label="Role"
                value={user.role}
                disabled
                icon={<ShieldCheck className="w-4 h-4" />}
              />
            </div>
            <Button className="mt-5" onClick={() => toast.success("Profile updated.")}>
              Save changes
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-5">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <div key={ach.id} className={`p-4 rounded-xl border ${ach.unlockedAt ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50 border-slate-100"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ach.unlockedAt ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                      {iconMap[ach.icon] || <Trophy className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm text-slate-900">{ach.title}</strong>
                        {ach.unlockedAt && <Badge tone="green">Unlocked</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{ach.description}</p>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">{ach.progress}/{ach.total}</span>
                          <span className="font-medium text-forest-700">{Math.round((ach.progress / ach.total) * 100)}%</span>
                        </div>
                        <Progress value={ach.progress} max={ach.total} size="sm" color="forest" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
