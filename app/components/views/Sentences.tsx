"use client";

import { useState } from "react";
import { BookOpen, Plus, CheckCircle, Clock, ThumbsUp, ThumbsDown, Lightbulb, AlertTriangle } from "lucide-react";
import { PageTitle } from "@/app/components/layout/PageTitle";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Badge } from "@/app/components/ui/Badge";
import { sentencePromptSchema } from "@/app/lib/validation";
import { sanitizeInput, looksLikeInjection } from "@/app/lib/security";
import { sentencePrompts } from "@/app/lib/data";
import { generateId } from "@/app/lib/security";

import { toast } from "sonner";
import { motion } from "framer-motion";

const categories = ["Daily life", "Health", "Market", "Environment", "Education", "Culture", "Travel"];

const statusLabels: Record<string, string> = {
  approved: "Approved for recording",
  pending: "Awaiting community review",
  rejected: "Not accepted",
};

export function Sentences() {
  const [prompts, setPrompts] = useState(sentencePrompts);
  const [english, setEnglish] = useState("");
  const [koloqua, setKoloqua] = useState("");
  const [category, setCategory] = useState("Daily life");
  const [sourceNote, setSourceNote] = useState("");
  const [original, setOriginal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    setErrors({});
    const cleanEnglish = sanitizeInput(english);
    const cleanKoloqua = sanitizeInput(koloqua);
    const cleanSource = sanitizeInput(sourceNote);

    if (looksLikeInjection(english) || looksLikeInjection(koloqua) || looksLikeInjection(sourceNote)) {
      setErrors({ form: "Potentially unsafe characters were removed. Please review your text." });
      return;
    }

    const parsed = sentencePromptSchema.safeParse({
      english: cleanEnglish,
      koloqua: cleanKoloqua,
      category,
      sourceNote: cleanSource,
      original,
    });

    if (!parsed.success) {
      const mapped: Record<string, string> = {};
      parsed.error.issues.forEach((e) => (mapped[String(e.path[0])] = e.message));
      setErrors(mapped);
      return;
    }

    const newPrompt = {
      id: generateId("SP"),
      english: cleanEnglish,
      koloqua: cleanKoloqua,
      category,
      contributor: "You",
      submittedAt: new Date().toISOString().slice(0, 10),
      status: "pending" as const,
      votes: 1,
      sourceNote: cleanSource,
    };

    setPrompts([newPrompt, ...prompts]);
    setEnglish("");
    setKoloqua("");
    setSourceNote("");
    setOriginal(false);
    toast.success("Sentence submitted for community review.");
  };

  const vote = (id: string, direction: "up" | "down") => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, votes: Math.max(0, p.votes + (direction === "up" ? 1 : -1)) } : p))
    );
    toast.success(`Vote recorded for ${id}.`);
  };

  return (
    <section className="max-w-6xl">
      <PageTitle
        eyebrow="Write"
        title="Sentence Contributions"
        description="Submit original English and Koloqua sentence pairs for other contributors to record."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center text-terracotta">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-charcoal">Submit a new sentence</h3>
              <p className="text-xs text-charcoal-light">Only original or public-domain sentences are accepted.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Textarea
              label="Standard English sentence"
              placeholder="Write the English sentence here..."
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              error={errors.english}
              className="min-h-[120px]"
            />
            <Textarea
              label="Koloqua translation"
              placeholder="Write the Koloqua version here..."
              value={koloqua}
              onChange={(e) => setKoloqua(e.target.value)}
              error={errors.koloqua}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <label className="label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <Input
              label="Source or dialect note (optional)"
              placeholder="Where did you hear this phrase?"
              value={sourceNote}
              onChange={(e) => setSourceNote(e.target.value)}
              error={errors.sourceNote}
            />
          </div>

          <label className="flex items-start gap-3 p-4 rounded-xl border border-cream-dark cursor-pointer hover:border-forest-300 transition-colors mb-4">
            <input
              type="checkbox"
              checked={original}
              onChange={(e) => setOriginal(e.target.checked)}
              className="w-5 h-5 accent-forest-600 mt-0.5"
            />
            <div>
              <strong className="block text-sm text-charcoal">This is my own original sentence</strong>
              <p className="text-xs text-charcoal-light mt-1">I wrote it myself or it is in the public domain. No copyrighted text.</p>
            </div>
          </label>
          {errors.original && <p className="text-xs text-coral-600 mb-4">{errors.original}</p>}

          {errors.form && (
            <div className="flex items-center gap-2 text-sm text-coral-600 mb-4 p-3 rounded-lg bg-coral-50 border border-coral-100">
              <AlertTriangle className="w-4 h-4" /> {errors.form}
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={submit}>
              <Plus className="w-4 h-4" /> Submit sentence
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-forest-50 to-emerald-50/50 border-forest-100">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-terracotta" />
            <strong className="text-charcoal">Why sentences matter</strong>
          </div>
          <ul className="space-y-3 text-sm text-charcoal-light">
            <li className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-forest-500 shrink-0 mt-0.5" />
              More prompts mean more diverse recordings.
            </li>
            <li className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-forest-500 shrink-0 mt-0.5" />
              Community voting keeps quality high.
            </li>
            <li className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-forest-500 shrink-0 mt-0.5" />
              Each approved sentence earns a small reward.
            </li>
          </ul>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-charcoal">Community sentences</h2>
          <Badge variant="success">{prompts.length} submitted</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prompts.map((prompt, i) => (
            <motion.div key={prompt.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={prompt.status === "approved" ? "success" : prompt.status === "rejected" ? "danger" : "warning"}>
                    {prompt.status}
                  </Badge>
                  <span className="text-xs text-charcoal-light">{prompt.id}</span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-charcoal-light">{prompt.english}</p>
                  <p className="text-base font-semibold text-charcoal">{prompt.koloqua}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-charcoal-light mb-4">
                  <span className="px-2 py-1 rounded-md bg-cream-light">{prompt.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {prompt.submittedAt}
                  </span>
                  <span>By {prompt.contributor}</span>
                </div>

                {prompt.sourceNote && (
                  <p className="text-xs text-charcoal-light mb-3 italic">“{prompt.sourceNote}”</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => vote(prompt.id, "up")}
                      className="p-1.5 rounded-lg hover:bg-emerald-50 text-charcoal-light hover:text-emerald-600 transition-colors"
                      aria-label="Upvote"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold text-charcoal-light min-w-[20px] text-center">{prompt.votes}</span>
                    <button
                      onClick={() => vote(prompt.id, "down")}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-charcoal-light hover:text-red-600 transition-colors"
                      aria-label="Downvote"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-charcoal-light">{statusLabels[prompt.status]}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
