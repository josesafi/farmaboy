"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Store,
  Plus,
  MapPin,
  Phone,
  User,
  Star,
  CheckCircle2,
  X,
  Building2,
} from "lucide-react";

export default function SedesPage() {
  const { branches, addBranch } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    city: "Tunja",
    address: "",
    phone: "",
    managerName: "",
    managerEmail: "",
    isMainBranch: false,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) return;
    addBranch(formData);
    setFormData({
      name: "",
      city: "Tunja",
      address: "",
      phone: "",
      managerName: "",
      managerEmail: "",
      isMainBranch: false,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-2">
            <Store className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Despachos y Puntos Institucionales</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Múltiples Sedes de Entrega
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Administra las sedes, bodegas y consultorios de tu organización en Boyacá para seleccionar el destino exacto al solicitar suministros.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Nueva Sede</span>
        </button>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((b) => (
          <div
            key={b.id}
            className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
              b.isMainBranch
                ? "border-[#00A86B] ring-2 ring-[#00A86B]/15 shadow-sm"
                : "border-slate-200/90 hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <span className="text-sm font-black text-slate-900">
                  {b.name}
                </span>
                {b.isMainBranch && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-black text-emerald-800">
                    <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                    Sede Matriz
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="flex items-center gap-1.5 font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-[#00A86B] shrink-0" />
                  <span>{b.address} ({b.city}, Boyacá)</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Responsable: <strong>{b.managerName}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Contacto: {b.phone} • {b.managerEmail}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Habilitada para órdenes masivas</span>
              <span className="text-emerald-700 font-bold">✓ Operativa</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nueva Sede */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Registrar Nueva Sede Corporativa
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nombre de la sede *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sede Asistencial Chiquinquirá"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Municipio (Boyacá) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tunja / Duitama / ..."
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Teléfono directo *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="312 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Dirección completa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carrera 5 # 14-20"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nombre del Responsable / Administrador *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Dra. Laura Gómez"
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Correo del Responsable *
                </label>
                <input
                  type="email"
                  required
                  placeholder="laura@empresa.com"
                  value={formData.managerEmail}
                  onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold"
                >
                  Guardar Sede
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
