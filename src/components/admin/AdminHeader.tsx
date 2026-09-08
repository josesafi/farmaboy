"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  Bell,
  Sparkles,
  ChevronDown,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  Plus,
  Pill,
  Boxes,
  MapPin,
  Tag,
  Truck,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { GlobalSearchModal } from "./GlobalSearchModal";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const { currentAdmin, switchDemoRole, logout, medicines, orders } = useAdminStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [notifFilter, setNotifFilter] = useState<"ALL" | "STOCK" | "PEDIDOS" | "VENCIMIENTOS">("ALL");

  const lowStockItems = medicines.filter((m) => m.currentStock <= m.minStock);
  const pendingOrders = orders.filter((o) => o.status === "NUEVO" || o.status === "CONFIRMADO" || o.status === "PREPARANDO");
  const expiringSoonItems = medicines.filter((m) => {
    const exp = new Date(m.expiryDate).getTime();
    const diffDays = (exp - Date.now()) / (1000 * 3600 * 24);
    return diffDays > 0 && diffDays <= 180;
  });

  const notificationCount = lowStockItems.length + pendingOrders.length + expiringSoonItems.length;

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Page Title / Breadcrumb context */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              {title || "Panel de Administración"}
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                En Línea
              </span>
            </h1>
            {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
          </div>
        </div>

        {/* Center: Global Search Bar Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition shadow-inner group"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Buscar medicamento, lote, INVIMA, pedido...</span>
            </span>
            <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Buscar"
          >
            <Search className="w-5 h-5 text-emerald-400" />
          </button>

          {/* Quick Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowQuickActions(!showQuickActions);
                setShowNotifications(false);
                setShowRoleDropdown(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Acción rápida</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {showQuickActions && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                <div className="px-3 py-1.5 border-b border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Acciones Directas</p>
                </div>
                <Link
                  href="/admin/medicamentos"
                  onClick={() => setShowQuickActions(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition group"
                >
                  <Pill className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                  <span>+ Nuevo Medicamento (INVIMA)</span>
                </Link>
                <Link
                  href="/admin/productos"
                  onClick={() => setShowQuickActions(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition group"
                >
                  <ShoppingBag className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
                  <span>+ Nuevo Producto Retail</span>
                </Link>
                <Link
                  href="/admin/pedidos"
                  onClick={() => setShowQuickActions(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition group"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-400 group-hover:scale-110 transition" />
                  <span>+ Gestionar Pedidos</span>
                </Link>
                <Link
                  href="/admin/entregas"
                  onClick={() => setShowQuickActions(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition group"
                >
                  <MapPin className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                  <span>+ Puntos de Recogida & Tarifas</span>
                </Link>
                <Link
                  href="/admin/promociones"
                  onClick={() => setShowQuickActions(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition group"
                >
                  <Tag className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" />
                  <span>+ Crear Promoción / Cupón</span>
                </Link>
                <Link
                  href="/admin/inventario"
                  onClick={() => setShowQuickActions(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition group"
                >
                  <Boxes className="w-4 h-4 text-sky-400 group-hover:scale-110 transition" />
                  <span>+ Registrar Entrada a Kardex</span>
                </Link>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowQuickActions(false);
                setShowRoleDropdown(false);
              }}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition relative"
              title="Notificaciones operativas"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center border-2 border-slate-900 animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3.5 z-50 animate-fadeIn space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-emerald-400" /> Centro de Notificaciones
                  </h4>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    {notificationCount} alertas
                  </span>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
                  <button
                    onClick={() => setNotifFilter("ALL")}
                    className={`px-2 py-1 rounded-lg font-bold transition ${
                      notifFilter === "ALL" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    Todas ({notificationCount})
                  </button>
                  <button
                    onClick={() => setNotifFilter("STOCK")}
                    className={`px-2 py-1 rounded-lg font-bold transition ${
                      notifFilter === "STOCK" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    Stock ({lowStockItems.length})
                  </button>
                  <button
                    onClick={() => setNotifFilter("PEDIDOS")}
                    className={`px-2 py-1 rounded-lg font-bold transition ${
                      notifFilter === "PEDIDOS" ? "bg-blue-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    Pedidos ({pendingOrders.length})
                  </button>
                  <button
                    onClick={() => setNotifFilter("VENCIMIENTOS")}
                    className={`px-2 py-1 rounded-lg font-bold transition ${
                      notifFilter === "VENCIMIENTOS" ? "bg-rose-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    Vence ({expiringSoonItems.length})
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 text-xs pr-1">
                  {(notifFilter === "ALL" || notifFilter === "STOCK") && lowStockItems.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
                      <div className="flex items-center justify-between font-bold text-amber-300 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Stock Crítico ({lowStockItems.length})
                        </span>
                        <span className="text-[10px] text-amber-400/80 font-normal">Kardex</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {lowStockItems.slice(0, 2).map((m) => m.name).join(", ")}
                        {lowStockItems.length > 2 && ` y ${lowStockItems.length - 2} más`}
                      </p>
                      <Link
                        href="/admin/inventario"
                        onClick={() => setShowNotifications(false)}
                        className="text-[10px] font-bold text-amber-400 hover:underline inline-block mt-0.5"
                      >
                        Reabastecer stock →
                      </Link>
                    </div>
                  )}

                  {(notifFilter === "ALL" || notifFilter === "PEDIDOS") && pendingOrders.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 space-y-1">
                      <div className="flex items-center justify-between font-bold text-blue-300 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5" /> Pedidos Pendientes ({pendingOrders.length})
                        </span>
                        <span className="text-[10px] text-blue-400/80 font-normal">Despacho</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Pedidos en estado Nuevo, Confirmado o Preparando listos para gestión.
                      </p>
                      <Link
                        href="/admin/pedidos"
                        onClick={() => setShowNotifications(false)}
                        className="text-[10px] font-bold text-blue-400 hover:underline inline-block mt-0.5"
                      >
                        Gestionar despachos →
                      </Link>
                    </div>
                  )}

                  {(notifFilter === "ALL" || notifFilter === "VENCIMIENTOS") && expiringSoonItems.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-1">
                      <div className="flex items-center justify-between font-bold text-rose-300 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Próximos Vencimientos INVIMA ({expiringSoonItems.length})
                        </span>
                        <span className="text-[10px] text-rose-400/80 font-normal">&lt; 6 meses</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {expiringSoonItems.slice(0, 2).map((m) => m.name).join(", ")}
                      </p>
                      <Link
                        href="/admin/inventario"
                        onClick={() => setShowNotifications(false)}
                        className="text-[10px] font-bold text-rose-400 hover:underline inline-block mt-0.5"
                      >
                        Revisar lotes y caducidades →
                      </Link>
                    </div>
                  )}

                  {notificationCount === 0 && (
                    <p className="text-center py-6 text-slate-400 text-xs">
                      No hay alertas pendientes en este momento.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick View Public Store */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/60 transition"
          >
            <span>Ver Tienda</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </Link>

          {/* Profile & Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center">
                {currentAdmin?.name.charAt(0) || "A"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-white leading-tight">{currentAdmin?.name}</p>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">
                  {currentAdmin?.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">{currentAdmin?.name}</p>
                  <p className="text-[11px] text-slate-400">{currentAdmin?.email}</p>
                </div>

                <div className="py-1">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" /> Cambiar Rol Demo
                  </p>
                  <button
                    onClick={() => {
                      switchDemoRole("SUPER_ADMIN");
                      setShowRoleDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
                  >
                    <span>Super Administrador</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole("FARMACEUTICO");
                      setShowRoleDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Químico Farmacéutico (Q.F.)
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole("VENTAS");
                      setShowRoleDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Ventas & Pedidos
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole("EDITOR");
                      setShowRoleDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Editor de Contenido & CMS
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole("SOPORTE");
                      setShowRoleDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Atención & Soporte
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
