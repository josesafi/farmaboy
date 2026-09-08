"use client";

import React, { useState } from "react";
import { MessageCircle, Phone, FileText, Sparkles } from "lucide-react";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl, getTelUrl } from "@/lib/utils";
import { QuoteModal } from "../common/QuoteModal";

export const QuickContactCta: React.FC = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const whatsappUrl = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    farmaboyConfig.whatsappMessages.general
  );
  const telUrl = getTelUrl(farmaboyConfig.contact.phone);

  return (
    <>
      <section className="py-14 sm:py-18 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-3xl bg-gradient-to-r from-emerald-600 via-[#00A86B] to-teal-700 p-8 sm:p-12 text-white text-center shadow-pharmacy-lg overflow-hidden">
            
            {/* Subtle decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-emerald-900/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Atención Rápida en Boyacá</span>
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                ¿Buscas medicamentos o productos para tu salud?
              </h2>

              <p className="text-sm sm:text-base text-emerald-50 max-w-lg mx-auto">
                Escríbenos o llámanos para verificar disponibilidad, enviar fórmulas médicas o coordinar entregas.
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-white text-[#008755] font-black text-sm hover:bg-emerald-50 shadow-sm transition-all flex items-center justify-center gap-2 touch-target active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>PEDIR POR WHATSAPP</span>
                </a>

                <a
                  href={telUrl}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-emerald-800/60 hover:bg-emerald-800 text-white font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2 touch-target"
                >
                  <Phone className="w-4 h-4" />
                  <span>LLAMAR AHORA</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-900/40 hover:bg-slate-900/60 text-white font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2 touch-target"
                >
                  <FileText className="w-4 h-4" />
                  <span>COTIZACIÓN B2B</span>
                </button>
              </div>

              <div className="pt-2 text-[11px] text-emerald-100">
                <span>Atención en Boyacá &middot; Tunja, Duitama, Sogamoso y municipios</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </>
  );
};
