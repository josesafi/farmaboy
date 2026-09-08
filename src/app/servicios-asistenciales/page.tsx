"use client";

import React, { useState } from "react";
import Link from "next/link";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";
import {
  HeartHandshake,
  Activity,
  ShieldCheck,
  AlertCircle,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { QuickContactCta } from "@/components/home/QuickContactCta";
import { AvailabilityModal } from "@/components/common/AvailabilityModal";

export default function ServiciosAsistencialesPage() {
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  const whatsappTension = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    farmaboyConfig.whatsappMessages.tension
  );

  return (
    <>
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#F1F5F9] to-white pt-12 pb-16 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary/10 text-secondary mb-4">
              Atención Primaria & Apoyo en Salud
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight">
              Servicios asistenciales y apoyo en salud en Boyacá
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Cuidado básico, acompañamiento humanizado y control preventivo orientados a mejorar la calidad de vida de las familias en nuestro departamento.
            </p>
          </div>
        </div>
      </section>

      {/* Servicios Asistenciales Generales */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-clinical-sm">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Orientación en Cuidado en Casa
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Asesoría práctica a cuidadores y familiares sobre el manejo de insumos básicos, curaciones simples y confort para pacientes en recuperación domiciliaria.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-clinical-sm">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Uso Responsable de Medicamentos
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Orientación sobre horarios, precauciones, almacenamiento adecuado y adherencia a las prescripciones autorizadas por el médico tratante.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-clinical-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Monitoreo Básico de Signos
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Mediciones preventivas no invasivas que permiten a los pacientes llevar un registro organizado para sus futuras consultas médicas.
              </p>
            </div>
          </div>

          {/* Subsección Especial: TOMA DE TENSIÓN ARTERIAL */}
          <div id="toma-tension" className="scroll-mt-24 rounded-3xl bg-gradient-to-br from-[#0B2545] to-[#07162C] text-white p-8 sm:p-12 lg:p-14 shadow-2xl border border-slate-700/60">
            <div className="max-w-3xl space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-400/20 text-teal-300 border border-teal-400/30">
                <Activity className="w-3.5 h-3.5" />
                <span>Servicio Preventivo Destacado</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Toma de tensión arterial
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Ofrecemos el servicio de medición rutinaria de presión arterial realizado con tensiómetros debidamente calibrados. Una herramienta fundamental para el autocuidado y seguimiento de pacientes en Boyacá.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-200 pt-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>Procedimiento rápido, higiénico y no invasivo</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>Entrega de registro escrito de los valores obtenidos</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>Recomendación de reposo previo a la medición</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>Orientación responsable para remitir al médico</span>
                </div>
              </div>

              {/* Sanitary Notice: NO diagnosis, NO medical cure */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                <AlertCircle className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-1">
                    Advertencia de Carácter Sanitario y Preventivo:
                  </strong>
                  <span>
                    La toma de tensión arterial es un servicio exclusivamente informativo y de monitoreo preventivo. En ningún caso constituye un diagnóstico médico clínico ni sustituye el criterio, consulta o tratamiento indicado por un médico profesional. Si presentas síntomas agudos o cifras fuera de los rangos normales, debes acudir al centro de salud de urgencias más cercano.
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <a
                  href={whatsappTension}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 rounded-xl bg-teal-400 text-slate-950 font-bold text-sm hover:bg-teal-300 shadow-clinical transition-all flex items-center justify-center gap-2 touch-target"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar disponibilidad por WhatsApp</span>
                </a>

                <Link
                  href="/contacto"
                  className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 flex items-center justify-center gap-2 transition-all touch-target"
                >
                  <span>Ver horarios y punto de atención</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Quick Contact CTA */}
      <QuickContactCta />

      {/* Modal */}
      <AvailabilityModal
        isOpen={isAvailabilityOpen}
        onClose={() => setIsAvailabilityOpen(false)}
        initialQuery="Toma de tensión arterial"
      />
    </>
  );
}
