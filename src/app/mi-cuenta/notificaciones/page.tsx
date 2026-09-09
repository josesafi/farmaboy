"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { NotificationPreferences } from "@/types/account";
import {
  Bell,
  Mail,
  Smartphone,
  MessageCircle,
  Radio,
  CheckCircle2,
  Save,
  ShieldCheck,
  Package,
  Sparkles,
  Lock,
} from "lucide-react";

export default function NotificacionesPage() {
  const { notificationPreferences, updateNotificationPreferences } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPreferences>(notificationPreferences);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateNotificationPreferences(prefs);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggleChannel = (channel: keyof NotificationPreferences["channels"]) => {
    setPrefs({
      ...prefs,
      channels: {
        ...prefs.channels,
        [channel]: !prefs.channels[channel],
      },
    });
  };

  const toggleCategory = (cat: keyof NotificationPreferences["categories"]) => {
    setPrefs({
      ...prefs,
      categories: {
        ...prefs.categories,
        [cat]: !prefs.categories[cat],
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <Bell className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Centro de Comunicaciones Farmaboy</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Preferencias de Notificación
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Gestiona qué avisos deseas recibir. Los correos de cuenta y compras son obligatorios para garantizar tu servicio y seguridad.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md shadow-[#00A86B]/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Preferencias</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs font-bold text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#00A86B] shrink-0" />
          <span>Preferencias de comunicación actualizadas exitosamente.</span>
        </div>
      )}

      {/* 1. CANALES ACTIVOS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
          Canales de Envío Habilitados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, desc: "Avisos urgentes y estado del domicilio" },
            { key: "email", label: "Correo Electrónico", icon: Mail, desc: "Facturas y confirmaciones oficiales" },
            { key: "sms", label: "Mensajes SMS", icon: Smartphone, desc: "Códigos de seguridad y OTP" },
            { key: "push", label: "Notificaciones Web", icon: Radio, desc: "Alertas en tu navegador" },
          ].map((ch) => {
            const Icon = ch.icon;
            const isEnabled = prefs.channels[ch.key as keyof NotificationPreferences["channels"]];
            return (
              <div
                key={ch.key}
                onClick={() => toggleChannel(ch.key as any)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isEnabled
                    ? "bg-emerald-50/50 border-[#00A86B] ring-1 ring-[#00A86B]/20"
                    : "bg-slate-50/50 border-slate-200 text-slate-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isEnabled ? "text-[#00A86B]" : "text-slate-400"}`} />
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => {}}
                      className="rounded text-[#00A86B] focus:ring-[#00A86B]"
                    />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{ch.label}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{ch.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 1: EMAILS DE CUENTA */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-black text-slate-900">
              1. EMAILS DE CUENTA & SEGURIDAD
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-black uppercase">
            Obligatorios por Seguridad
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Estos correos garantizan la protección de tu cuenta y no pueden ser desactivados.
        </p>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            { title: "Seguridad y Nuevos Dispositivos", desc: "Alertas al detectar inicios de sesión desde nuevas ubicaciones o navegadores." },
            { title: "Recuperación de Contraseña", desc: "Enlaces seguros y temporales para restablecer tu clave de acceso." },
            { title: "Cambios de Perfil y Cuenta", desc: "Avisos ante modificaciones en tu correo electrónico o datos personales." },
          ].map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800">{item.title}</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">{item.desc}</p>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                Siempre Activo
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: EMAILS DE PEDIDOS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#00A86B]" />
            <h2 className="text-sm font-black text-slate-900">
              2. EMAILS DE PEDIDOS & COMPRAS
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase">
            Transaccionales Esenciales
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Notificaciones indispensables para coordinar el cobro, preparación y entrega de tus medicamentos.
        </p>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            { title: "Confirmaciones de Pedido", desc: "Recibo digital y resumen de productos al finalizar tu compra." },
            { title: "Comprobantes y Estados de Pago", desc: "Verificación de QR Bancolombia, Bre-B, Wompi o transferencias." },
            { title: "Alistamiento en Farmacia", desc: "Validación por regente farmacéutico y preparación de fórmula médica." },
            { title: "Entrega a Domicilio y Recogida en Punto", desc: "Despacho en ruta por domiciliario o disponibilidad en mostrador." },
          ].map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800">{item.title}</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">{item.desc}</p>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                Siempre Activo
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 3: EMAILS COMERCIALES */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-black text-slate-900">
              3. EMAILS COMERCIALES & PROMOCIONES
            </h2>
          </div>
          <Link
            href="/cancelar-suscripcion"
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline"
          >
            Cancelar todas
          </Link>
        </div>
        <p className="text-xs text-slate-500">
          Comunicaciones opcionales sobre ofertas, cupones y jornadas de salud. Puedes activarlas o desactivarlas cuando desees.
        </p>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            {
              key: "promotions",
              title: "Promociones y Campañas de Bienestar",
              desc: "Descuentos en productos de dermocosmética, cuidado del bebé y nutrición.",
            },
            {
              key: "couponsAndDiscounts",
              title: "Cupones de Descuento Especiales",
              desc: "Avisos de nuevos códigos promocionales y beneficios de cliente frecuente.",
            },
            {
              key: "medicineReminders",
              title: "Recordatorios de Tratamiento y Fórmulas",
              desc: "Avisos oportunos para surtir tus medicamentos antes de que se agoten.",
            },
            {
              key: "newsletters",
              title: "Boletín de Salud y Novedades",
              desc: "Artículos y recomendaciones de prevención escritas por nuestro equipo farmacéutico.",
            },
          ].map((cat) => {
            const isChecked = prefs.categories[cat.key as keyof NotificationPreferences["categories"]];
            return (
              <div key={cat.key} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-800">{cat.title}</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">{cat.desc}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat.key as any)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A86B]"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
