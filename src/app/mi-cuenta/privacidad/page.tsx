"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  FileText,
  ShieldCheck,
  AlertTriangle,
  X,
} from "lucide-react";

export default function PrivacidadPage() {
  const { user, logout } = useAuth();
  const [operationalConsent, setOperationalConsent] = useState(true);
  const [commercialConsent, setCommercialConsent] = useState(false);
  const [researchConsent, setResearchConsent] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Se ha generado el paquete de datos en formato seguro JSON/ZIP. La descarga comenzará automáticamente.");
    }, 1200);
  };

  const handleDeleteAccount = () => {
    alert("Tu solicitud de revocatoria de datos y eliminación de cuenta ha sido radicada. Por cumplimiento de la Ley 1581 de Colombia, la cuenta se desactivará y se cerrará tu sesión.");
    setIsDeleteModalOpen(false);
    logout();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <Lock className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Habeas Data & Ley 1581 de 2012</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Privacidad y Tratamiento de Datos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Tú tienes el control total de tus datos personales, consentimientos de salud y canales comerciales en Farmaboy.
          </p>
        </div>
      </div>

      {/* 1. CONSENTIMIENTOS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
          Gestión de Consentimientos y Finalidades
        </h2>

        <div className="space-y-4 text-xs">
          {/* Necessary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">
                  Tratamiento Operacional y Prestación del Servicio Farmacéutico
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  Obligatorio
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                Necesario para despachar pedidos en Boyacá, validar fórmulas médicas por parte de regentes autorizados, emitir facturación electrónica y coordinar la entrega física del domicilio.
              </p>
            </div>
            <input
              type="checkbox"
              checked={operationalConsent}
              disabled
              className="rounded text-[#00A86B] cursor-not-allowed shrink-0 mt-1"
            />
          </div>

          {/* Commercial */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">
                  Comunicaciones Comerciales, Cupones y Promociones
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                  Opcional
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                Envío de ofertas especiales, descuentos personalizados en categorías de bienestar y novedades de farmacia a través de WhatsApp, SMS o correo electrónico.
              </p>
            </div>
            <input
              type="checkbox"
              checked={commercialConsent}
              onChange={(e) => setCommercialConsent(e.target.checked)}
              className="rounded text-[#00A86B] focus:ring-[#00A86B] shrink-0 mt-1 cursor-pointer"
            />
          </div>

          {/* Health & Analytics */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">
                  Mejora Continua y Calidad del Servicio (Datos Anonimizados)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                  Opcional
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                Análisis de tiempos de entrega en municipios de Boyacá y optimización de disponibilidad de medicamentos sin asociar tu identidad.
              </p>
            </div>
            <input
              type="checkbox"
              checked={researchConsent}
              onChange={(e) => setResearchConsent(e.target.checked)}
              className="rounded text-[#00A86B] focus:ring-[#00A86B] shrink-0 mt-1 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => alert("Tus preferencias de consentimiento han sido actualizadas.")}
            className="px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-bold text-xs shadow-xs"
          >
            Actualizar Consentimientos
          </button>
        </div>
      </div>

      {/* 2. EJERCICIO DE DERECHOS ARCO (Descarga y Eliminación) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export data */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">
              Descargar Copia de mis Datos
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Obtén una copia portable de toda tu información registrada en Farmaboy (direcciones, pedidos, datos de contacto y recetas).
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportData}
            disabled={isExporting}
            className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? "Preparando archivo..." : "Solicitar descarga de datos"}</span>
          </button>
        </div>

        {/* Delete account */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">
              Revocatoria y Eliminación de Cuenta
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Solicita la eliminación permanente de tu cuenta y la revocación del tratamiento de tus datos personales conforme a la ley colombiana.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Solicitar eliminación de cuenta</span>
          </button>
        </div>
      </div>

      {/* Modal Confirmación Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">
              ¿Seguro que deseas eliminar tu cuenta?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Esta acción eliminará tus direcciones guardadas, tus compras recurrentes y tu historial de recetas. Los registros fiscales de facturas anteriores se conservarán por el período legal exigido por la DIAN.
            </p>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Confirmar Eliminación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
