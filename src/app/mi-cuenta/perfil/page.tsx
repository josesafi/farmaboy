"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Camera,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastName: user?.lastName || "",
    documentType: user?.documentType || "CC",
    documentNumber: user?.documentNumber || "",
    birthDate: user?.birthDate || "",
    phone: user?.phone || "",
    whatsapp: user?.whatsapp || "",
    email: user?.email || "",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mi Perfil Personal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Administra tus datos de contacto, identificación y preferencias en Farmaboy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00A86B]" />
            Cuenta Verificada
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs font-bold text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#00A86B] shrink-0" />
          <span>¡Tus datos de perfil se actualizaron correctamente!</span>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        {/* Avatar Section */}
        <div className="flex items-center gap-5 pb-6 mb-6 border-b border-slate-100">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00A86B] to-[#008755] text-white font-black text-2xl flex items-center justify-center shadow-md">
              {formData.name ? formData.name[0] : "C"}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-slate-900 text-white hover:bg-[#00A86B] transition-colors shadow-sm"
              title="Cambiar foto de perfil"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">
              {formData.name} {formData.lastName}
            </h2>
            <p className="text-xs text-slate-500">{formData.email}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cliente activo desde {user?.createdAt || "Enero 2025"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nombres
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Apellidos
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tipo de Documento
              </label>
              <select
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none bg-white"
              >
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="CE">Cédula de Extranjería (CE)</option>
                <option value="TI">Tarjeta de Identidad (TI)</option>
                <option value="NIT">NIT Persona / Empresa</option>
                <option value="PAS">Pasaporte</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Número de Identificación
              </label>
              <input
                type="text"
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Correo Electrónico
                </label>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Verificado
                </span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Celular / WhatsApp
                </label>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Verificado
                </span>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })
                  }
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Fecha de Nacimiento
            </label>
            <div className="relative max-w-xs">
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Utilizamos esta fecha para felicitarte con beneficios exclusivos durante tu mes de cumpleaños.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-xs shadow-md shadow-[#00A86B]/20 transition-all active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
