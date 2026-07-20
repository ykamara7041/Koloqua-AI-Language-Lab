"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";

const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export interface SecurityPreferences {
  idleLock: boolean;
  twoFactorEnabled: boolean;
  paymentPin?: string;
}

export function useSecurity() {
  const { user, logout } = useAuth();
  const { value: prefs, setValue: setPrefs } = useLocalStorage<SecurityPreferences>(
    `koloqua_security_${user?.id || "guest"}`,
    { idleLock: true, twoFactorEnabled: true }
  );
  const [locked, setLocked] = useState(false);
  const [lastActive, setLastActive] = useState(Date.now());

  const lock = useCallback(() => {
    if (user) setLocked(true);
  }, [user]);

  const unlock = useCallback(
    (pin: string) => {
      if (prefs.paymentPin && pin !== prefs.paymentPin) return false;
      setLocked(false);
      setLastActive(Date.now());
      return true;
    },
    [prefs.paymentPin]
  );

  const updateIdleLock = useCallback(
    (enabled: boolean) => {
      setPrefs((prev) => ({ ...prev, idleLock: enabled }));
    },
    [setPrefs]
  );

  const updatePaymentPin = useCallback(
    (pin: string) => {
      setPrefs((prev) => ({ ...prev, paymentPin: pin }));
    },
    [setPrefs]
  );

  useEffect(() => {
    if (!user || !prefs.idleLock) return;

    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    const bump = () => setLastActive(Date.now());
    events.forEach((e) => window.addEventListener(e, bump));

    const interval = setInterval(() => {
      if (Date.now() - lastActive > IDLE_TIMEOUT_MS) {
        logout();
      }
    }, 30_000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      clearInterval(interval);
    };
  }, [user, prefs.idleLock, lastActive, logout]);

  return {
    idleLock: prefs.idleLock,
    paymentPin: prefs.paymentPin,
    locked,
    lock,
    unlock,
    updateIdleLock,
    updatePaymentPin,
  };
}
