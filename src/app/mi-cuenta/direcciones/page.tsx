"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Address } from "@/types/account";
import {
  MapPin,
  Plus,
  Star,
  Trash2,
  Edit2,
  CheckCircle2,
  Home,
  Briefcase,
  Building2,
  X,
  Phone,
  User,
} from "lucide-react";

export default function DireccionesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const boyacaCities = [
    "Duitama"
  ];

  const initialForm: Omit<Address, "id"> = {
    label: "Casa",
    recipientName: "",
    phone: "",
    department: "Boyacá",
    city: "Tunja",
    neighborhood: "",
    address: "",
    complement: "",
    deliveryNotes: "",
    isDefault: false,
  };

  const [formData, setFormData] = useState(initialForm);

  const openNewModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);
    setFormData({
      label: addr.label,
      recipientName: addr.recipientName,
      phone: addr.phone,
      department: addr.department,
      city: addr.city,
      neighborhood: addr.neighborhood,
      address: addr.address,
      complement: addr.complement || "",
      deliveryNotes: addr.deliveryNotes || "",
      isDefault: addr.isDefault,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address.trim() || !formData.recipientName.trim()) {
      alert("Por favor completa los campos requeridos.");
      return;
    }

    if (editingId) {
      updateAddress(editingId, formData);
    } else {
      addAddress(formData);
    }
    setIsModalOpen(false);
  };

  const getLabelIcon = (label: string) => {
    if (label === "Casa") return <Home className="w-4 h-4 text-[#00A86B]" />;
    if (label === "Trabajo") return <Briefcase className="w-4 h-4 text-blue-600" />;
    return <Building2 className="w-4 h-4 text-purple-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mis Direcciones de Entrega
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Guarda tus puntos de entrega en Tunja, Duitama, Sogamoso y todo Boyacá
          </p>
        </div>
        <button
          type="button"
          onClick={openNewModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Nueva Dirección</span>
        </button>
      </div>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
              addr.isDefault
                ? "border-[#00A86B] ring-2 ring-[#00A86B]/15 shadow-sm"
                : "border-slate-200/90 hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                    {getLabelIcon(addr.label)}
                  </div>
                  <span className="text-xs font-black uppercase text-slate-800">
                    {addr.label}
                  </span>
                </div>
                {addr.isDefault ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-black text-emerald-800">
                    <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                    Dirección Principal
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-[11px] font-bold text-slate-400 hover:text-[#00A86B] transition-colors"
                  >
                    Hacer principal
                  </button>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#00A86B] shrink-0" />
                  <span>{addr.address}</span>
                </p>
                {addr.complement && (
                  <p className="pl-5 text-slate-500 font-medium">
                    {addr.complement}
                  </p>
                )}
                <p className="pl-5 font-semibold text-slate-700">
                  {addr.neighborhood ? `${addr.neighborhood} • ` : ""}{addr.city}, {addr.department}
                </p>
                <div className="pl-5 pt-2 flex flex-col gap-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-400" />
                    Recibe: <strong className="text-slate-700">{addr.recipientName}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    Tel: {addr.phone}
                  </span>
                </div>
                {addr.deliveryNotes && (
                  <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 italic">
                    “{addr.deliveryNotes}”
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => openEditModal(addr)}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#00A86B] transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
              {addresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("¿Deseas eliminar esta dirección?")) {
                      deleteAddress(addr.id);
                    }
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {editingId ? "Editar Dirección de Entrega" : "Nueva Dirección de Entrega"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Etiqueta de lugar
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Casa", "Trabajo", "Sede Empresa", "Otra"] as const).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setFormData({ ...formData, label: lbl })}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                        formData.label === lbl
                          ? "bg-[#00A86B] text-white border-[#00A86B]"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nombre de quien recibe *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="Ej. Carlos Rodríguez"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Teléfono de contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ej. 312 456 7890"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Municipio (Boyacá) *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none bg-white font-medium"
                  >
                    {boyacaCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Barrio / Sector
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Ej. La Meseta / Centro"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Dirección principal *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ej. Carrera 2 Este # 58-30"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Apartamento / Torre / Oficina / Casa
                </label>
                <input
                  type="text"
                  value={formData.complement}
                  onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                  placeholder="Ej. Torre 3 Apto 502"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Indicaciones para el domiciliario
                </label>
                <textarea
                  rows={2}
                  value={formData.deliveryNotes}
                  onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                  placeholder="Ej. Frente al parque, portería 24h, timbrar al citófono"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded text-[#00A86B] focus:ring-[#00A86B]"
                  />
                  <span className="font-bold text-slate-700">Guardar como dirección principal</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold shadow-md shadow-[#00A86B]/20"
                >
                  Guardar Dirección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
