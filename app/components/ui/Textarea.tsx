"use client";

import { clsx } from "clsx";
import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className, ...rest }, ref) => {
  return (
    <div className={clsx("space-y-1.5", className)}>
      {label && <label className="label">{label}</label>}
      <textarea
        ref={ref}
        className={clsx(
          "input min-h-[100px] py-3 resize-y",
          error && "border-coral-300 focus:border-coral-500 focus:ring-coral-100"
        )}
        {...rest}
      />
      {error && <p className="text-xs text-coral-600 font-medium">{error}</p>}
    </div>
  );
});
Textarea.displayName = "Textarea";
