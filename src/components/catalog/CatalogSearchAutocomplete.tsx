"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Pill, ArrowRight, Tag, Sparkles } from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { CatalogProduct } from "@/types/catalog";

interface CatalogSearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  onSearchSubmit?: (query: string) => void;
}

export const CatalogSearchAutocomplete: React.FC<CatalogSearchAutocompleteProps> = ({
  placeholder = "Buscar medicamentos, principio activo, marca o insumo...",
  className = "",
  onSearchSubmit,
}) => {
  const router = useRouter();
  const { allCatalogProducts, categories } = useAdminStore();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter matches
  const normalizedQuery = query.toLowerCase().trim();

  const matchingProducts = normalizedQuery
    ? allCatalogProducts
        .filter((p) => {
          return (
            p.name.toLowerCase().includes(normalizedQuery) ||
            (p.genericName && p.genericName.toLowerCase().includes(normalizedQuery)) ||
            (p.principioActivo && p.principioActivo.toLowerCase().includes(normalizedQuery)) ||
            p.brand.toLowerCase().includes(normalizedQuery) ||
            p.category.toLowerCase().includes(normalizedQuery) ||
            (p.sku && p.sku.toLowerCase().includes(normalizedQuery))
          );
        })
        .slice(0, 6)
    : [];

  const matchingCategories = normalizedQuery
    ? categories
        .filter((c) => c.name.toLowerCase().includes(normalizedQuery))
        .slice(0, 3)
    : [];

  const uniqueBrands = Array.from(
    new Set(allCatalogProducts.map((p) => p.brand).filter(Boolean))
  );
  const matchingBrands = normalizedQuery
    ? uniqueBrands
        .filter((b) => b.toLowerCase().includes(normalizedQuery))
        .slice(0, 3)
    : [];

  const hasResults =
    matchingProducts.length > 0 ||
    matchingCategories.length > 0 ||
    matchingBrands.length > 0;

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsOpen(false);
      if (onSearchSubmit) {
        onSearchSubmit(query);
      } else {
        router.push(`/productos?q=${encodeURIComponent(query)}`);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    if (onSearchSubmit) onSearchSubmit("");
  };

  const formatCOP = (val: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-slate-300 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && normalizedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-40 max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {hasResults ? (
            <div className="divide-y divide-slate-100">
              {/* Matching Categories */}
              {matchingCategories.length > 0 && (
                <div className="p-3 bg-slate-50/70">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-1.5">
                    Categorías sugeridas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchingCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categoria/${cat.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Products */}
              {matchingProducts.length > 0 && (
                <div className="p-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
                    Productos & Medicamentos
                  </span>
                  <div className="space-y-1">
                    {matchingProducts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/producto/${p.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-slate-100 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                              {p.brand}
                            </span>
                            {p.principioActivo && (
                              <span className="text-[10px] text-slate-400 truncate">
                                • {p.principioActivo}
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {p.presentation}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-black text-slate-900 block">
                            {formatCOP(p.priceCOP)}
                          </span>
                          {p.discountPercentage && (
                            <span className="text-[10px] font-bold text-rose-600">
                              -{p.discountPercentage}%
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* View all matching button */}
              <div className="p-3 bg-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Presiona Enter para buscar en todo el catálogo
                </span>
                <Link
                  href={`/productos?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  <span>Ver todos los resultados</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                No encontramos productos con &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Intenta buscar por principio activo (ej. Acetaminofén), marca o categoría.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
