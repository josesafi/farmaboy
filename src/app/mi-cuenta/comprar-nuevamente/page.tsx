"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  RotateCcw,
  ShoppingBag,
  Plus,
  Check,
  PackageCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function ComprarNuevamentePage() {
  const { orders } = useAuth();
  const { addItem, setIsCartOpen } = useCart();
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);
  const [addedAllSuccess, setAddedAllSuccess] = useState(false);

  // Extract all unique products from past orders
  const pastProductsMap = new Map<string, any>();
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!pastProductsMap.has(item.id)) {
        pastProductsMap.set(item.id, {
          ...item,
          lastBoughtDate: order.date,
          stockAvailable: true,
        });
      }
    });
  });

  const reorderProducts = Array.from(pastProductsMap.values());

  const handleAddSingle = (item: any) => {
    addItem(
      {
        id: item.id,
        name: item.name,
        price: item.unitPrice,
        priceDisplay: item.unitPriceDisplay,
        imageUrl: item.imageUrl,
        category: item.category,
      },
      1
    );

    setAddedItemIds((prev) => [...prev, item.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== item.id));
    }, 2000);
  };

  const handleAddAll = () => {
    reorderProducts.forEach((item) => {
      addItem(
        {
          id: item.id,
          name: item.name,
          price: item.unitPrice,
          priceDisplay: item.unitPriceDisplay,
          imageUrl: item.imageUrl,
          category: item.category,
        },
        1
      );
    });

    setAddedAllSuccess(true);
    setTimeout(() => {
      setAddedAllSuccess(false);
      setIsCartOpen(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header with Global Add All Action */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <RotateCcw className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Reabastecimiento Express</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Comprar Nuevamente
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Surtir tu botiquín, tratamiento médico o productos personales nunca fue tan fácil. Agrega con 1 clic tus artículos habituales.
          </p>
        </div>

        {reorderProducts.length > 0 && (
          <button
            type="button"
            onClick={handleAddAll}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-black shadow-lg shadow-[#00A86B]/25 transition-all active:scale-[0.99]"
          >
            {addedAllSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Todo agregado! Abriendo carrito...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Agregar todo al carrito ({reorderProducts.length})</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Grid of reorder products */}
      {reorderProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm">
          <RotateCcw className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-900">
            Aún no tienes productos comprados previamente
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            A medida que compres medicamentos, insumos o productos de bienestar, aparecerán aquí para que los puedas reordenar en segundos.
          </p>
          <Link
            href="/productos"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#00A86B] text-white text-xs font-bold"
          >
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reorderProducts.map((item) => {
            const isAdded = addedItemIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/90 hover:border-[#00A86B]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square w-full rounded-2xl bg-slate-50 overflow-hidden relative mb-3 border border-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-extrabold text-[#00A86B]">
                      {item.category}
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800">
                      En stock Boyacá
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 min-h-[32px]">
                    {item.name}
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Última compra:{" "}
                    {new Date(item.lastBoughtDate).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-black text-slate-900">
                      {item.unitPriceDisplay}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-semibold">
                      IVA incluido
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddSingle(item)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#00A86B] hover:bg-[#008755] text-white shadow-sm active:scale-95"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Agregado</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar al Carrito</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
