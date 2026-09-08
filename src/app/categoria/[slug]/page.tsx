"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Pill,
  CheckCircle2,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { CatalogProduct } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { QuickViewModal } from "@/components/catalog/QuickViewModal";
import { CatalogSearchAutocomplete } from "@/components/catalog/CatalogSearchAutocomplete";

export default function CategoriaDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { allCatalogProducts, categories, catalogCardConfig } = useAdminStore();

  const [sortBy, setSortBy] = useState<string>("relevance");
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<CatalogProduct | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Find category by slug
  const category = categories.find((c) => c.slug === slug);

  // Filter products for this category
  const categoryProducts = useMemo(() => {
    return allCatalogProducts.filter((p) => p.categorySlug === slug);
  }, [allCatalogProducts, slug]);

  // Sort
  const sortedProducts = useMemo(() => {
    const list = [...categoryProducts];
    switch (sortBy) {
      case "price_asc":
        return list.sort((a, b) => a.priceCOP - b.priceCOP);
      case "price_desc":
        return list.sort((a, b) => b.priceCOP - a.priceCOP);
      case "best_sellers":
        return list.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
      default:
        return list;
    }
  }, [categoryProducts, sortBy]);

  if (!category && categories.length > 0) {
    // If not found in loaded categories
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <Pill className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-800">Categoría no encontrada</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          La sección solicitada no existe o fue reorganizada. Explora todas las categorías en nuestro catálogo principal.
        </p>
        <Link
          href="/productos"
          className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
        >
          Ver todo el catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Category Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/productos" className="hover:text-emerald-700 transition-colors">
              Catálogo
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-emerald-700">{category?.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{category?.emoji}</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {category?.name}
                </h1>
                {category?.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {category.badge}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                {category?.description}
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-80 shrink-0">
              <CatalogSearchAutocomplete placeholder={`Buscar en ${category?.name || "catálogo"}...`} />
            </div>
          </div>

          {/* Value props strip */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Dispensación farmacéutica autorizada INVIMA</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Entrega express en Tunja y Boyacá en 45-60 min</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Control estricto de temperatura y almacenamiento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <span className="text-xs font-semibold text-slate-600">
            {categoryProducts.length} productos en {category?.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="relevance">Relevancia</option>
              <option value="best_sellers">Más vendidos</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
            </select>
          </div>
        </div>

        {sortedProducts.length > 0 ? (
          <div
            className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 ${
              catalogCardConfig.desktopColumns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
            } gap-4 sm:gap-6`}
          >
            {sortedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => {
                  setSelectedQuickViewProduct(prod);
                  setIsQuickViewOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <Pill className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              Pronto tendremos más referencias en esta categoría
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Estamos actualizando el inventario en línea. Si necesitas un medicamento específico, contáctanos por WhatsApp para dispensación inmediata.
            </p>
            <Link
              href="/productos"
              className="inline-block mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
            >
              ← Volver a todas las categorías
            </Link>
          </div>
        )}
      </div>

      <QuickViewModal
        product={selectedQuickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setSelectedQuickViewProduct(null);
        }}
      />
    </div>
  );
}
