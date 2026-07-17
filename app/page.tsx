"use client";

import { useState, useCallback } from "react";
import { Shell } from "@/app/components/layout/Shell";
import { Landing } from "@/app/components/views/Landing";
import { Login } from "@/app/components/views/Login";
import { Overview } from "@/app/components/views/Overview";
import { Contribute } from "@/app/components/views/Contribute";
import { Review } from "@/app/components/views/Review";
import { Institutions } from "@/app/components/views/Institutions";
import { Earnings } from "@/app/components/views/Earnings";
import { Campaigns } from "@/app/components/views/Campaigns";
import { Leaderboard } from "@/app/components/views/Leaderboard";
import { Consent } from "@/app/components/views/Consent";
import { Audit } from "@/app/components/views/Audit";
import { Export } from "@/app/components/views/Export";
import { Admin } from "@/app/components/views/Admin";
import { Profile } from "@/app/components/views/Profile";
import { useAuth } from "@/app/contexts/AuthContext";
import type { View } from "@/app/lib/types";
import { canAccess } from "@/app/lib/data";
import { toast } from "sonner";

export default function Home() {
  const { user } = useAuth();
  const [view, setView] = useState<View>("overview");
  const [showLogin, setShowLogin] = useState(false);

  const navigate = useCallback(
    (next: View) => {
      const role = user?.role || "guest";
      if (canAccess(next, role)) {
        setView(next);
      } else {
        toast.error("You don't have permission to view that page.");
      }
    },
    [user?.role]
  );

  if (!user) {
    if (showLogin) return <Login onBack={() => setShowLogin(false)} />;
    return <Landing onStart={() => setShowLogin(true)} />;
  }

  return (
    <Shell view={view} onNavigate={navigate}>
      {view === "overview" && <Overview onNavigate={(v) => navigate(v)} />}
      {view === "contribute" && <Contribute />}
      {view === "review" && <Review />}
      {view === "institutions" && <Institutions />}
      {view === "earnings" && <Earnings />}
      {view === "campaigns" && <Campaigns />}
      {view === "leaderboard" && <Leaderboard />}
      {view === "consent" && <Consent />}
      {view === "audit" && <Audit />}
      {view === "export" && <Export />}
      {view === "admin" && <Admin />}
      {view === "profile" && <Profile />}
    </Shell>
  );
}
