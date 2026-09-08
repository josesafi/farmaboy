"use client";

import React from "react";
import {
  LayoutTemplate,
  CheckCircle2,
  Power,
  Sliders,
  Type,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { SiteDesignConfig } from "@/types/admin";

export default function AdminDisenoPage() {
  const { siteDesign, updateSiteDesign, toggleHomepageSection, hasPermission } = useAdminStore();
  const canWrite = hasPermission("diseno:write");

  const sectionsList: {
    key: keyof SiteDesignConfig["homepageSections"];
    name: string;
    description: string;
  }[] = [
    {
      key: "hero",
      name: "Hero Principal con Banners",
      description: "Encabezado visual con carrusel de promociones, búsqueda rápida y accesos a categorías.",
    },
    {
      key: "categories",
      name: "Grilla de Categorías Farmacéuticas",
      description: "Accesos directos a Medicamentos, Cuidado Personal, Bienestar y Bebés.",
    },
    {
      key: "featuredProducts",
      name: "Productos Destacados & Precios",
      description: "Catálogo interactivo con selector de categorías y botón de compra rápida.",
    },
    {
      key: "dealsBanners",
      name: "Banners de Ofertas Especiales",
      description: "Promociones intermedias con descuentos porcentuales y envíos.",
    },
    {
      key: "pharmacyServices",
      name: "Servicios Asistenciales en Salud",
      description: "Toma de tensión, inyectología, orientación farmacéutica en Boyacá.",
    },
    {
      key: "transportSection",
      name: "Transporte Asistencial",
      description: "Flota de ambulancias y traslados médicos programados en Boyacá.",
    },
    {
      key: "b2bSection",
      name: "Soluciones Institucionales para Empresas",
      description: "Suministro mayorista a clínicas, dotaciones y cotizaciones B2B.",
    },
    {
      key: "trustSection",
      name: "Pilares de Confianza Farmacéutica",
      description: "Sellos INVIMA, entrega rápida y calidad respaldada por Químicos Farmacéuticos.",
    },
    {
      key: "faqSection",
      name: "Preguntas Frecuentes (FAQ)",
      description: "Dudas sobre envíos, pagos Wompi, fórmulas médicas y cobertura.",
    },
    {
      key: "contactCta",
      name: "Bloque de Contacto Directo",
      description: "Líneas de atención en Boyacá y botón de WhatsApp oficial.",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-emerald-400" />
            Editor Visual de Secciones (CMS de Portada)
          </h2>
          <p className="text-xs text-slate-400">
            Activa, oculta y personaliza los bloques de la página principal en tiempo real sin tocar código
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 self-start sm:self-auto"
        >
          <ExternalLink className="w-4 h-4 text-emerald-400" />
          <span>Ver Cambios en Vivo</span>
        </a>
      </div>

      {/* Sections Toggle Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Control de Bloques en la Página Principal (Home)
          </h3>
          <p className="text-xs text-slate-400">
            Los cambios se aplican de inmediato en la tienda pública sin recargar el servidor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sectionsList.map((sec) => {
            const isVisible = siteDesign.homepageSections[sec.key];

            return (
              <div
                key={sec.key}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isVisible
                    ? "bg-slate-950/70 border-emerald-500/30 text-white shadow-sm"
                    : "bg-slate-950/30 border-slate-800 text-slate-400 opacity-60"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">{sec.name}</span>
                    {isVisible && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        VISIBLE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{sec.description}</p>
                </div>

                {canWrite && (
                  <button
                    onClick={() => toggleHomepageSection(sec.key)}
                    className={`p-2 rounded-xl transition shrink-0 ${
                      isVisible
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                    }`}
                    title={isVisible ? "Ocultar bloque" : "Mostrar bloque"}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Text Messages Editor */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Type className="w-4 h-4 text-emerald-400" />
            Avisos Globales y Textos Institucionales
          </h3>
          <p className="text-xs text-slate-400">
            Franjas informativas de cabecera y pie de página de la farmacia
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Barra Superior de Aviso (Top Announcement Bar)
            </label>
            <input
              type="text"
              value={siteDesign.headerNotice}
              disabled={!canWrite}
              onChange={(e) => updateSiteDesign({ headerNotice: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Se visualiza en la parte superior de la tienda pública con ícono de camión de entrega.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Eslogan Institucional de la Tienda
            </label>
            <input
              type="text"
              value={siteDesign.tagline}
              disabled={!canWrite}
              onChange={(e) => updateSiteDesign({ tagline: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Descripción de Pie de Página (Footer)
            </label>
            <textarea
              rows={3}
              value={siteDesign.footerDescription}
              disabled={!canWrite}
              onChange={(e) => updateSiteDesign({ footerDescription: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
