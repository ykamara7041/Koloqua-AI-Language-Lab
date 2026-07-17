"use client";

import { useState } from "react";
import { FileCheck, Shield, UserX, Users, Download, AlertCircle } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Badge } from "@/app/components/ui/Badge";
import { useAuth } from "@/app/contexts/AuthContext";
import { consentRecords } from "@/app/lib/data";
import { toast } from "sonner";

export function Consent() {
  const { user } = useAuth();
  const [agreed, setAgreed] = useState(user?.hasConsented ?? false);
  const [guardianName, setGuardianName] = useState("");
  const [minor] = useState(!user?.isAdult);

  const recordConsent = () => {
    if (minor && guardianName.trim().length < 3) {
      toast.error("Please provide a parent or guardian name.");
      return;
    }
    setAgreed(true);
    toast.success(minor ? "Guardian consent recorded." : "Consent recorded. You can revoke it at any time.");
  };

  return (
    <section className="max-w-6xl">
      <PageTitle
        eyebrow="Consent Center"
        title="Your data, your choice"
        description="Informed, revocable consent is required before any voice or text is used for training."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-forest-50 flex items-center justify-center text-forest-700">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Consent statement v1.2</h3>
              <p className="text-xs text-slate-500">Last updated: July 2026</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {[
              { icon: Shield, text: "My recordings and text may be reviewed by independent validators before being used." },
              { icon: FileCheck, text: "Approved data may be released under a governance-approved open license." },
              { icon: UserX, text: "I can revoke consent at any time, and my identity data is stored separately from language data." },
              { icon: Users, text: "If I am under 18, a parent or guardian must also provide consent." },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <item.icon className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          {minor && (
            <div className="bg-amber-50 rounded-xl p-5 mb-6 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <strong className="text-sm text-amber-800">Guardian consent required</strong>
              </div>
              <Input
                label="Parent or guardian full name"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Mary Kollie"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={recordConsent} disabled={agreed}>
              {agreed ? "Consent recorded" : "I agree to contribute"}
            </Button>
            <Button variant="secondary" onClick={() => toast.info("Consent revocation request sent to admin.")}>
              <UserX className="w-4 h-4" /> Revoke consent
            </Button>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <span className="section-title">Consent History</span>
            <div className="mt-4 space-y-4">
              {consentRecords.map((rec) => (
                <div key={rec.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm text-slate-900">{rec.version}</strong>
                    <Badge tone="green">Active</Badge>
                  </div>
                  <time className="text-xs text-slate-500" dateTime={rec.agreedAt}>
                    {new Date(rec.agreedAt).toLocaleDateString()}
                  </time>
                  {rec.guardian && <p className="text-xs text-amber-700 mt-1">{rec.guardian}</p>}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm text-slate-900">Download consent form</strong>
                <span className="text-xs text-slate-500">PDF · 124 KB</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="w-full" onClick={() => toast.success("Consent form downloaded.")}>
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
