"use client";

import { clsx } from "clsx";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "green" | "gold" | "red" | "blue" | "purple" | "gray" | "forest";
  className?: string;
}

const palette = {
  green: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  forest: "bg-forest-50 text-forest-700 border border-forest-100",
  gold: "bg-amber-50 text-amber-700 border border-amber-100",
  red: "bg-red-50 text-red-700 border border-red-100",
  blue: "bg-blue-50 text-blue-700 border border-blue-100",
  purple: "bg-violet-50 text-violet-700 border border-violet-100",
  gray: "bg-slate-100 text-slate-600 border border-slate-200",
};

export function Badge({ children, tone = "gray", className }: BadgeProps) {
  return <span className={clsx("badge", palette[tone], className)}>{children}</span>;
}
