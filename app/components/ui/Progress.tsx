"use client";

import { clsx } from "clsx";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  size?: "sm" | "md";
}

export function Progress({ value, max = 100, className, barClassName, size = "md" }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={clsx("w-full rounded-full bg-cream-dark overflow-hidden", size === "sm" ? "h-2" : "h-3", className)}>
      <div
        className={clsx("h-full rounded-full bg-terracotta transition-all duration-500", barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
