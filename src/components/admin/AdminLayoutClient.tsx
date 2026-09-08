"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminToasts } from "./AdminToasts";
import { AdminGuard } from "./AdminGuard";

export const AdminLayoutClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/admin/login" || pathname === "/admin/recuperar-clave";

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
        <AdminToasts />
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-slate-950">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <AdminHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-950">
            {children}
          </main>
        </div>
        <AdminToasts />
      </div>
    </AdminGuard>
  );
};
