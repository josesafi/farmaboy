"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

export const AdminToasts: React.FC = () => {
  const { toasts, removeToast } = useAdminStore();

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notificaciones del sistema" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          info: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
        };

        const borders = {
          success: "border-emerald-500/40 bg-slate-900/95 text-emerald-100",
          error: "border-rose-500/40 bg-slate-900/95 text-rose-100",
          warning: "border-amber-500/40 bg-slate-900/95 text-amber-100",
          info: "border-sky-500/40 bg-slate-900/95 text-sky-100",
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-slideUp text-xs font-medium ${borders[toast.type]}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {icons[toast.type]}
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
