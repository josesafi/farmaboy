"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { AccountSidebar } from "./AccountSidebar";
import { Menu, X, ChevronRight, LogIn, UserPlus, ShieldAlert, Sparkles, Building2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export const AccountLayoutWrapper: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, user, activeMode } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#00A86B]/10 text-[#00A86B] flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Acceso a Mi Cuenta Farmaboy
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Inicia sesión para gestionar tus pedidos, recetas médicas, direcciones de entrega en Boyacá y beneficios exclusivos.
          </p>
          <div className="mt-8 space-y-3">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-sm shadow-md shadow-[#00A86B]/20 transition-all active:scale-[0.99]"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar sesión</span>
            </Link>
            <Link
              href="/registro"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm transition-all"
            >
              <UserPlus className="w-4 h-4 text-slate-500" />
              <span>Crear cuenta nueva</span>
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-400">
            FarmaBoy • Boyacá, Colombia • Droguería Digital Segura
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70 min-h-screen pb-20">
      {/* Top Banner for Account Breadcrumbs & Mobile trigger */}
      <div className="bg-white border-b border-slate-200/80 sticky top-[60px] sm:top-[69px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-[#00A86B] font-semibold">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <Link href="/mi-cuenta" className="hover:text-[#00A86B] font-bold text-slate-800">
              Mi Cuenta Farmaboy
            </Link>
            {activeMode === "empresa" && (
              <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                <Building2 className="w-3 h-3 text-emerald-400" />
                Modo B2B
              </span>
            )}
          </div>

          {/* Mobile Drawer Trigger */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <>
                  <X className="w-4 h-4 text-slate-600" />
                  <span>Cerrar menú</span>
                </>
              ) : (
                <>
                  <Menu className="w-4 h-4 text-[#00A86B]" />
                  <span>Menú de cuenta</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Sidebar (cols 4) */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-28">
            <AccountSidebar />
          </div>

          {/* Mobile Drawer Slide / Modal */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-start p-4 animate-fadeIn">
              <div className="w-full max-w-xs bg-white rounded-3xl p-4 max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                  <span className="text-xs font-black uppercase text-slate-400">Navegación de Cuenta</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <AccountSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          )}

          {/* Main Workspace (cols 8 / 9) */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
};
