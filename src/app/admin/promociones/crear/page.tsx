"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/context/AdminStoreContext";
import { PromotionCampaign, PromotionType, PromotionStatus, PromotionProduct } from "@/types/admin";
import { CatalogProduct } from "@/types/catalog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ArrowLeft, Save, Calendar, Tag, Image as ImageIcon, Search, Plus, Trash2, Check, Package, X } from "lucide-react";

export default function CrearPromocionPage() {
  const router = useRouter();
  const { allCatalogProducts, addCampaign, showToast } = useAdminStore();

  const [step, setStep] = useState(1);
  const [internalName, setInternalName] = useState("");
  const [publicTitle, setPublicTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [type, setType] = useState<PromotionType>("DESCUENTO_PORCENTUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("1");
  const [bannerUrl, setBannerUrl] = useState("");
  
  // Product Selection
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<PromotionProduct[]>([]);
  const [globalDiscount, setGlobalDiscount] = useState("10");

  const filteredCatalog = allCatalogProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 50);

  const toggleProduct = (product: any) => {
    const exists = selectedProducts.find(p => p.productId === product.id);
    if (exists) {
      setSelectedProducts(prev => prev.filter(p => p.productId !== product.id));
    } else {
      const discount = parseInt(globalDiscount) || 0;
      const originalPrice = product.priceCOP;
      const promoPrice = Math.max(0, originalPrice - (originalPrice * (discount / 100)));
      
      setSelectedProducts(prev => [...prev, {
        productId: product.id,
        sku: product.sku,
        originalPriceCOP: originalPrice,
        promoPriceCOP: promoPrice,
        discountPercentage: discount
      }]);
    }
  };

  const handleSave = () => {
    if (!internalName || !publicTitle || !startDate || !endDate) {
      showToast("Faltan campos obligatorios", "warning");
      return;
    }
    if (selectedProducts.length === 0) {
      showToast("Debes seleccionar al menos un producto", "warning");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Auto status based on dates
    let status: PromotionStatus = "PROGRAMADA";
    if (start <= new Date() && end > new Date()) status = "ACTIVA";
    if (end <= new Date()) status = "FINALIZADA";

    addCampaign({
      internalName,
      publicTitle,
      subtitle,
      description: "",
      type,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      status,
      priority: parseInt(priority) || 1,
      bannerDesktopUrl: bannerUrl,
      products: selectedProducts
    });

    router.push("/admin/promociones");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-black text-white">Crear Nueva Campaña</h2>
          <p className="text-xs text-slate-400">Configura una promoción, oferta del día o evento comercial.</p>
        </div>
        <button onClick={handleSave} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20">
          <Save className="w-4 h-4" />
          Guardar y Programar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2 mb-4"><Tag className="w-4 h-4 text-emerald-400"/> Información General</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-bold mb-1 block">Nombre Interno (Solo Admin)</label>
                <input type="text" value={internalName} onChange={e => setInternalName(e.target.value)} placeholder="Ej. Black Friday 2026" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold mb-1 block">Tipo de Promoción</label>
                <select value={type} onChange={e => setType(e.target.value as PromotionType)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500">
                  <option value="OFERTA_DEL_DIA">🔥 Oferta del Día</option>
                  <option value="DESCUENTO_PORCENTUAL">📉 Descuento Porcentual</option>
                  <option value="PRECIO_ESPECIAL">💰 Precio Especial Fijo</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 font-bold mb-1 block">Título Público (Visible al cliente)</label>
                <input type="text" value={publicTitle} onChange={e => setPublicTitle(e.target.value)} placeholder="Ej. ¡Ofertas de Locura en Cuidado Personal!" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 font-bold mb-1 block">Subtítulo Público</label>
                <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Ej. Hasta 40% de descuento en marcas seleccionadas" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2 mb-4"><Calendar className="w-4 h-4 text-emerald-400"/> Programación</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-bold mb-1 block">Inicio (Automático)</label>
                <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold mb-1 block">Fin (Automático)</label>
                <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold mb-1 block">Prioridad (1 es más alta)</label>
                <input type="number" min="1" max="100" value={priority} onChange={e => setPriority(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="sm:col-span-2">
                <ImageUploader 
                  label="Banner URL (Opcional)"
                  value={bannerUrl}
                  onChange={(url) => setBannerUrl(url)}
                />
              </div>
            </div>
          </div>

          {/* Product Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-white font-bold flex items-center gap-2"><Package className="w-4 h-4 text-emerald-400"/> Productos Participantes</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Descuento Global %:</span>
                <input type="number" value={globalDiscount} onChange={e => setGlobalDiscount(e.target.value)} className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500 text-center" />
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Buscar por nombre, SKU o principio activo..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" 
              />
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {filteredCatalog.map(product => {
                  const isSelected = selectedProducts.some(p => p.productId === product.id);
                  return (
                    <div key={product.id} onClick={() => toggleProduct(product)} className={`flex items-center gap-3 p-3 border-b border-slate-800/50 cursor-pointer transition-colors ${isSelected ? "bg-emerald-500/10" : "hover:bg-slate-800/50"}`}>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${isSelected ? "bg-emerald-500 border-emerald-500" : "bg-slate-900 border-slate-700"}`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-slate-800 shrink-0 overflow-hidden relative">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">SKU: {product.sku} | Stock: {product.currentStock}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-xs font-bold text-slate-300">${product.priceCOP.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sticky top-24">
            <h3 className="text-white font-bold mb-4 border-b border-slate-800 pb-2">Resumen de Campaña</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Productos:</span>
                <span className="text-white font-bold">{selectedProducts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estado inicial:</span>
                <span className="text-emerald-400 font-bold">PROGRAMADA</span>
              </div>
            </div>

            {selectedProducts.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Muestra de descuentos</h4>
                {selectedProducts.slice(0, 3).map(p => {
                  const catP = allCatalogProducts.find(x => x.id === p.productId);
                  return (
                    <div key={p.productId} className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-white truncate w-24">{catP?.name}</span>
                      <div className="text-right flex flex-col">
                        <span className="text-[10px] text-rose-400 line-through">${p.originalPriceCOP.toLocaleString()}</span>
                        <span className="text-xs text-emerald-400 font-bold">${p.promoPriceCOP.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
                {selectedProducts.length > 3 && (
                  <p className="text-[10px] text-center text-slate-500 pt-1">y {selectedProducts.length - 3} más...</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
