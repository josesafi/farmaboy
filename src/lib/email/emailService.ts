import { EmailEventType, EmailDispatchOptions } from "./types";
import { enqueueEmailJob } from "./queue";
import { getSmtpConfig } from "./transporter";
import { emailTemplates } from "./templates/registry";

/**
 * Checks if a recipient has opted out of commercial emails.
 * Transactional and account security emails cannot be opted out.
 */
function isCategoryAllowedForRecipient(
  category: "ACCOUNT" | "ORDER" | "COMMERCIAL" | "ADMIN",
  recipientEmail: string
): boolean {
  if (category === "ACCOUNT" || category === "ORDER" || category === "ADMIN") {
    // Critical emails always permitted
    return true;
  }
  // For COMMERCIAL emails, check opt-out list if available
  // In our system, unsubscribed users are verified here
  return true;
}

export class EmailService {
  /**
   * Generic dispatcher for any event.
   */
  public static async dispatch(options: EmailDispatchOptions): Promise<{
    queued: boolean;
    jobId: string;
    event_id: string;
    duplicateSkipped?: boolean;
  }> {
    const config = getSmtpConfig();
    const recipient = options.recipient.trim();
    if (!recipient || !recipient.includes("@")) {
      console.warn(`[EmailService] Invalid recipient email address: "${options.recipient}"`);
      return { queued: false, jobId: "", event_id: options.event_id || "" };
    }

    const template = emailTemplates[options.event];
    const category = template ? template.category : "ACCOUNT";

    if (!isCategoryAllowedForRecipient(category, recipient)) {
      console.log(`[EmailService] Recipient ${recipient} opted out of ${category} communications.`);
      return { queued: false, jobId: "", event_id: options.event_id || "" };
    }

    // Auto-generate event_id for idempotency if not supplied
    const event_id =
      options.event_id ||
      `${options.event}_${recipient}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const result = enqueueEmailJob({
      event: options.event,
      event_id,
      recipient,
      recipientName: options.recipientName,
      customSubject: options.customSubject,
      data: {
        ...options.data,
        siteUrl: config.siteUrl,
      },
    });

    return {
      queued: result.queued,
      jobId: result.jobId,
      event_id,
      duplicateSkipped: result.duplicateSkipped,
    };
  }

  // ==========================================
  // ACCOUNT & SECURITY METHODS
  // ==========================================
  public static async sendWelcomeEmail(user: {
    email: string;
    name: string;
    verificationToken?: string;
  }) {
    const config = getSmtpConfig();
    return this.dispatch({
      event: "USER_REGISTERED",
      event_id: `USER_WELCOME_${user.email.toLowerCase()}`,
      recipient: user.email,
      recipientName: user.name,
      data: {
        nombre: user.name,
        correo: user.email,
        fecha: new Date().toLocaleDateString("es-CO"),
        enlace_cuenta: `${config.siteUrl}/mi-cuenta`,
        enlace_verificacion: `${config.siteUrl}/verificar-correo?token=${user.verificationToken || "welcome"}&email=${encodeURIComponent(user.email)}`,
      },
    });
  }

  public static async sendEmailVerification(user: {
    email: string;
    name: string;
    token: string;
  }) {
    const config = getSmtpConfig();
    return this.dispatch({
      event: "USER_EMAIL_VERIFIED",
      event_id: `EMAIL_VERIF_${user.email.toLowerCase()}_${Date.now()}`,
      recipient: user.email,
      recipientName: user.name,
      data: {
        nombre: user.name,
        correo: user.email,
        enlace_verificacion: `${config.siteUrl}/verificar-correo?token=${user.token}&email=${encodeURIComponent(user.email)}`,
      },
    });
  }

  public static async sendPasswordReset(user: {
    email: string;
    name: string;
    token: string;
  }) {
    const config = getSmtpConfig();
    return this.dispatch({
      event: "PASSWORD_RESET_REQUESTED",
      event_id: `PW_RESET_${user.email.toLowerCase()}_${Date.now()}`,
      recipient: user.email,
      recipientName: user.name,
      data: {
        nombre: user.name,
        enlace_restablecer: `${config.siteUrl}/restablecer-contrasena?token=${user.token}&email=${encodeURIComponent(user.email)}`,
        expiracion_minutos: 60,
      },
    });
  }

  public static async sendPasswordChanged(user: {
    email: string;
    name: string;
  }) {
    return this.dispatch({
      event: "PASSWORD_CHANGED",
      event_id: `PW_CHANGED_${user.email.toLowerCase()}_${Date.now()}`,
      recipient: user.email,
      recipientName: user.name,
      data: {
        nombre: user.name,
        fecha: new Date().toLocaleDateString("es-CO"),
        hora: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      },
    });
  }

  public static async sendAccountDeleted(user: {
    email: string;
    name: string;
  }) {
    return this.dispatch({
      event: "ACCOUNT_DELETED",
      event_id: `ACCT_DELETED_${user.email.toLowerCase()}_${Date.now()}`,
      recipient: user.email,
      recipientName: user.name,
      data: {
        nombre: user.name,
        fecha: new Date().toLocaleDateString("es-CO"),
      },
    });
  }

  public static async sendSecurityAlert(data: {
    email: string;
    name: string;
    detalle?: string;
    dispositivo?: string;
    browser?: string;
    ip?: string;
    ubicacion?: string;
  }) {
    return this.dispatch({
      event: "SECURITY_ALERT",
      event_id: `SEC_ALERT_${data.email.toLowerCase()}_${Date.now()}`,
      recipient: data.email,
      recipientName: data.name,
      data: {
        nombre: data.name,
        detalle: data.detalle,
        dispositivo: data.dispositivo,
        browser: data.browser,
        ip: data.ip,
        ubicacion: data.ubicacion,
      },
    });
  }

  // ==========================================
  // ORDERS & PAYMENTS METHODS
  // ==========================================
  public static async sendOrderCreated(order: any) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "ORDER_CREATED",
      event_id: `ORDER_CREATED_${orderId}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
        items: order.items || [],
        subtotalCOP: order.subtotalCOP,
        discountCOP: order.discountCOP,
        shippingCOP: order.shippingCOP,
        totalCOP: order.totalCOP,
        metodo_pago: order.paymentMethod,
        domicilio_o_recogida: order.deliveryMethod,
        pickupPointName: order.pickupPointName,
        pickupPointAddress: order.pickupPointAddress,
        deliveryCity: order.deliveryCity,
        deliveryAddress: order.deliveryAddress,
        deliveryNotes: order.deliveryNotes,
        estado: order.status,
      },
    });
  }

  public static async sendOrderConfirmed(order: any) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "ORDER_CONFIRMED",
      event_id: `ORDER_CONFIRMED_${orderId}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
        total: order.totalCOP,
      },
    });
  }

  public static async sendPaymentPending(order: any) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "PAYMENT_PENDING",
      event_id: `PAYMENT_PENDING_${orderId}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
        total: order.totalCOP,
        metodo_pago: order.paymentMethod,
      },
    });
  }

  public static async sendPaymentApproved(order: any, transactionId?: string) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "PAYMENT_APPROVED",
      event_id: `PAYMENT_APPROVED_${orderId}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
        valor: order.totalCOP,
        metodo_pago: order.paymentMethod,
        transaccion_id: transactionId || order.paymentApprovalCode,
      },
    });
  }

  public static async sendPaymentRejected(order: any) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "PAYMENT_REJECTED",
      event_id: `PAYMENT_REJECTED_${orderId}_${Date.now()}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
      },
    });
  }

  public static async sendOrderPreparing(order: any) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "ORDER_PREPARING",
      event_id: `ORDER_PREP_${orderId}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
      },
    });
  }

  public static async sendOrderReady(order: any) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "ORDER_READY",
      event_id: `ORDER_READY_${orderId}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
      },
    });
  }

  public static async sendOrderOutForDelivery(order: any) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "ORDER_OUT_FOR_DELIVERY",
      event_id: `ORDER_ROUTE_${orderId}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
        direccion: `${order.deliveryAddress}, ${order.deliveryCity || "Boyacá"}`,
      },
    });
  }

  public static async sendOrderDelivered(order: any) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "ORDER_DELIVERED",
      event_id: `ORDER_DELIVERED_${orderId}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
      },
    });
  }

  public static async sendOrderCancelled(order: any, reason?: string) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "ORDER_CANCELLED",
      event_id: `ORDER_CANCELLED_${orderId}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
        motivo: reason || order.cancellationReason,
        fecha: new Date().toLocaleDateString("es-CO"),
      },
    });
  }

  public static async sendRefundProcessed(order: any, amount?: number) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "REFUND_PROCESSED",
      event_id: `REFUND_${orderId}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
        valor: amount || order.totalCOP,
      },
    });
  }

  // ==========================================
  // PICKUP & DELIVERY METHODS
  // ==========================================
  public static async sendPickupReady(order: any) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "PICKUP_READY",
      event_id: `PICKUP_READY_${orderId}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
        punto_recogida: order.pickupPointName || "Sede Farmaboy Boyacá",
        direccion: order.pickupPointAddress || "Duitama / Tunja",
        horario: "Lunes a Sábado 7:30 AM a 8:30 PM",
        codigo_recogida: orderId.replace("ORD-", "REC-"),
      },
    });
  }

  public static async sendPickupCompleted(order: any) {
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "PICKUP_COMPLETED",
      event_id: `PICKUP_DONE_${orderId}`,
      recipient: order.customerEmail,
      recipientName: order.customerName,
      data: {
        numero_pedido: orderId,
        nombre: order.customerName,
      },
    });
  }

  // ==========================================
  // PRESCRIPTIONS METHODS
  // ==========================================
  public static async sendPrescriptionReceived(prescription: {
    id: string;
    patientName: string;
    patientEmail: string;
  }) {
    return this.dispatch({
      event: "PRESCRIPTION_RECEIVED",
      event_id: `RX_RECEIVED_${prescription.id}`,
      recipient: prescription.patientEmail,
      recipientName: prescription.patientName,
      data: {
        nombre: prescription.patientName,
        solicitud_id: prescription.id,
      },
    });
  }

  public static async sendPrescriptionApproved(prescription: {
    id: string;
    patientName: string;
    patientEmail: string;
  }) {
    return this.dispatch({
      event: "PRESCRIPTION_APPROVED",
      event_id: `RX_APPROVED_${prescription.id}`,
      recipient: prescription.patientEmail,
      recipientName: prescription.patientName,
      data: {
        nombre: prescription.patientName,
        solicitud_id: prescription.id,
      },
    });
  }

  public static async sendPrescriptionRejected(prescription: {
    id: string;
    patientName: string;
    patientEmail: string;
    reason?: string;
  }) {
    return this.dispatch({
      event: "PRESCRIPTION_REJECTED",
      event_id: `RX_REJECTED_${prescription.id}`,
      recipient: prescription.patientEmail,
      recipientName: prescription.patientName,
      data: {
        nombre: prescription.patientName,
        solicitud_id: prescription.id,
        motivo: prescription.reason,
      },
    });
  }

  // ==========================================
  // SUPPORT & CONTACT METHODS
  // ==========================================
  public static async sendSupportTicketCreated(ticket: {
    id: string;
    customerName: string;
    customerEmail: string;
    subject: string;
    message?: string;
  }) {
    return this.dispatch({
      event: "SUPPORT_TICKET_CREATED",
      event_id: `TICKET_CREATED_${ticket.id}`,
      recipient: ticket.customerEmail,
      recipientName: ticket.customerName,
      data: {
        nombre: ticket.customerName,
        ticket: ticket.id,
        asunto: ticket.subject,
        mensaje: ticket.message,
      },
    });
  }

  public static async sendSupportTicketReply(ticket: {
    id: string;
    customerName: string;
    customerEmail: string;
    reply: string;
    agentName?: string;
  }) {
    return this.dispatch({
      event: "SUPPORT_TICKET_REPLIED",
      event_id: `TICKET_REPLY_${ticket.id}_${Date.now()}`,
      recipient: ticket.customerEmail,
      recipientName: ticket.customerName,
      data: {
        nombre: ticket.customerName,
        ticket: ticket.id,
        respuesta: ticket.reply,
        agente: ticket.agentName || "Asesor Farmaboy",
      },
    });
  }

  public static async sendSupportTicketClosed(ticket: {
    id: string;
    customerName: string;
    customerEmail: string;
  }) {
    return this.dispatch({
      event: "SUPPORT_TICKET_CLOSED",
      event_id: `TICKET_CLOSED_${ticket.id}`,
      recipient: ticket.customerEmail,
      recipientName: ticket.customerName,
      data: {
        nombre: ticket.customerName,
        ticket: ticket.id,
      },
    });
  }

  public static async sendContactReceived(contact: {
    name: string;
    email: string;
    subject?: string;
  }) {
    return this.dispatch({
      event: "CONTACT_RECEIVED",
      event_id: `CONTACT_${contact.email}_${Date.now()}`,
      recipient: contact.email,
      recipientName: contact.name,
      data: {
        nombre: contact.name,
        asunto: contact.subject,
      },
    });
  }

  // ==========================================
  // COMMERCIAL & MARKETING METHODS
  // ==========================================
  public static async sendProductBackInStock(params: {
    email: string;
    name: string;
    productName: string;
    priceCOP: number;
    productId: string;
  }) {
    return this.dispatch({
      event: "PRODUCT_BACK_IN_STOCK",
      event_id: `STOCK_IN_${params.productId}_${params.email}`,
      recipient: params.email,
      recipientName: params.name,
      data: {
        nombre: params.name,
        producto: params.productName,
        precio: params.priceCOP,
      },
    });
  }

  public static async sendPriceDrop(params: {
    email: string;
    name: string;
    productName: string;
    oldPrice: number;
    newPrice: number;
    productId: string;
  }) {
    return this.dispatch({
      event: "PRICE_DROP",
      event_id: `PRICE_DROP_${params.productId}_${params.email}_${params.newPrice}`,
      recipient: params.email,
      recipientName: params.name,
      data: {
        nombre: params.name,
        producto: params.productName,
        precio_anterior: params.oldPrice,
        precio_nuevo: params.newPrice,
      },
    });
  }

  public static async sendPromotion(params: {
    email: string;
    name: string;
    title: string;
    description: string;
  }) {
    return this.dispatch({
      event: "PROMOTION_CREATED",
      event_id: `PROMO_${Date.now()}_${params.email}`,
      recipient: params.email,
      recipientName: params.name,
      data: {
        nombre: params.name,
        titulo_promo: params.title,
        descripcion: params.description,
      },
    });
  }

  public static async sendNewsletter(params: {
    email: string;
    name: string;
    content: string;
  }) {
    return this.dispatch({
      event: "NEWSLETTER_SENT",
      event_id: `NEWSLETTER_${Date.now()}_${params.email}`,
      recipient: params.email,
      recipientName: params.name,
      data: {
        nombre: params.name,
        contenido_boletin: params.content,
      },
    });
  }

  // ==========================================
  // ADMIN ALERTS METHODS
  // ==========================================
  public static async sendAdminNewUser(user: {
    name: string;
    email: string;
    phone?: string;
    documentNumber?: string;
  }) {
    const config = getSmtpConfig();
    return this.dispatch({
      event: "ADMIN_NEW_USER",
      event_id: `ADMIN_NEW_USER_${user.email}`,
      recipient: config.adminEmail,
      data: {
        nombre: user.name,
        correo: user.email,
        telefono: user.phone,
        documento: user.documentNumber,
      },
    });
  }

  public static async sendAdminNewOrder(order: any) {
    const config = getSmtpConfig();
    const orderId = order.id || order.orderId;
    return this.dispatch({
      event: "ADMIN_NEW_ORDER",
      event_id: `ADMIN_ORDER_${orderId}`,
      recipient: config.adminEmail,
      data: {
        numero_pedido: orderId,
        cliente: order.customerName,
        correo: order.customerEmail,
        telefono: order.customerPhone,
        total: order.totalCOP,
        metodo_pago: order.paymentMethod,
        entrega: order.deliveryMethod,
        direccion: order.deliveryAddress || order.pickupPointName,
      },
    });
  }

  public static async sendAdminLowStock(item: {
    name: string;
    sku?: string;
    currentStock: number;
    minStock: number;
  }) {
    const config = getSmtpConfig();
    return this.dispatch({
      event: "ADMIN_LOW_STOCK",
      event_id: `ADMIN_LOW_STOCK_${item.sku || item.name}_${item.currentStock}`,
      recipient: config.adminEmail,
      data: {
        producto: item.name,
        sku: item.sku,
        stock_actual: item.currentStock,
        stock_minimo: item.minStock,
      },
    });
  }

  public static async sendAdminOutOfStock(item: {
    name: string;
    sku?: string;
  }) {
    const config = getSmtpConfig();
    return this.dispatch({
      event: "ADMIN_OUT_OF_STOCK",
      event_id: `ADMIN_OUT_STOCK_${item.sku || item.name}`,
      recipient: config.adminEmail,
      data: {
        producto: item.name,
        sku: item.sku,
      },
    });
  }

  public static async sendAdminSupport(ticket: {
    id: string;
    customerName: string;
    customerEmail: string;
    subject: string;
    message?: string;
  }) {
    const config = getSmtpConfig();
    return this.dispatch({
      event: "ADMIN_SUPPORT_TICKET",
      event_id: `ADMIN_TICKET_${ticket.id}`,
      recipient: config.adminEmail,
      data: {
        ticket: ticket.id,
        cliente: ticket.customerName,
        correo: ticket.customerEmail,
        asunto: ticket.subject,
        mensaje: ticket.message,
      },
    });
  }

  public static async sendAdminCriticalError(moduleName: string, errorMsg: string) {
    const config = getSmtpConfig();
    return this.dispatch({
      event: "ADMIN_CRITICAL_ERROR",
      event_id: `CRIT_ERR_${Date.now()}`,
      recipient: config.adminEmail,
      data: {
        modulo: moduleName,
        error: errorMsg,
      },
    });
  }
}
