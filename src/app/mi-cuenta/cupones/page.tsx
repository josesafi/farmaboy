"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Ticket, Copy, Check, Clock, AlertCircle, ShoppingBag } from "lucide-react";

export default function CuponesPage() {
  const { coupons } = useAuth();
  const { setIsCartOpen } = useCart();
  const [activeTab, setActiveTab] = useState<"DISPONIBLE" | "USADO" | "VENCIDO">("DISPONIBLE");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredCoupons = coupons.filter((c) => c.status === activeTab);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApplyToCart = (code: string) => {
    handleCopy(code);
    setIsCartOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 mb-2">
            <Ticket className="w-3.5 h-3.5 text-amber-600" />
            <span>Descuentos y Promociones</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mis Cupones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Códigos promocionales válidos para tus compras en Tunja, Duitama, Sogamoso y Boyacá
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {[
          { label: "Disponibles", value: "DISPONIBLE" },
          { label: "Utilizados", value: "USADO" },
          { label: "Vencidos", value: "VENCIDO" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.value
                ? "bg-[#00A86B] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {tab.label} ({coupons.filter((c) => c.status === tab.value).length})
          </button>
        ))}
      </div>

      {/* Coupons Grid */}
      {filteredCoupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-900">
            No tienes cupones en esta sección
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Visita con frecuencia nuestra farmacia o mantente suscrito a notificaciones para recibir nuevos códigos de descuento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCoupons.map((coupon) => {
            const isCopied = copiedCode === coupon.code;
            return (
              <div
                key={coupon.id}
                className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between relative overflow-hidden ${
                  coupon.status === "DISPONIBLE"
                    ? "border-amber-300 shadow-sm"
                    : "border-slate-200/80 opacity-70 bg-slate-50/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-dashed border-slate-200">
                    <span className="font-mono text-sm font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-xl">
                      {coupon.code}
                    </span>
                    <span className="text-lg font-black text-[#00A86B]">
                      {coupon.discountDisplay}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium mb-3">
                    {coupon.terms}
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-500">
                    <p>
                      Mínimo de compra:{" "}
                      <strong className="text-slate-800">
                        ${coupon.minPurchase.toLocaleString("es-CO")} COP
                      </strong>
                    </p>
                    <p>
                      Válido hasta: <strong className="text-slate-800">{coupon.expiresAt}</strong>
                    </p>
                    {coupon.categoryAllowed && (
                      <p>
                        Categorías: <strong className="text-slate-800">{coupon.categoryAllowed}</strong>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(coupon.code)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copiar código</span>
                      </>
                    )}
                  </button>

                  {coupon.status === "DISPONIBLE" && (
                    <button
                      type="button"
                      onClick={() => handleApplyToCart(coupon.code)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Aplicar al Carrito</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
