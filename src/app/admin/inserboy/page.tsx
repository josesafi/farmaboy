"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { Save, Ambulance, Image as ImageIcon, Search, Tag, X, Plus } from "lucide-react";
import { InserboyConfig, PromotionProduct } from "@/types/admin";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function AdminInserboyPage() {
  const { inserboyConfig, updateInserboyConfig, allCatalogProducts, showToast } = useAdminStore();
  
  const [config, setConfig] = useState<InserboyConfig>(inserboyConfig);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = () => {
    updateInserboyConfig(config);
  };

  const filteredCatalog = allCatalogProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  const toggleProduct = (productId: string) => {
    setConfig(prev => {
      const exists = prev.featuredProducts.includes(productId);
      if (exists) {
        return { ...prev, featuredProducts: prev.featuredProducts.filter(id => id !== productId) };
      } else {
        return { ...prev, featuredProducts: [...prev.featuredProducts, productId] };
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
            <Ambulance className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Página Inserboy</h1>
            <p className="text-sm text-slate-400">Edita el contenido y productos de la sección de Transporte Asistencial.</p>
          </div>
        </div>
        <button onClick={handleSave} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20">
          <Save className="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h2 className="text-lg font-bold text-white mb-4">Textos Principales</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Título Hero</label>
                <textarea
                  rows={2}
                  value={config.heroTitle}
                  onChange={e => setConfig({...config, heroTitle: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Descripción Ambulancia Básica</label>
                <textarea
                  rows={3}
                  value={config.heroBasicAmbulance}
                  onChange={e => setConfig({...config, heroBasicAmbulance: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Descripción Oxígeno Hero</label>
                <textarea
                  rows={3}
                  value={config.heroOxygen}
                  onChange={e => setConfig({...config, heroOxygen: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h2 className="text-lg font-bold text-white mb-4">Sección Oxígeno</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Título Sección Oxígeno</label>
                <input
                  type="text"
                  value={config.sectionOxygenTitle}
                  onChange={e => setConfig({...config, sectionOxygenTitle: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Descripción Sección Oxígeno</label>
                <textarea
                  rows={5}
                  value={config.sectionOxygenDesc}
                  onChange={e => setConfig({...config, sectionOxygenDesc: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h2 className="text-lg font-bold text-white mb-4">Productos Destacados</h2>
            <p className="text-xs text-slate-400 mb-4">Selecciona los productos que aparecerán en la sección de Inserboy.</p>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
              />
            </div>

            {searchQuery && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 max-h-60 overflow-y-auto mb-4 space-y-1">
                {filteredCatalog.map(p => {
                  const isSelected = config.featuredProducts.includes(p.id);
                  return (
                    <div key={p.id} onClick={() => toggleProduct(p.id)} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-emerald-500/10 border border-emerald-500/20' : 'hover:bg-slate-800 border border-transparent'}`}>
                      <div className="w-10 h-10 rounded bg-white overflow-hidden shrink-0">
                        <img src={p.imageUrl || '/images/placeholder.png'} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                        <p className="text-xs text-slate-400">{p.sku}</p>
                      </div>
                      <button className={`w-6 h-6 rounded-md flex items-center justify-center ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {isSelected ? <Tag className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Productos Seleccionados ({config.featuredProducts.length})</h3>
              {config.featuredProducts.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
                  <p className="text-slate-500 text-sm">No hay productos seleccionados.</p>
                </div>
              ) : (
                config.featuredProducts.map(productId => {
                  const p = allCatalogProducts.find(prod => prod.id === productId);
                  if (!p) return null;
                  return (
                    <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <div className="w-12 h-12 rounded bg-white overflow-hidden shrink-0">
                        <img src={p.imageUrl || '/images/placeholder.png'} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                        <p className="text-xs text-emerald-400 font-bold">${p.priceCOP.toLocaleString('es-CO')}</p>
                      </div>
                      <button onClick={() => toggleProduct(p.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
