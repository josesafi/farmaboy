"use client";

import React from "react";
import {
  Palette,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

export default function AdminColoresPage() {
  const { themeColors, updateThemeColors, resetThemeColors, hasPermission } = useAdminStore();
  const canWrite = hasPermission("diseno:write");

  const colorFields: {
    key: keyof typeof themeColors;
    label: string;
    description: string;
    suggested: string[];
  }[] = [
    {
      key: "primary",
      label: "Color Primario (Identidad Farmaboy)",
      description: "Color corporativo usado en botones primarios, acentos principales y badges.",
      suggested: ["#00A86B", "#059669", "#10B981", "#0284C7", "#2563EB"],
    },
    {
      key: "primaryDark",
      label: "Color Primario Oscuro (Hover / Contrastes)",
      description: "Estado hover de botones y acentos de navegación.",
      suggested: ["#008755", "#047857", "#059669", "#0369A1", "#1D4ED8"],
    },
    {
      key: "secondary",
      label: "Color Secundario (Teal Salud)",
      description: "Utilizado en categorías secundarias, servicios asistenciales e indicadores.",
      suggested: ["#00A896", "#0D9488", "#06B6D4", "#0891B2", "#0F766E"],
    },
    {
      key: "promo",
      label: "Color de Ofertas & Promociones (Acento)",
      description: "Badges de descuento, cupones y etiquetas de precio especial.",
      suggested: ["#F59E0B", "#D97706", "#EF4444", "#EA580C", "#F97316"],
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-400" />
            Paleta Cromática & Identidad Visual
          </h2>
          <p className="text-xs text-slate-400">
            Los cambios se propagan de inmediato a las variables CSS de toda la tienda en línea
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {canWrite && (
            <button
              onClick={resetThemeColors}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar por Defecto</span>
            </button>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver en Tienda</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Color Pickers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Selectores de Color Hexadecimal
              </h3>
              <p className="text-xs text-slate-400">
                Selecciona con el cuentagotas o escribe el código hexadecimal
              </p>
            </div>

            <div className="space-y-4">
              {colorFields.map((field) => {
                const currentColor = themeColors[field.key];

                return (
                  <div
                    key={field.key}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-white">{field.label}</p>
                        <p className="text-[11px] text-slate-400">{field.description}</p>
                      </div>

                      {/* Color swatch & input */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <input
                          type="color"
                          value={currentColor}
                          disabled={!canWrite}
                          onChange={(e) => updateThemeColors({ [field.key]: e.target.value })}
                          className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={currentColor}
                          disabled={!canWrite}
                          onChange={(e) => updateThemeColors({ [field.key]: e.target.value })}
                          className="w-24 px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs text-center font-bold"
                        />
                      </div>
                    </div>

                    {/* Preset Swatches */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold mr-1">
                        Sugerencias:
                      </span>
                      {field.suggested.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => updateThemeColors({ [field.key]: hex })}
                          className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 ${
                            currentColor.toLowerCase() === hex.toLowerCase()
                              ? "ring-2 ring-white"
                              : "border-slate-700"
                          }`}
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Live Interactive Preview */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              Previsualización de Componentes en Vivo
            </h3>

            <p className="text-xs text-slate-400">
              Así lucen los elementos en la tienda con la combinación seleccionada:
            </p>

            {/* Mock Header Card */}
            <div className="p-4 rounded-2xl bg-white text-slate-900 shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-xs"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    FB
                  </div>
                  <span className="font-extrabold text-xs text-slate-900">FARMABOY</span>
                </div>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: themeColors.promo }}
                >
                  OFERTA -20%
                </span>
              </div>

              {/* Mock Product Card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="h-20 rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-400 font-semibold">
                  Foto Medicamento
                </div>
                <p className="font-bold text-xs text-slate-800 leading-tight">
                  Acetaminofén 500 mg Caja x 100
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">$12.500 COP</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: `${themeColors.secondary}20`,
                      color: themeColors.secondary,
                    }}
                  >
                    INVIMA Vigente
                  </span>
                </div>

                <button
                  type="button"
                  className="w-full py-2 rounded-xl text-white font-bold text-xs transition shadow-sm"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  Agregar al Carrito
                </button>
              </div>

              <div className="text-center pt-1">
                <span
                  className="text-[11px] font-bold underline cursor-pointer"
                  style={{ color: themeColors.primaryDark }}
                >
                  Consultar disponibilidad en farmacia →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
