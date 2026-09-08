"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { farmaboyConfig } from "@/config/farmaboy";
import { Heart, ShoppingBag, Plus, Trash2, Check, ArrowRight } from "lucide-react";

export default function FavoritosPage() {
  const { favorites, toggleFavorite } = useAuth();
  const { addItem } = useCart();
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  // Filter products from config matching favorite IDs
  const favoriteProducts = farmaboyConfig.featuredProducts.filter((p) =>
    favorites.includes(p.id)
  );

  const handleAddToCart = (product: any) => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        priceDisplay: product.priceDisplay,
        imageUrl: product.imageUrl,
        category: product.category,
      },
      1
    );

    setAddedItemIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== product.id));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Mis Productos Guardados</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Favoritos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tus medicamentos y productos de bienestar preferidos para pedir cuando los necesites
          </p>
        </div>

        <Link
          href="/productos"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
        >
          <span>Explorar más productos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-900">
            No tienes productos guardados en favoritos
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Puedes hacer clic en el corazón de cualquier medicamento o producto del catálogo para guardarlo aquí.
          </p>
          <Link
            href="/productos"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#00A86B] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20"
          >
            Ver productos de farmacia
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteProducts.map((product) => {
            const isAdded = addedItemIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/90 hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-square w-full rounded-2xl bg-slate-50 overflow-hidden relative mb-3 border border-slate-100">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />
                    <button
                      type="button"
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-500 shadow-sm hover:scale-110 transition-transform"
                      title="Quitar de favoritos"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    </button>
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-black text-[#00A86B]">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 min-h-[32px]">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {product.shortInfo}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-black text-slate-900">
                      {product.priceDisplay}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-bold">
                      Disponible Boyacá
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#00A86B] hover:bg-[#008755] text-white shadow-sm"
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
                        <span>Pedir</span>
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
