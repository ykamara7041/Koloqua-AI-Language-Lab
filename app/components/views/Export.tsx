"use client";

import { Database, Download, FileJson, FileSpreadsheet, FileAudio, CheckCircle, Calendar } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { datasetReleases } from "@/app/lib/data";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function Export() {
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
                <Badge tone="green"><CheckCircle className="w-3 h-3" /> Approved</Badge>
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
                <Button variant="secondary" size="sm" onClick={() => toast.success(`JSON export for ${release.version} prepared.`)}>
                  <FileJson className="w-4 h-4" /> JSON
                </Button>
                <Button variant="secondary" size="sm" onClick={() => toast.success(`CSV export for ${release.version} prepared.`)}>
                  <FileSpreadsheet className="w-4 h-4" /> CSV
                </Button>
                <Button variant="secondary" size="sm" onClick={() => toast.success(`WAV archive for ${release.version} prepared.`)}>
                  <FileAudio className="w-4 h-4" /> WAV
                </Button>
                <Button size="sm" onClick={() => toast.success(`Full bundle for ${release.version} prepared.`)}>
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
