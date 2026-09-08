"use client";

import React, { useState } from "react";
import Image from "next/image";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";
import {
  PackageCheck,
  Building2,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  Send,
  Phone,
  Mail,
  User,
  Briefcase,
  Check,
  Stethoscope,
} from "lucide-react";
import { QuickContactCta } from "@/components/home/QuickContactCta";

export default function InsumosHospitalariosPage() {
  const [formData, setFormData] = useState({
    empresa: "",
    contacto: "",
    cargo: "",
    telefono: "",
    correo: "",
    categoria: "Material descartable hospitalario",
    detalles: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  const whatsappB2B = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    farmaboyConfig.whatsappMessages.cotizacionB2B
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#07162C] via-primary to-[#0A2E52] text-white pt-14 pb-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-400/20 text-teal-300 border border-teal-400/30 mb-4">
              <Building2 className="w-3.5 h-3.5" />
              <span>Suministro Institucional B2B</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Insumos hospitalarios y médicos en Boyacá
            </h1>
            <p className="mt-4 text-base sm:text-xl text-slate-300 leading-relaxed">
              Abastecimiento confiable de material médico-quirúrgico, descartables y bioseguridad para clínicas, hospitales, IPS y profesionales de salud en el departamento de Boyacá.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#formulario-cotizacion"
                className="py-3.5 px-6 rounded-xl bg-teal-400 text-slate-950 font-extrabold text-sm hover:bg-teal-300 shadow-clinical transition-all touch-target"
              >
                Solicitar cotización
              </a>
              <a
                href={whatsappB2B}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all touch-target"
              >
                Hablar con un asesor comercial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Qué suministramos y Para quién */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            
            {/* Qué suministramos */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Líneas de Producto
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
                ¿Qué suministramos a las entidades de salud?
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Centralizamos el aprovisionamiento de insumos de alta rotación para garantizar la continuidad operativa de tus servicios médicos:
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Material descartable y bioseguridad",
                    desc: "Guantes de nitrilo y látex, mascarillas quirúrgicas, gorros, batas descartables y polainas.",
                  },
                  {
                    title: "Suturas y elementos de curación",
                    desc: "Gasas estériles, apósitos especializados, compresas, vendas elásticas y cintas médicas.",
                  },
                  {
                    title: "Infusión y venoclisis",
                    desc: "Jeringas descartables, agujas hipodérmicas, catéteres intravenosos y equipos de infusión.",
                  },
                  {
                    title: "Antisépticos y desinfectantes hospitalarios",
                    desc: "Soluciones de clorhexidina, alcohol antiséptico, jabones quirúrgicos y desinfección de superficies.",
                  },
                  {
                    title: "Dispositivos médicos de soporte",
                    desc: "Tensiómetros, oxímetros, fonendoscopios, espéculos y material de diagnóstico menor.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <h3 className="font-bold text-primary text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Para quién */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Sectores Atendidos
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
                ¿Para quién está diseñado este servicio?
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Nuestras soluciones B2B se adaptan a la escala y requerimientos normativos de:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Clínicas privadas y centros quirúrgicos",
                  "Hospitales de la red departamental",
                  "Instituciones Prestadoras de Salud (IPS)",
                  "Consultorios médicos y odontológicos",
                  "Laboratorios clínicos y toma de muestras",
                  "Empresas con brigadas de primeros auxilios",
                  "Hogares de cuidado geriátrico",
                  "Entidades públicas con convenios de salud",
                ].map((sector, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/60 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-800">{sector}</span>
                  </div>
                ))}
              </div>

              {/* B2B Assurance Box */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3 mt-8">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Garantía de Suministro en Boyacá</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Ofrecemos despachos programados en Tunja, Duitama, Sogamoso y municipios aledaños con facturación electrónica y trazabilidad de lotes.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Formulario Comercial B2B In-Page */}
      <section id="formulario-cotizacion" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-clinical border border-slate-200">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary/10 text-secondary mb-2">
                Cotizaciones Institucionales
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
                Solicita una cotización formal de insumos
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Envíanos tu lista de requerimientos y un asesor comercial se comunicará para brindarte una propuesta personalizada.
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  ¡Requerimiento recibido con éxito!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Nuestro equipo de compras institucionales analizará las especificaciones enviadas para remitir la cotización formal.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark"
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Nombre de la Institución o Empresa *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Ej. Clínica Santa Sofía / IPS"
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Persona de Contacto *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Nombre y apellido"
                        value={formData.contacto}
                        onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Cargo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Jefe de Compras"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Teléfono / WhatsApp *
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
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="compras@clinica.com"
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Línea de Insumos Principal *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none bg-white"
                  >
                    <option value="Material descartable hospitalario">Material descartable hospitalario</option>
                    <option value="Suturas y curación">Suturas y elementos de curación</option>
                    <option value="Infusión y jeringas">Infusión, jeringas y catéteres</option>
                    <option value="Antisépticos y bioseguridad">Antisépticos y desinfectantes</option>
                    <option value="Dotación institucional completa">Dotación institucional periódica</option>
                    <option value="Otro insumo específico">Otro insumo médico específico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Detalle de los productos y cantidades requeridas *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe los ítems, calibres, cantidades estimadas o periodicidad requerida..."
                    value={formData.detalles}
                    onChange={(e) => setFormData({ ...formData, detalles: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-clinical transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 touch-target"
                  >
                    {loading ? (
                      <span>Enviando requerimiento...</span>
                    ) : (
                      <>
                        <span>Solicitar cotización formal</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Quick Contact CTA */}
      <QuickContactCta />
    </>
  );
}
