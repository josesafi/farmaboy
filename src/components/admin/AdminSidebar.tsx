"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pill,
  ShoppingBag,
  Boxes,
  ClipboardList,
  Users,
  Tag,
  Image as ImageIcon,
  LayoutTemplate,
  Palette,
  FileText,
  Search,
  Settings,
  ShieldAlert,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
  Sparkles,
  SlidersHorizontal,
  Truck,
  MapPin,
  TrendingUp,
  BarChart3,
  CreditCard,
  Megaphone,
  Percent,
  MessageSquare,
  Store,
  Clock,
  HeartHandshake,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  Bell,
  Mail,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

interface NavGroup {
  label: string;
  items: {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    permission?: string;
    badgeCount?: number;
  }[];
}

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentAdmin, logout, medicines, orders, switchDemoRole } = useAdminStore();
  const [collapsed, setCollapsed] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.status === "NUEVO" || o.status === "CONFIRMADO").length;
  const lowStockCount = medicines.filter((m) => m.currentStock <= m.minStock).length;

  const navGroups: NavGroup[] = [
    {
      label: "PRINCIPAL",
      items: [
        { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      label: "VENTAS",
      items: [
        {
          title: "Pedidos",
          href: "/admin/pedidos",
          icon: ClipboardList,
          badgeCount: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
        },
        { title: "Carritos abandonados", href: "/admin/pedidos?tab=carritos", icon: ShoppingCart },
        { title: "Clientes", href: "/admin/clientes", icon: Users },
        { title: "Ventas", href: "/admin/pedidos?tab=ventas", icon: DollarSign },
        { title: "Cupones y promociones", href: "/admin/promociones", icon: Percent },
      ],
    },
    {
      label: "CATÁLOGO",
      items: [
        { title: "Productos", href: "/admin/productos", icon: ShoppingBag },
        {
          title: "Medicamentos",
          href: "/admin/medicamentos",
          icon: Pill,
          badgeCount: lowStockCount > 0 ? lowStockCount : undefined,
        },
        { title: "Categorías", href: "/admin/catalogo/categorias", icon: LayoutDashboard },
        { title: "Marcas", href: "/admin/productos?filter=marcas", icon: Store },
        { title: "Ofertas", href: "/admin/promociones?tab=ofertas", icon: Tag },
      ],
    },
    {
      label: "INVENTARIO",
      items: [
        { title: "Inventario", href: "/admin/inventario", icon: Boxes },
        { title: "Movimientos", href: "/admin/inventario?tab=movimientos", icon: TrendingUp },
        { title: "Lotes", href: "/admin/inventario?tab=lotes", icon: FileCheck },
        { title: "Vencimientos", href: "/admin/inventario?tab=vencimientos", icon: Clock },
        { title: "Proveedores", href: "/admin/inventario?tab=proveedores", icon: Store },
      ],
    },
    {
      label: "ENTREGAS",
      items: [
        { title: "Domicilios", href: "/admin/entregas?tab=domicilios", icon: Truck },
        { title: "Puntos de recogida", href: "/admin/entregas?tab=puntos", icon: MapPin },
        { title: "Zonas de cobertura", href: "/admin/entregas?tab=zonas", icon: MapPin },
        { title: "Tarifas de entrega", href: "/admin/entregas?tab=tarifas", icon: DollarSign },
      ],
    },
    {
      label: "CONTENIDO",
      items: [
        { title: "Banners", href: "/admin/banners", icon: ImageIcon },
        { title: "Blog de salud", href: "/admin/blog", icon: FileText },
        { title: "Páginas legales", href: "/admin/diseno?tab=legales", icon: FileCheck },
        { title: "Preguntas frecuentes", href: "/admin/diseno?tab=faq", icon: HelpCircle },
        { title: "Reseñas", href: "/admin/clientes?tab=resenas", icon: MessageSquare },
      ],
    },
    {
      label: "MARKETING",
      items: [
        { title: "Campañas", href: "/admin/promociones?tab=campanas", icon: Megaphone },
        { title: "Popups promocionales", href: "/admin/diseno?tab=popups", icon: LayoutTemplate },
        { title: "Notificaciones", href: "/admin/configuracion?tab=notificaciones", icon: Bell },
        { title: "Fidelización", href: "/admin/clientes?tab=fidelizacion", icon: HeartHandshake },
      ],
    },
    {
      label: "ANALÍTICA",
      items: [
        { title: "Resumen de ventas", href: "/admin?view=ventas", icon: BarChart3 },
        { title: "Productos más vendidos", href: "/admin?view=top-productos", icon: TrendingUp },
        { title: "Rendimiento de inventario", href: "/admin/inventario?tab=analitica", icon: Boxes },
        { title: "Reportes financieros", href: "/admin?view=financiero", icon: DollarSign },
      ],
    },
    {
      label: "COMUNICACIONES",
      items: [
        { title: "Centro de correos", href: "/admin/emails", icon: Mail },
        { title: "Plantillas de email", href: "/admin/emails/templates", icon: FileText },
        { title: "Diagnóstico SMTP", href: "/admin/emails/test", icon: Settings },
        { title: "Tickets de soporte", href: "/admin/soporte", icon: HelpCircle },
      ],
    },
    {
      label: "CONFIGURACIÓN",
      items: [
        { title: "Farmacia", href: "/admin/configuracion", icon: Store },
        { title: "Métodos de pago", href: "/admin/integraciones", icon: CreditCard },
        { title: "Envíos y entregas", href: "/admin/entregas", icon: Truck },
        { title: "Notificaciones del sistema", href: "/admin/configuracion?tab=sistema", icon: Settings },
        { title: "Usuarios y roles", href: "/admin/usuarios", icon: Users },
        { title: "Auditoría y logs", href: "/admin/seguridad", icon: ShieldAlert },
        { title: "Papelera", href: "/admin/papelera", icon: Trash2 },
      ],
    },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 z-30 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/40">
        {!collapsed ? (
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="bg-white/95 px-2.5 py-1 rounded-xl shadow-xs border border-slate-700/50 flex items-center">
              <img
                src="/images/logo-farmaboy.png"
                alt="FARMABOY"
                className="h-7 w-auto object-contain"
              />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              CMS
            </span>
          </Link>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-white/95 flex items-center justify-center p-1 shadow-sm border border-slate-700/50">
              <img
                src="/favicon-32x32.png"
                alt="Farmaboy"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {group.label}
              </h4>
            )}
            {group.items.map((item) => {
              const basePath = item.href.split("?")[0];
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === basePath || (basePath !== "/admin" && pathname.startsWith(basePath + "/"));
              const Icon = item.icon;

              return (
                <Link
                  key={`${item.href}-${item.title}`}
                  href={item.href}
                  title={collapsed ? item.title : undefined}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 relative ${
                    isActive
                      ? "bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-400"
                    }`}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate tracking-tight">{item.title}</span>
                  )}
                  {!collapsed && item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? "bg-white text-emerald-800"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile & Demo Switcher */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                {currentAdmin?.name.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentAdmin?.name || "Administrador"}</p>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">
                    {currentAdmin?.role || "SUPER_ADMIN"}
                  </span>
                </div>
              </div>
            </div>

            {/* Demo Role Switcher Quick Pill */}
            <div className="pt-1">
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Simular Rol:
              </label>
              <div className="grid grid-cols-3 gap-1 text-[10px]">
                <button
                  onClick={() => switchDemoRole("SUPER_ADMIN")}
                  className={`px-1.5 py-1 rounded border text-center font-bold transition-colors ${
                    currentAdmin?.role === "SUPER_ADMIN"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                  title="Acceso total a todo el sistema"
                >
                  Admin
                </button>
                <button
                  onClick={() => switchDemoRole("FARMACEUTICO")}
                  className={`px-1.5 py-1 rounded border text-center font-bold transition-colors ${
                    currentAdmin?.role === "FARMACEUTICO"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                  title="Medicamentos, Kardex e INVIMA"
                >
                  Q.F.
                </button>
                <button
                  onClick={() => switchDemoRole("VENTAS")}
                  className={`px-1.5 py-1 rounded border text-center font-bold transition-colors ${
                    currentAdmin?.role === "VENTAS"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                  title="Ventas, Pedidos y CRM"
                >
                  Ventas
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 pt-1">
              <Link
                href="/"
                target="_blank"
                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver Tienda</span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              title="Ver Tienda"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
