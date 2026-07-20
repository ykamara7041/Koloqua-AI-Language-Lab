"use client";

import { type ReactNode } from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, description, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/50" onClick={onClose} />
      <div className={clsx("relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-elevated")}>
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
