"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { User, Role } from "@/app/lib/types";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { generateOtp, generateSessionToken, validatePassword } from "@/app/lib/security";

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

const OTP_TTL_MS = 5 * 60 * 1000;

// Pre-seed the admin account for competition demo use.
// Production will store users in a backend database with hashed passwords.
const ADMIN_EMAIL = "admin@koloquaai.org";
const ADMIN_PASSWORD = "KoloquaAdmin2026!";

const userStore: User[] = [
  {
    id: "u-admin-001",
    name: "Koloqua Admin",
    email: ADMIN_EMAIL,
    role: "admin",
    institution: "Koloqua AI",
    isAdult: true,
    hasConsented: true,
    joinedAt: "2025-11-20",
    sessionToken: generateSessionToken(),
  },
];

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
    const result = validatePassword(password);
    if (!result.ok) return { ok: false, error: result.reason || "Password does not meet requirements." };
    return { ok: true };
  }, []);

  const verifyAdminPassword = useCallback((email: string, password: string) => {
    if (email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()) {
      return password === ADMIN_PASSWORD;
    }
    return true;
  }, []);

  const createPendingSession = useCallback((email: string, user: User) => {
    const otp = generateOtp(email);
    const session: PendingSession = { email, otp, expiresAt: Date.now() + OTP_TTL_MS, user };
    setPending(session);
    setPendingOtp(session);
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
      let target = userStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!target) {
        const knownRole = email.toLowerCase().startsWith("admin") ? "admin" : email.toLowerCase().startsWith("reviewer") ? "reviewer" : "contributor";
        target = {
          id: generateSessionToken(),
          name: email.split("@")[0].replace(/\./g, " ").split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
          email: email.toLowerCase().trim(),
          role: knownRole,
          institution: "Koloqua AI",
          isAdult: true,
          hasConsented: false,
          joinedAt: new Date().toISOString().split("T")[0],
          sessionToken: generateSessionToken(),
        };
        userStore.push(target);
      }

      if (target.role === "admin" && !verifyAdminPassword(email, password)) {
        return { ok: false, error: "Invalid admin credentials." };
      }

      const pwd = checkPassword(password);
      if (!pwd.ok) return { ok: false, error: pwd.error };

      const session = createPendingSession(email, target);
      return { ok: true, needsOtp: true, otp: session.otp };
    },
    [checkPassword, createPendingSession, verifyAdminPassword]
  );

  const register = useCallback(
    (name: string, email: string, password: string, role: Role, isAdult: boolean) => {
      if (userStore.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: "An account with this email already exists." };
      }

      if (email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()) {
        return { ok: false, error: "This email is reserved." };
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
  }, [setStored]);

  return (
    <AuthContext.Provider value={{ user, pendingOtp, login, verifyOtp, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
