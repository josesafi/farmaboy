"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AvailabilityModal } from "../common/AvailabilityModal";

export const MobileBottomBar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, orders } = useAuth();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const activeOrdersCount = orders.filter(
    (o) => o.status === "EN_CAMINO" || o.status === "PREPARANDO"
  ).length;

  return (
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe transition-all"
        aria-label="Navegación móvil Farmaboy"
      >
        <div className="relative max-w-md mx-auto grid grid-cols-5 px-1 py-1 text-center items-center min-h-[54px]">
          
          {/* 1. Inicio */}
          <Link
            href="/"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-xl touch-target transition-colors ${
              pathname === "/" ? "text-[#00A86B] font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Inicio</span>
          </Link>

          {/* 2. Catálogo */}
          <Link
            href="/productos"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-xl touch-target transition-colors ${
              pathname?.startsWith("/productos") || pathname?.startsWith("/categoria") ? "text-[#00A86B] font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Catálogo</span>
          </Link>

          {/* 3. Buscar */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="min-h-[44px] flex flex-col items-center justify-center py-1 rounded-xl text-slate-600 hover:text-slate-900 touch-target transition-colors"
          >
            <Search className="w-5 h-5 mb-0.5 text-slate-700" />
            <span className="text-[10px] leading-tight">Buscar</span>
          </button>

          {/* 4. Pedidos */}
          <Link
            href="/mi-cuenta/pedidos"
            className={`min-h-[44px] relative flex flex-col items-center justify-center py-1 rounded-xl touch-target transition-colors ${
              pathname.startsWith("/mi-cuenta/pedidos")
                ? "text-[#00A86B] font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingBag className="w-5 h-5 mb-0.5 text-slate-700" />
            {activeOrdersCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-[#00A86B] text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                {activeOrdersCount}
              </span>
            )}
            <span className="text-[10px] leading-tight">Pedidos</span>
          </Link>

          {/* 5. Cuenta */}
          <Link
            href={isAuthenticated ? "/mi-cuenta" : "/login"}
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-xl touch-target transition-colors ${
              pathname.startsWith("/mi-cuenta") && !pathname.startsWith("/mi-cuenta/pedidos")
                ? "text-[#00A86B] font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-5 h-5 mb-0.5 text-slate-700" />
            <span className="text-[10px] leading-tight">Cuenta</span>
          </Link>

        </div>
      </nav>

      {/* Modal para Buscar en Móvil */}
      <AvailabilityModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
