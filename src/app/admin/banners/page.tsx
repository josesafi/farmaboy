"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Power,
  ArrowUpDown,
  ExternalLink,
  X,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { BannerItem } from "@/types/admin";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploader } from "@/components/admin/ImageUploader";

const emptyBanner: Omit<BannerItem, "id"> = {
  title: "",
  subtitle: "",
  badge: "NUEVO",
  imageUrl: "https://images.unsplash.com/photo-1586015555751-63c2999e32a4?q=80&w=1200",
  linkUrl: "/medicamentos",
  buttonText: "Ver Catálogo",
  placement: "HERO_PRINCIPAL",
  isActive: true,
  order: 1,
};

export default function AdminBannersPage() {
  const { banners, addBanner, updateBanner, deleteBanner, hasPermission } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [formData, setFormData] = useState(emptyBanner);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const canWrite = hasPermission("contenido:write");

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({ ...emptyBanner, order: banners.length + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BannerItem) => {
    setEditingBanner(b);
    setFormData({ ...b });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      updateBanner(editingBanner.id, formData);
    } else {
      addBanner(formData);
    }
    setIsModalOpen(false);
  };

  const toggleActive = (b: BannerItem) => {
    updateBanner(b.id, { isActive: !b.isActive });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            Gestión de Banners & Carrusel de Portada
          </h2>
          <p className="text-xs text-slate-400">
            Controla las promociones visuales que los clientes ven en el Hero de la tienda en Boyacá
          </p>
        </div>

        {canWrite && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Banner Promocional</span>
          </button>
        )}
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {banners.map((b) => (
          <div
            key={b.id}
            className={`rounded-3xl border overflow-hidden transition-all flex flex-col justify-between shadow-xl ${
              b.isActive
                ? "bg-slate-900 border-slate-800 hover:border-emerald-500/40"
                : "bg-slate-900/50 border-slate-800/60 opacity-60"
            }`}
          >
            {/* Banner Preview image */}
            <div className="relative h-44 w-full bg-slate-950 overflow-hidden group">
              <img
                src={b.imageUrl}
                alt={b.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {b.badge && (
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500 text-slate-950">
                    {b.badge}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900/80 text-white border border-slate-700">
                  {b.placement}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-extrabold text-white text-sm line-clamp-1">{b.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-1">{b.subtitle}</p>
              </div>
            </div>

            {/* Info and controls */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Orden: #{b.order}</span>
                <span className="text-emerald-400 font-bold truncate max-w-[150px]">
                  Botón: {b.buttonText}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => toggleActive(b)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    b.isActive
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{b.isActive ? "Pausar" : "Activar"}</span>
                </button>

                {canWrite && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Editar banner"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(b.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                      title="Eliminar banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                {editingBanner ? "Editar Banner" : "Nuevo Banner Promocional"}
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
                <label className="block text-slate-300 font-bold mb-1">Título del Banner *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej. Tu Farmacia de Confianza en Boyacá"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Subtítulo / Mensaje Promocional *</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Ej. Entrega rápida en Tunja, Duitama y Sogamoso..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Badge Superior</label>
                  <input
                    type="text"
                    value={formData.badge || ""}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Ej. ENVÍO GRATIS, PROMO..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Ubicación</label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="HERO_PRINCIPAL">Hero Principal (Home)</option>
                    <option value="OFERTAS_SECUNDARIAS">Ofertas Secundarias</option>
                    <option value="B2B_DESTACADO">Sección Empresas B2B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Texto del Botón *</label>
                  <input
                    type="text"
                    required
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="Comprar Ahora"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Enlace de Destino</label>
                  <input
                    type="text"
                    required
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="/medicamentos o https://..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <ImageUploader 
                  label="URL de la Imagen *"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                />
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition shadow-lg shadow-emerald-500/20"
                >
                  Guardar Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="¿Mover banner a papelera?"
        message="El banner dejará de mostrarse en la portada de la tienda online."
        confirmText="Mover a Papelera"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteBanner(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
