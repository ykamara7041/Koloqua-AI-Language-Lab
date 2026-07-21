"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ToastProvider } from "@/app/components/ui/Toast";
import { Modal } from "@/app/components/ui/Modal";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useSecurity } from "@/app/hooks/useSecurity";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import type { View } from "@/app/lib/types";

interface ShellProps {
  children: React.ReactNode;
  view: View;
  onNavigate: (v: View) => void;
}

export function Shell({ children, view, onNavigate }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const { locked, lock, unlock, updateIdleLock } = useSecurity();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const onVisibility = () => {
      if (document.hidden) lock();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [user, lock]);

  const handleUnlock = () => {
    const ok = unlock(pin);
    if (ok) {
      setPin("");
      setError("");
    } else {
      setError("Incorrect PIN.");
    }
  };

  return (
    <div className={`min-h-screen flex ${resolvedTheme === "dark" ? "dark" : ""} bg-cream text-charcoal transition-colors duration-300`}>
      <Sidebar active={view} onNavigate={onNavigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col bg-cream transition-colors duration-300">
        <Header onMenu={() => setSidebarOpen(true)} currentView={view} />
        <main className="flex-1">
          <ToastProvider />
          <div className="page-container animate-fade-in">{children}</div>
        </main>
      </div>

      <Modal
        open={locked}
        onClose={() => {}}
        title="Session locked"
        description="Your session was locked for security. Enter your payment PIN to continue."
      >
        <div className="space-y-4">
          <Input
            label="Payment PIN"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            error={error}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => { updateIdleLock(false); setError(""); }} className="flex-1">Disable lock</Button>
            <Button onClick={handleUnlock} className="flex-1">Unlock</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
