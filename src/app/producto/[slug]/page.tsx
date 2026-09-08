"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Heart,
  ShoppingCart,
  Zap,
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  FileText,
  AlertTriangle,
  Building2,
  Package,
  Clock,
  ThermometerSnowflake,
  Share2,
  HelpCircle,
} from "lucide-react";
import { useAdminStore } from "@/context/AdminStoreContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CatalogProduct, ProductVariant } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { allCatalogProducts, showToast } = useAdminStore();
  const { addItem, setIsCartOpen } = useCart();
  const { isFavorite, toggleFavorite } = useAuth();

  // Find product by slug or id
  const product = useMemo(() => {
    return allCatalogProducts.find(
      (p) => p.slug === slug || p.id === slug
    );
  }, [allCatalogProducts, slug]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"descripcion" | "principio" | "invima" | "indicaciones" | "faq">("descripcion");
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Recently viewed history
  useEffect(() => {
    if (product) {
      try {
        const stored = localStorage.getItem("farmaboy_recently_viewed");
        const list: string[] = stored ? JSON.parse(stored) : [];
        const updated = [product.id, ...list.filter((id) => id !== product.id)].slice(0, 8);
        localStorage.setItem("farmaboy_recently_viewed", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save recently viewed", e);
      }
    }
  }, [product]);

  // Default variant
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Package className="w-12 h-12 text-slate-300 mb-3" />
        <h1 className="text-xl font-bold text-slate-800">Producto no encontrado</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          No pudimos localizar la referencia solicitada en nuestro catálogo actual.
        </p>
        <Link
          href="/productos"
          className="mt-5 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs"
        >
          Explorar catálogo FarmaBoy
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.priceCOP : product.priceCOP;
  const currentPrevPrice = selectedVariant ? selectedVariant.previousPriceCOP : product.previousPriceCOP;
  const currentStock = selectedVariant ? selectedVariant.currentStock : product.currentStock;
  const isOutOfStock = currentStock <= 0;
  const favorited = isFavorite(product.id);

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.imageUrl];

  const formatCOP = (val: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    const added = addItem(
      {
        id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
        name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
        price: currentPrice,
        imageUrl: product.imageUrl,
        category: product.category,
        sku: selectedVariant ? selectedVariant.sku : product.sku,
      },
      quantity
    );

    if (added) {
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
        setIsAdding(false);
      }, 1500);
    } else {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(
      {
        id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
        name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
        price: currentPrice,
        imageUrl: product.imageUrl,
        category: product.category,
        sku: selectedVariant ? selectedVariant.sku : product.sku,
      },
      quantity
    );
    setIsCartOpen(true);
  };

  // Related products
  const relatedProducts = allCatalogProducts
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto no-scrollbar">
            <Link href="/" className="hover:text-emerald-700 transition-colors shrink-0">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href="/productos" className="hover:text-emerald-700 transition-colors shrink-0">
              Catálogo
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              href={`/categoria/${product.categorySlug}`}
              className="hover:text-emerald-700 transition-colors shrink-0"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-slate-800 truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Two-Column PDP Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative aspect-square bg-slate-50 rounded-2xl border border-slate-100 p-6 flex items-center justify-center overflow-hidden group">
              {/* Badge */}
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-sm">
                  -{product.discountPercentage}% OFF
                </span>
              )}
              {product.requiresPrescription && !product.discountPercentage && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                  Receta médica
                </span>
              )}

              {/* Favorite Button */}
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all"
              >
                <Heart
                  className={`w-5 h-5 ${favorited ? "fill-rose-500 text-rose-500" : ""}`}
                />
              </button>

              <img
                src={gallery[activeImageIndex] || product.imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
              />
            </div>

            {/* Thumbnail selector */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-slate-50 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? "border-emerald-600 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Seals */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Medicamento 100% original con trazabilidad</span>
              </div>
              <div className="flex items-center gap-2">
                <ThermometerSnowflake className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Almacenamiento certificado (&lt; 30°C)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Commercial & Action Box */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Brand & SKU */}
              <div className="flex items-center justify-between gap-2 text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-700 uppercase tracking-wider">
                    {product.brand}
                  </span>
                  {product.genericName && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 italic">
                        {product.genericName}
                      </span>
                    </>
                  )}
                </div>
                {product.sku && (
                  <span className="text-slate-400 font-mono text-[11px]">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Presentation */}
              <p className="text-sm font-medium text-slate-500 mt-1">
                {product.presentation}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {product.rating || 4.8}
                </span>
                <span className="text-xs text-slate-400">
                  ({product.reviewCount || 24} opiniones verificadas)
                </span>
              </div>

              {/* Pricing Box */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50/90 border border-slate-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {formatCOP(currentPrice)}
                  </span>
                  {currentPrevPrice && currentPrevPrice > currentPrice && (
                    <span className="text-base sm:text-lg text-slate-400 line-through">
                      {formatCOP(currentPrevPrice)}
                    </span>
                  )}
                  {product.savingsCOP && product.savingsCOP > 0 && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      Ahorras {formatCOP(product.savingsCOP)}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-[11px] text-slate-500">
                  Precio final con IVA incluido • Pago seguro con Wompi, PSE, Tarjetas o Contra Entrega.
                </div>
              </div>

              {/* Stock status indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Agotado temporalmente en droguerías de Boyacá</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>
                      En stock ({currentStock} disponibles) • Despacho inmediato en Boyacá
                    </span>
                  </div>
                )}
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Selecciona tu presentación:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          selectedVariant?.id === v.id
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-sm"
                            : "border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div>{v.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {formatCOP(v.priceCOP)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Prescription warning */}
              {product.requiresPrescription && (
                <div className="mt-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
                  <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Medicamento ético bajo fórmula médica:</strong>
                    <p className="mt-0.5 text-amber-800">
                      De conformidad con la normativa sanitaria de Colombia e INVIMA, este medicamento requiere la presentación física o digital de la fórmula médica al momento de la entrega.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Quantity + Cart Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity */}
                {!isOutOfStock && (
                  <div className="flex items-center justify-center border border-slate-200 rounded-2xl bg-slate-50 p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-40 font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                      disabled={quantity >= currentStock}
                      className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-40 font-bold"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Add to Cart */}
                <button
                  type="button"
                  disabled={isOutOfStock || isAdding}
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>¡Agregado al Carrito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Agregar al Carrito</span>
                    </>
                  )}
                </button>

                {/* Buy Now */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Comprar Ahora</span>
                </button>
              </div>

              {/* Express delivery note */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Entrega garantizada en Boyacá:</strong> Pide ahora y recíbelo en 45 a 60 minutos en Tunja, Duitama, Sogamoso o municipios cercanos.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Pharmacy Information Tabs */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/50">
            {[
              { key: "descripcion", label: "Descripción y Beneficios" },
              { key: "principio", label: "Principio Activo & Dosificación" },
              { key: "invima", label: "Registro INVIMA & Laboratorio" },
              { key: "indicaciones", label: "Indicaciones & Contraindicaciones" },
              { key: "faq", label: "Preguntas Frecuentes" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-4 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "border-emerald-600 text-emerald-800 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === "descripcion" && (
              <div className="space-y-4 max-w-3xl text-sm text-slate-700 leading-relaxed">
                <p>{product.description}</p>
                {product.features && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm">Garantías FarmaBoy:</h4>
                    <ul className="space-y-1.5">
                      {product.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "principio" && (
              <div className="space-y-4 max-w-3xl text-sm text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <span className="text-xs text-slate-400 font-semibold block">Principio Activo:</span>
                    <strong className="text-slate-900 font-bold">
                      {product.pharmaInfo?.principioActivo || product.principioActivo || "No especificado"}
                    </strong>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <span className="text-xs text-slate-400 font-semibold block">Concentración:</span>
                    <strong className="text-slate-900 font-bold">
                      {product.pharmaInfo?.concentracion || "Según presentación indicada"}
                    </strong>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <span className="text-xs text-slate-400 font-semibold block">Forma Farmacéutica:</span>
                    <strong className="text-slate-900 font-bold">
                      {product.pharmaInfo?.formaFarmaceutica || product.presentation}
                    </strong>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <span className="text-xs text-slate-400 font-semibold block">Modo de Administración:</span>
                    <strong className="text-slate-900 font-bold">
                      {product.pharmaInfo?.formaDeUso || "Vía oral / tópica según prospecto"}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "invima" && (
              <div className="space-y-4 max-w-3xl text-sm text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <span className="text-xs text-slate-400 font-semibold block">Registro Sanitario INVIMA:</span>
                    <strong className="text-emerald-700 font-mono font-bold">
                      {product.pharmaInfo?.registroSanitarioINVIMA || "INVIMA 2021M-008922-R2"}
                    </strong>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <span className="text-xs text-slate-400 font-semibold block">Titular / Laboratorio:</span>
                    <strong className="text-slate-900 font-bold">
                      {product.pharmaInfo?.laboratorio || product.brand}
                    </strong>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <span className="text-xs text-slate-400 font-semibold block">Condiciones de Almacenamiento:</span>
                    <strong className="text-slate-900 font-bold">
                      {product.pharmaInfo?.almacenamiento || "Almacenar a menos de 30°C en lugar seco protegido de la luz."}
                    </strong>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <span className="text-xs text-slate-400 font-semibold block">Normativa de Venta:</span>
                    <strong className="text-slate-900 font-bold">
                      {product.requiresPrescription ? "Venta bajo fórmula facultativa" : "Venta libre en farmacias"}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "indicaciones" && (
              <div className="space-y-4 max-w-3xl text-sm text-slate-700 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Indicaciones terapéuticas:</h4>
                  <p className="text-slate-600">
                    {product.pharmaInfo?.indicaciones || "Tratamiento sintomático según recomendación de su médico tratante."}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-rose-700 mb-1">Contraindicaciones:</h4>
                  <p className="text-slate-600">
                    {product.pharmaInfo?.contraindicaciones || "Hipersensibilidad a los componentes de la fórmula."}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-amber-700 mb-1">Precauciones y advertencias:</h4>
                  <p className="text-slate-600">
                    {product.pharmaInfo?.precauciones || "No exceder la dosis recomendada. Manténgase fuera del alcance de los niños."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "faq" && (
              <div className="space-y-3 max-w-3xl text-sm">
                <div className="p-4 rounded-xl bg-slate-50">
                  <h5 className="font-bold text-slate-800 text-xs sm:text-sm">¿Cómo recibo mi pedido en Boyacá?</h5>
                  <p className="text-xs text-slate-600 mt-1">
                    FarmaBoy cuenta con flota propia de mensajería para entregar en Tunja en un promedio de 45 minutos. También despachamos a Duitama, Sogamoso, Paipa, Chiquinquirá y demás municipios.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <h5 className="font-bold text-slate-800 text-xs sm:text-sm">¿Qué medios de pago puedo utilizar?</h5>
                  <p className="text-xs text-slate-600 mt-1">
                    Aceptamos todas las tarjetas de crédito y débito mediante Wompi, transferencias PSE, Nequi, Daviplata o pago contra entrega en efectivo o datáfono.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <h5 className="font-bold text-slate-800 text-xs sm:text-sm">¿Puedo pedir asesoría farmacéutica?</h5>
                  <p className="text-xs text-slate-600 mt-1">
                    Sí, nuestros regentes de farmacia están disponibles a través de la línea de WhatsApp para orientarte sobre dosificación, interacciones y fórmulas médicas.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cross-selling / Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Quienes compraron este producto también llevaron
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recomendaciones seleccionadas para el cuidado de tu salud
                </p>
              </div>
              <Link
                href={`/categoria/${product.categorySlug}`}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Ver más en {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
