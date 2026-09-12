"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { OrderStatus } from "@/types/account";
import {
  ShoppingBag,
  RotateCcw,
  FileDown,
  MessageCircle,
  ChevronRight,
  Search,
  Filter,
  PackageCheck,
  Truck,
  Check,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import { farmaboyConfig } from "@/config/farmaboy";

export default function PedidosPage() {
  const { orders } = useAuth();
  const { addItem } = useCart();
  const [filterStatus, setFilterStatus] = useState<string>("TODOS");
  const [addedOrders, setAddedOrders] = useState<string[]>([]);

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "TODOS") return true;
    return order.status === filterStatus;
  });

  const handleRepeatOrder = (orderId: string, items: any[]) => {
    items.forEach((item) => {
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

    setAddedOrders((prev) => [...prev, orderId]);
    setTimeout(() => {
      setAddedOrders((prev) => prev.filter((id) => id !== orderId));
    }, 3000);
  };

  const handleDownloadInvoice = (orderId: string) => {
    alert(`Generando y descargando comprobante fiscal para el pedido #${orderId}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mis Pedidos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Consulta el historial, seguimiento en vivo y comprobantes de tus compras
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00A86B]" />
          <span>{orders.length} pedidos registrados</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { label: "Todos", value: "TODOS" },
          { label: "En camino", value: "EN_CAMINO" },
          { label: "Entregados", value: "ENTREGADO" },
          { label: "Preparando", value: "PREPARANDO" },
          { label: "Cancelados", value: "CANCELADO" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilterStatus(tab.value)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 ${
              filterStatus === tab.value
                ? "bg-[#00A86B] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-900">
            No encontramos pedidos con este estado
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Cuando realices una compra de medicamentos o productos, aparecerá registrada en esta lista.
          </p>
          <Link
            href="/productos"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold transition-all shadow-sm"
          >
            Explorar farmacia
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isAdded = addedOrders.includes(order.id);
            const supportUrl = getWhatsAppUrl(
              farmaboyConfig.contact.whatsapp,
              `Hola Farmaboy, tengo una consulta sobre mi pedido #${order.id} entregado en ${order?.deliveryAddress?.city || "mi dirección"}.`
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all space-y-4"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900">
                      Pedido #{order.id}
                    </span>
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>
                      {new Date(order.date).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-slate-700">
                      {order.paymentMethod.brand || order.paymentMethod.type}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white overflow-hidden relative shrink-0 border border-slate-100">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {item.quantity} un. • {item.unitPriceDisplay}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary & Destination */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="text-slate-600">
                    <span className="font-semibold">Entrega en: </span>
                    <span>
                      {order?.deliveryAddress?.city}, {order?.deliveryAddress?.address}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase mr-2">
                      Total Pagado:
                    </span>
                    <span className="text-base font-black text-slate-900">
                      ${order.total.toLocaleString("es-CO")} COP
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRepeatOrder(order.id, order.items)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Agregado al carrito!</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                          <span>Volver a comprar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Descargar factura electrónica"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Comprobante</span>
                    </button>

                    <a
                      href={supportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Soporte</span>
                    </a>
                  </div>

                  <Link
                    href={`/mi-cuenta/pedidos/${order.id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>Ver detalle & tracking</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
