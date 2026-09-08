"use client";

import React, { useState } from "react";
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
            <span>Centro de Comunicaciones</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Preferencias de Notificación
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Elige por cuáles canales y sobre qué temas deseas recibir alertas de Farmaboy.
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
          Canales de Envío
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, desc: "Avisos urgentes y estado del domicilio" },
            { key: "email", label: "Correo Electrónico", icon: Mail, desc: "Facturas y confirmaciones de orden" },
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

      {/* 2. CATEGORÍAS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
          Categorías de Notificación
        </h2>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            {
              key: "orderStatus",
              title: "Estado de Pedidos y Farmacia",
              desc: "Confirmación de compra, preparación por el regente farmacéutico y validación.",
              required: true,
            },
            {
              key: "deliveryTracking",
              title: "Seguimiento en Vivo del Domicilio",
              desc: "Ubicación del domiciliario y tiempo estimado de llegada en Boyacá.",
              required: true,
            },
            {
              key: "payments",
              title: "Comprobantes de Pago Wompi",
              desc: "Aprobación de transacciones con PSE, Nequi, Bancolombia y tarjetas.",
              required: true,
            },
            {
              key: "medicineReminders",
              title: "Recordatorio de Medicamentos y Fórmulas",
              desc: "Avisos anticipados para surtir tu tratamiento recurrente antes de que se agote.",
              required: false,
            },
            {
              key: "couponsAndDiscounts",
              title: "Cupones y Beneficios FarmaBoy",
              desc: "Alertas de nuevos códigos promocionales y puntos acumulados.",
              required: false,
            },
            {
              key: "promotions",
              title: "Ofertas y Campañas de Bienestar",
              desc: "Descuentos en productos de cuidado personal, dermocosmética y salud familiar.",
              required: false,
            },
            {
              key: "newsletters",
              title: "Novedades y Consejos de Salud",
              desc: "Artículos y recomendaciones informativas de autocuidado para la comunidad.",
              required: false,
            },
          ].map((cat) => {
            const isChecked = prefs.categories[cat.key as keyof NotificationPreferences["categories"]];
            return (
              <div key={cat.key} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">{cat.title}</h3>
                    {cat.required && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        Operacional
                      </span>
                    )}
                  </div>
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
