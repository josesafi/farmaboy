"use client";

import React, { useState } from "react";
import {
  Filter,
  RotateCcw,
  Search,
  Check,
  Tag,
  ShieldCheck,
  DollarSign,
  Layers,
} from "lucide-react";
import { CatalogCategory, CatalogFilterState, CatalogProduct } from "@/types/catalog";

interface CatalogFiltersProps {
  categories: CatalogCategory[];
  allProducts: CatalogProduct[];
  filterState: CatalogFilterState;
  onFilterChange: (updates: Partial<CatalogFilterState>) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  categories,
  allProducts,
  filterState,
  onFilterChange,
  onResetFilters,
  totalFiltered,
}) => {
  const [brandSearch, setBrandSearch] = useState("");

  // Extract unique brands with counts
  const brandCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    allProducts.forEach((p) => {
      if (p.brand) {
        map.set(p.brand, (map.get(p.brand) || 0) + 1);
      }
    });
    return Array.from(map.entries())
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count);
  }, [allProducts]);

  const filteredBrands = brandCounts.filter((b) =>
    b.brand.toLowerCase().includes(brandSearch.toLowerCase().trim())
  );

  // Extract unique presentations
  const presentations = React.useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => {
      if (p.presentation) set.add(p.presentation);
    });
    return Array.from(set).slice(0, 8);
  }, [allProducts]);

  const handleCategorySelect = (slug: string) => {
    onFilterChange({
      category: filterState.category === slug ? "" : slug,
      page: 1,
    });
  };

  const handleBrandToggle = (brand: string) => {
    const isSelected = filterState.brands.includes(brand);
    const newBrands = isSelected
      ? filterState.brands.filter((b) => b !== brand)
      : [...filterState.brands, brand];
    onFilterChange({ brands: newBrands, page: 1 });
  };

  const hasActiveFilters =
    Boolean(filterState.category) ||
    filterState.brands.length > 0 ||
    filterState.onlyOffers ||
    filterState.availability !== "all" ||
    filterState.minPrice > 0 ||
    filterState.maxPrice < 500000 ||
    Boolean(filterState.presentation) ||
    Boolean(filterState.search);

  const formatCOP = (val: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
      {/* Header with clear filters */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-700" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
            Filtros
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Categorías
        </h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => handleCategorySelect("")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              !filterState.category
                ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>Todas las categorías</span>
            <span className="text-[11px] text-slate-400 font-normal">
              ({allProducts.length})
            </span>
          </button>
          {categories.map((cat) => {
            const count = allProducts.filter(
              (p) => p.categorySlug === cat.slug
            ).length;
            const isSelected = filterState.category === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span>{cat.emoji}</span>
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability & Offers Quick Toggles */}
      <div className="pt-4 border-t border-slate-100 space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Disponibilidad y Promociones
        </h3>
        <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterState.onlyOffers}
            onChange={(e) =>
              onFilterChange({ onlyOffers: e.target.checked, page: 1 })
            }
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span className="font-semibold text-rose-600">
            🔥 Solo ofertas y descuentos
          </span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filterState.availability === "in_stock"}
            onChange={(e) =>
              onFilterChange({
                availability: e.target.checked ? "in_stock" : "all",
                page: 1,
              })
            }
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span>🟢 Solo disponibles para entrega inmediata</span>
        </label>
      </div>

      {/* Price Range Slider */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Rango de Precio
          </h3>
          <span className="text-xs font-bold text-slate-700">
            Hasta {formatCOP(filterState.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={5000}
          max={500000}
          step={5000}
          value={filterState.maxPrice}
          onChange={(e) =>
            onFilterChange({ maxPrice: Number(e.target.value), page: 1 })
          }
          className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>$ 5.000</span>
          <span>$ 500.000+</span>
        </div>
      </div>

      {/* Brands Filter */}
      <div className="pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Marca o Laboratorio
        </h3>
        {brandCounts.length > 5 && (
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar marca..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        )}
        <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
          {filteredBrands.map(({ brand, count }) => {
            const isChecked = filterState.brands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none py-0.5"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span className={`${isChecked ? "font-bold text-emerald-800" : ""}`}>
                    {brand}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Presentations */}
      {presentations.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Presentación
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {presentations.map((p) => {
              const isSelected = filterState.presentation === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    onFilterChange({
                      presentation: isSelected ? "" : p,
                      page: 1,
                    })
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
