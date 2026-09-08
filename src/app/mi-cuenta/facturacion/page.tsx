"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BillingProfile } from "@/types/account";
import {
  Receipt,
  Building2,
  User,
  Save,
  CheckCircle2,
  FileCheck2,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";

export default function FacturacionPage() {
  const { billingProfile, updateBillingProfile } = useAuth();
  const [profileType, setProfileType] = useState<"PERSONA_NATURAL" | "EMPRESA">(
    billingProfile.type
  );

  const [formData, setFormData] = useState<BillingProfile>(billingProfile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBillingProfile({ ...formData, type: profileType });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <Receipt className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Facturación Electrónica DIAN</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Datos Fiscales y Facturación
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Configura el perfil fiscal con el que se emitirán las facturas electrónicas XML/PDF de tus compras en Farmaboy.
          </p>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs font-bold text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#00A86B] shrink-0" />
          <span>¡Datos de facturación electrónica actualizados con éxito!</span>
        </div>
      )}

      {/* Profile Type Toggle */}
      <div className="grid grid-cols-2 p-1.5 bg-white rounded-2xl border border-slate-200 text-xs font-bold shadow-xs">
        <button
          type="button"
          onClick={() => {
            setProfileType("PERSONA_NATURAL");
            setFormData({
              ...formData,
              type: "PERSONA_NATURAL",
              documentType: "CC",
            });
          }}
          className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            profileType === "PERSONA_NATURAL"
              ? "bg-[#00A86B] text-white shadow-md shadow-[#00A86B]/20"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Persona Natural</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setProfileType("EMPRESA");
            setFormData({
              ...formData,
              type: "EMPRESA",
              documentType: "NIT",
            });
          }}
          className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            profileType === "EMPRESA"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Persona Jurídica (Empresa / IPS / Institución)</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {profileType === "PERSONA_NATURAL"
                ? "Nombre Completo (como aparece en el documento) *"
                : "Razón Social o Nombre de la Empresa *"}
            </label>
            <input
              type="text"
              required
              value={formData.nameOrBusinessName}
              onChange={(e) => setFormData({ ...formData, nameOrBusinessName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] font-medium outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tipo Doc. *
              </label>
              <select
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] bg-white outline-none font-medium"
              >
                {profileType === "PERSONA_NATURAL" ? (
                  <>
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                  </>
                ) : (
                  <option value="NIT">NIT con Dígito de Verificación</option>
                )}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Número de Identificación Fiscal *
              </label>
              <input
                type="text"
                required
                placeholder={profileType === "EMPRESA" ? "Ej. 901.458.120-4" : "1049628391"}
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Correo para Recepción de Factura Electrónica (DIAN) *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="facturacion@correo.com"
                  value={formData.taxEmail}
                  onChange={(e) => setFormData({ ...formData, taxEmail: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Teléfono de Contacto Fiscal
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Dirección Fiscal (RUT) *
              </label>
              <input
                type="text"
                required
                value={formData.fiscalAddress}
                onChange={(e) => setFormData({ ...formData, fiscalAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ciudad / Departamento Fiscal *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Tunja, Boyacá"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Cumple normativa DIAN para facturación electrónica en Colombia
            </span>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-xs shadow-md shadow-[#00A86B]/20 transition-all active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Perfil Fiscal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
