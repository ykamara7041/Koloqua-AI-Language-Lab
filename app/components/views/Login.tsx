"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useAuth } from "@/app/contexts/AuthContext";
import { validatePassword } from "@/app/lib/security";
import { emailSchema, otpSchema } from "@/app/lib/validation";
import type { Role } from "@/app/lib/types";
import {
  ArrowLeft,
  Shield,
  Mail,
  Lock,
  KeyRound,
  User,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface LoginProps {
  onBack: () => void;
}

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const slide = {
  initial: { opacity: 0, x: 24, filter: "blur(8px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: easing } },
  exit: { opacity: 0, x: -24, filter: "blur(8px)", transition: { duration: 0.3 } },
};

const roles: { value: Role; label: string; desc: string }[] = [
  { value: "contributor", label: "Contributor", desc: "Record Koloqua speech" },
  { value: "reviewer", label: "Reviewer", desc: "Validate quality" },
];

export function Login({ onBack }: LoginProps) {
  const { login, register, verifyOtp, pendingOtp } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "otp">("login");
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [role, setRole] = useState<Role>("contributor");
  const [isAdult, setIsAdult] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [otpSentTo, setOtpSentTo] = useState("");

  useEffect(() => {
    if (mode === "otp" && pendingOtp) setOtpSentTo(pendingOtp.email);
  }, [mode, pendingOtp]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const next: Record<string, string> = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) next.email = emailResult.error.issues[0].message;

    const pwdResult = validatePassword(password);
    if (!pwdResult.ok) next.password = pwdResult.reason || "Invalid password";

    if (mode === "register" && name.trim().length < 2) {
      next.name = "Enter your full name.";
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setSubmitting(true);
    if (mode === "login") {
      const result = login(email, password);
      if (!result.ok) {
        setErrors({ form: result.error || "Something went wrong." });
      } else {
        toast.success("Verification code sent to your email");
        setMode("otp");
      }
    } else {
      const result = register(name, email, password, role, isAdult);
      if (!result.ok) {
        setErrors({ form: result.error || "Something went wrong." });
      } else {
        toast.success("Verification code sent to your email");
        setMode("otp");
      }
    }
    setSubmitting(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digits = value.slice(-1);
    const next = [...otp];
    next[index] = digits;
    setOtp(next);
    if (digits && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const code = otp.join("");
    const parsed = otpSchema.safeParse({ otp: code });
    if (!parsed.success) {
      setErrors({ otp: parsed.error.issues[0].message });
      return;
    }
    setSubmitting(true);
    const result = verifyOtp(otpSentTo || email, code);
    if (!result.ok) {
      setErrors({ form: result.error || "Verification failed." });
    }
    setSubmitting(false);
  };

  const resend = () => {
    login(otpSentTo || email, password);
    toast.success("A new verification code was sent");
  };

  const switchMode = (target: "login" | "register") => {
    setMode(target);
    setStep(1);
    setErrors({});
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col transition-colors duration-300">
      <div className="fixed top-0 left-0 right-0 z-10 bg-cream/80 backdrop-blur-xl border-b border-cream-dark/50 h-16 flex items-center px-4 sm:px-8 transition-colors duration-300">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-charcoal-light hover:text-charcoal transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: easing }}
          className="w-full max-w-md"
        >
          <div className="bg-cream-100 rounded-3xl border border-cream-dark shadow-elevated p-8 sm:p-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: easing }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-terracotta to-terracotta-light flex items-center justify-center text-white font-bold text-2xl mx-auto mb-5 shadow-lg"
              >
                K
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-2xl sm:text-3xl font-bold text-charcoal mb-2 font-display"
              >
                {mode === "otp" ? "Check your email" : mode === "login" ? "Welcome back" : "Join the pilot"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="text-sm text-charcoal-light"
              >
                {mode === "otp"
                  ? `Enter the 6-digit code sent to ${otpSentTo || email}`
                  : mode === "login"
                  ? "Sign in to continue your language journey."
                  : "Create an account to start contributing."}
              </motion.p>
            </div>

            <AnimatePresence mode="wait">
              {mode === "otp" ? (
                <motion.form
                  key="otp"
                  variants={slide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleOtp}
                  className="space-y-6"
                >
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border border-cream-dark bg-cream text-charcoal focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
                      />
                    ))}
                  </div>

                  {errors.otp && <p className="text-xs text-coral-600 text-center font-medium">{errors.otp}</p>}
                  {errors.form && <p className="text-sm text-coral-600 text-center font-medium">{errors.form}</p>}

                  <Button type="submit" loading={submitting} className="w-full">
                    <KeyRound className="w-4 h-4" /> Verify code
                  </Button>

                  <p className="text-center text-sm text-charcoal-light">
                    Didn&apos;t receive it?{" "}
                    <button type="button" onClick={resend} className="text-terracotta font-semibold hover:underline">
                      Resend code
                    </button>
                  </p>
                </motion.form>
              ) : mode === "register" ? (
                <motion.div key="register" variants={slide} initial="initial" animate="animate" exit="exit" className="space-y-5"
                >
                  {step === 1 && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setErrors({});
                        const next: Record<string, string> = {};
                        if (name.trim().length < 2) next.name = "Enter your full name.";
                        const emailResult = emailSchema.safeParse(email);
                        if (!emailResult.success) next.email = emailResult.error.issues[0].message;
                        if (Object.keys(next).length > 0) {
                          setErrors(next);
                          return;
                        }
                        setStep(2);
                      }}
                      className="space-y-5"
                    >
                      <Input
                        label="Full name"
                        placeholder="e.g. Amina Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                        autoComplete="name"
                        icon={<User className="w-4 h-4" />}
                      />
                      <Input
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        autoComplete="email"
                        icon={<Mail className="w-4 h-4" />}
                      />

                      <div className="bg-cream border border-cream-dark rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center text-terracotta shrink-0">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-charcoal">Why join?</p>
                            <p className="text-xs text-charcoal-light">
                              Record or review Koloqua speech, earn rewards, and help build Liberia&apos;s first community-owned language dataset.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        Continue <ArrowRight className="w-4 h-4" />
                      </Button>
                    </form>
                  )}

                  {step === 2 && (
                    <form onSubmit={handleAuth} className="space-y-5">
                      <div className="space-y-3">
                        <label className="label">I want to participate as</label>
                        <div className="grid grid-cols-2 gap-3">
                          {roles.map((r) => (
                            <button
                              key={r.value}
                              type="button"
                              onClick={() => setRole(r.value)}
                              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                                role === r.value
                                  ? "border-terracotta bg-terracotta/5"
                                  : "border-cream-dark hover:border-terracotta/30"
                              }`}
                            >
                              <span className="flex items-center justify-between">
                                <strong className="block text-sm text-charcoal">{r.label}</strong>
                                {role === r.value && <Check className="w-4 h-4 text-terracotta" />}
                              </span>
                              <span className="text-xs text-charcoal-light">{r.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <Input
                        label="Create password"
                        type="password"
                        placeholder="At least 10 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                        autoComplete="new-password"
                        icon={<Lock className="w-4 h-4" />}
                      />

                      <label className="flex items-start gap-3 p-4 rounded-xl border border-cream-dark cursor-pointer hover:border-terracotta/30 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isAdult}
                          onChange={(e) => setIsAdult(e.target.checked)}
                          className="w-5 h-5 accent-terracotta mt-0.5 rounded"
                        />
                        <div>
                          <strong className="block text-sm text-charcoal">I am 18 or older</strong>
                          <span className="text-xs text-charcoal-light">If not, a parent or guardian must provide consent.</span>
                        </div>
                      </label>

                      <div className="bg-terracotta/5 border border-terracotta/10 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-terracotta mt-0.5 shrink-0" />
                          <p className="text-xs text-charcoal-light">
                            Your data is protected. We never share identity information without explicit consent.
                          </p>
                        </div>
                      </div>

                      {errors.form && <p className="text-sm text-coral-600 text-center font-medium">{errors.form}</p>}

                      <div className="flex gap-3"
                      >
                        <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                        <Button type="submit" loading={submitting} className="flex-1">Create account</Button>
                      </div>
                    </form>
                  )}
                </motion.div>
              ) : (
                <motion.form
                  key="login"
                  variants={slide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleAuth}
                  className="space-y-5"
                >
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    autoComplete="email"
                    icon={<Mail className="w-4 h-4" />}
                  />

                  <div className="space-y-1">
                    <Input
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={errors.password}
                      autoComplete="current-password"
                      icon={<Lock className="w-4 h-4" />}
                    />
                    <div className="flex justify-end">
                      <button type="button" className="text-xs text-terracotta font-medium hover:underline">
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  {errors.form && <p className="text-sm text-coral-600 text-center font-medium">{errors.form}</p>}

                  <Button type="submit" loading={submitting} className="w-full">
                    Sign in <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {mode !== "otp" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-center text-sm text-charcoal-light"
              >
                {mode === "login" ? "New to Koloqua AI? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => switchMode(mode === "login" ? "register" : "login")}
                  className="text-terracotta font-semibold hover:underline"
                >
                  {mode === "login" ? "Create an account" : "Sign in"}
                </button>
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
