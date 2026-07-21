"use client";

import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className, ...rest }, ref) => {
  return (
    <div className={clsx("space-y-1.5", className)}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light">{icon}</span>}
        <input
          ref={ref}
          className={clsx(
            "input",
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
Input.displayName = "Input";
