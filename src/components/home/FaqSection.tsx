"use client";

import React, { useState } from "react";
import { farmaboyConfig } from "@/config/farmaboy";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const whatsappUrl = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    farmaboyConfig.whatsappMessages.general
  );

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#00A86B]" />
            Dudas Frecuentes
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Preguntas sobre nuestra farmacia
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Todo lo que necesitas saber para comprar medicamentos o solicitar suministros en Boyacá.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {farmaboyConfig.faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 touch-target"
                  aria-expanded={isOpen}
                >
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    {faq.question}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#00A86B] text-white" : "text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="mt-8 text-center text-xs text-slate-600">
          <span>¿Tienes otra pregunta sobre un medicamento? </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#00A86B] hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5 inline" />
            <span>Escríbenos directamente por WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
