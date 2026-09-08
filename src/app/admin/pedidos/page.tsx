"use client";

import React, { useState, useMemo } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Printer,
  Truck,
  CheckCircle2,
  X,
  Clock,
  MapPin,
  Phone,
  User,
  AlertTriangle,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { AdminOrder, AdminOrderStatus } from "@/types/admin";
import { getWhatsAppUrl } from "@/lib/utils";

export default function AdminPedidosPage() {
  const { orders, updateOrderStatus, hasPermission } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("TODOS");
  const [selectedCity, setSelectedCity] = useState<string>("TODOS");
  const [activeOrderModal, setActiveOrderModal] = useState<AdminOrder | null>(null);

  const canWrite = hasPermission("pedidos:write");

  const cities = Array.from(new Set(orders.map((o) => o.deliveryCity)));

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.customerDocument.includes(q);

      const matchesStatus = selectedStatus === "TODOS" || o.status === selectedStatus;
      const matchesCity = selectedCity === "TODOS" || o.deliveryCity === selectedCity;

      return matchesQuery && matchesStatus && matchesCity;
    });
  }, [orders, searchQuery, selectedStatus, selectedCity]);

  const handleWhatsAppNotify = (order: AdminOrder) => {
    const msg = `Hola ${order.customerName}, te saludamos de Farmaboy Boyacá con respecto a tu pedido #${order.id}. Su estado actual es: ${order.status}. Total: $${order.totalCOP.toLocaleString("es-CO")} COP.`;
    const url = getWhatsAppUrl(order.customerPhone, msg);
    window.open(url, "_blank");
  };

  const handlePrint = (order: AdminOrder) => {
    window.print();
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
    ENTREGADO: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    RECOGIDO: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    CANCELADO: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    DEVUELTO: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-400" />
            Centro de Despacho & Gestión de Pedidos
          </h2>
          <p className="text-xs text-slate-400">
            Administración omnicanal de pedidos de Tunja, Duitama, Sogamoso y todo Boyacá
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold">
            Total: {orders.length} pedidos
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por orden #FB, cliente, cédula o teléfono..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="NUEVO">Nuevo</option>
            <option value="CONFIRMADO">Confirmado</option>
            <option value="EN_PREPARACION">En preparación</option>
            <option value="LISTO_DESPACHO">Listo despacho</option>
            <option value="ENVIADO">Enviado</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
          >
            <option value="TODOS">Todas las Ciudades</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Orden</th>
                <th className="py-3.5 px-3 font-semibold">Fecha</th>
                <th className="py-3.5 px-3 font-semibold">Cliente</th>
                <th className="py-3.5 px-3 font-semibold">Destino Boyacá</th>
                <th className="py-3.5 px-3 font-semibold">Método Pago</th>
                <th className="py-3.5 px-3 font-semibold">Total (COP)</th>
                <th className="py-3.5 px-3 font-semibold">Estado</th>
                <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No se encontraron pedidos con los criterios ingresados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition group">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">#{order.id}</td>
                    <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">{order.date}</td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {order.customerName}
                      </p>
                      <p className="text-[11px] text-slate-400">{order.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-200">{order.deliveryCity}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">{order.deliveryAddress}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-black text-emerald-400 text-sm whitespace-nowrap">
                      ${order.totalCOP.toLocaleString("es-CO")}
                    </td>
                    <td className="py-3.5 px-3">
                      {canWrite ? (
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value as AdminOrderStatus)
                          }
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border focus:outline-none bg-slate-900 cursor-pointer ${
                            statusBadges[order.status]
                          }`}
                        >
                          <option value="NUEVO">NUEVO</option>
                          <option value="CONFIRMADO">CONFIRMADO</option>
                          <option value="EN_PREPARACION">EN PREPARACIÓN</option>
                          <option value="LISTO_DESPACHO">LISTO DESPACHO</option>
                          <option value="ENVIADO">ENVIADO</option>
                          <option value="ENTREGADO">ENTREGADO</option>
                          <option value="CANCELADO">CANCELADO</option>
                          <option value="DEVUELTO">DEVUELTO</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                            statusBadges[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveOrderModal(order)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Ver detalle del pedido"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleWhatsAppNotify(order)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition"
                          title="Contactar cliente por WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 my-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-400" />
                  Detalle del Pedido #{activeOrderModal.id}
                </h3>
                <p className="text-xs text-slate-400">Fecha: {activeOrderModal.date}</p>
              </div>
              <button
                onClick={() => setActiveOrderModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer & Delivery Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">Datos del Paciente / Cliente</p>
                <p className="font-bold text-white text-sm">{activeOrderModal.customerName}</p>
                <p className="text-slate-400">Documento: {activeOrderModal.customerDocument}</p>
                <p className="text-slate-400">Tel: {activeOrderModal.customerPhone}</p>
                <p className="text-slate-400">Email: {activeOrderModal.customerEmail}</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-teal-400 uppercase text-[10px] tracking-wider">Entrega en Boyacá</p>
                <p className="font-bold text-white">{activeOrderModal.deliveryCity}</p>
                <p className="text-slate-300">{activeOrderModal.deliveryAddress}</p>
                {activeOrderModal.deliveryNotes && (
                  <p className="text-amber-400 italic text-[11px]">Nota: {activeOrderModal.deliveryNotes}</p>
                )}
                <p className="text-slate-400 text-[11px]">Método: {activeOrderModal.paymentMethod}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Productos Farmacéuticos & Medicamentos ({activeOrderModal.items.length})
              </h4>
              <div className="space-y-1.5">
                {activeOrderModal.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white">{item.name}</p>
                        <p className="text-slate-400 text-[11px]">
                          {item.quantity} x ${item.priceCOP.toLocaleString("es-CO")} COP
                        </p>
                      </div>
                    </div>
                    <p className="font-black text-emerald-400">
                      ${(item.quantity * item.priceCOP).toLocaleString("es-CO")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal medicamentos:</span>
                <span>${activeOrderModal.subtotalCOP.toLocaleString("es-CO")} COP</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Costo de envío ({activeOrderModal.deliveryCity}):</span>
                <span>
                  {activeOrderModal.shippingCOP === 0
                    ? "¡Envío Gratis!"
                    : `$${activeOrderModal.shippingCOP.toLocaleString("es-CO")} COP`}
                </span>
              </div>
              {activeOrderModal.discountCOP > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Descuento aplicado:</span>
                  <span>-${activeOrderModal.discountCOP.toLocaleString("es-CO")} COP</span>
                </div>
              )}
              <div className="flex justify-between text-white font-black text-sm pt-2 border-t border-slate-800">
                <span>Total a Pagar:</span>
                <span className="text-emerald-400 text-base">
                  ${activeOrderModal.totalCOP.toLocaleString("es-CO")} COP
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleWhatsAppNotify(activeOrderModal)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enviar WhatsApp</span>
                </button>
                <button
                  onClick={() => handlePrint(activeOrderModal)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Guía</span>
                </button>
              </div>

              <button
                onClick={() => setActiveOrderModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
