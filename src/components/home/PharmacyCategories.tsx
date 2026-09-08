"use client";

import React from "react";
import Link from "next/link";
import { farmaboyConfig } from "@/config/farmaboy";
import {
  Pill,
  Bandage,
  Sparkles,
  Bath,
  Baby,
  Smile,
  HeartPulse,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

const iconComponentMap: Record<string, React.ReactNode> = {
  Pill: <Pill className="w-5 h-5 text-emerald-600" />,
  Bandage: <Bandage className="w-5 h-5 text-amber-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-sky-600" />,
  Bath: <Bath className="w-5 h-5 text-blue-600" />,
  Baby: <Baby className="w-5 h-5 text-pink-600" />,
  Smile: <Smile className="w-5 h-5 text-purple-600" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-rose-600" />,
  PackageCheck: <PackageCheck className="w-5 h-5 text-teal-600" />,
};

export const PharmacyCategories: React.FC = () => {
  return (
    <section id="categorias" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A86B] block mb-1">
              Explora Nuestro Catálogo
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ¿Qué estás buscando?
            </h2>
          </div>

          <Link
            href="/productos"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#00A86B] hover:text-[#008755] transition-colors"
          >
            <span>Ver todo el catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories: Desktop 4x2 grid, Mobile horizontal scrollable carrousel */}
        <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 overflow-x-auto pb-4 sm:pb-0 no-scrollbar snap-x snap-mandatory">
          {farmaboyConfig.pharmacyCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.slug}
              className={`min-w-[200px] sm:min-w-0 snap-start flex-1 rounded-2xl p-4 sm:p-5 bg-gradient-to-br ${cat.bgGradient} border hover:border-[#00A86B] shadow-xs hover:shadow-pharmacy transition-all group select-none`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </div>
                {cat.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 text-slate-700 border border-slate-200/60">
                    {cat.badge}
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#00A86B] transition-colors mb-1">
                {cat.name}
              </h3>

              <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                {cat.description}
              </p>

              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#00A86B]">
                <span>Ver opciones</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile scroll indicator */}
        <div className="mt-3 flex items-center justify-center gap-1 sm:hidden text-[11px] text-slate-400">
          <span>&larr; Desliza horizontalmente para ver más categorías &rarr;</span>
        </div>

      </div>
    </section>
  );
};
