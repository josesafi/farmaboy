import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  MapPin,
  MessageCircle,
  FileText,
  Briefcase,
  Award,
  Truck,
  HeartPulse,
  PackageCheck,
  Stethoscope,
  Sparkles,
  Phone,
  UserCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { QuickContactCta } from "@/components/home/QuickContactCta";

export const metadata: Metadata = {
  title: "Quiénes Somos | FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S.",
  description:
    "Conoce a FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S. Misión, visión, servicios integrales y datos tributarios oficiales de nuestra farmacia y distribuidora en Boyacá.",
};

export default function NosotrosPage() {
  const whatsappUrl = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    farmaboyConfig.whatsappMessages.general
  );

  const rut = farmaboyConfig.rutFiscal;

  const servicesIcons = [
    PackageCheck, // Insumos médicos y hospitalarios
    HeartPulse,   // Productos farmacéuticos y material médico-quirúrgico
    Stethoscope,  // Equipos y dispositivos médicos
    ShieldCheck,  // Bioseguridad y protección
    Building2,    // Clínicas, hospitales y particulares
    UserCheck,    // Asesoría personalizada
    FileText,     // Gestión eficiente y cotizaciones
    Clock,        // Oportunidad y cumplimiento
    Truck,        // Cobertura y abastecimiento departamental
  ];

  return (
    <>
      {/* 1. Hero Header Institucional */}
      <section className="bg-gradient-to-b from-[#F1F5F9] via-white to-white pt-12 pb-14 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Entidad Legal Constituida • NIT {farmaboyConfig.nit}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight">
              FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S.
            </h1>
            
            <p className="mt-4 text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
              {farmaboyConfig.subtagline}
            </p>

            {/* Quick Badges Bar */}
            <div className="mt-6 flex flex-wrap gap-2.5 text-xs text-slate-700">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-semibold">
                <Building2 className="w-3.5 h-3.5 text-secondary" />
                Matrícula Mercantil: {rut.matriculaMercantil}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                Sede Principal: Duitama, Boyacá
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-semibold">
                <FileText className="w-3.5 h-3.5 text-secondary" />
                Seccional DIAN: Sogamoso
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-semibold">
                <Phone className="w-3.5 h-3.5 text-secondary" />
                {farmaboyConfig.contact.phoneDisplay}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Razón de Ser y Fachada / Presentación */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span>Nuestra Vocación y Compromiso</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
                Salud integral con calidad, ética y cercanía humana
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                En <strong className="text-primary font-bold">FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S.</strong> entendemos la salud como un derecho fundamental que demanda máxima rigurosidad, calidez en la atención y oportunidad en cada suministro.
              </p>

              <p className="text-base text-slate-600 leading-relaxed">
                Desde nuestra sede en Duitama, Boyacá, articulamos una operación integral que atiende tanto las necesidades cotidianas de los hogares boyacenses como los requerimientos técnicos y de volumen de clínicas, hospitales, IPS y profesionales independientes de la salud.
              </p>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <Award className="w-4 h-4 text-secondary" />
                  <span>Garantía de Origen & Trazabilidad Sanitaria</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Todos nuestros medicamentos, insumos hospitalarios y dispositivos médicos cuentan con registro sanitario INVIMA vigente, almacenamiento bajo normatividad farmacéutica y despacho con cadena de custodia garantizada.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white font-bold text-sm shadow-clinical hover:bg-secondary-dark transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contactar con un Asesor Farmacéutico</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-clinical-lg border border-slate-200 aspect-[4/3] bg-slate-100 group">
                <img
                  src="/images/fachada-farmaboy.jpg"
                  alt="Sede física y droguería FARMABOY en Duitama, Boyacá"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                    Sede Operativa Duitama
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {farmaboyConfig.contact.address}
                  </p>
                  <p className="text-xs text-slate-300">
                    Atención presencial y despacho logístico para toda la región
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2.5. Nuestro Personal & Equipo Humano FarmaBoy */}
      <section className="py-16 bg-gradient-to-b from-white via-slate-50 to-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Nuestro Personal & Equipo de Salud
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Calidez humana, vocación y atención profesional
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Detrás de cada fórmula dispensada, cada medicamento entregado y cada asesoría en Farmaboy, está nuestro equipo humano: personas capacitadas, empáticas y comprometidas con cuidar la salud de tu familia e institución en Boyacá.
            </p>
          </div>

          {/* Grid of Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-stretch">
            
            {/* Miembro 1 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-clinical hover:shadow-clinical-lg transition-all duration-300 flex flex-col group">
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                <img
                  src="/images/personal-farmaboy-1.jpg"
                  alt="Personal de Atención Farmacéutica y Dispensación - Farmaboy Duitama"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                
                {/* Badges on image */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-bold text-[#04428B] shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                    Atención Farmacéutica
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00A86B] text-white text-[11px] font-extrabold shadow-sm">
                    ✓ Sede Duitama
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-black text-white drop-shadow-xs">
                    Dispensación & Orientación al Paciente
                  </h3>
                  <p className="text-xs text-emerald-300 font-bold mt-0.5">
                    FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S.
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Acompañamiento cercano en el mostrador y canales digitales para resolver dudas sobre posología, administración correcta de medicamentos de control y productos de venta libre con máxima calidez y respeto.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Verificación rigurosa de fórmulas médicas y fechas de vencimiento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Atención humanizada y confidencialidad en cada consulta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dispensación oportuna para familias y convenios institucionales</span>
                  </div>
                </div>

                <div className="pt-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-[#04428B] hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 text-xs font-bold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#00A86B]" />
                    <span>Consultar por WhatsApp con este equipo</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Miembro 2 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-clinical hover:shadow-clinical-lg transition-all duration-300 flex flex-col group">
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                <img
                  src="/images/personal-farmaboy-2.jpg"
                  alt="Personal de Asesoría Clínica y Dermocosmética - Farmaboy Duitama"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                
                {/* Badges on image */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-bold text-[#04428B] shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Asesoría Clínica & Insumos
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00A86B] text-white text-[11px] font-extrabold shadow-sm">
                    ✓ Sede Duitama
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-black text-white drop-shadow-xs">
                    Asesoría en Salud & Insumos Hospitalarios
                  </h3>
                  <p className="text-xs text-emerald-300 font-bold mt-0.5">
                    FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S.
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Especialistas en la gestión técnica de insumos hospitalarios, dispositivos médicos de diagnóstico, nutrición clínica y líneas avanzadas de dermocosmética y protección cutánea en Boyacá.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Conocimiento técnico en bioseguridad y material médico-quirúrgico</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Orientación especializada en fotoprotección y cuidado dermatológico</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Respaldo continuo a profesionales de la salud y particulares</span>
                  </div>
                </div>

                <div className="pt-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-[#04428B] hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 text-xs font-bold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#00A86B]" />
                    <span>Pedir orientación técnica personalizada</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Banner de Valores del Equipo */}
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-1">
                <span className="text-2xl font-black text-[#04428B]">100%</span>
                <p className="text-xs font-bold uppercase text-slate-700">Personal Certificado</p>
                <p className="text-xs text-slate-500">Formación continua en buenas prácticas de dispensación y normatividad sanitaria.</p>
              </div>
              <div className="space-y-1 border-y md:border-y-0 md:border-x border-slate-100 py-4 md:py-0">
                <span className="text-2xl font-black text-[#00A86B]">Duitama</span>
                <p className="text-xs font-bold uppercase text-slate-700">Atención en Sede y Domicilios</p>
                <p className="text-xs text-slate-500">Presencia física y despachos inmediatos a todos los municipios de Boyacá.</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-black text-[#FF6B00]">Ética & Cercanía</span>
                <p className="text-xs font-bold uppercase text-slate-700">Servicio Humanizado</p>
                <p className="text-xs text-slate-500">Cuidamos de ti con calidez, transparencia en precios y asesoría honesta.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Misión y Visión Oficiales */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary/10 text-secondary mb-3">
              Direccionamiento Estratégico
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Misión y Visión Institucional
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Los postulados que definen nuestro propósito diario y hacia dónde proyectamos el impacto de nuestros servicios.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Tarjeta Misión */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-clinical border border-slate-200 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full pointer-events-none -z-0" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-2xl shadow-sm">
                    M
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Propósito Actual
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-primary mb-4">
                  Nuestra Misión
                </h3>

                <p className="text-slate-700 text-base leading-relaxed text-justify">
                  &ldquo;{farmaboyConfig.mision}&rdquo;
                </p>
              </div>

              {/* Imagen oficial de Misión embebida */}
              <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                  <img
                    src="/images/mision-farmaboy.jpg"
                    alt="Misión Oficial FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S."
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Compromiso ético y humano al servicio de la salud</span>
                </div>
              </div>
            </div>

            {/* Tarjeta Visión */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-clinical border border-slate-200 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full pointer-events-none -z-0" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-2xl shadow-sm">
                    V
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                    Proyección Futura
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-primary mb-4">
                  Nuestra Visión
                </h3>

                <p className="text-slate-700 text-base leading-relaxed text-justify">
                  &ldquo;{farmaboyConfig.vision}&rdquo;
                </p>
              </div>

              {/* Imagen oficial de Visión embebida */}
              <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                  <img
                    src="/images/vision-farmaboy.jpg"
                    alt="Visión Oficial FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S."
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-sky-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Aliado estratégico líder a nivel departamental y nacional</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Portafolio de Servicios Oficiales (Los 9 Ejes) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary/10 text-secondary mb-3">
              Portafolio Integral
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Nuestros Servicios y Líneas de Suministro
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Abastecimiento integral, distribución farmacéutica y soluciones asistenciales con los más altos estándares de calidad.
            </p>
          </div>

          {/* Grid de 9 Servicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {farmaboyConfig.serviciosOficiales.map((servicio, index) => {
              const IconComponent = servicesIcons[index % servicesIcons.length];
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-secondary/40 shadow-clinical-sm hover:shadow-clinical transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors flex items-center justify-center shadow-sm">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-primary mb-2 leading-snug group-hover:text-secondary transition-colors">
                      {servicio}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Servicio garantizado por Farmaboy</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner visual oficial de Servicios */}
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-clinical-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Atención Integral B2B e Institucional
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  ¿Requieres cotización o suministro para tu IPS, clínica o empresa?
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Contamos con capacidad logística para despachos programados de material médico-quirúrgico, dispositivos de control, bioseguridad y medicamentos con facturación electrónica DIAN inmediata.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${farmaboyConfig.contact.whatsappClean}?text=${encodeURIComponent(farmaboyConfig.whatsappMessages.cotizacionB2B)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Cotizar por WhatsApp</span>
                  </a>
                  <Link
                    href="/empresas"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm border border-slate-700 hover:bg-slate-700 transition-all"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Módulo para Empresas</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-slate-800">
                  <img
                    src="/images/servicios-farmaboy.jpg"
                    alt="Portafolio de Servicios FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S."
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Certificado RUT & Datos Fiscales DIAN (Máxima Confianza Institucional) */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-clinical border border-slate-200">
            
            {/* Header del Certificado */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Registro Único Tributario (RUT) • Formulario 001 DIAN</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
                  Información Legal y Tributaria Oficial
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Transparencia corporativa y cumplimiento legal ante la Dirección de Impuestos y Aduanas Nacionales de Colombia.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="block text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Estado RUT</span>
                  <span className="block text-sm font-black text-emerald-700">ACTIVO / VIGENTE</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-center">
                  <span className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">NIT Oficial</span>
                  <span className="block text-sm font-black text-primary">{rut.nit}</span>
                </div>
              </div>
            </div>

            {/* Datos Principales en Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8 border-b border-slate-100 text-sm">
              
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Razón Social</span>
                <p className="font-bold text-primary">{rut.razonSocial}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tipo de Sociedad</span>
                <p className="font-semibold text-slate-800">{rut.tipoOrganizacion}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Matrícula Mercantil</span>
                <p className="font-semibold text-slate-800">{rut.matriculaMercantil}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Representación Legal</span>
                <p className="font-semibold text-slate-800">{rut.representanteLegal}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dirección Principal</span>
                <p className="font-semibold text-slate-800">{rut.direccionPrincipal}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ciudad & Departamento</span>
                <p className="font-semibold text-slate-800">{rut.ciudad}, {rut.departamento} (Cód. {rut.codigoMunicipioDian})</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Administración Seccional DIAN</span>
                <p className="font-semibold text-slate-800">{rut.seccionalDian}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Correo Electrónico Oficial</span>
                <p className="font-semibold text-slate-800">{rut.correoElectronico}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Línea Telefónica / WhatsApp</span>
                <p className="font-semibold text-slate-800">{rut.telefonoContacto}</p>
              </div>

            </div>

            {/* Actividades Económicas (CIIU) */}
            <div className="pt-8 space-y-4">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-secondary" />
                <span>Clasificación de Actividades Económicas (CIIU DIAN)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rut.actividadesCIIU.map((act) => (
                  <div key={act.codigo} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-primary/10 text-primary">
                        CIIU {act.codigo}
                      </span>
                      <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                        {act.tipo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {act.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsabilidades Tributarias */}
            <div className="pt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Responsabilidades y Calidades Tributarias Registradas
              </h3>
              <div className="flex flex-wrap gap-2">
                {rut.responsabilidadesTributarias.map((resp) => (
                  <span
                    key={resp.codigo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <span className="font-bold text-primary">{resp.codigo}</span>
                    <span>-</span>
                    <span>{resp.nombre}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Cobertura Departamental en Boyacá */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary mb-3">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              Presencia y Cobertura Regional
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-4">
              Despacho y Abastecimiento para Boyacá
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Con centro de operaciones en Duitama, cubrimos de forma eficiente y puntual los municipios del corredor industrial y provincias del departamento:
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {farmaboyConfig.coverageAreas.map((city) => (
                <span
                  key={city}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {city}
                </span>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
              <span>
                Para cotizaciones institucionales a municipios fuera de Boyacá, coordina con nuestra gerencia comercial para envíos nacionales certificados.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Quick Contact CTA */}
      <QuickContactCta />
    </>
  );
}
