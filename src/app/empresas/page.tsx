"use client";

import React, { useState } from "react";
import Image from "next/image";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";
import {
  Building2,
  PackageCheck,
  Ambulance,
  Pill,
  ShieldCheck,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Briefcase,
  FileCheck,
  Clock,
  Check,
} from "lucide-react";
import { QuickContactCta } from "@/components/home/QuickContactCta";

export default function EmpresasPage() {
  const [formData, setFormData] = useState({
    empresa: "",
    nombre: "",
    cargo: "",
    telefono: "",
    correo: "",
    servicio: "Insumos hospitalarios y descartables",
    mensaje: "",
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
              <span>División Corporativa & Convenios</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Soluciones para empresas e instituciones de salud en Boyacá
            </h1>
            <p className="mt-4 text-base sm:text-xl text-slate-300 leading-relaxed">
              Apoyamos a clínicas, hospitales, IPS, empresas y entidades públicas con suministro integral de medicamentos, insumos hospitalarios y logística asistencial confiable.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#formulario-empresas"
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
                Hablar con un asesor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modelos de Solución para Entidades */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary block mb-2">
              Líneas B2B Especializadas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">
              ¿Cómo apoyamos la operación de tu organización?
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Desarrollamos esquemas de atención comercial flexibles y diseñados para responder a los flujos operativos de Boyacá.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-clinical-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  Insumos Hospitalarios y Descartables
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Abastecimiento regular de bioseguridad, guantes, material de curación, jeringas y suturas para áreas de consulta, cirugía y hospitalización.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-secondary" />
                    <span>Lotes con trazabilidad y fichas técnicas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-secondary" />
                    <span>Despachos programados sin roturas de stock</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-clinical-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Pill className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  Suministro Farmacéutico Institucional
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Dispensación y abastecimiento por volumen de medicamentos esenciales y tratamientos continuos bajo estricta normatividad sanitaria.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-secondary" />
                    <span>Manejo riguroso de cadena de frío cuando aplique</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-secondary" />
                    <span>Facturación institucional ágil y transparente</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-clinical-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-6">
                  <Ambulance className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  Convenios de Transporte Asistencial
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Acuerdos corporativos para el traslado asistido de colaboradores, usuarios de aseguradoras o traslados interinstitucionales en Boyacá.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-secondary" />
                    <span>Prioridad de coordinación programada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-secondary" />
                    <span>Reportes de servicio y soporte documental</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Formulario B2B Dedicado */}
      <section id="formulario-empresas" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-clinical border border-slate-200">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary/10 text-secondary mb-2">
                Atención Comercial Inmediata
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
                Inicia un contacto institucional con Farmaboy
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Cuéntanos los requerimientos de tu entidad y un ejecutivo comercial te presentará nuestra propuesta operativa.
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  ¡Solicitud institucional radicada!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Agradecemos el interés en Farmaboy. Nuestro equipo comercial se comunicará a la mayor brevedad posible.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark"
                  >
                    Hacer otra consulta
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Nombre de la Empresa o Institución *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Ej. Clínica / IPS / Consultorio"
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Nombre del Contacto *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Tu nombre completo"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                      placeholder="Ej. Gerente / Compras"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Teléfono *
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
                      Correo Corporativo *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contacto@institucion.com"
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    ¿Qué necesita? *
                  </label>
                  <select
                    value={formData.servicio}
                    onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none bg-white"
                  >
                    <option value="Insumos hospitalarios y descartables">Insumos hospitalarios y descartables</option>
                    <option value="Suministro de medicamentos institucionales">Suministro de medicamentos institucionales</option>
                    <option value="Convenio de transporte asistencial">Convenio de transporte asistencial</option>
                    <option value="Dispositivos y equipos médicos">Dispositivos y equipos médicos</option>
                    <option value="Solución integral corporativa">Solución integral corporativa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mensaje o detalle del requerimiento
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe los productos requeridos, volúmenes de entrega o plazos institucionales..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
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
                      <span>Radicando solicitud...</span>
                    ) : (
                      <>
                        <span>Solicitar cotización</span>
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
