import React from "react";
import Image from "next/image";
import { farmaboyConfig } from "@/config/farmaboy";
import { CheckCircle2, Heart, ShieldCheck, UserCheck, MapPin } from "lucide-react";

export const TrustSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-slate-50/80 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00A86B] block mb-1">
            Nuestra Promesa
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Tu salud, con atención cercana
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Estamos comprometidos con brindarte una experiencia ágil, confiable y humana en cada visita o consulta en Boyacá.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: 4 Real qualitative pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {farmaboyConfig.trustPillars.map((pillar) => (
              <div
                key={pillar.number}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#00A86B] transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-black text-[#00A86B]">
                    {pillar.number}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#00A86B]" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Friendly pharmacy image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[1/1] bg-white border border-slate-200 shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=800&auto=format&fit=crop"
                alt="Atención farmacéutica y droguería cercana en Boyacá"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
                  Farmacia en Boyacá
                </span>
                <p className="text-sm font-semibold text-white/95">
                  Siempre listos para atenderte con calidez y orientación profesional
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
