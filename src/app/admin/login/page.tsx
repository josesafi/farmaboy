"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles, KeyRound } from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { AdminRoleName } from "@/types/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAs, showToast } = useAdminStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<AdminRoleName>("SUPER_ADMIN");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAs(email, password, selectedRole);
    if (success) {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block bg-white/95 px-4 py-2.5 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-200">
            <img
              src="/images/logo-farmaboy.png"
              alt="FARMABOY"
              className="h-12 w-auto object-contain mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">PANEL ADMINISTRATIVO</h1>
          <p className="text-xs text-slate-400">
            Plataforma Integral de Gestión Farmacéutica y Comercial • Boyacá
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
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
                placeholder="operaciones@farmaboy.com.co"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> Clave de Seguridad
                </label>
                <Link
                  href="/admin/recuperar-clave"
                  className="text-[11px] font-semibold text-emerald-400 hover:underline"
                >
                  ¿Olvidaste tu clave?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 transition font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Ingresar al Panel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Security Warning Footnote */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Sesión encriptada SSL/TLS • Registro de auditoría activo</span>
        </div>
      </div>
    </div>
  );
}
