"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Sliders,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Eye,
  X,
  Server,
  FileCode,
} from "lucide-react";
import { EmailLog, EmailDeliveryStatus } from "@/lib/email/types";

export default function AdminEmailsDashboardPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [stats, setStats] = useState<any>({
    sentToday: 0,
    sentWeek: 0,
    sentMonth: 0,
    totalSent: 0,
    totalFailed: 0,
    totalRetrying: 0,
    pendingInQueue: 0,
    successRate: 100,
    errorRate: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/emails/logs", window.location.origin);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);
      if (searchTerm) url.searchParams.set("search", searchTerm);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        setStats(data.stats || {});
      }
    } catch (e) {
      console.error("Error cargando logs de email:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleRetry = async (logId: string) => {
    try {
      const res = await fetch("/api/emails/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Reenvío programado con éxito: ${data.message}`);
        setTimeout(() => setActionMessage(null), 4000);
        fetchLogs();
      } else {
        alert(data.error || "No se pudo reintentar el correo");
      }
    } catch (e: any) {
      alert("Error al conectar con la API: " + e.message);
    }
  };

  const handleProcessQueue = async () => {
    try {
      const res = await fetch("/api/emails/queue-process", { method: "POST" });
      const data = await res.json();
      setActionMessage(data.message || "Cola procesada");
      setTimeout(() => setActionMessage(null), 4000);
      fetchLogs();
    } catch (e: any) {
      alert("Error al procesar cola: " + e.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <Mail className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Centro de Comunicaciones Transaccionales</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard de Correos & Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Monitoreo en tiempo real del servidor SMTP corporativo (<code>smtp.buzondecorreo.com:465</code>), cola asíncrona y tasa de entrega.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/emails/templates"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-bold transition-all shadow-sm"
          >
            <FileCode className="w-4 h-4 text-slate-500" />
            <span>Plantillas</span>
          </Link>

          <Link
            href="/admin/emails/test"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-bold transition-all shadow-sm"
          >
            <Server className="w-4 h-4 text-[#00A86B]" />
            <span>Diagnóstico SMTP</span>
          </Link>

          <button
            type="button"
            onClick={handleProcessQueue}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Procesar Cola</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#00A86B] shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Enviados Hoy</span>
          <p className="text-xl font-black text-slate-900 mt-1">{stats.sentToday}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Esta Semana</span>
          <p className="text-xl font-black text-slate-900 mt-1">{stats.sentWeek}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Este Mes</span>
          <p className="text-xl font-black text-slate-900 mt-1">{stats.sentMonth}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Enviados</span>
          <p className="text-xl font-black text-emerald-600 mt-1">{stats.totalSent}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">En Cola</span>
          <p className="text-xl font-black text-amber-600 mt-1">{stats.pendingInQueue}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Fallidos</span>
          <p className="text-xl font-black text-rose-600 mt-1">{stats.totalFailed}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Reintentados</span>
          <p className="text-xl font-black text-blue-600 mt-1">{stats.totalRetrying}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tasa Éxito</span>
          <p className="text-xl font-black text-[#00A86B] mt-1">{stats.successRate}%</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por correo, asunto o event_id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B]"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "SENT", "FAILED", "RETRYING", "PENDING"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "Todos los estados" : st}
            </button>
          ))}
          <button
            type="button"
            onClick={fetchLogs}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Refrescar lista"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Email History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900">
            Historial de Correos Transaccionales & Alertas ({logs.length})
          </h2>
          <span className="text-xs text-slate-400">Proveedor: smtp.buzondecorreo.com:465</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-4">Fecha & Hora</th>
                <th className="py-3 px-4">Destinatario</th>
                <th className="py-3 px-4">Evento / Plantilla</th>
                <th className="py-3 px-4">Asunto</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center">Intentos</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#00A86B]" />
                    <span>Cargando registro de correos...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>No se encontraron registros de correos enviados en el sistema.</span>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const dateStr = new Date(log.timestamp).toLocaleString("es-CO");
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {log.recipient}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 font-mono">
                          {log.event}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate" title={log.subject}>
                        {log.subject}
                      </td>
                      <td className="py-3.5 px-4">
                        {log.status === "SENT" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-[#00A86B]" />
                            <span>SENT</span>
                          </span>
                        )}
                        {log.status === "FAILED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>FAILED</span>
                          </span>
                        )}
                        {log.status === "RETRYING" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                            <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                            <span>RETRYING</span>
                          </span>
                        )}
                        {log.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span>PENDING</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                        {log.retry_count + 1}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedLog(log)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all"
                            title="Ver detalles del mensaje"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRetry(log.id)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all"
                            title="Reenviar correo"
                          >
                            <Send className="w-3.5 h-3.5 text-[#00A86B]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Detalle Técnico del Correo
              </h3>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <p><strong>Log ID:</strong> <code className="bg-slate-100 px-2 py-0.5 rounded">{selectedLog.id}</code></p>
              <p><strong>Event ID (Idempotencia):</strong> <code className="bg-slate-100 px-2 py-0.5 rounded">{selectedLog.event_id}</code></p>
              <p><strong>Evento:</strong> {selectedLog.event}</p>
              <p><strong>Plantilla:</strong> {selectedLog.template}</p>
              <p><strong>Destinatario:</strong> {selectedLog.recipient}</p>
              <p><strong>Asunto:</strong> {selectedLog.subject}</p>
              <p><strong>Estado:</strong> {selectedLog.status}</p>
              <p><strong>Intentos:</strong> {selectedLog.retry_count + 1}</p>
              <p><strong>Proveedor SMTP:</strong> {selectedLog.provider}</p>
              {selectedLog.message_id && (
                <p><strong>Message-ID:</strong> <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">{selectedLog.message_id}</code></p>
              )}
              {selectedLog.error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                  <strong>Detalle del Error:</strong>
                  <p className="mt-1 font-mono text-[11px] break-all">{selectedLog.error}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  handleRetry(selectedLog.id);
                  setSelectedLog(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reenviar ahora</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
