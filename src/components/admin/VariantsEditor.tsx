"use client";

import React, { useState } from "react";
import { ProductVariant } from "@/types/admin";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

interface VariantsEditorProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  baseSku: string;
}

export function VariantsEditor({ variants, onChange, baseSku }: VariantsEditorProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductVariant>>({});

  const handleAddVariant = () => {
    const newId = "var-" + Date.now();
    const newVariant: ProductVariant = {
      id: newId,
      name: "",
      presentation: "",
      priceCOP: 0,
      currentStock: 10,
      sku: `${baseSku}-${variants.length + 1}`,
    };
    onChange([...variants, newVariant]);
    setIsEditing(newId);
    setEditForm(newVariant);
  };

  const handleSaveEdit = () => {
    if (!editForm.name || !editForm.priceCOP) {
      alert("Nombre y precio son obligatorios para la variante.");
      return;
    }
    onChange(
      variants.map((v) => (v.id === isEditing ? (editForm as ProductVariant) : v))
    );
    setIsEditing(null);
  };

  const handleRemove = (id: string) => {
    onChange(variants.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-4 border border-slate-700/50 p-4 rounded-2xl bg-slate-900/50">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Variantes / Presentaciones</h4>
          <p className="text-[10px] text-slate-400">Diferentes tamaños, sabores o presentaciones del mismo producto.</p>
        </div>
        <button
          type="button"
          onClick={handleAddVariant}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-xs font-bold transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir Variante
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-700 rounded-xl">
          Este producto no tiene variantes adicionales.
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((v) => (
            <div key={v.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              {isEditing === v.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Nombre (ej: Sabor Fresa 500ml)</label>
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        placeholder="Nombre de variante"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Presentación Corta</label>
                      <input
                        type="text"
                        value={editForm.presentation || ""}
                        onChange={(e) => setEditForm({ ...editForm, presentation: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        placeholder="ej: 500ml"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Precio COP</label>
                      <input
                        type="number"
                        value={editForm.priceCOP || 0}
                        onChange={(e) => setEditForm({ ...editForm, priceCOP: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Stock</label>
                      <input
                        type="number"
                        value={editForm.currentStock || 0}
                        onChange={(e) => setEditForm({ ...editForm, currentStock: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">SKU</label>
                      <input
                        type="text"
                        value={editForm.sku || ""}
                        onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsEditing(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5 inline mr-1" /> Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-bold text-white shadow-lg shadow-emerald-500/20"
                    >
                      <Check className="w-3.5 h-3.5 inline mr-1" /> Guardar Variante
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">{v.name} <span className="text-[10px] text-slate-500 font-mono ml-2">{v.sku}</span></h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      ${v.priceCOP.toLocaleString()} COP • Stock: <span className={v.currentStock > 0 ? "text-emerald-400" : "text-rose-400"}>{v.currentStock}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(v.id);
                        setEditForm(v);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(v.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
