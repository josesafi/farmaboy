"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/common/Logo";
import { triggerEmailEvent } from "@/lib/email/client";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Smartphone,
  KeyRound,
  RefreshCw,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [step, setStep] = useState<1 | 2>(1); // 1 = Form, 2 = OTP Verification
  const [authMethod, setAuthMethod] = useState<"correo" | "celular">("correo");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    documentType: "CC" as const,
    documentNumber: "",
    phone: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    acceptTerms: true,
    acceptMarketing: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Vacía", color: "bg-slate-200" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "Débil", color: "bg-rose-500", text: "text-rose-600" };
    if (score <= 3) return { score: 2, label: "Moderada", color: "bg-amber-500", text: "text-amber-600" };
    return { score: 3, label: "Fuerte y segura", color: "bg-[#00A86B]", text: "text-emerald-600" };
  };

  const strength = getPasswordStrength(formData.password);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "El nombre es obligatorio.";
    if (!formData.lastName.trim()) errs.lastName = "El apellido es obligatorio.";
    if (!formData.documentNumber.trim()) errs.documentNumber = "Ingresa tu número de documento.";
    if (!formData.phone.trim() || formData.phone.length < 7) {
      errs.phone = "Ingresa un número de celular válido.";
    }
    if (authMethod === "correo") {
      if (!formData.email.trim() || !formData.email.includes("@")) {
        errs.email = "Ingresa un correo electrónico válido.";
      }
    }
    if (!formData.password) {
      errs.password = "Define una contraseña de al menos 8 caracteres.";
    } else if (formData.password.length < 8) {
      errs.password = "La contraseña debe tener al menos 8 caracteres.";
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Las contraseñas no coinciden.";
    }
    if (!formData.acceptTerms) {
      errs.acceptTerms = "Debes aceptar los términos y el tratamiento de datos.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate verification step
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setOtpSent(true);
    }, 800);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    const userEmail = formData.email || `${formData.phone}@farmaboy.com.co`;
    const fullName = `${formData.name} ${formData.lastName}`.trim();

    await register({
      name: formData.name,
      lastName: formData.lastName,
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
      phone: formData.phone,
      whatsapp: formData.phone,
      email: userEmail,
      birthDate: formData.birthDate,
    });

    // Dispatch welcome email and admin notification
    triggerEmailEvent({
      event: "USER_REGISTERED",
      recipient: userEmail,
      recipientName: fullName,
      event_id: `WELCOME_${userEmail.toLowerCase()}`,
      data: {
        nombre: fullName,
        correo: userEmail,
        fecha: new Date().toLocaleDateString("es-CO"),
      },
    });

    triggerEmailEvent({
      event: "ADMIN_NEW_USER",
      recipient: "info@farmaboy.com",
      event_id: `ADMIN_NEW_USER_${userEmail.toLowerCase()}`,
      data: {
        nombre: fullName,
        correo: userEmail,
        telefono: formData.phone,
        documento: formData.documentNumber,
      },
    });

    setIsLoading(false);
    router.push("/mi-cuenta");
  };

  const handleSocialRegister = async (provider: string) => {
    setIsLoading(true);
    const userEmail = `usuario.${provider.toLowerCase()}@farmaboy.com.co`;

    await register({
      name: "Usuario",
      lastName: provider,
      email: userEmail,
    });

    triggerEmailEvent({
      event: "USER_REGISTERED",
      recipient: userEmail,
      recipientName: "Usuario Farmaboy",
      event_id: `WELCOME_${userEmail.toLowerCase()}`,
      data: {
        nombre: "Usuario Farmaboy",
        correo: userEmail,
        fecha: new Date().toLocaleDateString("es-CO"),
      },
    });

    setIsLoading(false);
    router.push("/mi-cuenta");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50/20 py-8 sm:py-14 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-xl w-full mx-auto">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <Logo />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Crea tu cuenta FARMABOY
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Compra más rápido, guarda tus direcciones en Boyacá, consulta tus pedidos y disfruta de una experiencia farmacéutica personalizada.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 text-xs font-bold">
            <span className={`flex items-center gap-1.5 ${step === 1 ? "text-[#00A86B]" : "text-slate-400"}`}>
              <span className="w-5 h-5 rounded-full bg-[#00A86B]/10 flex items-center justify-center text-[11px] font-black text-[#00A86B]">1</span>
              Datos de Cuenta
            </span>
            <span className="w-12 h-0.5 bg-slate-200" />
            <span className={`flex items-center gap-1.5 ${step === 2 ? "text-[#00A86B]" : "text-slate-400"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${step === 2 ? "bg-[#00A86B] text-white" : "bg-slate-100 text-slate-400"}`}>2</span>
              Verificación Segura
            </span>
          </div>

          {step === 1 ? (
            <div>
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleSocialRegister("Google")}
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
                  onClick={() => handleSocialRegister("Apple")}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.86c.62-.77 1.05-1.84.93-2.91-.91.04-2.02.61-2.67 1.38-.58.68-1.08 1.76-.94 2.81 1.02.08 2.06-.51 2.68-1.28z"/>
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              {/* Method Switcher Tab */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] uppercase font-bold text-slate-400">O regístrate con</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMethod("correo")}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    authMethod === "correo" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Con Correo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod("celular")}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    authMethod === "celular" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Con Celular</span>
                </button>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Carlos"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                    />
                    {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Rodríguez"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                    />
                    {errors.lastName && <p className="text-[11px] text-rose-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Document Type & Number */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tipo Doc. *
                    </label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none bg-white"
                    >
                      <option value="CC">Cédula (CC)</option>
                      <option value="CE">Cédula Ext. (CE)</option>
                      <option value="TI">Tarjeta Identidad (TI)</option>
                      <option value="NIT">NIT Empresa</option>
                      <option value="PAS">Pasaporte</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      placeholder="Sin puntos ni guiones"
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                    />
                    {errors.documentNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.documentNumber}</p>}
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Celular (Colombia) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="312 456 7890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                    {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo Electrónico {authMethod === "correo" ? "*" : "(Opcional)"}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                    {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repite la contraseña"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1 text-[11px]">
                      <span className="text-slate-500 font-medium">Seguridad de la clave:</span>
                      <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 h-1.5">
                      <div className={`rounded-full ${strength.score >= 1 ? strength.color : "bg-slate-200"}`} />
                      <div className={`rounded-full ${strength.score >= 2 ? strength.color : "bg-slate-200"}`} />
                      <div className={`rounded-full ${strength.score >= 3 ? strength.color : "bg-slate-200"}`} />
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-[11px] text-rose-500">{errors.password}</p>}
                {errors.confirmPassword && <p className="text-[11px] text-rose-500">{errors.confirmPassword}</p>}

                {/* Optional Birthday */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Fecha de nacimiento (Opcional - Para beneficios y descuentos de cumpleaños)
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none bg-white text-slate-700"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                      className="rounded border-slate-300 text-[#00A86B] focus:ring-[#00A86B] mt-0.5"
                    />
                    <span>
                      Acepto los{" "}
                      <Link href="/terminos-condiciones" target="_blank" className="text-[#00A86B] underline font-bold">
                        Términos y Condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link href="/politica-privacidad" target="_blank" className="text-[#00A86B] underline font-bold">
                        Política de Tratamiento de Datos
                      </Link>{" "}
                      de Farmaboy.
                    </span>
                  </label>
                  {errors.acceptTerms && <p className="text-[11px] text-rose-500">{errors.acceptTerms}</p>}

                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-500">
                    <input
                      type="checkbox"
                      checked={formData.acceptMarketing}
                      onChange={(e) => setFormData({ ...formData, acceptMarketing: e.target.checked })}
                      className="rounded border-slate-300 text-[#00A86B] focus:ring-[#00A86B] mt-0.5"
                    />
                    <span>Deseo recibir cupones de descuento y ofertas exclusivas de farmacia por WhatsApp o Correo.</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-sm shadow-md shadow-[#00A86B]/25 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verificando datos...</span>
                    </>
                  ) : (
                    <>
                      <span>Continuar con verificación</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* STEP 2: OTP VERIFICATION */
            <div className="text-center py-4 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#00A86B] flex items-center justify-center mx-auto shadow-sm">
                <KeyRound className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Verificación de Seguridad FarmaBoy
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Enviamos un código de seguridad de 6 dígitos a{" "}
                  <strong className="text-slate-900">{formData.phone || formData.email}</strong>.
                </p>
                <p className="text-[11px] text-emerald-700 font-bold mt-1">
                  (Para esta demostración puedes ingresar cualquier número, e.g. 1 2 3 4 5 6)
                </p>
              </div>

              {/* 6 Digit Input */}
              <div className="flex justify-center gap-2 max-w-xs mx-auto">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-black rounded-xl border-2 border-slate-200 focus:border-[#00A86B] outline-none transition-colors"
                  />
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-sm shadow-md shadow-[#00A86B]/25 transition-all"
                >
                  {isLoading ? "Creando tu espacio..." : "Confirmar y entrar a Mi Cuenta"}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="hover:text-slate-800 underline"
                >
                  Modificar datos
                </button>
                <button
                  type="button"
                  onClick={() => alert("Código reenviado por WhatsApp / SMS")}
                  className="text-[#00A86B] font-bold hover:underline"
                >
                  Reenviar código
                </button>
              </div>
            </div>
          )}

          {/* Footer inside card */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              ¿Ya tienes una cuenta registrada?{" "}
              <Link href="/login" className="text-[#00A86B] font-bold hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
          <span>Tus datos de salud y contacto están protegidos bajo Ley 1581 de 2012</span>
        </div>
      </div>
    </div>
  );
}
