import { CatalogCategory, CatalogCardConfig, CatalogProduct } from "@/types/catalog";
import { MedicineItem, RetailProductItem, PromotionCampaign } from "@/types/admin";

export const initialCategories: CatalogCategory[] = [
  {
    id: "cat-medicamentos",
    name: "Medicamentos",
    slug: "medicamentos",
    emoji: "💊",
    iconName: "Pill",
    description: "Analgésicos, antibióticos, control cardiovascular, respiratorio y salud digestiva.",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    order: 1,
    isActive: true,
    badge: "Esencial",
    seoTitle: "Medicamentos en Boyacá | Farmaboy",
    seoDescription: "Compra medicamentos genéricos, éticos y de control con dispensación certificada y envíos rápidos en Tunja y todo Boyacá.",
  },
  {
    id: "cat-cuidado-personal",
    name: "Cuidado Personal",
    slug: "cuidado-personal",
    emoji: "🧴",
    iconName: "Sparkles",
    description: "Higiene corporal, hidratación de la piel, cuidado capilar y protección diaria.",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    order: 2,
    isActive: true,
    seoTitle: "Cuidado Personal y Corporal | Farmaboy",
    seoDescription: "Productos de higiene y cuidado personal seleccionados por profesionales de la salud en Boyacá.",
  },
  {
    id: "cat-dermocosmetica",
    name: "Dermocosmética",
    slug: "dermocosmetica",
    emoji: "✨",
    iconName: "Shield",
    description: "Protectores solares de amplio espectro, serums dermatológicos y limpiadores faciales.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    order: 3,
    isActive: true,
    badge: "Dermatología",
    seoTitle: "Dermocosmética y Cuidado de la Piel | Farmaboy",
    seoDescription: "Líneas dermatológicas avanzadas recomendadas por especialistas en salud cutánea en Boyacá.",
  },
  {
    id: "cat-vitaminas",
    name: "Vitaminas y Suplementos",
    slug: "vitaminas-y-suplementos",
    emoji: "🌿",
    iconName: "Activity",
    description: "Refuerzo inmunológico, multivitamínicos, calcio, omega 3, magnesio y colágeno hidrolizado.",
    imageUrl: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80",
    order: 4,
    isActive: true,
    seoTitle: "Vitaminas y Suplementos en Boyacá | Farmaboy",
    seoDescription: "Mejora tu vitalidad y defensas con suplementos de calidad garantizada en Farmaboy.",
  },
  {
    id: "cat-bebes",
    name: "Bebés y Maternidad",
    slug: "bebes",
    emoji: "👶",
    iconName: "Heart",
    description: "Fórmulas infantiles, pañales ultra absorbentes, cremas antipañalitis y accesorios pediátricos.",
    imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
    order: 5,
    isActive: true,
    seoTitle: "Cuidado del Bebé y Maternidad | Farmaboy",
    seoDescription: "Todo para el bienestar y la nutrición de tu bebé con entrega a domicilio en Boyacá.",
  },
  {
    id: "cat-dispositivos",
    name: "Dispositivos Médicos",
    slug: "dispositivos-medicos",
    emoji: "🩺",
    iconName: "Stethoscope",
    description: "Tensiómetros digitales, glucómetros, termómetros infrarrojos, oxímetros y nebulizadores.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    order: 6,
    isActive: true,
    badge: "Monitoreo",
    seoTitle: "Dispositivos Médicos y Diagnóstico | Farmaboy",
    seoDescription: "Equipos de monitoreo y diagnóstico para el hogar con calibración y precisión médica.",
  },
  {
    id: "cat-higiene",
    name: "Higiene y Salud Oral",
    slug: "higiene",
    emoji: "🧼",
    iconName: "Smile",
    description: "Enjuagues bucales medicados, sedas dentales, jabones antisépticos y cuidado íntimo.",
    imageUrl: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80",
    order: 7,
    isActive: true,
    seoTitle: "Higiene y Salud Oral | Farmaboy",
    seoDescription: "Productos esenciales de higiene personal y salud oral con respaldo farmacéutico.",
  },
  {
    id: "cat-salud-sexual",
    name: "Salud Sexual y Reproductiva",
    slug: "salud-sexual",
    emoji: "❤️",
    iconName: "HeartHandshake",
    description: "Preservativos de alta sensibilidad, lubricantes hipoalergénicos y pruebas de embarazo rápidas.",
    imageUrl: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=600&q=80",
    order: 8,
    isActive: true,
    seoTitle: "Salud Sexual y Planificación | Farmaboy",
    seoDescription: "Cuidado, protección y bienestar íntimo con entrega 100% discreta en Boyacá.",
  },
  {
    id: "cat-belleza",
    name: "Belleza y Bienestar",
    slug: "belleza",
    emoji: "💄",
    iconName: "Award",
    description: "Tratamientos capilares reparadores, bálsamos labiales y aromaterapia relajante.",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    order: 9,
    isActive: true,
    seoTitle: "Belleza y Cuidado Estético | Farmaboy",
    seoDescription: "Productos de belleza respaldados con formulaciones seguras y suaves con tu piel.",
  },
  {
    id: "cat-ofertas",
    name: "Ofertas y Descuentos",
    slug: "ofertas",
    emoji: "🔥",
    iconName: "Tag",
    description: "Promociones vigentes con descuentos de hasta el 35% en marcas seleccionadas.",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80",
    order: 10,
    isActive: true,
    badge: "Ahorro",
    seoTitle: "Ofertas de Farmacia en Boyacá | Farmaboy",
    seoDescription: "Descubre los mejores descuentos en medicamentos y productos de salud hoy en Farmaboy.",
  },
];

export const initialCatalogCardConfig: CatalogCardConfig = {
  showBrand: true,
  showSku: true,
  showDiscount: true,
  showSavingsBadge: true,
  showStockIndicator: true,
  showFavorites: true,
  showQuickView: true,
  showRating: false,
  desktopColumns: 4,
  borderRadius: "rounded-2xl",
  buttonStyle: "solid",
};

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

export function mapCategoryToSlug(categoryName: string): string {
  const norm = categoryName.toLowerCase();
  if (norm.includes("medicamento") || norm.includes("salud") || norm.includes("etico")) return "medicamentos";
  if (norm.includes("dermo") || norm.includes("solar") || norm.includes("facial")) return "dermocosmetica";
  if (norm.includes("vitamina") || norm.includes("suplemento") || norm.includes("nutricion")) return "vitaminas-y-suplementos";
  if (norm.includes("bebe") || norm.includes("infantil") || norm.includes("pañal")) return "bebes";
  if (norm.includes("personal") || norm.includes("corporal")) return "cuidado-personal";
  if (norm.includes("higiene") || norm.includes("oral") || norm.includes("dental")) return "higiene";
  if (norm.includes("dispositivo") || norm.includes("equipo") || norm.includes("presion")) return "dispositivos-medicos";
  if (norm.includes("sexual") || norm.includes("intimo") || norm.includes("preservativo")) return "salud-sexual";
  if (norm.includes("belleza") || norm.includes("estetica")) return "belleza";
  return slugify(categoryName);
}

export function enrichProductToCatalog(
  item: MedicineItem | RetailProductItem,
  type: "medicine" | "retail",
  campaigns: PromotionCampaign[] = []
): CatalogProduct {
  const isMed = type === "medicine";
  const med = isMed ? (item as MedicineItem) : null;
  const ret = !isMed ? (item as RetailProductItem) : null;

  const name = item.name;
  const slug = slugify(name);
  const brand = med ? (med.pharmaInfo?.laboratorio?.split(" ")[0] || med.supplier?.split(" ")[0] || "Genfar / MK") : (ret?.brand || "FarmaBoy");

  const basePrice = med ? (med.salePriceCOP) : (ret?.priceCOP || 15000);
  let price = med ? (med.priceCOP || med.salePriceCOP) : (ret?.promoPriceCOP || ret?.priceCOP || 15000);
  let prevPrice = med ? med.previousPriceCOP : (ret?.promoPriceCOP ? ret.priceCOP : undefined);

  // CRON / Campaigns Engine Simulation:
  // Apply active campaigns logic
  const now = new Date();
  const activeCampaigns = campaigns.filter(c => 
    c.status === "ACTIVA" && 
    new Date(c.startDate) <= now && 
    new Date(c.endDate) > now
  ).sort((a, b) => a.priority - b.priority); // Highest priority first (1 is highest)

  // Check if product is in any active campaign
  for (const campaign of activeCampaigns) {
    const promoProduct = campaign.products.find(p => p.productId === item.id);
    if (promoProduct) {
      prevPrice = basePrice; // The original price becomes the previous price
      price = promoProduct.promoPriceCOP;
      break; // Apply only the highest priority campaign
    }
  }

  let discountPercentage = 0;
  let savingsCOP = 0;
  if (prevPrice && prevPrice > price) {
    savingsCOP = prevPrice - price;
    discountPercentage = Math.round((savingsCOP / prevPrice) * 100);
  }

  const currentStock = item.currentStock ?? 0;
  const minStock = item.minStock ?? 5;
  const status = currentStock <= 0 ? "AGOTADO" : (item.status || "ACTIVO");
  const isActive = item.isActive !== false && status !== "INACTIVO";

  let badge: string | undefined = undefined;
  if (discountPercentage > 0) {
    badge = `-${discountPercentage}%`;
  } else if (med?.requiresPrescription) {
    badge = "Bajo Receta";
  } else if (currentStock > 40) {
    badge = "MÁS VENDIDO";
  }

  // Extract presentation from name or defaults
  let presentation = "Unidad";
  if (name.toLowerCase().includes("tab")) {
    const match = name.match(/(\d+\s*(tab|tabletas|capsulas|cápsulas))/i);
    presentation = match ? match[0] : "Tabletas";
  } else if (name.toLowerCase().includes("ml")) {
    const match = name.match(/(\d+\s*ml)/i);
    presentation = match ? match[0] : "Frasco";
  } else if (name.toLowerCase().includes("g")) {
    const match = name.match(/(\d+\s*g)/i);
    presentation = match ? match[0] : "Tubo";
  }

  const categoryName = item.category || "Medicamentos";
  const categorySlug = mapCategoryToSlug(categoryName);

  const variants = item.variants;

  return {
    id: item.id,
    slug,
    name,
    genericName: med?.genericName,
    brand,
    category: categoryName,
    categorySlug,
    subCategory: med?.subCategory,
    presentation,
    priceCOP: price,
    previousPriceCOP: prevPrice,
    discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
    savingsCOP: savingsCOP > 0 ? savingsCOP : undefined,
    currentStock,
    minStock,
    status,
    isActive,
    imageUrl: item.imageUrl,
    gallery: (item.gallery && item.gallery.length > 0) ? item.gallery : [item.imageUrl],
    description: item.description || `Producto de alta calidad para el cuidado de la salud distribuido por FarmaBoy en Boyacá.`,
    shortDescription: (item as any).shortDescription || (item as any).shortInfo || name,
    badge,
    isOffer: discountPercentage > 0,
    isNew: currentStock > 35,
    isBestSeller: currentStock > 40,
    requiresPrescription: med?.requiresPrescription || false,
    pharmaInfo: med?.pharmaInfo,
    sku: item.sku,
    barcode: item.barcode,
    principioActivo: med?.pharmaInfo?.principioActivo,
    formaFarmaceutica: med?.pharmaInfo?.formaFarmaceutica,
    variants,
    rating: 4.8,
    reviewCount: Math.floor(15 + (item.id.charCodeAt(item.id.length - 1) % 40)),
    salesCount: currentStock > 0 ? Math.floor(50 + (item.id.charCodeAt(0) * 2)) : 10,
    features: [
      "Producto 100% original garantizado",
      "Registro sanitario INVIMA vigente",
      "Almacenamiento bajo control de temperatura y humedad",
      "Envío rápido en Tunja, Duitama, Sogamoso y todo Boyacá",
    ],
    usageInstructions: med?.pharmaInfo?.formaDeUso || "Consumir o aplicar según las indicaciones del fabricante o la prescripción médica.",
    warnings: med?.pharmaInfo?.contraindicaciones || "Manténgase fuera del alcance de los niños. Si los síntomas persisten, consulte a su médico.",
  };
}
