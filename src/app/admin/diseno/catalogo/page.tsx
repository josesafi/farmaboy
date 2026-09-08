"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutTemplate,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Eye,
  Columns,
  Grid,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CatalogCardConfig } from "@/types/catalog";

export default function AdminDisenoCatalogoPage() {
  const { catalogCardConfig, updateCatalogCardConfig, allCatalogProducts, showToast } = useAdminStore();

  const [localConfig, setLocalConfig] = useState<CatalogCardConfig>({ ...catalogCardConfig });
  const [saved, setSaved] = useState(false);

  // Sample product for live preview
  const sampleProduct = allCatalogProducts[0] || {
    id: "sample-1",
    slug: "acetaminofen-500mg",
    name: "Acetaminofén 500 mg (Caja x 100 Tab)",
    genericName: "Paracetamol",
    brand: "Genfar S.A.",
    category: "Medicamentos",
    categorySlug: "medicamentos",
    presentation: "Caja x 100 Tabletas",
    priceCOP: 12500,
    previousPriceCOP: 14000,
    discountPercentage: 11,
    savingsCOP: 1500,
    currentStock: 48,
    minStock: 20,
    status: "ACTIVO" as const,
    isActive: true,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    gallery: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80"],
    description: "Alivio efectivo del dolor y la fiebre.",
    shortDescription: "Caja x 100 tabletas recubiertas.",
    sku: "MED-ACT-500-100",
    rating: 4.9,
    reviewCount: 38,
    salesCount: 120,
  };

  const handleToggle = (key: keyof CatalogCardConfig) => {
    setLocalConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    updateCatalogCardConfig(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    showToast("Configuración de tarjeta guardada con éxito", "success");
  };

  const handleReset = () => {
    setLocalConfig({ ...catalogCardConfig });
    showToast("Valores restablecidos", "info");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-emerald-700">
              Admin
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">Diseño</span>
            <span>/</span>
            <span className="font-bold text-emerald-700">Tarjetas de Catálogo</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <LayoutTemplate className="w-6 h-6 text-emerald-600" />
            <span>Configuración Visual de Tarjetas de Producto</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personaliza los elementos visibles, proporciones, insignias y botones de las tarjetas del catálogo sin tocar código.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Deshacer</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Aplicar a la Tienda</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Controls on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Toggles & Settings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Elements Visibility */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100">
              Elementos Visibles en la Tarjeta
            </h2>

            <div className="space-y-3">
              {[
                {
                  key: "showBrand" as const,
                  label: "Mostrar Marca / Laboratorio",
                  desc: "Muestra el nombre del fabricante en mayúsculas verdes.",
                },
                {
                  key: "showSku" as const,
                  label: "Mostrar Código SKU",
                  desc: "Muestra el código interno de farmacia.",
                },
                {
                  key: "showDiscount" as const,
                  label: "Mostrar Porcentaje de Descuento (-X%)",
                  desc: "Insignia roja en la esquina superior izquierda si aplica descuento.",
                },
                {
                  key: "showSavingsBadge" as const,
                  label: "Mostrar Insignia de Ahorro ($ COP)",
                  desc: "Pastilla verde con el valor exacto ahorrado en pesos.",
                },
                {
                  key: "showStockIndicator" as const,
                  label: "Mostrar Indicador de Stock en Vivo",
                  desc: "Puntos de semáforo (🟢 En stock / 🟠 Pocas unidades / 🔴 Agotado).",
                },
                {
                  key: "showFavorites" as const,
                  label: "Mostrar Botón de Favoritos (Corazón)",
                  desc: "Permite a los usuarios guardar productos en su cuenta.",
                },
                {
                  key: "showQuickView" as const,
                  label: "Mostrar Botón de Compra Rápida / Vista Previa",
                  desc: "Icono que abre el modal express sin salir del catálogo.",
                },
                {
                  key: "showRating" as const,
                  label: "Mostrar Calificación y Estrellas",
                  desc: "Muestra la puntuación promedio (ej. 4.8 ★).",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleToggle(item.key)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 cursor-pointer select-none transition-colors"
                >
                  <div>
                    <strong className="text-xs font-bold text-slate-800 block">
                      {item.label}
                    </strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(localConfig[item.key])}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Layout & Grid Options */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100">
              Disposición y Estilo
            </h2>

            <div className="space-y-4">
              {/* Columns */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Columnas en Pantallas Grandes (Desktop):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLocalConfig({ ...localConfig, desktopColumns: 3 })}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      localConfig.desktopColumns === 3
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <Columns className="w-4 h-4" />
                    <span>3 Columnas (Tarjetas Grandes)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalConfig({ ...localConfig, desktopColumns: 4 })}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      localConfig.desktopColumns === 4
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    <span>4 Columnas (Catálogo Compacto)</span>
                  </button>
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Radio de Bordes (Biselado):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["rounded-xl", "rounded-2xl", "rounded-3xl"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setLocalConfig({ ...localConfig, borderRadius: r })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        localConfig.borderRadius === r
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold"
                          : "border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {r === "rounded-xl" ? "Moderado (12px)" : r === "rounded-2xl" ? "Estándar (16px)" : "Suave (24px)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Style */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Estilo del Botón &ldquo;Agregar al carrito&rdquo;:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLocalConfig({ ...localConfig, buttonStyle: "solid" })}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      localConfig.buttonStyle === "solid"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    Verde Sólido (Recomendado)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalConfig({ ...localConfig, buttonStyle: "outline" })}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      localConfig.buttonStyle === "outline"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    Borde Contorno Blanco/Verde
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Vista Previa en Tiempo Real</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Interactivo
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Así se renderizará cada producto en las pantallas de <code>/productos</code> y <code>/categoria/[slug]</code>:
            </p>

            <div className="max-w-xs mx-auto py-4">
              <ProductCard product={sampleProduct} />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Relación de imagen:</span>
                <strong className="text-slate-800">55% - 60% vertical</strong>
              </div>
              <div className="flex justify-between">
                <span>Tipografía:</span>
                <strong className="text-slate-800">Inter (700 / 800 precios)</strong>
              </div>
              <div className="flex justify-between">
                <span>Insignias simultáneas:</span>
                <strong className="text-slate-800">1 máxima (sin saturación)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
