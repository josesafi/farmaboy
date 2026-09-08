"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Gift,
  ShieldAlert,
} from "lucide-react";

export default function BeneficiosPage() {
  const { loyalty } = useAuth();

  const tiers = [
    {
      name: "Inicial",
      minPoints: 0,
      description: "Acceso básico a promociones mensuales y acumulación de puntos por compras en Boyacá.",
      benefits: [
        "1 punto por cada $1.000 COP en compras",
        "Boletín con ofertas quincenales",
      ],
      active: loyalty.tier === "Inicial",
      passed: true,
    },
    {
      name: "Preferencial",
      minPoints: 500,
      description: "Tu nivel actual. Descuentos dedicados y atención prioritaria.",
      benefits: [
        "5% de descuento en medicamentos seleccionados los martes",
        "Envíos gratis en compras superiores a $60.000 COP",
        "Atención preferencial por WhatsApp farmacéutico",
      ],
      active: loyalty.tier === "Preferencial",
      passed: true,
    },
    {
      name: "Premium",
      minPoints: 2000,
      description: "Para familias y empresas que confían habitualmente en Farmaboy.",
      benefits: [
        "10% de descuento en referencias seleccionadas de cuidado personal",
        "Envíos prioritarios express en Tunja y Duitama",
        "Regalo especial en el mes de tu cumpleaños",
      ],
      active: loyalty.tier === "Premium",
      passed: false,
    },
    {
      name: "VIP",
      minPoints: 5000,
      description: "Nivel corporativo y clientes de alta fidelidad.",
      benefits: [
        "Asesor farmacéutico exclusivo asignado",
        "Precios institucionales mayoristas en insumos",
        "Envíos gratis sin monto mínimo en Boyacá",
      ],
      active: loyalty.tier === "VIP",
      passed: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 mb-2">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>FarmaBoy Puntos & Fidelización</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mis Beneficios y Puntos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Acumula puntos en cada compra de farmacia y desbloquea descuentos y beneficios exclusivos en Boyacá.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 text-right">
          <span className="text-[10px] font-black uppercase text-amber-800 block">Balance de Puntos</span>
          <span className="text-2xl font-black text-amber-900">{loyalty.points} pts</span>
          <span className="text-[11px] text-amber-700 block font-medium">
            ≈ ${loyalty.availablePointsValueCOP.toLocaleString("es-CO")} COP en Farmacia
          </span>
        </div>
      </div>

      {/* Program status banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Nivel Actual
            </span>
            <h2 className="text-2xl font-black text-white mt-0.5">
              Cliente {loyalty.tier}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Te faltan solo <strong className="text-emerald-400">{loyalty.pointsToNextTier} puntos</strong> para alcanzar la categoría {loyalty.nextTier}.
            </p>
          </div>
          <span className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
            Progreso del Nivel: 65%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-[#00A86B] rounded-full w-[65%]" />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-bold">
            <span>{loyalty.tier} (500 pts)</span>
            <span>{loyalty.nextTier} (2.000 pts)</span>
          </div>
        </div>
      </div>

      {/* Tier Breakdown Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Escalafón de Niveles FarmaBoy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-6 border transition-all ${
                tier.active
                  ? "bg-white border-[#00A86B] ring-2 ring-[#00A86B]/20 shadow-sm"
                  : "bg-white border-slate-200/90 opacity-80"
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-slate-900">
                    Nivel {tier.name}
                  </h4>
                  {tier.active && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black">
                      Nivel Actual
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-500">
                  Desde {tier.minPoints} pts
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4">{tier.description}</p>

              <div className="space-y-2">
                {tier.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#00A86B] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
        <strong>Nota del Sistema:</strong> La interfaz de fidelización está estructurada conceptualmente para el despliegue del programa oficial de puntos de FarmaBoy en Boyacá. La acumulación y canje de puntos se rige por los reglamentos vigentes de la empresa.
      </div>
    </div>
  );
}
