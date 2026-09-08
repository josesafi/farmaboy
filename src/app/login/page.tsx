"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  const [identifier, setIdentifier] = useState("carlos.rodriguez@email.com");
  const [password, setPassword] = useState("Farmaboy2026*");
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
      setTimeout(() => {
        setIsLoading(false);
        setOtpMode(true);
      }, 600);
      return;
    }

    setIsLoading(true);
    await login(identifier, password || otpCode);
    setIsLoading(false);
    router.push("/mi-cuenta");
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    await login(`usuario.${provider.toLowerCase()}@farmaboy.com.co`, "social_auth");
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
          
          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("Apple")}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.86c.62-.77 1.05-1.84.93-2.91-.91.04-2.02.61-2.67 1.38-.58.68-1.08 1.76-.94 2.81 1.02.08 2.06-.51 2.68-1.28z"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] uppercase font-bold text-slate-400">O ingresa con</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

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
                <p className="text-[10px] text-emerald-700 mt-1">
                  (Para probar puedes ingresar cualquier número)
                </p>
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
