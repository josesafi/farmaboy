export function renderButton(options: {
  text: string;
  url: string;
  color?: "green" | "blue" | "red" | "dark";
}): string {
  const bg =
    options.color === "red"
      ? "#DC2626"
      : options.color === "blue"
      ? "#2563EB"
      : options.color === "dark"
      ? "#0F172A"
      : "#00A86B"; // default Farmaboy green

  return `
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
    <tr>
      <td align="center" style="border-radius: 12px; background-color: ${bg};">
        <a href="${options.url}" target="_blank" style="font-size: 14px; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 12px; display: inline-block; letter-spacing: 0.3px;">
          ${options.text}
        </a>
      </td>
    </tr>
  </table>
  `;
}

export function renderStatusBadge(options: {
  label: string;
  type?: "success" | "warning" | "danger" | "info";
}): string {
  const styles = {
    success: "background-color: #ECFDF5; border: 1px solid #A7F3D0; color: #065F46;",
    warning: "background-color: #FFFBEB; border: 1px solid #FDE68A; color: #92400E;",
    danger: "background-color: #FEF2F2; border: 1px solid #FECACA; color: #991B1B;",
    info: "background-color: #EFF6FF; border: 1px solid #BFDBFE; color: #1E40AF;",
  }[options.type || "info"];

  return `<span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; ${styles}">${options.label}</span>`;
}

export function renderCard(options: {
  title?: string;
  content: string;
  badge?: string;
}): string {
  return `
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; margin: 18px 0; padding: 20px;">
    ${
      options.title
        ? `<tr>
            <td style="padding-bottom: 12px; border-bottom: 1px solid #E2E8F0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td><strong style="font-size: 14px; color: #0F172A;">${options.title}</strong></td>
                  ${options.badge ? `<td align="right">${options.badge}</td>` : ""}
                </tr>
              </table>
            </td>
          </tr>`
        : ""
    }
    <tr>
      <td style="padding-top: ${options.title ? "14px" : "0"}; font-size: 13px; color: #475569;">
        ${options.content}
      </td>
    </tr>
  </table>
  `;
}

export function renderOrderSummary(options: {
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    priceCOP: number;
    imageUrl?: string;
    sku?: string;
  }>;
  subtotalCOP: number;
  discountCOP?: number;
  shippingCOP?: number;
  totalCOP: number;
}): string {
  const itemsHtml = options.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9;">
          <p style="margin: 0; font-size: 13px; font-weight: 700; color: #0F172A;">${item.name}</p>
          ${item.sku ? `<span style="font-size: 11px; color: #94A3B8;">SKU: ${item.sku}</span> &bull; ` : ""}
          <span style="font-size: 12px; color: #64748B;">Cantidad: ${item.quantity}</span>
        </td>
        <td align="right" style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; font-weight: 700; color: #0F172A;">
          $${(item.priceCOP * item.quantity).toLocaleString("es-CO")} COP
        </td>
      </tr>
    `
    )
    .join("");

  return `
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; margin: 20px 0; overflow: hidden;">
    <tr>
      <td style="background-color: #F8FAFC; padding: 14px 20px; border-bottom: 1px solid #E2E8F0;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td><strong style="font-size: 14px; color: #0F172A;">Resumen del Pedido #${options.orderId}</strong></td>
            <td align="right"><span style="font-size: 12px; color: #64748B;">${options.items.length} producto(s)</span></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 20px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          ${itemsHtml}
        </table>

        <!-- Totals breakdown -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 14px; border-top: 1px solid #E2E8F0; padding-top: 12px;">
          <tr>
            <td style="padding: 4px 0; font-size: 12px; color: #64748B;">Subtotal productos:</td>
            <td align="right" style="padding: 4px 0; font-size: 12px; font-weight: 600; color: #334155;">$${options.subtotalCOP.toLocaleString("es-CO")} COP</td>
          </tr>
          ${
            options.discountCOP && options.discountCOP > 0
              ? `<tr>
                  <td style="padding: 4px 0; font-size: 12px; color: #059669;">Descuento aplicado:</td>
                  <td align="right" style="padding: 4px 0; font-size: 12px; font-weight: 700; color: #059669;">-$${options.discountCOP.toLocaleString("es-CO")} COP</td>
                </tr>`
              : ""
          }
          <tr>
            <td style="padding: 4px 0; font-size: 12px; color: #64748B;">Costo de envío / domicilio:</td>
            <td align="right" style="padding: 4px 0; font-size: 12px; font-weight: 600; color: #334155;">
              ${options.shippingCOP && options.shippingCOP > 0 ? `$${options.shippingCOP.toLocaleString("es-CO")} COP` : `<span style="color: #059669; font-weight: 700;">¡Gratis!</span>`}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0 4px 0; font-size: 15px; font-weight: 800; color: #0F172A; border-top: 2px solid #E2E8F0;">Total a pagar:</td>
            <td align="right" style="padding: 10px 0 4px 0; font-size: 18px; font-weight: 900; color: #00A86B; border-top: 2px solid #E2E8F0;">
              $${options.totalCOP.toLocaleString("es-CO")} COP
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
}

export function renderDeliveryCard(options: {
  city: string;
  address: string;
  notes?: string;
}): string {
  return renderCard({
    title: "🚚 Datos de Domicilio & Entrega",
    content: `
      <p style="margin: 0 0 6px 0;"><strong>Ciudad / Municipio:</strong> ${options.city}, Boyacá</p>
      <p style="margin: 0 0 6px 0;"><strong>Dirección exacta:</strong> ${options.address}</p>
      ${options.notes ? `<p style="margin: 0; color: #64748B;"><strong>Instrucciones:</strong> ${options.notes}</p>` : ""}
    `,
  });
}

export function renderPickupCard(options: {
  pointName?: string;
  address?: string;
  schedule?: string;
  code?: string;
}): string {
  return renderCard({
    title: "📦 Punto de Recogida en Boyacá",
    content: `
      <p style="margin: 0 0 6px 0;"><strong>Sede:</strong> ${options.pointName || "Sede Principal Farmaboy"}</p>
      <p style="margin: 0 0 6px 0;"><strong>Dirección:</strong> ${options.address || "Duitama / Tunja, Boyacá"}</p>
      <p style="margin: 0 0 6px 0;"><strong>Horario de atención:</strong> ${options.schedule || "Lunes a Sábado 7:30 AM a 8:30 PM | Domingos 8:00 AM a 6:00 PM"}</p>
      ${options.code ? `<div style="margin-top: 10px; padding: 10px; background-color: #ECFDF5; border-radius: 8px; border: 1px dashed #00A86B; text-align: center;"><span style="font-size: 11px; color: #065F46; font-weight: 700;">CÓDIGO DE RECOGIDA:</span><br/><strong style="font-size: 20px; letter-spacing: 3px; color: #00A86B;">${options.code}</strong></div>` : ""}
    `,
  });
}

export function renderPaymentCard(options: {
  method: string;
  status: string;
  approvalCode?: string;
  qrNote?: string;
}): string {
  return renderCard({
    title: "💳 Información de Pago",
    content: `
      <p style="margin: 0 0 6px 0;"><strong>Método seleccionado:</strong> ${options.method}</p>
      <p style="margin: 0 0 6px 0;"><strong>Estado del pago:</strong> <span style="font-weight: 700;">${options.status}</span></p>
      ${options.approvalCode ? `<p style="margin: 0 0 6px 0;"><strong>Referencia / Aprobación:</strong> <code style="background-color: #F1F5F9; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${options.approvalCode}</code></p>` : ""}
      ${options.qrNote ? `<div style="margin-top: 8px; padding: 10px; background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; font-size: 12px; color: #92400E;">${options.qrNote}</div>` : ""}
    `,
  });
}

export function renderSecurityAlertBox(options: {
  device?: string;
  browser?: string;
  ip?: string;
  date?: string;
  location?: string;
}): string {
  return `
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 14px; padding: 16px; margin: 18px 0;">
    <tr>
      <td>
        <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 800; color: #991B1B;">
          ⚠️ Detalle de la actividad de seguridad:
        </p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #7F1D1D;">
          <tr><td style="padding: 3px 0;"><strong>Fecha y hora:</strong></td><td align="right">${options.date || new Date().toLocaleString("es-CO")}</td></tr>
          <tr><td style="padding: 3px 0;"><strong>Dispositivo:</strong></td><td align="right">${options.device || "Dispositivo móvil / Desktop"}</td></tr>
          <tr><td style="padding: 3px 0;"><strong>Navegador:</strong></td><td align="right">${options.browser || "Navegador Web"}</td></tr>
          <tr><td style="padding: 3px 0;"><strong>Dirección IP:</strong></td><td align="right">${options.ip || "Protegida"}</td></tr>
          <tr><td style="padding: 3px 0;"><strong>Ubicación aproximada:</strong></td><td align="right">${options.location || "Boyacá / Colombia"}</td></tr>
        </table>
      </td>
    </tr>
  </table>
  `;
}
