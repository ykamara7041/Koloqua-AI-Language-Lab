"use client";

import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  circle?: boolean;
}

export function Skeleton({ className, circle }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "bg-slate-200 animate-pulse",
        circle ? "rounded-full" : "rounded-lg",
        className
      )}
    />
  );
}
