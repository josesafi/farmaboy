import { PharmaceuticalInfo } from "./admin";

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Caja x 30 tabletas"
  presentation: string; // e.g. "30 tabletas"
  priceCOP: number;
  previousPriceCOP?: number;
  currentStock: number;
  sku: string;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  genericName?: string;
  brand: string;
  category: string;
  categorySlug: string;
  subCategory?: string;
  presentation: string;
  priceCOP: number;
  previousPriceCOP?: number;
  discountPercentage?: number;
  savingsCOP?: number;
  currentStock: number;
  minStock: number;
  status: "ACTIVO" | "INACTIVO" | "AGOTADO";
  isActive: boolean;
  imageUrl: string;
  gallery: string[];
  description: string;
  shortDescription: string;
  badge?: "OFERTA" | "NUEVO" | "MÁS VENDIDO" | "EXCLUSIVO ONLINE" | "-20%" | "-25%" | string;
  isOffer?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  requiresPrescription?: boolean;
  isRestrictedOnline?: boolean;
  pharmaInfo?: PharmaceuticalInfo;
  sku: string;
  barcode?: string;
  principioActivo?: string;
  formaFarmaceutica?: string;
  variants?: ProductVariant[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  features?: string[];
  usageInstructions?: string;
  warnings?: string;
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  iconName: string;
  description: string;
  imageUrl?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  badge?: string;
}

export interface CatalogCardConfig {
  showBrand: boolean;
  showSku: boolean;
  showDiscount: boolean;
  showSavingsBadge: boolean;
  showStockIndicator: boolean;
  showFavorites: boolean;
  showQuickView: boolean;
  showRating: boolean;
  desktopColumns: 3 | 4;
  borderRadius: "rounded-xl" | "rounded-2xl" | "rounded-3xl";
  buttonStyle: "solid" | "outline";
}

export interface CatalogFilterState {
  search: string;
  category: string;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  availability: "all" | "in_stock" | "out_of_stock";
  onlyOffers: boolean;
  presentation: string;
  activeIngredient: string;
  sortBy: "relevance" | "best_sellers" | "price_asc" | "price_desc" | "newest" | "rating";
  page: number;
}
