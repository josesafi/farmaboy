"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Check,
  Eye,
  Star,
  AlertCircle,
  Zap,
} from "lucide-react";
import { CatalogProduct } from "@/types/catalog";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useAdminStore } from "@/context/AdminStoreContext";

interface ProductCardProps {
  product: CatalogProduct;
  onQuickView?: (product: CatalogProduct) => void;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
}) => {
  const { addItem, setIsCartOpen } = useCart();
  const { isFavorite, toggleFavorite } = useAuth();
  const { catalogCardConfig, showToast } = useAdminStore();

  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const favorited = isFavorite(product.id);
  const isOutOfStock = product.currentStock <= 0 || product.status === "AGOTADO";
  const isLowStock = !isOutOfStock && product.currentStock <= (product.minStock || 5);

  const formatCOP = (val: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    setIsAdding(true);
    const added = addItem(
      {
        id: product.id,
        name: product.name,
        price: product.priceCOP,
        imageUrl: product.imageUrl,
        category: product.category,
        sku: product.sku,
      },
      1
    );

    if (added) {
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
        setIsAdding(false);
      }, 1500);
    } else {
      setIsAdding(false);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    showToast(
      favorited
        ? `Removido de favoritos: ${product.name}`
        : `Guardado en favoritos: ${product.name}`,
      favorited ? "info" : "success"
    );
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  // Determine SINGLE badge
  const renderSingleBadge = () => {
    if (isOutOfStock) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-white shadow-sm">
          Agotado
        </span>
      );
    }
    if (catalogCardConfig.showDiscount && product.discountPercentage && product.discountPercentage > 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm tracking-tight">
          -{product.discountPercentage}%
        </span>
      );
    }
    if (product.requiresPrescription) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
          Receta médica
        </span>
      );
    }
    if (product.badge) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
          {product.badge}
        </span>
      );
    }
    if (product.isBestSeller) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white shadow-sm">
          Más vendido
        </span>
      );
    }
    if (product.isNew) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-600 text-white shadow-sm">
          Nuevo
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`group bg-white ${catalogCardConfig.borderRadius || "rounded-2xl"} border border-slate-100 hover:border-emerald-300 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden`}
    >
      {/* Top Image Area: 55-60% card height */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-gradient-to-b from-slate-50/90 to-slate-100/40 p-4 flex items-center justify-center overflow-hidden">
        {/* Single Badge - Top Left */}
        <div className="absolute top-2.5 left-2.5 z-10">
          {renderSingleBadge()}
        </div>

        {/* Favorite Heart - Top Right */}
        {catalogCardConfig.showFavorites && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={favorited ? "Quitar de favoritos" : "Guardar en favoritos"}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm hover:scale-110 active:scale-95 transition-all"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                favorited ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
          </button>
        )}

        {/* Product Image with Link */}
        <Link
          href={`/producto/${product.slug}`}
          className="w-full h-full flex items-center justify-center relative"
        >
          <img
            src={
              imgError || !product.imageUrl
                ? "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80"
                : product.imageUrl
            }
            alt={product.name}
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
            loading="lazy"
          />
        </Link>

        {/* Quick View Button on Hover */}
        {catalogCardConfig.showQuickView && (
          <button
            type="button"
            onClick={handleQuickViewClick}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md hover:bg-emerald-600 hover:text-white flex items-center gap-1.5 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista rápida</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & SKU */}
          <div className="flex items-center justify-between gap-1 mb-1">
            {catalogCardConfig.showBrand && (
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider line-clamp-1">
                {product.brand}
              </span>
            )}
            {catalogCardConfig.showSku && product.sku && (
              <span className="text-[10px] text-slate-400 font-mono">
                {product.sku}
              </span>
            )}
          </div>

          {/* Product Title (Max 2 lines) */}
          <Link href={`/producto/${product.slug}`} className="block group/link">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-800 group-hover/link:text-emerald-700 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Presentation */}
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            {product.presentation || product.genericName || "Unidad"}
          </p>

          {/* Rating */}
          {catalogCardConfig.showRating && (
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {product.rating || 4.8}
              </span>
              <span className="text-[11px] text-slate-400">
                ({product.reviewCount || 18})
              </span>
            </div>
          )}
        </div>

        {/* Pricing, Stock & Buttons */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          {/* Price Block */}
          <div className="flex items-baseline gap-2 flex-wrap mb-1.5">
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {formatCOP(product.priceCOP)}
            </span>
            {product.previousPriceCOP && product.previousPriceCOP > product.priceCOP && (
              <span className="text-xs text-slate-400 line-through">
                {formatCOP(product.previousPriceCOP)}
              </span>
            )}
          </div>

          {/* Savings Badge */}
          {catalogCardConfig.showSavingsBadge && product.savingsCOP && product.savingsCOP > 0 && (
            <div className="mb-2">
              <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                Ahorras {formatCOP(product.savingsCOP)}
              </span>
            </div>
          )}

          {/* Stock Indicator */}
          {catalogCardConfig.showStockIndicator && (
            <div className="flex items-center gap-1.5 mb-3 text-[11px] font-medium">
              {isOutOfStock ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-rose-600">Agotado</span>
                </>
              ) : isLowStock ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-700">
                    Últimas {product.currentStock} unidades
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-700">En stock • Tunja</span>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isOutOfStock || isAdding}
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-98 ${
                isOutOfStock
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  : justAdded
                  ? "bg-emerald-600 text-white shadow-sm"
                  : catalogCardConfig.buttonStyle === "outline"
                  ? "border border-emerald-600 text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md active:bg-emerald-800"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡Agregado!</span>
                </>
              ) : isOutOfStock ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Agotado</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Agregar</span>
                </>
              )}
            </button>

            {/* Direct Express Buy / Quick View */}
            {onQuickView && !isOutOfStock && (
              <button
                type="button"
                onClick={handleQuickViewClick}
                title="Compra rápida"
                aria-label="Compra rápida"
                className="w-10 h-10 rounded-xl border border-slate-200 hover:border-emerald-400 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 flex items-center justify-center transition-colors shrink-0"
              >
                <Zap className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
