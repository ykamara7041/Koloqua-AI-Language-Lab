"use client";

import { useState, useRef } from "react";
import { Play, Pause, AlertTriangle, Volume2, CheckCircle, XCircle, MessageSquareWarning, SkipForward, RotateCcw } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Textarea } from "@/app/components/ui/Textarea";
import { Badge } from "@/app/components/ui/Badge";
import { reviewItems } from "@/app/lib/data";
import { reviewNoteSchema } from "@/app/lib/validation";
import { sanitizeInput } from "@/app/lib/security";
import { clsx } from "clsx";
import { toast } from "sonner";

const flagLabels: Record<string, string> = {
  silence: "Leading/trailing silence detected",
  duration: "Clip shorter than 1.5 seconds",
  duplicate: "Possible duplicate audio",
  synthetic: "Synthetic voice risk flagged",
};

export function Review() {
  const [selected, setSelected] = useState(reviewItems[0]);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  const decide = (decision: "approve" | "reject" | "request-correction") => {
    setErrors({});
    const clean = sanitizeInput(note);
    const parsed = reviewNoteSchema.safeParse({ note: clean, decision });
    if (!parsed.success) {
      const mapped: Record<string, string> = {};
      parsed.error.issues.forEach((e) => (mapped[String(e.path[0])] = e.message));
      setErrors(mapped);
      return;
    }

    const label = decision === "approve" ? "Approved" : decision === "reject" ? "Rejected" : "Needs correction";
    setStatus((s) => ({ ...s, [selected.id]: label }));
    toast.success(`${selected.id} marked as ${label.toLowerCase()}`);
    setNote("");
  };

  return (
    <section className="max-w-6xl">
      <PageTitle
        eyebrow="Quality Control"
        title="Independent Review"
        description="Listen carefully and confirm that the text preserves the speaker's exact meaning."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <span className="section-title">Review Queue</span>
            <h3 className="text-base font-bold text-slate-900 mt-1">{reviewItems.length} items pending</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {reviewItems.map((item) => {
              const itemStatus = status[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={clsx(
                    "w-full p-4 text-left transition-all hover:bg-slate-50",
                    selected.id === item.id && "bg-forest-50/70 border-l-4 border-forest-500"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={clsx(
                      "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                      itemStatus === "Approved" ? "bg-emerald-100 text-emerald-700" : itemStatus === "Rejected" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"
                    )}>
                      {itemStatus === "Approved" ? <CheckCircle className="w-4 h-4" /> : itemStatus === "Rejected" ? <XCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">{item.id}</span>
                        <span className="text-xs font-bold text-forest-700">{item.quality}%</span>
                      </div>
                      <strong className="block text-sm text-slate-900 truncate">{item.text}</strong>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {item.flags && <Badge tone="gold">{flagLabels[item.flags]}</Badge>}
                        {itemStatus && <Badge tone={itemStatus === "Approved" ? "green" : itemStatus === "Rejected" ? "red" : "gold"}>{itemStatus}</Badge>}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="section-title">{selected.id}</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-1 font-display">{selected.text}</h2>
            </div>
            <Badge tone={selected.flags ? "gold" : "green"}>{selected.flags ? "Needs attention" : "Quality good"}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Standard English</span>
              <p className="text-lg text-slate-900 mt-1">{selected.translation}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Speaker & Meta</span>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <strong className="block text-sm text-slate-900">{selected.speaker}</strong>
                  <span className="text-xs text-slate-500">{new Date(selected.submittedAt).toLocaleDateString()}</span>
                </div>
                <div className="text-right">
                  <strong className="block text-sm text-slate-900">{selected.duration}s</strong>
                  <span className="text-xs text-slate-500">Duration</span>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-5 mb-6 bg-gradient-to-br from-forest-50 to-emerald-50/50 border-forest-100">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-forest-700 text-white flex items-center justify-center hover:bg-forest-800 transition-colors shadow-md"
              >
                {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="h-12 flex items-center gap-[3px]">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-forest-300"
                      style={{ height: `${12 + (i * 17) % 36}px` }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>0:0{currentTime.toFixed(0)}</span>
                  <span>0:0{selected.duration}</span>
                </div>
              </div>
            </div>
            <audio
              ref={audioRef}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onEnded={() => setPlaying(false)}
              className="hidden"
            />
          </Card>

          {selected.flags && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="text-sm text-amber-800">Quality flag: {flagLabels[selected.flags]}</strong>
                <p className="text-xs text-amber-700 mt-0.5">Review carefully before making a decision.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Audio clear", icon: Volume2, ok: selected.quality > 70 },
              { label: "Text matches", icon: CheckCircle, ok: true },
              { label: "No duplicate", icon: RotateCcw, ok: selected.flags !== "duplicate" },
              { label: "Natural voice", icon: MessageSquareWarning, ok: selected.flags !== "synthetic" },
            ].map((check) => (
              <div key={check.label} className={clsx("p-3 rounded-xl border flex items-center gap-2", check.ok ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100")}>
                <check.icon className={clsx("w-4 h-4 shrink-0", check.ok ? "text-emerald-700" : "text-amber-600")} />
                <span className={clsx("text-xs font-medium", check.ok ? "text-emerald-800" : "text-amber-800")}>{check.label}</span>
              </div>
            ))}
          </div>

          <Textarea
            label="Reviewer note"
            placeholder="Add a correction or explain your decision..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            error={errors.note}
          />

          <div className="flex flex-wrap gap-3 mt-6">
            <Button variant="danger" onClick={() => decide("reject")}>
              <XCircle className="w-4 h-4" /> Reject
            </Button>
            <Button variant="secondary" onClick={() => decide("request-correction")}>
              <MessageSquareWarning className="w-4 h-4" /> Request correction
            </Button>
            <Button onClick={() => decide("approve")}>
              <CheckCircle className="w-4 h-4" /> Approve
            </Button>
            <Button variant="ghost" className="ml-auto">
              <SkipForward className="w-4 h-4" /> Skip
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
