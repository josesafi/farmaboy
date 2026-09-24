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

export const initialMockUser: UserProfile = {
  id: "USR-770921",
  name: "Usuario",
  lastName: "",
  documentType: "CC",
  documentNumber: "",
  email: "",
  isEmailVerified: true,
  phone: "",
  whatsapp: "",
  isPhoneVerified: true,
  birthDate: "",
  avatarUrl: "",
  accountType: "personal",
  companyName: "",
  companyNit: "",
  companyRole: "empresa_admin",
  lifetimeDiscountPercentage: 0,
  lifetimeDiscountReason: "",
  createdAt: "2026-01-01",
};

export const initialMockAddresses: Address[] = [];

export const initialMockOrders: Order[] = [];

export const initialMockRecurrentPurchases: RecurrentPurchase[] = [];

export const initialMockLists: ShoppingList[] = [];

export const initialMockFamily: FamilyMember[] = [];

export const initialMockPrescriptions: MedicalPrescription[] = [];

export const initialMockLoyalty: LoyaltyStatus = {
  tier: "Inicial",
  points: 0,
  pointsToNextTier: 500,
  nextTier: "Preferencial",
  availablePointsValueCOP: 0,
  benefitsList: [
    "5% de descuento en medicamentos seleccionados los martes",
    "Envíos gratis en pedidos superiores a $70.000 COP",
    "Atención prioritaria por WhatsApp farmacéutico",
  ],
};

export const initialMockCoupons: Coupon[] = [];

export const initialMockPaymentMethods: PaymentMethodToken[] = [];

export const initialMockBillingProfile: BillingProfile = {
  type: "PERSONA_NATURAL",
  nameOrBusinessName: "",
  documentType: "CC",
  documentNumber: "",
  taxEmail: "",
  fiscalAddress: "",
  city: "Duitama, Boyacá",
  phone: "",
};

export const initialMockNotificationPreferences: NotificationPreferences = {
  channels: {
    email: true,
    whatsapp: true,
    sms: false,
    push: true,
  },
  categories: {
    orderStatus: true,
    deliveryTracking: true,
    payments: true,
    couponsAndDiscounts: true,
    promotions: false,
    medicineReminders: true,
    newsletters: false,
  },
};

export const initialMockSessions: SecuritySession[] = [];

export const initialMockAuditLogs: SecurityAuditLog[] = [];

export const initialMockBranches: CompanyBranch[] = [];

export const initialMockQuotes: CorporateQuote[] = [];

