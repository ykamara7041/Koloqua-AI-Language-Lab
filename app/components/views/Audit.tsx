"use client";

import { ScrollText, ShieldAlert, AlertTriangle, CheckCircle, Filter, Download, Lock } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { auditEvents } from "@/app/lib/data";
import { useAuth } from "@/app/contexts/AuthContext";
import { generateId } from "@/app/lib/security";
import { toast } from "sonner";

export function Audit() {
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
    if (process.env.NODE_ENV === "development") {
      console.log("[AUDIT]", event);
    }
  };

  if (!isAdmin) {
    logAccess("audit_log_access_denied", "audit_page");
    return (
      <section className="max-w-3xl">
        <PageTitle
          eyebrow="Restricted"
          title="Audit log"
          description="Only project administrators can view the transparency log."
        />
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-charcoal mb-2">Access denied</h2>
          <p className="text-sm text-charcoal-light mb-6">
            The audit log contains sensitive governance information. This action has been logged for review.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
            <Lock className="w-3 h-3" /> Admin-only permission
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="max-w-6xl">
      <PageTitle
        eyebrow="Audit Trail"
        title="Transparency Log"
        description="Every sensitive action is logged for accountability and data governance review."
      />

      <Card className="overflow-hidden">
        <div className="p-5 border-b border-cream-dark flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center text-forest-700">
              <ScrollText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-charcoal">{auditEvents.length} events logged</h3>
              <p className="text-xs text-charcoal-light">Last 30 days</p>
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
            <thead className="bg-cream-light">
              <tr>
                <th className="px-5 py-3 font-semibold text-xs text-charcoal-light uppercase tracking-wider">Event</th>
                <th className="px-5 py-3 font-semibold text-xs text-charcoal-light uppercase tracking-wider">Actor</th>
                <th className="px-5 py-3 font-semibold text-xs text-charcoal-light uppercase tracking-wider">Target</th>
                <th className="px-5 py-3 font-semibold text-xs text-charcoal-light uppercase tracking-wider">Time</th>
                <th className="px-5 py-3 font-semibold text-xs text-charcoal-light uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditEvents.map((event) => (
                <tr key={event.id} className="hover:bg-cream-light transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <ScrollText className="w-4 h-4 text-charcoal-light" />
                      <span className="font-medium text-charcoal">{event.action}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-charcoal-light">{event.actor}</td>
                  <td className="px-5 py-4 font-mono text-xs text-charcoal-light">{event.target}</td>
                  <td className="px-5 py-4 text-charcoal-light">
                    <time dateTime={event.timestamp}>{new Date(event.timestamp).toLocaleString()}</time>
                  </td>
                  <td className="px-5 py-4">
                    {event.risk === "high" ? (
                      <Badge variant="danger">
                        <ShieldAlert className="w-3 h-3" /> High
                      </Badge>
                    ) : event.risk === "medium" ? (
                      <Badge variant="warning">
                        <AlertTriangle className="w-3 h-3" /> Medium
                      </Badge>
                    ) : (
                      <Badge variant="success">
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
