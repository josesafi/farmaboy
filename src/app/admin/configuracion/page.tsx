"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  MapPin,
  Phone,
  Truck,
  Building,
  Clock,
  DollarSign,
  Plus,
  Trash2,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

export default function AdminConfiguracionPage() {
  const { storeSettings, updateStoreSettings, hasPermission } = useAdminStore();
  const canWrite = hasPermission("configuracion:write");

  const [formData, setFormData] = useState({ ...storeSettings });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formData);
  };

  const handleUpdateZoneFee = (city: string, newFee: number, newTime: string) => {
    setFormData((prev) => ({
      ...prev,
      deliveryZones: prev.deliveryZones.map((z) =>
        z.city === city ? { ...z, feeCOP: newFee, estimatedTime: newTime } : z
      ),
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            Configuración Comercial & Zonas de Entrega en Boyacá
          </h2>
          <p className="text-xs text-slate-400">
            Parámetros fiscales (NIT), teléfonos, WhatsApp, tarifas de domicilio y horarios
          </p>
        </div>

        {canWrite && (
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company and Legal Identification */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            Razón Social & Datos Institucionales
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Nombre Comercial</label>
              <input
                type="text"
                disabled={!canWrite}
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Razón Social Legal</label>
              <input
                type="text"
                disabled={!canWrite}
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">NIT / Identificación Tributaria</label>
              <input
                type="text"
                disabled={!canWrite}
                value={formData.nit}
                onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Dirección Principal en Boyacá</label>
              <input
                type="text"
                disabled={!canWrite}
                value={formData.addressPrincipal}
                onChange={(e) => setFormData({ ...formData, addressPrincipal: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Horarios de Atención al Público</label>
              <input
                type="text"
                disabled={!canWrite}
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers and WhatsApp */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            Líneas Telefónicas & WhatsApp Oficial
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Número de WhatsApp (numérico)</label>
              <input
                type="text"
                disabled={!canWrite}
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">WhatsApp (Visual)</label>
              <input
                type="text"
                disabled={!canWrite}
                value={formData.whatsappDisplay}
                onChange={(e) => setFormData({ ...formData, whatsappDisplay: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Línea Fija / Conmutador</label>
              <input
                type="text"
                disabled={!canWrite}
                value={formData.phoneDisplay}
                onChange={(e) => setFormData({ ...formData, phoneDisplay: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Correo Electrónico General</label>
              <input
                type="email"
                disabled={!canWrite}
                value={formData.emailGeneral}
                onChange={(e) => setFormData({ ...formData, emailGeneral: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Shipping Rates and Thresholds by Boyacá municipality */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                Tarifas de Entrega & Domicilios por Municipio de Boyacá
              </h3>
              <p className="text-xs text-slate-400">
                Estas tarifas se aplican automáticamente en el carrito y checkout Wompi
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold">Umbral Envío Gratis:</span>
              <div className="flex items-center gap-1">
                <span className="text-emerald-400 font-black">$</span>
                <input
                  type="number"
                  min="0"
                  disabled={!canWrite}
                  value={formData.freeShippingThresholdCOP}
                  onChange={(e) =>
                    setFormData({ ...formData, freeShippingThresholdCOP: Number(e.target.value) })
                  }
                  className="w-28 p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-black text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {formData.deliveryZones.map((zone) => (
              <div
                key={zone.city}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-sm">{zone.city}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {zone.isActive ? "Ruta Activa" : "Inactiva"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                      Costo Fijo (COP)
                    </label>
                    <input
                      type="number"
                      min="0"
                      disabled={!canWrite}
                      value={zone.feeCOP}
                      onChange={(e) =>
                        handleUpdateZoneFee(zone.city, Number(e.target.value), zone.estimatedTime)
                      }
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                      Tiempo Estimado
                    </label>
                    <input
                      type="text"
                      disabled={!canWrite}
                      value={zone.estimatedTime}
                      onChange={(e) =>
                        handleUpdateZoneFee(zone.city, zone.feeCOP, e.target.value)
                      }
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
