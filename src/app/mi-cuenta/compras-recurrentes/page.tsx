"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  CalendarClock,
  Plus,
  Play,
  Pause,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function ComprasRecurrentesPage() {
  const { recurrentPurchases, updateRecurrentStatus, addresses } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("TODAS");

  const filtered = recurrentPurchases.filter((item) => {
    if (activeTab === "TODAS") return true;
    return item.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    if (status === "ACTIVA") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-[#00A86B]" /> Activa
        </span>
      );
    }
    if (status === "PAUSADA") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
          <Pause className="w-3 h-3 text-amber-600" /> Pausada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
        Cancelada
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <CalendarClock className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Tratamientos Continuos & Suscripciones</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Compras Recurrentes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Programa el despacho periódico de tus medicamentos y fórmulas permanentes en Boyacá para nunca quedarte sin ellos.
          </p>
        </div>

        <Link
          href="/productos"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Programar Nuevo Producto</span>
        </Link>
      </div>

      {/* Operational Notice / Safety Disclaimers */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Aviso de Entrega Segura:</strong> Las compras recurrentes te envían un recordatorio por WhatsApp y correo 3 días antes de la fecha programada para confirmar disponibilidad y realizar el pago seguro con Wompi. FarmaBoy nunca debitará tu dinero de forma no autorizada.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {["TODAS", "ACTIVA", "PAUSADA", "CANCELADA"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab
                ? "bg-[#00A86B] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {tab === "TODAS" ? "Todas las programaciones" : tab.charAt(0) + tab.slice(1).toLowerCase() + "s"}
          </button>
        ))}
      </div>

      {/* Recurrent Purchases List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden relative shrink-0 border border-slate-100">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase text-[#00A86B]">
                    {item.frequency}
                  </span>
                  {getStatusBadge(item.status)}
                </div>
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {item.product.name}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Próximo envío: <strong>{item.nextDeliveryDate}</strong>
                  </span>
                  <span>•</span>
                  <span>Cantidad: <strong>{item.quantity} un.</strong></span>
                  <span>•</span>
                  <span className="font-bold text-slate-800">
                    {item.product.priceDisplay}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Pause, Resume, Cancel */}
            <div className="flex items-center justify-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
              {item.status === "ACTIVA" ? (
                <button
                  type="button"
                  onClick={() => updateRecurrentStatus(item.id, "PAUSADA")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Pause className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pausar</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => updateRecurrentStatus(item.id, "ACTIVA")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-[#00A86B]" />
                  <span>Reanudar</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (confirm("¿Seguro que deseas cancelar esta compra recurrente?")) {
                    updateRecurrentStatus(item.id, "CANCELADA");
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-600 text-xs font-bold transition-colors"
                title="Cancelar programación"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cancelar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
