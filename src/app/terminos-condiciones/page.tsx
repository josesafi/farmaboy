import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { farmaboyConfig } from "@/config/farmaboy";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Farmaboy",
  description: "Términos y condiciones de uso del sitio web y servicios de Farmaboy en Boyacá, Colombia.",
};

export default function TerminosCondicionesPage() {
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
            <ShieldAlert className="w-4 h-4" />
            <span>Condiciones de Servicio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Condiciones aplicables al acceso y utilización de los servicios ofrecidos por Farmaboy.
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-primary">1. Carácter Informativo y Responsabilidad Sanitaria</h2>
            <p>
              El contenido de este sitio web tiene carácter estrictamente informativo e institucional. Ninguna información suministrada constituye asesoramiento médico, diagnóstico clínico ni formulación terapéutica.
            </p>
            <p>
              Cualquier consulta sobre sintomatología o tratamientos debe ser atendida directamente por un médico profesional colegiado.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-primary">2. Dispensación de Medicamentos con Prescripción</h2>
            <p>
              Los medicamentos clasificados como de fórmula médica o control especial no serán despachados sin la verificación previa de la fórmula expedida por un facultativo debidamente autorizado por la legislación colombiana.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-primary">3. Cotizaciones Institucionales B2B</h2>
            <p>
              Las cotizaciones emitidas a través de la plataforma web o canales comerciales oficiales tendrán una validez temporal especificada en cada documento y estarán sujetas a la disponibilidad de inventario de los fabricantes e importadores.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-primary">4. Modificaciones</h2>
            <p>
              FARMABOY se reserva el derecho de actualizar los presentes términos para adecuarse a nuevas regulaciones sanitarias y de comercio electrónico en Colombia.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
