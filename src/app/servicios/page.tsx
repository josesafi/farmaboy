"use client";

import React, { useState } from "react";
import Link from "next/link";
import { farmaboyConfig, ServiceItem } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";
import {
  Pill,
  PackageCheck,
  Ambulance,
  HeartHandshake,
  Activity,
  Building2,
  ArrowRight,
  CheckCircle2,
  Filter,
  Sparkles,
} from "lucide-react";
import { QuoteModal } from "@/components/common/QuoteModal";
import { QuickContactCta } from "@/components/home/QuickContactCta";

const iconMap: Record<string, React.ReactNode> = {
  Pill: <Pill className="w-6 h-6" />,
  PackageCheck: <PackageCheck className="w-6 h-6" />,
  Ambulance: <Ambulance className="w-6 h-6" />,
  HeartHandshake: <HeartHandshake className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
};

export default function ServiciosPage() {
  const [filter, setFilter] = useState<"todos" | "particulares" | "empresas">("todos");
  const [quoteService, setQuoteService] = useState<string | null>(null);

  const filteredServices = farmaboyConfig.services.filter((s) => {
    if (filter === "todos") return true;
    if (filter === "particulares") return s.audience === "particulares" || s.audience === "ambos";
    if (filter === "empresas") return s.audience === "empresas" || s.audience === "ambos";
    return true;
  });

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-[#F1F5F9] to-white pt-12 pb-16 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary/10 text-secondary mb-4">
              Portafolio de Soluciones
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight">
              Servicios farmacéuticos y asistenciales en Boyacá
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Descubre nuestras líneas de atención especializada para pacientes, familias, profesionales e instituciones de salud.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Filtrar por:
            </span>
            <button
              type="button"
              onClick={() => setFilter("todos")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 touch-target ${
                filter === "todos"
                  ? "bg-primary text-white shadow-clinical"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Todos los servicios ({farmaboyConfig.services.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("particulares")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 touch-target ${
                filter === "particulares"
                  ? "bg-secondary text-white shadow-clinical"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Para Particulares
            </button>
            <button
              type="button"
              onClick={() => setFilter("empresas")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 touch-target ${
                filter === "empresas"
                  ? "bg-[#07162C] text-white shadow-clinical"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Para Empresas & Clínicas
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="rounded-3xl p-8 bg-slate-50 border border-slate-200 hover:bg-white hover:border-secondary/40 shadow-clinical-sm hover:shadow-clinical transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-clinical-sm text-secondary flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
                      {iconMap[service.icon] || <Sparkles className="w-6 h-6" />}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-700">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {service.fullDesc}
                  </p>

                  <div className="space-y-2 mb-8">
                    {service.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex flex-col gap-2">
                  <Link
                    href={service.slug}
                    className="w-full py-3 px-4 rounded-xl bg-primary text-white hover:bg-primary-dark font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 touch-target shadow-sm"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {service.audience === "empresas" && (
                    <button
                      type="button"
                      onClick={() => setQuoteService(service.title)}
                      className="w-full py-2 text-xs font-semibold text-secondary hover:underline"
                    >
                      Cotizar para mi institución &rarr;
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      {quoteService && (
        <QuoteModal
          isOpen={!!quoteService}
          onClose={() => setQuoteService(null)}
          defaultService={quoteService}
        />
      )}

      {/* Portafolio Oficial de FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S. */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Portafolio Oficial de Servicios en Salud</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Empresa legalmente constituida (NIT 902.054.200-0, Matrícula Mercantil 0000124781) dedicada al suministro integral, comercialización y distribución para el sector salud con cobertura departamental en Boyacá y despachos nacionales.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {farmaboyConfig.serviciosOficiales.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800">
                <img
                  src="/images/servicios-farmaboy.jpg"
                  alt="Servicios Oficiales FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S."
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <QuickContactCta />
    </>
  );
}
