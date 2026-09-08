"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FamilyMember } from "@/types/account";
import {
  Users,
  Plus,
  Trash2,
  Calendar,
  UserCheck,
  ShieldCheck,
  X,
  HeartHandshake,
} from "lucide-react";

export default function FamiliaPage() {
  const { familyMembers, addFamilyMember, removeFamilyMember } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    name: "",
    relationship: "Hijo/a" as const,
    birthDate: "",
    identification: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addFamilyMember(formData);
    setFormData(initialForm);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-purple-800 mb-2">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Gestión de Dependientes y Seres Queridos</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mi Familia
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Registra a tus padres, hijos o familiares para asociar pedidos, fórmulas médicas y personalizar los rótulos de entrega en Boyacá.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Familiar</span>
        </button>
      </div>

      {/* Privacy Guarantee Alert */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-[#00A86B] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Privacidad Protegida:</strong> FarmaBoy solo conserva los datos estrictamente necesarios para rotular correctamente los pedidos y verificar recetas. Nunca compartimos información médica ni personal con terceros.
        </p>
      </div>

      {/* Family Members Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {familyMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-extrabold text-xs">
                  {member.relationship}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`¿Eliminar el perfil de ${member.name}?`)) {
                      removeFamilyMember(member.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Eliminar familiar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-black text-slate-900">
                {member.name}
              </h3>

              <div className="mt-2 space-y-1 text-xs text-slate-500">
                {member.identification && (
                  <p>Documento: <strong className="text-slate-700">{member.identification}</strong></p>
                )}
                {member.birthDate && (
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Fecha de nacimiento: {member.birthDate}
                  </p>
                )}
                {member.notes && (
                  <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                    “{member.notes}”
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Disponible al realizar pedidos</span>
              <span className="text-emerald-700 font-bold">✓ Activo</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Agregar Familiar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Agregar Perfil Familiar
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
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. María Cárdenas"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Parentesco *
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none bg-white"
                  >
                    <option value="Hijo/a">Hijo/a</option>
                    <option value="Madre">Madre</option>
                    <option value="Padre">Padre</option>
                    <option value="Pareja">Pareja / Cónyuge</option>
                    <option value="Abuelo/a">Abuelo/a</option>
                    <option value="Familiar">Otro Familiar</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Documento (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="CC o TI"
                    value={formData.identification}
                    onChange={(e) => setFormData({ ...formData, identification: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Fecha de nacimiento (Opcional)
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Notas de entrega o preferencia (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Entregar en horario matutino / Presentación jarabe"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  Guardar Familiar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
