"use client";

import React, { useState } from "react";
import { farmaboyConfig, ProductItem } from "@/config/farmaboy";
import { getWhatsAppUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  MessageCircle,
  Search,
  Sparkles,
  ShoppingBag,
  Plus,
  Check,
  Heart,
} from "lucide-react";
import { AvailabilityModal } from "../common/AvailabilityModal";

import { useAdminStore } from "@/context/AdminStoreContext";

export const FeaturedProducts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useAuth();
  const { medicines, retailProducts, storeSettings } = useAdminStore();

  const filterTabs = [
    { id: "todos", label: "Todos los productos" },
    { id: "medicamentos", label: "Medicamentos" },
    { id: "cuidado-personal", label: "Cuidado Personal" },
    { id: "bienestar", label: "Vitaminas & Bienestar" },
    { id: "primeros-auxilios", label: "Primeros Auxilios" },
  ];

  const categorizeProduct = (category: string = "", name: string = "", extra: string = "") => {
    const text = `${category} ${name} ${extra}`.toLowerCase();
    if (text.includes("auxilio") || text.includes("alcohol") || text.includes("gasa") || text.includes("venda") || text.includes("botiqu")) {
      return "primeros-auxilios";
    }
    if (text.includes("personal") || text.includes("dermo") || text.includes("higiene") || text.includes("oral") || text.includes("bucal") || text.includes("piel") || text.includes("crema") || text.includes("solar") || text.includes("sexual")) {
      return "cuidado-personal";
    }
    if (text.includes("bienestar") || text.includes("vitamina") || text.includes("suplemento") || text.includes("suero") || text.includes("electrolito") || text.includes("colágeno") || text.includes("hidrataci")) {
      return "bienestar";
    }
    return "medicamentos";
  };

  const dynamicProducts = [
    ...medicines
      .filter((m) => m.isActive !== false && m.status === "ACTIVO")
      .map((m) => {
        const isOutOfStock = m.currentStock <= 0;
        const isLowStock = m.currentStock > 0 && m.currentStock <= m.minStock;
        const isExpired = m.expiryDate ? new Date(m.expiryDate) < new Date() : false;

        return {
          id: m.id,
          name: m.name,
          category: m.category,
          categoryId: categorizeProduct(m.category, m.name, m.subCategory || ""),
          shortInfo: `${m.pharmaInfo.principioActivo} • ${m.pharmaInfo.concentracion}`,
          badge: isExpired
            ? "No disponible"
            : isOutOfStock
            ? "Agotado"
            : isLowStock
            ? "Pocas unidades"
            : m.requiresPrescription
            ? "Bajo Receta"
            : "INVIMA",
          price: m.priceCOP || m.salePriceCOP,
          priceDisplay: `$${(m.priceCOP || m.salePriceCOP).toLocaleString("es-CO")}`,
          imageUrl:
            m.imageUrl && !m.imageUrl.includes("1550572017-edd951aa8f72")
              ? m.imageUrl
              : "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
          inStock: !isOutOfStock && !isExpired,
          isOutOfStock: isOutOfStock || isExpired,
          isLowStock,
          currentStock: m.currentStock,
          requiresPrescription: m.requiresPrescription,
        };
      }),
    ...retailProducts
      .filter((p) => p.isActive !== false && p.status === "ACTIVO")
      .map((p) => {
        const isOutOfStock = p.currentStock <= 0;
        const isLowStock = p.currentStock > 0 && p.currentStock <= p.minStock;

        return {
          id: p.id,
          name: p.name,
          category: p.category,
          categoryId: categorizeProduct(p.category, p.name, p.shortInfo || ""),
          shortInfo: p.shortInfo || p.brand,
          badge: isOutOfStock
            ? "Agotado"
            : isLowStock
            ? "Pocas unidades"
            : p.promoPriceCOP
            ? "Oferta"
            : undefined,
          price: p.promoPriceCOP || p.priceCOP,
          priceDisplay: `$${(p.promoPriceCOP || p.priceCOP).toLocaleString("es-CO")}`,
          imageUrl: p.imageUrl,
          inStock: !isOutOfStock,
          isOutOfStock,
          isLowStock,
          currentStock: p.currentStock,
        };
      }),
  ];

  const sourceProducts = dynamicProducts.length > 0 ? dynamicProducts : farmaboyConfig.featuredProducts;

  const filteredProducts = sourceProducts.filter((p) => {
    if (activeTab === "todos") return true;
    return p.categoryId === activeTab;
  });

  const handleAddToCart = (product: ProductItem) => {
    addItem(product, 1);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const getProductWhatsAppUrl = (productName: string) => {
    const activeWhatsapp = storeSettings?.whatsapp || farmaboyConfig.contact.whatsapp;
    const msg = `Hola Farmaboy, quiero consultar la disponibilidad y comprar el producto: *${productName}* en Boyacá.`;
    return getWhatsAppUrl(activeWhatsapp, msg);
  };

  return (
    <>
      <section className="py-14 sm:py-20 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00A86B] block mb-1">
                Farmacia Digital
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Productos destacados
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Agrega a tu pedido para pagar en línea con Wompi (PSE, Nequi, Tarjetas) o pide por WhatsApp.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center justify-center text-center px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 leading-normal select-none h-11 ${
                    activeTab === tab.id
                      ? "bg-[#00A86B] text-white shadow-md shadow-emerald-700/20"
                      : "bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-slate-200/90 shadow-2xs"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-pharmacy overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Product Image Container */}
                  <div className="relative aspect-[4/3] w-full bg-slate-50 p-2 overflow-hidden flex items-center justify-center">
                    <img
                      src={
                        product.imageUrl && !product.imageUrl.includes("1550572017-edd951aa8f72")
                          ? product.imageUrl
                          : "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80";
                      }}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-2xs"
                      loading="lazy"
                    />

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[10px] font-bold text-emerald-800 shadow-xs border border-emerald-100">
                        {product.badge}
                      </span>
                    )}

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-xs hover:scale-110 active:scale-90 transition-transform z-10"
                      title={isFavorite(product.id) ? "Quitar de favoritos" : "Guardar en favoritos"}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isFavorite(product.id)
                            ? "fill-rose-500 text-rose-500"
                            : "text-slate-400 hover:text-rose-500"
                        }`}
                      />
                    </button>

                    {/* In Stock Indicator */}
                    {product.isOutOfStock ? (
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Agotado
                      </span>
                    ) : product.isLowStock ? (
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Últimas {product.currentStock} unid.
                      </span>
                    ) : (
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Disponible
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {product.category}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug mb-1.5">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {product.shortInfo}
                    </p>

                    {/* Price Tag */}
                    <div className="py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Precio:</span>
                      <span className="font-extrabold text-[#00A86B] text-sm">
                        {product.priceDisplay}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Agregar al Carrito (Wompi) + Comprar por WhatsApp */}
                <div className="p-4 pt-0 space-y-2">
                  {product.isOutOfStock ? (
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product.name)}
                      className="w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all touch-target shadow-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                    >
                      <Search className="w-4 h-4 text-slate-500" />
                      <span>Avísame cuando haya disponibilidad</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product as any)}
                      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all touch-target shadow-xs ${
                        addedMap[product.id]
                          ? "bg-slate-900 text-white"
                          : "bg-[#00A86B] hover:bg-[#008755] text-white"
                      }`}
                    >
                      {addedMap[product.id] ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>¡Agregado al Carrito!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Agregar & Pagar con Wompi</span>
                        </>
                      )}
                    </button>
                  )}

                  <a
                    href={getProductWhatsAppUrl(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Pedir por WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00A86B]" />
              ¿Buscas un producto o fórmula médica que no ves aquí?
            </span>
            <button
              type="button"
              onClick={() => setSelectedProduct("Consulta general de medicamentos")}
              className="font-bold text-[#00A86B] hover:underline"
            >
              Consultar cualquier producto por WhatsApp &rarr;
            </button>
          </div>

        </div>
      </section>

      {/* Product Inquiry Modal */}
      {selectedProduct && (
        <AvailabilityModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          initialQuery={selectedProduct}
        />
      )}
    </>
  );
};
