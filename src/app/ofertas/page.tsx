"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Tag, Calendar, Package } from "lucide-react";

export default function OfertasPage() {
  const { campaigns, allCatalogProducts } = useAdminStore();
  const [activeTab, setActiveTab] = useState<"activas" | "proximas">("activas");

  const now = new Date();

  const activeCampaigns = campaigns.filter(c => 
    c.status === "ACTIVA" && 
    new Date(c.startDate) <= now && 
    new Date(c.endDate) > now
  ).sort((a, b) => a.priority - b.priority);

  const upcomingCampaigns = campaigns.filter(c => 
    c.status === "PROGRAMADA" || new Date(c.startDate) > now
  ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Collect products for active campaigns
  const activePromoProductIds = new Set<string>();
  activeCampaigns.forEach(c => {
    c.products.forEach(p => activePromoProductIds.add(p.productId));
  });

  const activeProducts = allCatalogProducts.filter(p => activePromoProductIds.has(p.id) || (p.discountPercentage !== undefined && p.discountPercentage > 0));

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">Ofertas y Promociones</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">Descubre los mejores precios en medicamentos, cuidado personal y más. Ofertas exclusivas por tiempo limitado.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setActiveTab("activas")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "activas" 
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
                : "bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            Ofertas Activas
          </button>
          <button 
            onClick={() => setActiveTab("proximas")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "proximas" 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            Próximamente
          </button>
        </div>

        {/* Content */}
        {activeTab === "activas" && (
          <div className="space-y-6">
            {activeProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No hay ofertas activas</h3>
                <p className="text-slate-500">Vuelve pronto para descubrir nuevos descuentos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activeProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "proximas" && (
          <div className="space-y-6">
            {upcomingCampaigns.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No hay campañas programadas</h3>
                <p className="text-slate-500">Pronto anunciaremos nuestras próximas promociones.</p>
              </div>
            ) : (
              upcomingCampaigns.map(campaign => (
                <div key={campaign.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                  <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                    <Calendar className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-lg">Próximamente</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">{campaign.publicTitle}</h3>
                    <p className="text-slate-500 text-sm mt-1">{campaign.subtitle}</p>
                    <p className="text-slate-400 text-xs mt-3">Empieza el {new Date(campaign.startDate).toLocaleDateString()} a las {new Date(campaign.startDate).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-center md:text-right shrink-0">
                    <p className="text-slate-900 font-black text-2xl">{campaign.products.length}</p>
                    <p className="text-slate-500 text-xs font-medium">Productos en descuento</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
