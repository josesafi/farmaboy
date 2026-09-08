"use client";

import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { farmaboyConfig } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";

import { usePathname } from "next/navigation";
import { useAdminStore } from "@/context/AdminStoreContext";

interface WhatsAppButtonProps {
  customMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  customMessage,
}) => {
  const pathname = usePathname();
  const { storeSettings } = useAdminStore();
  const [isHovered, setIsHovered] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const activeWhatsapp = storeSettings?.whatsapp || farmaboyConfig.contact.whatsapp;
  const message = customMessage || farmaboyConfig.whatsappMessages.general;
  const whatsappUrl = getWhatsAppUrl(activeWhatsapp, message);

  return (
    <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-6 z-30 flex items-center gap-3">
      {/* Tooltip message */}
      <div
        className={`hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl shadow-clinical border border-slate-200/80 text-xs font-semibold text-slate-800 transition-all duration-300 pointer-events-none ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-2"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>¿Necesitas atención en salud? Escríbenos</span>
      </div>

      {/* Main Floating Trigger */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 touch-target focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
        aria-label="Abrir conversación oficial de WhatsApp con Farmaboy"
      >
        {/* Radar ping effect */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:opacity-40" />

        <MessageCircle className="w-7 h-7 relative z-10" />

        {/* Unread badge dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-700 border-2 border-white rounded-full" />
      </a>
    </div>
  );
};
