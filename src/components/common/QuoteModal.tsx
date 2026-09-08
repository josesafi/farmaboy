"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2, Building2, Phone, Mail, User, Briefcase, FileText, MessageCircle } from "lucide-react";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  defaultService = "Insumos hospitalarios",
}) => {
  const [formData, setFormData] = useState({
    empresa: "",
    nombre: "",
    cargo: "",
    telefono: "",
    correo: "",
    servicio: defaultService,
    mensaje: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate reliable form submission
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  const formattedWhatsAppMsg = `Hola equipo Farmaboy, solicito cotización para la empresa *${formData.empresa || "Institución"}* a nombre de *${formData.nombre}* (${formData.cargo}). Requerimiento: *${formData.servicio}*. Contacto: ${formData.telefono} / ${formData.correo}. Detalles: ${formData.mensaje}`;

  const directWhatsAppUrl = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    formattedWhatsAppMsg
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-primary to-[#0E3A68] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              Atención Institucional & B2B
            </span>
            <h3 id="quote-modal-title" className="text-xl font-bold">
              Solicitar Cotización Formal
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors touch-target flex items-center justify-center"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-primary">
                ¡Solicitud Registrada Exitosamente!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Un asesor del área de suministros y convenios de Farmaboy revisará tu requerimiento y se comunicará a los datos suministrados.
              </p>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1EBE5D] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar copia por WhatsApp de una vez</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Completa este formulario para recibir una propuesta comercial ajustada a las necesidades de tu clínica, empresa o consultorio en Boyacá.
              </p>

              {/* Empresa */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Empresa o Institución *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Clínica Santa María / IPS Boyacá"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Nombre y Cargo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
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
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Cargo *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. Compras / Coordinador"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Teléfono y Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Teléfono / Celular *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="310 000 0000"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="correo@empresa.com"
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Tipo de requerimiento */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Línea de Suministro o Servicio *
                </label>
                <select
                  value={formData.servicio}
                  onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors bg-white"
                >
                  <option value="Insumos hospitalarios">Insumos hospitalarios y descartables</option>
                  <option value="Suministro de medicamentos">Suministro institucional de medicamentos</option>
                  <option value="Dispositivos médicos">Dispositivos y equipos médicos</option>
                  <option value="Transporte asistencial">Transporte asistencial institucional</option>
                  <option value="Convenio empresarial">Convenio integral de salud corporativa</option>
                  <option value="Otro">Otro requerimiento específico</option>
                </select>
              </div>

              {/* Detalle o Mensaje */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detalle del Requerimiento / Cantidades estimadas
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="Describe los productos, volúmenes de entrega o especificaciones requeridas..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Procesando...</span>
                  ) : (
                    <>
                      <span>Enviar solicitud</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
