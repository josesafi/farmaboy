"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { wompiConfig } from "@/config/wompi";
import { farmaboyConfig } from "@/config/farmaboy";
import {
  X,
  CreditCard,
  Lock,
  Truck,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  Building,
  Sparkles,
  Users,
  Store,
  Clock,
  Navigation,
  Tag,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAdminStore } from "@/context/AdminStoreContext";

export const CheckoutModal: React.FC = () => {
  const {
    items,
    subtotal,
    discountAmount,
    appliedCoupon,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
  } = useCart();

  const {
    processNewOrder,
    showToast,
    deliveryRates,
    pickupPoints,
    storeSettings,
    getCustomerLifetimeDiscount,
  } = useAdminStore();

  const { user, addresses, familyMembers } = useAuth();
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

  // Delivery modality state
  const [deliveryMethod, setDeliveryMethod] = useState<"DOMICILIO" | "PUNTO_RECOGIDA">("DOMICILIO");
  const [selectedPickupPointId, setSelectedPickupPointId] = useState<string>("");

  const [formData, setFormData] = useState({
    nombre: user ? `${user.name} ${user.lastName}` : "",
    tipoDocumento: user?.documentType || "CC",
    documento: user?.documentNumber || "",
    telefono: user?.phone || "",
    correo: user?.email || "",
    municipio: defaultAddr?.city || "Duitama",
    direccion: defaultAddr ? `${defaultAddr.address}${defaultAddr.complement ? " " + defaultAddr.complement : ""}` : "",
    notas: defaultAddr?.deliveryNotes || "",
    destinatario: "Para mí",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [simulationModal, setSimulationModal] = useState<any | null>(null);

  // Active pickup points
  const activePickupPoints = pickupPoints.filter((p) => p.status === "ACTIVO");
  const selectedPickup = activePickupPoints.find((p) => p.id === selectedPickupPointId) || activePickupPoints[0];

  // Default to first active pickup point
  useEffect(() => {
    if (activePickupPoints.length > 0 && !selectedPickupPointId) {
      setSelectedPickupPointId(activePickupPoints[0].id);
    }
  }, [activePickupPoints, selectedPickupPointId]);

  // Sync with user data if authenticated
  useEffect(() => {
    if (user && isCheckoutOpen) {
      setFormData((prev) => ({
        ...prev,
        nombre: prev.nombre || `${user.name} ${user.lastName}`,
        tipoDocumento: prev.tipoDocumento || user.documentType,
        documento: prev.documento || user.documentNumber,
        telefono: prev.telefono || user.phone,
        correo: prev.correo || user.email,
        municipio: prev.municipio || defaultAddr?.city || "Duitama",
        direccion: prev.direccion || (defaultAddr ? `${defaultAddr.address}${defaultAddr.complement ? " " + defaultAddr.complement : ""}` : ""),
      }));
    }
  }, [user, isCheckoutOpen, defaultAddr]);

  if (!isCheckoutOpen) return null;

  // Dynamic detection of customer lifetime discount
  const detectedCrmDiscount = React.useMemo(() => {
    return getCustomerLifetimeDiscount({
      email: formData.correo,
      documentNumber: formData.documento,
      id: user?.id,
    });
  }, [formData.correo, formData.documento, user, getCustomerLifetimeDiscount]);

  const activeLifetimeDiscount = detectedCrmDiscount || (user?.lifetimeDiscountPercentage ? {
    percentage: user.lifetimeDiscountPercentage,
    reason: user.lifetimeDiscountReason || `Descuento Vitalicio (${user.lifetimeDiscountPercentage}%)`,
    customer: { name: user.name, lastName: user.lastName },
  } : null);

  const lifetimeDiscountPercentage = activeLifetimeDiscount?.percentage || 0;
  const lifetimeDiscountAmount = Math.round((subtotal * lifetimeDiscountPercentage) / 100);

  const couponOnlyDiscount = appliedCoupon ? (
    appliedCoupon.type === "PORCENTAJE" || appliedCoupon.type === "PERCENTAGE"
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : appliedCoupon.type === "FIJO" || appliedCoupon.type === "FIXED_AMOUNT"
      ? appliedCoupon.value
      : 0
  ) : 0;

  const totalEffectiveDiscount = lifetimeDiscountAmount + couponOnlyDiscount;

  // Matched delivery rate for the chosen municipality
  const activeRate = deliveryRates.find(
    (r) => r.isActive && (r.municipality.toLowerCase() === formData.municipio.toLowerCase() || r.zone.toLowerCase().includes(formData.municipio.toLowerCase()))
  ) || deliveryRates.find((r) => r.isActive && r.municipality.toLowerCase() === "duitama") || deliveryRates[0];

  const freeThreshold = activeRate?.freeShippingFromCOP ?? storeSettings.freeShippingThresholdCOP ?? 70000;
  const isFreeShipping =
    appliedCoupon?.type === "FREE_SHIPPING" ||
    (subtotal >= freeThreshold && freeThreshold > 0);

  const effectiveShippingCost =
    deliveryMethod === "PUNTO_RECOGIDA"
      ? 0
      : isFreeShipping
      ? 0
      : activeRate?.rateCOP ?? storeSettings.standardShippingCostCOP ?? 5000;

  const effectiveTotal = Math.max(0, subtotal - totalEffectiveDiscount) + effectiveShippingCost;

  const finalizeOrder = (reference: string, transactionId?: string): boolean => {
    const res = processNewOrder({
      customer: {
        name: formData.nombre.trim().split(" ")[0] || formData.nombre.trim(),
        lastName: formData.nombre.trim().split(" ").slice(1).join(" ") || "Cliente",
        email: formData.correo.trim(),
        phone: formData.telefono.trim(),
        documentType: formData.tipoDocumento,
        documentNumber: formData.documento.trim(),
      },
      deliveryMethod,
      pickupPointId: deliveryMethod === "PUNTO_RECOGIDA" ? selectedPickup?.id : undefined,
      pickupPointName: deliveryMethod === "PUNTO_RECOGIDA" ? selectedPickup?.name : undefined,
      shippingAddress: {
        addressLine:
          deliveryMethod === "PUNTO_RECOGIDA"
            ? (selectedPickup ? `Recoger en: ${selectedPickup.name} (${selectedPickup.address})` : "Sede Principal Duitama Cra. 16 # 15-20")
            : formData.direccion.trim(),
        city: deliveryMethod === "PUNTO_RECOGIDA" ? (selectedPickup?.municipality || "Duitama") : formData.municipio,
        department: "Boyacá",
        postalCode: "150461",
        deliveryNotes:
          deliveryMethod === "PUNTO_RECOGIDA"
            ? `RECOGER EN TIENDA: ${selectedPickup?.name || "Sede Duitama"}. Horario: ${selectedPickup?.schedule || "7:00 AM - 10:00 PM"}. Notas cliente: ${formData.notas || "Sin notas"}`
            : formData.notas,
      },
      items: items.map((i) => ({
        productId: i.id,
        productName: i.name,
        sku: i.sku || i.id,
        quantity: i.quantity,
        unitPriceCOP: i.price,
        totalCOP: i.price * i.quantity,
      })),
      subtotalCOP: subtotal,
      discountCOP: totalEffectiveDiscount,
      customerLifetimeDiscount: activeLifetimeDiscount ? {
        percentage: activeLifetimeDiscount.percentage,
        amountCOP: lifetimeDiscountAmount,
        reason: activeLifetimeDiscount.reason,
      } : undefined,
      shippingCOP: effectiveShippingCost,
      totalCOP: effectiveTotal,
      paymentMethod: "WOMPI",
      couponCode: appliedCoupon?.code,
      notes: `Destinatario: ${formData.destinatario}. Modalidad: ${deliveryMethod === "PUNTO_RECOGIDA" ? "Recogida en Tienda" : "Domicilio Express"}.${activeLifetimeDiscount ? ` Beneficio: ${activeLifetimeDiscount.percentage}% OFF Vitalicio (${activeLifetimeDiscount.reason}).` : ""} ${formData.notas || ""}`.trim(),
    });

    if (!res.success) {
      setErrorMsg(res.error || "No se pudo procesar la orden");
      showToast(res.error || "Error al procesar el pedido", "error");
      return false;
    }

    clearCart();
    setIsCheckoutOpen(false);
    window.location.href = `/pago-resultado?id=${res.orderId}&status=APPROVED&ref=${reference}&total=${wompiConfig.formatCOP(effectiveTotal)}`;
    return true;
  };

  const handleWompiPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const reference = `FMB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const amountInCents = Math.round(effectiveTotal * 100);

      // 1. Obtener firma SHA-256 desde nuestro endpoint seguro
      const res = await fetch("/api/wompi/create-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          amountInCents,
          currency: wompiConfig.currency,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo generar la firma de pago");
      }

      // 2. Si es placeholder, mostrar simulación pedagógica y permitir probar el resultado
      if (data.isPlaceholder) {
        setSimulationModal({
          reference,
          amountInCents,
          totalCOP: wompiConfig.formatCOP(effectiveTotal),
          signature: data.signature,
          publicKey: data.publicKey,
          customerData: formData,
        });
        setLoading(false);
        return;
      }

      // 3. Cargar dinámicamente el Widget oficial de Wompi
      const loadScript = () => {
        return new Promise<void>((resolve, reject) => {
          if ((window as any).WidgetCheckout) {
            resolve();
            return;
          }
          const script = document.createElement("script");
          script.src = wompiConfig.widgetScriptUrl;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Error cargando script de Wompi"));
          document.body.appendChild(script);
        });
      };

      await loadScript();

      // Iniciar el Widget de Wompi
      const checkout = new (window as any).WidgetCheckout({
        currency: wompiConfig.currency,
        amountInCents,
        reference,
        publicKey: data.publicKey,
        signature: {
          integrity: data.signature,
        },
        redirectUrl: `${wompiConfig.redirectUrl}?ref=${reference}&total=${effectiveTotal}`,
        customerData: {
          email: formData.correo,
          fullName: formData.nombre,
          phoneNumber: {
            prefix: "+57",
            number: formData.telefono.replace(/\D/g, ""),
          },
          legalId: formData.documento,
          legalIdType: formData.tipoDocumento,
        },
        shippingAddress: {
          addressLine1: deliveryMethod === "PUNTO_RECOGIDA"
            ? (selectedPickup?.address || "Sede Principal Duitama")
            : formData.direccion,
          city: deliveryMethod === "PUNTO_RECOGIDA" ? (selectedPickup?.municipality || "Duitama") : formData.municipio,
          country: "CO",
          region: "Boyacá",
        },
      });

      checkout.open((result: any) => {
        console.log("Wompi transaction result:", result);
        if (result.transaction?.status === "APPROVED") {
          finalizeOrder(reference, result.transaction.id);
        }
      });
    } catch (err: any) {
      console.error("Error al procesar pago:", err);
      setErrorMsg(err.message || "Ocurrió un error iniciando la pasarela de pagos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-[#00A86B] px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 block">
                  Pasarela Segura WOMPI (Bancolombia)
                </span>
                <h3 className="text-base sm:text-lg font-black">
                  Finalizar Pedido de Farmacia
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleWompiPayment} className="space-y-4">
              {/* Order Summary Pill */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Total a pagar:</span>
                    <span className="text-lg font-black text-[#00A86B]">
                      {wompiConfig.formatCOP(effectiveTotal)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[11px]">Productos:</span>
                    <span className="font-bold text-slate-800">
                      {items.length} {items.length === 1 ? "ítem" : "ítems"} (Envío:{" "}
                      {effectiveShippingCost === 0 ? (
                        <span className="text-emerald-700 font-extrabold">Gratis</span>
                      ) : (
                        wompiConfig.formatCOP(effectiveShippingCost)
                      )}
                      )
                    </span>
                  </div>
                </div>
                {discountAmount > 0 && (
                  <div className="pt-1 border-t border-slate-200 flex justify-between text-emerald-700 font-semibold text-[11px]">
                    <span>Descuento cupón ({appliedCoupon?.code}):</span>
                    <span>-{wompiConfig.formatCOP(discountAmount)}</span>
                  </div>
                )}
              </div>

              {/* Customer Lifetime Discount Recognition Banner */}
              {activeLifetimeDiscount && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 border border-emerald-300 text-xs flex items-center gap-2.5 text-emerald-950 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#00A86B] text-white flex items-center justify-center shrink-0 font-black shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-emerald-900">
                        ¡Descuento Vitalicio Reconocido (${activeLifetimeDiscount.percentage}% OFF)!
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#00A86B] text-white">
                        De por vida
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-tight mt-0.5">
                      Hola <strong>{formData.nombre.split(" ")[0] || "Cliente"}</strong>, tu cuenta tiene asignado este descuento permanente ({activeLifetimeDiscount.reason}). Ahorras <strong>{wompiConfig.formatCOP(lifetimeDiscountAmount)}</strong> en esta compra.
                    </p>
                  </div>
                </div>
              )}

              {/* Personal Data */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#00A86B]" />
                  <span>Datos del Comprador & Paciente</span>
                </h4>

                {/* Family Recipient Selector */}
                {familyMembers.length > 0 && (
                  <div className="mb-3 p-2.5 rounded-xl bg-purple-50/60 border border-purple-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-purple-900 flex items-center gap-1 text-[11px]">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      <span>¿Para quién es este pedido?:</span>
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, destinatario: "Para mí" })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                          formData.destinatario === "Para mí"
                            ? "bg-purple-700 text-white border-purple-700"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Para mí
                      </button>
                      {familyMembers.map((fam) => (
                        <button
                          key={fam.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, destinatario: `${fam.name} (${fam.relationship})` })}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            formData.destinatario.includes(fam.name)
                              ? "bg-purple-700 text-white border-purple-700"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {fam.name} ({fam.relationship})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carlos Rodríguez"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Tipo Doc.
                      </label>
                      <select
                        value={formData.tipoDocumento}
                        onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value as any })}
                        className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none bg-white font-medium"
                      >
                        <option value="CC">CC</option>
                        <option value="CE">CE</option>
                        <option value="NIT">NIT</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Número de Documento *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="1049..."
                        value={formData.documento}
                        onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="310 000 0000"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Correo Electrónico (para recibo Wompi) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="correo@ejemplo.com"
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Modality Selection */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#00A86B]" />
                  <span>Método de Entrega en Boyacá</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {/* Domicilio express button */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("DOMICILIO")}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      deliveryMethod === "DOMICILIO"
                        ? "border-[#00A86B] bg-emerald-50/60 ring-2 ring-[#00A86B]/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        deliveryMethod === "DOMICILIO"
                          ? "bg-[#00A86B] text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-900">Domicilio Express</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800">
                          En tu puerta
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Duitama, Paipa, Sogamoso, Tunja</p>
                      <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">
                        {isFreeShipping ? "¡Envío GRATIS!" : `Desde ${wompiConfig.formatCOP(activeRate?.rateCOP || 5000)}`}
                      </span>
                    </div>
                  </button>

                  {/* Recoger en tienda button */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("PUNTO_RECOGIDA")}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      deliveryMethod === "PUNTO_RECOGIDA"
                        ? "border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        deliveryMethod === "PUNTO_RECOGIDA"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-900">Recoger en Tienda</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-100 text-purple-800">
                          ¡Gratis!
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Sedes Farmaboy Duitama</p>
                      <span className="text-[11px] font-bold text-purple-700 block mt-0.5">
                        Listo en 20-30 min sin costo
                      </span>
                    </div>
                  </button>
                </div>

                {/* Sub-form: When Recoger en Tienda */}
                {deliveryMethod === "PUNTO_RECOGIDA" ? (
                  <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-purple-600" />
                        Selecciona el Punto de Recogida en Duitama:
                      </span>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        Sin costo adicional
                      </span>
                    </div>

                    <div className="space-y-2">
                      {activePickupPoints.map((point) => {
                        const isSelected = selectedPickup?.id === point.id;
                        return (
                          <label
                            key={point.id}
                            onClick={() => setSelectedPickupPointId(point.id)}
                            className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? "bg-white border-purple-600 ring-2 ring-purple-600/20 shadow-xs"
                                : "bg-white/80 border-purple-100 hover:border-purple-300"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <input
                                  type="radio"
                                  name="pickupPoint"
                                  checked={isSelected}
                                  onChange={() => setSelectedPickupPointId(point.id)}
                                  className="mt-0.5 text-purple-600 focus:ring-purple-500"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <strong className="text-xs text-slate-900 font-black">{point.name}</strong>
                                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-100 text-purple-700 font-bold">
                                      Listo en {point.prepTimeMinutes} min
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 text-purple-600 shrink-0" />
                                    <span>{point.address}, {point.municipality}</span>
                                  </p>
                                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      {point.schedule}
                                    </span>
                                    {point.phone && (
                                      <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-slate-400" />
                                        {point.phone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                                $0 COP
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    <div className="mt-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Persona autorizada para recoger el pedido (opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Titular o familiar con documento de identidad"
                        value={formData.notas}
                        onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 outline-none bg-white"
                      />
                    </div>
                  </div>
                ) : (
                  /* Sub-form: When Domicilio Express */
                  <div className="space-y-3">
                    {/* Quick saved address selector */}
                    {addresses.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-emerald-900 flex items-center gap-1 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" />
                          <span>Usar dirección guardada:</span>
                        </span>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                          {addresses.map((a) => (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  municipio: a.city,
                                  direccion: `${a.address}${a.complement ? " " + a.complement : ""}`,
                                  notas: a.deliveryNotes || formData.notas,
                                });
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                                formData.direccion.includes(a.address)
                                  ? "bg-[#00A86B] text-white border-[#00A86B]"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {a.label} ({a.city})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Municipio en Boyacá *
                        </label>
                        <select
                          value={formData.municipio}
                          onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none bg-white font-medium"
                        >
                          {farmaboyConfig.coverageAreas.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Dirección Completa (Calle, Carrera, Barrio) *
                        </label>
                        <input
                          type="text"
                          required={deliveryMethod === "DOMICILIO"}
                          placeholder="Ej. Carrera 16 # 15-20, Barrio Centro"
                          value={formData.direccion}
                          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none"
                        />
                      </div>
                    </div>

                    {/* Delivery Rate Notice Banner */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Navigation className="w-3.5 h-3.5 text-[#00A86B]" />
                        <span>
                          Zona: <strong>{activeRate?.zone || activeRate?.municipality || formData.municipio}</strong> (Tiempo estimado: {activeRate?.estimatedTime || "30-60 min"})
                        </span>
                      </div>
                      <span className="font-extrabold text-[#00A86B]">
                        {effectiveShippingCost === 0 ? "¡Envío GRATIS!" : wompiConfig.formatCOP(effectiveShippingCost)}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Indicaciones de entrega (Apartamento, torre, o referencia)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Apto 302, timbre blanco, portón negro"
                        value={formData.notas}
                        onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Supported payment methods icons preview */}
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-emerald-950">
                <span className="font-bold flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#00A86B]" />
                  Métodos aceptados por Wompi:
                </span>
                <span className="font-medium text-emerald-800">
                  PSE &middot; Nequi &middot; Tarjeta Crédito/Débito &middot; Bancolombia
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white font-extrabold text-sm shadow-pharmacy transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 touch-target"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? (
                    <span>Iniciando pasarela de pago...</span>
                  ) : (
                    <span>Pagar {wompiConfig.formatCOP(effectiveTotal)} con WOMPI</span>
                  )}
                </button>

                <div className="text-center text-[10px] text-slate-400">
                  Tus datos están protegidos bajo cifrado SSL y la infraestructura de Bancolombia.
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Simulation / Placeholder Inspector Modal */}
      {simulationModal && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-[#00A86B]" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  Estructura & Lógica Wompi Lista
                </h4>
                <span className="text-xs text-slate-500">
                  Modo Sandbox / Placeholder Activo
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              La integración técnica de Wompi está <strong>100% implementada</strong>. La firma criptográfica SHA-256 fue calculada exitosamente en el backend:
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1 overflow-x-auto">
              <div><strong className="text-slate-500">Referencia:</strong> {simulationModal.reference}</div>
              <div><strong className="text-slate-500">Total a Pagar:</strong> {simulationModal.totalCOP} ({simulationModal.amountInCents} centavos)</div>
              <div><strong className="text-slate-500">Modalidad:</strong> {deliveryMethod === "PUNTO_RECOGIDA" ? `Recoger en Tienda (${selectedPickup?.name})` : `Domicilio (${formData.municipio})`}</div>
              <div><strong className="text-slate-500">Moneda:</strong> COP</div>
              <div className="truncate"><strong className="text-slate-500">Firma SHA-256:</strong> {simulationModal.signature}</div>
              <div><strong className="text-slate-500">Llave Pública:</strong> {simulationModal.publicKey}</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Nota para el administrador de FARMABOY:</strong> Cuando agregues tu llave real de Wompi en <code>.env.local</code> (por ejemplo <code>pub_prod_...</code> o <code>pub_test_...</code> real), la pasarela abrirá la interfaz de pago bancario de Bancolombia directamente.
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  finalizeOrder(simulationModal.reference, "SIMULATED-" + simulationModal.reference);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <span>Simular Pago Aprobado & Ver Recibo</span>
              </button>

              <button
                type="button"
                onClick={() => setSimulationModal(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
