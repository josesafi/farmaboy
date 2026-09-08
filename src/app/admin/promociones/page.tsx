"use client";

import React, { useState } from "react";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Power,
  Calendar,
  Percent,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { PromotionRule } from "@/types/admin";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

const emptyPromotion: Omit<PromotionRule, "id" | "usedCount"> = {
  title: "",
  code: "PROMO-" + new Date().getFullYear(),
  type: "PORCENTAJE",
  value: 15,
  minPurchaseCOP: 50000,
  startDate: new Date().toISOString().split("T")[0],
  endDate: "2026-12-31",
  maxUsesTotal: 100,
  maxUsesPerCustomer: 1,
  applicableCategory: "Todas las categorías",
  isActive: true,
};

export default function AdminPromocionesPage() {
  const {
    promotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotionActive,
    hasPermission,
  } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromotionRule | null>(null);
  const [formData, setFormData] = useState(emptyPromotion);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const canWrite = hasPermission("promociones:write");

  const handleOpenAdd = () => {
    setEditingPromo(null);
    setFormData(emptyPromotion);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo: PromotionRule) => {
    setEditingPromo(promo);
    setFormData({ ...promo });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromo) {
      updatePromotion(editingPromo.id, formData);
    } else {
      addPromotion(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            Motor de Promociones, Cupones & Descuentos
          </h2>
          <p className="text-xs text-slate-400">
            Crea reglas comerciales (2x1, porcentaje, valor fijo) aplicables en el carrito y checkout Wompi
          </p>
        </div>

        {canWrite && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Promoción / Cupón</span>
          </button>
        )}
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((promo) => {
          const typeLabel: Record<string, string> = {
            PORCENTAJE: `${promo.value}% de Descuento`,
            PERCENTAGE: `${promo.value}% de Descuento`,
            FIJO: `$${promo.value.toLocaleString("es-CO")} COP Descuento`,
            FIXED_AMOUNT: `$${promo.value.toLocaleString("es-CO")} COP Descuento`,
            FREE_SHIPPING: "Envío Gratis",
            "2X1": "Oferta 2x1",
            SEGUNDA_UNIDAD_50: "2da Unidad con 50% DCTO",
          };

          return (
            <div
              key={promo.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden ${
                promo.isActive
                  ? "bg-slate-900 border-slate-800 hover:border-amber-500/40"
                  : "bg-slate-900/50 border-slate-800/60 opacity-60"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                    {promo.code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      promo.isActive
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                    }`}
                  >
                    {promo.isActive ? "ACTIVO" : "INACTIVO"}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm">{promo.title}</h3>
                <p className="text-xs font-black text-amber-400">{typeLabel[promo.type]}</p>
                <p className="text-[11px] text-slate-400">
                  Compra mínima: ${promo.minPurchaseCOP.toLocaleString("es-CO")} COP
                </p>
                <p className="text-[11px] text-slate-400">
                  Vigencia: {promo.startDate} al {promo.endDate}
                </p>
                <p className="text-[11px] text-slate-400">
                  Uso: <span className="text-white font-bold">{promo.usedCount}</span> / {promo.maxUsesTotal} canjes
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => togglePromotionActive(promo.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    promo.isActive
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{promo.isActive ? "Pausar" : "Activar"}</span>
                </button>

                {canWrite && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(promo)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(promo.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-400" />
                {editingPromo ? "Editar Regla de Promoción" : "Crear Nueva Promoción"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Título de la Promoción *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej. 15% Descuento en Bienestar Tunja"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Código de Cupón *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="BOYACA15"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tipo de Descuento</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="PORCENTAJE">Porcentaje (%)</option>
                    <option value="FIJO">Valor Fijo ($ COP)</option>
                    <option value="2X1">Paga 1 Lleva 2 (2x1)</option>
                    <option value="SEGUNDA_UNIDAD_50">Segunda Unidad al 50%</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Valor del Beneficio ({formData.type === "PORCENTAJE" ? "%" : "$ COP"})
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-black"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Compra Mínima (COP)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minPurchaseCOP}
                    onChange={(e) => setFormData({ ...formData, minPurchaseCOP: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Fecha de Inicio</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Fecha de Fin</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Límite Usos Totales</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUsesTotal}
                    onChange={(e) => setFormData({ ...formData, maxUsesTotal: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Límite por Cliente</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUsesPerCustomer}
                    onChange={(e) => setFormData({ ...formData, maxUsesPerCustomer: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition shadow-lg shadow-amber-500/20"
                >
                  Guardar Promoción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="¿Eliminar promoción?"
        message="El cupón o descuento dejará de ser aplicable en el carrito de compras."
        confirmText="Eliminar Regla"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deletePromotion(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
