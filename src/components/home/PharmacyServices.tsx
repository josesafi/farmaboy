import React from "react";
import Link from "next/link";
import { farmaboyConfig } from "@/config/farmaboy";
import { Activity, Pill, Truck, ArrowRight, HeartHandshake } from "lucide-react";

export const PharmacyServices: React.FC = () => {
  return (
    <section className="py-14 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00A86B] block mb-1">
            Atención al Usuario
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Servicios en nuestra droguería
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Pensados para facilitar tu bienestar y el cuidado diario de tu familia en Boyacá.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {farmaboyConfig.pharmacyDailyServices.map((srv, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#00A86B] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#00A86B] flex items-center justify-center mb-4">
                  {srv.icon === "Activity" && <Activity className="w-5 h-5" />}
                  {srv.icon === "Pill" && <Pill className="w-5 h-5" />}
                  {srv.icon === "Truck" && <Truck className="w-5 h-5" />}
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 mb-2 inline-block">
                  {srv.badge}
                </span>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {srv.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {srv.desc}
                </p>
              </div>

              <Link
                href={srv.link}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00A86B] hover:text-[#008755]"
              >
                <span>Saber más</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
