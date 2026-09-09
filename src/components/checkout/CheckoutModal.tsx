"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { paymentConfig } from "@/config/payment";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";
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
  Copy,
  Check,
  QrCode,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  MessageCircle,
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
  const [checkoutStep, setCheckoutStep] = useState<"FORM" | "QR_PAYMENT">("FORM");
  const [activeOrderResult, setActiveOrderResult] = useState<{
    orderId: string;
    reference: string;
    totalFormatted: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<"llave" | "total" | "ref" | null>(null);
  const [approvalCode, setApprovalCode] = useState<string>("");

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

  const copyToClipboard = (text: string, field: "llave" | "total" | "ref") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast(`Copiado: ${text}`, "success");
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const reference = `FMB-${Date.now().toString().slice(-6)}`;
    const formattedTotal = paymentConfig.formatCOP(effectiveTotal);

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
            ? (selectedPickup ? `Recoger en: ${selectedPickup.name} (${selectedPickup.address})` : "Sede Principal Duitama Transversal 29 # 10-63")
            : formData.direccion.trim(),
        city: deliveryMethod === "PUNTO_RECOGIDA" ? (selectedPickup?.municipality || "Duitama") : formData.municipio,
        department: "Boyacá",
        postalCode: "150461",
        deliveryNotes:
          deliveryMethod === "PUNTO_RECOGIDA"
            ? `RECOGER EN TIENDA: ${selectedPickup?.name || "Sede Duitama"}. Horario: ${selectedPickup?.schedule || "7:00 AM - 8:30 PM"}. Notas cliente: ${formData.notas || "Sin notas"}`
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
      paymentMethod: "QR Bancolombia / Bre-B (Llave 0092016726)",
      initialStatus: "PENDIENTE",
      paymentApprovalCode: approvalCode.trim() || undefined,
      couponCode: appliedCoupon?.code,
      notes: `Destinatario: ${formData.destinatario}. Modalidad: ${deliveryMethod === "PUNTO_RECOGIDA" ? "Recogida en Tienda" : "Domicilio Express"}.${activeLifetimeDiscount ? ` Beneficio: ${activeLifetimeDiscount.percentage}% OFF Vitalicio (${activeLifetimeDiscount.reason}).` : ""} ${formData.notas || ""}`.trim(),
    });

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "No se pudo registrar la orden");
      showToast(res.error || "Error al procesar el pedido", "error");
      return;
    }

    setActiveOrderResult({
      orderId: res.orderId || reference,
      reference,
      totalFormatted: formattedTotal,
    });
    setCheckoutStep("QR_PAYMENT");
    showToast("¡Pedido registrado! Completa tu pago con QR o Llave", "success");
  };

  const handleFinishAndRedirect = () => {
    if (!activeOrderResult) return;
    clearCart();
    setIsCheckoutOpen(false);
    window.location.href = `/pago-resultado?id=${activeOrderResult.orderId}&status=PENDIENTE&ref=${activeOrderResult.reference}&total=${encodeURIComponent(activeOrderResult.totalFormatted)}&nombre=${encodeURIComponent(formData.nombre.trim())}`;
  };

  const whatsappVerificationUrl = activeOrderResult ? getWhatsAppUrl(
    paymentConfig.whatsappVerification.phone,
    paymentConfig.whatsappVerification.buildMessage(
      activeOrderResult.reference,
      activeOrderResult.totalFormatted,
      formData.nombre
    )
  ) : "";

  if (!isCheckoutOpen) return null;

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
                {checkoutStep === "FORM" ? (
                  <Lock className="w-4 h-4 text-white" />
                ) : (
                  <QrCode className="w-4 h-4 text-white" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 block">
                  {checkoutStep === "FORM"
                    ? "Pago Oficial Bancolombia & Bre-B"
                    : "Verificación Manual de Pago"}
                </span>
                <h3 className="text-base sm:text-lg font-black">
                  {checkoutStep === "FORM"
                    ? "Finalizar Pedido de Farmacia"
                    : "Paga con Código QR o Llave"}
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
          <div className="p-6 max-h-[82vh] overflow-y-auto">
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {checkoutStep === "FORM" ? (
              <form onSubmit={handleCreateOrder} className="space-y-4">
              {/* Order Summary Pill */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Total a pagar:</span>
                    <span className="text-lg font-black text-[#00A86B]">
                      {paymentConfig.formatCOP(effectiveTotal)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[11px]">Productos:</span>
                    <span className="font-bold text-slate-800">
                      {items.length} {items.length === 1 ? "ítem" : "ítems"} (Envío:{" "}
                      {effectiveShippingCost === 0 ? (
                        <span className="text-emerald-700 font-extrabold">Gratis</span>
                      ) : (
                        paymentConfig.formatCOP(effectiveShippingCost)
                      )}
                      )
                    </span>
                  </div>
                </div>
                {discountAmount > 0 && (
                  <div className="pt-1 border-t border-slate-200 flex justify-between text-emerald-700 font-semibold text-[11px]">
                    <span>Descuento cupón ({appliedCoupon?.code}):</span>
                    <span>-{paymentConfig.formatCOP(discountAmount)}</span>
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
                        ¡Descuento Vitalicio Reconocido ({activeLifetimeDiscount.percentage}% OFF)!
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#00A86B] text-white">
                        De por vida
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-tight mt-0.5">
                      Hola <strong>{formData.nombre.split(" ")[0] || "Cliente"}</strong>, tu cuenta tiene asignado este descuento permanente ({activeLifetimeDiscount.reason}). Ahorras <strong>{paymentConfig.formatCOP(lifetimeDiscountAmount)}</strong> en esta compra.
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
                      Correo Electrónico (para confirmación y factura) *
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
                        {isFreeShipping ? "¡Envío GRATIS!" : `Desde ${paymentConfig.formatCOP(activeRate?.rateCOP || 5000)}`}
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
                        {effectiveShippingCost === 0 ? "¡Envío GRATIS!" : paymentConfig.formatCOP(effectiveShippingCost)}
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

              {/* Supported payment methods info banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold block text-slate-900">
                      Pago Directo con Código QR Bancolombia & Bre-B
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Compatible con Bancolombia, Nequi, Daviplata y cualquier app bancaria.
                    </span>
                  </div>
                </div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-emerald-300 font-mono font-bold text-[11px] text-slate-800 shrink-0">
                  Llave: 0092016726
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white font-extrabold text-sm shadow-pharmacy transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 touch-target cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  {loading ? (
                    <span>Registrando pedido...</span>
                  ) : (
                    <span>Continuar al Pago con QR ({paymentConfig.formatCOP(effectiveTotal)})</span>
                  )}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center text-[10px] text-slate-400">
                  Tu pedido quedará registrado y será verificado manualmente por nuestro personal de farmacia.
                </div>
              </div>
            </form>
          ) : (
            /* STEP 2: QR PAYMENT SCREEN (BANCOLOMBIA & BRE-B) */
            <div className="space-y-5 animate-fade-in">
              {/* Top Banner Status */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-black uppercase tracking-wider text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                      Estado: Pendiente de Verificación Manual
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">
                      Pedido #{activeOrderResult?.reference}
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                    Tu orden está pre-radicada. Por favor realiza la transferencia escaneando el código QR o usando la llave, y envíanos el comprobante por WhatsApp para despachar de inmediato.
                  </p>
                </div>
              </div>

              {/* Stand de Pago QR Bancolombia / Bre-B Card */}
              <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 text-center space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                      Comercio Oficial
                    </span>
                    <h4 className="font-black text-sm text-white">
                      FARMABOY (Farmaboy Integrales...)
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                    <span>Bre-B</span>
                    <span className="text-slate-600">|</span>
                    <span>Bancolombia</span>
                  </div>
                </div>

                {/* QR Code Image */}
                <div className="bg-white rounded-2xl p-3 inline-block shadow-lg mx-auto max-w-[260px] sm:max-w-[280px]">
                  <img
                    src="/images/qr-bancolombia-farmaboy.png"
                    alt="Código QR Oficial Bancolombia FarmaBoy"
                    className="w-full h-auto rounded-xl object-contain mx-auto"
                  />
                </div>

                {/* Copyable Data Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-left pt-1">
                  {/* Llave Bancolombia */}
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Llave Interoperable Bre-B
                      </span>
                      <span className="font-mono font-black text-base text-emerald-400">
                        {paymentConfig.bancolombia.llave}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentConfig.bancolombia.llave, "llave")}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === "llave" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === "llave" ? "Copiado" : "Copiar"}</span>
                    </button>
                  </div>

                  {/* Monto exacto */}
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Monto Exacto a Transferir
                      </span>
                      <span className="font-black text-base text-white">
                        {activeOrderResult?.totalFormatted}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(effectiveTotal.toString(), "total")}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === "total" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === "total" ? "Copiado" : "Copiar"}</span>
                    </button>
                  </div>
                </div>

                {/* Paso a paso */}
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 text-left space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¿Cómo transferir desde tu celular?</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400">
                    <li>Abre tu app bancaria (<strong>Bancolombia, Nequi, Daviplata</strong> o cualquiera con Bre-B).</li>
                    <li>Escanea este código QR o transfiere a la llave <strong className="text-white">0092016726</strong>.</li>
                    <li>Digita el valor exacto de <strong className="text-white">{activeOrderResult?.totalFormatted}</strong>.</li>
                    <li>Envía el comprobante por WhatsApp a continuación para verificación manual.</li>
                  </ol>
                </div>
              </div>

              {/* Optional Approval Code Input */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Número de Comprobante o Aprobación Bancaria (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej. 1748855 o referencia de tu banco"
                  value={approvalCode}
                  onChange={(e) => setApprovalCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-[#00A86B] outline-none font-mono bg-white"
                />
                <span className="text-[10px] text-slate-500 block">
                  Ayuda a agilizar la verificación manual en el sistema de farmacia.
                </span>
              </div>

              {/* WhatsApp Verification CTA (Primary) */}
              <div className="space-y-2.5 pt-1">
                <a
                  href={whatsappVerificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2.5 touch-target active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Enviar Comprobante por WhatsApp (+57 313 427 9559)</span>
                  <ExternalLink className="w-4 h-4 opacity-90" />
                </a>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleFinishAndRedirect}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ya envié mi comprobante / Ver Recibo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckoutStep("FORM")}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Modificar Datos</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};
