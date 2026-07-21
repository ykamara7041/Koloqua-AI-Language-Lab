"use client";

import { Card } from "./Card";
import { clsx } from "clsx";
import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, children, action, className }: ChartCardProps) {
  return (
    <Card className={clsx("p-5", className)}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-semibold text-charcoal">{title}</h3>
          {subtitle && <p className="text-xs text-charcoal-light mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}
