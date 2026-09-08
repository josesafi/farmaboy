"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";
import {
  MessageCircle,
  Pill,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Heart,
} from "lucide-react";
import { AvailabilityModal } from "../common/AvailabilityModal";

import { useAdminStore } from "@/context/AdminStoreContext";

export const PharmacyHero: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { banners, siteDesign, storeSettings } = useAdminStore();

  const heroBanners = banners?.filter((b) => b.placement === "HERO_PRINCIPAL" && b.isActive) || [];
  const primaryBanner = heroBanners[0];

  const activeWhatsapp = storeSettings?.whatsapp || farmaboyConfig.contact.whatsapp;
  const whatsappComprar = getWhatsAppUrl(
    activeWhatsapp,
    "Hola Farmaboy, quiero hacer una consulta/pedido de farmacia en Boyacá."
  );

  const headline = primaryBanner?.title || "Tu farmacia de confianza en Boyacá";
  const subtitle =
    primaryBanner?.subtitle ||
    siteDesign?.tagline ||
    "Medicamentos, productos de cuidado personal, bienestar e insumos para tu hogar, con atención cercana y confiable.";
  const heroBadge = primaryBanner?.badge || "Droguería & Farmacia en Boyacá";
  const rawImageUrl = primaryBanner?.imageUrl;
  const heroImage =
    rawImageUrl && !rawImageUrl.includes("unsplash.com")
      ? rawImageUrl
      : "/images/fachada-farmaboy.jpg";

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F0FDF4]/70 via-white to-slate-50/50 pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-slate-100">
        {/* Soft decorative background circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Pharmacy Commercial Copy & Action CTAs */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-5 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-emerald-200 shadow-sm text-xs font-bold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-pharmacy" />
                <span>{heroBadge}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-normal">Atención Cercana</span>
              </div>

              {/* Main Headline: Clear Pharmacy Positioning */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black tracking-tight text-slate-900 leading-[1.15]">
                {headline}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {subtitle}
              </p>

              {/* Main CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={whatsappComprar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white font-extrabold text-sm sm:text-base shadow-pharmacy transition-all flex items-center justify-center gap-2.5 touch-target active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span>Comprar por WhatsApp</span>
                </a>

                <Link
                  href="/productos"
                  className="py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 touch-target"
                >
                  <Pill className="w-4 h-4 text-[#00A86B]" />
                  <span>Explorar catálogo</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Pharmacy trust pill checks */}
              <div className="pt-5 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border border-slate-200/60 shadow-xs">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Truck className="w-3.5 h-3.5" />
                  </span>
                  <span>Despachos en Boyacá</span>
                </div>

                <div className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border border-slate-200/60 shadow-xs">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                  <span>Fórmulas verificadas</span>
                </div>

                <div className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border border-slate-200/60 shadow-xs">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Heart className="w-3.5 h-3.5" />
                  </span>
                  <span>Atención cercana</span>
                </div>
              </div>

            </div>

            {/* Right Column: High Quality Pharmacy Visual */}
            <div className="lg:col-span-6 xl:col-span-6">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                
                {/* Main Pharmacy Visual Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-pharmacy-lg border border-slate-200/80 bg-white">
                  <div className="relative h-72 sm:h-96 w-full bg-slate-100">
                    <img
                      src={heroImage}
                      alt="Sede física y droguería moderna FARMABOY en Boyacá"
                      className="w-full h-full object-cover object-center"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                    
                    {/* Badge on image */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold shadow-sm flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-[#00A86B]" />
                        Farmacia & Cuidado Diario
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs uppercase tracking-wider font-bold text-emerald-300">
                        Atención en Boyacá
                      </p>
                      <p className="text-sm font-semibold text-white/95">
                        Encuentra tus medicamentos y productos de salud con facilidad
                      </p>
                    </div>
                  </div>

                  {/* Fast Action Ribbon under image */}
                  <div className="p-3.5 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between gap-3 text-xs text-emerald-900">
                    <div className="flex items-center gap-2 font-medium">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>¿Buscas un producto ahora?</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="font-bold text-[#00A86B] hover:underline flex items-center gap-1"
                    >
                      <span>Consultar aquí &rarr;</span>
                    </button>
                  </div>
                </div>

                {/* Floating Pharmacy Badge 1: Recetas médicas */}
                <div className="absolute -top-3 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-pharmacy border border-slate-200/90 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#00A86B] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Fórmulas Médicas</span>
                    <span className="text-[10px] text-slate-500">Envía foto por WhatsApp</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Search Modal */}
      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
