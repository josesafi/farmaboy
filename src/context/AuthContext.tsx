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
  const [favorites, setFavorites] = useState<string[]>(["prod-1", "prod-3", "prod-6"]);
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

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) setUser(parsed.user);
        if (typeof parsed.isAuthenticated === "boolean") setIsAuthenticated(parsed.isAuthenticated);
        if (parsed.activeMode) setActiveMode(parsed.activeMode);
        if (parsed.addresses) setAddresses(parsed.addresses);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.recurrentPurchases) setRecurrentPurchases(parsed.recurrentPurchases);
        if (parsed.lists) setLists(parsed.lists);
        if (parsed.favorites) setFavorites(parsed.favorites);
        if (parsed.familyMembers) setFamilyMembers(parsed.familyMembers);
        if (parsed.prescriptions) setPrescriptions(parsed.prescriptions);
        if (parsed.loyalty) setLoyalty(parsed.loyalty);
        if (parsed.coupons) setCoupons(parsed.coupons);
        if (parsed.paymentMethods) setPaymentMethods(parsed.paymentMethods);
        if (parsed.billingProfile) setBillingProfile(parsed.billingProfile);
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
    // Simulated instant login
    const isEmail = identifier.includes("@");
    const loggedUser: UserProfile = {
      ...initialMockUser,
      email: isEmail ? identifier : initialMockUser.email,
      phone: !isEmail ? identifier : initialMockUser.phone,
    };
    setUser(loggedUser);
    setIsAuthenticated(true);
    return true;
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
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
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
