export type UserRole = "personal" | "empresa_admin" | "empresa_comprador" | "empresa_consulta";

export interface UserProfile {
  id: string;
  name: string;
  lastName: string;
  documentType: "CC" | "CE" | "TI" | "NIT" | "PAS";
  documentNumber: string;
  email: string;
  isEmailVerified: boolean;
  phone: string;
  whatsapp: string;
  isPhoneVerified: boolean;
  birthDate?: string;
  avatarUrl?: string;
  accountType: "personal" | "empresa";
  companyName?: string;
  companyNit?: string;
  companyRole?: UserRole;
  lifetimeDiscountPercentage?: number;
  lifetimeDiscountReason?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  label: "Casa" | "Trabajo" | "Sede Empresa" | "Otra";
  recipientName: string;
  phone: string;
  department: string;
  city: string; // e.g. Tunja, Duitama, Sogamoso
  neighborhood: string;
  address: string;
  complement?: string;
  deliveryNotes?: string;
  isDefault: boolean;
}

export type OrderStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "PREPARANDO"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unitPriceDisplay: string;
  totalPrice: number;
  imageUrl: string;
  category: string;
}

export interface OrderTrackingStep {
  step: "recibido" | "confirmado" | "preparando" | "en_camino" | "entregado";
  title: string;
  description: string;
  date?: string;
  completed: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string; // e.g. FB-10482
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  deliveryAddress: Address;
  paymentMethod: {
    type: "WOMPI" | "TARJETA" | "PSE" | "NEQUI" | "CONTRA_ENTREGA" | "QR_BANCOLOMBIA";
    brand?: string;
    lastFour?: string;
  };
  trackingSteps: OrderTrackingStep[];
  recipientFamilyMember?: string;
  estimatedDelivery?: string;
  courierName?: string;
}

export interface RecurrentPurchase {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    priceDisplay: string;
    imageUrl: string;
    category: string;
  };
  frequency: "SEMANAL" | "QUINCENAL" | "MENSUAL" | "BIMESTRAL";
  nextDeliveryDate: string;
  addressId: string;
  status: "ACTIVA" | "PAUSADA" | "CANCELADA";
  quantity: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    priceDisplay: string;
    imageUrl: string;
    category: string;
    quantity: number;
  }[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: "Hijo/a" | "Madre" | "Padre" | "Pareja" | "Abuelo/a" | "Familiar" | "Otro";
  birthDate?: string;
  identification?: string;
  notes?: string;
}

export interface MedicalPrescription {
  id: string;
  patientName: string;
  familyMemberId?: string;
  doctorName?: string;
  institution?: string;
  uploadDate: string;
  expirationDate?: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: "pdf" | "jpg" | "png";
  status: "VALIDADA" | "EN_REVISION" | "VENCIDA";
  medicationsSummary: string;
}

export type LoyaltyTier = "Inicial" | "Preferencial" | "Premium" | "VIP";

export interface LoyaltyStatus {
  tier: LoyaltyTier;
  points: number;
  pointsToNextTier: number;
  nextTier: LoyaltyTier;
  availablePointsValueCOP: number;
  benefitsList: string[];
}

export interface Coupon {
  id: string;
  code: string;
  discountDisplay: string; // e.g. "15% OFF" or "$10.000 COP"
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minPurchase: number;
  expiresAt: string;
  status: "DISPONIBLE" | "USADO" | "VENCIDO";
  terms: string;
  categoryAllowed?: string;
}

export interface PaymentMethodToken {
  id: string;
  brand: "VISA" | "MASTERCARD" | "AMEX" | "PSE_BANCOLOMBIA" | "NEQUI";
  lastFour?: string;
  holderName: string;
  expiry?: string;
  isDefault: boolean;
}

export interface BillingProfile {
  type: "PERSONA_NATURAL" | "EMPRESA";
  nameOrBusinessName: string;
  documentType: "CC" | "CE" | "NIT";
  documentNumber: string;
  taxEmail: string;
  fiscalAddress: string;
  city: string;
  phone: string;
}

export interface NotificationPreferences {
  channels: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
    push: boolean;
  };
  categories: {
    orderStatus: boolean;
    deliveryTracking: boolean;
    payments: boolean;
    couponsAndDiscounts: boolean;
    promotions: boolean;
    medicineReminders: boolean;
    newsletters: boolean;
  };
}

export interface SecuritySession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityAuditLog {
  id: string;
  event: string;
  date: string;
  ip: string;
  device: string;
  status: "EXITOSO" | "ADVERTENCIA" | "FALLIDO";
}

export interface CompanyBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  managerName: string;
  managerEmail: string;
  isMainBranch: boolean;
}

export interface CorporateQuote {
  id: string;
  code: string;
  title: string;
  date: string;
  validUntil: string;
  status: "EN_ESTUDIO" | "COTIZADA" | "APROBADA" | "DESPACHADA";
  totalEstimatedCOP: number;
  itemsCount: number;
  branchName: string;
}
