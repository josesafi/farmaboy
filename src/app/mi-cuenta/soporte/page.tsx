"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  HelpCircle,
  MessageCircle,
  Search,
  Package,
  CreditCard,
  Truck,
  FileText,
  ChevronDown,
  ChevronUp,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import { farmaboyConfig } from "@/config/farmaboy";

export default function SoportePage() {
  const { orders } = useAuth();
  const [searchTopic, setSearchTopic] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("Estado de entrega de mi pedido");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "¿Cuánto tarda la entrega de un pedido en Tunja y municipios de Boyacá?",
      a: "En Tunja, el tiempo habitual es de 45 a 90 minutos según el sector. En Duitama, Sogamoso y municipios aledaños se realizan rutas diarias matutinas y vespertinas.",
    },
    {
      q: "¿Cómo hago seguimiento al domiciliario en tiempo real?",
      a: "Puedes ingresar a la sección 'Mis Pedidos', hacer clic en 'Ver detalle & tracking' del pedido activo, y verás las 5 etapas del estado de preparación y despacho.",
    },
    {
      q: "¿Cómo validar una fórmula médica con medicamentos bajo receta?",
      a: "Sube una foto o PDF legible de la fórmula en 'Mis Fórmulas'. Nuestro regente farmacéutico validará la vigencia y sello profesional antes de coordinar el despacho.",
    },
    {
      q: "¿Qué medios de pago puedo utilizar?",
      a: "Aceptamos pagos electrónicos con Wompi de Bancolombia (Tarjetas de Crédito, Débito, PSE con cualquier banco y Nequi), así como pago contra entrega en efectivo o datáfono.",
    },
    {
      q: "¿Cómo solicitar la factura electrónica con NIT para mi empresa?",
      a: "Configura tus datos en 'Facturación electrónica' seleccionando el perfil 'Empresa'. Todas las compras generarán factura electrónica DIAN enviada a tu correo tributario.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchTopic.toLowerCase()) ||
      f.a.toLowerCase().includes(searchTopic.toLowerCase())
  );

  const whatsappMessage = `Hola Farmaboy, necesito soporte sobre: "${selectedIssue}"${
    selectedOrder ? ` para el pedido #${selectedOrder}` : ""
  }. Solicito asistencia de un asesor farmacéutico en Boyacá.`;

  const whatsappUrl = getWhatsAppUrl(farmaboyConfig.contact.whatsapp, whatsappMessage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Atención al Cliente Farmaboy</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Centro de Ayuda y Soporte
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Resuelve dudas sobre tus compras, pedidos en camino, fórmulas médicas o comunícate con nuestro equipo en Boyacá.
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Hablar por WhatsApp</span>
        </a>
      </div>

      {/* QUICK ORDER TICKET FORM */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold uppercase text-emerald-400">
            Asistencia Rápida para Pedidos
          </span>
          <h2 className="text-xl font-black text-white mt-1">
            ¿Tienes alguna novedad con una compra reciente?
          </h2>
          <p className="text-xs text-slate-300">
            Selecciona el pedido y el motivo para conectarte inmediatamente con el área correspondiente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-800">
          <div>
            <label className="block text-slate-200 font-bold mb-1">
              Selecciona tu pedido
            </label>
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-none outline-none bg-white font-medium"
            >
              <option value="">Consulta general (sin pedido específico)</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  Pedido #{o.id} - ${o.total.toLocaleString("es-CO")} COP ({o.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-200 font-bold mb-1">
              Tipo de novedad
            </label>
            <select
              value={selectedIssue}
              onChange={(e) => setSelectedIssue(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-none outline-none bg-white font-medium"
            >
              <option value="Estado de entrega de mi pedido">¿Dónde está mi pedido? (Tracking)</option>
              <option value="Modificar dirección de entrega">Cambiar dirección de entrega</option>
              <option value="Validar fórmula médica">Validación o cotización de fórmula</option>
              <option value="Factura electrónica">Solicitud o ajuste de factura electrónica</option>
              <option value="Garantía de producto">Garantía o cambio de producto</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Iniciar chat de soporte con estos datos</span>
          </a>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <h3 className="text-base font-black text-slate-900">
            Preguntas Frecuentes
          </h3>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Buscar en preguntas frecuentes..."
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#00A86B]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-xs text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#00A86B] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
