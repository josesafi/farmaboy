import React from "react";
import Link from "next/link";
import { farmaboyConfig } from "@/config/farmaboy";
import {
  PackageCheck,
  Ambulance,
  HeartHandshake,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  PackageCheck: <PackageCheck className="w-5 h-5" />,
  Ambulance: <Ambulance className="w-5 h-5" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
};

export const MuchMoreSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" />
            Nuestros Diferenciales
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Mucho más que una farmacia
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Además de encontrar productos para tu día a día, contamos con servicios y soluciones para personas, familias, empresas e instituciones en Boyacá.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {farmaboyConfig.muchMoreServices.map((srv) => (
            <div
              key={srv.id}
              className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs hover:border-[#00A86B] hover:bg-white hover:shadow-pharmacy transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-white shadow-xs text-[#00A86B] border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {iconMap[srv.icon]}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                    {srv.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                  {srv.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {srv.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href={srv.slug}
                  className="w-full py-2.5 px-3 rounded-xl bg-white group-hover:bg-[#00A86B] group-hover:text-white text-slate-700 border border-slate-200 group-hover:border-transparent font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>{srv.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
