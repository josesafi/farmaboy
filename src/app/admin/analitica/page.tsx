"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  FileSpreadsheet,
  FileText,
  MapPin,
  Pill,
  ShoppingBag,
  Users,
  Calendar,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";

export default function AdminAnaliticaPage() {
  const { medicines, orders, customers, showToast } = useAdminStore();
  const [selectedPeriod, setSelectedPeriod] = useState("30D");

  const totalSales = orders.reduce((acc, o) => acc + o.totalCOP, 0);

  // Top selling medicines
  const topMedicines = medicines.slice(0, 5).map((m, idx) => ({
    name: m.name,
    principle: m.pharmaInfo.principioActivo,
    unitsSold: 420 - idx * 65,
    revenueCOP: (420 - idx * 65) * m.salePriceCOP,
  }));

  // Sales by city
  const citySales = [
    { city: "Tunja", percentage: 48, orders: 84, revenueCOP: 4200000 },
    { city: "Duitama", percentage: 24, orders: 42, revenueCOP: 2100000 },
    { city: "Sogamoso", percentage: 16, orders: 28, revenueCOP: 1400000 },
    { city: "Paipa", percentage: 8, orders: 14, revenueCOP: 700000 },
    { city: "Chiquinquirá / Otros", percentage: 4, orders: 7, revenueCOP: 350000 },
  ];

  const handleExportCSV = (reportName: string) => {
    showToast(`Generando y descargando reporte: ${reportName} (CSV)`, "success");
    // Generate simple blob CSV download
    const csvContent =
      "data:text/csv;charset=utf-8,ID,Item,Detalle,VentasCOP\n1,Ventas Boyaca,Consolidado," +
      totalSales;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `farmaboy_${reportName.toLowerCase().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Reportes Comerciales, Analítica & Desempeño Boyacá
          </h2>
          <p className="text-xs text-slate-400">
            Exportación de balances de ventas, rotación de medicamentos y distribución geográfica
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV("Balance General")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Balance (Excel / CSV)</span>
          </button>
        </div>
      </div>

      {/* Top Medicines & Regional Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top Rotated Medicines */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-400" />
              Medicamentos con Mayor Rotación en Boyacá
            </h3>
            <span className="text-[11px] text-slate-400">Últimos 30 días</span>
          </div>

          <div className="space-y-3">
            {topMedicines.map((med, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">
                    #{idx + 1} {med.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{med.principle}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-emerald-400">
                    ${med.revenueCOP.toLocaleString("es-CO")} COP
                  </p>
                  <p className="text-[10px] text-slate-400">{med.unitsSold} unid. despachadas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Geographical Sales Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Participación de Ventas por Municipio
            </h3>
            <span className="text-[11px] text-slate-400">Tunja, Duitama, Sogamoso</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {citySales.map((city) => (
              <div key={city.city} className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-white">{city.city}</span>
                  <span className="text-slate-300 font-black">
                    {city.percentage}% (${city.revenueCOP.toLocaleString("es-CO")} COP)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${city.percentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">{city.orders} pedidos despachados</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
