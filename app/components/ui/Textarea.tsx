"use client";

import { clsx } from "clsx";
import { forwardRef, type TextareaHTMLAttributes, type ReactNode } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, icon, className, ...rest }, ref) => {
  return (
    <div className={clsx("space-y-1.5", className)}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-3 text-charcoal-light">{icon}</span>}
        <textarea
          ref={ref}
          className={clsx(
            "input min-h-[100px] resize-y py-3",
            icon && "pl-10",
            error && "border-coral-300 focus:border-coral-500 focus:ring-coral-100"
          )}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-coral-600 font-medium">{error}</p>}
    </div>
  );
});
Textarea.displayName = "Textarea";
