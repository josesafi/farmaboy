"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un correo electrónico válido.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/emails/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "No se pudo cancelar la suscripción.");
      }
    } catch (err: any) {
      setError("Error de conexión: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50/20 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <Logo />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Preferencias de Comunicaciones
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Puedes cancelar tu suscripción a boletines y ofertas comerciales en cualquier momento.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50">
          {success ? (
            <div className="text-center space-y-4 py-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-[#00A86B] flex items-center justify-center mx-auto text-xl font-black">
                ✓
              </div>
              <h2 className="text-lg font-black text-slate-900">
                Has cancelado las comunicaciones comerciales
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tu correo <strong>{email}</strong> ha sido dado de baja de nuestras listas de promociones y boletines. Continuarás recibiendo únicamente notificaciones esenciales de tus compras y la seguridad de tu cuenta.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  Volver a Farmaboy
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Correo Electrónico:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B]"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Al confirmar, dejarás de recibir ofertas, promociones y novedades semanales de Farmaboy.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {isSubmitting ? "Procesando baja..." : "CONFIRMAR DESUSCRIPCIÓN COMERCIAL"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Regresar a la farmacia</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
