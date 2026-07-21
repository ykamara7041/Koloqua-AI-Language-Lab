"use client";

import { Database, Download, FileJson, FileSpreadsheet, FileAudio, CheckCircle, Calendar, ShieldAlert, Lock } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { datasetReleases } from "@/app/lib/data";
import { useAuth } from "@/app/contexts/AuthContext";
import { generateId } from "@/app/lib/security";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function Export() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const logAccess = (action: string, target: string) => {
    const event = {
      id: generateId("AUD"),
      actor: user?.email || "anonymous",
      action,
      target,
      timestamp: new Date().toISOString(),
      risk: "high" as const,
    };
    // In production this would POST to an immutable audit API.
    if (process.env.NODE_ENV === "development") {
      console.log("[AUDIT]", event);
    }
  };

  if (!isAdmin) {
    logAccess("dataset_access_denied", "export_page");
    return (
      <section className="max-w-3xl">
        <PageTitle
          eyebrow="Restricted"
          title="Dataset export"
          description="Only project administrators can download or export approved datasets."
        />
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access denied</h2>
          <p className="text-sm text-slate-500 mb-6">
            Dataset exports contain sensitive voice recordings and governed language data. This action has been logged for review.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
            <Lock className="w-3 h-3" /> Admin-only permission
          </div>
        </Card>
      </section>
    );
  }

  const download = (format: string, version: string) => {
    logAccess(`dataset_download_${format}`, version);
    toast.success(`${format.toUpperCase()} export for ${version} prepared.`);
  };

  return (
    <section className="max-w-6xl">
      <PageTitle
        eyebrow="Dataset Releases"
        title="Export Approved Data"
        description="Download versioned, governance-approved datasets for research and model training."
      />

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        initial="hidden"
        animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      >
        {datasetReleases.map((release) => (
          <motion.div key={release.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <Card className="p-6 card-hover">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-700 to-forest-900 flex items-center justify-center text-white">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">{release.version}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <Calendar className="w-3 h-3" /> Released {release.releasedAt}
                    </div>
                  </div>
                </div>
                <Badge variant="success"><CheckCircle className="w-3 h-3" /> Approved</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="block text-2xl font-bold text-slate-900">{release.records.toLocaleString()}</strong>
                  <span className="text-xs text-slate-500">Records</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="block text-2xl font-bold text-slate-900">{release.hours}</strong>
                  <span className="text-xs text-slate-500">Hours</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="block text-sm truncate text-slate-900">{release.license}</strong>
                  <span className="text-xs text-slate-500">License</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => download("json", release.version)}>
                  <FileJson className="w-4 h-4" /> JSON
                </Button>
                <Button variant="secondary" size="sm" onClick={() => download("csv", release.version)}>
                  <FileSpreadsheet className="w-4 h-4" /> CSV
                </Button>
                <Button variant="secondary" size="sm" onClick={() => download("wav", release.version)}>
                  <FileAudio className="w-4 h-4" /> WAV
                </Button>
                <Button size="sm" onClick={() => download("bundle", release.version)}>
                  <Download className="w-4 h-4" /> Bundle
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
