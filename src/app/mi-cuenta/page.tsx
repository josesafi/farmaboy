"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import {
  Search,
  ShoppingBag,
  Heart,
  MapPin,
  Users,
  Award,
  FileText,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Ticket,
  Plus,
  ArrowRight,
  Check,
  ShieldCheck,
  Building2,
  CalendarClock,
} from "lucide-react";

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, orders, loyalty, coupons, favorites, activeMode } = useAuth();
  const { addItem, lifetimeDiscountPercentage, lifetimeDiscountReason } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAddToCart = (product: {
    id: string;
    name: string;
    price: number;
    priceDisplay?: string;
    imageUrl: string;
    category: string;
  }) => {
    addItem(product, 1);
    setAddedItemIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== product.id));
    }, 2500);
  };

  // Last active or recent order
  const latestOrder = orders.length > 0 ? orders[0] : null;

  // Recent purchased products for re-order carousel
  const recentPurchasedProducts = [
    {
      id: "prod-1",
      name: "Acetaminofén 500 mg (Caja x 100 Tab)",
      price: 12500,
      priceDisplay: "$12.500 COP",
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
      category: "Medicamentos",
      lastBought: "Comprado el 04 de Sep",
    },
    {
      id: "prod-3",
      name: "Suero Oral Electrolitos 500 ml (Manzana)",
      price: 8900,
      priceDisplay: "$8.900 COP",
      imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80",
      category: "Bienestar",
      lastBought: "Comprado el 04 de Sep",
    },
    {
      id: "prod-4",
      name: "Alcohol Antiséptico 70% 1000 ml",
      price: 14500,
      priceDisplay: "$14.500 COP",
      imageUrl: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=400&q=80",
      category: "Cuidado de la Salud",
      lastBought: "Comprado el 20 de Ago",
    },
    {
      id: "prod-2",
      name: "Ibuprofeno 800 mg (Caja x 30 Tab)",
      price: 16800,
      priceDisplay: "$16.800 COP",
      imageUrl: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=400&q=80",
      category: "Medicamentos",
      lastBought: "Comprado el 20 de Ago",
    },
  ];

  const quickPills = [
    { label: "Mis pedidos", href: "/mi-cuenta/pedidos", icon: ShoppingBag, count: orders.length, color: "text-[#00A86B] bg-[#00A86B]/10" },
    { label: "Favoritos", href: "/mi-cuenta/favoritos", icon: Heart, count: favorites.length, color: "text-rose-500 bg-rose-50" },
    { label: "Mis direcciones", href: "/mi-cuenta/direcciones", icon: MapPin, color: "text-blue-600 bg-blue-50" },
    { label: "Mi familia", href: "/mi-cuenta/familia", icon: Users, color: "text-purple-600 bg-purple-50" },
    { label: "Mis beneficios", href: "/mi-cuenta/beneficios", icon: Award, color: "text-amber-600 bg-amber-50" },
    { label: "Mis fórmulas", href: "/mi-cuenta/formulas", icon: FileText, color: "text-teal-600 bg-teal-50" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. HERO GREETING & SEARCH */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-[#00A86B] to-[#008755] p-6 sm:p-8 text-white shadow-lg shadow-[#00A86B]/15">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-100 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Espacio Personal Farmaboy Boyacá</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Hola, {user?.name || "Carlos"} 👋
          </h1>
          <p className="mt-1 text-sm sm:text-base text-emerald-100 font-medium">
            ¿Qué medicamento o producto de salud necesitas hoy?
          </p>

          {/* Quick Search in account */}
          <form onSubmit={handleSearchSubmit} className="mt-5 relative max-w-xl">
            <input
              type="text"
              placeholder="Buscar medicamentos, bienestar o cuidado personal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-white text-slate-800 text-sm font-medium shadow-md outline-none focus:ring-4 focus:ring-white/30 transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-xs transition-colors shadow-sm"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <div className="w-72 h-72 rounded-full bg-white blur-3xl absolute -right-10 -bottom-10" />
        </div>
      </div>

      {/* BANNER DESCUENTO VITALICIO DE CUENTA */}
      {lifetimeDiscountPercentage > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#00A86B] text-white shadow-xl shadow-emerald-600/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 text-white shadow-inner font-black text-lg">
              {lifetimeDiscountPercentage}%
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black tracking-tight">
                  Descuento Vitalicio de Cuenta ({lifetimeDiscountPercentage}% OFF)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-emerald-800">
                  De por vida
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                {lifetimeDiscountReason || "Tienes asignado un descuento permanente que se deduce automáticamente en todas tus compras de farmacia."}
              </p>
            </div>
          </div>
          <Link
            href="/productos"
            className="px-5 py-2.5 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs hover:bg-emerald-50 transition shadow-sm self-stretch sm:self-auto text-center shrink-0"
          >
            Comprar con Descuento
          </Link>
        </div>
      )}

      {/* 2. ACCIONES RÁPIDAS PILLS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Acciones Rápidas
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickPills.map((pill, idx) => {
            const Icon = pill.icon;
            return (
              <Link
                key={idx}
                href={pill.href}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-[#00A86B]/40 hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${pill.color} transition-transform group-hover:scale-105`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-[#00A86B] transition-colors">
                      {pill.label}
                    </span>
                  </div>
                  {typeof pill.count === "number" && (
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {pill.count} {pill.count === 1 ? "item" : "items"}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. ÚLTIMO PEDIDO CARD */}
      {latestOrder && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Último Pedido Activo
                </span>
                <OrderStatusBadge status={latestOrder.status} size="sm" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Pedido #{latestOrder.id}
              </h3>
              <p className="text-xs text-slate-500">
                Realizado el {new Date(latestOrder.date).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <Link
              href={`/mi-cuenta/pedidos/${latestOrder.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              <span>Ver seguimiento en vivo</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Products preview */}
            <div className="md:col-span-2 flex items-center gap-3 overflow-x-auto pb-1">
              {latestOrder.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-white overflow-hidden relative shrink-0 border border-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 max-w-[180px]">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">{item.quantity} un. • {item.unitPriceDisplay}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and destination */}
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Total a pagar / Pagado</span>
              <p className="text-xl font-black text-emerald-950">
                ${latestOrder.total.toLocaleString("es-CO")} COP
              </p>
              <p className="text-[11px] text-slate-600 truncate mt-0.5">
                Destino: {latestOrder.deliveryAddress.city}, {latestOrder.deliveryAddress.address}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. COMPRAR NUEVAMENTE CAROUSEL */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00A86B]/10 text-[#00A86B] flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Comprar Nuevamente
              </h2>
              <p className="text-xs text-slate-500">
                Tus medicamentos y productos habituales listos para pedir en un clic
              </p>
            </div>
          </div>
          <Link
            href="/mi-cuenta/comprar-nuevamente"
            className="text-xs font-bold text-[#00A86B] hover:text-[#008755] flex items-center gap-1 transition-colors"
          >
            <span>Ver historial de recompra</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentPurchasedProducts.map((product) => {
            const isAdded = addedItemIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="group p-3.5 rounded-2xl border border-slate-200/80 hover:border-[#00A86B]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden relative mb-3">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 250px"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-bold text-slate-600">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[32px]">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {product.lastBought}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-sm font-black text-slate-900">
                    {product.priceDisplay}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#00A86B] hover:bg-[#008755] text-white shadow-sm"
                    }`}
                    title="Agregar al carrito"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Listo</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Pedir</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. BENEFICIOS, CUPONES Y FIDELIZACIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nivel y Puntos FarmaBoy */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <Award className="w-3.5 h-3.5" />
                <span>Programa de Fidelización FarmaBoy</span>
              </div>
              <span className="text-xs font-bold text-slate-400">Nivel {loyalty.tier}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{loyalty.points}</span>
              <span className="text-xs font-bold text-slate-300">Puntos acumulados</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Equivalentes a approx. ${loyalty.availablePointsValueCOP.toLocaleString("es-CO")} COP en descuentos de farmacia.
            </p>

            {/* Progress bar to next tier */}
            <div className="mt-5">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                <span>Nivel {loyalty.tier}</span>
                <span>Faltan {loyalty.pointsToNextTier} pts para {loyalty.nextTier}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-[#00A86B] rounded-full w-[65%]" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between">
            <span className="text-xs text-slate-300">¿Quieres redimir beneficios?</span>
            <Link
              href="/mi-cuenta/beneficios"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Ver catálogo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Cupones Disponibles */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Ticket className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  Cupones para tu compra
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                {coupons.filter((c) => c.status === "DISPONIBLE").length} activos
              </span>
            </div>

            <div className="space-y-2.5">
              {coupons
                .filter((c) => c.status === "DISPONIBLE")
                .slice(0, 2)
                .map((coupon) => (
                  <div
                    key={coupon.id}
                    className="p-3 rounded-2xl bg-amber-50/40 border border-dashed border-amber-300 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                          {coupon.code}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          {coupon.discountDisplay}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Mínimo compra ${coupon.minPurchase.toLocaleString("es-CO")} COP • Vence {coupon.expiresAt}
                      </p>
                    </div>
                    <Link
                      href="/mi-cuenta/cupones"
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors"
                    >
                      Copiar
                    </Link>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Administra todos tus códigos</span>
            <Link
              href="/mi-cuenta/cupones"
              className="text-xs font-bold text-[#00A86B] hover:text-[#008755] flex items-center gap-1"
            >
              <span>Ver mis cupones</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
