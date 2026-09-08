"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Pill,
  ShoppingBag,
  Flame,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { CatalogProduct, CatalogFilterState } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { QuickViewModal } from "@/components/catalog/QuickViewModal";
import { CatalogSearchAutocomplete } from "@/components/catalog/CatalogSearchAutocomplete";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { MobileFilterDrawer } from "@/components/catalog/MobileFilterDrawer";

function ProductosContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("cat") || "";

  const { allCatalogProducts, categories, catalogCardConfig } = useAdminStore();

  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<CatalogProduct | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const [filters, setFilters] = useState<CatalogFilterState>({
    search: initialQuery,
    category: initialCategory,
    brands: [],
    minPrice: 0,
    maxPrice: 500000,
    availability: "all",
    onlyOffers: false,
    presentation: "",
    activeIngredient: "",
    sortBy: "relevance",
    page: 1,
  });

  const ITEMS_PER_PAGE = 12;

  // Sync URL query params if they change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("cat") || "";
    if (q !== filters.search || cat !== filters.category) {
      setFilters((prev) => ({
        ...prev,
        search: q,
        category: cat,
        page: 1,
      }));
    }
  }, [searchParams]);

  // Handle filter updates
  const handleFilterChange = (updates: Partial<CatalogFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "",
      brands: [],
      minPrice: 0,
      maxPrice: 500000,
      availability: "all",
      onlyOffers: false,
      presentation: "",
      activeIngredient: "",
      sortBy: "relevance",
      page: 1,
    });
  };

  // Discounted / Promotional Products (Offers)
  const offerProducts = useMemo(() => {
    return allCatalogProducts
      .filter((p) => p.isOffer || (p.discountPercentage && p.discountPercentage > 0))
      .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
  }, [allCatalogProducts]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return allCatalogProducts.filter((p) => {
      // Search query filter
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesGeneric = p.genericName?.toLowerCase().includes(q);
        const matchesPrincipio = p.principioActivo?.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesSku = p.sku?.toLowerCase().includes(q);
        if (
          !matchesName &&
          !matchesBrand &&
          !matchesGeneric &&
          !matchesPrincipio &&
          !matchesCategory &&
          !matchesSku
        ) {
          return false;
        }
      }

      // Category filter (including special handling for "ofertas")
      if (filters.category) {
        if (filters.category === "ofertas") {
          const hasDiscount = p.isOffer || (p.discountPercentage && p.discountPercentage > 0);
          if (!hasDiscount) return false;
        } else if (p.categorySlug !== filters.category) {
          return false;
        }
      }

      // Brands filter
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
        return false;
      }

      // Price range
      if (p.priceCOP > filters.maxPrice || p.priceCOP < filters.minPrice) {
        return false;
      }

      // Availability
      if (filters.availability === "in_stock" && (p.currentStock <= 0 || p.status === "AGOTADO")) {
        return false;
      }

      // Offers only
      if (filters.onlyOffers && !p.isOffer && (!p.discountPercentage || p.discountPercentage <= 0)) {
        return false;
      }

      // Presentation
      if (filters.presentation && p.presentation !== filters.presentation) {
        return false;
      }

      // Active ingredient
      if (
        filters.activeIngredient &&
        (!p.principioActivo ||
          !p.principioActivo.toLowerCase().includes(filters.activeIngredient.toLowerCase()))
      ) {
        return false;
      }

      return true;
    });
  }, [allCatalogProducts, filters]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (filters.sortBy) {
      case "price_asc":
        return list.sort((a, b) => a.priceCOP - b.priceCOP);
      case "price_desc":
        return list.sort((a, b) => b.priceCOP - a.priceCOP);
      case "best_sellers":
        return list.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
      case "rating":
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case "relevance":
      default:
        // Prioritize offers and in-stock items
        return list.sort((a, b) => {
          const scoreA = (a.discountPercentage || 0) + (a.currentStock > 0 ? 50 : 0);
          const scoreB = (b.discountPercentage || 0) + (b.currentStock > 0 ? 50 : 0);
          return scoreB - scoreA;
        });
    }
  }, [filteredProducts, filters.sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(filters.page, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const handleOpenQuickView = (product: CatalogProduct) => {
    setSelectedQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedQuickViewProduct(null);
  };

  // Active filter count for badges
  const activeFilters: Array<{ key: string; val?: string; label: string }> = [];
  if (filters.search) activeFilters.push({ key: "search", label: `Búsqueda: "${filters.search}"` });
  if (filters.category) {
    const cat = categories.find((c) => c.slug === filters.category);
    if (cat) activeFilters.push({ key: "category", label: `Categoría: ${cat.name}` });
  }
  filters.brands.forEach((b) => activeFilters.push({ key: "brand", val: b, label: `Marca: ${b}` }));
  if (filters.onlyOffers) activeFilters.push({ key: "onlyOffers", label: "Solo ofertas" });
  if (filters.availability === "in_stock") activeFilters.push({ key: "availability", label: "En stock" });
  if (filters.presentation) activeFilters.push({ key: "presentation", label: `Presentación: ${filters.presentation}` });
  if (filters.maxPrice < 500000) activeFilters.push({ key: "maxPrice", label: `Hasta $ ${filters.maxPrice.toLocaleString()}` });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Banner / Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">Catálogo de Productos</span>
            {filters.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-emerald-700">
                  {categories.find((c) => c.slug === filters.category)?.name || filters.category}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Catálogo Farmacéutico Integral
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Medicamentos auténticos, insumos hospitalarios, dermocosmética y bienestar con entrega en 45-60 min en Tunja y Boyacá.
              </p>
            </div>

            {/* Big Search Autocomplete */}
            <div className="w-full md:w-96 shrink-0">
              <CatalogSearchAutocomplete
                placeholder="Buscar por nombre, principio activo, marca..."
                onSearchSubmit={(q) => handleFilterChange({ search: q, page: 1 })}
              />
            </div>
          </div>

          {/* Visual Category Pills Bar - Full Visibility (No Cutoff) */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>🏷️</span>
                <span>Explorar por Categoría:</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {categories.length} categorías disponibles
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => handleFilterChange({ category: "", page: 1 })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  !filters.category
                    ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>🏪</span>
                <span>Todas ({allCatalogProducts.length})</span>
              </button>
              {categories.map((cat) => {
                const isOfertas = cat.slug === "ofertas" || cat.slug.includes("oferta");
                const count = isOfertas
                  ? offerProducts.length
                  : allCatalogProducts.filter((p) => p.categorySlug === cat.slug).length;
                const isSelected = isOfertas
                  ? (filters.category === cat.slug || filters.onlyOffers)
                  : (filters.category === cat.slug && !filters.onlyOffers);

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (isOfertas) {
                        handleFilterChange({
                          category: isSelected ? "" : "ofertas",
                          onlyOffers: !isSelected,
                          page: 1,
                        });
                      } else {
                        handleFilterChange({
                          category: isSelected ? "" : cat.slug,
                          onlyOffers: false,
                          page: 1,
                        });
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      isSelected
                        ? isOfertas
                          ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-600/40"
                          : "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30"
                        : isOfertas
                        ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : isOfertas
                          ? "bg-rose-200 text-rose-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <CatalogFilters
                categories={categories}
                allProducts={allCatalogProducts}
                filterState={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                totalFiltered={sortedProducts.length}
              />
            </div>
          </div>

          {/* Product Grid & Controls */}
          <div className="lg:col-span-3">
            {/* 1. SECCIÓN DESTACADA DE OFERTAS & DESCUENTOS */}
            {offerProducts.length > 0 && !filters.search && (
              <div className="mb-8 bg-gradient-to-br from-rose-50/90 via-amber-50/40 to-emerald-50/40 rounded-3xl border border-rose-200/90 p-5 sm:p-7 shadow-[0_4px_24px_rgba(244,63,94,0.07)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-sm tracking-wide">
                          <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
                          <span>ZONA DE OFERTAS</span>
                        </span>
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                          ⚡ Descuentos de hasta el 30% en Boyacá
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Ofertas y Promociones de la Semana
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                        Ahorra hoy en medicamentos esenciales, dermocosmética y nutrición para tu familia con entrega express.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleFilterChange({
                          onlyOffers: !filters.onlyOffers,
                          category: filters.onlyOffers ? "" : "ofertas",
                          page: 1,
                        })
                      }
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 self-start sm:self-auto ${
                        filters.onlyOffers
                          ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-600/30"
                          : "bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 shadow-sm"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {filters.onlyOffers
                          ? "✓ Viendo solo ofertas"
                          : `Ver todas las ${offerProducts.length} ofertas`}
                      </span>
                    </button>
                  </div>

                  {/* 4 Featured Deals Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                    {offerProducts.slice(0, 4).map((deal) => (
                      <ProductCard
                        key={`deal-${deal.id}`}
                        product={deal}
                        onQuickView={handleOpenQuickView}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Toolbar: Active Filters & Sort */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span>
                    Mostrando{" "}
                    <strong className="text-slate-900 font-bold">
                      {sortedProducts.length === 0
                        ? 0
                        : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                      -
                      {Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)}
                    </strong>{" "}
                    de{" "}
                    <strong className="text-slate-900 font-bold">
                      {sortedProducts.length}
                    </strong>{" "}
                    productos
                  </span>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs text-slate-500 font-medium">Ordenar:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange({ sortBy: e.target.value as any, page: 1 })
                    }
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="relevance">Relevancia FarmaBoy</option>
                    <option value="best_sellers">Más vendidos</option>
                    <option value="price_asc">Menor precio</option>
                    <option value="price_desc">Mayor precio</option>
                    <option value="newest">Novedades</option>
                    <option value="rating">Mejor calificados</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400 font-medium">Filtros activos:</span>
                  {activeFilters.map((chip, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-medium"
                    >
                      <span>{chip.label}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (chip.key === "search") handleFilterChange({ search: "", page: 1 });
                          else if (chip.key === "category") handleFilterChange({ category: "", page: 1 });
                          else if (chip.key === "brand")
                            handleFilterChange({
                              brands: filters.brands.filter((b) => b !== chip.val),
                              page: 1,
                            });
                          else if (chip.key === "onlyOffers") handleFilterChange({ onlyOffers: false, page: 1 });
                          else if (chip.key === "availability") handleFilterChange({ availability: "all", page: 1 });
                          else if (chip.key === "presentation") handleFilterChange({ presentation: "", page: 1 });
                          else if (chip.key === "maxPrice") handleFilterChange({ maxPrice: 500000, page: 1 });
                        }}
                        className="hover:text-rose-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2 ml-1"
                  >
                    Borrar todos
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 ${
                  catalogCardConfig.desktopColumns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"
                } gap-3 sm:gap-5`}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={handleOpenQuickView}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Pill className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-800">
                  No se encontraron productos
                </h3>
                <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
                  No hay medicamentos o artículos que coincidan con los filtros aplicados. Prueba buscando con otros términos o limpia los filtros.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handleFilterChange({ page: currentPage - 1 })}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  Anterior
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => handleFilterChange({ page: pNum })}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        pNum === currentPage
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => handleFilterChange({ page: currentPage + 1 })}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileFilterDrawer
        categories={categories}
        allProducts={allCatalogProducts}
        filterState={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalFiltered={sortedProducts.length}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
      />
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Cargando catálogo...</div>}>
      <ProductosContent />
    </Suspense>
  );
}
