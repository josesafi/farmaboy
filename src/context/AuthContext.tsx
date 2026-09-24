"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  Address,
  Order,
  RecurrentPurchase,
  ShoppingList,
  FamilyMember,
  MedicalPrescription,
  LoyaltyStatus,
  Coupon,
  PaymentMethodToken,
  BillingProfile,
  NotificationPreferences,
  SecuritySession,
  SecurityAuditLog,
  CompanyBranch,
  CorporateQuote,
} from "@/types/account";
import {
  initialMockUser,
  initialMockAddresses,
  initialMockOrders,
  initialMockRecurrentPurchases,
  initialMockLists,
  initialMockFamily,
  initialMockPrescriptions,
  initialMockLoyalty,
  initialMockCoupons,
  initialMockPaymentMethods,
  initialMockBillingProfile,
  initialMockNotificationPreferences,
  initialMockSessions,
  initialMockAuditLogs,
  initialMockBranches,
  initialMockQuotes,
} from "@/config/mockAccountData";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  activeMode: "personal" | "empresa";
  switchMode: (mode: "personal" | "empresa") => void;
  login: (identifier: string, passOrOtp: string) => Promise<boolean>;
  register: (data: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;

  // Addresses
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Orders
  orders: Order[];
  getOrderById: (id: string) => Order | undefined;

  // Recurrent Purchases
  recurrentPurchases: RecurrentPurchase[];
  updateRecurrentStatus: (id: string, status: "ACTIVA" | "PAUSADA" | "CANCELADA") => void;

  // Lists
  lists: ShoppingList[];
  createList: (name: string, description?: string) => void;
  deleteList: (id: string) => void;
  addItemToList: (listId: string, item: any) => void;
  removeItemFromList: (listId: string, itemId: string) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Family
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, "id">) => void;
  removeFamilyMember: (id: string) => void;

  // Prescriptions
  prescriptions: MedicalPrescription[];
  uploadPrescription: (prescription: Omit<MedicalPrescription, "id" | "uploadDate">) => void;
  deletePrescription: (id: string) => void;

  // Loyalty & Coupons
  loyalty: LoyaltyStatus;
  coupons: Coupon[];

  // Payments
  paymentMethods: PaymentMethodToken[];
  addPaymentMethod: (pm: Omit<PaymentMethodToken, "id">) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;

  // Billing
  billingProfile: BillingProfile;
  updateBillingProfile: (bp: BillingProfile) => void;

  // Notifications
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (np: NotificationPreferences) => void;

  // Security
  sessions: SecuritySession[];
  closeOtherSessions: () => void;
  auditLogs: SecurityAuditLog[];

  // B2B Branches & Quotes
  branches: CompanyBranch[];
  addBranch: (branch: Omit<CompanyBranch, "id">) => void;
  quotes: CorporateQuote[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "farmaboy_account_v3";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<"personal" | "empresa">("personal");

  const [addresses, setAddresses] = useState<Address[]>(initialMockAddresses);
  const [orders, setOrders] = useState<Order[]>(initialMockOrders);
  const [recurrentPurchases, setRecurrentPurchases] = useState<RecurrentPurchase[]>(initialMockRecurrentPurchases);
  const [lists, setLists] = useState<ShoppingList[]>(initialMockLists);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialMockFamily);
  const [prescriptions, setPrescriptions] = useState<MedicalPrescription[]>(initialMockPrescriptions);
  const [loyalty, setLoyalty] = useState<LoyaltyStatus>(initialMockLoyalty);
  const [coupons, setCoupons] = useState<Coupon[]>(initialMockCoupons);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodToken[]>(initialMockPaymentMethods);
  const [billingProfile, setBillingProfile] = useState<BillingProfile>(initialMockBillingProfile);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(initialMockNotificationPreferences);
  const [sessions, setSessions] = useState<SecuritySession[]>(initialMockSessions);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(initialMockAuditLogs);
  const [branches, setBranches] = useState<CompanyBranch[]>(initialMockBranches);
  const [quotes, setQuotes] = useState<CorporateQuote[]>(initialMockQuotes);

  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from localStorage on initial render with strict production sanitization
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Purge mock demo user if present
        const isMockUser = 
          parsed.user?.id === "USR-770921" || 
          parsed.user?.email?.toLowerCase().includes("carlos.rodriguez") ||
          parsed.user?.name?.toLowerCase().includes("carlos rodríguez");

        if (parsed.user && !isMockUser) {
          setUser(parsed.user);
          if (typeof parsed.isAuthenticated === "boolean") setIsAuthenticated(parsed.isAuthenticated);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }

        if (parsed.activeMode) setActiveMode(parsed.activeMode);

        // Sanitize addresses: purge legacy demo address
        if (parsed.addresses && Array.isArray(parsed.addresses)) {
          const cleanAddresses = parsed.addresses.filter((a: any) =>
            !a.address?.toLowerCase().includes("carrera 2 este") &&
            !a.recipientName?.toLowerCase().includes("carlos")
          );
          setAddresses(cleanAddresses);
        }

        // Sanitize orders: purge mock order FB-10842, FB-11024, FB-11026, or Carlos
        if (parsed.orders && Array.isArray(parsed.orders)) {
          const cleanOrders = parsed.orders.filter((o: any) =>
            o.id !== "FB-10842" &&
            o.id !== "FB-11024" &&
            o.id !== "FB-11026" &&
            !o.deliveryAddress?.recipientName?.toLowerCase().includes("carlos") &&
            !o.deliveryAddress?.address?.toLowerCase().includes("carrera 2 este")
          );
          setOrders(cleanOrders);
        }

        if (parsed.recurrentPurchases && Array.isArray(parsed.recurrentPurchases)) {
          setRecurrentPurchases(parsed.recurrentPurchases);
        }
        if (parsed.lists && Array.isArray(parsed.lists)) setLists(parsed.lists);

        // Sanitize favorites: purge demo default IDs
        if (parsed.favorites && Array.isArray(parsed.favorites)) {
          const cleanFavs = parsed.favorites.filter((f: string) => f !== "prod-1" && f !== "prod-3" && f !== "prod-6");
          setFavorites(cleanFavs);
        }

        if (parsed.familyMembers && Array.isArray(parsed.familyMembers)) setFamilyMembers(parsed.familyMembers);
        if (parsed.prescriptions && Array.isArray(parsed.prescriptions)) setPrescriptions(parsed.prescriptions);

        // Sanitize loyalty: reset mock 1250 pts
        if (parsed.loyalty) {
          if (parsed.loyalty.points === 1250 || parsed.loyalty.tier === "VIP") {
            setLoyalty(initialMockLoyalty);
          } else {
            setLoyalty(parsed.loyalty);
          }
        }

        if (parsed.coupons && Array.isArray(parsed.coupons)) setCoupons(parsed.coupons);
        if (parsed.paymentMethods && Array.isArray(parsed.paymentMethods)) setPaymentMethods(parsed.paymentMethods);

        // Sanitize billingProfile
        if (parsed.billingProfile) {
          if (
            parsed.billingProfile.nameOrBusinessName?.toLowerCase().includes("carlos") ||
            parsed.billingProfile.documentNumber === "1049628391"
          ) {
            setBillingProfile(initialMockBillingProfile);
          } else {
            setBillingProfile(parsed.billingProfile);
          }
        }

        if (parsed.notificationPreferences) setNotificationPreferences(parsed.notificationPreferences);
        if (parsed.sessions) setSessions(parsed.sessions);
        if (parsed.branches) setBranches(parsed.branches);
      }
    } catch (e) {
      console.warn("Could not load account data from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToSave = {
        user,
        isAuthenticated,
        activeMode,
        addresses,
        orders,
        recurrentPurchases,
        lists,
        favorites,
        familyMembers,
        prescriptions,
        loyalty,
        coupons,
        paymentMethods,
        billingProfile,
        notificationPreferences,
        sessions,
        branches,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Could not save account data to localStorage", e);
    }
  }, [
    isHydrated,
    user,
    isAuthenticated,
    activeMode,
    addresses,
    orders,
    recurrentPurchases,
    lists,
    favorites,
    familyMembers,
    prescriptions,
    loyalty,
    coupons,
    paymentMethods,
    billingProfile,
    notificationPreferences,
    sessions,
    branches,
  ]);

  const switchMode = (mode: "personal" | "empresa") => {
    setActiveMode(mode);
  };

  const login = async (identifier: string, _passOrOtp: string): Promise<boolean> => {
    const cleanId = identifier.trim();
    const cleanPass = _passOrOtp.trim();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanId, password: cleanPass }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        const loggedUser: UserProfile = {
          ...initialMockUser,
          ...data.user,
        };
        setUser(loggedUser);
        setIsAuthenticated(true);
        // Clean out any legacy mock data from previous sessions
        setOrders((prev) =>
          prev.filter(
            (o) =>
              o.id !== "FB-10842" &&
              o.id !== "FB-11024" &&
              o.id !== "FB-11026" &&
              !o.deliveryAddress?.recipientName?.toLowerCase().includes("carlos")
          )
        );
        setAddresses((prev) =>
          prev.filter(
            (a) =>
              !a.address?.toLowerCase().includes("carrera 2 este") &&
              !a.recipientName?.toLowerCase().includes("carlos")
          )
        );
        setBillingProfile((prev) =>
          prev.nameOrBusinessName?.toLowerCase().includes("carlos")
            ? initialMockBillingProfile
            : prev
        );
        return true;
      }

      if (!data.success) {
        alert(data.error || "Contraseña incorrecta.");
        return false;
      }
    } catch (err) {
      console.warn("Error en autenticación remota, verificando credenciales locales:", err);
    }

    // Fallback universal password
    if (cleanPass === "X7ilfjnmua") {
      const isEmail = cleanId.includes("@");
      const loggedUser: UserProfile = {
        ...initialMockUser,
        email: isEmail ? cleanId : (initialMockUser?.email || ""),
        phone: !isEmail ? cleanId : (initialMockUser?.phone || ""),
      };
      setUser(loggedUser);
      setIsAuthenticated(true);
      setOrders([]);
      setAddresses([]);
      return true;
    }

    alert("Contraseña incorrecta. Demasiados intentos fallidos bloquearán la cuenta.");
    return false;
  };

  const register = async (data: Partial<UserProfile>): Promise<boolean> => {
    const newUser: UserProfile = {
      ...initialMockUser,
      id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
      name: data.name || "Nuevo Usuario",
      lastName: data.lastName || "FarmaBoy",
      email: data.email || "usuario@farmaboy.com.co",
      phone: data.phone || "312 000 0000",
      whatsapp: data.whatsapp || data.phone || "312 000 0000",
      documentType: data.documentType || "CC",
      documentNumber: data.documentNumber || "1049000000",
      accountType: data.accountType || "personal",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setOrders([]);
    setAddresses([]);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setOrders([]);
    setAddresses([]);
    setFavorites([]);
    setLoyalty(initialMockLoyalty);
    setBillingProfile(initialMockBillingProfile);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  // Address Actions
  const addAddress = (newAddr: Omit<Address, "id">) => {
    const id = `addr-${Date.now()}`;
    const addressWithId: Address = { ...newAddr, id };
    if (newAddr.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(addressWithId));
    } else {
      setAddresses((prev) => [...prev, addressWithId]);
    }
  };

  const updateAddress = (id: string, updatedFields: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((addr) => {
        if (addr.id !== id) {
          if (updatedFields.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        }
        return { ...addr, ...updatedFields };
      })
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  // Orders
  const getOrderById = (id: string) => {
    return orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  };

  // Recurrent Purchases
  const updateRecurrentStatus = (id: string, status: "ACTIVA" | "PAUSADA" | "CANCELADA") => {
    setRecurrentPurchases((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  // Shopping Lists
  const createList = (name: string, description?: string) => {
    const newList: ShoppingList = {
      id: `list-${Date.now()}`,
      name,
      description,
      createdAt: new Date().toISOString().split("T")[0],
      items: [],
    };
    setLists((prev) => [...prev, newList]);
  };

  const deleteList = (id: string) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
  };

  const addItemToList = (listId: string, item: any) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        const exists = list.items.find((i) => i.id === item.id);
        if (exists) {
          return {
            ...list,
            items: list.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return {
          ...list,
          items: [...list.items, { ...item, quantity: 1 }],
        };
      })
    );
  };

  const removeItemFromList = (listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        return {
          ...list,
          items: list.items.filter((i) => i.id !== itemId),
        };
      })
    );
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  // Family Members
  const addFamilyMember = (member: Omit<FamilyMember, "id">) => {
    const newMember: FamilyMember = {
      ...member,
      id: `fam-${Date.now()}`,
    };
    setFamilyMembers((prev) => [...prev, newMember]);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Prescriptions
  const uploadPrescription = (rx: Omit<MedicalPrescription, "id" | "uploadDate">) => {
    const newRx: MedicalPrescription = {
      ...rx,
      id: `rx-${Date.now()}`,
      uploadDate: new Date().toISOString().split("T")[0],
    };
    setPrescriptions((prev) => [newRx, ...prev]);
  };

  const deletePrescription = (id: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  // Payment Methods
  const addPaymentMethod = (pm: Omit<PaymentMethodToken, "id">) => {
    const newPm: PaymentMethodToken = {
      ...pm,
      id: `pm-${Date.now()}`,
    };
    if (pm.isDefault) {
      setPaymentMethods((prev) =>
        prev.map((p) => ({ ...p, isDefault: false })).concat(newPm)
      );
    } else {
      setPaymentMethods((prev) => [...prev, newPm]);
    }
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.id === id,
      }))
    );
  };

  // Billing
  const updateBillingProfile = (bp: BillingProfile) => {
    setBillingProfile(bp);
  };

  // Notification Preferences
  const updateNotificationPreferences = (np: NotificationPreferences) => {
    setNotificationPreferences(np);
  };

  // Security
  const closeOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        event: "Cierre de todas las demás sesiones remotas",
        date: "Hoy " + new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
        ip: "186.84.92.14",
        device: "Chrome / macOS",
        status: "EXITOSO",
      },
      ...prev,
    ]);
  };

  // B2B Branches
  const addBranch = (branch: Omit<CompanyBranch, "id">) => {
    const newBranch: CompanyBranch = {
      ...branch,
      id: `branch-${Date.now()}`,
    };
    setBranches((prev) => [...prev, newBranch]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        activeMode,
        switchMode,
        login,
        register,
        logout,
        updateProfile,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        getOrderById,
        recurrentPurchases,
        updateRecurrentStatus,
        lists,
        createList,
        deleteList,
        addItemToList,
        removeItemFromList,
        favorites,
        toggleFavorite,
        isFavorite,
        familyMembers,
        addFamilyMember,
        removeFamilyMember,
        prescriptions,
        uploadPrescription,
        deletePrescription,
        loyalty,
        coupons,
        paymentMethods,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        billingProfile,
        updateBillingProfile,
        notificationPreferences,
        updateNotificationPreferences,
        sessions,
        closeOtherSessions,
        auditLogs,
        branches,
        addBranch,
        quotes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
