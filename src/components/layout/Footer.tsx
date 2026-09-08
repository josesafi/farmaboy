"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../common/Logo";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl, getTelUrl } from "@/lib/utils";
import { useAdminStore } from "@/context/AdminStoreContext";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { storeSettings } = useAdminStore();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const activeWhatsapp = storeSettings?.whatsapp || farmaboyConfig.contact.whatsapp;
  const activeWhatsappDisplay = storeSettings?.whatsappDisplay || farmaboyConfig.contact.whatsappDisplay;
  const activePhone = storeSettings?.phone || farmaboyConfig.contact.phone;
  const activePhoneDisplay = storeSettings?.phoneDisplay || farmaboyConfig.contact.phoneDisplay;
  const activeAddress = storeSettings?.addressPrincipal || farmaboyConfig.contact.address;
  const activeHours = storeSettings?.operatingHours || farmaboyConfig.contact.operatingHours;

  const whatsappUrl = getWhatsAppUrl(
    activeWhatsapp,
    farmaboyConfig.whatsappMessages.general
  );

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-28 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 mb-10">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-3">
            <Logo isLight />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Tu farmacia y droguería de confianza en Boyacá. Medicamentos, bienestar, insumos hospitalarios y servicios asistenciales para familias y empresas.
            </p>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{farmaboyConfig.legalName}</span>
              </div>
              <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-2">
                <span>NIT: {farmaboyConfig.nit}</span>
                <span>•</span>
                <span>Matrícula: {farmaboyConfig.matriculaMercantil}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categorías de Farmacia */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Categorías
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/productos" className="hover:text-white transition-colors flex items-center gap-1.5 font-bold text-emerald-400">
                  <ChevronRight className="w-3 h-3 text-[#00A86B]" />
                  <span>Catálogo Completo FarmaBoy</span>
                </Link>
              </li>
              <li>
                <Link href="/categoria/medicamentos" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#00A86B]" />
                  <span>Medicamentos & Fórmulas</span>
                </Link>
              </li>
              <li>
                <Link href="/categoria/dermocosmetica" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#00A86B]" />
                  <span>Dermocosmética & Solar</span>
                </Link>
              </li>
              <li>
                <Link href="/categoria/vitaminas-y-suplementos" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#00A86B]" />
                  <span>Vitaminas & Suplementos</span>
                </Link>
              </li>
              <li>
                <Link href="/categoria/bebes" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#00A86B]" />
                  <span>Bebés & Maternidad</span>
                </Link>
              </li>
              <li>
                <Link href="/categoria/dispositivos-medicos" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#00A86B]" />
                  <span>Dispositivos & Diagnóstico</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Servicios Especiales */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Servicios & Empresas
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/servicios-asistenciales#toma-tension" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#00A86B]" />
                  <span>Toma de Tensión Arterial</span>
                </Link>
              </li>
              <li>
                <Link href="/transporte-asistencial" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#00A86B]" />
                  <span>Transporte Asistencial</span>
                </Link>
              </li>
              <li>
                <Link href="/servicios-asistenciales" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#00A86B]" />
                  <span>Servicios Asistenciales</span>
                </Link>
              </li>
              <li>
                <Link href="/empresas" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#00A86B]" />
                  <span>Soluciones para Empresas</span>
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#00A86B]" />
                  <span>Quiénes Somos</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacto Farmacia */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Atención & Pedidos
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-emerald-300 font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#00A86B]" />
                  <span>WhatsApp: {activeWhatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={getTelUrl(activePhone)}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Línea: {activePhoneDisplay}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <a
                  href={farmaboyConfig.contact.googleMapsPlaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                  title="Ver ubicación en Google Maps"
                >
                  <span>{activeAddress}</span>
                  <span className="block text-[10px] text-emerald-400 font-semibold mt-0.5">
                    Ver en Google Maps &rarr;
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{activeHours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Medical disclaimer note */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 mb-6 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-0.5">
            Aviso de Responsabilidad Sanitaria:
          </p>
          <p>{farmaboyConfig.medicalDisclaimer}</p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            &copy; {currentYear} {farmaboyConfig.name} - Tu farmacia de confianza en Boyacá, Colombia.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/politica-privacidad" className="hover:text-white transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terminos-condiciones" className="hover:text-white transition-colors">
              Términos y Condiciones
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
