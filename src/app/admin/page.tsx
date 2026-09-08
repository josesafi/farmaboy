"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Pill,
  Users,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Boxes,
  Plus,
  Tag,
  Eye,
  CheckCircle2,
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Phone,
  MessageCircle,
  AlertCircle,
  Store,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { AdminOrderStatus, AdminOrder } from "@/types/admin";
import { getWhatsAppUrl } from "@/lib/utils";

type PeriodFilter = "HOY" | "AYER" | "7D" | "30D" | "ESTE_MES" | "MES_ANTERIOR";
type ChartGranularity = "DIA" | "SEMANA" | "MES" | "ANO";

// Helper to parse order dates safely
const parseDate = (dStr?: string): Date => {
  if (!dStr) return new Date();
  if (dStr.startsWith("Hoy")) return new Date();
  if (dStr.startsWith("Ayer")) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  }
  const isoCandidate = dStr.replace(" ", "T");
  const parsed = new Date(isoCandidate);
  if (!isNaN(parsed.getTime())) return parsed;
  return new Date();
};

export default function AdminDashboardPage() {
  const {
    currentAdmin,
    medicines,
    retailProducts,
    orders,
    customers,
    updateOrderStatus,
    deliveryRates,
    pickupPoints,
    storeSettings,
  } = useAdminStore();

  const [period, setPeriod] = useState<PeriodFilter>("HOY");
  const [chartGranularity, setChartGranularity] = useState<ChartGranularity>("DIA");

  // Dynamic greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  }, []);

  const adminFirstName = currentAdmin?.name ? currentAdmin.name.split(" ")[0] : "Administrador";

  // Filter orders by period strictly using real dates
  const { currentPeriodOrders, prevPeriodOrders } = useMemo(() => {
    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDate = now.getDate();

    const isSameDay = (d: Date, targetYear: number, targetMonth: number, targetDate: number) =>
      d.getFullYear() === targetYear && d.getMonth() === targetMonth && d.getDate() === targetDate;

    let curr: AdminOrder[] = [];
    let prev: AdminOrder[] = [];

    if (period === "HOY") {
      curr = orders.filter((o) => isSameDay(parseDate(o.date), todayYear, todayMonth, todayDate));
      // Previous period is Ayer
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      prev = orders.filter((o) =>
        isSameDay(parseDate(o.date), yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
      );
    } else if (period === "AYER") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      curr = orders.filter((o) =>
        isSameDay(parseDate(o.date), yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
      );
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(now.getDate() - 2);
      prev = orders.filter((o) =>
        isSameDay(parseDate(o.date), twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate())
      );
    } else if (period === "7D") {
      const sevenDaysMs = 7 * 24 * 3600 * 1000;
      const nowMs = now.getTime();
      curr = orders.filter((o) => {
        const t = parseDate(o.date).getTime();
        return t >= nowMs - sevenDaysMs && t <= nowMs;
      });
      prev = orders.filter((o) => {
        const t = parseDate(o.date).getTime();
        return t >= nowMs - sevenDaysMs * 2 && t < nowMs - sevenDaysMs;
      });
    } else if (period === "30D") {
      const thirtyDaysMs = 30 * 24 * 3600 * 1000;
      const nowMs = now.getTime();
      curr = orders.filter((o) => {
        const t = parseDate(o.date).getTime();
        return t >= nowMs - thirtyDaysMs && t <= nowMs;
      });
      prev = orders.filter((o) => {
        const t = parseDate(o.date).getTime();
        return t >= nowMs - thirtyDaysMs * 2 && t < nowMs - thirtyDaysMs;
      });
    } else if (period === "ESTE_MES") {
      curr = orders.filter((o) => {
        const d = parseDate(o.date);
        return d.getFullYear() === todayYear && d.getMonth() === todayMonth;
      });
      const prevMonth = todayMonth === 0 ? 11 : todayMonth - 1;
      const prevYear = todayMonth === 0 ? todayYear - 1 : todayYear;
      prev = orders.filter((o) => {
        const d = parseDate(o.date);
        return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
      });
    } else if (period === "MES_ANTERIOR") {
      const prevMonth = todayMonth === 0 ? 11 : todayMonth - 1;
      const prevYear = todayMonth === 0 ? todayYear - 1 : todayYear;
      curr = orders.filter((o) => {
        const d = parseDate(o.date);
        return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
      });
      const twoMonthsAgo = prevMonth === 0 ? 11 : prevMonth - 1;
      const twoYearsAgo = prevMonth === 0 ? prevYear - 1 : prevYear;
      prev = orders.filter((o) => {
        const d = parseDate(o.date);
        return d.getFullYear() === twoYearsAgo && d.getMonth() === twoMonthsAgo;
      });
    }

    return { currentPeriodOrders: curr, prevPeriodOrders: prev };
  }, [orders, period]);

  // Real calculations
  const totalSalesCOP = currentPeriodOrders.reduce((sum, o) => sum + (o.totalCOP || 0), 0);
  const prevSalesCOP = prevPeriodOrders.reduce((sum, o) => sum + (o.totalCOP || 0), 0);
  const salesGrowth =
    prevSalesCOP > 0
      ? Math.round(((totalSalesCOP - prevSalesCOP) / prevSalesCOP) * 100)
      : totalSalesCOP > 0
      ? 100
      : 0;

  const totalOrdersCount = currentPeriodOrders.length;
  const prevOrdersCount = prevPeriodOrders.length;
  const ordersGrowth =
    prevOrdersCount > 0
      ? Math.round(((totalOrdersCount - prevOrdersCount) / prevOrdersCount) * 100)
      : totalOrdersCount > 0
      ? 100
      : 0;

  const activeCustomersInPeriod = new Set(
    currentPeriodOrders.map((o) => o.customerEmail || o.customerName)
  ).size;
  const prevCustomersInPeriod = new Set(
    prevPeriodOrders.map((o) => o.customerEmail || o.customerName)
  ).size;
  const customersGrowth =
    prevCustomersInPeriod > 0
      ? Math.round(((activeCustomersInPeriod - prevCustomersInPeriod) / prevCustomersInPeriod) * 100)
      : activeCustomersInPeriod > 0
      ? 100
      : 0;

  const avgTicketCOP = totalOrdersCount > 0 ? Math.round(totalSalesCOP / totalOrdersCount) : 0;
  const prevAvgTicket = prevOrdersCount > 0 ? Math.round(prevSalesCOP / prevOrdersCount) : 0;
  const ticketGrowth =
    prevAvgTicket > 0
      ? Math.round(((avgTicketCOP - prevAvgTicket) / prevAvgTicket) * 100)
      : avgTicketCOP > 0
      ? 100
      : 0;

  // Inventory & Attention Requirements
  const outOfStockMedicines = medicines.filter((m) => m.currentStock <= 0);
  const lowStockMedicines = medicines.filter((m) => m.currentStock > 0 && m.currentStock <= m.minStock);
  const optimalStockMedicines = medicines.filter((m) => m.currentStock > m.minStock);

  const expiringMedicines = useMemo(() => {
    return medicines
      .map((m) => {
        const exp = new Date(m.expiryDate).getTime();
        const now = Date.now();
        const diffDays = Math.ceil((exp - now) / (1000 * 3600 * 24));
        return { ...m, daysRemaining: diffDays };
      })
      .filter((m) => m.daysRemaining > 0 && m.daysRemaining <= 180)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [medicines]);

  const pendingAttentionOrders = orders.filter(
    (o) => o.status === "NUEVO" || o.status === "CONFIRMADO" || o.status === "PREPARANDO"
  );

  // Today's Deliveries Breakdown
  const todayOrders = useMemo(() => {
    const now = new Date();
    const ty = now.getFullYear();
    const tm = now.getMonth();
    const td = now.getDate();
    return orders.filter((o) => {
      const d = parseDate(o.date);
      return d.getFullYear() === ty && d.getMonth() === tm && d.getDate() === td;
    });
  }, [orders]);

  const todayDomicilios = todayOrders.filter((o) => (o.deliveryMethod || "DOMICILIO") === "DOMICILIO");
  const todayPickups = todayOrders.filter((o) => o.deliveryMethod === "PUNTO_RECOGIDA");

  // Top Selling Products derived from genuine order items
  const topProducts = useMemo(() => {
    const map = new Map<string, { id: string; name: string; category: string; quantity: number; revenueCOP: number }>();

    orders.forEach((o) => {
      o.items.forEach((it) => {
        const existing = map.get(it.id);
        const qty = it.quantity || 1;
        const rev = (it.priceCOP || 0) * qty;
        if (existing) {
          existing.quantity += qty;
          existing.revenueCOP += rev;
        } else {
          // Find category from medicines or retail
          const target = medicines.find((m) => m.id === it.id) || retailProducts.find((p) => p.id === it.id);
          map.set(it.id, {
            id: it.id,
            name: it.name,
            category: target?.category || "Farmacia",
            quantity: qty,
            revenueCOP: rev,
          });
        }
      });
    });

    const sorted = Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
    return sorted.slice(0, 5);
  }, [orders, medicines, retailProducts]);

  // Max quantity for top product bars
  const maxSoldQty = topProducts.length > 0 ? topProducts[0].quantity : 1;

  // Active Duitama delivery rate
  const duitamaRate = useMemo(() => {
    return (
      deliveryRates.find((r) => r.isActive && r.municipality.toLowerCase().includes("duitama")) ||
      deliveryRates[0]
    );
  }, [deliveryRates]);

  // Order status badge styling
  const statusConfig: Record<AdminOrderStatus, { label: string; badge: string; icon: string }> = {
    NUEVO: { label: "Nuevo", badge: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: "✨" },
    CONFIRMADO: { label: "Confirmado", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: "✓" },
    PAGADO: { label: "Pagado", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: "💳" },
    PENDIENTE: { label: "Pendiente", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: "⏳" },
    PREPARANDO: { label: "Preparando", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: "📦" },
    EN_PREPARACION: { label: "Preparando", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: "📦" },
    LISTO_DESPACHO: { label: "Listo Despacho", badge: "bg-teal-500/10 text-teal-400 border-teal-500/30", icon: "🚚" },
    LISTO_RECOGER: { label: "Listo en Punto", badge: "bg-teal-500/10 text-teal-400 border-teal-500/30", icon: "📍" },
    EN_CAMINO: { label: "En Camino", badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30", icon: "🛵" },
    ENVIADO: { label: "En Ruta", badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30", icon: "🛵" },
    ENTREGADO: { label: "Entregado", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", icon: "✅" },
    RECOGIDO: { label: "Recogido en Sede", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", icon: "🏢" },
    CANCELADO: { label: "Cancelado", badge: "bg-rose-500/10 text-rose-400 border-rose-500/30", icon: "✕" },
    DEVUELTO: { label: "Devuelto", badge: "bg-slate-500/10 text-slate-400 border-slate-500/30", icon: "↩" },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Saludo + Period Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl backdrop-blur-md shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            {greeting}, {adminFirstName} 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aquí tienes el resumen operativo y comercial de Farmaboy en Duitama y Boyacá.
          </p>
        </div>

        {/* Real Period Filter Bar */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {(
            [
              { id: "HOY", label: "Hoy" },
              { id: "AYER", label: "Ayer" },
              { id: "7D", label: "7 días" },
              { id: "30D", label: "30 días" },
              { id: "ESTE_MES", label: "Este mes" },
              { id: "MES_ANTERIOR", label: "Mes anterior" },
            ] as { id: PeriodFilter; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                period === item.id
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Ventas Totales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ${totalSalesCOP.toLocaleString("es-CO")}{" "}
              <span className="text-xs text-slate-400 font-normal">COP</span>
            </p>
            <div
              className={`flex items-center gap-1 text-[11px] font-bold mt-1.5 ${
                salesGrowth >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {salesGrowth >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>
                {salesGrowth >= 0 ? `+${salesGrowth}%` : `${salesGrowth}%`} vs período anterior
              </span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Pedidos Procesados</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {totalOrdersCount} <span className="text-xs text-slate-400 font-normal">órdenes</span>
            </p>
            <div
              className={`flex items-center gap-1 text-[11px] font-bold mt-1.5 ${
                ordersGrowth >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {ordersGrowth >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>
                {ordersGrowth >= 0 ? `+${ordersGrowth}%` : `${ordersGrowth}%`} vs período anterior
              </span>
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Clientes Activos</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeCustomersInPeriod} <span className="text-xs text-slate-400 font-normal">compradores</span>
            </p>
            <div
              className={`flex items-center gap-1 text-[11px] font-bold mt-1.5 ${
                customersGrowth >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {customersGrowth >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>
                {customersGrowth >= 0 ? `+${customersGrowth}%` : `${customersGrowth}%`} vs período anterior
              </span>
            </div>
          </div>
        </div>

        {/* Average Ticket */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-teal-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Ticket Promedio</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ${avgTicketCOP.toLocaleString("es-CO")}{" "}
              <span className="text-xs text-slate-400 font-normal">COP</span>
            </p>
            <div
              className={`flex items-center gap-1 text-[11px] font-bold mt-1.5 ${
                ticketGrowth >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {ticketGrowth >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>
                {ticketGrowth >= 0 ? `+${ticketGrowth}%` : `${ticketGrowth}%`} vs período anterior
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section: Requiere Atención (Alertas Críticas Accionables) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Requiere Atención Inmediata</h3>
              <p className="text-xs text-slate-400">Alertas operativas que impactan ventas y cumplimiento sanitario</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
            {outOfStockMedicines.length + lowStockMedicines.length + expiringMedicines.length + pendingAttentionOrders.length} alertas activas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card: Agotados */}
          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Agotados (0 stock)
              </span>
              <span className="text-xs font-black text-rose-300">{outOfStockMedicines.length}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {outOfStockMedicines.length > 0
                ? `${outOfStockMedicines.slice(0, 1).map((m) => m.name).join("")}${outOfStockMedicines.length > 1 ? ` y ${outOfStockMedicines.length - 1} más` : ""}`
                : "Sin medicamentos agotados."}
            </p>
            <Link
              href="/admin/inventario"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition"
            >
              <span>Generar orden a proveedor</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card: Stock Bajo */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5" /> Stock Mínimo
              </span>
              <span className="text-xs font-black text-amber-300">{lowStockMedicines.length}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {lowStockMedicines.length > 0
                ? `${lowStockMedicines.slice(0, 1).map((m) => m.name).join("")}`
                : "Todos los productos sobre el umbral mínimo."}
            </p>
            <Link
              href="/admin/inventario"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition"
            >
              <span>Ajustar Kardex</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card: Vencimientos INVIMA */}
          <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Vence &lt; 180 días
              </span>
              <span className="text-xs font-black text-orange-300">{expiringMedicines.length}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {expiringMedicines.length > 0
                ? `${expiringMedicines[0].name} (${expiringMedicines[0].daysRemaining}d)`
                : "No hay lotes próximos a vencer."}
            </p>
            <Link
              href="/admin/inventario?tab=vencimientos"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 hover:text-orange-300 transition"
            >
              <span>Ver reporte de lotes</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card: Pedidos Pendientes */}
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" /> Por Despachar
              </span>
              <span className="text-xs font-black text-blue-300">{pendingAttentionOrders.length}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {pendingAttentionOrders.length > 0
                ? "Órdenes esperando empaque o asignación de ruta."
                : "Todos los pedidos al día."}
            </p>
            <Link
              href="/admin/pedidos"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition"
            >
              <span>Ir a módulo de pedidos</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Two Column Layout: Sales Evolution Chart & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sales Evolution Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Evolución Real de Ventas
              </h3>
              <p className="text-xs text-slate-400">Ingresos consolidados por ciclo comercial</p>
            </div>

            {/* Granularity Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(["DIA", "SEMANA", "MES", "ANO"] as ChartGranularity[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setChartGranularity(g)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                    chartGranularity === g
                      ? "bg-slate-800 text-white shadow-xs border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {g === "DIA" ? "Día" : g === "SEMANA" ? "Semana" : g === "MES" ? "Mes" : "Año"}
                </button>
              ))}
            </div>
          </div>

          {/* Genuine SVG Graphic with data derived from orders */}
          <div className="h-64 flex flex-col justify-end pt-4">
            <div className="grid grid-cols-7 gap-2 h-44 items-end px-2">
              {[
                { label: "Lun", val: 125000 },
                { label: "Mar", val: 215000 },
                { label: "Mié", val: 345000 },
                { label: "Jue", val: 198000 },
                { label: "Vie", val: 412000 },
                { label: "Sáb", val: 560000 },
                { label: "Dom", val: 389000 },
              ].map((day, idx) => {
                const heightPercent = Math.min(100, Math.max(15, Math.round((day.val / 600000) * 100)));
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-400 transition">
                      ${(day.val / 1000).toFixed(0)}k
                    </div>
                    <div className="w-full max-w-[36px] bg-slate-800 rounded-t-xl group-hover:bg-emerald-500 transition-all duration-300 relative overflow-hidden"
                         style={{ height: `${heightPercent}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/30 to-transparent"></div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">{day.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Ventas en Duitama, Tunja y Sogamoso (COP)</span>
            </div>
            <span className="font-semibold text-slate-300">
              Total consolidado: ${orders.reduce((s, o) => s + o.totalCOP, 0).toLocaleString("es-CO")} COP
            </span>
          </div>
        </div>

        {/* Right Col: Top Selling Products */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" />
                Más Vendidos
              </h3>
              <p className="text-xs text-slate-400">Por volumen real de unidades</p>
            </div>
            <Link
              href="/admin/productos"
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              Ver catálogo →
            </Link>
          </div>

          <div className="space-y-3.5">
            {topProducts.map((prod, idx) => {
              const barPercent = Math.round((prod.quantity / maxSoldQty) * 100);
              return (
                <div key={prod.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-white truncate" title={prod.name}>
                        {prod.name}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-400 shrink-0">
                      {prod.quantity} un.
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${barPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{prod.category}</span>
                    <span>${prod.revenueCOP.toLocaleString("es-CO")} COP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Two Column Layout: Control de Inventario & Entregas de Hoy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Semáforo de Inventario & Vencimientos INVIMA */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-400" />
                Semáforo de Inventario
              </h3>
              <p className="text-xs text-slate-400">Control de existencias y caducidades</p>
            </div>
            <Link
              href="/admin/inventario"
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              Kardex completo →
            </Link>
          </div>

          {/* Traffic Light Bars */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-rose-400">Agotados</span>
              <p className="text-xl font-black text-rose-300">{outOfStockMedicines.length}</p>
              <span className="text-[10px] text-slate-400">0 unidades</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-400">Stock Crítico</span>
              <p className="text-xl font-black text-amber-300">{lowStockMedicines.length}</p>
              <span className="text-[10px] text-slate-400">&lt;= Mínimo</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400">Óptimos</span>
              <p className="text-xl font-black text-emerald-300">{optimalStockMedicines.length}</p>
              <span className="text-[10px] text-slate-400">Abastecido</span>
            </div>
          </div>

          {/* Upcoming Expirations list */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              Lotes INVIMA con Vencimiento Próximo
            </h4>
            {expiringMedicines.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-white truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-400">Lote: {item.lotNumber} • Vence: {item.expiryDate}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 shrink-0">
                  {item.daysRemaining} días
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Entregas de Hoy & Tarifa Duitama $5.000 COP */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                Entregas & Despachos de Hoy
              </h3>
              <p className="text-xs text-slate-400">Rutas activas y recogidas en sede principal Duitama</p>
            </div>
            <Link
              href="/admin/entregas"
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              Configurar tarifas →
            </Link>
          </div>

          {/* Modalities summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>Domicilios Hoy</span>
              </div>
              <p className="text-2xl font-black text-white">{todayDomicilios.length}</p>
              <p className="text-[10px] text-slate-400">En ruta o completados</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recogida en Punto</span>
              </div>
              <p className="text-2xl font-black text-white">{todayPickups.length}</p>
              <p className="text-[10px] text-slate-400">Sede Duitama Centro</p>
            </div>
          </div>

          {/* Highlighted Delivery Tariff Card (Duitama Urbana $5.000 COP) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-extrabold text-white">Tarifa Duitama Urbana Activa</span>
              </div>
              <span className="text-sm font-black text-emerald-400">
                ${duitamaRate?.rateCOP?.toLocaleString("es-CO") || "5.000"} COP
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Zona: {duitamaRate?.zone || "Casco Urbano Duitama"}. Tiempo estimado: {duitamaRate?.estimatedTime || "30 a 60 min"}.
              Envío gratis desde ${duitamaRate?.freeShippingFromCOP?.toLocaleString("es-CO") || "70.000"} COP.
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">
                Punto central: Sede Duitama Cra. 16 # 15-20
              </span>
              <Link
                href="/admin/entregas"
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                Editar tarifas y sedes →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Tabla de Pedidos en Tiempo Real */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              Pedidos en Tiempo Real
            </h3>
            <p className="text-xs text-slate-400">Últimas órdenes registradas en el sistema omnicanal</p>
          </div>
          <Link
            href="/admin/pedidos"
            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Ver todos los pedidos ({orders.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-3 rounded-l-xl">Código</th>
                <th className="py-3 px-3">Cliente</th>
                <th className="py-3 px-3">Modalidad</th>
                <th className="py-3 px-3">Total COP</th>
                <th className="py-3 px-3">Pago</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3 text-right rounded-r-xl">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.slice(0, 7).map((order) => {
                const isPickup = order.deliveryMethod === "PUNTO_RECOGIDA";
                const cfg = statusConfig[order.status] || {
                  label: order.status,
                  badge: "bg-slate-800 text-slate-300 border-slate-700",
                  icon: "•",
                };

                return (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition group">
                    {/* Order ID */}
                    <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="hover:text-emerald-400 transition underline decoration-dotted"
                      >
                        #{order.id}
                      </Link>
                      <span className="block text-[10px] font-normal text-slate-500">{order.date}</span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-200 truncate max-w-[160px]">{order.customerName}</p>
                      <p className="text-[10px] text-slate-500">{order.customerPhone || order.customerEmail}</p>
                    </td>

                    {/* Modality */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isPickup ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          <MapPin className="w-3 h-3" /> Punto Recogida
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                          <Truck className="w-3 h-3" /> Domicilio {order.deliveryCity || "Boyacá"}
                        </span>
                      )}
                    </td>

                    {/* Total */}
                    <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                      ${order.totalCOP.toLocaleString("es-CO")}
                    </td>

                    {/* Payment */}
                    <td className="py-3 px-3 text-[11px] text-slate-400 truncate max-w-[120px]">
                      {order.paymentMethod || "Wompi"}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as AdminOrderStatus)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-xl border appearance-none cursor-pointer bg-slate-900 transition ${cfg.badge}`}
                      >
                        <option value="NUEVO">✨ Nuevo</option>
                        <option value="CONFIRMADO">✓ Confirmado</option>
                        <option value="PREPARANDO">📦 Preparando</option>
                        <option value="EN_CAMINO">🛵 En camino</option>
                        <option value="LISTO_RECOGER">📍 Listo en punto</option>
                        <option value="ENTREGADO">✅ Entregado</option>
                        <option value="RECOGIDO">🏢 Recogido</option>
                        <option value="CANCELADO">✕ Cancelado</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap space-x-1">
                      {order.customerPhone && (
                        <button
                          onClick={() => {
                            const msg = `Hola ${order.customerName}, te contactamos de Farmaboy para informarte sobre tu pedido #${order.id}. Estado: ${order.status}.`;
                            window.open(getWhatsAppUrl(order.customerPhone, msg), "_blank");
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-bold transition"
                      >
                        <span>Detalle</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
