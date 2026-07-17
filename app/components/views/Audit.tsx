"use client";

import { ScrollText, ShieldAlert, AlertTriangle, CheckCircle, Filter, Download } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { auditEvents } from "@/app/lib/data";
import { toast } from "sonner";

export function Audit() {
  return (
    <section className="max-w-6xl">
      <PageTitle
        eyebrow="Audit Trail"
        title="Transparency Log"
        description="Every sensitive action is logged for accountability and data governance review."
      />

      <Card className="overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center text-forest-700">
              <ScrollText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{auditEvents.length} events logged</h3>
              <p className="text-xs text-slate-500">Last 30 days</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button variant="secondary" size="sm" onClick={() => toast.success("Audit log exported.")}>
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Event</th>
                <th className="px-5 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Actor</th>
                <th className="px-5 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Target</th>
                <th className="px-5 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Time</th>
                <th className="px-5 py-3 font-semibold text-xs text-slate-500 uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditEvents.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <ScrollText className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{event.action}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{event.actor}</td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">{event.target}</td>
                  <td className="px-5 py-4 text-slate-500">
                    <time dateTime={event.timestamp}>{new Date(event.timestamp).toLocaleString()}</time>
                  </td>
                  <td className="px-5 py-4">
                    {event.risk === "high" ? (
                      <Badge tone="red">
                        <ShieldAlert className="w-3 h-3" /> High
                      </Badge>
                    ) : event.risk === "medium" ? (
                      <Badge tone="gold">
                        <AlertTriangle className="w-3 h-3" /> Medium
                      </Badge>
                    ) : (
                      <Badge tone="green">
                        <CheckCircle className="w-3 h-3" /> Low
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
