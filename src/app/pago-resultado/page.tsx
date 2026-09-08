"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
} from "lucide-react";

function PagoResultadoContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id") || "";
  const paramStatus = searchParams.get("status") || "";
  const reference = searchParams.get("ref") || `FMB-${Date.now().toString().slice(-6)}`;
  const total = searchParams.get("total") || "";

  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"APPROVED" | "PENDING" | "DECLINED" | "ERROR">(
    paramStatus === "APPROVED"
      ? "APPROVED"
      : paramStatus === "PENDING"
      ? "PENDING"
      : paramStatus === "DECLINED"
      ? "DECLINED"
      : "APPROVED" // Default to approved in simulation
  );

  const copyReference = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappConfirmationMsg = `Hola Farmaboy, realicé el pago de mi pedido por WOMPI con Referencia: *${reference}*. ID Transacción: ${transactionId}. Por favor confirmen el despacho a mi dirección en Boyacá.`;
  const whatsappUrl = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    whatsappConfirmationMsg
  );

  return (
    <div className="py-16 sm:py-24 bg-slate-50 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-4">
        
        {/* Receipt Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-pharmacy border border-slate-200/90 text-center space-y-5">
          
          {/* Status Icon & Title */}
          {status === "APPROVED" && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00A86B] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00A86B] block">
                  Pasarela WOMPI (Bancolombia)
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  ¡Pago Exitoso!
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Tu orden ha sido registrada en el sistema de Farmaboy.
                </p>
              </div>
            </>
          )}

          {status === "PENDING" && (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                  En Proceso de Aprobación
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Transacción Pendiente
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Tu banco o PSE está procesando la solicitud. Te notificaremos en cuanto sea confirmada.
                </p>
              </div>
            </>
          )}

          {status === "DECLINED" && (
            <>
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                <XCircle className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">
                  Transacción no aprobada
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Pago Rechazado
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  El banco declinó la operación o cancelaste el proceso.
                </p>
              </div>
            </>
          )}

          {/* Transaction Metadata Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Referencia de pedido:</span>
              <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                <span>{reference}</span>
                <button
                  type="button"
                  onClick={copyReference}
                  className="p-1 hover:text-[#00A86B]"
                  title="Copiar referencia"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {transactionId && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">ID Wompi:</span>
                <span className="font-mono text-slate-700 truncate max-w-[200px]">
                  {transactionId}
                </span>
              </div>
            )}

            {total && (
              <div className="flex justify-between items-center pt-1 border-t border-slate-200 font-bold">
                <span className="text-slate-700">Monto total:</span>
                <span className="text-slate-900 font-black">{total}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
              <span>Entrega estimada:</span>
              <span className="font-semibold text-slate-700">En curso para Boyacá</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white font-extrabold text-xs sm:text-sm shadow-pharmacy transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirmar despacho por WhatsApp</span>
            </a>

            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Volver a la Farmacia</span>
            </Link>
          </div>

          {/* Security footnote */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Transacción respaldada por Wompi Bancolombia</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function PagoResultadoPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-slate-500">Cargando comprobante Wompi...</div>}>
      <PagoResultadoContent />
    </Suspense>
  );
}
