"use client";

import { clsx } from "clsx";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "green" | "gold" | "blue" | "purple" | "forest";
  showLabel?: boolean;
  className?: string;
}

export function Progress({ value, max = 100, size = "md", color = "green", showLabel, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    green: "bg-emerald-500",
    forest: "bg-forest-600",
    gold: "bg-amber-500",
    blue: "bg-blue-500",
    purple: "bg-violet-500",
  };
  const heights = { sm: "h-1.5", md: "h-2", lg: "h-2.5" };

  return (
    <div className={clsx("w-full", className)}>
      <div className={clsx("w-full bg-slate-100 rounded-full overflow-hidden", heights[size])}>
        <div
          className={clsx("h-full rounded-full transition-all duration-700", colors[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-slate-500 mt-1 block">{Math.round(pct)}%</span>}
    </div>
  );
}
