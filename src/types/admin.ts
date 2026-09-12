export type AdminRoleName =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "FARMACEUTICO"
  | "VENTAS"
  | "EDITOR"
  | "SOPORTE";

export type AdminPermission =
  | "all"
  | "medicamentos:read"
  | "medicamentos:write"
  | "productos:read"
  | "productos:write"
  | "inventario:read"
  | "inventario:write"
  | "pedidos:read"
  | "pedidos:write"
  | "clientes:read"
  | "clientes:write"
  | "promociones:read"
  | "promociones:write"
  | "contenido:read"
  | "contenido:write"
  | "diseno:read"
  | "diseno:write"
  | "seo:read"
  | "seo:write"
  | "usuarios:read"
  | "usuarios:write"
  | "configuracion:read"
  | "configuracion:write"
  | "seguridad:read"
  | "seguridad:write";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: AdminRoleName;
  customPermissions?: AdminPermission[];
  avatarUrl?: string;
  lastLogin: string;
  ipAddress?: string;
  isActive: boolean;
}

export interface PharmaceuticalInfo {
  principioActivo: string;
  concentracion: string;
  formaFarmaceutica: string;
  laboratorio: string;
  registroSanitarioINVIMA: string;
  indicaciones: string;
  contraindicaciones: string;
  precauciones: string;
  formaDeUso: string;
  almacenamiento: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  pharmaInfo: PharmaceuticalInfo;
  barcode: string;
  sku: string;
  category: string;
  subCategory?: string;
  imageUrl: string;
  gallery?: string[];
  description: string;
  shortDescription: string;
  costPriceCOP: number;
  salePriceCOP: number;
  priceCOP?: number;
  previousPriceCOP?: number;
  marginPercent: number;
  currentStock: number;
  minStock: number;
  maxStock: number;
  lotNumber: string;
  expiryDate: string; // YYYY-MM-DD
  physicalLocation: string; // e.g. "Estante 3 - Pasillo A"
  requiresPrescription: boolean;
  status: "ACTIVO" | "INACTIVO" | "AGOTADO";
  isActive?: boolean;
  supplier: string;
}

export interface RetailProductItem {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  brand: string;
  description: string;
  shortInfo: string;
  imageUrl: string;
  gallery?: string[];
  priceCOP: number;
  salePriceCOP?: number;
  promoPriceCOP?: number;
  currentStock: number;
  minStock: number;
  weightGrams?: number;
  dimensionsCm?: string;
  status: "ACTIVO" | "INACTIVO" | "AGOTADO";
  isActive?: boolean;
  tags: string[];
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku?: string;
  type: "ENTRADA" | "SALIDA" | "AJUSTE" | "DEVOLUCION";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  referenceDoc?: string;
  lotNumber?: string;
  expiryDate?: string;
  user: string;
  date: string;
  costUnitCOP?: number;
}

export type AdminOrderStatus =
  | "NUEVO"
  | "CONFIRMADO"
  | "PAGADO"
  | "PENDIENTE"
  | "EN_PREPARACION"
  | "PREPARANDO"
  | "LISTO_DESPACHO"
  | "ENVIADO"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "LISTO_RECOGER"
  | "RECOGIDO"
  | "CANCELADO"
  | "DEVUELTO";

export interface AdminOrder {
  id: string; // FB-XXXXX
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDocument: string;
  date: string;
  status: AdminOrderStatus;
  deliveryMethod?: "DOMICILIO" | "PUNTO_RECOGIDA";
  pickupPointId?: string;
  pickupPointName?: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    priceCOP: number;
    imageUrl: string;
    sku?: string;
  }[];
  subtotalCOP: number;
  shippingCOP: number;
  discountCOP: number;
  totalCOP: number;
  paymentMethod: string;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  couponCode?: string;
  customerLifetimeDiscount?: {
    percentage: number;
    amountCOP: number;
    reason?: string;
  };
  isStockRestocked?: boolean;
  cancellationReason?: string;
  paymentProofUrl?: string;
  paymentApprovalCode?: string;
  trackingHistory: {
    status: AdminOrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface NewOrderInput {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerDocument?: string;
  customer?: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    documentType?: string;
    documentNumber?: string;
  };
  deliveryCity?: string;
  deliveryAddress?: string;
  deliveryNotes?: string;
  shippingAddress?: {
    addressLine: string;
    city: string;
    department?: string;
    postalCode?: string;
    deliveryNotes?: string;
  };
  paymentMethod: string;
  deliveryMethod?: "DOMICILIO" | "PUNTO_RECOGIDA";
  pickupPointId?: string;
  pickupPointName?: string;
  couponCode?: string;
  customerLifetimeDiscount?: {
    percentage: number;
    amountCOP: number;
    reason?: string;
  };
  discountCOP?: number;
  subtotalCOP?: number;
  shippingCOP: number;
  totalCOP?: number;
  prescriptionUrl?: string;
  paymentProofUrl?: string;
  paymentApprovalCode?: string;
  initialStatus?: AdminOrderStatus;
  notes?: string;
  items: {
    id?: string;
    productId?: string;
    name?: string;
    productName?: string;
    sku?: string;
    quantity: number;
    priceCOP?: number;
    unitPriceCOP?: number;
    totalCOP?: number;
    imageUrl?: string;
  }[];
}

export interface CustomerCRM {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  city: string;
  address: string;
  registrationDate: string;
  lastLoginDate: string;
  totalOrders: number;
  totalSpentCOP: number;
  averageTicketCOP: number;
  lastOrderDate?: string;
  lastPurchaseDate?: string;
  segment: "NUEVO" | "FRECUENTE" | "INACTIVO" | "VIP" | "MAYORISTA";
  notes?: string;
  tags?: string[];
  lifetimeDiscountPercentage?: number; // 0 a 100, e.g. 10 para 10%
  lifetimeDiscountReason?: string; // Motivo o convenio e.g. "Tratamiento crónico mensual"
  isLifetimeDiscountActive?: boolean; // Activo/inactivo
}

export interface PromotionRule {
  id: string;
  title: string;
  code: string;
  type: "PORCENTAJE" | "FIJO" | "2X1" | "SEGUNDA_UNIDAD_50" | "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number; // e.g. 15 for 15% or 10000 for $10.000 COP
  discountValue?: number;
  maxDiscountCOP?: number;
  minPurchaseCOP: number;
  startDate: string;
  endDate: string;
  maxUsesTotal: number;
  maxUses?: number;
  usedCount: number;
  maxUsesPerCustomer: number;
  applicableCategory?: string;
  applicableProductId?: string;
  isActive: boolean;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  linkUrl: string;
  buttonText: string;
  placement: "HERO_PRINCIPAL" | "OFERTAS_SECUNDARIAS" | "B2B_DESTACADO";
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
}

export interface ThemeColors {
  primary: string; // #00A86B
  primaryDark: string; // #008755
  primaryLight: string; // #10B981
  secondary: string; // #00A896
  accent: string; // #10B981
  promo: string; // #F59E0B
  surface: string; // #FFFFFF
  background: string; // #FFFFFF
  text: string; // #0F172A
}

export interface SiteDesignConfig {
  siteName: string;
  tagline: string;
  colors: ThemeColors;
  fontFamily: "Inter" | "Plus Jakarta Sans" | "Roboto" | "System";
  homepageSections: {
    hero: boolean;
    categories: boolean;
    featuredProducts: boolean;
    dealsBanners: boolean;
    pharmacyServices: boolean;
    muchMore: boolean;
    transportSection: boolean;
    b2bSection: boolean;
    trustSection: boolean;
    faqSection: boolean;
    contactCta: boolean;
  };
  headerNotice: string;
  footerDescription: string;
}

export interface SeoConfig {
  siteTitleDefault: string;
  siteDescriptionDefault: string;
  keywords: string[];
  canonicalBase: string;
  ogImageUrl: string;
  indexEnabled: boolean;
  schemaType: "Pharmacy" | "LocalBusiness" | "Organization";
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  category: string;
  tags: string[];
  publishDate: string;
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CommercialStoreSettings {
  legalName: string;
  brandName: string;
  nit: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  emailGeneral: string;
  addressPrincipal: string;
  city: string;
  department: string;
  operatingHours: string;
  currency: string;
  freeShippingThresholdCOP: number;
  standardShippingCostCOP: number;
  deliveryZones: {
    city: string;
    feeCOP: number;
    estimatedTime: string;
    isActive: boolean;
  }[];
}

export interface IntegrationsConfig {
  wompiPublicKey: string;
  wompiEnvironment: "test" | "prod";
  googleAnalyticsId: string;
  metaPixelId: string;
  googleTagManagerId: string;
  dianElectronicBillingActive: boolean;
}

export interface ActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
}

export interface TrashItem {
  id: string;
  entityType: "MEDICAMENTO" | "PRODUCTO" | "BANNER" | "ARTICULO" | "PROMOCION";
  entityId: string;
  title: string;
  deletedAt: string;
  deletedBy: string;
  originalData: any;
}

export interface DeliveryRate {
  id: string;
  department: string;
  municipality: string;
  zone: string;
  rateCOP: number;
  minOrderCOP?: number;
  freeShippingFromCOP?: number;
  estimatedTime: string;
  isActive: boolean;
}

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  municipality: string;
  phone: string;
  coordinates?: string;
  schedule: string;
  days: string;
  status: "ACTIVO" | "INACTIVO";
  capacityOrdersPerDay?: number;
  prepTimeMinutes: number;
  pickupInstructions: string;
}

export type AdminDashboardPeriod =
  | "HOY"
  | "AYER"
  | "7D"
  | "30D"
  | "ESTE_MES"
  | "MES_ANTERIOR"
  | "CUSTOM";


export type PromotionType = "DESCUENTO_PORCENTUAL" | "PRECIO_ESPECIAL" | "OFERTA_DEL_DIA" | "ENVIO_GRATIS" | "2X1";

export type PromotionStatus = "ACTIVA" | "PROGRAMADA" | "FINALIZADA" | "PAUSADA" | "BORRADOR";

export interface PromotionProduct {
  productId: string;
  sku: string;
  originalPriceCOP: number;
  promoPriceCOP: number;
  discountPercentage: number;
}

export interface PromotionCampaign {
  id: string;
  internalName: string;
  publicTitle: string;
  subtitle?: string;
  description?: string;
  type: PromotionType;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  status: PromotionStatus;
  priority: number; // 1 (Highest) to N
  bannerDesktopUrl?: string;
  bannerMobileUrl?: string;
  products: PromotionProduct[];
  
  // Analytics
  views: number;
  clicks: number;
  cartAdds: number;
  unitsSold: number;
  revenueGeneratedCOP: number;
  
  createdAt: string;
  updatedAt: string;
}

