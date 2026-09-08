"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { Mail, Phone, KeyRound, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function RecuperarCuentaPage() {
  const [method, setMethod] = useState<"correo" | "celular">("correo");
  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50/20 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <Logo />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Recupera tu cuenta FARMABOY
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Te ayudaremos a restablecer tu acceso de forma rápida y segura.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-1 bg-slate-100 rounded-xl grid grid-cols-2 text-xs font-bold mb-4">
                <button
                  type="button"
                  onClick={() => setMethod("correo")}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    method === "correo" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Con Correo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("celular")}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    method === "celular" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Con Celular</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {method === "correo" ? "Correo Electrónico Registrado" : "Número de Celular"}
                </label>
                <input
                  type={method === "correo" ? "email" : "tel"}
                  placeholder={method === "correo" ? "tu@email.com" : "312 000 0000"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Por motivos de privacidad y seguridad, no revelaremos si este dato se encuentra en nuestro sistema. Si existe una cuenta asociada, recibirás un enlace y código de verificación.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-sm shadow-md shadow-[#00A86B]/25 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? "Enviando solicitud..." : "Enviar código de restablecimiento"}
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#00A86B] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                Instrucciones enviadas
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Si la información ingresada corresponde a una cuenta activa en Farmaboy, te hemos enviado un mensaje con el enlace y código de recuperación.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 text-left">
                <strong>¿No lo encuentras?</strong> Revisa tu carpeta de spam o correo no deseado, o solicita un reenvío en 2 minutos.
              </div>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-[#00A86B] hover:underline block mx-auto"
              >
                Intentar con otro dato
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/login"
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Iniciar Sesión</span>
            </Link>
            <Link href="/registro" className="text-[#00A86B] font-bold hover:underline">
              Crear cuenta
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
          <span>FarmaBoy • Boyacá, Colombia • Protección de Datos Certificada</span>
        </div>
      </div>
    </div>
  );
}
