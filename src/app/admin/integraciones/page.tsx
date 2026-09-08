"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  Save,
  CreditCard,
  BarChart2,
  Receipt,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

export default function AdminIntegracionesPage() {
  const { integrations, updateIntegrations, hasPermission } = useAdminStore();
  const canWrite = hasPermission("configuracion:write");

  const [formData, setFormData] = useState({ ...integrations });
  const [showWompiKey, setShowWompiKey] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateIntegrations(formData);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            Integraciones, Pasarela Wompi & Analítica
          </h2>
          <p className="text-xs text-slate-400">
            Credenciales de pago, pixels de conversión y conexión DIAN protegidas
          </p>
        </div>

        {canWrite && (
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Integraciones</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Wompi Payments Integration */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Pasarela de Pagos Wompi Colombia (Bancolombia, Nequi, PSE)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Widget v1 Activo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Llave Pública Wompi (Public Key)
              </label>
              <div className="relative">
                <input
                  type={showWompiKey ? "text" : "password"}
                  disabled={!canWrite}
                  value={formData.wompiPublicKey}
                  onChange={(e) => setFormData({ ...formData, wompiPublicKey: e.target.value })}
                  placeholder="pub_prod_... o pub_test_..."
                  className="w-full p-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowWompiKey(!showWompiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showWompiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Llave utilizada para inicializar el checkout con tarjetas y transferencias en Colombia.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Ambiente de Operación</label>
              <select
                disabled={!canWrite}
                value={formData.wompiEnvironment}
                onChange={(e) => setFormData({ ...formData, wompiEnvironment: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
              >
                <option value="test">Sandbox de Pruebas (test)</option>
                <option value="prod">Producción en Vivo (prod)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                En modo Sandbox se pueden simular transacciones aprobadas y rechazadas.
              </p>
            </div>
          </div>
        </div>

        {/* Analytics and Pixels */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            Métricas de Conversión & Pixels de Publicidad
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Google Analytics 4 (GA4 ID)</label>
              <input
                type="text"
                disabled={!canWrite}
                value={formData.googleAnalyticsId}
                onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXX"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Meta Pixel ID (Facebook / IG)</label>
              <input
                type="text"
                disabled={!canWrite}
                value={formData.metaPixelId}
                onChange={(e) => setFormData({ ...formData, metaPixelId: e.target.value })}
                placeholder="1234567890..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Google Tag Manager (GTM ID)</label>
              <input
                type="text"
                disabled={!canWrite}
                value={formData.googleTagManagerId}
                onChange={(e) => setFormData({ ...formData, googleTagManagerId: e.target.value })}
                placeholder="GTM-XXXXXX"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* DIAN Electronic Billing Module Ready */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              Facturación Electrónica DIAN Colombia
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Preparado para Conexión API
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white">Emisión de Factura Electrónica en Cada Despacho</p>
              <p className="text-[11px] text-slate-400">
                Generación automática de CUFE y envío de PDF al correo del comprador según normativa colombiana.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.dianElectronicBillingActive}
                disabled={!canWrite}
                onChange={(e) =>
                  setFormData({ ...formData, dianElectronicBillingActive: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
