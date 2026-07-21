"use client";

import { useState } from "react";
import { Mic, Square, RotateCcw, CheckCircle, AlertTriangle, Sparkles, Play } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Textarea } from "@/app/components/ui/Textarea";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import { useRecording } from "@/app/hooks/useRecording";
import { tasks } from "@/app/lib/data";
import { sanitizeInput, looksLikeInjection } from "@/app/lib/security";
import { contributionSchema } from "@/app/lib/validation";
import { clsx } from "clsx";
import { toast } from "sonner";
import { motion } from "framer-motion";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function AudioWaveform({ recording }: { recording: boolean }) {
  return (
    <div className="flex items-end justify-center gap-[3px] h-16">
      {Array.from({ length: 48 }).map((_, i) => {
        const height = recording ? 20 + Math.random() * 60 : 12;
        return (
          <motion.div
            key={i}
            className="w-1 rounded-full bg-forest-400/80"
            animate={recording ? { height: [12, height, 16, height * 0.8, 12] } : { height: 12 }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.03 }}
            style={{ height: recording ? undefined : 12 }}
          />
        );
      })}
    </div>
  );
}

export function Contribute() {
  const [activeTask, setActiveTask] = useState(tasks[0]);
  const [koloqua, setKoloqua] = useState("");
  const [context, setContext] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { recording, seconds, audioUrl, error, start, stop, reset } = useRecording();

  const submit = () => {
    setErrors({});
    const cleanKoloqua = sanitizeInput(koloqua);
    const cleanContext = sanitizeInput(context);

    if (looksLikeInjection(koloqua) || looksLikeInjection(context)) {
      setErrors({ form: "Potentially unsafe characters were removed. Please review your text." });
      return;
    }

    const result = contributionSchema.safeParse({ koloqua: cleanKoloqua, context: cleanContext, consent });
    if (!result.success) {
      const mapped: Record<string, string> = {};
      result.error.issues.forEach((e) => (mapped[String(e.path[0])] = e.message));
      setErrors(mapped);
      return;
    }
    if (!audioUrl) {
      setErrors({ form: "Record your voice before submitting." });
      return;
    }

    toast.success("Contribution KL-1051 sent for independent review.");
    setKoloqua("");
    setContext("");
    setConsent(false);
    reset();
  };

  const simulateTranscription = () => {
    if (!audioUrl) {
      toast.error("Record audio first to use AI transcription.");
      return;
    }
    setIsTranscribing(true);
    setTimeout(() => {
      setKoloqua("I dey go market.");
      setIsTranscribing(false);
      toast.success("AI transcription complete. Please review and edit.");
    }, 1800);
  };

  return (
    <section className="max-w-6xl">
      <PageTitle
        eyebrow="Contribute Speech"
        title="Record Koloqua"
        description="Translate the prompt, speak naturally, and confirm your consent."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <span className="section-title">Prepared Sentences</span>
            <h3 className="text-base font-bold text-slate-900 mt-1">Choose a task</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setActiveTask(task)}
                className={clsx(
                  "w-full p-4 text-left transition-all hover:bg-slate-50",
                  activeTask.id === task.id && "bg-forest-50/70 border-l-4 border-forest-500"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={task.category === "Health" ? "info" : task.category === "Market" ? "warning" : "success"}>{task.category}</Badge>
                  <span className="text-xs font-bold text-forest-700">L${task.reward}</span>
                </div>
                <strong className="block text-sm text-slate-900 mb-2">{task.english}</strong>
                <Progress value={task.done} max={task.total} size="sm" barClassName="bg-forest-600" />
              </button>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <div className="mb-6">
            <span className="section-title">English Prompt</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">{activeTask.english}</h2>
            <p className="text-sm text-slate-500 mt-1">Category: {activeTask.category} · Difficulty: {activeTask.difficulty} · Reward: L${activeTask.reward}</p>
          </div>

          <Card className="p-6 mb-6 bg-gradient-to-br from-forest-50 to-emerald-50/50 border-forest-100">
            <div className="flex flex-col items-center">
              <AudioWaveform recording={recording} />
              <div className="text-4xl font-bold text-slate-900 font-mono mt-3">{formatTime(seconds)}</div>
              <p className="text-xs text-slate-500 mt-1">{recording ? "Recording in progress..." : audioUrl ? "Recording complete" : "Ready to record"}</p>

              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={() => (recording ? stop() : start())}
                  className={clsx(
                    "w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-lg hover:scale-105",
                    recording ? "bg-coral-500 hover:bg-coral-600 animate-pulse" : "bg-forest-700 hover:bg-forest-800"
                  )}
                  aria-label={recording ? "Stop recording" : "Start recording"}
                >
                  {recording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6" />}
                </button>
                {audioUrl && (
                  <button onClick={reset} className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors" aria-label="Re-record">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </Card>

          {audioUrl && (
            <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-forest-700 text-white flex items-center justify-center">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
              <audio controls src={audioUrl} className="flex-1" />
            </div>
          )}

          {error && <p className="text-sm text-coral-600 mb-4">{error}</p>}

          <div className="space-y-4 mb-6">
            <div className="relative">
              <Textarea
                label="Koloqua transcription"
                placeholder="Type exactly what you said in Koloqua..."
                value={koloqua}
                onChange={(e) => setKoloqua(e.target.value)}
                error={errors.koloqua}
              />
              <button
                onClick={simulateTranscription}
                disabled={isTranscribing || !audioUrl}
                className="absolute right-2 top-8 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-amber-100 disabled:opacity-50 transition-colors border border-amber-100"
              >
                <Sparkles className="w-3 h-3" />
                {isTranscribing ? "Transcribing..." : "AI Transcribe"}
              </button>
            </div>
            <Textarea
              label="Context or dialect note (optional)"
              placeholder="Where is this phrase commonly used?"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              error={errors.context}
            />
          </div>

          <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-forest-300 transition-colors mb-6">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="w-5 h-5 accent-forest-600 mt-0.5" />
            <div>
              <strong className="block text-sm text-slate-900">I agree to contribute my voice</strong>
              <p className="text-xs text-slate-500 mt-1">My recording may be reviewed and, if approved, included in a licensed open dataset. I can revoke consent later.</p>
            </div>
          </label>
          {errors.consent && <p className="text-xs text-coral-600 mb-4">{errors.consent}</p>}

          {errors.form && (
            <div className="flex items-center gap-2 text-sm text-coral-600 mb-4 p-3 rounded-lg bg-coral-50 border border-coral-100">
              <AlertTriangle className="w-4 h-4" /> {errors.form}
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={submit}>
              <CheckCircle className="w-4 h-4" /> Submit contribution
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
