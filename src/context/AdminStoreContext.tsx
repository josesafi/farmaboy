"use client";

import { CatalogCategory, CatalogCardConfig, CatalogProduct } from "@/types/catalog";
import { initialCategories, initialCatalogCardConfig, enrichProductToCatalog } from "@/config/initialCatalogData";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  AdminUser,
  AdminRoleName,
  AdminPermission,
  MedicineItem,
  RetailProductItem,
  InventoryMovement,
  AdminOrder,
  AdminOrderStatus,
  CustomerCRM,
  PromotionRule,
  BannerItem,
  SiteDesignConfig,
  ThemeColors,
  SeoConfig,
  BlogPost,
  CommercialStoreSettings,
  IntegrationsConfig,
  ActivityLog,
  TrashItem,
  NewOrderInput,
  DeliveryRate,
  PickupPoint,
} from "@/types/admin";
import {
  initialAdminUsers,
  initialMedicines,
  initialRetailProducts,
  initialInventoryMovements,
  initialAdminOrders,
  initialCustomers,
  initialPromotions,
  initialBanners,
  initialSiteDesign,
  initialSeo,
  initialBlogPosts,
  initialStoreSettings,
  initialIntegrations,
  initialActivityLogs,
  initialDeliveryRates,
  initialPickupPoints,
} from "@/config/initialAdminData";

export interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  timestamp: number;
}

interface AdminStoreContextType {
  // Session & Auth
  currentAdmin: AdminUser | null;
  adminUsers: AdminUser[];
  loginAs: (email: string, role?: AdminRoleName) => boolean;
  switchDemoRole: (role: AdminRoleName) => void;
  logout: () => void;
  hasPermission: (permission: AdminPermission) => boolean;
  addAdminUser: (user: Omit<AdminUser, "id" | "lastLogin">) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;

  // Catalog Categories & Design Config
  categories: CatalogCategory[];
  addCategory: (category: Omit<CatalogCategory, "id">) => void;
  updateCategory: (id: string, updates: Partial<CatalogCategory>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (orderedIds: string[]) => void;
  catalogCardConfig: CatalogCardConfig;
  updateCatalogCardConfig: (updates: Partial<CatalogCardConfig>) => void;
  allCatalogProducts: CatalogProduct[];

  // Catalog - Medicines
  medicines: MedicineItem[];
  addMedicine: (item: Omit<MedicineItem, "id">) => void;
  updateMedicine: (id: string, updates: Partial<MedicineItem>) => void;
  deleteMedicine: (id: string) => void;

  // Catalog - Retail Products
  retailProducts: RetailProductItem[];
  addRetailProduct: (item: Omit<RetailProductItem, "id">) => void;
  updateRetailProduct: (id: string, updates: Partial<RetailProductItem>) => void;
  deleteRetailProduct: (id: string) => void;

  // Inventory & Kardex
  inventoryMovements: InventoryMovement[];
  addInventoryMovement: (movement: Omit<InventoryMovement, "id" | "date" | "user">) => void;

  // Orders
  orders: AdminOrder[];
  updateOrderStatus: (orderId: string, status: AdminOrderStatus, note?: string) => void;
  updateOrder: (orderId: string, updates: Partial<AdminOrder>) => void;
  processNewOrder: (input: NewOrderInput) => { success: boolean; orderId?: string; error?: string };
  validatePromotionCode: (code: string, subtotal: number) => { isValid: boolean; discountAmount: number; promotion?: PromotionRule; message: string };
  getPermissionForRoute: (pathname: string) => AdminPermission | null;

  // Customers (CRM)
  customers: CustomerCRM[];
  addCustomer: (cust: Omit<CustomerCRM, "id" | "registrationDate" | "totalOrders" | "totalSpentCOP" | "averageTicketCOP">) => void;
  updateCustomer: (id: string, updates: Partial<CustomerCRM>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerLifetimeDiscount: (identifier: { email?: string; documentNumber?: string; id?: string }) => {
    percentage: number;
    reason: string;
    customer: CustomerCRM;
  } | null;

  // Promotions & Coupons
  promotions: PromotionRule[];
  addPromotion: (promo: Omit<PromotionRule, "id" | "usedCount">) => void;
  updatePromotion: (id: string, updates: Partial<PromotionRule>) => void;
  deletePromotion: (id: string) => void;
  togglePromotionActive: (id: string) => void;

  // Banners & Visual Content
  banners: BannerItem[];
  addBanner: (banner: Omit<BannerItem, "id">) => void;
  updateBanner: (id: string, updates: Partial<BannerItem>) => void;
  deleteBanner: (id: string) => void;
  reorderBanners: (orderedIds: string[]) => void;

  // Design & Appearance
  siteDesign: SiteDesignConfig;
  updateSiteDesign: (updates: Partial<SiteDesignConfig>) => void;
  toggleHomepageSection: (sectionKey: keyof SiteDesignConfig["homepageSections"]) => void;

  // Theme Colors
  themeColors: ThemeColors;
  updateThemeColors: (colors: Partial<ThemeColors>) => void;
  resetThemeColors: () => void;

  // SEO & Marketing
  seo: SeoConfig;
  updateSeo: (updates: Partial<SeoConfig>) => void;

  // Blog CMS
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, "id" | "publishDate">) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  // Commercial Settings
  storeSettings: CommercialStoreSettings;
  updateStoreSettings: (updates: Partial<CommercialStoreSettings>) => void;

  // Delivery Rates & Pickup Points
  deliveryRates: DeliveryRate[];
  addDeliveryRate: (rate: Omit<DeliveryRate, "id">) => void;
  updateDeliveryRate: (id: string, updates: Partial<DeliveryRate>) => void;
  deleteDeliveryRate: (id: string) => void;
  toggleDeliveryRateActive: (id: string) => void;

  pickupPoints: PickupPoint[];
  addPickupPoint: (point: Omit<PickupPoint, "id">) => void;
  updatePickupPoint: (id: string, updates: Partial<PickupPoint>) => void;
  deletePickupPoint: (id: string) => void;
  togglePickupPointActive: (id: string) => void;

  getActiveShippingRate: (municipality?: string) => number;

  // Integrations
  integrations: IntegrationsConfig;
  updateIntegrations: (updates: Partial<IntegrationsConfig>) => void;

  // Activity Audit Log
  activityLogs: ActivityLog[];
  logActivity: (action: string, entity: string, details: string) => void;

  // Trash Bin (Soft delete)
  trash: TrashItem[];
  restoreTrashItem: (trashId: string) => void;
  purgeTrashItem: (trashId: string) => void;
  emptyTrash: () => void;

  // Toasts
  toasts: ToastNotification[];
  showToast: (message: string, type?: "success" | "error" | "info" | "warning") => void;
  removeToast: (id: string) => void;

  // Factory reset
  resetAllToFactoryDefaults: () => void;
}

const STORAGE_KEY = "farmaboy_enterprise_cms_v1";

const AdminStoreContext = createContext<AdminStoreContextType | undefined>(undefined);

export const AdminStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initial state loading
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(initialAdminUsers[0]); // Default to Super Admin for immediate testing
  const [categories, setCategories] = useState<CatalogCategory[]>(initialCategories);
  const [catalogCardConfig, setCatalogCardConfig] = useState<CatalogCardConfig>(initialCatalogCardConfig);
  const [medicines, setMedicines] = useState<MedicineItem[]>(initialMedicines);
  const [retailProducts, setRetailProducts] = useState<RetailProductItem[]>(initialRetailProducts);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(initialInventoryMovements);
  const [orders, setOrders] = useState<AdminOrder[]>(initialAdminOrders);
  const [customers, setCustomers] = useState<CustomerCRM[]>(initialCustomers);
  const [promotions, setPromotions] = useState<PromotionRule[]>(initialPromotions);
  const [banners, setBanners] = useState<BannerItem[]>(initialBanners);
  const [siteDesign, setSiteDesign] = useState<SiteDesignConfig>(initialSiteDesign);
  const [themeColors, setThemeColors] = useState<ThemeColors>(initialSiteDesign.colors);
  const [seo, setSeo] = useState<SeoConfig>(initialSeo);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [storeSettings, setStoreSettings] = useState<CommercialStoreSettings>(initialStoreSettings);
  const [deliveryRates, setDeliveryRates] = useState<DeliveryRate[]>(initialDeliveryRates);
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>(initialPickupPoints);
  const [integrations, setIntegrations] = useState<IntegrationsConfig>(initialIntegrations);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [trash, setTrash] = useState<TrashItem[]>([]);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.adminUsers) setAdminUsers(parsed.adminUsers);
        if (parsed.currentAdmin) setCurrentAdmin(parsed.currentAdmin);
        if (parsed.categories) {
          const existingIds = new Set(parsed.categories.map((c: any) => c.id));
          const missing = initialCategories.filter((c) => !existingIds.has(c.id));
          setCategories([...parsed.categories, ...missing]);
        } else {
          setCategories(initialCategories);
        }
        if (parsed.catalogCardConfig) setCatalogCardConfig(parsed.catalogCardConfig);
        if (parsed.medicines) {
          const cleanedMedicines = parsed.medicines.map((m: any) => {
            if (m.id === "med-02" && (m.imageUrl?.includes("1550572017-edd951aa8f72") || !m.imageUrl)) {
              return { ...m, imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80" };
            }
            return m;
          });
          const existingIds = new Set(cleanedMedicines.map((m: any) => m.id));
          const missing = initialMedicines.filter((m) => !existingIds.has(m.id));
          setMedicines([...cleanedMedicines, ...missing]);
        } else {
          setMedicines(initialMedicines);
        }
        if (parsed.retailProducts) {
          const existingIds = new Set(parsed.retailProducts.map((p: any) => p.id));
          const missing = initialRetailProducts.filter((p) => !existingIds.has(p.id));
          setRetailProducts([...parsed.retailProducts, ...missing]);
        } else {
          setRetailProducts(initialRetailProducts);
        }
        if (parsed.inventoryMovements) setInventoryMovements(parsed.inventoryMovements);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.customers) {
          const mergedCustomers = parsed.customers.map((c: CustomerCRM) => {
            const init = initialCustomers.find((ic) => ic.id === c.id || (ic.documentNumber && ic.documentNumber === c.documentNumber));
            if (init && (c.lifetimeDiscountPercentage === undefined || c.lifetimeDiscountPercentage === null)) {
              return {
                ...c,
                lifetimeDiscountPercentage: init.lifetimeDiscountPercentage,
                lifetimeDiscountReason: init.lifetimeDiscountReason,
                isLifetimeDiscountActive: init.isLifetimeDiscountActive,
              };
            }
            return c;
          });
          setCustomers(mergedCustomers);
        } else {
          setCustomers(initialCustomers);
        }
        if (parsed.promotions) setPromotions(parsed.promotions);
        if (parsed.banners) {
          const upgradedBanners = parsed.banners.map((b: BannerItem) => {
            if (b.id === "ban-01" && (b.imageUrl?.includes("unsplash.com") || !b.imageUrl)) {
              return { ...b, imageUrl: "/images/fachada-farmaboy.jpg" };
            }
            return b;
          });
          setBanners(upgradedBanners);
        }
        if (parsed.siteDesign) setSiteDesign(parsed.siteDesign);
        if (parsed.themeColors) setThemeColors(parsed.themeColors);
        if (parsed.seo) setSeo(parsed.seo);
        if (parsed.blogPosts) setBlogPosts(parsed.blogPosts);
        if (parsed.storeSettings) {
          const updatedSettings = { ...parsed.storeSettings };
          if (!updatedSettings.standardShippingCostCOP || updatedSettings.standardShippingCostCOP === 7000) {
            updatedSettings.standardShippingCostCOP = 5000;
            updatedSettings.city = "Duitama";
          }
          if (
            !updatedSettings.nit ||
            updatedSettings.nit === "901.782.341-8" ||
            updatedSettings.legalName?.includes("Placeholder") ||
            updatedSettings.legalName === "FARMABOY SERVICIOS FARMACÉUTICOS Y ASISTENCIALES S.A.S." ||
            updatedSettings.emailGeneral === "contacto@farmaboy.com.co" ||
            updatedSettings.emailGeneral === "farmaboysas@gmail.com"
          ) {
            updatedSettings.legalName = initialStoreSettings.legalName;
            updatedSettings.nit = initialStoreSettings.nit;
            updatedSettings.phone = initialStoreSettings.phone;
            updatedSettings.phoneDisplay = initialStoreSettings.phoneDisplay;
            updatedSettings.whatsapp = initialStoreSettings.whatsapp;
            updatedSettings.whatsappDisplay = initialStoreSettings.whatsappDisplay;
            updatedSettings.emailGeneral = initialStoreSettings.emailGeneral;
            updatedSettings.addressPrincipal = initialStoreSettings.addressPrincipal;
            updatedSettings.city = initialStoreSettings.city;
          }
          setStoreSettings(updatedSettings);
        }
        if (parsed.deliveryRates) {
          const existingIds = new Set(parsed.deliveryRates.map((r: any) => r.id));
          const missing = initialDeliveryRates.filter((r) => !existingIds.has(r.id));
          setDeliveryRates([...parsed.deliveryRates, ...missing]);
        } else {
          setDeliveryRates(initialDeliveryRates);
        }
        if (parsed.pickupPoints) {
          const existingIds = new Set(parsed.pickupPoints.map((p: any) => p.id));
          const missing = initialPickupPoints.filter((p) => !existingIds.has(p.id));
          setPickupPoints([...parsed.pickupPoints, ...missing]);
        } else {
          setPickupPoints(initialPickupPoints);
        }
        if (parsed.integrations) setIntegrations(parsed.integrations);
        if (parsed.activityLogs) setActivityLogs(parsed.activityLogs);
        if (parsed.trash) setTrash(parsed.trash);
      }
    } catch (e) {
      console.warn("Could not read admin state from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        adminUsers,
        currentAdmin,
        categories,
        catalogCardConfig,
        medicines,
        retailProducts,
        inventoryMovements,
        orders,
        customers,
        promotions,
        banners,
        siteDesign,
        themeColors,
        seo,
        blogPosts,
        storeSettings,
        deliveryRates,
        pickupPoints,
        integrations,
        activityLogs,
        trash,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Could not save admin state to localStorage", e);
    }
  }, [
    isLoaded,
    adminUsers,
    currentAdmin,
    categories,
    catalogCardConfig,
    medicines,
    retailProducts,
    inventoryMovements,
    orders,
    customers,
    promotions,
    banners,
    siteDesign,
    themeColors,
    seo,
    blogPosts,
    storeSettings,
    deliveryRates,
    pickupPoints,
    integrations,
    activityLogs,
    trash,
  ]);

  // Dynamic CSS variables injector for theme colors
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (themeColors.primary) root.style.setProperty("--primary", themeColors.primary);
    if (themeColors.primaryDark) root.style.setProperty("--primary-dark", themeColors.primaryDark);
    if (themeColors.secondary) root.style.setProperty("--secondary", themeColors.secondary);
    if (themeColors.accent) root.style.setProperty("--accent", themeColors.accent);

    let styleTag = document.getElementById("farmaboy-dynamic-theme") as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "farmaboy-dynamic-theme";
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
      :root {
        --fb-primary: ${themeColors.primary};
        --fb-primary-dark: ${themeColors.primaryDark};
        --fb-secondary: ${themeColors.secondary};
        --fb-accent: ${themeColors.accent};
        --fb-promo: ${themeColors.promo};
      }
    `;
  }, [themeColors]);

  // Toast System
  const showToast = useCallback((message: string, type: "success" | "error" | "info" | "warning" = "success") => {
    const newToast: ToastNotification = {
      id: "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 5),
      message,
      type,
      timestamp: Date.now(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Activity Logger
  const logActivity = useCallback(
    (action: string, entity: string, details: string) => {
      const newLog: ActivityLog = {
        id: "act-" + Date.now(),
        user: currentAdmin?.name || "Administrador",
        role: currentAdmin?.role || "ADMIN",
        action,
        entity,
        details,
        timestamp: "Hoy " + new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      };
      setActivityLogs((prev) => [newLog, ...prev.slice(0, 99)]);
    },
    [currentAdmin]
  );

  // Authentication & RBAC
  const loginAs = useCallback(
    (email: string, role?: AdminRoleName) => {
      const found = adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        const updated = { ...found, lastLogin: "Ahora" };
        setCurrentAdmin(updated);
        logActivity("Inicio de Sesión", "Sesión Administrativa", `Acceso como ${found.role} (${found.email})`);
        showToast(`Bienvenido ${found.name} (${found.role})`, "success");
        return true;
      }
      if (role) {
        const demoUser: AdminUser = {
          id: "adm-" + Date.now(),
          name: `Usuario ${role}`,
          email,
          role,
          lastLogin: "Ahora",
          isActive: true,
        };
        setCurrentAdmin(demoUser);
        logActivity("Inicio de Sesión Demo", "Sesión Administrativa", `Acceso simulado como ${role}`);
        showToast(`Sesión iniciada como ${role}`, "info");
        return true;
      }
      showToast("Usuario administrativo no encontrado", "error");
      return false;
    },
    [adminUsers, logActivity, showToast]
  );

  const switchDemoRole = useCallback(
    (role: AdminRoleName) => {
      const match = adminUsers.find((u) => u.role === role);
      if (match) {
        setCurrentAdmin(match);
        showToast(`Perfil cambiado a: ${role} (${match.name})`, "info");
        logActivity("Cambio de Rol", "RBAC", `Cambiado perfil activo a ${role}`);
      } else {
        const fallback: AdminUser = {
          id: "adm-" + role.toLowerCase(),
          name: `Operador ${role}`,
          email: `${role.toLowerCase()}@farmaboy.com.co`,
          role,
          lastLogin: "Ahora",
          isActive: true,
        };
        setCurrentAdmin(fallback);
        showToast(`Perfil temporal asignado: ${role}`, "info");
      }
    },
    [adminUsers, logActivity, showToast]
  );

  const logout = useCallback(() => {
    if (currentAdmin) {
      logActivity("Cierre de Sesión", "Sesión Administrativa", `Desconexión de ${currentAdmin.name}`);
    }
    setCurrentAdmin(null);
    showToast("Has cerrado la sesión administrativa", "info");
  }, [currentAdmin, logActivity, showToast]);

  const hasPermission = useCallback(
    (permission: AdminPermission): boolean => {
      if (!currentAdmin) return false;
      if (currentAdmin.role === "SUPER_ADMIN") return true;

      // Role permission maps
      const rolePermissions: Record<AdminRoleName, AdminPermission[]> = {
        SUPER_ADMIN: ["all"],
        ADMIN: [
          "medicamentos:read",
          "medicamentos:write",
          "productos:read",
          "productos:write",
          "inventario:read",
          "inventario:write",
          "pedidos:read",
          "pedidos:write",
          "clientes:read",
          "clientes:write",
          "promociones:read",
          "promociones:write",
          "contenido:read",
          "contenido:write",
          "diseno:read",
          "diseno:write",
          "seo:read",
          "seo:write",
          "configuracion:read",
          "configuracion:write",
          "seguridad:read",
        ],
        FARMACEUTICO: [
          "medicamentos:read",
          "medicamentos:write",
          "productos:read",
          "productos:write",
          "inventario:read",
          "inventario:write",
          "pedidos:read",
          "clientes:read",
        ],
        VENTAS: [
          "medicamentos:read",
          "productos:read",
          "inventario:read",
          "pedidos:read",
          "pedidos:write",
          "clientes:read",
          "clientes:write",
          "promociones:read",
        ],
        EDITOR: [
          "contenido:read",
          "contenido:write",
          "diseno:read",
          "diseno:write",
          "seo:read",
          "seo:write",
          "medicamentos:read",
          "productos:read",
        ],
        SOPORTE: [
          "pedidos:read",
          "pedidos:write",
          "clientes:read",
          "medicamentos:read",
          "productos:read",
        ],
      };

      const granted = rolePermissions[currentAdmin.role] || [];
      if (granted.includes("all")) return true;
      if (granted.includes(permission)) return true;
      if (currentAdmin.customPermissions?.includes(permission)) return true;
      return false;
    },
    [currentAdmin]
  );

  const getPermissionForRoute = useCallback((pathname: string): AdminPermission | null => {
    if (pathname === "/admin" || pathname === "/admin/login" || pathname === "/admin/recuperar-clave") {
      return null;
    }
    if (pathname.startsWith("/admin/medicamentos")) return "medicamentos:read";
    if (pathname.startsWith("/admin/productos")) return "productos:read";
    if (pathname.startsWith("/admin/inventario")) return "inventario:read";
    if (pathname.startsWith("/admin/pedidos")) return "pedidos:read";
    if (pathname.startsWith("/admin/clientes")) return "clientes:read";
    if (pathname.startsWith("/admin/promociones")) return "promociones:read";
    if (pathname.startsWith("/admin/banners")) return "contenido:read";
    if (pathname.startsWith("/admin/blog")) return "contenido:read";
    if (pathname.startsWith("/admin/menus")) return "contenido:read";
    if (pathname.startsWith("/admin/paginas")) return "contenido:read";
    if (pathname.startsWith("/admin/diseno")) return "diseno:read";
    if (pathname.startsWith("/admin/colores")) return "diseno:read";
    if (pathname.startsWith("/admin/seo")) return "seo:read";
    if (pathname.startsWith("/admin/configuracion")) return "configuracion:read";
    if (pathname.startsWith("/admin/integraciones")) return "configuracion:read";
    if (pathname.startsWith("/admin/usuarios")) return "seguridad:read";
    if (pathname.startsWith("/admin/seguridad")) return "seguridad:read";
    if (pathname.startsWith("/admin/papelera")) return "configuracion:read";
    if (pathname.startsWith("/admin/analitica")) return "pedidos:read";
    return null;
  }, []);

  const addAdminUser = useCallback(
    (user: Omit<AdminUser, "id" | "lastLogin">) => {
      const newUser: AdminUser = {
        ...user,
        id: "adm-" + Date.now(),
        lastLogin: "Nunca",
      };
      setAdminUsers((prev) => [...prev, newUser]);
      logActivity("Creación de Usuario", "Usuarios Admin", `Creado ${newUser.name} con rol ${newUser.role}`);
      showToast(`Usuario ${newUser.name} creado exitosamente`, "success");
    },
    [logActivity, showToast]
  );

  const updateAdminUser = useCallback(
    (id: string, updates: Partial<AdminUser>) => {
      setAdminUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
      logActivity("Edición de Usuario", "Usuarios Admin", `Modificado usuario ID ${id}`);
      showToast("Usuario actualizado correctamente", "success");
    },
    [logActivity, showToast]
  );

  const deleteAdminUser = useCallback(
    (id: string) => {
      const target = adminUsers.find((u) => u.id === id);
      if (target?.role === "SUPER_ADMIN" && adminUsers.filter((u) => u.role === "SUPER_ADMIN").length <= 1) {
        showToast("No puedes eliminar el único Super Administrador del sistema", "error");
        return;
      }
      setAdminUsers((prev) => prev.filter((u) => u.id !== id));
      logActivity("Eliminación de Usuario", "Usuarios Admin", `Eliminado ${target?.name || id}`);
      showToast("Usuario eliminado del sistema", "info");
    },
    [adminUsers, logActivity, showToast]
  );

  // Medicines Actions
  const addMedicine = useCallback(
    (item: Omit<MedicineItem, "id">) => {
      const safePrice = Math.max(0, item.priceCOP || 0);
      const safeStock = Math.max(0, item.currentStock || 0);
      const safeMinStock = Math.max(0, item.minStock || 0);
      const newMed: MedicineItem = {
        ...item,
        priceCOP: safePrice,
        currentStock: safeStock,
        minStock: safeMinStock,
        id: "med-" + Date.now(),
      };
      setMedicines((prev) => [newMed, ...prev]);
      logActivity("Creación de Medicamento", newMed.name, `INVIMA: ${newMed.pharmaInfo.registroSanitarioINVIMA}, Lote: ${newMed.lotNumber}`);
      showToast(`Medicamento "${newMed.name}" registrado con éxito`, "success");
    },
    [logActivity, showToast]
  );

  const updateMedicine = useCallback(
    (id: string, updates: Partial<MedicineItem>) => {
      setMedicines((prev) =>
        prev.map((med) => {
          if (med.id !== id) return med;
          const safeUpdates: Partial<MedicineItem> = { ...updates };
          if (safeUpdates.priceCOP !== undefined) safeUpdates.priceCOP = Math.max(0, safeUpdates.priceCOP);
          if (safeUpdates.currentStock !== undefined) safeUpdates.currentStock = Math.max(0, safeUpdates.currentStock);
          if (safeUpdates.minStock !== undefined) safeUpdates.minStock = Math.max(0, safeUpdates.minStock);
          const updated = { ...med, ...safeUpdates };
          return updated;
        })
      );
      const target = medicines.find((m) => m.id === id);
      logActivity("Edición de Medicamento", target?.name || id, "Atributos actualizados en catálogo");
      showToast("Medicamento actualizado correctamente", "success");
    },
    [medicines, logActivity, showToast]
  );

  const deleteMedicine = useCallback(
    (id: string) => {
      const target = medicines.find((m) => m.id === id);
      if (!target) return;
      // Soft delete -> move to trash
      const trashItem: TrashItem = {
        id: "trash-" + Date.now(),
        entityType: "MEDICAMENTO",
        entityId: target.id,
        title: target.name,
        deletedAt: new Date().toLocaleString("es-CO"),
        deletedBy: currentAdmin?.name || "Administrador",
        originalData: target,
      };
      setTrash((prev) => [trashItem, ...prev]);
      setMedicines((prev) => prev.filter((m) => m.id !== id));
      logActivity("Papelera", target.name, "Medicamento movido a la papelera de reciclaje");
      showToast(`"${target.name}" movido a la papelera`, "info");
    },
    [medicines, currentAdmin, logActivity, showToast]
  );

  // Retail Products Actions
  const addRetailProduct = useCallback(
    (item: Omit<RetailProductItem, "id">) => {
      const safePrice = Math.max(0, item.priceCOP || 0);
      const safeStock = Math.max(0, item.currentStock || 0);
      const safeMinStock = Math.max(0, item.minStock || 0);
      const newProd: RetailProductItem = {
        ...item,
        priceCOP: safePrice,
        currentStock: safeStock,
        minStock: safeMinStock,
        id: "prod-" + Date.now(),
      };
      setRetailProducts((prev) => [newProd, ...prev]);
      logActivity("Creación de Producto", newProd.name, `SKU: ${newProd.sku}, Marca: ${newProd.brand}`);
      showToast(`Producto "${newProd.name}" creado con éxito`, "success");
    },
    [logActivity, showToast]
  );

  const updateRetailProduct = useCallback(
    (id: string, updates: Partial<RetailProductItem>) => {
      setRetailProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const safeUpdates: Partial<RetailProductItem> = { ...updates };
          if (safeUpdates.priceCOP !== undefined) safeUpdates.priceCOP = Math.max(0, safeUpdates.priceCOP);
          if (safeUpdates.currentStock !== undefined) safeUpdates.currentStock = Math.max(0, safeUpdates.currentStock);
          if (safeUpdates.minStock !== undefined) safeUpdates.minStock = Math.max(0, safeUpdates.minStock);
          return { ...p, ...safeUpdates };
        })
      );
      const target = retailProducts.find((p) => p.id === id);
      logActivity("Edición de Producto", target?.name || id, "Datos de catálogo retail modificados");
      showToast("Producto actualizado", "success");
    },
    [retailProducts, logActivity, showToast]
  );

  const deleteRetailProduct = useCallback(
    (id: string) => {
      const target = retailProducts.find((p) => p.id === id);
      if (!target) return;
      const trashItem: TrashItem = {
        id: "trash-" + Date.now(),
        entityType: "PRODUCTO",
        entityId: target.id,
        title: target.name,
        deletedAt: new Date().toLocaleString("es-CO"),
        deletedBy: currentAdmin?.name || "Administrador",
        originalData: target,
      };
      setTrash((prev) => [trashItem, ...prev]);
      setRetailProducts((prev) => prev.filter((p) => p.id !== id));
      logActivity("Papelera", target.name, "Producto retail movido a la papelera");
      showToast(`"${target.name}" movido a la papelera`, "info");
    },
    [retailProducts, currentAdmin, logActivity, showToast]
  );

  // Inventory & Kardex Movement
  const addInventoryMovement = useCallback(
    (movement: Omit<InventoryMovement, "id" | "date" | "user">) => {
      const newMv: InventoryMovement = {
        ...movement,
        id: "kdx-" + Date.now(),
        date: "Hoy " + new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
        user: currentAdmin?.name || "Administrador",
      };
      setInventoryMovements((prev) => [newMv, ...prev]);

      // Automatically update stock in medicine or product
      setMedicines((prev) =>
        prev.map((m) => (m.id === movement.productId ? { ...m, currentStock: movement.newStock } : m))
      );
      setRetailProducts((prev) =>
        prev.map((p) => (p.id === movement.productId ? { ...p, currentStock: movement.newStock } : p))
      );

      logActivity(
        `Kardex: ${movement.type}`,
        movement.productName,
        `Stock: ${movement.previousStock} -> ${movement.newStock} (${movement.quantity >= 0 ? "+" : ""}${movement.quantity}). Motivo: ${movement.reason}`
      );
      showToast(`Movimiento registrado: ${movement.productName} (${movement.newStock} en stock)`, "success");
    },
    [currentAdmin, logActivity, showToast]
  );

  // Orders Actions
  const updateOrderStatus = useCallback(
    (orderId: string, status: AdminOrderStatus, note?: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        showToast(`Pedido #${orderId} no encontrado`, "error");
        return;
      }

      // If status is CANCELADO or DEVUELTO and has not been restocked yet
      let willRestock = false;
      if ((status === "CANCELADO" || status === "DEVUELTO") && !order.isStockRestocked) {
        willRestock = true;
      }

      if (willRestock) {
        // Return stock for each item in order
        const restockMovements: InventoryMovement[] = [];
        order.items.forEach((item) => {
          const itemId = (item as any).productId || item.id;
          const med = medicines.find((m) => m.id === itemId);
          const prod = retailProducts.find((p) => p.id === itemId);
          const target = med || prod;
          if (target) {
            const prev = target.currentStock;
            const next = prev + item.quantity;
            restockMovements.push({
              id: "kdx-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
              productId: itemId,
              productName: item.name,
              sku: target.sku,
              type: "DEVOLUCION",
              quantity: item.quantity,
              previousStock: prev,
              newStock: next,
              date: "Hoy " + new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
              reason: `${status === "CANCELADO" ? "Cancelación" : "Devolución aprobada"} de pedido #${orderId}. ${note || ""}`.trim(),
              referenceDoc: `PED-${orderId}`,
              user: currentAdmin?.name || "Operador",
            });
          }
        });

        // Update medicine and retail product stocks
        setMedicines((prev) =>
          prev.map((m) => {
            const it = order.items.find((item) => ((item as any).productId || item.id) === m.id);
            if (!it) return m;
            return { ...m, currentStock: m.currentStock + it.quantity };
          })
        );
        setRetailProducts((prev) =>
          prev.map((p) => {
            const it = order.items.find((item) => ((item as any).productId || item.id) === p.id);
            if (!it) return p;
            return { ...p, currentStock: p.currentStock + it.quantity };
          })
        );
        setInventoryMovements((prev) => [...restockMovements, ...prev]);
        logActivity(
          "Restitución de Stock",
          `Pedido #${orderId}`,
          `Reintegradas ${order.items.reduce((acc, it) => acc + it.quantity, 0)} unidades al inventario (Kardex: DEVOLUCION)`
        );
      }

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o;
          const newHistory = [
            ...o.trackingHistory,
            {
              status,
              timestamp: new Date().toLocaleString("es-CO"),
              note: note || `Estado actualizado a ${status} por ${currentAdmin?.name || "Operador"}${willRestock ? " (Inventario restituido)" : ""}`,
            },
          ];
          return {
            ...o,
            status,
            isStockRestocked: willRestock ? true : o.isStockRestocked,
            cancellationReason: status === "CANCELADO" ? (note || o.cancellationReason || "Cancelado por operador") : o.cancellationReason,
            trackingHistory: newHistory,
          };
        })
      );
      logActivity("Cambio de Estado de Pedido", `Pedido #${orderId}`, `Nuevo estado: ${status}`);
      showToast(`Pedido #${orderId} actualizado a ${status}`, "success");
    },
    [orders, medicines, retailProducts, currentAdmin, logActivity, showToast]
  );

  const updateOrder = useCallback(
    (orderId: string, updates: Partial<AdminOrder>) => {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o)));
      logActivity("Modificación de Pedido", `Pedido #${orderId}`, "Datos de la orden modificados");
      showToast(`Pedido #${orderId} modificado`, "success");
    },
    [logActivity, showToast]
  );

  // Validate promotion coupon code
  const validatePromotionCode = useCallback(
    (code: string, subtotal: number): { isValid: boolean; discountAmount: number; promotion?: PromotionRule; message: string } => {
      const clean = code.trim().toUpperCase();
      if (!clean) {
        return { isValid: false, discountAmount: 0, message: "Ingresa un código de cupón" };
      }
      const promo = promotions.find((p) => p.code.trim().toUpperCase() === clean);
      if (!promo) {
        return { isValid: false, discountAmount: 0, message: "El cupón no existe o no es válido" };
      }
      if (!promo.isActive) {
        return { isValid: false, discountAmount: 0, message: "El cupón se encuentra inactivo" };
      }
      const today = new Date().toISOString().split("T")[0];
      if (promo.startDate && today < promo.startDate) {
        return { isValid: false, discountAmount: 0, message: "El cupón aún no entra en vigencia" };
      }
      if (promo.endDate && today > promo.endDate) {
        return { isValid: false, discountAmount: 0, message: "El cupón ha expirado" };
      }
      const maxUses = promo.maxUsesTotal ?? promo.maxUses;
      if (maxUses && promo.usedCount >= maxUses) {
        return { isValid: false, discountAmount: 0, message: "Este cupón ha agotado su número máximo de redenciones" };
      }
      if (promo.minPurchaseCOP && subtotal < promo.minPurchaseCOP) {
        return {
          isValid: false,
          discountAmount: 0,
          message: `El pedido no alcanza la compra mínima requerida ($${promo.minPurchaseCOP.toLocaleString("es-CO")} COP)`,
        };
      }

      const discountVal = promo.discountValue ?? promo.value ?? 0;
      let discount = 0;
      if (promo.type === "PORCENTAJE" || promo.type === "PERCENTAGE") {
        discount = Math.round((subtotal * discountVal) / 100);
        if (promo.maxDiscountCOP && discount > promo.maxDiscountCOP) {
          discount = promo.maxDiscountCOP;
        }
      } else if (promo.type === "FIJO" || promo.type === "FIXED_AMOUNT") {
        discount = Math.min(discountVal, subtotal);
      } else if (promo.type === "FREE_SHIPPING") {
        discount = 0;
      }

      return {
        isValid: true,
        discountAmount: discount,
        promotion: promo,
        message: `Cupón ${promo.code} aplicado correctamente`,
      };
    },
    [promotions]
  );

  // Process new e-commerce order atomically
  const processNewOrder = useCallback(
    (input: NewOrderInput): { success: boolean; orderId?: string; error?: string } => {
      // 1. Validate items and stock
      for (const item of input.items) {
        const itemId = item.productId || item.id;
        const itemName = item.productName || item.name || "Producto";
        const med = medicines.find((m) => m.id === itemId);
        const prod = retailProducts.find((p) => p.id === itemId);
        const target = med || prod;

        if (!target) {
          return { success: false, error: `El producto "${itemName}" ya no está disponible en catálogo.` };
        }
        const isActive = target.status === "ACTIVO" && target.isActive !== false;
        if (!isActive) {
          return { success: false, error: `El producto "${target.name}" se encuentra despublicado o inactivo.` };
        }

        // INVIMA Expiration rule
        if (med && med.expiryDate) {
          const exp = new Date(med.expiryDate);
          const now = new Date();
          if (exp < now) {
            return {
              success: false,
              error: `El medicamento "${med.name}" (Lote ${med.lotNumber}) está vencido según normativa INVIMA y no puede comercializarse.`,
            };
          }
        }

        // Stock check
        if (target.currentStock < item.quantity) {
          return {
            success: false,
            error: `Stock insuficiente para "${target.name}". Disponibles: ${target.currentStock}, solicitados: ${item.quantity}.`,
          };
        }
      }

      const generatedId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      const nowTimestamp = new Date().toLocaleString("es-CO");

      // 2. Decrement stock & record Kardex for each item
      const movementsToAdd: InventoryMovement[] = [];
      input.items.forEach((item) => {
        const itemId = item.productId || item.id;
        const itemName = item.productName || item.name || "Producto";
        const med = medicines.find((m) => m.id === itemId);
        const prod = retailProducts.find((p) => p.id === itemId);
        const target = med || prod;
        if (target) {
          const prev = target.currentStock;
          const next = Math.max(0, prev - item.quantity);
          movementsToAdd.push({
            id: "kdx-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
            productId: itemId || target.id,
            productName: itemName,
            sku: target.sku,
            type: "SALIDA",
            quantity: -item.quantity,
            previousStock: prev,
            newStock: next,
            date: "Hoy " + new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
            reason: `Venta e-commerce pedido #${generatedId}`,
            referenceDoc: `PED-${generatedId}`,
            user: "Sistema E-commerce",
          });
        }
      });

      // Update medicines & retailProducts state
      setMedicines((prev) =>
        prev.map((m) => {
          const orderItem = input.items.find((it) => (it.productId || it.id) === m.id);
          if (!orderItem) return m;
          return { ...m, currentStock: Math.max(0, m.currentStock - orderItem.quantity) };
        })
      );

      setRetailProducts((prev) =>
        prev.map((p) => {
          const orderItem = input.items.find((it) => (it.productId || it.id) === p.id);
          if (!orderItem) return p;
          return { ...p, currentStock: Math.max(0, p.currentStock - orderItem.quantity) };
        })
      );

      // Add Kardex movements
      setInventoryMovements((prev) => [...movementsToAdd, ...prev]);

      // 3. Upsert CRM Customer
      const custName = input.customer?.name || input.customerName?.split(" ")[0] || "Cliente";
      const custLastName = input.customer?.lastName || input.customerName?.split(" ").slice(1).join(" ") || "";
      const custEmail = input.customer?.email || input.customerEmail || "";
      const custPhone = input.customer?.phone || input.customerPhone || "";
      const custDoc = input.customer?.documentNumber || input.customerDocument || "N/A";
      const custDocType = input.customer?.documentType || "CC";

      const shipCity = input.shippingAddress?.city || input.deliveryCity || "Tunja";
      const shipAddress = input.shippingAddress?.addressLine || input.deliveryAddress || "";
      const shipNotes = input.shippingAddress?.deliveryNotes || input.deliveryNotes || input.notes || "";

      const orderSubtotal =
        input.subtotalCOP ??
        input.items.reduce((sum, it) => sum + (it.priceCOP || it.unitPriceCOP || 0) * it.quantity, 0);
      const orderDiscount = input.discountCOP || 0;
      const orderShipping = input.shippingCOP || 0;
      const orderTotal = input.totalCOP ?? Math.max(0, orderSubtotal - orderDiscount) + orderShipping;

      setCustomers((prev) => {
        const existingIdx = prev.findIndex(
          (c) =>
            (custEmail && c.email.toLowerCase() === custEmail.toLowerCase()) ||
            (custDoc !== "N/A" && c.documentNumber === custDoc)
        );

        if (existingIdx >= 0) {
          const existing = prev[existingIdx];
          const newTotalOrders = existing.totalOrders + 1;
          const newTotalSpent = existing.totalSpentCOP + orderTotal;
          const newAvg = Math.round(newTotalSpent / newTotalOrders);
          const newSegment = newTotalSpent >= 500000 ? "VIP" : newTotalOrders >= 3 ? "FRECUENTE" : existing.segment;

          const updatedCustomer: CustomerCRM = {
            ...existing,
            totalOrders: newTotalOrders,
            totalSpentCOP: newTotalSpent,
            averageTicketCOP: newAvg,
            lastOrderDate: "Hoy",
            lastPurchaseDate: "Hoy",
            lastLoginDate: "Hoy",
            segment: newSegment,
            city: shipCity || existing.city,
            address: shipAddress || existing.address,
            phone: custPhone || existing.phone,
          };
          const updated = [...prev];
          updated[existingIdx] = updatedCustomer;
          return updated;
        } else {
          const newCust: CustomerCRM = {
            id: "crm-" + Date.now(),
            name: custName,
            lastName: custLastName,
            email: custEmail || `cliente-${Date.now()}@farmaboy.com.co`,
            phone: custPhone || "3100000000",
            documentType: custDocType,
            documentNumber: custDoc,
            city: shipCity,
            address: shipAddress,
            registrationDate: new Date().toLocaleDateString("es-CO"),
            lastLoginDate: "Hoy",
            totalOrders: 1,
            totalSpentCOP: orderTotal,
            averageTicketCOP: orderTotal,
            lastOrderDate: "Hoy",
            lastPurchaseDate: "Hoy",
            segment: orderTotal >= 500000 ? "VIP" : "NUEVO",
            tags: ["E-commerce", shipCity, input.paymentMethod],
          };
          return [newCust, ...prev];
        }
      });

      // 4. Update coupon usage if applied
      if (input.couponCode) {
        const cleanCoupon = input.couponCode.trim().toUpperCase();
        setPromotions((prev) =>
          prev.map((p) => (p.code.trim().toUpperCase() === cleanCoupon ? { ...p, usedCount: p.usedCount + 1 } : p))
        );
      }

      const orderInitialStatus: AdminOrderStatus =
        input.initialStatus || (input.paymentMethod?.includes("QR") ? "PENDIENTE" : "PAGADO");

      // 5. Create new AdminOrder
      const newOrder: AdminOrder = {
        id: generatedId,
        customerName: `${custName} ${custLastName}`.trim(),
        customerEmail: custEmail,
        customerPhone: custPhone,
        customerDocument: custDoc,
        date: nowTimestamp,
        status: orderInitialStatus,
        items: input.items.map((it) => ({
          id: it.id || it.productId || "item",
          name: it.name || it.productName || "Producto",
          quantity: it.quantity,
          priceCOP: it.priceCOP || it.unitPriceCOP || 0,
          imageUrl: it.imageUrl || "",
          sku: it.sku,
        })),
        subtotalCOP: orderSubtotal,
        discountCOP: orderDiscount,
        shippingCOP: orderShipping,
        totalCOP: orderTotal,
        paymentMethod: input.paymentMethod,
        paymentProofUrl: input.paymentProofUrl,
        paymentApprovalCode: input.paymentApprovalCode,
        deliveryMethod: input.deliveryMethod || (input.pickupPointId ? "PUNTO_RECOGIDA" : "DOMICILIO"),
        pickupPointId: input.pickupPointId,
        pickupPointName: input.pickupPointName,
        deliveryCity: shipCity,
        deliveryAddress: shipAddress,
        deliveryNotes: shipNotes,
        couponCode: input.couponCode,
        customerLifetimeDiscount: input.customerLifetimeDiscount,
        isStockRestocked: false,
        trackingHistory: [
          {
            status: orderInitialStatus,
            timestamp: nowTimestamp,
            note: orderInitialStatus === "PENDIENTE"
              ? `Pedido registrado con pago QR Bancolombia / Bre-B (Llave 0092016726). En espera de verificación manual del comprobante.${input.paymentApprovalCode ? ` Comprobante / Aprobación: ${input.paymentApprovalCode}` : ""}`
              : `Pago verificado vía ${input.paymentMethod}. Pedido creado e inventario descontado.`,
          },
        ],
      };

      setOrders((prev) => [newOrder, ...prev]);
      logActivity(
        "Nueva Venta E-Commerce",
        `Pedido #${generatedId}`,
        `Cliente: ${custName} ${custLastName} - Total: $${orderTotal.toLocaleString("es-CO")} COP`
      );
      showToast(`¡Pedido #${generatedId} procesado con éxito!`, "success");

      return { success: true, orderId: generatedId };
    },
    [medicines, retailProducts, logActivity, showToast]
  );

  // Customers CRM Actions
  const addCustomer = useCallback(
    (cust: Omit<CustomerCRM, "id" | "registrationDate" | "totalOrders" | "totalSpentCOP" | "averageTicketCOP">) => {
      const newCust: CustomerCRM = {
        ...cust,
        id: "crm-" + Date.now(),
        registrationDate: new Date().toLocaleDateString("es-CO"),
        totalOrders: 0,
        totalSpentCOP: 0,
        averageTicketCOP: 0,
      };
      setCustomers((prev) => [newCust, ...prev]);
      logActivity("Nuevo Cliente CRM", `${newCust.name} ${newCust.lastName}`, `Segmento: ${newCust.segment}, Ciudad: ${newCust.city}`);
      showToast(`Cliente "${newCust.name} ${newCust.lastName}" creado`, "success");
    },
    [logActivity, showToast]
  );

  const updateCustomer = useCallback(
    (id: string, updates: Partial<CustomerCRM>) => {
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
      const target = customers.find((c) => c.id === id);
      logActivity("Actualización CRM", `${target?.name} ${target?.lastName}` || id, "Ficha del cliente actualizada");
      showToast("Ficha de cliente guardada", "success");
    },
    [customers, logActivity, showToast]
  );

  const deleteCustomer = useCallback(
    (id: string) => {
      const target = customers.find((c) => c.id === id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      logActivity("Eliminación CRM", `${target?.name} ${target?.lastName}` || id, "Cliente retirado de la base de datos");
      showToast("Cliente eliminado", "info");
    },
    [customers, logActivity, showToast]
  );

  const getCustomerLifetimeDiscount = useCallback(
    (identifier: { email?: string; documentNumber?: string; id?: string }) => {
      const cleanEmail = identifier.email?.trim().toLowerCase();
      const cleanDoc = identifier.documentNumber?.trim();
      const targetId = identifier.id;

      const matched = customers.find((c) => {
        if (targetId && c.id === targetId) return true;
        if (cleanDoc && c.documentNumber && c.documentNumber.trim() === cleanDoc) return true;
        if (cleanEmail && c.email && c.email.trim().toLowerCase() === cleanEmail) return true;
        return false;
      });

      if (
        matched &&
        matched.isLifetimeDiscountActive !== false &&
        typeof matched.lifetimeDiscountPercentage === "number" &&
        matched.lifetimeDiscountPercentage > 0
      ) {
        return {
          percentage: matched.lifetimeDiscountPercentage,
          reason: matched.lifetimeDiscountReason || `Descuento Vitalicio (${matched.lifetimeDiscountPercentage}%)`,
          customer: matched,
        };
      }
      return null;
    },
    [customers]
  );

  // Promotions Actions
  const addPromotion = useCallback(
    (promo: Omit<PromotionRule, "id" | "usedCount">) => {
      const newPromo: PromotionRule = {
        ...promo,
        id: "prm-" + Date.now(),
        usedCount: 0,
      };
      setPromotions((prev) => [newPromo, ...prev]);
      logActivity("Nueva Promoción", newPromo.title, `Código: ${newPromo.code}, Tipo: ${newPromo.type}`);
      showToast(`Promoción "${newPromo.code}" creada`, "success");
    },
    [logActivity, showToast]
  );

  const updatePromotion = useCallback(
    (id: string, updates: Partial<PromotionRule>) => {
      setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
      const target = promotions.find((p) => p.id === id);
      logActivity("Modificación de Promoción", target?.title || id, "Regla de descuento actualizada");
      showToast("Promoción actualizada", "success");
    },
    [promotions, logActivity, showToast]
  );

  const deletePromotion = useCallback(
    (id: string) => {
      const target = promotions.find((p) => p.id === id);
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      logActivity("Eliminación de Promoción", target?.title || id, `Código ${target?.code} eliminado`);
      showToast("Promoción eliminada", "info");
    },
    [promotions, logActivity, showToast]
  );

  const togglePromotionActive = useCallback(
    (id: string) => {
      setPromotions((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const next = !p.isActive;
          logActivity("Estado de Promoción", p.title, next ? "Promoción Activada" : "Promoción Desactivada");
          showToast(`Cupón ${p.code} ${next ? "activado" : "desactivado"}`, "info");
          return { ...p, isActive: next };
        })
      );
    },
    [logActivity, showToast]
  );

  // Banners Actions
  const addBanner = useCallback(
    (banner: Omit<BannerItem, "id">) => {
      const newBanner: BannerItem = {
        ...banner,
        id: "bnr-" + Date.now(),
      };
      setBanners((prev) => [...prev, newBanner]);
      logActivity("Nuevo Banner", newBanner.title, `Ubicación: ${newBanner.placement}`);
      showToast(`Banner "${newBanner.title}" agregado`, "success");
    },
    [logActivity, showToast]
  );

  const updateBanner = useCallback(
    (id: string, updates: Partial<BannerItem>) => {
      setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
      const target = banners.find((b) => b.id === id);
      logActivity("Edición de Banner", target?.title || id, "Banner actualizado");
      showToast("Banner actualizado", "success");
    },
    [banners, logActivity, showToast]
  );

  const deleteBanner = useCallback(
    (id: string) => {
      const target = banners.find((b) => b.id === id);
      if (!target) return;
      const trashItem: TrashItem = {
        id: "trash-" + Date.now(),
        entityType: "BANNER",
        entityId: target.id,
        title: target.title,
        deletedAt: new Date().toLocaleString("es-CO"),
        deletedBy: currentAdmin?.name || "Administrador",
        originalData: target,
      };
      setTrash((prev) => [trashItem, ...prev]);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      logActivity("Papelera Banner", target.title, "Banner enviado a papelera");
      showToast("Banner movido a la papelera", "info");
    },
    [banners, currentAdmin, logActivity, showToast]
  );

  const reorderBanners = useCallback(
    (orderedIds: string[]) => {
      setBanners((prev) => {
        const sorted = [...prev].sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id));
        return sorted.map((item, index) => ({ ...item, order: index + 1 }));
      });
      logActivity("Reordenamiento de Banners", "Banners", "Nuevo orden de banners guardado");
      showToast("Orden de banners actualizado", "success");
    },
    [logActivity, showToast]
  );

  // Site Design
  const updateSiteDesign = useCallback(
    (updates: Partial<SiteDesignConfig>) => {
      setSiteDesign((prev) => ({ ...prev, ...updates }));
      logActivity("Diseño del Sitio", "CMS Visual", "Configuración de diseño actualizada");
      showToast("Diseño del sitio actualizado", "success");
    },
    [logActivity, showToast]
  );

  const toggleHomepageSection = useCallback(
    (sectionKey: keyof SiteDesignConfig["homepageSections"]) => {
      setSiteDesign((prev) => {
        const currentVal = prev.homepageSections[sectionKey];
        const nextVal = !currentVal;
        logActivity(
          "Sección de Home",
          String(sectionKey),
          nextVal ? "Sección Visible en portada" : "Sección Oculta"
        );
        showToast(`Sección "${String(sectionKey)}" ${nextVal ? "activada" : "ocultada"}`, "info");
        return {
          ...prev,
          homepageSections: {
            ...prev.homepageSections,
            [sectionKey]: nextVal,
          },
        };
      });
    },
    [logActivity, showToast]
  );

  // Theme Colors
  const updateThemeColors = useCallback(
    (colors: Partial<ThemeColors>) => {
      setThemeColors((prev) => {
        const next = { ...prev, ...colors };
        setSiteDesign((sd) => ({ ...sd, colors: next }));
        return next;
      });
      logActivity("Paleta de Colores", "Diseño Visual", "Colores institucionales actualizados");
      showToast("Colores institucionales actualizados en vivo", "success");
    },
    [logActivity, showToast]
  );

  const resetThemeColors = useCallback(() => {
    setThemeColors(initialSiteDesign.colors);
    setSiteDesign((sd) => ({ ...sd, colors: initialSiteDesign.colors }));
    logActivity("Restablecer Colores", "Diseño Visual", "Paleta restaurada a valores por defecto");
    showToast("Colores restaurados por defecto", "info");
  }, [logActivity, showToast]);

  // SEO
  const updateSeo = useCallback(
    (updates: Partial<SeoConfig>) => {
      setSeo((prev) => ({ ...prev, ...updates }));
      logActivity("Configuración SEO", "Posicionamiento", "Metadatos globales actualizados");
      showToast("Configuración SEO guardada", "success");
    },
    [logActivity, showToast]
  );

  // Blog Posts
  const addBlogPost = useCallback(
    (post: Omit<BlogPost, "id" | "publishDate">) => {
      const newPost: BlogPost = {
        ...post,
        id: "post-" + Date.now(),
        publishDate: new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }),
      };
      setBlogPosts((prev) => [newPost, ...prev]);
      logActivity("Nuevo Artículo", newPost.title, `Categoría: ${newPost.category}, Estado: ${newPost.isPublished ? "Publicado" : "Borrador"}`);
      showToast(`Artículo "${newPost.title}" creado`, "success");
    },
    [logActivity, showToast]
  );

  const updateBlogPost = useCallback(
    (id: string, updates: Partial<BlogPost>) => {
      setBlogPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
      const target = blogPosts.find((p) => p.id === id);
      logActivity("Edición de Artículo", target?.title || id, "Contenido actualizado");
      showToast("Artículo de blog guardado", "success");
    },
    [blogPosts, logActivity, showToast]
  );

  const deleteBlogPost = useCallback(
    (id: string) => {
      const target = blogPosts.find((p) => p.id === id);
      if (!target) return;
      const trashItem: TrashItem = {
        id: "trash-" + Date.now(),
        entityType: "ARTICULO",
        entityId: target.id,
        title: target.title,
        deletedAt: new Date().toLocaleString("es-CO"),
        deletedBy: currentAdmin?.name || "Administrador",
        originalData: target,
      };
      setTrash((prev) => [trashItem, ...prev]);
      setBlogPosts((prev) => prev.filter((p) => p.id !== id));
      logActivity("Papelera Artículo", target.title, "Artículo movido a papelera");
      showToast("Artículo enviado a papelera", "info");
    },
    [blogPosts, currentAdmin, logActivity, showToast]
  );

  // Commercial Settings
  const updateStoreSettings = useCallback(
    (updates: Partial<CommercialStoreSettings>) => {
      setStoreSettings((prev) => ({ ...prev, ...updates }));
      logActivity("Datos Comerciales", "Configuración de Tienda", "Información legal y teléfonos actualizados");
      showToast("Configuración comercial guardada", "success");
    },
    [logActivity, showToast]
  );

  // Delivery Rates CRUD
  const addDeliveryRate = useCallback(
    (rate: Omit<DeliveryRate, "id">) => {
      const newRate: DeliveryRate = { ...rate, id: "rate-" + Date.now() };
      setDeliveryRates((prev) => [...prev, newRate]);
      logActivity("Crear Tarifa", `${newRate.municipality} - ${newRate.zone}`, `Tarifa: $${newRate.rateCOP.toLocaleString("es-CO")} COP`);
      showToast(`Tarifa para ${newRate.municipality} creada`, "success");
    },
    [logActivity, showToast]
  );

  const updateDeliveryRate = useCallback(
    (id: string, updates: Partial<DeliveryRate>) => {
      setDeliveryRates((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
      logActivity("Actualizar Tarifa", `Tarifa ID ${id}`, "Tarifa de entrega modificada");
      showToast("Tarifa de entrega actualizada", "success");
    },
    [logActivity, showToast]
  );

  const deleteDeliveryRate = useCallback(
    (id: string) => {
      setDeliveryRates((prev) => prev.filter((r) => r.id !== id));
      logActivity("Eliminar Tarifa", `Tarifa ID ${id}`, "Tarifa de entrega eliminada");
      showToast("Tarifa eliminada", "info");
    },
    [logActivity, showToast]
  );

  const toggleDeliveryRateActive = useCallback(
    (id: string) => {
      setDeliveryRates((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            const next = !r.isActive;
            logActivity("Estado Tarifa", `${r.municipality} - ${r.zone}`, next ? "Activada" : "Desactivada");
            showToast(`Tarifa ${next ? "activada" : "desactivada"}`, "info");
            return { ...r, isActive: next };
          }
          return r;
        })
      );
    },
    [logActivity, showToast]
  );

  // Pickup Points CRUD
  const addPickupPoint = useCallback(
    (point: Omit<PickupPoint, "id">) => {
      const newPoint: PickupPoint = { ...point, id: "pickup-" + Date.now() };
      setPickupPoints((prev) => [...prev, newPoint]);
      logActivity("Crear Punto de Recogida", newPoint.name, `${newPoint.municipality} - ${newPoint.address}`);
      showToast(`Punto de recogida "${newPoint.name}" creado`, "success");
    },
    [logActivity, showToast]
  );

  const updatePickupPoint = useCallback(
    (id: string, updates: Partial<PickupPoint>) => {
      setPickupPoints((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
      logActivity("Actualizar Punto Recogida", `Punto ID ${id}`, "Información modificada");
      showToast("Punto de recogida actualizado", "success");
    },
    [logActivity, showToast]
  );

  const deletePickupPoint = useCallback(
    (id: string) => {
      setPickupPoints((prev) => prev.filter((p) => p.id !== id));
      logActivity("Eliminar Punto Recogida", `Punto ID ${id}`, "Punto eliminado");
      showToast("Punto de recogida eliminado", "info");
    },
    [logActivity, showToast]
  );

  const togglePickupPointActive = useCallback(
    (id: string) => {
      setPickupPoints((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const next = p.status === "ACTIVO" ? "INACTIVO" : "ACTIVO";
            logActivity("Estado Punto Recogida", p.name, `Estado: ${next}`);
            showToast(`Punto de recogida ${next === "ACTIVO" ? "activado" : "desactivado"}`, "info");
            return { ...p, status: next };
          }
          return p;
        })
      );
    },
    [logActivity, showToast]
  );

  const getActiveShippingRate = useCallback(
    (municipality?: string): number => {
      const searchCity = (municipality || storeSettings.city || "Duitama").trim().toLowerCase();
      const matchedRate = deliveryRates.find(
        (r) => r.isActive && r.municipality.toLowerCase().includes(searchCity)
      );
      if (matchedRate) return matchedRate.rateCOP;
      const duitamaRate = deliveryRates.find(
        (r) => r.isActive && r.municipality.toLowerCase().includes("duitama")
      );
      return duitamaRate ? duitamaRate.rateCOP : (storeSettings.standardShippingCostCOP || 5000);
    },
    [deliveryRates, storeSettings]
  );

  // Integrations
  const updateIntegrations = useCallback(
    (updates: Partial<IntegrationsConfig>) => {
      setIntegrations((prev) => ({ ...prev, ...updates }));
      logActivity("Integraciones", "Pasarelas & Pixels", "Llaves y credenciales actualizadas de forma segura");
      showToast("Integraciones actualizadas con éxito", "success");
    },
    [logActivity, showToast]
  );

  // Trash Bin
  const restoreTrashItem = useCallback(
    (trashId: string) => {
      const item = trash.find((t) => t.id === trashId);
      if (!item) return;

      if (item.entityType === "MEDICAMENTO") {
        setMedicines((prev) => [item.originalData, ...prev]);
      } else if (item.entityType === "PRODUCTO") {
        setRetailProducts((prev) => [item.originalData, ...prev]);
      } else if (item.entityType === "BANNER") {
        setBanners((prev) => [...prev, item.originalData]);
      } else if (item.entityType === "ARTICULO") {
        setBlogPosts((prev) => [item.originalData, ...prev]);
      }

      setTrash((prev) => prev.filter((t) => t.id !== trashId));
      logActivity("Restauración", item.title, `Elemento (${item.entityType}) restaurado desde la papelera`);
      showToast(`"${item.title}" restaurado exitosamente`, "success");
    },
    [trash, logActivity, showToast]
  );

  const purgeTrashItem = useCallback(
    (trashId: string) => {
      const item = trash.find((t) => t.id === trashId);
      setTrash((prev) => prev.filter((t) => t.id !== trashId));
      logActivity("Eliminación Definitiva", item?.title || trashId, "Elemento purgado permanentemente");
      showToast("Elemento eliminado definitivamente", "info");
    },
    [trash, logActivity, showToast]
  );

  const emptyTrash = useCallback(() => {
    const count = trash.length;
    setTrash([]);
    logActivity("Vaciar Papelera", "Papelera", `${count} elementos purgados definitivamente`);
    showToast(`Papelera vaciada (${count} elementos)`, "info");
  }, [trash, logActivity, showToast]);

  // Factory Reset
  // Unified Catalog List (Reactive & Real-time)
  const allCatalogProducts = React.useMemo<CatalogProduct[]>(() => {
    const meds = medicines.map((m) => enrichProductToCatalog(m, "medicine"));
    const rets = retailProducts.map((p) => enrichProductToCatalog(p, "retail"));
    return [...meds, ...rets];
  }, [medicines, retailProducts]);

  const addCategory = useCallback((cat: Omit<CatalogCategory, "id">) => {
    const newCat: CatalogCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    logActivity("Crear Categoría", "Catálogo", `Categoría "${newCat.name}" creada.`);
    showToast(`Categoría "${newCat.name}" agregada`, "success");
  }, [logActivity, showToast]);

  const updateCategory = useCallback((id: string, updates: Partial<CatalogCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    logActivity("Actualizar Categoría", "Catálogo", `Categoría ID ${id} modificada.`);
    showToast("Categoría actualizada con éxito", "success");
  }, [logActivity, showToast]);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    logActivity("Eliminar Categoría", "Catálogo", `Categoría ID ${id} eliminada.`);
    showToast("Categoría eliminada", "info");
  }, [logActivity, showToast]);

  const reorderCategories = useCallback((orderedIds: string[]) => {
    setCategories((prev) => {
      const map = new Map(prev.map((c) => [c.id, c]));
      return orderedIds.map((id, index) => {
        const item = map.get(id);
        return item ? { ...item, order: index + 1 } : null;
      }).filter(Boolean) as CatalogCategory[];
    });
    logActivity("Reordenar Categorías", "Catálogo", "Orden de categorías actualizado.");
    showToast("Orden de categorías guardado", "success");
  }, [logActivity, showToast]);

  const updateCatalogCardConfig = useCallback((updates: Partial<CatalogCardConfig>) => {
    setCatalogCardConfig((prev) => ({ ...prev, ...updates }));
    logActivity("Configuración de Tarjetas", "Diseño", "Configuración de tarjeta de producto actualizada.");
    showToast("Diseño de tarjetas de catálogo actualizado", "success");
  }, [logActivity, showToast]);

  const resetAllToFactoryDefaults = useCallback(() => {
    setAdminUsers(initialAdminUsers);
    setCurrentAdmin(initialAdminUsers[0]);
    setCategories(initialCategories);
    setCatalogCardConfig(initialCatalogCardConfig);
    setMedicines(initialMedicines);
    setRetailProducts(initialRetailProducts);
    setInventoryMovements(initialInventoryMovements);
    setOrders(initialAdminOrders);
    setCustomers(initialCustomers);
    setPromotions(initialPromotions);
    setBanners(initialBanners);
    setSiteDesign(initialSiteDesign);
    setThemeColors(initialSiteDesign.colors);
    setSeo(initialSeo);
    setBlogPosts(initialBlogPosts);
    setStoreSettings(initialStoreSettings);
    setDeliveryRates(initialDeliveryRates);
    setPickupPoints(initialPickupPoints);
    setIntegrations(initialIntegrations);
    setActivityLogs(initialActivityLogs);
    setTrash([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    logActivity("Reinicio de Fábrica", "Sistema Completo", "Se restauraron todos los datos predeterminados");
    showToast("Datos restaurados a valores de fábrica", "warning");
  }, [logActivity, showToast]);

  return (
    <AdminStoreContext.Provider
      value={{
        currentAdmin,
        adminUsers,
        loginAs,
        switchDemoRole,
        logout,
        hasPermission,
        getPermissionForRoute,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        catalogCardConfig,
        updateCatalogCardConfig,
        allCatalogProducts,
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        retailProducts,
        addRetailProduct,
        updateRetailProduct,
        deleteRetailProduct,
        inventoryMovements,
        addInventoryMovement,
        orders,
        updateOrderStatus,
        updateOrder,
        processNewOrder,
        validatePromotionCode,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerLifetimeDiscount,
        promotions,
        addPromotion,
        updatePromotion,
        deletePromotion,
        togglePromotionActive,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        reorderBanners,
        siteDesign,
        updateSiteDesign,
        toggleHomepageSection,
        themeColors,
        updateThemeColors,
        resetThemeColors,
        seo,
        updateSeo,
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        storeSettings,
        updateStoreSettings,
        deliveryRates,
        addDeliveryRate,
        updateDeliveryRate,
        deleteDeliveryRate,
        toggleDeliveryRateActive,
        pickupPoints,
        addPickupPoint,
        updatePickupPoint,
        deletePickupPoint,
        togglePickupPointActive,
        getActiveShippingRate,
        integrations,
        updateIntegrations,
        activityLogs,
        logActivity,
        trash,
        restoreTrashItem,
        purgeTrashItem,
        emptyTrash,
        toasts,
        showToast,
        removeToast,
        resetAllToFactoryDefaults,
      }}
    >
      {children}
    </AdminStoreContext.Provider>
  );
};

export const useAdminStore = () => {
  const context = useContext(AdminStoreContext);
  if (!context) {
    throw new Error("useAdminStore must be used within an AdminStoreProvider");
  }
  return context;
};
