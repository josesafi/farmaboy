"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { paymentConfig } from "@/config/payment";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Truck,
  Sparkles,
  Tag,
} from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    shippingCost,
    discountAmount,
    couponDiscountAmount,
    lifetimeDiscountPercentage,
    lifetimeDiscountAmount,
    lifetimeDiscountReason,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    total,
    setIsCheckoutOpen,
  } = useCart();
  const [couponInput, setCouponInput] = React.useState("");

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Build WhatsApp prefilled order message
  const itemsText = items
    .map((i) => `• ${i.name} (x${i.quantity}) - ${paymentConfig.formatCOP(i.price * i.quantity)}`)
    .join("\n");
  const whatsappMsg = `Hola Farmaboy, deseo realizar el siguiente pedido de farmacia en Boyacá:\n\n${itemsText}\n\n*Subtotal:* ${paymentConfig.formatCOP(subtotal)}\n*Envío estimado:* ${shippingCost === 0 ? "GRATIS" : paymentConfig.formatCOP(shippingCost)}\n*Total:* ${paymentConfig.formatCOP(total)}\n\n¿Me indican cómo proceder con la entrega?`;

  const whatsappOrderUrl = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    whatsappMsg
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#00A86B] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Mi Carrito de Farmacia
              </h3>
              <span className="text-xs text-slate-500">
                {items.length} {items.length === 1 ? "producto" : "productos"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-slate-800">
                Tu carrito está vacío
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explora nuestro catálogo de medicamentos y productos de salud para agregar a tu pedido.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#00A86B] text-white font-bold text-xs hover:bg-[#008755]"
              >
                Ver productos
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs"
              >
                {/* Item Thumbnail */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block truncate">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {item.name}
                  </h4>
                  <span className="font-black text-xs text-[#00A86B] block mt-0.5">
                    {paymentConfig.formatCOP(item.price)}
                  </span>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-slate-600 hover:text-slate-900"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-slate-600 hover:text-slate-900"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Line Total */}
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-xs text-slate-900 block">
                    {paymentConfig.formatCOP(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3 pb-safe">
            {/* Free shipping progress indicator */}
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-3.5 h-3.5 text-[#00A86B]" />
                {subtotal >= paymentConfig.shipping.freeShippingThreshold
                  ? "¡Tienes Envío GRATIS en Boyacá!"
                  : `Faltan ${paymentConfig.formatCOP(paymentConfig.shipping.freeShippingThreshold - subtotal)} para envío gratis`}
              </span>
            </div>

            {/* Coupon Code Section */}
            <div className="pt-1">
              {appliedCoupon ? (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-emerald-800">Cupón: {appliedCoupon.code}</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      (-{paymentConfig.formatCOP(discountAmount)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Código de cupón o promo"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (couponInput.trim()) {
                          const ok = applyCoupon(couponInput.trim());
                          if (ok) setCouponInput("");
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && (
                    <span className="text-[11px] text-rose-600 font-medium block">
                      {couponError}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Lifetime discount account banner */}
            {lifetimeDiscountAmount > 0 && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border border-emerald-300 text-emerald-950 flex items-center gap-2.5 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#00A86B] text-white flex items-center justify-center shrink-0 font-black shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-emerald-900">
                      ¡{lifetimeDiscountPercentage}% Descuento Vitalicio!
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#00A86B] text-white">
                      Tu Cuenta
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 truncate">
                    {lifetimeDiscountReason || "Descuento de por vida aplicado automáticamente"}
                  </p>
                </div>
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800">
                  {paymentConfig.formatCOP(subtotal)}
                </span>
              </div>
              {lifetimeDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-extrabold bg-emerald-50/80 px-2 py-1 rounded-lg border border-emerald-200">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-emerald-600" />
                    <span>Descuento de tu Cuenta ({lifetimeDiscountPercentage}%):</span>
                  </span>
                  <span>-{paymentConfig.formatCOP(lifetimeDiscountAmount)}</span>
                </div>
              )}
              {couponDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Descuento cupón ({appliedCoupon?.code}):</span>
                  <span>-{paymentConfig.formatCOP(couponDiscountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Domicilio (Boyacá):</span>
                <span className="font-bold text-slate-800">
                  {shippingCost === 0 ? "GRATIS" : paymentConfig.formatCOP(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total a pagar:</span>
                <span className="text-[#00A86B] text-base">
                  {paymentConfig.formatCOP(total)}
                </span>
              </div>
            </div>

            {/* Payment CTAs */}
            <div className="space-y-2 pt-1">
              {/* QR Bancolombia & Bre-B Checkout Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-black text-xs sm:text-sm shadow-pharmacy transition-all flex items-center justify-center gap-2 touch-target active:scale-[0.98]"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pagar con QR Bancolombia / Bre-B</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* WhatsApp Alternative */}
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Coordinar pedido por WhatsApp</span>
              </a>
            </div>

            {/* Security note */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pagos directos con QR Bancolombia, Bre-B, Nequi y Transferencia</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
