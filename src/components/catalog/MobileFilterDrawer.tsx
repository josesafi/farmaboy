"use client";

import React, { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";
import { CatalogCategory, CatalogFilterState, CatalogProduct } from "@/types/catalog";
import { CatalogFilters } from "./CatalogFilters";

interface MobileFilterDrawerProps {
  categories: CatalogCategory[];
  allProducts: CatalogProduct[];
  filterState: CatalogFilterState;
  onFilterChange: (updates: Partial<CatalogFilterState>) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  categories,
  allProducts,
  filterState,
  onFilterChange,
  onResetFilters,
  totalFiltered,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const activeFilterCount =
    (filterState.category ? 1 : 0) +
    filterState.brands.length +
    (filterState.onlyOffers ? 1 : 0) +
    (filterState.availability !== "all" ? 1 : 0) +
    (filterState.maxPrice < 500000 ? 1 : 0) +
    (filterState.presentation ? 1 : 0);

  const sortOptions = [
    { value: "relevance", label: "Relevancia FarmaBoy" },
    { value: "best_sellers", label: "Más vendidos" },
    { value: "price_asc", label: "Menor precio primero" },
    { value: "price_desc", label: "Mayor precio primero" },
    { value: "newest", label: "Novedades" },
    { value: "rating", label: "Mejor calificados" },
  ];

  return (
    <>
      {/* Sticky Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-lg flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtros {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSortOpen(true)}
          className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>Ordenar</span>
        </button>
      </div>

      {/* Filter Sheet Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-base">Filtros de Catálogo</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="p-4 overflow-y-auto flex-1">
              <CatalogFilters
                categories={categories}
                allProducts={allProducts}
                filterState={filterState}
                onFilterChange={onFilterChange}
                onResetFilters={onResetFilters}
                totalFiltered={totalFiltered}
              />
            </div>

            {/* Bottom CTA */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2"
              >
                <span>Ver {totalFiltered} productos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Sheet Modal */}
      {isSortOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsSortOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl shadow-2xl p-5 z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Ordenar por</h3>
              <button
                type="button"
                onClick={() => setIsSortOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onFilterChange({ sortBy: opt.value as any, page: 1 });
                    setIsSortOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${
                    filterState.sortBy === opt.value
                      ? "bg-emerald-50 text-emerald-800 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{opt.label}</span>
                  {filterState.sortBy === opt.value && (
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
