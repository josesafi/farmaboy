"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  Search,
  Clock,
  User,
  Activity,
  FileSpreadsheet,
  Lock,
  CheckCircle,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

export default function AdminSeguridadPage() {
  const { activityLogs } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        log.action.toLowerCase().includes(q) ||
        log.entity.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    });
  }, [activityLogs, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            Registro de Auditoría, Eventos & Seguridad
          </h2>
          <p className="text-xs text-slate-400">
            Trazabilidad inmutable de todas las acciones efectuadas por colaboradores de Farmaboy
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Auditoría en Tiempo Real
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filtrar por acción, usuario, medicamento o detalle..."
          className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Momento / Fecha</th>
                <th className="py-3.5 px-3 font-semibold">Responsable</th>
                <th className="py-3.5 px-3 font-semibold">Rol</th>
                <th className="py-3.5 px-3 font-semibold">Acción Ejecutada</th>
                <th className="py-3.5 px-3 font-semibold">Elemento Afectado</th>
                <th className="py-3.5 px-4 font-semibold">Detalles del Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{log.timestamp}</span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white whitespace-nowrap">{log.user}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-400 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-200">{log.entity}</td>
                  <td className="py-3.5 px-4 text-slate-400 max-w-md truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
