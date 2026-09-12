"use client";

import React, { useState } from "react";
import { Tag, Calendar, Activity, CheckCircle, Clock, Pause, FileText, Plus, Eye, MousePointerClick, ShoppingCart, DollarSign, Package } from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { useRouter } from "next/navigation";
import { paymentConfig } from "@/config/payment";
import { CuponesManager } from "./CuponesManager";

export default function PromocionesDashboard() {
  const { campaigns } = useAdminStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"activa" | "programada" | "finalizada" | "pausada" | "borrador" | "cupones">("activa");

  const filterCampaigns = (status: string) => {
    return campaigns.filter(c => c.status.toLowerCase() === status);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "ACTIVA": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "PROGRAMADA": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "FINALIZADA": return "text-slate-400 bg-slate-400/10 border-slate-400/20";
      case "PAUSADA": return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default: return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            Campañas y Ofertas del Día
          </h2>
          <p className="text-xs text-slate-400">
            Administra promociones, ofertas, descuentos y cupones de tu ecommerce.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/promociones/crear")}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Crear promoción
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {[
          { id: "activa", label: "Activas", icon: Activity, count: filterCampaigns("activa").length },
          { id: "programada", label: "Programadas", icon: Clock, count: filterCampaigns("programada").length },
          { id: "finalizada", label: "Finalizadas", icon: CheckCircle, count: filterCampaigns("finalizada").length },
          { id: "pausada", label: "Pausadas", icon: Pause, count: filterCampaigns("pausada").length },
          { id: "borrador", label: "Borradores", icon: FileText, count: filterCampaigns("borrador").length },
          { id: "cupones", label: "Cupones", icon: Tag, count: undefined },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? "bg-emerald-500/20" : "bg-slate-800"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === "cupones" ? (
        <CuponesManager />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filterCampaigns(activeTab).length === 0 ? (
            <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl">
              <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">No hay campañas en este estado</p>
            </div>
          ) : (
            filterCampaigns(activeTab).map(campaign => (
              <div key={campaign.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-5 items-center justify-between hover:border-slate-700 transition-colors">
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                    <span className="text-slate-500 text-xs flex items-center gap-1 font-mono">
                      {campaign.id}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-bold">
                      {campaign.type.replace(/_/g, " ")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{campaign.internalName}</h3>
                  <p className="text-slate-400 text-xs">Público: {campaign.publicTitle}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Inicio: {new Date(campaign.startDate).toLocaleString()}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Fin: {new Date(campaign.endDate).toLocaleString()}</span>
                    <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-emerald-500" /> {campaign.products.length} productos</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto bg-slate-950 p-4 rounded-2xl border border-slate-800/60">
                  <div className="text-center">
                    <span className="block text-[10px] text-slate-500 mb-1 flex items-center justify-center gap-1"><Eye className="w-3 h-3"/> Vistas</span>
                    <strong className="text-white text-sm">{campaign.views}</strong>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] text-slate-500 mb-1 flex items-center justify-center gap-1"><ShoppingCart className="w-3 h-3"/> Carritos</span>
                    <strong className="text-white text-sm">{campaign.cartAdds}</strong>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] text-slate-500 mb-1 flex items-center justify-center gap-1"><Package className="w-3 h-3"/> Vendidos</span>
                    <strong className="text-emerald-400 text-sm">{campaign.unitsSold}</strong>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] text-slate-500 mb-1 flex items-center justify-center gap-1"><DollarSign className="w-3 h-3"/> Ingresos</span>
                    <strong className="text-amber-400 text-sm">{paymentConfig.formatCOP(campaign.revenueGeneratedCOP)}</strong>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                  <button onClick={() => router.push(`/admin/promociones/crear?edit=${campaign.id}`)} className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors">
                    Editar
                  </button>
                  {campaign.status === "ACTIVA" && (
                    <button className="flex-1 md:flex-none px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold rounded-xl transition-colors">
                      Pausar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
