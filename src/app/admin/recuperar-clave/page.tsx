"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AdminRecuperarClavePage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block bg-white/95 px-4 py-2.5 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-200">
            <img
              src="/images/logo-farmaboy.png"
              alt="FARMABOY"
              className="h-11 w-auto object-contain mx-auto"
            />
          </Link>
          <h1 className="text-xl font-black text-white">Recuperar Clave Administrativa</h1>
          <p className="text-xs text-slate-400">
            Ingresa tu correo institucional para recibir un enlace de restablecimiento seguro.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          {sent ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Enlace de seguridad enviado</h3>
              <p className="text-xs text-slate-400">
                Hemos enviado las instrucciones para restablecer tu contraseña a <span className="text-white font-medium">{email}</span>. Revisa tu bandeja de entrada o carpeta de spam.
              </p>
              <div className="pt-3">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio de Sesión
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" /> Correo Administrativo
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colaborador@farmaboy.com.co"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Enviar Enlace de Recuperación
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Regresar al Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
