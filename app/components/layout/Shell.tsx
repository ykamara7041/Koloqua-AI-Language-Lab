"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ToastProvider } from "@/app/components/ui/Toast";
import type { View } from "@/app/lib/types";

interface ShellProps {
  children: React.ReactNode;
  view: View;
  onNavigate: (v: View) => void;
}

export function Shell({ children, view, onNavigate }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar active={view} onNavigate={onNavigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header onMenu={() => setSidebarOpen(true)} currentView={view} />
        <main className="flex-1">
          <ToastProvider />
          <div className="page-container animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
