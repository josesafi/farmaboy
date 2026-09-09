"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { paymentConfig } from "@/config/payment";
import {
  Clock,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  ShoppingBag,
  ShieldCheck,
  QrCode,
  ArrowRight,
  ExternalLink,
  Info,
} from "lucide-react";

function PagoResultadoContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref") || `FMB-${Date.now().toString().slice(-6)}`;
  const total = searchParams.get("total") || "";
  const customerName = searchParams.get("nombre") || "";

  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const copyToClipboard = (text: string, type: "ref" | "key") => {
    navigator.clipboard.writeText(text);
    if (type === "ref") {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const whatsappMessage = paymentConfig.whatsappVerification.buildMessage(
    reference,
    total || "total convenido",
    customerName
  );

  const whatsappUrl = `https://wa.me/${paymentConfig.whatsappVerification.phoneClean}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-xl w-full mx-auto space-y-6">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-pharmacy border border-slate-200/90 text-center space-y-6">
          
          {/* Status Header */}
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Clock className="w-9 h-9 animate-pulse" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Pendiente de Verificación Manual
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                ¡Pedido #{reference} Registrado!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                Para completar tu compra, realiza la transferencia con el código QR oficial o Llave Bancolombia y envíanos el comprobante.
              </p>
            </div>
          </div>

          {/* QR Stand & Details Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-50/70 to-slate-50 border border-amber-200/80 text-left space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-40 h-40 shrink-0 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center">
                <Image
                  src={paymentConfig.bancolombia.qrImage}
                  alt="QR Oficial Bancolombia Farmaboy"
                  width={150}
                  height={150}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>

              <div className="space-y-2 text-xs w-full">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                  <QrCode className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{paymentConfig.bancolombia.nombre}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Escanea desde <strong>Bancolombia, Nequi, Daviplata</strong> o cualquier app con interoperabilidad <strong>Bre-B</strong>.
                </p>

                {/* Llave Bre-B Bancolombia */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Llave Bancolombia / Bre-B
                    </span>
                    <span className="font-mono font-black text-slate-900 text-sm tracking-wide">
                      {paymentConfig.bancolombia.llave}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentConfig.bancolombia.llave, "key")}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1 transition-colors"
                    title="Copiar llave"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiada</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-500">
                  <span>Titular: </span>
                  <strong className="text-slate-700">{paymentConfig.bancolombia.comercio}</strong>
                </div>
              </div>
            </div>

            {/* Order Reference & Total */}
            <div className="pt-3 border-t border-amber-200/60 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Número de Pedido</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono font-black text-slate-900">{reference}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(reference, "ref")}
                    className="text-slate-400 hover:text-slate-700"
                    title="Copiar referencia"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Valor a Transferir</span>
                <div className="mt-0.5">
                  <span className="font-mono font-black text-[#00A86B] text-sm">
                    {total || "Ver detalle"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Steps */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Info className="w-4 h-4 text-sky-600" />
              <span>Pasos para la confirmación de tu despacho:</span>
            </div>
            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                Transfiere el valor exacto usando el <strong>código QR</strong> o la <strong>Llave {paymentConfig.bancolombia.llave}</strong>.
              </li>
              <li>
                Toma una captura o comprobante de la transferencia exitosa.
              </li>
              <li>
                Haz clic en el botón verde de abajo para enviarnos el comprobante por WhatsApp.
              </li>
              <li>
                Nuestro equipo valida el pago e inicia el despacho inmediato a tu dirección.
              </li>
            </ol>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-5 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white font-black text-sm sm:text-base shadow-pharmacy transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Enviar Comprobante por WhatsApp</span>
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link
                href="/mi-cuenta/pedidos"
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Ver Mis Pedidos</span>
              </Link>
              <Link
                href="/"
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Seguir Comprando</span>
              </Link>
            </div>
          </div>

          {/* Footnote */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Farmaboy Duitama - Droguería de Confianza en Boyacá</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function PagoResultadoPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-slate-500">
          Cargando detalles de tu pedido...
        </div>
      }
    >
      <PagoResultadoContent />
    </Suspense>
  );
}
