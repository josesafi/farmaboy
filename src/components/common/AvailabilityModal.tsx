"use client";

import React, { useState } from "react";
import { X, MessageCircle, Pill, Search, ShieldCheck } from "lucide-react";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
}) => {
  const [productName, setProductName] = useState(initialQuery);
  const [patientNote, setPatientNote] = useState("");

  if (!isOpen) return null;

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    const queryText = productName ? `el medicamento/producto: *${productName}*` : "un producto farmacéutico";
    const noteText = patientNote ? ` (Detalle: ${patientNote})` : "";
    const fullMsg = `Hola Farmaboy, deseo consultar la disponibilidad y orientación de ${queryText}${noteText} en Boyacá.`;
    
    const url = getWhatsAppUrl(farmaboyConfig.contact.whatsapp, fullMsg);
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-300" />
            <h3 className="text-lg font-bold">Consultar Disponibilidad</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleWhatsAppRedirect} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Escribe el nombre del medicamento o insumo que requieres. Nuestro equipo validará el stock en Boyacá y te responderá al instante por WhatsApp.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nombre del Medicamento o Insumo *
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder="Ej. Losartán 50mg / Guantes de nitrilo..."
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nota adicional o ciudad en Boyacá (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Requiero 2 cajas para entrega en Tunja o fórmula médica..."
              value={patientNote}
              onChange={(e) => setPatientNote(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <span>
              Si dispones de fórmula médica, podrás adjuntar la foto directamente en el chat de WhatsApp para una verificación precisa.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1EBE5D] flex items-center justify-center gap-2 shadow-clinical transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Consultar ahora por WhatsApp</span>
          </button>
        </form>
      </div>
    </div>
  );
};
