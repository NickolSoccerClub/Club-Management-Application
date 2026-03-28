"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useToastStore, type ToastVariant } from "@/lib/stores/toast-store";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "border-[#15803D]/20 bg-[#F0FDF4] text-[#15803D]",
  error: "border-[#B91C1C]/20 bg-[#FEF2F2] text-[#B91C1C]",
  warning: "border-[#B45309]/20 bg-[#FFFBEB] text-[#B45309]",
  info: "border-[#1D4ED8]/20 bg-blue-50 text-[#1D4ED8]",
};

const VARIANT_ICON: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = VARIANT_ICON[toast.variant];
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg animate-in slide-in-from-right-full duration-200",
              VARIANT_STYLES[toast.variant]
            )}
            role="alert"
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
