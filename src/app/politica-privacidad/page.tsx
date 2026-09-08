import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { farmaboyConfig } from "@/config/farmaboy";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad | Farmaboy",
  description: "Tratamiento de datos personales y política de privacidad de Farmaboy en cumplimiento de la Ley 1581 de 2012 de Colombia.",
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>

        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Marco Legal Colombiano</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">
            Política de Tratamiento y Protección de Datos Personales
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            En cumplimiento de la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia.
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-primary">1. Identificación del Responsable</h2>
            <p>
              <strong>{farmaboyConfig.legalName}</strong> (en adelante &ldquo;FARMABOY&rdquo;), con domicilio en Boyacá, Colombia, es responsable del tratamiento de los datos personales recolectados a través de este sitio web, líneas de WhatsApp y canales presenciales.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-primary">2. Finalidad del Tratamiento de Datos</h2>
            <p>Los datos suministrados por usuarios particulares e institucionales serán utilizados exclusivamente para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Responder consultas sobre disponibilidad y orientación de medicamentos e insumos médicos.</li>
              <li>Elaborar y remitir cotizaciones formales solicitadas por empresas e instituciones.</li>
              <li>Coordinar la logística de servicios asistenciales y transporte asistencial de pacientes.</li>
              <li>Facturación y cumplimiento de obligaciones legales, fiscales y sanitarias aplicables.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-primary">3. Datos Sensibles y de Salud</h2>
            <p>
              En caso de que el usuario comparta voluntariamente información relativa a su estado de salud (fórmulas médicas, prescripciones o solicitudes de asistencia), FARMABOY tratará dichos datos bajo estricta confidencialidad médica y con las medidas de seguridad técnicas pertinentes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-primary">4. Derechos del Titular (Habeas Data)</h2>
            <p>
              Conforme a la legislación vigente, usted tiene derecho a conocer, actualizar, rectificar y solicitar la supresión de sus datos personales enviando una solicitud formal al correo electrónico: <strong>{farmaboyConfig.contact.emailGeneral}</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
