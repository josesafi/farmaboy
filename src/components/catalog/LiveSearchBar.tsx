"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Pill,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Check,
  TrendingUp,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { useCart } from "@/context/CartContext";
import { CatalogProduct } from "@/types/catalog";

interface LiveSearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSelect?: () => void;
  isMobile?: boolean;
}

// Helper to remove accents for diacritic-insensitive searching
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Highlight matched substring
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || !text) return <>{text}</>;
  const normQuery = normalizeString(query);
  const normText = normalizeString(text);
  const idx = normText.indexOf(normQuery);

  if (idx === -1) return <>{text}</>;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);

  return (
    <>
      {before}
      <mark className="bg-amber-200/80 text-slate-900 font-black rounded-xs px-0.5 not-italic">
        {match}
      </mark>
      {after}
    </>
  );
}

const POPULAR_SEARCHES = [
  "Naproxeno",
  "Dolex Forte",
  "Acetaminofén",
  "Suero Oral",
  "Protector Solar",
  "Pañales Huggies",
  "Vitamina C",
  "Loratadina",
];

export const LiveSearchBar: React.FC<LiveSearchBarProps> = ({
  className = "",
  placeholder = "¿Qué medicamento buscas? (ej. Naproxeno, Dolex...)",
  autoFocus = false,
  onSelect,
  isMobile = false,
}) => {
  const router = useRouter();
  const { allCatalogProducts, categories } = useAdminStore();
  const { addItem } = useCart();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = useMemo(() => normalizeString(query), [query]);

  // Fast memoized matching products
  const matchingProducts = useMemo(() => {
    if (!normalizedQuery || normalizedQuery.length < 1) return [];

    return allCatalogProducts
      .filter((p) => {
        const nameNorm = normalizeString(p.name);
        const genericNorm = p.genericName ? normalizeString(p.genericName) : "";
        const activeNorm = p.principioActivo ? normalizeString(p.principioActivo) : "";
        const brandNorm = p.brand ? normalizeString(p.brand) : "";
        const catNorm = p.category ? normalizeString(p.category) : "";
        const skuNorm = p.sku ? normalizeString(p.sku) : "";

        return (
          nameNorm.includes(normalizedQuery) ||
          genericNorm.includes(normalizedQuery) ||
          activeNorm.includes(normalizedQuery) ||
          brandNorm.includes(normalizedQuery) ||
          catNorm.includes(normalizedQuery) ||
          skuNorm.includes(normalizedQuery)
        );
      })
      .slice(0, 6);
  }, [allCatalogProducts, normalizedQuery]);

  // Matching categories
  const matchingCategories = useMemo(() => {
    if (!normalizedQuery || normalizedQuery.length < 2) return [];
    return categories
      .filter((c) => normalizeString(c.name).includes(normalizedQuery))
      .slice(0, 3);
  }, [categories, normalizedQuery]);

  // Close dropdown on outside click
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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < matchingProducts.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : matchingProducts.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && matchingProducts[selectedIndex]) {
        const selected = matchingProducts[selectedIndex];
        setIsOpen(false);
        if (onSelect) onSelect();
        router.push(`/producto/${selected.slug}`);
      } else if (query.trim()) {
        handleSubmitSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSubmitSearch = (targetQuery?: string) => {
    const q = (targetQuery ?? query).trim();
    setIsOpen(false);
    if (onSelect) onSelect();
    if (q) {
      router.push(`/productos?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/productos");
    }
  };

  const handleClear = () => {
    setQuery("");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleQuickAdd = (e: React.MouseEvent, product: CatalogProduct) => {
    e.stopPropagation();
    e.preventDefault();

    addItem({
      id: product.id,
      name: product.name,
      price: product.priceCOP,
      imageUrl: product.imageUrl,
      category: product.category,
      sku: product.sku,
    });

    // Animate button state
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const formatCOP = (val: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Bar Capsule Container matching user reference mockup */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitSearch();
        }}
        className="w-full relative"
      >
        {/* Outer Green Ring + Inner Blue Ring Capsule */}
        <div className="rounded-full p-[2px] border-2 border-[#00A86B] bg-white shadow-xs hover:shadow-sm transition-all">
          <div className="rounded-full border-[1.5px] border-[#04428B] bg-white flex items-center pl-3 sm:pl-4 pr-1.5 py-1 sm:py-1.5 transition-all">
            
            {/* Search Icon (Blue stethoscope color) */}
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#04428B] shrink-0 mr-2 sm:mr-2.5 pointer-events-none" />

            {/* Live Search Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                setSelectedIndex(-1);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              autoFocus={autoFocus}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none tracking-normal"
              aria-label="Buscar medicamentos y productos"
              autoComplete="off"
              spellCheck="false"
            />

            {/* Clear Button (X) */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-1 transition-colors"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {/* Green Pill Submit Button "Buscar" */}
            <button
              type="submit"
              className="shrink-0 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-[#00A86B] hover:bg-[#008f5a] active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-xs hover:shadow transition-all"
            >
              Buscar
            </button>
          </div>
        </div>
      </form>

      {/* Live Dropdown Results Card */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ maxHeight: isMobile ? "70vh" : "78vh" }}
        >
          {/* STATE 1: User has typed query and there are results */}
          {normalizedQuery.length >= 1 && matchingProducts.length > 0 && (
            <div>
              {/* Live Search Status Bar */}
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A86B]" />
                  </span>
                  <span className="font-bold text-slate-700">
                    Búsqueda en vivo: &ldquo;{query}&rdquo;
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {matchingProducts.length} coincidencias inmediatas
                </span>
              </div>

              {/* Matching Categories Chips (if any) */}
              {matchingCategories.length > 0 && (
                <div className="px-4 py-2 bg-blue-50/60 border-b border-blue-100 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase text-[#04428B] mr-1">
                    Categorías:
                  </span>
                  {matchingCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categoria/${cat.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        if (onSelect) onSelect();
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#04428B] text-slate-700 hover:text-white rounded-lg text-xs font-bold border border-blue-200/80 shadow-2xs transition-colors"
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Products List */}
              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[50vh]">
                {matchingProducts.map((product, idx) => {
                  const isSelected = selectedIndex === idx;
                  const isAdded = !!addedItemIds[product.id];

                  return (
                    <div
                      key={product.id}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => {
                        setIsOpen(false);
                        if (onSelect) onSelect();
                        router.push(`/producto/${product.slug}`);
                      }}
                      className={`flex items-center justify-between gap-3 p-3 transition-colors cursor-pointer group ${
                        isSelected
                          ? "bg-blue-50/80 border-l-4 border-[#04428B] pl-2"
                          : "hover:bg-slate-50/90"
                      }`}
                    >
                      {/* Left: Image & Product Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white border border-slate-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs group-hover:border-blue-200 transition-colors">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>

                        {/* Text Details */}
                        <div className="min-w-0 flex-1">
                          {/* Brand & Active Ingredient */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black uppercase text-[#04428B] tracking-wider bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                              <HighlightMatch text={product.brand} query={query} />
                            </span>
                            {product.principioActivo && (
                              <span className="text-[10px] font-medium text-slate-500 truncate">
                                • <HighlightMatch text={product.principioActivo} query={query} />
                              </span>
                            )}
                          </div>

                          {/* Product Title */}
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#04428B] transition-colors truncate mt-0.5">
                            <HighlightMatch text={product.name} query={query} />
                          </h4>

                          {/* Presentation & Stock Badge */}
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span>{product.presentation}</span>
                            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                              ✓ En stock Duitama
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Quick Action */}
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="text-right">
                          <span className="block text-xs sm:text-sm font-black text-slate-900">
                            {formatCOP(product.priceCOP)}
                          </span>
                          {product.previousPriceCOP &&
                            product.previousPriceCOP > product.priceCOP && (
                              <span className="block text-[10px] text-slate-400 line-through">
                                {formatCOP(product.previousPriceCOP)}
                              </span>
                            )}
                          {product.discountPercentage && (
                            <span className="inline-block text-[9px] font-extrabold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                              -{product.discountPercentage}%
                            </span>
                          )}
                        </div>

                        {/* Quick Add to Cart Button */}
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(e, product)}
                          className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs shadow-2xs transition-all ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-[#00A86B] hover:bg-[#008f5a] text-white active:scale-95"
                          }`}
                          title="Agregar al carrito de inmediato"
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Listo</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Agregar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dropdown Footer with View All Action */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 hidden sm:inline">
                  Usa <kbd className="px-1 py-0.5 bg-white border rounded text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 bg-white border rounded text-[10px]">↓</kbd> para navegar o <kbd className="px-1 py-0.5 bg-white border rounded text-[10px]">Enter</kbd> para abrir
                </span>
                <button
                  type="button"
                  onClick={() => handleSubmitSearch()}
                  className="inline-flex items-center gap-1.5 font-bold text-[#04428B] hover:text-blue-800 ml-auto bg-white hover:bg-blue-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
                >
                  <span>Ver todos los resultados para &ldquo;{query}&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: User typed query but NO results were found */}
          {normalizedQuery.length >= 1 && matchingProducts.length === 0 && (
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Pill className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                No encontramos productos con &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Prueba buscando por principio activo (ej. Acetaminofén, Naproxeno), por marca o revisa si tiene algún error de escritura.
              </p>

              {/* Suggestions chips */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Búsquedas populares sugeridas:
                </span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {POPULAR_SEARCHES.slice(0, 5).map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: Input is focused but empty (Trending / Quick Suggestions) */}
          {normalizedQuery.length === 0 && (
            <div className="p-4 sm:p-5 space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#FF6B00] mb-2.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Búsquedas frecuentes en FarmaBoy</span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#04428B] text-xs font-bold border border-slate-200/80 shadow-2xs transition-all hover:scale-[1.02]"
                    >
                      <TrendingUp className="w-3 h-3 text-[#FF6B00]" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Categories */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Explorar por categoría principal
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categoria/${cat.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        if (onSelect) onSelect();
                      }}
                      className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-[#04428B] transition-colors"
                    >
                      <span className="text-base">{cat.emoji}</span>
                      <span className="truncate">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
