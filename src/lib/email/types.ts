export type EmailEventType =
  // Account & Security
  | "USER_REGISTERED"
  | "USER_EMAIL_VERIFIED"
  | "USER_LOGIN"
  | "USER_NEW_DEVICE"
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_CHANGED"
  | "EMAIL_CHANGED"
  | "ACCOUNT_DELETED"
  | "ACCOUNT_BLOCKED"
  | "SECURITY_ALERT"
  // Orders & Payments
  | "ORDER_CREATED"
  | "ORDER_CONFIRMED"
  | "PAYMENT_PENDING"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED"
  | "ORDER_PREPARING"
  | "ORDER_READY"
  | "ORDER_OUT_FOR_DELIVERY"
  | "ORDER_DELIVERED"
  | "ORDER_CANCELLED"
  | "REFUND_PROCESSED"
  // Delivery & Pickup
  | "DOMICILIO_CONFIRMADO"
  | "DOMICILIO_EN_CAMINO"
  | "DOMICILIO_ENTREGADO"
  | "DOMICILIO_NO_ENTREGADO"
  | "PICKUP_SELECTED"
  | "PICKUP_CONFIRMED"
  | "PICKUP_READY"
  | "PICKUP_REMINDER"
  | "PICKUP_COMPLETED"
  // Prescriptions & Health
  | "PRESCRIPTION_RECEIVED"
  | "PRESCRIPTION_UNDER_REVIEW"
  | "PRESCRIPTION_APPROVED"
  | "PRESCRIPTION_REJECTED"
  // Products, Coupons & Commercial
  | "PRODUCT_BACK_IN_STOCK"
  | "PRICE_DROP"
  | "PROMOTION_CREATED"
  | "COUPON_RECEIVED"
  | "COUPON_EXPIRING"
  | "COUPON_USED"
  | "NEWSLETTER_SENT"
  // Support & Contact
  | "SUPPORT_TICKET_CREATED"
  | "SUPPORT_TICKET_REPLIED"
  | "SUPPORT_TICKET_CLOSED"
  | "CONTACT_RECEIVED"
  | "UNSUBSCRIBE_CONFIRMED"
  // Admin Alerts
  | "ADMIN_NEW_USER"
  | "ADMIN_NEW_ORDER"
  | "ADMIN_HIGH_VALUE_ORDER"
  | "ADMIN_PAYMENT_APPROVED"
  | "ADMIN_PAYMENT_REJECTED"
  | "ADMIN_ORDER_CANCELLED"
  | "ADMIN_LOW_STOCK"
  | "ADMIN_OUT_OF_STOCK"
  | "ADMIN_SUPPORT_TICKET"
  | "ADMIN_PRESCRIPTION_RECEIVED"
  | "ADMIN_CRITICAL_ERROR"
  | "TEST_EMAIL";

export type EmailCategory = "ACCOUNT" | "ORDER" | "COMMERCIAL" | "ADMIN";

export type EmailDeliveryStatus = "SENT" | "FAILED" | "PENDING" | "RETRYING";

export interface EmailLog {
  id: string;
  timestamp: string;
  recipient: string;
  template: string;
  event: EmailEventType;
  subject: string;
  status: EmailDeliveryStatus;
  provider: string;
  message_id?: string;
  error?: string;
  retry_count: number;
  event_id: string;
}

export interface QueueJob {
  id: string;
  event_id: string;
  event: EmailEventType;
  category: EmailCategory;
  recipient: string;
  recipientName?: string;
  subject: string;
  templateId: string;
  data: Record<string, any>;
  attempts: number;
  maxAttempts: number;
  nextAttemptAt: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  lastError?: string;
  createdAt: string;
  completedAt?: string;
}

export interface EmailTemplateDefinition {
  id: string;
  event: EmailEventType;
  name: string;
  category: EmailCategory;
  defaultSubject: string;
  allowedVariables: string[];
  description: string;
  render: (data: Record<string, any>) => {
    subject: string;
    html: string;
    text: string;
  };
}

export interface EmailDispatchOptions {
  event: EmailEventType;
  recipient: string;
  recipientName?: string;
  event_id?: string;
  customSubject?: string;
  data: Record<string, any>;
  forceImmediate?: boolean;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  fromName: string;
  adminEmail: string;
  siteUrl: string;
}
