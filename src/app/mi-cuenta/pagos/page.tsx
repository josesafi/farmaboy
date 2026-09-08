"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { PaymentMethodToken } from "@/types/account";
import {
  CreditCard,
  Plus,
  Trash2,
  Star,
  ShieldCheck,
  CheckCircle2,
  Lock,
  X,
} from "lucide-react";

export default function PagosPage() {
  const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    brand: "VISA" as const,
    lastFour: "1234",
    holderName: "",
    expiry: "12/28",
    isDefault: false,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.holderName.trim()) return;
    addPaymentMethod(formData);
    setFormData({
      brand: "VISA",
      lastFour: "1234",
      holderName: "",
      expiry: "12/28",
      isDefault: false,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 mb-2">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>Tokenización y Pagos Seguros</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Métodos de Pago
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Administra tus medios de pago protegidos con cifrado Wompi Bancolombia para compras más veloces en Boyacá.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Medio de Pago</span>
        </button>
      </div>

      {/* Security Statement */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3.5 text-xs text-emerald-950">
        <Lock className="w-5 h-5 text-[#00A86B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-emerald-900">
            Estándar de Seguridad PCI-DSS y Criptografía Wompi
          </p>
          <p className="text-emerald-800 text-[11px] leading-relaxed">
            FarmaBoy <strong>nunca almacena tu número completo de tarjeta ni el código CVV</strong> en sus servidores. Toda la información financiera se almacena directamente en la pasarela bancaria mediante tokens criptográficos inviolables.
          </p>
        </div>
      </div>

      {/* Payment methods list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((pm) => (
          <div
            key={pm.id}
            className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
              pm.isDefault
                ? "border-[#00A86B] ring-2 ring-[#00A86B]/15 shadow-sm"
                : "border-slate-200/90 hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-6 rounded-md bg-slate-900 text-white font-black text-[10px] flex items-center justify-center tracking-wider">
                    {pm.brand.replace("_", " ")}
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {pm.brand === "PSE_BANCOLOMBIA" ? "Cuenta Bancaria PSE" : "Tarjeta de Crédito / Débito"}
                  </span>
                </div>

                {pm.isDefault ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-black text-emerald-800">
                    <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                    Predeterminado
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDefaultPaymentMethod(pm.id)}
                    className="text-[11px] font-bold text-slate-400 hover:text-[#00A86B] transition-colors"
                  >
                    Hacer principal
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {pm.lastFour ? (
                  <p className="font-mono text-base font-black text-slate-800 tracking-wider">
                    •••• •••• •••• {pm.lastFour}
                  </p>
                ) : (
                  <p className="text-sm font-bold text-slate-800">
                    Débito Seguro PSE
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  Titular: <strong className="text-slate-700">{pm.holderName}</strong>
                </p>
                {pm.expiry && (
                  <p className="text-[11px] text-slate-400">
                    Vence: {pm.expiry}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Token activo con Wompi</span>
              {paymentMethods.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("¿Deseas desvincular este método de pago?")) {
                      removePaymentMethod(pm.id);
                    }
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Agregar Método */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Vincular Método de Pago Seguro
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
                  Franquicia o Método *
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none bg-white font-medium"
                >
                  <option value="VISA">Visa (Crédito / Débito)</option>
                  <option value="MASTERCARD">Mastercard</option>
                  <option value="AMEX">American Express</option>
                  <option value="PSE_BANCOLOMBIA">Cuenta PSE Bancolombia</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nombre del Titular (como aparece en la tarjeta) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. CARLOS RODRIGUEZ"
                  value={formData.holderName}
                  onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Últimos 4 dígitos *
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    placeholder="4821"
                    value={formData.lastFour}
                    onChange={(e) => setFormData({ ...formData, lastFour: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Vencimiento (MM/AA)
                  </label>
                  <input
                    type="text"
                    placeholder="10/28"
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                Se realizará una validación criptográfica de $0 COP a través de Wompi Bancolombia para autenticar el medio.
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
                  Vincular Método
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
