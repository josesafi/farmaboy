"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { triggerEmailEvent } from "@/lib/email/client";
import { Logo } from "@/components/common/Logo";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  KeyRound,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [mode, setMode] = useState<"correo" | "celular">("correo");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Ingresa tu correo o celular.");
      return;
    }

    if (mode === "correo" && !password.trim()) {
      setError("Ingresa tu contraseña.");
      return;
    }

    if (mode === "celular" && !otpMode) {
      // Step 1: Send OTP
      setIsLoading(true);
      
      // Enviar OTP real si es un correo o notificar
      if (identifier.includes("@")) {
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        triggerEmailEvent({
          event: "AUTH_VERIFY_EMAIL",
          recipient: identifier,
          recipientName: "Usuario Farmaboy",
          data: {
            token: generatedOtp,
            ip: "192.168.1.1",
            dispositivo: "Navegador Web",
          },
        });
      } else {
        // Cellular demo
        alert(`MODO DEMO: Como no hay una API de WhatsApp o SMS conectada, puedes ingresar cualquier código de 6 dígitos (ej. 123456) para continuar.`);
      }

      setTimeout(() => {
        setIsLoading(false);
        setOtpMode(true);
      }, 800);
      return;
    }

    setIsLoading(true);
    await login(identifier, password || otpCode);
    setIsLoading(false);
    router.push("/mi-cuenta");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50/20 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <Logo />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Inicia sesión en FARMABOY
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Tu farmacia y droguería de confianza en Boyacá
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50">

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode("correo");
                setOtpMode(false);
                setIdentifier("carlos.rodriguez@email.com");
              }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === "correo" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Correo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("celular");
                setOtpMode(false);
                setIdentifier("312 456 7890");
              }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === "celular" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Celular + OTP</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {mode === "correo" ? "Correo Electrónico" : "Número de Celular"}
              </label>
              <div className="relative">
                <input
                  type={mode === "correo" ? "email" : "tel"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={mode === "correo" ? "ejemplo@correo.com" : "312 000 0000"}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                />
                {mode === "correo" ? (
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                ) : (
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                )}
              </div>
            </div>

            {mode === "correo" ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Contraseña
                  </label>
                  <Link
                    href="/recuperar-cuenta"
                    className="text-[11px] font-bold text-[#00A86B] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : otpMode ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Código de 6 dígitos recibido por SMS / WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-emerald-300 focus:border-[#00A86B] text-sm font-black tracking-widest outline-none bg-white text-slate-900"
                  />
                  <KeyRound className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-sm shadow-md shadow-[#00A86B]/25 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                "Verificando..."
              ) : mode === "celular" && !otpMode ? (
                "Enviar código por SMS / WhatsApp"
              ) : (
                <>
                  <span>Ingresar a Mi Cuenta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guest Checkout Option */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/productos"
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Continuar como invitado</span>
            </Link>
            <Link
              href="/registro"
              className="text-[#00A86B] font-bold hover:underline"
            >
              Crear cuenta nueva
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
          <span>FarmaBoy • Plataforma Farmacéutica Segura Boyacá</span>
        </div>
      </div>
    </div>
  );
}
