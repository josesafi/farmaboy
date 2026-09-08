"use client";

import React, { useState } from "react";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl, getTelUrl } from "@/lib/utils";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  User,
  Compass,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

export default function ContactoPage() {
  const [activeTab, setActiveTab] = useState<"particular" | "empresa">("particular");

  // Form particular state
  const [particularData, setParticularData] = useState({
    nombre: "",
    telefono: "",
    servicio: "Medicamentos y farmacia",
    mensaje: "",
  });
  const [particularSubmitted, setParticularSubmitted] = useState(false);

  // Form empresa state
  const [empresaData, setEmpresaData] = useState({
    empresa: "",
    nombre: "",
    cargo: "",
    telefono: "",
    correo: "",
    servicio: "Insumos hospitalarios",
    mensaje: "",
  });
  const [empresaSubmitted, setEmpresaSubmitted] = useState(false);

  const whatsappUrl = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    farmaboyConfig.whatsappMessages.general
  );
  const whatsappSecondaryUrl = getWhatsAppUrl(
    farmaboyConfig.contact.secondaryPhone || "573212651303",
    farmaboyConfig.whatsappMessages.general
  );
  const telUrl = getTelUrl(farmaboyConfig.contact.phone);
  const telSecondaryUrl = getTelUrl(farmaboyConfig.contact.secondaryPhone || "+573212651303");

  const handleParticularSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParticularSubmitted(true);
  };

  const handleEmpresaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmpresaSubmitted(true);
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-[#F1F5F9] to-white pt-12 pb-16 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary/10 text-secondary mb-4">
              Atención Directa
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight">
              Contacto y Ubicación en Boyacá
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Estamos a tu disposición para orientarte sobre medicamentos, insumos hospitalarios o coordinar servicios asistenciales. Comunícate a través de nuestros canales oficiales.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Direct Info Cards & Quick Action Buttons */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Canales de Comunicación
                </h2>
                <p className="text-sm text-slate-600">
                  Selecciona la vía más cómoda para comunicarte con nuestro equipo.
                </p>
              </div>

              {/* Prominent Quick Action Buttons */}
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm sm:text-base flex items-center justify-between shadow-clinical transition-all touch-target"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6" />
                    <div className="text-left">
                      <span className="block text-xs uppercase tracking-wider opacity-90">Línea Principal WhatsApp</span>
                      <span className="block font-black">+57 313 427 9559</span>
                    </div>
                  </div>
                  <span className="text-xs bg-white/20 px-2.5 py-1 rounded-lg">Chatear &rarr;</span>
                </a>

                <a
                  href={whatsappSecondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-between shadow-clinical transition-all touch-target"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6" />
                    <div className="text-left">
                      <span className="block text-xs uppercase tracking-wider opacity-90">Línea Alterna WhatsApp / Llamadas</span>
                      <span className="block font-black">+57 321 265 1303</span>
                    </div>
                  </div>
                  <span className="text-xs bg-white/20 px-2.5 py-1 rounded-lg">Chatear &rarr;</span>
                </a>

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={telUrl}
                    className="p-3.5 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-clinical transition-all touch-target"
                  >
                    <Phone className="w-4 h-4 text-teal-300 shrink-0" />
                    <span className="truncate">Llamar 313 427 9559</span>
                  </a>
                  <a
                    href={telSecondaryUrl}
                    className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-clinical transition-all touch-target"
                  >
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">Llamar 321 265 1303</span>
                  </a>
                </div>

                <a
                  href="#mapa-ubicacion"
                  className="w-full p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-between transition-all touch-target"
                >
                  <div className="flex items-center gap-3">
                    <Compass className="w-5 h-5 text-secondary" />
                    <div className="text-left">
                      <span className="block text-[11px] uppercase tracking-wider text-slate-500">Dirección Sede Duitama</span>
                      <span className="block font-bold text-primary">Transversal 29 # 10-63</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">&darr; Ver mapa</span>
                </a>
              </div>

              {/* Contact Details List */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-primary block">Correos Institucionales:</span>
                    <span className="text-xs text-slate-600 block">General: {farmaboyConfig.contact.emailGeneral}</span>
                    <span className="text-xs text-slate-600 block">Empresas: {farmaboyConfig.contact.emailB2B}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-primary block">Dirección en Boyacá:</span>
                    <span className="text-xs text-slate-600">{farmaboyConfig.contact.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-primary block">Horarios de Atención:</span>
                    <span className="text-xs text-slate-600">{farmaboyConfig.contact.operatingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-primary block">RUT y Razón Social Oficial:</span>
                    <span className="text-xs text-slate-700 block font-semibold">{farmaboyConfig.legalName}</span>
                    <span className="text-xs text-slate-500 block">NIT: {farmaboyConfig.nit} • Matrícula: {farmaboyConfig.matriculaMercantil} • DIAN Sogamoso</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Tabbed Contact Form (Particulares / Empresas) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-clinical border border-slate-200">
                
                {/* Form Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                  <button
                    type="button"
                    onClick={() => setActiveTab("particular")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all touch-target ${
                      activeTab === "particular"
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Soy Particular
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("empresa")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all touch-target ${
                      activeTab === "empresa"
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Soy una Empresa / IPS
                  </button>
                </div>

                {/* TAB 1: FORM PARTICULAR */}
                {activeTab === "particular" && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-primary">¿Cómo podemos ayudarte?</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Déjanos tu mensaje y te responderemos por llamada o WhatsApp.
                      </p>
                    </div>

                    {particularSubmitted ? (
                      <div className="text-center py-8 space-y-3">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-bold text-primary">¡Mensaje enviado con éxito!</h4>
                        <p className="text-xs text-slate-600">
                          Un asesor se comunicará contigo al teléfono suministrado.
                        </p>
                        <button
                          type="button"
                          onClick={() => setParticularSubmitted(false)}
                          className="text-xs font-semibold text-secondary underline"
                        >
                          Enviar otro mensaje
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleParticularSubmit} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Tu Nombre Completo *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Nombre y apellido"
                            value={particularData.nombre}
                            onChange={(e) => setParticularData({ ...particularData, nombre: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Teléfono / Celular *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="310 000 0000"
                            value={particularData.telefono}
                            onChange={(e) => setParticularData({ ...particularData, telefono: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Servicio de Interés *
                          </label>
                          <select
                            value={particularData.servicio}
                            onChange={(e) => setParticularData({ ...particularData, servicio: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none bg-white"
                          >
                            <option value="Medicamentos y farmacia">Medicamentos y farmacia</option>
                            <option value="Insumos para cuidado en casa">Insumos para cuidado en casa</option>
                            <option value="Transporte asistencial">Transporte asistencial</option>
                            <option value="Toma de tensión arterial">Toma de tensión arterial</option>
                            <option value="Otro servicio">Otro servicio</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Mensaje o Consulta *
                          </label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Escribe aquí tu consulta sobre productos o servicios..."
                            value={particularData.mensaje}
                            onChange={(e) => setParticularData({ ...particularData, mensaje: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 px-4 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-clinical transition-all flex items-center justify-center gap-2 touch-target"
                        >
                          <Send className="w-4 h-4" />
                          <span>Enviar mensaje</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* TAB 2: FORM EMPRESA */}
                {activeTab === "empresa" && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-primary">Solicitar cotización institucional</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Atención prioritaria para clínicas, IPS, empresas e instituciones en Boyacá.
                      </p>
                    </div>

                    {empresaSubmitted ? (
                      <div className="text-center py-8 space-y-3">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-bold text-primary">¡Cotización radicada!</h4>
                        <p className="text-xs text-slate-600">
                          Un asesor comercial se comunicará a la brevedad.
                        </p>
                        <button
                          type="button"
                          onClick={() => setEmpresaSubmitted(false)}
                          className="text-xs font-semibold text-secondary underline"
                        >
                          Enviar otra solicitud
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleEmpresaSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                              Empresa o Institución *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Nombre de la institución"
                              value={empresaData.empresa}
                              onChange={(e) => setEmpresaData({ ...empresaData, empresa: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                              Nombre del Contacto *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Tu nombre"
                              value={empresaData.nombre}
                              onChange={(e) => setEmpresaData({ ...empresaData, nombre: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                            />
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
                              placeholder="Compras / Directivo"
                              value={empresaData.cargo}
                              onChange={(e) => setEmpresaData({ ...empresaData, cargo: e.target.value })}
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
                              value={empresaData.telefono}
                              onChange={(e) => setEmpresaData({ ...empresaData, telefono: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                              Correo *
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="correo@empresa.com"
                              value={empresaData.correo}
                              onChange={(e) => setEmpresaData({ ...empresaData, correo: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Tipo de Requerimiento *
                          </label>
                          <select
                            value={empresaData.servicio}
                            onChange={(e) => setEmpresaData({ ...empresaData, servicio: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none bg-white"
                          >
                            <option value="Insumos hospitalarios">Insumos hospitalarios y descartables</option>
                            <option value="Suministro de medicamentos">Suministro de medicamentos por volumen</option>
                            <option value="Transporte asistencial institucional">Transporte asistencial institucional</option>
                            <option value="Convenio corporativo integral">Convenio corporativo integral</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Mensaje o especificaciones
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Detalla cantidades estimadas o líneas requeridas..."
                            value={empresaData.mensaje}
                            onChange={(e) => setEmpresaData({ ...empresaData, mensaje: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-secondary outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 px-4 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-clinical transition-all flex items-center justify-center gap-2 touch-target"
                        >
                          <Send className="w-4 h-4" />
                          <span>Solicitar cotización formal</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Google Maps Location Section */}
      <section id="mapa-ubicacion" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
              Georreferenciación en Boyacá
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
              Cómo llegar a nuestra sede
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Punto de referencia para atención presencial y coordinación logística en Boyacá.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-clinical border border-slate-200 aspect-[16/9] sm:aspect-[21/9] bg-slate-200">
            <iframe
              src={farmaboyConfig.contact.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Farmaboy en Boyacá"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
