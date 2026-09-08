"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Building2,
  FileSpreadsheet,
  Users,
  Store,
  MessageCircle,
  Plus,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import { farmaboyConfig } from "@/config/farmaboy";

export default function EmpresaB2BPage() {
  const { user, quotes, branches } = useAuth();
  const [activeTab, setActiveTab] = useState<"COTIZACIONES" | "ROLES">("COTIZACIONES");

  const companyRoles = [
    { name: "Carlos Rodríguez", email: "crodriguez@distribucionesboyaca.com", role: "Administrador", branch: "Todas las sedes", status: "Activo" },
    { name: "Ing. Javier Mendoza", email: "jmendoza@distribucionesboyaca.com", role: "Comprador", branch: "Bodega Duitama", status: "Activo" },
    { name: "Dra. Marcela Silva", email: "msilva@distribucionesboyaca.com", role: "Consulta / Auditor", branch: "Sede Sogamoso", status: "Activo" },
  ];

  const whatsappCorporate = getWhatsAppUrl(
    farmaboyConfig.contact.whatsapp,
    `Hola Farmaboy, me comunico desde la cuenta corporativa de ${user?.companyName || "mi empresa"} (NIT ${user?.companyNit || ""}) para solicitar asesoría y cotización institucional de medicamentos e insumos médicos en Boyacá.`
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Portal Corporativo & Proveedor Salud Boyacá</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {user?.companyName || "Cuenta Empresarial FarmaBoy"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            NIT: <strong>{user?.companyNit || "901.458.120-4"}</strong> • Rol: <strong>Administrador Corporativo</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/mi-cuenta/sedes"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Gestionar {branches.length} Sedes</span>
          </Link>

          <a
            href={whatsappCorporate}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Asesor B2B</span>
          </a>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Cotizaciones Activas
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {quotes.length}
          </p>
          <span className="text-xs text-emerald-700 font-semibold">
            Precios mayoristas vigentes
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Sedes Habilitadas
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {branches.length}
          </p>
          <span className="text-xs text-slate-500">
            Tunja, Duitama y Sogamoso
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Crédito & Facturación
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            Al día
          </p>
          <span className="text-xs text-emerald-700 font-semibold">
            Factura electrónica 30 días
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("COTIZACIONES")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === "COTIZACIONES"
              ? "bg-[#00A86B] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          Cotizaciones Institucionales ({quotes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ROLES")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === "ROLES"
              ? "bg-[#00A86B] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          Usuarios y Permisos ({companyRoles.length})
        </button>
      </div>

      {/* Content based on Tab */}
      {activeTab === "COTIZACIONES" ? (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-slate-100 px-2 py-0.5 rounded-md text-slate-800">
                      {q.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {q.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-1">
                    {q.title}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Cotizado</span>
                  <span className="text-lg font-black text-[#008755]">
                    ${q.totalEstimatedCOP.toLocaleString("es-CO")} COP
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>Destino: <strong className="text-slate-700">{q.branchName}</strong> ({q.itemsCount} ítems)</span>
                <span>Válida hasta: <strong className="text-slate-700">{q.validUntil}</strong></span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Descargando cotización formal ${q.code} en PDF...`)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar PDF</span>
                </button>
                <a
                  href={whatsappCorporate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#008755] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Aprobar / Despachar</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ROLES TAB */
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900">
              Control de Accesos Basado en Roles (RBAC)
            </h3>
            <button
              type="button"
              onClick={() => alert("Formulario para invitar colaborador empresarial...")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00A86B] text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invitar Colaborador</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {companyRoles.map((userRole, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900">{userRole.name}</h4>
                  <p className="text-slate-500 text-[11px]">{userRole.email} • {userRole.branch}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-700 text-[11px]">
                    {userRole.role}
                  </span>
                  <span className="text-emerald-600 font-bold text-[11px]">
                    ✓ {userRole.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
