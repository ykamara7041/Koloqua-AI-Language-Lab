"use client";

import { motion } from "framer-motion";
import { Mic, Shield, Users, BookOpen, ArrowRight, Play, CheckCircle } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center text-white font-bold">K</div>
            <span className="font-bold text-slate-900">Koloqua AI</span>
          </div>
          <Button size="sm" onClick={onStart}>Get started</Button>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-50/50 to-white pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-50 border border-forest-100 text-forest-700 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
              Pilot program now live in Liberia
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 font-display">
              Preserving Liberia&apos;s voice for the age of AI
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              A community-powered language lab collecting, verifying, and publishing Koloqua speech and text with informed consent and transparent rewards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={onStart}>
                Join the pilot <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="lg">
                <Play className="w-5 h-5" /> Watch how it works
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated p-2">
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 sm:p-10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                  {[
                    { value: "1,248", label: "Contributions" },
                    { value: "312", label: "Active speakers" },
                    { value: "4", label: "Partner institutions" },
                    { value: "87%", label: "Quality score" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <strong className="block text-3xl font-bold text-forest-700">{stat.value}</strong>
                      <span className="text-sm text-slate-500">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-title">How it works</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 font-display">Built for community, powered by people</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: "Record",
                desc: "Contributors record natural Koloqua speech from prepared prompts or free conversation.",
              },
              {
                icon: Users,
                title: "Review",
                desc: "Independent reviewers validate transcription, translation, and audio quality before approval.",
              },
              {
                icon: BookOpen,
                title: "Publish",
                desc: "Approved data is released under governance-approved licenses for research and AI training.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-soft card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center text-forest-600 mb-5">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-title">Principles</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 font-display">Technology that respects the people behind the data</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Informed consent", desc: "Revocable and clearly explained before any data is used." },
              { icon: Users, title: "Community ownership", desc: "Liberians shape how the language is represented." },
              { icon: CheckCircle, title: "Verified quality", desc: "Two independent reviews for every training item." },
              { icon: BookOpen, title: "Open governance", desc: "Dataset licenses approved by project governance." },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl border border-slate-200 bg-white"
              >
                <div className="w-10 h-10 rounded-lg bg-forest-50 flex items-center justify-center text-forest-600 mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-forest-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-display">Ready to contribute?</h2>
          <p className="text-forest-200 text-lg mb-8 max-w-xl mx-auto">Join schools, reviewers, and contributors across Liberia in building the first community-owned Koloqua language dataset.</p>
          <Button size="lg" variant="white" onClick={onStart}>
            Start contributing <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      <footer className="py-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          © 2026 Koloqua AI Language Lab. Pilot release.
        </div>
      </footer>
    </div>
  );
}
