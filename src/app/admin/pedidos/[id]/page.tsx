"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Printer,
  MessageCircle,
  Truck,
  MapPin,
  ShoppingBag,
  User,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Boxes,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { AdminOrderStatus } from "@/types/admin";
import { getWhatsAppUrl } from "@/lib/utils";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = String(params?.id || "");

  const { orders, updateOrderStatus, deliveryRates, pickupPoints, showToast } = useAdminStore();
  const order = orders.find((o) => o.id === orderId);

  const [noteInput, setNoteInput] = useState("");

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Pedido no encontrado</h2>
        <p className="text-xs text-slate-400">No existe una orden con el código #{orderId}.</p>
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver a Pedidos</span>
        </Link>
      </div>
    );
  }

  const isPickup = order.deliveryMethod === "PUNTO_RECOGIDA";
  const pickup = isPickup ? pickupPoints.find((p) => p.id === order.pickupPointId) || pickupPoints[0] : null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    if (!order.customerPhone) return;
    const msg = `Hola ${order.customerName}, te saludamos de Farmaboy con relación a tu pedido #${order.id}. Su estado actual es: ${order.status}. Total: $${order.totalCOP.toLocaleString("es-CO")} COP.`;
    window.open(getWhatsAppUrl(order.customerPhone, msg), "_blank");
  };

  const handleAddTrackingNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    updateOrderStatus(order.id, order.status, noteInput.trim());
    setNoteInput("");
    showToast("Nota de seguimiento agregada a la orden", "success");
  };

  const statusBadges: Record<AdminOrderStatus, string> = {
    NUEVO: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    CONFIRMADO: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    PAGADO: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    PENDIENTE: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    EN_PREPARACION: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    PREPARANDO: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    LISTO_DESPACHO: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    LISTO_RECOGER: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    ENVIADO: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    EN_CAMINO: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    ENTREGADO: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    RECOGIDO: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    CANCELADO: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    DEVUELTO: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-emerald-400 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al listado de Pedidos</span>
        </Link>

        <div className="flex items-center gap-2">
          {order.customerPhone && (
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Remisión</span>
          </button>
        </div>
      </div>

      {/* Order Main Header Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Orden #{order.id}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadges[order.status] || "bg-slate-800 text-slate-300"}`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Fecha de creación: {order.date}</span>
            </p>
          </div>

          {/* Status Changer */}
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 px-1">Cambiar Estado:</span>
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(order.id, e.target.value as AdminOrderStatus)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="PENDIENTE">⏳ Pendiente Verificación QR</option>
              <option value="PAGADO">💳 Pagado</option>
              <option value="NUEVO">✨ Nuevo</option>
              <option value="CONFIRMADO">✓ Confirmado</option>
              <option value="PREPARANDO">📦 Preparando</option>
              <option value="LISTO_RECOGER">📍 Listo en punto</option>
              <option value="EN_CAMINO">🛵 En camino</option>
              <option value="ENTREGADO">✅ Entregado</option>
              <option value="RECOGIDO">🏢 Recogido</option>
              <option value="CANCELADO">✕ Cancelado</option>
              <option value="DEVUELTO">↩ Devuelto</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2 Cols: Customer CRM Info + Delivery / Pickup Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            Información del Cliente
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Nombre completo:</span>
              <span className="font-bold text-white">{order.customerName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Documento:</span>
              <span className="font-semibold text-slate-200">{order.customerDocument || "N/A"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Teléfono:</span>
              <span className="font-semibold text-slate-200">{order.customerPhone || "N/A"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Correo:</span>
              <span className="font-semibold text-slate-200">{order.customerEmail || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Delivery / Pickup Modality */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            {isPickup ? (
              <MapPin className="w-4 h-4 text-amber-400" />
            ) : (
              <Truck className="w-4 h-4 text-blue-400" />
            )}
            {isPickup ? "Modalidad: Recogida en Punto" : "Modalidad: Domicilio Express"}
          </h3>

          <div className="space-y-2 text-xs">
            {isPickup ? (
              <>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Sede asignada:</span>
                  <span className="font-bold text-emerald-400">{pickup?.name || order.pickupPointName || "Sede Duitama Centro"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Dirección:</span>
                  <span className="font-semibold text-white">{pickup?.address || "Carrera 16 # 15-20, Centro, Duitama"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Horario:</span>
                  <span className="font-semibold text-slate-200">{pickup?.schedule || "7:00 am - 9:00 pm"}</span>
                </div>
                <div className="py-1">
                  <span className="text-slate-400 block mb-0.5">Instrucciones:</span>
                  <p className="text-[11px] text-slate-300">{pickup?.pickupInstructions || order.deliveryNotes || "Presentar cédula y código de pedido."}</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Ciudad / Municipio:</span>
                  <span className="font-bold text-white">{order.deliveryCity || "Duitama"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Dirección de entrega:</span>
                  <span className="font-semibold text-white">{order.deliveryAddress || "N/A"}</span>
                </div>
                <div className="py-1">
                  <span className="text-slate-400 block mb-0.5">Notas del cliente:</span>
                  <p className="text-[11px] text-slate-300">{order.deliveryNotes || "Sin observaciones adicionales."}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ordered Items Table */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Boxes className="w-4 h-4 text-emerald-400" />
          Productos en la Orden ({order.items.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400">
              <tr>
                <th className="py-3 px-3 rounded-l-xl">Producto</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Precio Unitario</th>
                <th className="py-3 px-3 text-center">Cantidad</th>
                <th className="py-3 px-3 text-right rounded-r-xl">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {order.items.map((item, idx) => {
                const lineTotal = (item.priceCOP || 0) * (item.quantity || 1);
                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 flex items-center gap-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                      )}
                      <span className="font-bold text-white">{item.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {item.sku || "N/A"}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      ${(item.priceCOP || 0).toLocaleString("es-CO")} COP
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-white">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-emerald-400">
                      ${lineTotal.toLocaleString("es-CO")} COP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial & Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            Detalle del Pago
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Método de pago:</span>
              <span className="font-bold text-white">{order.paymentMethod || "Código QR Bancolombia & Bre-B"}</span>
            </div>
            {order.paymentApprovalCode && (
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Cód. Comprobante / Aprobación:</span>
                <span className="font-mono font-bold text-emerald-400">{order.paymentApprovalCode}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Moneda:</span>
              <span className="font-semibold text-slate-200">COP (Pesos Colombianos)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Cupón aplicado:</span>
              <span className="font-semibold text-emerald-400">{order.couponCode || "Ninguno"}</span>
            </div>
            {order.customerLifetimeDiscount && (
              <div className="flex justify-between py-1 text-emerald-400">
                <span className="text-slate-400">Beneficio Vitalicio:</span>
                <span className="font-bold">
                  {order.customerLifetimeDiscount.percentage}% OFF ({order.customerLifetimeDiscount.reason || "De por vida"})
                </span>
              </div>
            )}

            {(order.status === "PENDIENTE" || order.status === "NUEVO") && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <p className="text-[11px] text-amber-400">
                  ⚠️ Este pedido requiere verificación manual del comprobante de transferencia bancaria.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatus(
                      order.id,
                      "PAGADO",
                      "Pago aprobado manualmente por administración (QR Bancolombia / Bre-B)"
                    );
                    showToast("Pago aprobado y marcado como PAGADO", "success");
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aprobar Pago Manualmente (QR)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Liquidación Financiera
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Subtotal Productos:</span>
              <span className="font-semibold text-white">${(order.subtotalCOP || 0).toLocaleString("es-CO")} COP</span>
            </div>
            {order.customerLifetimeDiscount && (
              <div className="flex justify-between py-1 border-b border-slate-800 text-emerald-400 font-bold">
                <span>Descuento Vitalicio Cuenta ({order.customerLifetimeDiscount.percentage}%):</span>
                <span>-${(order.customerLifetimeDiscount.amountCOP || 0).toLocaleString("es-CO")} COP</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Descuento Total Aplicado:</span>
              <span className="font-semibold text-rose-400">-${(order.discountCOP || 0).toLocaleString("es-CO")} COP</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Costo de Domicilio:</span>
              <span className="font-semibold text-white">
                {order.shippingCOP > 0 ? `$${order.shippingCOP.toLocaleString("es-CO")} COP` : "$0 COP (Gratis / Punto)"}
              </span>
            </div>
            <div className="flex justify-between py-2 text-sm font-black">
              <span className="text-white">TOTAL LIQUIDADO:</span>
              <span className="text-emerald-400">${(order.totalCOP || 0).toLocaleString("es-CO")} COP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking & Timeline History */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          Historial de Estados & Trazabilidad
        </h3>

        <div className="space-y-3">
          {order.trackingHistory?.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{step.status}</span>
                  <span className="text-[10px] text-slate-500">{step.timestamp}</span>
                </div>
                {step.note && <p className="text-[11px] text-slate-400 mt-0.5">{step.note}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Form to add note */}
        <form onSubmit={handleAddTrackingNote} className="flex gap-2 pt-2">
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Agregar nota de auditoría o regente farmacéutico..."
            className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
          >
            Guardar Nota
          </button>
        </form>
      </div>
    </div>
  );
}