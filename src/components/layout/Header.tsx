"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  MapPin,
  MessageCircle,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { AvailabilityModal } from "../common/AvailabilityModal";
import { useAdminStore } from "@/context/AdminStoreContext";
import { LiveSearchBar } from "../catalog/LiveSearchBar";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { storeSettings } = useAdminStore();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setIsSearchModalOpen(true);
    }
  };

  const whatsappGeneral = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    farmaboyConfig.whatsappMessages.general
  );

  const categoryNavLinks = [
    { name: "Medicamentos", href: "/categoria/medicamentos" },
    { name: "Dermocosmética", href: "/categoria/dermocosmetica" },
    { name: "Cuidado Personal", href: "/categoria/cuidado-personal" },
    { name: "Vitaminas", href: "/categoria/vitaminas-y-suplementos" },
    { name: "Bebés", href: "/categoria/bebes" },
    { name: "Dispositivos", href: "/categoria/dispositivos-medicos" },
  ];

  const institutionalNavLinks = [
    { name: "Insumos hospitalarios", href: "/insumos-hospitalarios" },
    { name: "Servicios", href: "/servicios" },
  ];

  const subNavLinks = [
    { name: "Catálogo General", href: "/productos" },
    { name: "Ofertas 🔥", href: "/productos?cat=ofertas" },
    ...categoryNavLinks,
    ...institutionalNavLinks,
  ];

  // Display name for user pill
  const displayName = user?.name ? user.name.split(" ")[0] : "Ingresar";
  const displayInitial = user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />;

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-200 border-b border-slate-200/80 ${
          isScrolled ? "shadow-[0_4px_20px_-4px_rgba(4,66,139,0.08)]" : ""
        }`}
      >
        {/* Top Slim Brand Accent Line: Blue, Orange & Green */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#04428B] via-[#04428B] via-45% via-[#FF6B00] via-60% to-[#00A86B]" />

        {/* ROW 1: Clean & Modern Header with Blue & Orange Accents */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3 lg:gap-5">
            
            {/* 1. FarmaBoy Official Stethoscope Logo */}
            <div className="shrink-0">
              <Link
                href="/"
                className="inline-flex items-center group focus:outline-none select-none"
                aria-label="FARMABOY - Farmacia y Droguería"
              >
                <div className="relative flex items-center justify-center p-0.5 transition-transform duration-200 group-hover:scale-[1.02]">
                  <img
                    src="/images/logo-farmaboy.png"
                    alt="FARMABOY"
                    className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-xs"
                    loading="eager"
                  />
                </div>
              </Link>
            </div>

            {/* 2. Centered Live Search Bar with Dual Ring Capsule (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl xl:max-w-2xl mx-1 lg:mx-3">
              <LiveSearchBar />
            </div>

            {/* 3. Action Badges with Blue & Orange Branding */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
              
              {/* Badge 1: ENTREGA EN / Duitama (Orange MapPin + Navy Text) */}
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs shadow-2xs transition-colors cursor-default select-none"
                title="Cobertura de entregas en Duitama y municipios de Boyacá"
              >
                <MapPin className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <div className="text-left leading-tight">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider leading-none">
                    ENTREGA EN
                  </span>
                  <span className="font-extrabold text-[#04428B] text-xs leading-tight">
                    Duitama
                  </span>
                </div>
              </div>

              {/* Badge 2: User Account (Green circle avatar + Carlos / User name) */}
              <Link
                href={isAuthenticated ? "/mi-cuenta" : "/login"}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-bold text-slate-800 shadow-2xs transition-colors group"
                title={isAuthenticated ? `Mi perfil: ${user?.name}` : "Ingresar o crear cuenta"}
              >
                <div className="w-6 h-6 rounded-full bg-[#00A86B] group-hover:bg-[#008f5a] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs transition-colors">
                  {displayInitial}
                </div>
                <span className="font-bold text-slate-800 max-w-[90px] truncate">
                  {displayName}
                </span>
              </Link>

              {/* Badge 3: Mi pedido (Blue Bag icon + Orange Notification Count Badge) */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-bold text-slate-800 shadow-2xs transition-colors group"
                title="Abrir resumen de pedido y carrito"
              >
                <ShoppingBag className="w-4 h-4 text-[#00A86B] group-hover:text-[#04428B] transition-colors shrink-0" />
                <span className="font-bold text-slate-800">Mi pedido</span>
                <span className="w-5 h-5 rounded-full bg-[#00A86B] text-white text-[10px] font-black flex items-center justify-center -mr-1 shadow-xs">
                  {totalItems > 0 ? totalItems : 3}
                </span>
              </button>

              {/* Badge 4: WhatsApp Button (Vibrant Green Pill) */}
              <a
                href={whatsappGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00A86B] hover:bg-[#008f5a] text-white text-xs font-extrabold shadow-xs hover:shadow-sm active:scale-95 transition-all"
                title="Chatear con droguería Farmaboy por WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

            </div>

            {/* Mobile Actions: Cart + Search Modal + Menu */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] active:bg-orange-100"
                aria-label="Abrir carrito"
              >
                <ShoppingBag className="w-5 h-5 text-[#04428B]" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF6B00] text-white text-[9px] font-black flex items-center justify-center">
                  {totalItems > 0 ? totalItems : 3}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-[#04428B] active:bg-slate-200"
                aria-label="Buscar productos"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-800 active:bg-slate-200"
                aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Mobile Search Bar row */}
          <div className="mt-2 md:hidden">
            <LiveSearchBar isMobile={true} />
          </div>
        </div>

        {/* ROW 2: Clean, Light & Modern Category Navigation (Desktop) */}
        <div className="hidden md:block bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-1.5 gap-3">
              
              {/* Left: Scrollable Clean Category & Service Links */}
              <nav className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
                {/* Catálogo button with Blue accent */}
                <Link
                  href="/productos"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 whitespace-nowrap ${
                    pathname === "/productos"
                      ? "bg-[#04428B] text-white font-bold shadow-2xs"
                      : "bg-slate-50 text-slate-700 hover:text-[#04428B] hover:bg-blue-50/70 border border-slate-200/80 shadow-2xs"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-current" />
                  <span>Catálogo</span>
                </Link>

                {/* Ofertas destacadas with Warm Orange accent */}
                <Link
                  href="/productos?cat=ofertas"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all shrink-0 whitespace-nowrap bg-orange-50/90 text-[#EA580C] hover:bg-orange-100 font-bold border border-orange-200 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                  <span>Ofertas 🔥</span>
                </Link>

                {/* Retail Pharmacy Categories with Blue hover */}
                {categoryNavLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-2.5 py-1.5 rounded-xl transition-colors shrink-0 whitespace-nowrap ${
                        isActive
                          ? "bg-blue-50 text-[#04428B] font-bold"
                          : "text-slate-600 hover:text-[#04428B] hover:bg-slate-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                {/* Subtle Divider */}
                <div className="h-3.5 w-px bg-slate-200 mx-1 shrink-0 hidden xl:block" />

                {/* Institutional & B2B links */}
                {institutionalNavLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-2.5 py-1.5 rounded-xl transition-colors shrink-0 whitespace-nowrap ${
                        isActive
                          ? "bg-blue-50 text-[#04428B] font-bold"
                          : "text-slate-500 hover:text-[#04428B] hover:bg-slate-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Right: Live Status Pill for Duitama */}
              <div className="shrink-0 pl-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shrink-0 whitespace-nowrap shadow-2xs">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Farmacia abierta hoy en Duitama</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <img
                  src="/images/logo-farmaboy.png"
                  alt="FARMABOY"
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile User & Duitama Status */}
            <div className="p-4 space-y-2.5">
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#04428B] text-white flex items-center justify-center text-xs font-black">
                    {displayInitial}
                  </div>
                  <span className="text-slate-800">Hola, {displayName}</span>
                </div>
                <Link
                  href={isAuthenticated ? "/mi-cuenta" : "/login"}
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] text-[#04428B] font-bold hover:underline"
                >
                  {isAuthenticated ? "Mi cuenta" : "Entrar"}
                </Link>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-orange-50/80 border border-orange-200 text-orange-950 text-xs font-bold flex items-center gap-2 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                <span>Entrega y despacho desde Duitama</span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="px-4 py-2 space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Categorías de Farmacia
              </p>
              {subNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-[#04428B] transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                <Link
                  href={isAuthenticated ? "/mi-cuenta" : "/login"}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-[#04428B]"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#04428B]" />
                    <span>{isAuthenticated ? `Mi Espacio (${displayName})` : "Iniciar Sesión / Mi Cuenta"}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  href="/nosotros"
                  className="block px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#04428B]"
                >
                  Quiénes Somos
                </Link>
                <Link
                  href="/contacto"
                  className="block px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#04428B]"
                >
                  Contacto & Sede
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2 pb-safe">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#04428B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
              >
                <ShoppingBag className="w-4 h-4 text-[#FF6B00]" />
                <span>Ver Mi Carrito ({totalItems > 0 ? totalItems : 3})</span>
              </button>
              <a
                href={whatsappGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-[#04428B] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#00A86B]" />
                <span>WhatsApp Farmaboy</span>
              </a>
              <div className="text-center text-[11px] text-slate-500 pt-1">
                Línea Boyacá: <span className="font-bold text-slate-700">{storeSettings?.phoneDisplay || farmaboyConfig.contact.phoneDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Live Search Modal Overlay */}
      {isSearchModalOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-start p-3 pt-12 sm:pt-16 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsSearchModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-4 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-[#04428B] flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#FF6B00]" />
                Buscador en vivo FarmaBoy
              </span>
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Cerrar búsqueda"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <LiveSearchBar
              autoFocus={true}
              isMobile={true}
              onSelect={() => setIsSearchModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
