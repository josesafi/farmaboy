"use client";

import React from "react";
import { OrderStatus } from "@/types/account";
import { Clock, CheckCircle2, PackageCheck, Truck, XCircle, AlertCircle } from "lucide-react";

interface Props {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
}

export const OrderStatusBadge: React.FC<Props> = ({ status, size = "md" }) => {
  const configs: Record<
    OrderStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    PENDIENTE: {
      label: "Pendiente",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    CONFIRMADO: {
      label: "Confirmado",
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    PREPARANDO: {
      label: "Preparando",
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      icon: <PackageCheck className="w-3.5 h-3.5" />,
    },
    EN_CAMINO: {
      label: "En camino",
      bg: "bg-teal-50",
      text: "text-teal-800",
      border: "border-teal-200",
      icon: <Truck className="w-3.5 h-3.5 animate-pulse" />,
    },
    ENTREGADO: {
      label: "Entregado",
      bg: "bg-emerald-100",
      text: "text-emerald-900",
      border: "border-emerald-300",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    CANCELADO: {
      label: "Cancelado",
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
  };

  const current = configs[status] || {
    label: status,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-semibold gap-1",
    md: "px-2.5 py-1 text-xs font-bold gap-1.5",
    lg: "px-3 py-1.5 text-sm font-bold gap-2",
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};
