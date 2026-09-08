import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  isLight?: boolean;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  isLight = false,
}) => {
  return (
    <Link
      href="/"
      className={`inline-flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl select-none ${className}`}
      aria-label="FARMABOY - Integrales de Servicios en Salud S.A.S"
    >
      <div
        className={`relative flex items-center justify-center p-1 rounded-xl transition-all duration-200 group-hover:scale-[1.03] ${
          isLight ? "bg-white/95 shadow-sm px-3 py-1.5" : ""
        }`}
      >
        <img
          src="/images/logo-farmaboy.png"
          alt="FARMABOY - Integrales de Servicios en Salud S.A.S"
          className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-xs"
          loading="eager"
        />
      </div>
    </Link>
  );
};
