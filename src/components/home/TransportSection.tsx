import React from "react";
import Link from "next/link";
import Image from "next/image";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";
import { Ambulance, ArrowRight, ShieldCheck, MessageCircle, Heart, Check } from "lucide-react";

export const TransportSection: React.FC = () => {
  const whatsappTransport = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    farmaboyConfig.whatsappMessages.transporte
  );

  return (
    <section className="py-14 sm:py-18 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Visual representation */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 shadow-xs">
                <Image
                  src="/images/ambulancias.jpg"
                  alt="Servicio de transporte asistencial de pacientes INSERBOY en Boyacá"
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                  <span className="font-bold text-emerald-300 block text-[11px]">
                    Atención Programada en Boyacá
                  </span>
                  <span>Coordinación de traslados con acompañamiento humano</span>
                </div>
              </div>
            </div>

            {/* Right Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <Ambulance className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Servicio Especial de Apoyo</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Transporte asistencial
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Servicios de transporte asistencial con atención cercana y enfoque en la seguridad del paciente. Coordinamos traslados programados para citas médicas, controles periódicos y egresos hospitalarios en el departamento de Boyacá.
              </p>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700 pt-1">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00A86B] shrink-0" />
                  <span>Traslado coordinado con anticipación para mayor tranquilidad familiar.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00A86B] shrink-0" />
                  <span>Acompañamiento respetuoso y enfocado en el confort del paciente.</span>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/transporte-asistencial"
                  className="py-3 px-6 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors touch-target"
                >
                  <span>Conocer el servicio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={whatsappTransport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors touch-target"
                >
                  <MessageCircle className="w-4 h-4 text-[#00A86B]" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
