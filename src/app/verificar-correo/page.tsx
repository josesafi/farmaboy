"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [isVerifying, setIsVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runVerification = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccess(true);
        } else {
          setError(data.error || "El enlace de verificación ha expirado o es inválido.");
        }
      } catch (err: any) {
        setError("Error de conexión al verificar: " + err.message);
      } finally {
        setIsVerifying(false);
      }
    };

    runVerification();
  }, [token, email]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50/20 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <Logo />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Verificación de Cuenta
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50 text-center">
          {isVerifying ? (
            <div className="py-8 space-y-3">
              <RefreshCw className="w-8 h-8 text-[#00A86B] animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                Validando token de seguridad...
              </p>
            </div>
          ) : success ? (
            <div className="space-y-4 py-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-[#00A86B] flex items-center justify-center mx-auto text-2xl font-black">
                ✓
              </div>
              <h2 className="text-xl font-black text-slate-900">
                ¡Correo verificado correctamente!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tu dirección de correo electrónico <strong>{email}</strong> ha sido verificada. Tu cuenta ya cuenta con acceso completo a pedidos, recetas y promociones exclusivas en Farmaboy.
              </p>
              <div className="pt-4">
                <Link
                  href="/mi-cuenta"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all w-full"
                >
                  <span>IR A MI CUENTA</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto text-2xl font-black">
                !
              </div>
              <h2 className="text-xl font-black text-slate-900">
                No pudimos verificar el correo
              </h2>
              <p className="text-xs text-rose-700 leading-relaxed">
                {error}
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
