"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { AdminPermission } from "@/types/admin";

interface AdminGuardProps {
  children: React.ReactNode;
  requiredPermission?: AdminPermission;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children, requiredPermission }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentAdmin, hasPermission, getPermissionForRoute } = useAdminStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !currentAdmin && pathname !== "/admin/login" && pathname !== "/admin/recuperar-clave") {
      router.push("/admin/login");
    }
  }, [mounted, currentAdmin, pathname, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentAdmin && pathname !== "/admin/login" && pathname !== "/admin/recuperar-clave") {
    return null;
  }

  const effectivePermission = requiredPermission || getPermissionForRoute(pathname);

  if (effectivePermission && !hasPermission(effectivePermission)) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-white">Acceso Restringido por Rol</h2>
        <p className="text-sm text-slate-400">
          Tu rol actual (<span className="font-bold text-emerald-400">{currentAdmin?.role}</span>) no cuenta con el permiso requerido (<span className="font-mono text-xs text-amber-300">{effectivePermission}</span>) para acceder a este módulo.
        </p>
        <p className="text-xs text-slate-500">
          Puedes cambiar temporalmente de rol en el selector de la barra lateral para probar esta sección con permisos de Super Administrador.
        </p>
        <div className="pt-2">
          <button
            onClick={() => router.push("/admin")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
