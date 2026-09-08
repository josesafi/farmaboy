"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Check,
  X,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Sparkles,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { CatalogCategory } from "@/types/catalog";
import { slugify } from "@/config/initialCatalogData";

export default function AdminCategoriasPage() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    allCatalogProducts,
    showToast,
  } = useAdminStore();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CatalogCategory | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    emoji: "📦",
    iconName: "Folder",
    description: "",
    badge: "",
    order: 1,
    isActive: true,
    seoTitle: "",
    seoDescription: "",
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      emoji: "💊",
      iconName: "Pill",
      description: "",
      badge: "",
      order: categories.length + 1,
      isActive: true,
      seoTitle: "",
      seoDescription: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CatalogCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      emoji: cat.emoji || "📦",
      iconName: cat.iconName || "Folder",
      description: cat.description || "",
      badge: cat.badge || "",
      order: cat.order || 1,
      isActive: cat.isActive !== false,
      seoTitle: cat.seoTitle || "",
      seoDescription: cat.seoDescription || "",
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = slugify(name);
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : slug,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      showToast("El nombre y el slug son obligatorios", "error");
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formData.name,
        slug: formData.slug,
        emoji: formData.emoji,
        iconName: formData.iconName,
        description: formData.description,
        badge: formData.badge,
        order: Number(formData.order),
        isActive: formData.isActive,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
      });
      showToast(`Categoría "${formData.name}" actualizada`, "success");
    } else {
      addCategory({
        name: formData.name,
        slug: formData.slug,
        emoji: formData.emoji,
        iconName: formData.iconName,
        description: formData.description,
        badge: formData.badge,
        order: Number(formData.order),
        isActive: formData.isActive,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
      });
      showToast(`Categoría "${formData.name}" creada`, "success");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar la categoría "${name}"?`)) {
      deleteCategory(id);
      showToast(`Categoría "${name}" eliminada`, "info");
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase().trim()) ||
    c.slug.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-emerald-700">
              Admin
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">Catálogo</span>
            <span>/</span>
            <span className="font-bold text-emerald-700">Categorías</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-emerald-600" />
            <span>Gestor de Categorías Farmacéuticas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administra las categorías de productos, emojis, insignias y su visibilidad en la tienda.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Total Categorías</span>
            <strong className="text-2xl font-black text-slate-900">{categories.length}</strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            🏷️
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Activas en Catálogo</span>
            <strong className="text-2xl font-black text-emerald-700">
              {categories.filter((c) => c.isActive !== false).length}
            </strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Productos Asociados</span>
            <strong className="text-2xl font-black text-indigo-700">
              {allCatalogProducts.length}
            </strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            💊
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar categoría o slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-400">
            Mostrando {filteredCategories.length} categorías
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Orden</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Slug URL</th>
                <th className="py-3 px-4">Insignia</th>
                <th className="py-3 px-4 text-center">Productos</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCategories.map((cat) => {
                const productCount = allCatalogProducts.filter(
                  (p) => p.categorySlug === cat.slug
                ).length;
                return (
                  <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                      {cat.order || 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0">{cat.emoji}</span>
                        <div>
                          <strong className="text-slate-900 font-bold text-sm block">
                            {cat.name}
                          </strong>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <code className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        /categoria/{cat.slug}
                      </code>
                    </td>
                    <td className="py-3.5 px-4">
                      {cat.badge ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {cat.badge}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {productCount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          updateCategory(cat.id, { isActive: !cat.isActive })
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          cat.isActive !== false
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {cat.isActive !== false ? "Activa" : "Inactiva"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/categoria/${cat.slug}`}
                          target="_blank"
                          title="Ver en tienda"
                          className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          title="Editar"
                          className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id, cat.name)}
                          title="Eliminar"
                          className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-slate-600 hover:text-rose-700 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingCategory ? "Editar Categoría" : "Crear Nueva Categoría"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">Emoji</label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="w-full text-center text-xl py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ej. Dermocosmética"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="ej. dermocosmetica"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve resumen visible en el banner de la categoría..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Insignia / Badge (opcional)</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Ej. Esencial, Ofertas, Nuevo"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Orden de visualización</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <label htmlFor="catActive" className="font-semibold text-slate-800 cursor-pointer">
                  Categoría activa y visible en el menú
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingCategory ? "Guardar Cambios" : "Crear Categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
