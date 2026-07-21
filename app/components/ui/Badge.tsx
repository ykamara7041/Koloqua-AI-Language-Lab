"use client";

import { clsx } from "clsx";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variants = {
  default: "bg-cream-dark text-charcoal",
  success: "bg-forest-100 text-forest-700 border border-forest-200",
  warning: "bg-gold-100 text-gold-700 border border-gold-200",
  danger: "bg-coral-100 text-coral-700 border border-coral-200",
  info: "bg-terracotta/10 text-terracotta border border-terracotta/20",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={clsx("badge", variants[variant], className)}>
      {children}
    </span>
  );
}
