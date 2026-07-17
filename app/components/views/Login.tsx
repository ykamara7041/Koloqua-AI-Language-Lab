"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Card } from "@/app/components/ui/Card";
import { useAuth } from "@/app/contexts/AuthContext";
import { validatePassword } from "@/app/lib/security";
import { emailSchema } from "@/app/lib/validation";
import type { Role } from "@/app/lib/types";
import { ArrowLeft, Shield } from "lucide-react";

interface LoginProps {
  onBack: () => void;
}

export function Login({ onBack }: LoginProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("contributor");
  const [isAdult, setIsAdult] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const next: Record<string, string> = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) next.email = emailResult.error.issues[0].message;

    const pwdResult = validatePassword(password);
    if (!pwdResult.ok) next.password = pwdResult.reason || "Invalid password";

    if (mode === "register" && name.trim().length < 2) next.name = "Enter your full name.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setSubmitting(true);
    const result = mode === "login" ? login(email, password) : register(name, email, password, role, isAdult);
    if (!result.ok) setErrors({ form: result.error || "Something went wrong." });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="h-16 flex items-center px-4 sm:px-8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md p-8 shadow-elevated" animate>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-5 shadow-lg">
              K
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p className="text-sm text-slate-500">{mode === "login" ? "Sign in to continue your language work." : "Join the pilot as a contributor or reviewer."}</p>
          </div>

          <AnimatePresence mode="wait">
            {mode === "register" && step === 1 && (
              <motion.div key="register-step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="space-y-4 mb-6">
                  <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} autoComplete="name" />
                  <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
                  <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} autoComplete="new-password" />
                </div>
                <Button className="w-full" onClick={() => setStep(2)}>Continue</Button>
              </motion.div>
            )}

            {mode === "register" && step === 2 && (
              <motion.form key="register-step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handle} className="space-y-5">
                <div>
                  <label className="label">I want to participate as</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setRole("contributor")} className={`p-4 rounded-xl border-2 text-left transition-all ${role === "contributor" ? "border-forest-500 bg-forest-50" : "border-slate-200 hover:border-forest-300"}`}>
                      <strong className="block text-sm text-slate-900">Contributor</strong>
                      <span className="text-xs text-slate-500">Record Koloqua speech</span>
                    </button>
                    <button type="button" onClick={() => setRole("reviewer")} className={`p-4 rounded-xl border-2 text-left transition-all ${role === "reviewer" ? "border-forest-500 bg-forest-50" : "border-slate-200 hover:border-forest-300"}`}>
                      <strong className="block text-sm text-slate-900">Reviewer</strong>
                      <span className="text-xs text-slate-500">Validate quality</span>
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-forest-300 transition-colors">
                  <input type="checkbox" checked={isAdult} onChange={(e) => setIsAdult(e.target.checked)} className="w-5 h-5 accent-forest-600 mt-0.5" />
                  <div>
                    <strong className="block text-sm text-slate-900">I am 18 or older</strong>
                    <span className="text-xs text-slate-500">If not, a parent or guardian must provide consent.</span>
                  </div>
                </label>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-amber-800">Your data is protected. We never share identity information without explicit consent.</div>
                  </div>
                </div>

                {errors.form && <p className="text-sm text-coral-600 text-center">{errors.form}</p>}

                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" loading={submitting} className="flex-1">Create account</Button>
                </div>
              </motion.form>
            )}

            {mode === "login" && (
              <motion.form key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handle} className="space-y-5">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm">
                  <p className="font-medium text-amber-800 mb-1">Demo accounts</p>
                  <p className="text-amber-700 text-xs">contributor@koloqua.test · reviewer@koloqua.test · admin@koloqua.test</p>
                  <p className="text-amber-700 text-xs">Password is configured in <code>.env.local</code> (see <code>.env.example</code>).</p>
                </div>

                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
                <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} autoComplete="current-password" />

                {errors.form && <p className="text-sm text-coral-600 text-center">{errors.form}</p>}

                <Button type="submit" loading={submitting} className="w-full">Sign in</Button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setStep(1); }}
              className="text-forest-700 font-semibold hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
