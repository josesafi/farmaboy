"use client";

import React, { useState } from "react";
import { CheckCircle2, Building2, Send, Phone, Mail, User, Briefcase, Check } from "lucide-react";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";

export const B2BSection: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
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
    }, 500);
  };

  const whatsappMsg = `Hola Farmaboy, solicito cotización institucional para ${formData.empresa} a nombre de ${formData.nombre} (${formData.cargo}). Tel: ${formData.telefono}, Correo: ${formData.correo}. Requerimiento: ${formData.servicio}. Mensaje: ${formData.mensaje}`;
  const whatsappUrl = getWhatsAppUrl(farmaboyConfig.contact.whatsapp, whatsappMsg);

  return (
    <section id="empresas" className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encapsulated B2B Corporate Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0B2545] to-[#06172E] text-white p-8 sm:p-12 shadow-xl border border-slate-800 overflow-hidden relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Sector Institucional & B2B</span>
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Soluciones para empresas e instituciones
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Suministro de medicamentos, insumos hospitalarios y soluciones adaptadas a las necesidades de organizaciones en Boyacá.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Suministro institucional de medicamentos",
                  "Insumos hospitalarios y material descartable",
                  "Cotizaciones institucionales formales y oportunas",
                  "Atención personalizada con asesor comercial",
                  "Soluciones y despachos programados en Boyacá",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Accessible Form */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-6 text-slate-900 shadow-lg">
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Solicitar cotización institucional
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ingresa los datos de tu institución para enviarte una propuesta formal.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      ¡Cotización enviada con éxito!
                    </h4>
                    <p className="text-xs text-slate-600">
                      Nuestro departamento comercial institucional te contactará a la brevedad.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs text-emerald-700 underline font-semibold"
                    >
                      Enviar otra consulta
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Empresa o Institución *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nombre de la institución"
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Nombre de Contacto *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Tu nombre"
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Cargo *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Compras / Director"
                          value={formData.cargo}
                          onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="310 000 0000"
                          value={formData.telefono}
                          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Correo *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="correo@empresa.com"
                          value={formData.correo}
                          onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        ¿Qué necesita? *
                      </label>
                      <select
                        value={formData.servicio}
                        onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00A86B] outline-none bg-white"
                      >
                        <option value="Insumos hospitalarios y descartables">Insumos hospitalarios y descartables</option>
                        <option value="Suministro de medicamentos por volumen">Suministro de medicamentos por volumen</option>
                        <option value="Dispositivos y equipos médicos">Dispositivos y equipos médicos</option>
                        <option value="Convenio empresarial">Convenio empresarial integral</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50"
                    >
                      {loading ? <span>Enviando...</span> : <span>Solicitar cotización</span>}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
