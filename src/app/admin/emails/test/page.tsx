"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Server,
  ArrowLeft,
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Zap,
  Terminal,
  Mail,
  Lock,
} from "lucide-react";

export default function AdminEmailsTestPage() {
  const [smtpStatus, setSmtpStatus] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<string>("info@farmaboy.com");
  const [subject, setSubject] = useState<string>("Diagnóstico SMTP: Prueba de Servidor Farmaboy");
  const [templateId, setTemplateId] = useState<string>("TEST_EMAIL");
  const [sendResult, setSendResult] = useState<any>(null);

  const checkConnection = async () => {
    setIsVerifying(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/emails/test");
      const data = await res.json();
      setSmtpStatus(data);
    } catch (e: any) {
      setSmtpStatus({
        success: false,
        message: "Error de red al intentar verificar SMTP: " + e.message,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient) {
      alert("Por favor ingresa un correo destinatario.");
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const res = await fetch("/api/emails/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          customSubject: subject,
          templateId,
        }),
      });
      const data = await res.json();
      setSendResult(data);
    } catch (e: any) {
      setSendResult({
        success: false,
        error: "Error al enviar correo de prueba: " + e.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/emails"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Dashboard de Emails</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Herramienta de Diagnóstico SMTP
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Verifica el handshake SSL con <code>smtp.buzondecorreo.com:465</code> y envía pruebas técnicas en vivo.
          </p>
        </div>

        <button
          type="button"
          onClick={checkConnection}
          disabled={isVerifying}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isVerifying ? "animate-spin" : ""}`} />
          <span>{isVerifying ? "Verificando..." : "Comprobar Conexión"}</span>
        </button>
      </div>

      {/* SMTP Connection Status Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#00A86B]" />
            <h2 className="text-sm font-black text-slate-900">
              Estado de la Conexión con Servidor de Correo
            </h2>
          </div>
          {smtpStatus && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                smtpStatus.success
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {smtpStatus.success ? "SUCCESS" : "ERROR"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase text-slate-400">Servidor SMTP</span>
            <p className="text-sm font-bold text-slate-900 mt-1 font-mono">
              {smtpStatus?.host || "smtp.buzondecorreo.com"}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase text-slate-400">Puerto & Protocolo</span>
            <p className="text-sm font-bold text-slate-900 mt-1 font-mono">
              Puerto {smtpStatus?.port || 465} (SSL / TLS Nativo)
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase text-slate-400">Buzón de Autenticación</span>
            <p className="text-sm font-bold text-slate-900 mt-1 font-mono">
              {smtpStatus?.user || "info@farmaboy.com"}
            </p>
          </div>
        </div>

        {smtpStatus && (
          <div
            className={`p-4 rounded-2xl text-xs font-mono flex items-start gap-3 ${
              smtpStatus.success
                ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                : "bg-rose-50 border border-rose-200 text-rose-900"
            }`}
          >
            {smtpStatus.success ? (
              <CheckCircle2 className="w-5 h-5 text-[#00A86B] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <strong>Diagnóstico del Transporter:</strong>
              <p className="mt-1">{smtpStatus.message}</p>
              {smtpStatus.error && (
                <p className="mt-1 text-[11px] text-rose-700">Código de error: {smtpStatus.error}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Live Dispatch Test Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Enviar Correo de Prueba en Vivo
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Genera un mensaje real utilizando el motor de plantillas y certifícalo directamente en tu bandeja de entrada.
          </p>
        </div>

        <form onSubmit={handleSendTest} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Destinatario de Prueba:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B]"
                  placeholder="ejemplo@farmaboy.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Plantilla a Probar:
              </label>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B]"
              >
                <option value="TEST_EMAIL">Diagnóstico SMTP (Test Estándar)</option>
                <option value="USER_REGISTERED">Bienvenida / Registro de Usuario</option>
                <option value="ORDER_CREATED">Pedido Recibido #ORD-123456</option>
                <option value="ORDER_CONFIRMED">Pedido Confirmado</option>
                <option value="PAYMENT_PENDING">Pago Pendiente (QR Bancolombia)</option>
                <option value="PAYMENT_APPROVED">Pago Confirmado y Aprobado</option>
                <option value="PICKUP_READY">Pedido Listo para Recoger</option>
                <option value="ORDER_OUT_FOR_DELIVERY">Pedido en Camino (Domicilio)</option>
                <option value="ADMIN_NEW_ORDER">Alerta Administrador: Nueva Venta</option>
                <option value="ADMIN_LOW_STOCK">Alerta Administrador: Stock Bajo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Asunto del Correo:
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? "Despachando correo..." : "ENVIAR PRUEBA AHORA"}</span>
            </button>
          </div>
        </form>

        {/* Test Result Box */}
        {sendResult && (
          <div
            className={`p-5 rounded-2xl border text-xs space-y-2 animate-fadeIn ${
              sendResult.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {sendResult.success ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#00A86B]" />
                  <span>SUCCESS: Correo despachado exitosamente</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>ERROR: El servidor rechazó el envío</span>
                </>
              )}
            </div>
            <p>{sendResult.message || sendResult.error}</p>
            {sendResult.messageId && (
              <p className="font-mono text-[11px]">
                <strong>Message-ID:</strong> {sendResult.messageId}
              </p>
            )}
            {sendResult.provider && (
              <p className="font-mono text-[11px]">
                <strong>Host utilizado:</strong> {sendResult.provider}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
