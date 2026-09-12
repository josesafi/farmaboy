"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Plus,
  Edit2,
  Trash2,
  Tag,
  AlertTriangle,
  X,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { RetailProductItem } from "@/types/admin";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploader } from "@/components/admin/ImageUploader";

const emptyProduct: Omit<RetailProductItem, "id"> = {
  name: "",
  sku: "RET-" + Math.floor(1000 + Math.random() * 9000),
  barcode: "770" + Math.floor(100000000 + Math.random() * 900000000),
  category: "Cuidado Personal",
  brand: "",
  description: "",
  shortInfo: "",
  imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800",
  priceCOP: 25000,
  promoPriceCOP: 0,
  currentStock: 30,
  minStock: 5,
  status: "ACTIVO",
  tags: ["Destacado"],
};

export default function AdminProductosRetailPage() {
  const { retailProducts, addRetailProduct, updateRetailProduct, deleteRetailProduct, hasPermission } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<RetailProductItem | null>(null);
  const [formData, setFormData] = useState<Omit<RetailProductItem, "id">>(emptyProduct);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const canWrite = hasPermission("productos:write");

  const categories = Array.from(new Set(retailProducts.map((p) => p.category)));

  const handleOpenAdd = () => {
    setEditingProd(null);
    setFormData(emptyProduct);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: RetailProductItem) => {
    setEditingProd(prod);
    setFormData({ ...prod });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProd) {
      updateRetailProduct(editingProd.id, formData);
    } else {
      addRetailProduct(formData);
    }
    setIsModalOpen(false);
  };

  const filteredProducts = useMemo(() => {
    return retailProducts.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);
      const matchesCat = selectedCategory === "TODOS" || p.category === selectedCategory;
      return matchesQuery && matchesCat;
    });
  }, [retailProducts, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-teal-400" />
            Catálogo Retail de Farmacia (Cuidado Personal, Bebés & Bienestar)
          </h2>
          <p className="text-xs text-slate-400">
            Administra productos de consumo, dermocosmética, higiene y dispositivos de salud
          </p>
        </div>

        {canWrite && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-teal-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto Retail</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por producto, marca o SKU..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
          >
            <option value="TODOS">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Producto</th>
                <th className="py-3.5 px-3 font-semibold">Marca & SKU</th>
                <th className="py-3.5 px-3 font-semibold">Categoría</th>
                <th className="py-3.5 px-3 font-semibold">Precio Regular</th>
                <th className="py-3.5 px-3 font-semibold">Precio Promo</th>
                <th className="py-3.5 px-3 font-semibold">Stock</th>
                <th className="py-3.5 px-3 font-semibold">Estado</th>
                <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No se encontraron productos retail registrados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isLow = prod.currentStock <= prod.minStock;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-800/40 transition group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white group-hover:text-teal-400 transition-colors">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">{prod.shortInfo}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <p className="font-semibold text-slate-200">{prod.brand}</p>
                        <p className="text-[11px] text-slate-400 font-mono">SKU: {prod.sku}</p>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {prod.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-black text-white text-sm">
                        ${prod.priceCOP.toLocaleString("es-CO")}
                      </td>

                      <td className="py-3.5 px-3">
                        {prod.promoPriceCOP ? (
                          <span className="font-black text-amber-400">
                            ${prod.promoPriceCOP.toLocaleString("es-CO")}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${isLow ? "text-rose-400" : "text-slate-200"}`}>
                            {prod.currentStock}
                          </span>
                          <span className="text-slate-400 text-[10px]">/ min {prod.minStock}</span>
                        </div>
                        {isLow && (
                          <span className="text-[9px] font-bold text-rose-400 flex items-center gap-0.5 mt-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> Stock Bajo
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            prod.status === "ACTIVO"
                              ? "bg-teal-500/10 text-teal-400 border-teal-500/30"
                              : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                          }`}
                        >
                          {prod.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canWrite && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(prod)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                title="Editar producto"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTargetId(prod.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                                title="Mover a papelera"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-teal-400" />
                {editingProd ? "Editar Producto Retail" : "Nuevo Producto Retail"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Bloqueador Solar FPS 50+"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Marca *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ej. La Roche-Posay / Nivea"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Cuidado Personal">Cuidado Personal</option>
                    <option value="Dermocosmética">Dermocosmética</option>
                    <option value="Bebés y Maternidad">Bebés y Maternidad</option>
                    <option value="Higiene y Cuidado Oral">Higiene y Cuidado Oral</option>
                    <option value="Dispositivos Médicos">Dispositivos Médicos</option>
                    <option value="Nutrición y Bienestar">Nutrición y Bienestar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Código de Barras</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Precio Normal (COP) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.priceCOP}
                    onChange={(e) => setFormData({ ...formData, priceCOP: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Precio Oferta (COP)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.promoPriceCOP || 0}
                    onChange={(e) => setFormData({ ...formData, promoPriceCOP: Number(e.target.value) })}
                    placeholder="0 si no aplica"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Actual</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <ImageUploader 
                  label="Fotografía del Producto"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Descripción Breve</label>
                <textarea
                  rows={2}
                  value={formData.shortInfo}
                  onChange={(e) => setFormData({ ...formData, shortInfo: e.target.value })}
                  placeholder="Detalles sobre presentación y uso..."
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black transition shadow-lg shadow-teal-500/20"
                >
                  {editingProd ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="¿Mover producto a la papelera?"
        message="El producto se retirará de la tienda online de FarmaBoy, pero podrás restaurarlo cuando quieras."
        confirmText="Mover a Papelera"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteRetailProduct(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
