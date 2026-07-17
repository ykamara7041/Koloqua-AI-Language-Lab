"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { User, Role } from "@/app/lib/types";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { hashPassword } from "@/app/lib/security";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string, role: Role, isAdult: boolean) => { ok: boolean; error?: string };
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEMO_USERS: User[] = [
  { id: "u-001", name: "Amina Doe", email: "contributor@koloqua.test", role: "contributor", institution: "Starz University", isAdult: true, hasConsented: true, joinedAt: "2026-01-15" },
  { id: "u-002", name: "James Kollie", email: "reviewer@koloqua.test", role: "reviewer", institution: "University of Liberia", isAdult: true, hasConsented: true, joinedAt: "2026-02-03" },
  { id: "u-003", name: "Admin User", email: "admin@koloqua.test", role: "admin", institution: "Koloqua AI", isAdult: true, hasConsented: true, joinedAt: "2025-11-20" },
];

const DEMO_PASSWORDS: Record<string, string> = {
  "contributor@koloqua.test": hashPassword("REDACTED_DEMO_PASSWORD"),
  "reviewer@koloqua.test": hashPassword("REDACTED_DEMO_PASSWORD"),
  "admin@koloqua.test": hashPassword("REDACTED_DEMO_PASSWORD"),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { value: stored, setValue: setStored, hydrated } = useLocalStorage<User | null>("koloqua_user_v2", null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hydrated) {
      setUser(stored);
      setLoading(false);
    }
  }, [hydrated, stored]);

  const login = useCallback((email: string, password: string) => {
    const target = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!target) return { ok: false, error: "No account found for that email." };
    if (DEMO_PASSWORDS[target.email] !== hashPassword(password)) {
      return { ok: false, error: "Incorrect password." };
    }
    setStored(target);
    setUser(target);
    return { ok: true };
  }, [setStored]);

  const register = useCallback((name: string, email: string, password: string, role: Role, isAdult: boolean) => {
    if (DEMO_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser: User = {
      id: `u-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role === "guest" ? "contributor" : role,
      isAdult,
      hasConsented: false,
      joinedAt: new Date().toISOString().split("T")[0],
    };
    setStored(newUser);
    setUser(newUser);
    return { ok: true };
  }, [setStored]);

  const logout = useCallback(() => {
    setStored(null);
    setUser(null);
  }, [setStored]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
