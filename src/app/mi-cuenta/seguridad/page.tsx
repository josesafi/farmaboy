"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  Laptop,
  LogOut,
  History,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from "lucide-react";

export default function SeguridadPage() {
  const { sessions, closeOtherSessions, auditLogs } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  const [sessionsClosed, setSessionsClosed] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    setPassSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const handleCloseOthers = () => {
    if (confirm("¿Cerrar sesión en todos los demás dispositivos y navegadores?")) {
      closeOtherSessions();
      setSessionsClosed(true);
      setTimeout(() => setSessionsClosed(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Protección de Cuenta & Accesos</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Seguridad y Accesos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Administra tus credenciales de acceso, verificación en dos pasos (2FA) y auditoría de sesiones activas.
          </p>
        </div>
      </div>

      {sessionsClosed && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs font-bold text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#00A86B] shrink-0" />
          <span>Se han cerrado todas las sesiones en otros dispositivos con éxito.</span>
        </div>
      )}

      {/* 1. CAMBIO DE CONTRASEÑA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <KeyRound className="w-5 h-5 text-[#00A86B]" />
          <h2 className="text-sm font-black text-slate-900">
            Cambiar Contraseña
          </h2>
        </div>

        {passSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            ✓ Tu contraseña ha sido actualizada correctamente.
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Contraseña Actual *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nueva Contraseña (mínimo 8 caracteres) *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Confirmar Nueva Contraseña *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold shadow-xs transition-colors"
          >
            Actualizar Contraseña
          </button>
        </form>
      </div>

      {/* 2. DOBLE FACTOR DE AUTENTICACIÓN (2FA) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Autenticación de Dos Factores (2FA)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Solicita un código único por WhatsApp o SMS cada vez que inicies sesión desde un nuevo equipo.
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={twoFactorEnabled}
            onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A86B]"></div>
        </label>
      </div>

      {/* 3. SESIONES ACTIVAS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Dispositivos y Sesiones Activas
            </h3>
            <p className="text-xs text-slate-500">
              Equipos autorizados que han accedido recientemente a tu cuenta FarmaBoy
            </p>
          </div>

          {sessions.length > 1 && (
            <button
              type="button"
              onClick={handleCloseOthers}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar otras sesiones</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 text-xs ${
                sess.isCurrent
                  ? "bg-emerald-50/50 border-[#00A86B] ring-1 ring-[#00A86B]/20"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        Este Dispositivo
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {sess.browser} • {sess.location} • IP {sess.ipAddress}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-slate-500">
                {sess.lastActive}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. HISTORIAL DE AUDITORÍA */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <History className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-black text-slate-900">
            Registro de Eventos de Seguridad
          </h3>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-800 block">{log.event}</span>
                <span className="text-[11px] text-slate-400">
                  {log.device} • IP {log.ip}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {log.status}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">{log.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
