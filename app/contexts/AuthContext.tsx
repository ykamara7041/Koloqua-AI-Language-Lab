"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { User, Role } from "@/app/lib/types";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { generateOtp, generateSessionToken } from "@/app/lib/security";

interface PendingSession {
  email: string;
  otp: string;
  expiresAt: number;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  pendingOtp: PendingSession | null;
  login: (email: string, password: string) => { ok: boolean; error?: string; needsOtp?: boolean };
  verifyOtp: (email: string, otp: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string, role: Role, isAdult: boolean) => { ok: boolean; error?: string; needsOtp?: boolean };
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEMO_USERS: User[] = [
  { id: "u-001", name: "Amina Doe", email: "contributor@koloqua.test", role: "contributor", institution: "Starz University", isAdult: true, hasConsented: true, joinedAt: "2026-01-15" },
  { id: "u-002", name: "James Kollie", email: "reviewer@koloqua.test", role: "reviewer", institution: "University of Liberia", isAdult: true, hasConsented: true, joinedAt: "2026-02-03" },
  { id: "u-003", name: "Admin User", email: "admin@koloqua.test", role: "admin", institution: "Koloqua AI", isAdult: true, hasConsented: true, joinedAt: "2025-11-20" },
];

const OTP_TTL_MS = 5 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const { value: pending, setValue: setPending, remove: removePending, hydrated: pendingHydrated } = useLocalStorage<PendingSession | null>("koloqua_pending_otp", null);
  const { value: stored, setValue: setStored, hydrated: userHydrated } = useLocalStorage<User | null>("koloqua_user_v2", null);
  const [user, setUser] = useState<User | null>(null);
  const [pendingOtp, setPendingOtp] = useState<PendingSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userHydrated && pendingHydrated) {
      setUser(stored);
      setPendingOtp(pending);
      setLoading(false);
    }
  }, [userHydrated, pendingHydrated, stored, pending]);

  const checkPassword = useCallback((password: string) => {
    const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;
    if (!demoPassword) return { ok: false, error: "Demo password is not configured." };
    if (password !== demoPassword) return { ok: false, error: "Incorrect password." };
    return { ok: true };
  }, []);

  const createPendingSession = useCallback((email: string, user: User) => {
    const otp = generateOtp(email);
    const session: PendingSession = { email, otp, expiresAt: Date.now() + OTP_TTL_MS, user };
    setPending(session);
    setPendingOtp(session);
    // In production this code is sent to email/SMS; in demo we log to console for testing.
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEMO OTP] ${email}: ${otp}`);
    }
    return session;
  }, [setPending]);

  const completeLogin = useCallback(
    (session: PendingSession) => {
      setStored(session.user);
      setUser(session.user);
      removePending();
      setPendingOtp(null);
      return { ok: true };
    },
    [setStored, removePending]
  );

  const login = useCallback(
    (email: string, password: string) => {
      const target = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!target) return { ok: false, error: "No account found for that email." };

      const pwd = checkPassword(password);
      if (!pwd.ok) return { ok: false, error: pwd.error };

      const session = createPendingSession(email, target);
      return { ok: true, needsOtp: true, otp: session.otp };
    },
    [checkPassword, createPendingSession]
  );

  const register = useCallback(
    (name: string, email: string, password: string, role: Role, isAdult: boolean) => {
      if (DEMO_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: "An account with this email already exists." };
      }
      const pwd = checkPassword(password);
      if (!pwd.ok) return { ok: false, error: pwd.error };

      const newUser: User = {
        id: `u-${Math.random().toString(36).slice(2, 8)}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: role === "guest" ? "contributor" : role,
        isAdult,
        hasConsented: false,
        joinedAt: new Date().toISOString().split("T")[0],
        sessionToken: generateSessionToken(),
      };

      const session = createPendingSession(email, newUser);
      return { ok: true, needsOtp: true, otp: session.otp };
    },
    [checkPassword, createPendingSession]
  );

  const verifyOtp = useCallback(
    (email: string, otp: string) => {
      const session = pendingOtp || pending;
      if (!session) return { ok: false, error: "No verification in progress. Please sign in again." };
      if (session.email.toLowerCase() !== email.toLowerCase()) {
        return { ok: false, error: "Verification email does not match." };
      }
      if (Date.now() > session.expiresAt) {
        removePending();
        setPendingOtp(null);
        return { ok: false, error: "Code expired. Please sign in again." };
      }
      if (session.otp !== otp.replace(/\s/g, "")) {
        return { ok: false, error: "Incorrect verification code." };
      }
      return completeLogin(session);
    },
    [pendingOtp, pending, removePending, completeLogin]
  );

  const logout = useCallback(() => {
    setStored(null);
    setUser(null);
    removePending();
    setPendingOtp(null);
  }, [setStored, removePending]);

  return (
    <AuthContext.Provider value={{ user, pendingOtp, login, verifyOtp, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
