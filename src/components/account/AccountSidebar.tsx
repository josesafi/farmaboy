"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  User,
  MapPin,
  ShoppingBag,
  RotateCcw,
  CalendarClock,
  Heart,
  ListOrdered,
  Users,
  FileText,
  Award,
  Ticket,
  CreditCard,
  Receipt,
  Bell,
  ShieldCheck,
  Lock,
  HelpCircle,
  Building2,
  Store,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface Props {
  onItemClick?: () => void;
}

export const AccountSidebar: React.FC<Props> = ({ onItemClick }) => {
  const pathname = usePathname();
  const { user, logout, activeMode, switchMode, loyalty } = useAuth();

  const navGroups = [
    {
      group: "Mi Espacio",
      items: [
        { label: "Resumen 360", href: "/mi-cuenta", icon: LayoutDashboard },
        { label: "Mi perfil", href: "/mi-cuenta/perfil", icon: User },
        { label: "Mis direcciones", href: "/mi-cuenta/direcciones", icon: MapPin },
        { label: "Seguridad y accesos", href: "/mi-cuenta/seguridad", icon: ShieldCheck },
      ],
    },
    {
      group: "Compras & Pedidos",
      items: [
        { label: "Mis pedidos", href: "/mi-cuenta/pedidos", icon: ShoppingBag },
        { label: "Comprar nuevamente", href: "/mi-cuenta/comprar-nuevamente", icon: RotateCcw },
        { label: "Compras recurrentes", href: "/mi-cuenta/compras-recurrentes", icon: CalendarClock },
        { label: "Favoritos", href: "/mi-cuenta/favoritos", icon: Heart },
        { label: "Listas de compra", href: "/mi-cuenta/listas", icon: ListOrdered },
      ],
    },
    {
      group: "Salud & Familia",
      items: [
        { label: "Mi familia", href: "/mi-cuenta/familia", icon: Users },
        { label: "Fórmulas médicas", href: "/mi-cuenta/formulas", icon: FileText },
      ],
    },
    {
      group: "Beneficios & Finanzas",
      items: [
        { label: "Beneficios y puntos", href: "/mi-cuenta/beneficios", icon: Award },
        { label: "Mis cupones", href: "/mi-cuenta/cupones", icon: Ticket },
        { label: "Métodos de pago", href: "/mi-cuenta/pagos", icon: CreditCard },
        { label: "Facturación electrónica", href: "/mi-cuenta/facturacion", icon: Receipt },
      ],
    },
    {
      group: "Preferencias & Soporte",
      items: [
        { label: "Notificaciones", href: "/mi-cuenta/notificaciones", icon: Bell },
        { label: "Privacidad y datos", href: "/mi-cuenta/privacidad", icon: Lock },
        { label: "Centro de ayuda", href: "/mi-cuenta/soporte", icon: HelpCircle },
      ],
    },
    {
      group: "Corporativo B2B",
      items: [
        { label: "Portal Empresa B2B", href: "/mi-cuenta/empresa", icon: Building2 },
        { label: "Múltiples sedes", href: "/mi-cuenta/sedes", icon: Store },
      ],
    },
  ];

  return (
    <aside className="w-full bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm">
      {/* User Header Profile Card */}
      <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
        <div className="relative">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#00A86B] to-[#008755] flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#00A86B]/20">
            {user?.name ? user.name[0] : "C"}
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Usuario Verificado" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-900 truncate">
              {user ? `${user.name} ${user.lastName}` : "Usuario FarmaBoy"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 truncate">{user?.email || "usuario@farmaboy.com.co"}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
              <Sparkles className="w-2.5 h-2.5 text-[#00A86B]" />
              Nivel {loyalty.tier}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              {loyalty.points} pts
            </span>
          </div>
        </div>
      </div>

      {/* Switch Mode: Personal vs Empresa */}
      <div className="my-4 p-1 rounded-xl bg-slate-100 grid grid-cols-2 text-xs font-bold text-center">
        <button
          type="button"
          onClick={() => switchMode("personal")}
          className={`py-1.5 px-2 rounded-lg transition-all ${
            activeMode === "personal"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Personal
        </button>
        <button
          type="button"
          onClick={() => switchMode("empresa")}
          className={`py-1.5 px-2 rounded-lg transition-all ${
            activeMode === "empresa"
              ? "bg-[#00A86B] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Empresa B2B
        </button>
      </div>

      {/* Nav Groups */}
      <div className="space-y-6 mt-5">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {group.group}
            </p>
            <div className="space-y-0.5 mt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#00A86B]/10 text-[#008755] font-extrabold border-l-4 border-[#00A86B]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#00A86B]" : "text-slate-400"}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#00A86B]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout button */}
      <div className="mt-8 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            logout();
            if (onItemClick) onItemClick();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
