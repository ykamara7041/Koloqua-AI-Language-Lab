"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, ThumbsUp, ThumbsDown, SkipForward, AlertTriangle, CheckCircle, Headphones, Clock } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import { validationClips } from "@/app/lib/data";
import { clsx } from "clsx";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function Validate() {
  const [clips, setClips] = useState(validationClips);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [votes, setVotes] = useState<Record<string, "yes" | "no" | "skip">>({});
  const [stats, setStats] = useState({ yes: 0, no: 0, skip: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = clips[index];
  const voted = votes[current.id];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  const vote = (decision: "yes" | "no" | "skip") => {
    if (voted) return;

    setVotes((prev) => ({ ...prev, [current.id]: decision }));
    setStats((prev) => ({ ...prev, [decision]: prev[decision] + 1 }));
    setClips((prev) =>
      prev.map((c) =>
        c.id === current.id
          ? { ...c, yesVotes: decision === "yes" ? c.yesVotes + 1 : c.yesVotes, noVotes: decision === "no" ? c.noVotes + 1 : c.noVotes }
          : c
      )
    );

    const message = decision === "yes" ? "Clip validated" : decision === "no" ? "Clip rejected" : "Clip skipped";
    toast.success(`${message} · ${current.id}`);

    if (decision !== "skip") {
      setTimeout(() => next(), 400);
    }
  };

  const next = () => {
    setIndex((i) => (i + 1) % clips.length);
    setPlaying(false);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + clips.length) % clips.length);
    setPlaying(false);
  };

  const progress = ((index + (voted ? 1 : 0)) / clips.length) * 100;

  return (
    <section className="max-w-5xl">
      <PageTitle
        eyebrow="Listen"
        title="Validate Clips"
        description="Listen to Koloqua recordings and vote whether they match the text. Inspired by community validation flows used for Nigerian Pidgin and other Common Voice languages."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center text-forest-600">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Clip {index + 1} of {clips.length}</p>
                <p className="text-xs text-slate-500">{current.speaker} · {current.duration}s · quality {current.quality}%</p>
              </div>
            </div>
            <Badge tone={voted === "yes" ? "green" : voted === "no" ? "red" : "gold"}>
              {voted ? `You voted ${voted}` : "Listening"}
            </Badge>
          </div>

          <Progress value={progress} max={100} size="sm" color="forest" className="mb-8" />

          <div className="p-6 rounded-2xl bg-gradient-to-br from-forest-50 to-emerald-50/50 border border-forest-100 mb-8">
            <div className="flex flex-col items-center">
              <button
                onClick={togglePlay}
                className={clsx(
                  "w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-xl hover:scale-105 mb-4",
                  playing ? "bg-coral-500 hover:bg-coral-600" : "bg-forest-700 hover:bg-forest-800"
                )}
              >
                {playing ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>
              <div className="h-16 flex items-end justify-center gap-[3px] w-full max-w-xs">
                {Array.from({ length: 48 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-forest-400"
                    animate={playing ? { height: [12, 20 + (i * 13) % 48, 16, 28 + (i * 7) % 32, 12] } : { height: 12 }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.02 }}
                  />
                ))}
              </div>
              <audio
                ref={audioRef}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Koloqua text</span>
              <p className="text-lg font-semibold text-slate-900 mt-1">{current.text}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Standard English meaning</span>
              <p className="text-lg text-slate-700 mt-1">{current.translation}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="danger"
              onClick={() => vote("no")}
              disabled={!!voted}
              className={clsx(voted === "no" && "ring-2 ring-red-300")}
            >
              <ThumbsDown className="w-4 h-4" /> No — does not match
            </Button>
            <Button
              onClick={() => vote("yes")}
              disabled={!!voted}
              className={clsx(voted === "yes" && "ring-2 ring-emerald-300")}
            >
              <ThumbsUp className="w-4 h-4" /> Yes — matches
            </Button>
            <Button
              variant="ghost"
              onClick={() => vote("skip")}
              disabled={!!voted}
              className="ml-auto"
            >
              <SkipForward className="w-4 h-4" /> Skip
            </Button>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
            <button onClick={prev} className="text-sm font-medium text-slate-500 hover:text-forest-700 transition-colors">← Previous clip</button>
            <button onClick={next} className="text-sm font-medium text-slate-500 hover:text-forest-700 transition-colors">Next clip →</button>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="w-5 h-5 text-forest-600" />
              <strong className="text-slate-900">Validation guide</strong>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                Vote yes if the recording matches the text.
              </li>
              <li className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                Vote no if there is background noise, wrong text, or synthetic voice.
              </li>
              <li className="flex gap-2">
                <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                Skip if you cannot decide or the audio is unclear.
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <strong className="text-slate-900">Your session</strong>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Yes votes</span>
                <strong className="text-emerald-700">{stats.yes}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">No votes</span>
                <strong className="text-red-700">{stats.no}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Skipped</span>
                <strong className="text-slate-700">{stats.skip}</strong>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
