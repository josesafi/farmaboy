"use client";

import React, { useState } from "react";
import {
  Search,
  Globe,
  CheckCircle2,
  Code,
  Save,
  Tag,
  ExternalLink,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

export default function AdminSeoPage() {
  const { seo, updateSeo, hasPermission } = useAdminStore();
  const canWrite = hasPermission("seo:write");

  const [formData, setFormData] = useState({ ...seo });
  const [keywordInput, setKeywordInput] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeo(formData);
  };

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    if (!formData.keywords.includes(keywordInput.trim())) {
      setFormData({ ...formData, keywords: [...formData.keywords, keywordInput.trim()] });
    }
    setKeywordInput("");
  };

  const handleRemoveKeyword = (kw: string) => {
    setFormData({ ...formData, keywords: formData.keywords.filter((k) => k !== kw) });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" />
            Centro de SEO, Metadatos & Posicionamiento en Google
          </h2>
          <p className="text-xs text-slate-400">
            Optimiza títulos, descripciones y datos estructurados Schema.org para búsquedas en Boyacá
          </p>
        </div>

        {canWrite && (
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración SEO</span>
          </button>
        )}
      </div>

      {/* Google SERP Preview Interactive Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            Simulador de Búsqueda Google (SERP Preview)
          </h3>
          <span className="text-[11px] text-emerald-400 font-bold">Vista Previa Desktop & Mobile</span>
        </div>

        {/* Google Mockup Box */}
        <div className="p-5 rounded-2xl bg-white text-slate-900 shadow-lg max-w-2xl space-y-1 font-sans">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center">
              F
            </div>
            <div className="truncate">
              <span className="font-semibold text-slate-800">Farmaboy Boyacá</span>
              <span className="text-slate-400 text-[11px] ml-1.5">https://farmaboy.com.co</span>
            </div>
          </div>

          <h4 className="text-base text-blue-800 font-semibold hover:underline cursor-pointer leading-tight">
            {formData.siteTitleDefault || "Farmaboy | Tu farmacia de confianza en Boyacá"}
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {formData.siteDescriptionDefault ||
              "Medicamentos, insumos médicos, cuidado personal y servicios asistenciales en Tunja, Duitama y Sogamoso..."}
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
            <span className="text-emerald-700 font-bold">✓ Calificación 4.9 ★</span>
            <span>• Envíos rápidos en Boyacá</span>
            <span>• Pagos Wompi</span>
          </div>
        </div>
      </div>

      {/* Main SEO Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Metatags */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            Metadatos Globales
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-bold">Título Predeterminado (Meta Title) *</label>
                <span className={`text-[10px] ${formData.siteTitleDefault.length > 60 ? "text-amber-400" : "text-slate-400"}`}>
                  {formData.siteTitleDefault.length} / 60 caracteres recomendados
                </span>
              </div>
              <input
                type="text"
                required
                disabled={!canWrite}
                value={formData.siteTitleDefault}
                onChange={(e) => setFormData({ ...formData, siteTitleDefault: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-bold">Meta Descripción *</label>
                <span className={`text-[10px] ${formData.siteDescriptionDefault.length > 160 ? "text-amber-400" : "text-slate-400"}`}>
                  {formData.siteDescriptionDefault.length} / 160 caracteres recomendados
                </span>
              </div>
              <textarea
                rows={3}
                required
                disabled={!canWrite}
                value={formData.siteDescriptionDefault}
                onChange={(e) =>
                  setFormData({ ...formData, siteDescriptionDefault: e.target.value })
                }
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">URL Canónica Base</label>
              <input
                type="url"
                disabled={!canWrite}
                value={formData.canonicalBase}
                onChange={(e) => setFormData({ ...formData, canonicalBase: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">URL Imagen Open Graph (OG)</label>
              <input
                type="url"
                disabled={!canWrite}
                value={formData.ogImageUrl}
                onChange={(e) => setFormData({ ...formData, ogImageUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Keywords & Schema */}
        <div className="space-y-6">
          {/* Keywords Manager */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              Palabras Clave de Boyacá
            </h3>

            {canWrite && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                  placeholder="Agregar palabra clave (ej. farmacia Paipa)..."
                  className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                >
                  Agregar
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-950 border border-slate-800 text-slate-300"
                >
                  <span>{kw}</span>
                  {canWrite && (
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(kw)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Schema.org Inspector */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                Datos Estructurados Schema.org
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                JSON-LD Activo
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400/90 overflow-x-auto">
              <pre>{JSON.stringify(
                {
                  "@context": "https://schema.org",
                  "@type": formData.schemaType || "Pharmacy",
                  name: "Farmaboy",
                  areaServed: "Boyacá, Colombia",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Transversal 29 # 10-63",
                    addressLocality: "Duitama",
                    addressRegion: "Boyacá",
                  },
                  paymentAccepted: "Wompi, PSE, Nequi, Bancolombia",
                },
                null,
                2
              )}</pre>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
