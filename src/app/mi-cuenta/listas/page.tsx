"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  ListOrdered,
  Plus,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  X,
  Package,
} from "lucide-react";

export default function ListasPage() {
  const { lists, createList, deleteList, removeItemFromList } = useAuth();
  const { addItem, setIsCartOpen } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [addedListId, setAddedListId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createList(newListName, newListDesc);
    setNewListName("");
    setNewListDesc("");
    setIsModalOpen(false);
  };

  const handleAddListToCart = (list: any) => {
    list.items.forEach((item: any) => {
      addItem(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          priceDisplay: item.priceDisplay,
          imageUrl: item.imageUrl,
          category: item.category,
        },
        item.quantity || 1
      );
    });

    setAddedListId(list.id);
    setTimeout(() => {
      setAddedListId(null);
      setIsCartOpen(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <ListOrdered className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Organización de Compras</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Listas de Compra
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Crea listas temáticas para el botiquín del hogar, adultos mayores, bebés o suministros de oficina y agrégalas al carrito en un solo clic.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Lista</span>
        </button>
      </div>

      {/* Lists */}
      <div className="space-y-5">
        {lists.map((list) => {
          const isAdded = addedListId === list.id;
          return (
            <div
              key={list.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {list.name}
                  </h3>
                  {list.description && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {list.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {list.items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleAddListToCart(list)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-xs transition-all"
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>¡Lista agregada!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Agregar lista al carrito</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Eliminar la lista "${list.name}"?`)) {
                        deleteList(list.id);
                      }
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Eliminar lista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items in this list */}
              {list.items.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 text-center text-xs text-slate-500">
                  Esta lista no tiene productos agregados todavía. Puedes agregarlos desde el catálogo de medicamentos.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-white overflow-hidden relative shrink-0 border border-slate-100">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {item.priceDisplay}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItemFromList(list.id, item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Quitar de esta lista"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Crear Lista */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Crear Nueva Lista de Compra
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
                  Nombre de la lista *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Botiquín Finca / Cuidado Bebé"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Descripción breve (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Insumos para tener a mano en caso de malestar"
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
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
                  Crear Lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
