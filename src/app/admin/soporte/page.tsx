"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Search,
  Filter,
  Check,
  X,
  ArrowLeft,
  Mail,
} from "lucide-react";

interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  message: string;
  status: "ABIERTO" | "EN_PROCESO" | "RESUELTO";
  createdAt: string;
  orderId?: string;
  replies: Array<{
    sender: "CLIENTE" | "AGENTE";
    text: string;
    timestamp: string;
    agentName?: string;
  }>;
}

const initialTickets: SupportTicket[] = [
  {
    id: "TICK-8491",
    customerName: "Mariana Fonseca",
    customerEmail: "mariana.fonseca@gmail.com",
    customerPhone: "311 456 7890",
    subject: "Consulta sobre tiempo de entrega en Duitama",
    message: "Buenas tardes, realicé un pedido de medicamentos para mi madre y quisiera saber si la entrega se realiza en la jornada de la tarde.",
    status: "ABIERTO",
    createdAt: "Hoy 11:20 AM",
    orderId: "ORD-948201",
    replies: [],
  },
  {
    id: "TICK-8320",
    customerName: "Carlos Rodríguez",
    customerEmail: "carlos.rodriguez@farmaboy.com.co",
    customerPhone: "310 987 6543",
    subject: "Solicitud de factura electrónica con NIT",
    message: "Requiero la factura DIAN del pedido con el NIT de mi empresa para fines tributarios.",
    status: "EN_PROCESO",
    createdAt: "Ayer 4:15 PM",
    orderId: "ORD-519284",
    replies: [
      {
        sender: "AGENTE",
        text: "Hola Carlos, estamos generando el documento XML DIAN y lo enviaremos a tu correo registrado.",
        timestamp: "Ayer 5:00 PM",
        agentName: "Laura Gómez (Farmaboy)",
      },
    ],
  },
  {
    id: "TICK-8104",
    customerName: "Juan David Morales",
    customerEmail: "jdmorales@hotmail.com",
    subject: "Validación de fórmula médica aprobada",
    message: "Agradezco la pronta validación de la receta de Losartán. Ya recibí el pedido en Sogamoso.",
    status: "RESUELTO",
    createdAt: "Hace 3 días",
    replies: [],
  },
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("TICK-8491");
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setIsSubmitting(true);

    try {
      // Dispatch email notification to customer
      await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "SUPPORT_TICKET_REPLIED",
          recipient: selectedTicket.customerEmail,
          recipientName: selectedTicket.customerName,
          data: {
            ticket: selectedTicket.id,
            nombre: selectedTicket.customerName,
            respuesta: replyText,
            agente: "Equipo de Soporte Farmaboy",
          },
        }),
      });

      const newReply = {
        sender: "AGENTE" as const,
        text: replyText,
        timestamp: "Hoy " + new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
        agentName: "Operador Farmaboy",
      };

      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? {
                ...t,
                status: "EN_PROCESO",
                replies: [...t.replies, newReply],
              }
            : t
        )
      );

      setReplyText("");
      alert("Respuesta enviada y notificada por correo al cliente.");
    } catch (e: any) {
      alert("Error al enviar respuesta: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    if (!confirm(`¿Deseas marcar la solicitud #${selectedTicket.id} como RESUELTA?`)) return;

    try {
      // Dispatch email notification of closed ticket
      await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "SUPPORT_TICKET_CLOSED",
          recipient: selectedTicket.customerEmail,
          recipientName: selectedTicket.customerName,
          data: {
            ticket: selectedTicket.id,
            nombre: selectedTicket.customerName,
          },
        }),
      });

      setTickets((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: "RESUELTO" } : t))
      );

      alert(`Ticket #${selectedTicket.id} cerrado y notificado al cliente.`);
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Módulo de Atención al Cliente Farmaboy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Gestión de Tickets & PQR
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Atiende requerimientos de pacientes en Boyacá. Cada respuesta o cierre dispara correos transaccionales automáticos.
          </p>
        </div>

        <Link
          href="/admin/emails"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-bold shadow-sm transition-all"
        >
          <Mail className="w-4 h-4 text-[#00A86B]" />
          <span>Ver Logs de Correo</span>
        </Link>
      </div>

      {/* Main Content: Tickets list + Ticket Detail / Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Ticket list */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Solicitudes Recibidas ({filteredTickets.length})
            </h2>
            <div className="flex gap-1">
              {["ALL", "ABIERTO", "EN_PROCESO", "RESUELTO"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    statusFilter === st ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st === "ALL" ? "Todos" : st}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, radicado o asunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#00A86B]"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredTickets.map((t) => {
              const isSelected = t.id === selectedTicket?.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-emerald-50/60 border-emerald-300 shadow-sm"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-500">{t.id}</span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        t.status === "ABIERTO"
                          ? "bg-rose-100 text-rose-800"
                          : t.status === "EN_PROCESO"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                    {t.subject}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {t.customerName} &bull; {t.createdAt}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Ticket Conversation & Response */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          {selectedTicket ? (
            <>
              {/* Ticket Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-400">#{selectedTicket.id}</span>
                    {selectedTicket.orderId && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        Pedido: {selectedTicket.orderId}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-black text-slate-900 mt-0.5">
                    {selectedTicket.subject}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Cliente: <strong>{selectedTicket.customerName}</strong> ({selectedTicket.customerEmail})
                    {selectedTicket.customerPhone ? ` • Cel: ${selectedTicket.customerPhone}` : ""}
                  </p>
                </div>

                {selectedTicket.status !== "RESUELTO" && (
                  <button
                    type="button"
                    onClick={handleCloseTicket}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all whitespace-nowrap"
                  >
                    <Check className="w-4 h-4 text-[#00A86B]" />
                    <span>Cerrar Ticket</span>
                  </button>
                )}
              </div>

              {/* Message thread */}
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {/* Original Client Message */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <strong className="text-slate-900">{selectedTicket.customerName}</strong>
                    <span>{selectedTicket.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedTicket.message}
                  </p>
                </div>

                {/* Replies */}
                {selectedTicket.replies.map((reply, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border space-y-1.5 ${
                      reply.sender === "AGENTE"
                        ? "bg-emerald-50/70 border-emerald-200 text-slate-900 ml-6"
                        : "bg-slate-50 border-slate-200/80 mr-6"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <strong className={reply.sender === "AGENTE" ? "text-emerald-900" : "text-slate-900"}>
                        {reply.agentName || "Soporte Farmaboy"}
                      </strong>
                      <span className="text-slate-400 text-[11px]">{reply.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {reply.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              {selectedTicket.status !== "RESUELTO" ? (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Responder a {selectedTicket.customerName} (Se enviará por correo electrónico):
                  </label>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Escribe la respuesta oficial de atención al cliente..."
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium outline-none focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSendReply}
                      disabled={isSubmitting || !replyText.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "Enviando respuesta..." : "Enviar Respuesta & Notificar"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-100 text-slate-600 text-xs text-center font-bold">
                  ✓ Este ticket ha sido resuelto y cerrado.
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <span>Selecciona un ticket para ver la conversación.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
