"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import {
  ArrowLeft,
  RotateCcw,
  FileDown,
  MessageCircle,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  User,
  ShieldCheck,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import { farmaboyConfig } from "@/config/farmaboy";

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { getOrderById } = useAuth();
  const { addItem } = useCart();

  const order = getOrderById(id);

  if (!order) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
        <h2 className="text-xl font-black text-slate-900">Pedido no encontrado</h2>
        <p className="text-xs text-slate-500 mt-1">
          No pudimos encontrar la referencia de pedido #{id}.
        </p>
        <Link
          href="/mi-cuenta/pedidos"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#00A86B]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al listado de pedidos</span>
        </Link>
      </div>
    );
  }

  const handleReorder = () => {
    order.items.forEach((item) => {
      addItem(
        {
          id: item.id,
          name: item.name,
          price: item.unitPrice,
          priceDisplay: item.unitPriceDisplay,
          imageUrl: item.imageUrl,
          category: item.category,
        },
        item.quantity
      );
    });
    alert("¡Productos agregados al carrito de compras!");
  };

  const whatsappSupport = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    `Hola Farmaboy, necesito asistencia con el pedido #${order.id} registrado a nombre de ${order.deliveryAddress.recipientName}.`
  );

  return (
    <div className="space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push("/mi-cuenta/pedidos")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#00A86B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Pedidos</span>
        </button>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} size="md" />
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
        
        {/* Order Header Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Detalle de Compra Farmaboy
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Pedido #{order.id}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Confirmado el{" "}
              {new Date(order.date).toLocaleDateString("es-CO", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleReorder}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Volver a Comprar</span>
            </button>

            <a
              href={whatsappSupport}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#00A86B]" />
              <span className="hidden sm:inline">Asesor</span>
            </a>
          </div>
        </div>

        {/* 5-STAGE TRACKING TIMELINE */}
        <div className="bg-slate-50/80 rounded-3xl p-5 sm:p-7 border border-slate-200/80">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#00A86B] flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900">
                Seguimiento de Entrega
              </h3>
            </div>
            {order.estimatedDelivery && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
                {order.estimatedDelivery}
              </span>
            )}
          </div>

          {/* Graphical timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {order.trackingSteps && order.trackingSteps.length > 0 ? (
              order.trackingSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-[27px] sm:-left-[31px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      step.completed
                        ? "bg-[#00A86B] border-[#00A86B] text-white"
                        : step.isCurrent
                        ? "bg-white border-[#00A86B] text-[#00A86B] ring-4 ring-[#00A86B]/20"
                        : "bg-white border-slate-300 text-slate-300"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${step.isCurrent ? "bg-[#00A86B]" : "bg-slate-300"}`} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h4
                        className={`text-xs font-black ${
                          step.isCurrent
                            ? "text-[#00A86B]"
                            : step.completed
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </h4>
                      {step.date && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {step.date}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">
                Pedido entregado a satisfacción.
              </div>
            )}
          </div>

          {order.courierName && (
            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-3 text-xs text-slate-600">
              <span className="font-bold">Despachador responsable:</span>
              <span className="text-slate-800 font-semibold">{order.courierName}</span>
            </div>
          )}
        </div>

        {/* Products Itemized Table */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4">
            Productos en el Pedido ({order.items.length})
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-200/90 rounded-2xl overflow-hidden">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden relative shrink-0 border border-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase text-[#00A86B]">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Cantidad: <strong className="text-slate-800">{item.quantity}</strong> • Precio unitario: {item.unitPriceDisplay}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900">
                    ${item.totalPrice.toLocaleString("es-CO")} COP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid: Delivery Info, Payment & Totals Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Destination & Payment Details */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2 font-black text-slate-900 mb-2">
                <MapPin className="w-4 h-4 text-[#00A86B]" />
                <span>Dirección de Entrega</span>
              </div>
              <p className="font-bold text-slate-800">{order.deliveryAddress.address}</p>
              {order.deliveryAddress.complement && (
                <p className="text-slate-600">{order.deliveryAddress.complement}</p>
              )}
              <p className="text-slate-600">
                {order.deliveryAddress.neighborhood ? `${order.deliveryAddress.neighborhood}, ` : ""}
                {order.deliveryAddress.city}, {order.deliveryAddress.department}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Recibe: <strong>{order.deliveryAddress.recipientName}</strong></span>
                <span>Tel: {order.deliveryAddress.phone}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2 font-black text-slate-900 mb-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Método de Pago</span>
              </div>
              <p className="font-bold text-slate-800">
                {order.paymentMethod.brand || order.paymentMethod.type}
              </p>
              {order.paymentMethod.lastFour && (
                <p className="text-slate-500 text-[11px]">
                  Terminada en •••• {order.paymentMethod.lastFour}
                </p>
              )}
              <p className="text-emerald-700 text-[11px] font-bold mt-1">
                ✓ Transacción aprobada y protegida con Wompi
              </p>
            </div>
          </div>

          {/* Financial Totals Card */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-emerald-950 pb-2 border-b border-emerald-200">
                Resumen de la Transacción
              </h4>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal medicamentos e insumos:</span>
                <span className="font-bold text-slate-900">
                  ${order.subtotal.toLocaleString("es-CO")} COP
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Costo de envío en Boyacá:</span>
                <span className="font-bold text-slate-900">
                  {order.shipping === 0 ? "Gratis" : `$${order.shipping.toLocaleString("es-CO")} COP`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Descuento aplicado:</span>
                  <span>-${order.discount.toLocaleString("es-CO")} COP</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-emerald-200 flex items-baseline justify-between">
              <span className="text-sm font-black text-emerald-950">Total pagado:</span>
              <span className="text-2xl font-black text-[#008755]">
                ${order.total.toLocaleString("es-CO")} COP
              </span>
            </div>
          </div>
        </div>

        {/* Footer Support Notice */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>¿Tienes dudas con la entrega o lote de tu medicamento?</span>
          <a
            href={whatsappSupport}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00A86B] font-bold hover:underline"
          >
            Hablar con regente de farmacia
          </a>
        </div>
      </div>
    </div>
  );
}
