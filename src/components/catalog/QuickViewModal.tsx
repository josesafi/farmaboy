"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  ShoppingCart,
  Check,
  Zap,
  ShieldCheck,
  Truck,
  FileText,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { CatalogProduct, ProductVariant } from "@/types/catalog";
import { useCart } from "@/context/CartContext";
import { useAdminStore } from "@/context/AdminStoreContext";

interface QuickViewModalProps {
  product: CatalogProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addItem, setIsCartOpen } = useCart();
  const { showToast } = useAdminStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
    }
  }, [product]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const currentPrice = selectedVariant ? selectedVariant.priceCOP : product.priceCOP;
  const currentStock = selectedVariant ? selectedVariant.currentStock : product.currentStock;
  const isOutOfStock = currentStock <= 0;

  const formatCOP = (val: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    const added = addItem(
      {
        id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
        name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
        price: currentPrice,
        imageUrl: product.imageUrl,
        category: product.category,
        sku: selectedVariant ? selectedVariant.sku : product.sku,
      },
      quantity
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

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(
      {
        id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
        name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
        price: currentPrice,
        imageUrl: product.imageUrl,
        category: product.category,
        sku: selectedVariant ? selectedVariant.sku : product.sku,
      },
      quantity
    );
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="bg-slate-50 p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-100">
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white">
                -{product.discountPercentage}% OFF
              </span>
            )}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-60 sm:max-h-72 object-contain drop-shadow-md"
            />
            {product.pharmaInfo?.registroSanitarioINVIMA && (
              <div className="mt-4 text-[11px] text-slate-400 text-center font-mono">
                {product.pharmaInfo.registroSanitarioINVIMA}
              </div>
            )}
          </div>

          {/* Details & Purchase */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center gap-2 text-xs mb-1">
                <span className="font-bold text-emerald-700 uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{product.category}</span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {product.name}
              </h2>

              {/* Presentation / Generic Name */}
              <p className="text-xs text-slate-500 mt-1">
                {product.presentation || product.genericName}
              </p>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {formatCOP(currentPrice)}
                </span>
                {product.previousPriceCOP && product.previousPriceCOP > currentPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatCOP(product.previousPriceCOP)}
                  </span>
                )}
                {product.savingsCOP && product.savingsCOP > 0 && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Ahorras {formatCOP(product.savingsCOP)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-2.5 flex items-center gap-2 text-xs font-medium">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-rose-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Agotado actualmente
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    En stock ({currentStock} disponibles en Boyacá)
                  </span>
                )}
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Seleccionar presentación:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 text-xs rounded-xl font-medium border transition-all ${
                          selectedVariant?.id === v.id
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-sm"
                            : "border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Prescription warning */}
              {product.requiresPrescription && (
                <div className="mt-3.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
                  <FileText className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <strong>Medicamento ético:</strong> Requiere fórmula médica vigente para su dispensación en Boyacá.
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {/* Quantity selector */}
              {!isOutOfStock && (
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-bold text-slate-700">Cantidad:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40 font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                      disabled={quantity >= currentStock}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={isOutOfStock || isAdding}
                  onClick={handleAddToCart}
                  className="w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border border-emerald-600 text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Agregado!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Al carrito</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Comprar ya</span>
                </button>
              </div>

              {/* Delivery info */}
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Recíbelo en 45-60 min en Tunja y alrededores.</span>
              </div>

              {/* View Full PDP */}
              <Link
                href={`/producto/${product.slug}`}
                onClick={onClose}
                className="mt-2.5 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1 group/link"
              >
                <span>Ver ficha técnica y detalles completos</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
