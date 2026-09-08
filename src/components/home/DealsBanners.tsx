import React from "react";
import { farmaboyConfig } from "@/config/farmaboy";
import { Tag, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

export const DealsBanners: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A86B] block mb-1">
              Oportunidades
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ofertas y promociones de la semana
            </h2>
          </div>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {farmaboyConfig.dealsBanners.map((deal) => (
            <div
              key={deal.id}
              className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-50 border border-emerald-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-3 relative z-10">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${deal.badgeColor}`}>
                  {deal.tag}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {deal.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
                  {deal.subtitle}
                </p>
              </div>

              <div className="pt-6 relative z-10">
                <a
                  href={deal.linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{deal.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
