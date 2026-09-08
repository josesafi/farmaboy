"use client";

import React, { useState } from "react";
import Image from "next/image";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl, getTelUrl } from "@/lib/utils";
import {
  Ambulance,
  Phone,
  MessageCircle,
  ShieldCheck,
  Clock,
  MapPin,
  Heart,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowRight,
  Send,
} from "lucide-react";
import { QuickContactCta } from "@/components/home/QuickContactCta";

export default function TransporteAsistencialPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    origen: "",
    destino: "",
    fecha: "",
    detalles: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola Farmaboy, requiero coordinar servicio de transporte asistencial para *${formData.nombre}*. Tel: ${formData.telefono}. Origen: ${formData.origen} -> Destino: ${formData.destino}. Fecha estimada: ${formData.fecha}. Detalles: ${formData.detalles}`;
    const url = getWhatsAppUrl(farmaboyConfig.contact.whatsapp, msg);
    window.open(url, "_blank");
    setIsSubmitted(true);
  };

  const whatsappTransport = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    farmaboyConfig.whatsappMessages.transporte
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#07162C] via-primary to-[#0E3360] text-white pt-14 pb-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-400/20 text-teal-300 border border-teal-400/30">
                <Ambulance className="w-3.5 h-3.5" />
                <span>Servicio de Traslado & Apoyo Asistencial</span>
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Transporte asistencial con atención profesional
              </h1>

              <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
                Acompañamos y movilizamos a pacientes que requieren traslados programados y asistidos con respeto, confort y altos estándares de cuidado en Boyacá.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <a
                  href="#solicitar-traslado"
                  className="py-3.5 px-6 rounded-xl bg-teal-400 text-slate-950 font-extrabold text-sm sm:text-base hover:bg-teal-300 shadow-clinical transition-all flex items-center justify-center gap-2 touch-target"
                >
                  <span>Solicitar servicio</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={whatsappTransport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 transition-all flex items-center justify-center gap-2 touch-target"
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span>Hablar con un asesor</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/3] bg-slate-800">
                <Image
                  src="https://images.unsplash.com/photo-1587745416684-47953f16f02f?q=80&w=1000&auto=format&fit=crop"
                  alt="Vehículo y equipo de transporte asistencial en Boyacá"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                  <span className="font-bold text-teal-300 block">
                    Atención Programada en Boyacá
                  </span>
                  <span>Coordinación ágil para familias y centros médicos</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Qué ofrece el servicio y cuándo solicitarlo */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary block mb-2">
              Modalidad & Cobertura
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary">
              ¿En qué situaciones solicitar nuestro transporte asistencial?
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Servicio orientado a garantizar el traslado seguro de pacientes que no se encuentran en emergencia crítica pero requieren movilización asistida:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-clinical-sm">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">
                Citas médicas y tratamientos programados
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Traslado puntual de pacientes desde su hogar hacia consultas con especialistas, terapias, hemodiálisis o estudios de diagnóstico en Boyacá.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-clinical-sm">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">
                Egresos hospitalarios y retorno a casa
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Movilización cómoda y asistida al momento de recibir el alta médica en clínicas u hospitales, brindando tranquilidad a la familia.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-clinical-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">
                Traslados interinstitucionales
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Movilización coordinada entre diferentes centros de salud o IPS para la continuidad de planes de atención en la región.
              </p>
            </div>
          </div>

          {/* Technical Specifications Placeholders - Clearly identified, no invented claims */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Especificaciones Técnicas del Servicio [Campos Editables para Farmaboy]</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              * Los detalles técnicos específicos (tipología de vehículos, personal sanitario a bordo, equipamiento a bordo y números de habilitación expedidos por la Secretaría de Salud de Boyacá) serán incorporados oficialmente una vez suministrados por la administración de la empresa.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-white block mb-1">Zona de Operación:</span>
                <span>Boyacá (Tunja, Duitama, Sogamoso y municipios vinculados)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-white block mb-1">Modalidad de Solicitud:</span>
                <span>Coordinación previa y programada</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-white block mb-1">Atención Humanizada:</span>
                <span>Enfoque en confort, empatía y respeto al paciente</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Formulario de Solicitud de Traslado */}
      <section id="solicitar-traslado" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-clinical border border-slate-200">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
                Coordinación Directa
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
                Solicitar coordinación de transporte asistencial
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Completa los datos del traslado para abrir un canal prioritario con nuestro coordinador de servicio.
              </p>
            </div>

            <form onSubmit={handleRequest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nombre del Paciente o Solicitante *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="310 000 0000"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Lugar de Origen (Municipio / Dirección) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Tunja - Barrio Las Nieves / Hospital"
                    value={formData.origen}
                    onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Lugar de Destino (Municipio / Clínica) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Duitama - Centro Médico"
                    value={formData.destino}
                    onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Fecha y Hora Estimada del Traslado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mañana 8:00 a.m. o Fecha específica"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Observaciones sobre la condición del paciente
                </label>
                <textarea
                  rows={3}
                  placeholder="Indica si requiere silla de ruedas, camilla o acompañamiento de familiar..."
                  value={formData.detalles}
                  onChange={(e) => setFormData({ ...formData, detalles: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-teal-500 text-slate-950 font-extrabold text-sm sm:text-base hover:bg-teal-400 shadow-clinical transition-all flex items-center justify-center gap-2 touch-target"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Solicitar coordinación por WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <QuickContactCta />
    </>
  );
}
