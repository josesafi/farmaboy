import { EmailEventType, EmailTemplateDefinition } from "../types";
import { renderEmailLayout } from "./layout";
import {
  renderButton,
  renderCard,
  renderOrderSummary,
  renderDeliveryCard,
  renderPickupCard,
  renderPaymentCard,
  renderSecurityAlertBox,
  renderStatusBadge,
} from "./components";

export const emailTemplates: Record<EmailEventType, EmailTemplateDefinition> = {
  // ==========================================
  // 1. ACCOUNT & SECURITY
  // ==========================================
  USER_REGISTERED: {
    id: "user_registered",
    event: "USER_REGISTERED",
    name: "Bienvenida a Farmaboy",
    category: "ACCOUNT",
    defaultSubject: "¡Bienvenido a Farmaboy! Tu droguería de confianza en Boyacá",
    allowedVariables: ["nombre", "correo", "fecha", "enlace_cuenta", "enlace_verificacion"],
    description: "Enviado inmediatamente tras completar el registro de un nuevo cliente o paciente.",
    render: (data) => {
      const nombre = data.nombre || "Estimado(a) Cliente";
      const correo = data.correo || "";
      const fecha = data.fecha || new Date().toLocaleDateString("es-CO");
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlaceCuenta = data.enlace_cuenta || `${siteUrl}/mi-cuenta`;
      const enlaceVerificacion = data.enlace_verificacion || `${siteUrl}/verificar-correo?email=${encodeURIComponent(correo)}`;

      const html = renderEmailLayout({
        title: "¡Bienvenido a Farmaboy!",
        preheader: `Hola ${nombre}, tu cuenta en Farmaboy está lista.`,
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 12px 0;">
            ¡Hola ${nombre}, te damos la bienvenida a Farmaboy! 🌿
          </h2>
          <p style="margin: 0 0 16px 0; color: #475569;">
            Tu cuenta de Farmaboy fue creada correctamente. Desde ahora puedes acceder a nuestro catálogo completo de medicamentos certificados, productos de cuidado personal, realizar pedidos con domicilio en Boyacá o programar recogida en nuestras sedes.
          </p>
          ${renderCard({
            title: "📋 Datos de tu cuenta",
            content: `
              <p style="margin: 0 0 6px 0;"><strong>Nombre completo:</strong> ${nombre}</p>
              <p style="margin: 0 0 6px 0;"><strong>Correo de acceso:</strong> ${correo}</p>
              <p style="margin: 0;"><strong>Fecha de registro:</strong> ${fecha}</p>
            `,
          })}
          <div style="text-align: center; margin: 24px 0;">
            ${renderButton({ text: "CONFIRMAR MI CORREO ELECTRÓNICO", url: enlaceVerificacion, color: "green" })}
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748B;">
              O ingresa directamente a <a href="${enlaceCuenta}" style="color: #00A86B; font-weight: 700;">Mi Cuenta Farmaboy</a>
            </p>
          </div>
          <p style="font-size: 12px; color: #94A3B8; margin-top: 20px;">
            Por tu seguridad, nunca compartas tus credenciales de acceso con terceros. Farmaboy nunca te solicitará tu contraseña por correo electrónico ni por teléfono.
          </p>
        `,
      });

      return {
        subject: `¡Bienvenido a Farmaboy! Tu droguería de confianza`,
        html,
        text: `Hola ${nombre}, tu cuenta de Farmaboy fue creada correctamente con el correo ${correo}. Accede en ${enlaceCuenta}`,
      };
    },
  },

  USER_EMAIL_VERIFIED: {
    id: "user_email_verified",
    event: "USER_EMAIL_VERIFIED",
    name: "Correo Verificado Correctamente",
    category: "ACCOUNT",
    defaultSubject: "Tu correo electrónico fue verificado — Farmaboy",
    allowedVariables: ["nombre", "correo", "fecha", "enlace_cuenta"],
    description: "Enviado cuando el usuario hace clic en el enlace de verificación y confirma su buzón.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlaceCuenta = data.enlace_cuenta || `${siteUrl}/mi-cuenta`;

      const html = renderEmailLayout({
        title: "Correo verificado exitosamente",
        category: "ACCOUNT",
        content: `
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 50px; height: 50px; border-radius: 50%; background-color: #ECFDF5; line-height: 50px; font-size: 26px; color: #00A86B;">
              ✓
            </div>
            <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 12px 0 4px 0;">
              ¡Correo verificado correctamente!
            </h2>
            <p style="color: #64748B; font-size: 13px; margin: 0;">
              Hola ${nombre}, tu dirección de correo electrónico ha sido validada.
            </p>
          </div>
          <p style="color: #475569;">
            Tu cuenta ahora cuenta con el nivel de seguridad verificado. Podrás recibir notificaciones en tiempo real sobre tus despachos y gestionar tus fórmulas médicas de manera prioritaria.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "IR A MI CUENTA", url: enlaceCuenta, color: "green" })}
          </div>
        `,
      });
      return {
        subject: "Tu correo electrónico fue verificado — Farmaboy",
        html,
        text: `Hola ${nombre}, tu correo fue verificado exitosamente en Farmaboy.`,
      };
    },
  },

  USER_LOGIN: {
    id: "user_login",
    event: "USER_LOGIN",
    name: "Nuevo Inicio de Sesión",
    category: "ACCOUNT",
    defaultSubject: "Nuevo inicio de sesión en tu cuenta Farmaboy",
    allowedVariables: ["nombre", "fecha", "hora", "dispositivo", "navegador", "ip", "ubicacion", "enlace_seguridad"],
    description: "Notificación preventiva ante un nuevo inicio de sesión.",
    render: (data) => {
      const nombre = data.nombre || "Usuario";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlaceSeguridad = data.enlace_seguridad || `${siteUrl}/mi-cuenta/seguridad`;

      const html = renderEmailLayout({
        title: "Nuevo inicio de sesión detectado",
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">
            Aviso de inicio de sesión
          </h2>
          <p style="color: #475569; margin: 0 0 16px 0;">
            Hola ${nombre}, hemos detectado un nuevo inicio de sesión en tu cuenta de Farmaboy.
          </p>
          ${renderSecurityAlertBox({
            date: `${data.fecha || "Hoy"} a las ${data.hora || ""}`,
            device: data.dispositivo,
            browser: data.navegador,
            ip: data.ip,
            location: data.ubicacion,
          })}
          <p style="font-size: 13px; color: #64748B;">
            Si fuiste tú, no es necesario realizar ninguna acción. Si no reconoces este acceso, te sugerimos cambiar tu contraseña inmediatamente y cerrar las demás sesiones activas.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "REVISAR MI CUENTA & SEGURIDAD", url: enlaceSeguridad, color: "dark" })}
          </div>
        `,
      });
      return {
        subject: "Nuevo inicio de sesión en tu cuenta Farmaboy",
        html,
        text: `Nuevo inicio de sesión detectado para ${nombre} el ${data.fecha || "hoy"} desde ${data.dispositivo || "dispositivo web"}.`,
      };
    },
  },

  USER_NEW_DEVICE: {
    id: "user_new_device",
    event: "USER_NEW_DEVICE",
    name: "Nuevo Dispositivo Detectado",
    category: "ACCOUNT",
    defaultSubject: "Alerta: Nuevo dispositivo detectado en tu cuenta Farmaboy",
    allowedVariables: ["nombre", "fecha", "dispositivo", "navegador", "ip", "ubicacion", "enlace_seguridad"],
    description: "Alerta de seguridad al iniciar sesión desde un dispositivo nunca antes registrado.",
    render: (data) => {
      const nombre = data.nombre || "Usuario";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlaceSeguridad = data.enlace_seguridad || `${siteUrl}/mi-cuenta/seguridad`;

      const html = renderEmailLayout({
        title: "Nuevo dispositivo conectado",
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #B91C1C; margin: 0 0 10px 0;">
            ⚠️ Nuevo dispositivo detectado
          </h2>
          <p style="color: #475569; margin: 0 0 16px 0;">
            Hola ${nombre}, se inició sesión en tu cuenta de Farmaboy desde un dispositivo nuevo o navegador no reconocido previamente.
          </p>
          ${renderSecurityAlertBox({
            date: data.fecha || new Date().toLocaleString("es-CO"),
            device: data.dispositivo || "Dispositivo no reconocido",
            browser: data.navegador || "Navegador web",
            ip: data.ip,
            location: data.ubicacion || "Boyacá, Colombia",
          })}
          <div style="text-align: center;">
            ${renderButton({ text: "PROTEGER MI CUENTA", url: enlaceSeguridad, color: "red" })}
          </div>
        `,
      });
      return {
        subject: "Alerta: Nuevo dispositivo detectado en tu cuenta Farmaboy",
        html,
        text: `Alerta: Nuevo dispositivo detectado en la cuenta de ${nombre}. Si no fuiste tú, ingresa a ${enlaceSeguridad}`,
      };
    },
  },

  PASSWORD_RESET_REQUESTED: {
    id: "password_reset_requested",
    event: "PASSWORD_RESET_REQUESTED",
    name: "Recuperación de Contraseña",
    category: "ACCOUNT",
    defaultSubject: "Restablece tu contraseña — Farmaboy",
    allowedVariables: ["nombre", "enlace_restablecer", "expiracion_minutos"],
    description: "Enviado cuando el usuario solicita recuperar su contraseña con un token seguro de un solo uso.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const enlace = data.enlace_restablecer || "#";
      const expiracion = data.expiracion_minutos || 60;

      const html = renderEmailLayout({
        title: "Restablece tu contraseña",
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 12px 0;">
            Solicitud de restablecimiento de contraseña 🔐
          </h2>
          <p style="margin: 0 0 16px 0; color: #475569;">
            Hola ${nombre}, recibimos una solicitud para restablecer la contraseña de acceso a tu cuenta en Farmaboy.
          </p>
          <p style="margin: 0 0 20px 0; color: #475569;">
            Haz clic en el siguiente botón seguro para ingresar una nueva clave. Este enlace es de <strong>un solo uso</strong> y expirará en <strong>${expiracion} minutos</strong>:
          </p>
          <div style="text-align: center; margin: 28px 0;">
            ${renderButton({ text: "RESTABLECER MI CONTRASEÑA", url: enlace, color: "green" })}
          </div>
          ${renderCard({
            title: "🛡️ Consejos de seguridad",
            content: `
              <p style="margin: 0;">Si tú no solicitaste este cambio, puedes ignorar este mensaje; tu contraseña actual continuará siendo segura. Nunca reveles tus contraseñas a nadie.</p>
            `,
          })}
        `,
      });
      return {
        subject: "Restablece tu contraseña — Farmaboy",
        html,
        text: `Hola ${nombre}, para restablecer tu contraseña en Farmaboy ingresa a: ${enlace} (válido por ${expiracion} minutos).`,
      };
    },
  },

  PASSWORD_CHANGED: {
    id: "password_changed",
    event: "PASSWORD_CHANGED",
    name: "Contraseña Actualizada",
    category: "ACCOUNT",
    defaultSubject: "Tu contraseña fue actualizada — Farmaboy",
    allowedVariables: ["nombre", "fecha", "hora", "enlace_seguridad"],
    description: "Confirmación de seguridad inmediata tras modificarse la contraseña.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlaceSeguridad = data.enlace_seguridad || `${siteUrl}/mi-cuenta/seguridad`;

      const html = renderEmailLayout({
        title: "Contraseña actualizada exitosamente",
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 18px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            Tu contraseña fue actualizada correctamente
          </h2>
          <p style="color: #475569; margin: 0 0 16px 0;">
            Hola ${nombre}, te informamos que la contraseña de tu cuenta Farmaboy fue modificada el ${data.fecha || "hoy"} a las ${data.hora || ""}.
          </p>
          ${renderCard({
            title: "ℹ️ Confirmación de seguridad",
            content: `<p style="margin: 0;">Si realizaste este cambio, puedes continuar utilizando Farmaboy normalmente. Si NO fuiste tú, comunícate de inmediato con nuestro equipo de soporte.</p>`,
          })}
          <div style="text-align: center;">
            ${renderButton({ text: "VERIFICAR ACTIVIDAD DE SEGURIDAD", url: enlaceSeguridad, color: "dark" })}
          </div>
        `,
      });
      return {
        subject: "Tu contraseña fue actualizada — Farmaboy",
        html,
        text: `Hola ${nombre}, la contraseña de tu cuenta Farmaboy fue actualizada correctamente.`,
      };
    },
  },

  EMAIL_CHANGED: {
    id: "email_changed",
    event: "EMAIL_CHANGED",
    name: "Correo Electrónico Modificado",
    category: "ACCOUNT",
    defaultSubject: "Cambio de correo electrónico en tu cuenta Farmaboy",
    allowedVariables: ["nombre", "correo_anterior", "correo_nuevo", "fecha", "enlace_seguridad"],
    description: "Notificación enviada al correo anterior cuando el usuario actualiza su email.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const siteUrl = data.siteUrl || "https://farmaboy.com";

      const html = renderEmailLayout({
        title: "Actualización de correo electrónico",
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">
            Aviso de cambio de correo
          </h2>
          <p style="color: #475569; margin: 0 0 16px 0;">
            Hola ${nombre}, te informamos que la dirección de correo electrónico asociada a tu cuenta Farmaboy fue modificada a: <strong>${data.correo_nuevo || ""}</strong>.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "CONTACTAR SOPORTE SI NO RECONOCES ESTO", url: `${siteUrl}/contacto`, color: "red" })}
          </div>
        `,
      });
      return {
        subject: "Cambio de correo electrónico en tu cuenta Farmaboy",
        html,
        text: `Hola ${nombre}, el correo de tu cuenta Farmaboy fue cambiado a ${data.correo_nuevo}.`,
      };
    },
  },

  ACCOUNT_DELETED: {
    id: "account_deleted",
    event: "ACCOUNT_DELETED",
    name: "Cuenta Eliminada",
    category: "ACCOUNT",
    defaultSubject: "Tu cuenta de Farmaboy fue eliminada",
    allowedVariables: ["nombre", "fecha"],
    description: "Confirmación tras la eliminación voluntaria o administrativa de una cuenta.",
    render: (data) => {
      const nombre = data.nombre || "Usuario";
      const html = renderEmailLayout({
        title: "Cuenta eliminada",
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">
            Confirmación de eliminación de cuenta
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola ${nombre}, confirmamos que tu cuenta en Farmaboy ha sido eliminada de conformidad con las leyes de protección de datos personales (Habeas Data).
          </p>
          <p style="color: #64748B; font-size: 12px;">
            Agradecemos el tiempo que estuviste con nosotros. Si en el futuro deseas volver a disfrutar de nuestros servicios, siempre serás bienvenido(a).
          </p>
        `,
      });
      return {
        subject: "Tu cuenta de Farmaboy fue eliminada",
        html,
        text: `Hola ${nombre}, tu cuenta en Farmaboy fue eliminada satisfactoriamente.`,
      };
    },
  },

  ACCOUNT_BLOCKED: {
    id: "account_blocked",
    event: "ACCOUNT_BLOCKED",
    name: "Cuenta Bloqueada por Seguridad",
    category: "ACCOUNT",
    defaultSubject: "Aviso importante: Cuenta bloqueada temporalmente — Farmaboy",
    allowedVariables: ["nombre", "motivo", "enlace_desbloqueo"],
    description: "Alerta ante múltiples intentos fallidos de inicio de sesión.",
    render: (data) => {
      const nombre = data.nombre || "Usuario";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlaceDesbloqueo = data.enlace_desbloqueo || `${siteUrl}/recuperar-cuenta`;

      const html = renderEmailLayout({
        title: "Cuenta bloqueada por seguridad",
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #991B1B; margin: 0 0 10px 0;">
            Cuenta bloqueada temporalmente 🛑
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola ${nombre}, por motivos de seguridad hemos bloqueado temporalmente el acceso a tu cuenta debido a múltiples intentos de contraseña incorrecta.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "DESBLOQUEAR MI CUENTA", url: enlaceDesbloqueo, color: "green" })}
          </div>
        `,
      });
      return {
        subject: "Aviso importante: Cuenta bloqueada temporalmente — Farmaboy",
        html,
        text: `Hola ${nombre}, tu cuenta fue bloqueada temporalmente por seguridad. Desbloquéala en ${enlaceDesbloqueo}`,
      };
    },
  },

  SECURITY_ALERT: {
    id: "security_alert",
    event: "SECURITY_ALERT",
    name: "Alerta General de Seguridad",
    category: "ACCOUNT",
    defaultSubject: "Alerta de seguridad en tu cuenta Farmaboy",
    allowedVariables: ["nombre", "detalle", "enlace_seguridad"],
    description: "Notificación de actividad sospechosa o eventos de seguridad.",
    render: (data) => {
      const nombre = data.nombre || "Usuario";
      const siteUrl = data.siteUrl || "https://farmaboy.com";

      const html = renderEmailLayout({
        title: "Alerta de seguridad",
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #991B1B; margin: 0 0 10px 0;">
            Alerta de seguridad en tu cuenta
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola ${nombre}, ${data.detalle || "Hemos detectado una actividad inusual en tu cuenta."}
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "REVISAR ACTIVIDAD", url: `${siteUrl}/mi-cuenta/seguridad`, color: "red" })}
          </div>
        `,
      });
      return {
        subject: "Alerta de seguridad en tu cuenta Farmaboy",
        html,
        text: `Alerta de seguridad en la cuenta de ${nombre}: ${data.detalle || "Actividad sospechosa detectada."}`,
      };
    },
  },

  // ==========================================
  // 2. ORDERS & PAYMENTS
  // ==========================================
  ORDER_CREATED: {
    id: "order_created",
    event: "ORDER_CREATED",
    name: "Pedido Recibido",
    category: "ORDER",
    defaultSubject: "Recibimos tu pedido #{{numero_pedido}} — Farmaboy",
    allowedVariables: [
      "nombre",
      "numero_pedido",
      "fecha",
      "productos",
      "subtotal",
      "descuento",
      "costo_domicilio",
      "total",
      "metodo_pago",
      "domicilio_o_recogida",
      "estado",
      "enlace_pedido",
    ],
    description: "Enviado tan pronto como el cliente culmina el checkout y se genera el número de orden.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || data.orderId || "ORD-000";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlacePedido = data.enlace_pedido || `${siteUrl}/mi-cuenta/pedidos/${orderId}`;
      const items = data.items || [];
      const subtotal = data.subtotalCOP || data.subtotal || 0;
      const discount = data.discountCOP || data.descuento || 0;
      const shipping = data.shippingCOP || data.costo_domicilio || 0;
      const total = data.totalCOP || data.total || 0;
      const metodoPago = data.metodo_pago || data.paymentMethod || "Pago en línea";
      const deliveryMethod = data.domicilio_o_recogida || data.deliveryMethod || "Domicilio";

      const html = renderEmailLayout({
        title: `Recibimos tu pedido #${orderId}`,
        preheader: `Hola ${nombre}, tu pedido #${orderId} por $${total.toLocaleString("es-CO")} COP ha sido recibido.`,
        category: "ORDER",
        content: `
          <div style="margin-bottom: 20px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="font-size: 11px; font-weight: 800; color: #00A86B; text-transform: uppercase; letter-spacing: 0.5px;">
                    ¡GRACIAS POR TU COMPRA!
                  </span>
                  <h2 style="font-size: 22px; font-weight: 900; color: #0F172A; margin: 4px 0 0 0;">
                    Recibimos tu pedido #${orderId}
                  </h2>
                </td>
                <td align="right">
                  ${renderStatusBadge({ label: data.estado || "RECIBIDO", type: "info" })}
                </td>
              </tr>
            </table>
          </div>

          <p style="color: #475569; margin: 0 0 16px 0;">
            Hola <strong>${nombre}</strong>, hemos recibido correctamente tu solicitud de compra. Nuestro equipo farmacéutico en Boyacá está validando la orden para proceder con el alistamiento.
          </p>

          ${renderOrderSummary({
            orderId,
            items,
            subtotalCOP: subtotal,
            discountCOP: discount,
            shippingCOP: shipping,
            totalCOP: total,
          })}

          ${renderPaymentCard({
            method: metodoPago,
            status: data.paymentStatus || "Procesando",
            approvalCode: data.paymentApprovalCode,
            qrNote: metodoPago.includes("QR")
              ? "Pedido registrado con pago QR Bancolombia / Bre-B. Nuestro equipo validará el comprobante adjunto para despachar inmediatamente."
              : undefined,
          })}

          ${
            deliveryMethod.includes("RECOGIDA") || data.pickupPointName
              ? renderPickupCard({
                  pointName: data.pickupPointName,
                  address: data.pickupPointAddress,
                  code: data.pickupCode,
                })
              : renderDeliveryCard({
                  city: data.deliveryCity || "Tunja",
                  address: data.deliveryAddress || "Dirección suministrada",
                  notes: data.deliveryNotes,
                })
          }

          <div style="text-align: center; margin: 28px 0;">
            ${renderButton({ text: "VER ESTADO DE MI PEDIDO", url: enlacePedido, color: "green" })}
          </div>
        `,
      });

      return {
        subject: `Recibimos tu pedido #${orderId} — Farmaboy`,
        html,
        text: `Hola ${nombre}, recibimos tu pedido #${orderId} por $${total.toLocaleString("es-CO")} COP. Puedes consultar el detalle en: ${enlacePedido}`,
      };
    },
  },

  ORDER_CONFIRMED: {
    id: "order_confirmed",
    event: "ORDER_CONFIRMED",
    name: "Pedido Confirmado",
    category: "ORDER",
    defaultSubject: "¡Tu pedido #{{numero_pedido}} fue confirmado! — Farmaboy",
    allowedVariables: ["nombre", "numero_pedido", "total", "enlace_pedido"],
    description: "Enviado cuando el pedido y su pago han sido plenamente aprobados y verificados.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || data.orderId || "ORD-000";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlacePedido = data.enlace_pedido || `${siteUrl}/mi-cuenta/pedidos/${orderId}`;

      const html = renderEmailLayout({
        title: `¡Pedido #${orderId} confirmado!`,
        category: "ORDER",
        content: `
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 54px; height: 54px; border-radius: 50%; background-color: #ECFDF5; line-height: 54px; font-size: 28px; color: #00A86B;">
              ✓
            </div>
            <h2 style="font-size: 22px; font-weight: 900; color: #0F172A; margin: 12px 0 6px 0;">
              ¡Tu pedido fue confirmado!
            </h2>
            <p style="color: #64748B; font-size: 14px; margin: 0;">
              Pedido #${orderId}
            </p>
          </div>
          <p style="color: #475569; text-align: center;">
            Hola <strong>${nombre}</strong>, tu compra ha sido confirmada con éxito. Ya estamos preparando tus medicamentos y productos con los más altos estándares de calidad farmacéutica.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "VER DETALLE DEL PEDIDO", url: enlacePedido, color: "green" })}
          </div>
        `,
      });
      return {
        subject: `¡Tu pedido #${orderId} fue confirmado! — Farmaboy`,
        html,
        text: `Hola ${nombre}, tu pedido #${orderId} fue confirmado exitosamente en Farmaboy.`,
      };
    },
  },

  PAYMENT_PENDING: {
    id: "payment_pending",
    event: "PAYMENT_PENDING",
    name: "Pago Pendiente de Verificación",
    category: "ORDER",
    defaultSubject: "Tu pago está pendiente — Pedido #{{numero_pedido}}",
    allowedVariables: ["nombre", "numero_pedido", "total", "metodo_pago", "enlace_pedido"],
    description: "Notifica al cliente que su pedido está reservado a la espera de la verificación de pago (especialmente QR Bancolombia / Bre-B).",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || data.orderId || "ORD-000";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlacePedido = data.enlace_pedido || `${siteUrl}/mi-cuenta/pedidos/${orderId}`;

      const html = renderEmailLayout({
        title: `Pago pendiente para el pedido #${orderId}`,
        category: "ORDER",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #D97706; margin: 0 0 10px 0;">
            ⏳ Pago en proceso de verificación
          </h2>
          <p style="color: #475569; margin: 0 0 16px 0;">
            Hola <strong>${nombre}</strong>, tu pedido <strong>#${orderId}</strong> fue registrado exitosamente, pero el pago todavía no ha sido confirmado por la entidad financiera o nuestro equipo de tesorería.
          </p>
          ${renderCard({
            title: "📌 Estado actual",
            content: `
              <p style="margin: 0 0 6px 0;"><strong>Pedido:</strong> #${orderId}</p>
              <p style="margin: 0 0 6px 0;"><strong>Medio de pago:</strong> ${data.metodo_pago || "Transferencia / QR Bancolombia"}</p>
              <p style="margin: 0;">Si realizaste el pago mediante QR o PSE, tan pronto se confirme la transferencia tu pedido pasará automáticamente a fase de preparación.</p>
            `,
          })}
          <div style="text-align: center;">
            ${renderButton({ text: "VER ESTADO DEL PAGO", url: enlacePedido, color: "dark" })}
          </div>
        `,
      });
      return {
        subject: `Tu pago está pendiente — Pedido #${orderId}`,
        html,
        text: `Hola ${nombre}, el pago de tu pedido #${orderId} está pendiente de confirmación.`,
      };
    },
  },

  PAYMENT_APPROVED: {
    id: "payment_approved",
    event: "PAYMENT_APPROVED",
    name: "Pago Confirmado y Aprobado",
    category: "ORDER",
    defaultSubject: "¡Pago confirmado! — Pedido #{{numero_pedido}}",
    allowedVariables: ["nombre", "numero_pedido", "valor", "fecha", "metodo_pago", "transaccion_id", "enlace_pedido"],
    description: "Confirmación tras la aprobación exitosa del pago en el banco o pasarela.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || data.orderId || "ORD-000";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlacePedido = data.enlace_pedido || `${siteUrl}/mi-cuenta/pedidos/${orderId}`;
      const valor = data.valor || data.total || 0;

      const html = renderEmailLayout({
        title: `¡Pago confirmado para el pedido #${orderId}!`,
        category: "ORDER",
        content: `
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 50px; height: 50px; border-radius: 50%; background-color: #ECFDF5; line-height: 50px; font-size: 26px; color: #00A86B;">
              💳
            </div>
            <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 10px 0 4px 0;">
              ¡Tu pago fue confirmado exitosamente!
            </h2>
            <p style="color: #64748B; font-size: 13px; margin: 0;">
              Pedido #${orderId}
            </p>
          </div>
          ${renderCard({
            title: "Comprobante de transacción",
            content: `
              <p style="margin: 0 0 4px 0;"><strong>Valor pagado:</strong> $${Number(valor).toLocaleString("es-CO")} COP</p>
              <p style="margin: 0 0 4px 0;"><strong>Método:</strong> ${data.metodo_pago || "Pago electrónico"}</p>
              ${data.transaccion_id ? `<p style="margin: 0 0 4px 0;"><strong>ID de transacción:</strong> <code>${data.transaccion_id}</code></p>` : ""}
              <p style="margin: 0;"><strong>Fecha:</strong> ${data.fecha || new Date().toLocaleString("es-CO")}</p>
            `,
          })}
          <div style="text-align: center;">
            ${renderButton({ text: "VER MI PEDIDO", url: enlacePedido, color: "green" })}
          </div>
        `,
      });
      return {
        subject: `¡Pago confirmado! — Pedido #${orderId}`,
        html,
        text: `Hola ${nombre}, tu pago por $${Number(valor).toLocaleString("es-CO")} COP para el pedido #${orderId} fue aprobado con éxito.`,
      };
    },
  },

  PAYMENT_REJECTED: {
    id: "payment_rejected",
    event: "PAYMENT_REJECTED",
    name: "Pago Rechazado",
    category: "ORDER",
    defaultSubject: "No pudimos procesar tu pago — Pedido #{{numero_pedido}}",
    allowedVariables: ["nombre", "numero_pedido", "enlace_reintentar"],
    description: "Notificación de transacción declinada o rechazada por el banco.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || data.orderId || "ORD-000";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlaceReintentar = data.enlace_reintentar || `${siteUrl}/mi-cuenta/pedidos/${orderId}`;

      const html = renderEmailLayout({
        title: `Pago no procesado`,
        category: "ORDER",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #DC2626; margin: 0 0 10px 0;">
            No pudimos procesar tu pago ❌
          </h2>
          <p style="color: #475569; margin: 0 0 16px 0;">
            Hola <strong>${nombre}</strong>, la entidad bancaria o pasarela de pagos no pudo procesar la transacción para tu pedido <strong>#${orderId}</strong>.
          </p>
          <p style="color: #64748B; font-size: 13px;">
            Esto puede deberse a fondos insuficientes, límites de transacción en tu tarjeta, o rechazo de seguridad por parte del emisor. Tu pedido sigue guardado, puedes intentar pagar con otro medio o reintentar la operación.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "INTENTAR NUEVAMENTE CON OTRO MEDIO", url: enlaceReintentar, color: "green" })}
          </div>
        `,
      });
      return {
        subject: `No pudimos procesar tu pago — Pedido #${orderId}`,
        html,
        text: `Hola ${nombre}, no pudimos procesar el pago de tu pedido #${orderId}. Puedes reintentarlo en: ${enlaceReintentar}`,
      };
    },
  },

  ORDER_PREPARING: {
    id: "order_preparing",
    event: "ORDER_PREPARING",
    name: "Pedido en Preparación",
    category: "ORDER",
    defaultSubject: "Estamos preparando tu pedido 🛍️ — Farmaboy",
    allowedVariables: ["nombre", "numero_pedido", "enlace_pedido"],
    description: "Notifica al cliente que el equipo de farmacia está empacando sus productos.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || data.orderId || "ORD-000";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlace = data.enlace_pedido || `${siteUrl}/mi-cuenta/pedidos/${orderId}`;

      const html = renderEmailLayout({
        title: `Preparando tu pedido #${orderId}`,
        category: "ORDER",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            Estamos preparando tu pedido 🛍️
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, nuestro personal farmacéutico en Boyacá está seleccionando y empacando cuidadosamente los productos de tu pedido <strong>#${orderId}</strong>.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "SEGUIR ESTADO DEL PEDIDO", url: enlace, color: "green" })}
          </div>
        `,
      });
      return {
        subject: `Estamos preparando tu pedido 🛍️ — Pedido #${orderId}`,
        html,
        text: `Hola ${nombre}, estamos preparando tu pedido #${orderId} en Farmaboy.`,
      };
    },
  },

  ORDER_READY: {
    id: "order_ready",
    event: "ORDER_READY",
    name: "Pedido Listo",
    category: "ORDER",
    defaultSubject: "¡Tu pedido #{{numero_pedido}} está listo! — Farmaboy",
    allowedVariables: ["nombre", "numero_pedido", "enlace_pedido"],
    description: "Enviado cuando el pedido ha sido empacado y rotulado.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || data.orderId || "ORD-000";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlace = data.enlace_pedido || `${siteUrl}/mi-cuenta/pedidos/${orderId}`;

      const html = renderEmailLayout({
        title: `Pedido #${orderId} listo`,
        category: "ORDER",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            ¡Tu pedido está listo! ✨
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, el pedido <strong>#${orderId}</strong> ha sido empacado con éxito y se encuentra listo para su despacho o entrega.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "VER DETALLE DE MI PEDIDO", url: enlace, color: "green" })}
          </div>
        `,
      });
      return {
        subject: `¡Tu pedido #${orderId} está listo! — Farmaboy`,
        html,
        text: `Hola ${nombre}, tu pedido #${orderId} está listo.`,
      };
    },
  },

  ORDER_OUT_FOR_DELIVERY: {
    id: "order_out_for_delivery",
    event: "ORDER_OUT_FOR_DELIVERY",
    name: "Pedido en Camino (Domicilio)",
    category: "ORDER",
    defaultSubject: "🚚 Tu pedido va en camino — Farmaboy",
    allowedVariables: ["nombre", "numero_pedido", "direccion", "enlace_tracking"],
    description: "Enviado cuando el repartidor inicia la ruta de entrega.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || data.orderId || "ORD-000";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlace = data.enlace_tracking || `${siteUrl}/mi-cuenta/pedidos/${orderId}`;

      const html = renderEmailLayout({
        title: `Tu pedido #${orderId} va en camino`,
        category: "ORDER",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            🚚 ¡Tu pedido va en camino!
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, nuestro domiciliario ya se encuentra en ruta para llevar tu pedido <strong>#${orderId}</strong> a la siguiente dirección:
          </p>
          ${renderCard({
            title: "Destino de entrega",
            content: `<p style="margin: 0;"><strong>Dirección:</strong> ${data.direccion || "Dirección registrada"}</p>`,
          })}
          <p style="font-size: 13px; color: #64748B;">
            Por favor mantén tu teléfono a mano por si el domiciliario necesita confirmar la entrada o timbre.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "SEGUIR DOMICILIARIO EN TIEMPO REAL", url: enlace, color: "green" })}
          </div>
        `,
      });
      return {
        subject: `🚚 Tu pedido va en camino — Farmaboy (#${orderId})`,
        html,
        text: `Hola ${nombre}, tu pedido #${orderId} va en camino a ${data.direccion || "tu dirección"}.`,
      };
    },
  },

  ORDER_DELIVERED: {
    id: "order_delivered",
    event: "ORDER_DELIVERED",
    name: "Pedido Entregado",
    category: "ORDER",
    defaultSubject: "¡Pedido entregado! — Farmaboy",
    allowedVariables: ["nombre", "numero_pedido", "enlace_pedido", "enlace_calificar"],
    description: "Notificación de confirmación de entrega exitosa.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || data.orderId || "ORD-000";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlace = data.enlace_pedido || `${siteUrl}/mi-cuenta/pedidos/${orderId}`;

      const html = renderEmailLayout({
        title: `Pedido #${orderId} entregado`,
        category: "ORDER",
        content: `
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 50px; height: 50px; border-radius: 50%; background-color: #ECFDF5; line-height: 50px; font-size: 26px; color: #00A86B;">
              📦
            </div>
            <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 10px 0 4px 0;">
              ¡Tu pedido fue entregado con éxito!
            </h2>
            <p style="color: #64748B; font-size: 13px; margin: 0;">
              Pedido #${orderId}
            </p>
          </div>
          <p style="color: #475569; text-align: center;">
            Hola <strong>${nombre}</strong>, tu compra fue marcada como entregada. Esperamos que disfrutes tus productos y que todo haya llegado en óptimas condiciones.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "VER RESUMEN DE LA COMPRA", url: enlace, color: "green" })}
          </div>
        `,
      });
      return {
        subject: `¡Pedido entregado! — Farmaboy (#${orderId})`,
        html,
        text: `Hola ${nombre}, tu pedido #${orderId} fue entregado con éxito.`,
      };
    },
  },

  ORDER_CANCELLED: {
    id: "order_cancelled",
    event: "ORDER_CANCELLED",
    name: "Pedido Cancelado",
    category: "ORDER",
    defaultSubject: "Tu pedido #{{numero_pedido}} fue cancelado",
    allowedVariables: ["nombre", "numero_pedido", "fecha", "motivo", "enlace_soporte"],
    description: "Notificación formal de cancelación de pedido.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || data.orderId || "ORD-000";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlaceSoporte = data.enlace_soporte || `${siteUrl}/contacto`;

      const html = renderEmailLayout({
        title: `Pedido #${orderId} cancelado`,
        category: "ORDER",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #DC2626; margin: 0 0 10px 0;">
            Tu pedido #${orderId} fue cancelado
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, te informamos que el pedido <strong>#${orderId}</strong> ha sido cancelado el ${data.fecha || "hoy"}.
          </p>
          ${renderCard({
            title: "Motivo de la cancelación",
            content: `<p style="margin: 0;">${data.motivo || "Cancelación solicitada por el usuario o falta de comprobante de pago."}</p>`,
          })}
          <p style="font-size: 13px; color: #64748B;">
            Si se realizó algún cargo a tu cuenta bancaria o tarjeta, el reintegro se tramitará de acuerdo con las políticas del medio de pago utilizado.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "CONTACTAR A SOPORTE FARMABOY", url: enlaceSoporte, color: "dark" })}
          </div>
        `,
      });
      return {
        subject: `Tu pedido #${orderId} fue cancelado`,
        html,
        text: `Hola ${nombre}, tu pedido #${orderId} fue cancelado. Motivo: ${data.motivo || "Cancelado"}.`,
      };
    },
  },

  REFUND_PROCESSED: {
    id: "refund_processed",
    event: "REFUND_PROCESSED",
    name: "Reembolso Procesado",
    category: "ORDER",
    defaultSubject: "Tu reembolso ha sido procesado — Farmaboy",
    allowedVariables: ["nombre", "numero_pedido", "valor", "fecha", "metodo_devolucion"],
    description: "Notificación de emisión de reembolso o reintegro de dinero.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || data.orderId || "ORD-000";
      const valor = data.valor || 0;

      const html = renderEmailLayout({
        title: "Reembolso procesado",
        category: "ORDER",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #00A86B; margin: 0 0 10px 0;">
            Tu reembolso ha sido procesado correctamente 💰
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, hemos gestionado la devolución de dinero correspondiente a tu pedido <strong>#${orderId}</strong>.
          </p>
          ${renderCard({
            title: "Detalle del Reembolso",
            content: `
              <p style="margin: 0 0 4px 0;"><strong>Valor devuelto:</strong> $${Number(valor).toLocaleString("es-CO")} COP</p>
              <p style="margin: 0 0 4px 0;"><strong>Método:</strong> ${data.metodo_devolucion || "Reversión a medio original"}</p>
              <p style="margin: 0;"><strong>Fecha:</strong> ${data.fecha || new Date().toLocaleDateString("es-CO")}</p>
            `,
          })}
        `,
      });
      return {
        subject: "Tu reembolso ha sido procesado — Farmaboy",
        html,
        text: `Hola ${nombre}, tu reembolso por $${Number(valor).toLocaleString("es-CO")} COP para el pedido #${orderId} fue procesado.`,
      };
    },
  },

  // ==========================================
  // 3. DELIVERY & PICKUP
  // ==========================================
  DOMICILIO_CONFIRMADO: {
    id: "domicilio_confirmado",
    event: "DOMICILIO_CONFIRMADO",
    name: "Domicilio Confirmado",
    category: "ORDER",
    defaultSubject: "Domicilio confirmado — Farmaboy",
    allowedVariables: ["nombre", "numero_pedido", "direccion", "ciudad"],
    description: "Confirmación de programación del domicilio en Boyacá.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || "ORD-000";
      const html = renderEmailLayout({
        title: "Domicilio Confirmado",
        category: "ORDER",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">
            Domicilio confirmado para el pedido #${orderId}
          </h2>
          <p style="color: #475569;">
            Hola ${nombre}, tu entrega a domicilio en <strong>${data.ciudad || "Boyacá"}</strong> (${data.direccion || "dirección indicada"}) ha sido programada en nuestras rutas de despacho.
          </p>
        `,
      });
      return { subject: `Domicilio confirmado — Farmaboy (#${orderId})`, html, text: `Domicilio confirmado para #${orderId}` };
    },
  },

  DOMICILIO_EN_CAMINO: {
    id: "domicilio_en_camino",
    event: "DOMICILIO_EN_CAMINO",
    name: "Domiciliario en Camino",
    category: "ORDER",
    defaultSubject: "🚚 Domiciliario en camino a tu dirección",
    allowedVariables: ["nombre", "numero_pedido", "direccion"],
    description: "Aviso de ruta activa del repartidor.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const html = renderEmailLayout({
        title: "Domicilio en camino",
        category: "ORDER",
        content: `<p style="color: #475569;">Hola ${nombre}, nuestro domiciliario está en camino hacia tu dirección: <strong>${data.direccion || ""}</strong>.</p>`,
      });
      return { subject: "🚚 Domiciliario en camino a tu dirección", html, text: "Tu domiciliario va en camino" };
    },
  },

  DOMICILIO_ENTREGADO: {
    id: "domicilio_entregado",
    event: "DOMICILIO_ENTREGADO",
    name: "Domicilio Entregado",
    category: "ORDER",
    defaultSubject: "Domicilio entregado con éxito — Farmaboy",
    allowedVariables: ["nombre", "numero_pedido"],
    description: "Confirmación tras la entrega del pedido en puerta.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const html = renderEmailLayout({
        title: "Domicilio entregado",
        category: "ORDER",
        content: `<p style="color: #475569;">Hola ${nombre}, tu pedido #${data.numero_pedido || ""} fue entregado en la dirección indicada.</p>`,
      });
      return { subject: "Domicilio entregado con éxito — Farmaboy", html, text: "Domicilio entregado" };
    },
  },

  DOMICILIO_NO_ENTREGADO: {
    id: "domicilio_no_entregado",
    event: "DOMICILIO_NO_ENTREGADO",
    name: "Novedad en Domicilio (No Entregado)",
    category: "ORDER",
    defaultSubject: "Novedad con tu domicilio — Farmaboy",
    allowedVariables: ["nombre", "numero_pedido", "motivo", "enlace_soporte"],
    description: "Notificación de dirección incorrecta o cliente ausente.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const html = renderEmailLayout({
        title: "Novedad en entrega",
        category: "ORDER",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #DC2626; margin: 0 0 10px 0;">
            No pudimos completar tu entrega
          </h2>
          <p style="color: #475569;">
            Hola ${nombre}, nuestro domiciliario acudió a la dirección pero no fue posible completar la entrega. Motivo: <strong>${data.motivo || "Cliente ausente o dirección incompleta"}</strong>.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "COORDINAR REINTENTO DE ENTREGA", url: `${siteUrl}/contacto`, color: "green" })}
          </div>
        `,
      });
      return { subject: "Novedad con tu domicilio — Farmaboy", html, text: "Novedad en entrega de domicilio" };
    },
  },

  PICKUP_SELECTED: {
    id: "pickup_selected",
    event: "PICKUP_SELECTED",
    name: "Recogida en Punto Seleccionada",
    category: "ORDER",
    defaultSubject: "Recogida en punto seleccionada — Pedido #{{numero_pedido}}",
    allowedVariables: ["nombre", "numero_pedido", "punto_recogida", "direccion"],
    description: "Confirmación de modalidad de recogida física en sede.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || "ORD-000";
      const html = renderEmailLayout({
        title: "Recogida en punto seleccionada",
        category: "ORDER",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">
            Modalidad: Recoger en Farmacia
          </h2>
          <p style="color: #475569;">
            Hola ${nombre}, has seleccionado recoger tu pedido #${orderId} en nuestro punto: <strong>${data.punto_recogida || "Sede Farmaboy Boyacá"}</strong>.
          </p>
        `,
      });
      return { subject: `Recogida en punto seleccionada — Pedido #${orderId}`, html, text: "Recogida en punto seleccionada" };
    },
  },

  PICKUP_CONFIRMED: {
    id: "pickup_confirmed",
    event: "PICKUP_CONFIRMED",
    name: "Punto de Recogida Confirmado",
    category: "ORDER",
    defaultSubject: "Punto de recogida confirmado — Farmaboy",
    allowedVariables: ["nombre", "numero_pedido", "punto_recogida"],
    description: "Confirmación de disponibilidad en el punto seleccionado.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const html = renderEmailLayout({
        title: "Punto de recogida confirmado",
        category: "ORDER",
        content: `<p style="color: #475569;">Hola ${nombre}, el punto de recogida para tu pedido #${data.numero_pedido || ""} fue confirmado.</p>`,
      });
      return { subject: "Punto de recogida confirmado — Farmaboy", html, text: "Punto de recogida confirmado" };
    },
  },

  PICKUP_READY: {
    id: "pickup_ready",
    event: "PICKUP_READY",
    name: "Pedido Listo para Recoger",
    category: "ORDER",
    defaultSubject: "¡Tu pedido está listo para recoger! 📦 — Farmaboy",
    allowedVariables: ["nombre", "numero_pedido", "punto_recogida", "direccion", "horario", "codigo_recogida", "enlace_pedido"],
    description: "Aviso crucial de que el paquete ya se encuentra en mostrador esperando al cliente.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const orderId = data.numero_pedido || data.orderId || "ORD-000";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlace = data.enlace_pedido || `${siteUrl}/mi-cuenta/pedidos/${orderId}`;

      const html = renderEmailLayout({
        title: `¡Tu pedido #${orderId} está listo para recoger!`,
        category: "ORDER",
        content: `
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 54px; height: 54px; border-radius: 50%; background-color: #ECFDF5; line-height: 54px; font-size: 28px; color: #00A86B;">
              📦
            </div>
            <h2 style="font-size: 22px; font-weight: 900; color: #0F172A; margin: 12px 0 6px 0;">
              ¡Tu pedido está listo para recoger!
            </h2>
            <p style="color: #64748B; font-size: 13px; margin: 0;">
              Pedido #${orderId}
            </p>
          </div>
          <p style="color: #475569;">
            Hola <strong>${nombre}</strong>, tus productos han sido alistados y se encuentran disponibles en nuestro mostrador para entrega inmediata:
          </p>
          ${renderPickupCard({
            pointName: data.punto_recogida,
            address: data.direccion,
            schedule: data.horario,
            code: data.codigo_recogida,
          })}
          <p style="font-size: 12px; color: #64748B;">
            Presenta tu documento de identidad o el código de recogida al acercarte a la farmacia.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "VER UBICACIÓN & HORARIOS", url: enlace, color: "green" })}
          </div>
        `,
      });
      return {
        subject: `¡Tu pedido está listo para recoger! 📦 — Pedido #${orderId}`,
        html,
        text: `Hola ${nombre}, tu pedido #${orderId} está listo para recoger en ${data.punto_recogida || "nuestra sede"}.`,
      };
    },
  },

  PICKUP_REMINDER: {
    id: "pickup_reminder",
    event: "PICKUP_REMINDER",
    name: "Recordatorio de Recogida",
    category: "ORDER",
    defaultSubject: "Recordatorio: Tu pedido te espera en nuestro punto Farmaboy",
    allowedVariables: ["nombre", "numero_pedido", "punto_recogida", "direccion"],
    description: "Recordatorio automático cuando un paquete listo para recoger lleva más de 24 horas sin reclamar.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const html = renderEmailLayout({
        title: "Recordatorio de recogida",
        category: "ORDER",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">
            Tu pedido te está esperando ⏰
          </h2>
          <p style="color: #475569;">
            Hola ${nombre}, te recordamos que tu pedido #${data.numero_pedido || ""} sigue listo para ser reclamado en nuestro punto: <strong>${data.punto_recogida || "Sede Farmaboy"}</strong>.
          </p>
        `,
      });
      return { subject: "Recordatorio: Tu pedido te espera en Farmaboy", html, text: "Recordatorio de recogida de pedido" };
    },
  },

  PICKUP_COMPLETED: {
    id: "pickup_completed",
    event: "PICKUP_COMPLETED",
    name: "Pedido Recogido Exitosamente",
    category: "ORDER",
    defaultSubject: "Pedido recogido exitosamente — ¡Gracias por tu visita!",
    allowedVariables: ["nombre", "numero_pedido"],
    description: "Cierre del ciclo de recogida en punto físico.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const html = renderEmailLayout({
        title: "Pedido recogido",
        category: "ORDER",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #00A86B; margin: 0 0 10px 0;">
            ¡Gracias por tu visita a Farmaboy! 🌿
          </h2>
          <p style="color: #475569;">
            Hola ${nombre}, confirmamos que has recibido exitosamente tu pedido #${data.numero_pedido || ""} en nuestro punto farmacéutico.
          </p>
        `,
      });
      return { subject: "Pedido recogido exitosamente — ¡Gracias por tu visita!", html, text: "Pedido recogido exitosamente" };
    },
  },

  // ==========================================
  // 4. PRESCRIPTIONS & HEALTH
  // ==========================================
  PRESCRIPTION_RECEIVED: {
    id: "prescription_received",
    event: "PRESCRIPTION_RECEIVED",
    name: "Fórmula Médica Recibida",
    category: "ORDER",
    defaultSubject: "Hemos recibido tu fórmula médica — Farmaboy",
    allowedVariables: ["nombre", "solicitud_id", "fecha", "enlace_formulas"],
    description: "Notifica al paciente que su fórmula fue subida y entra a validación.",
    render: (data) => {
      const nombre = data.nombre || "Paciente";
      const siteUrl = data.siteUrl || "https://farmaboy.com";

      const html = renderEmailLayout({
        title: "Fórmula médica recibida",
        category: "ORDER",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            Tu fórmula médica ha sido recibida 📋
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, hemos recibido tu solicitud de validación de prescripción médica (ID: <strong>${data.solicitud_id || "SOL-001"}</strong>).
          </p>
          ${renderCard({
            title: "Regulación farmacéutica y seguridad",
            content: `
              <p style="margin: 0;">De acuerdo con la normatividad sanitaria colombiana (INVIMA), nuestro químico o regente farmacéutico en Boyacá verificará la vigencia, dosificación y registro del profesional de la salud antes de autorizar el despacho.</p>
            `,
          })}
          <div style="text-align: center;">
            ${renderButton({ text: "CONSULTAR MIS FÓRMULAS", url: `${siteUrl}/mi-cuenta/formulas`, color: "green" })}
          </div>
        `,
      });
      return { subject: "Hemos recibido tu fórmula médica — Farmaboy", html, text: "Hemos recibido tu fórmula médica para validación farmacéutica." };
    },
  },

  PRESCRIPTION_UNDER_REVIEW: {
    id: "prescription_under_review",
    event: "PRESCRIPTION_UNDER_REVIEW",
    name: "Fórmula en Revisión Farmacéutica",
    category: "ORDER",
    defaultSubject: "Tu solicitud está en revisión — Farmaboy",
    allowedVariables: ["nombre", "solicitud_id", "fecha"],
    description: "Información de que el regente está validando los medicamentos.",
    render: (data) => {
      const nombre = data.nombre || "Paciente";
      const html = renderEmailLayout({
        title: "Fórmula en revisión",
        category: "ORDER",
        content: `<p style="color: #475569;">Hola ${nombre}, tu solicitud #${data.solicitud_id || ""} está siendo revisada por el personal farmacéutico.</p>`,
      });
      return { subject: "Tu solicitud está en revisión — Farmaboy", html, text: "Fórmula médica en revisión" };
    },
  },

  PRESCRIPTION_APPROVED: {
    id: "prescription_approved",
    event: "PRESCRIPTION_APPROVED",
    name: "Fórmula Médica Aprobada",
    category: "ORDER",
    defaultSubject: "Fórmula médica validada y aprobada — Farmaboy",
    allowedVariables: ["nombre", "solicitud_id", "enlace_compra"],
    description: "Aviso de que los medicamentos bajo receta pueden despacharse.",
    render: (data) => {
      const nombre = data.nombre || "Paciente";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlaceCompra = data.enlace_compra || `${siteUrl}/carrito`;

      const html = renderEmailLayout({
        title: "Fórmula médica aprobada",
        category: "ORDER",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #00A86B; margin: 0 0 10px 0;">
            ¡Tu fórmula médica ha sido aprobada! ✅
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, la fórmula médica con solicitud ID <strong>#${data.solicitud_id || ""}</strong> cumple con todos los requisitos de ley y ha sido habilitada para despacho.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "PROCEDER CON MI COMPRA / DESPACHO", url: enlaceCompra, color: "green" })}
          </div>
        `,
      });
      return { subject: "Fórmula médica validada y aprobada — Farmaboy", html, text: "Tu fórmula médica fue aprobada exitosamente." };
    },
  },

  PRESCRIPTION_REJECTED: {
    id: "prescription_rejected",
    event: "PRESCRIPTION_REJECTED",
    name: "Novedad con Fórmula Médica",
    category: "ORDER",
    defaultSubject: "Novedad con tu fórmula médica — Farmaboy",
    allowedVariables: ["nombre", "solicitud_id", "motivo", "enlace_soporte"],
    description: "Aviso cuando la fórmula no es legible, está vencida o requiere ajuste.",
    render: (data) => {
      const nombre = data.nombre || "Paciente";
      const siteUrl = data.siteUrl || "https://farmaboy.com";

      const html = renderEmailLayout({
        title: "Novedad con fórmula",
        category: "ORDER",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #DC2626; margin: 0 0 10px 0;">
            Se requiere actualizar tu fórmula médica
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, al revisar tu solicitud <strong>#${data.solicitud_id || ""}</strong> encontramos una novedad:
          </p>
          ${renderCard({
            title: "Observación farmacéutica",
            content: `<p style="margin: 0;">${data.motivo || "El documento adjunto no es legible o requiere sello/registro médico vigente."}</p>`,
          })}
          <div style="text-align: center;">
            ${renderButton({ text: "SUBIR NUEVA FÓRMULA", url: `${siteUrl}/mi-cuenta/formulas`, color: "green" })}
          </div>
        `,
      });
      return { subject: "Novedad con tu fórmula médica — Farmaboy", html, text: "Se requiere actualizar tu fórmula médica." };
    },
  },

  // ==========================================
  // 5. COMMERCIAL & MARKETING
  // ==========================================
  COUPON_RECEIVED: {
    id: "coupon_received",
    event: "COUPON_RECEIVED",
    name: "Cupón de Descuento Recibido",
    category: "COMMERCIAL",
    defaultSubject: "¡Tienes un cupón de descuento en Farmaboy! 🎁",
    allowedVariables: ["nombre", "codigo", "descuento", "fecha_vencimiento", "enlace_catalogo"],
    description: "Notificación de asignación de cupón promocional.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const codigo = data.codigo || "BIENVENIDA";
      const siteUrl = data.siteUrl || "https://farmaboy.com";

      const html = renderEmailLayout({
        title: "¡Cupón de descuento para ti!",
        category: "COMMERCIAL",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            ¡Disfruta de un descuento especial! 🎁
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, queremos premiar tu confianza con un cupón exclusivo para tu próxima compra en Farmaboy:
          </p>
          <div style="background: linear-gradient(135deg, #00A86B 0%, #008755 100%); border-radius: 16px; padding: 24px; text-align: center; color: #FFFFFF; margin: 20px 0;">
            <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #A7F3D0;">CÓDIGO DE CUPÓN:</span>
            <div style="font-size: 32px; font-weight: 900; letter-spacing: 4px; margin: 8px 0; color: #FFFFFF; background: rgba(0,0,0,0.15); display: inline-block; padding: 6px 16px; border-radius: 8px;">
              ${codigo}
            </div>
            <p style="margin: 8px 0 0 0; font-size: 14px; font-weight: 600;">
              ${data.descuento || "Descuento especial"} ${data.fecha_vencimiento ? `• Válido hasta: ${data.fecha_vencimiento}` : ""}
            </p>
          </div>
          <div style="text-align: center;">
            ${renderButton({ text: "USAR CUPÓN AHORA", url: `${siteUrl}/catalogo?coupon=${codigo}`, color: "green" })}
          </div>
        `,
      });
      return { subject: "¡Tienes un cupón de descuento en Farmaboy! 🎁", html, text: `Usa el cupón ${codigo} en tu próxima compra en Farmaboy.` };
    },
  },

  COUPON_EXPIRING: {
    id: "coupon_expiring",
    event: "COUPON_EXPIRING",
    name: "Cupón Próximo a Vencer",
    category: "COMMERCIAL",
    defaultSubject: "Tu cupón de Farmaboy está próximo a vencer ⏳",
    allowedVariables: ["nombre", "codigo", "descuento", "fecha_vencimiento"],
    description: "Aviso de urgencia comercial antes de expirar un cupón.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const html = renderEmailLayout({
        title: "Cupón por vencer",
        category: "COMMERCIAL",
        content: `<p style="color: #475569;">Hola ${nombre}, tu cupón <strong>${data.codigo || ""}</strong> vence el <strong>${data.fecha_vencimiento || "pronto"}</strong>. ¡Aprovéchalo antes de que expire!</p>`,
      });
      return { subject: "Tu cupón de Farmaboy está próximo a vencer ⏳", html, text: "Tu cupón está próximo a vencer." };
    },
  },

  COUPON_USED: {
    id: "coupon_used",
    event: "COUPON_USED",
    name: "Cupón Utilizado",
    category: "ORDER",
    defaultSubject: "Cupón aplicado exitosamente en tu compra — Farmaboy",
    allowedVariables: ["nombre", "codigo", "descuento_ahorrado"],
    description: "Confirmación de redención de cupón en checkout.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const html = renderEmailLayout({
        title: "Cupón utilizado",
        category: "ORDER",
        content: `<p style="color: #475569;">Hola ${nombre}, aplicaste exitosamente el cupón <strong>${data.codigo || ""}</strong>.</p>`,
      });
      return { subject: "Cupón aplicado exitosamente en tu compra — Farmaboy", html, text: "Cupón aplicado con éxito" };
    },
  },

  PRODUCT_BACK_IN_STOCK: {
    id: "product_back_in_stock",
    event: "PRODUCT_BACK_IN_STOCK",
    name: "Producto Nuevamente Disponible",
    category: "COMMERCIAL",
    defaultSubject: "¡Ya está disponible nuevamente! — Farmaboy",
    allowedVariables: ["nombre", "producto", "precio", "enlace_producto"],
    description: "Notificación voluntaria a clientes en lista de espera cuando ingresa stock.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlace = data.enlace_producto || `${siteUrl}/catalogo`;

      const html = renderEmailLayout({
        title: "Producto disponible",
        category: "COMMERCIAL",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            ¡El producto que esperabas volvió a estar disponible! 🎉
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, te avisamos que <strong>${data.producto || "tu producto seleccionado"}</strong> ya cuenta con inventario en Farmaboy.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "VER PRODUCTO Y COMPRAR", url: enlace, color: "green" })}
          </div>
        `,
      });
      return { subject: "¡Ya está disponible nuevamente! — Farmaboy", html, text: "Producto nuevamente disponible en Farmaboy." };
    },
  },

  PRICE_DROP: {
    id: "price_drop",
    event: "PRICE_DROP",
    name: "Reducción de Precio",
    category: "COMMERCIAL",
    defaultSubject: "¡Bajó de precio un producto de tu interés! 📉",
    allowedVariables: ["nombre", "producto", "precio_anterior", "precio_nuevo", "enlace_producto"],
    description: "Notificación ante bajadas de precio de artículos favoritos.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const html = renderEmailLayout({
        title: "¡Bajó de precio!",
        category: "COMMERCIAL",
        content: `<p style="color: #475569;">Hola ${nombre}, el producto <strong>${data.producto || ""}</strong> ahora cuesta $${Number(data.precio_nuevo || 0).toLocaleString("es-CO")} COP.</p>`,
      });
      return { subject: "¡Bajó de precio un producto de tu interés! 📉", html, text: "Bajó de precio un producto de tu interés." };
    },
  },

  PROMOTION_CREATED: {
    id: "promotion_created",
    event: "PROMOTION_CREATED",
    name: "Promoción Especial Creada",
    category: "COMMERCIAL",
    defaultSubject: "Nueva promoción especial en Farmaboy 🔥",
    allowedVariables: ["nombre", "titulo_promo", "descripcion", "enlace_promo"],
    description: "Email de campaña sobre jornadas de salud o descuentos especiales.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const html = renderEmailLayout({
        title: "Promoción especial",
        category: "COMMERCIAL",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            ${data.titulo_promo || "¡Promoción especial en Farmaboy!"} 🔥
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola ${nombre}, ${data.descripcion || "Aprovecha descuentos exclusivos en medicamentos y bienestar."}
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "CONOCE LAS OFERTAS", url: data.enlace_promo || `${siteUrl}/promociones`, color: "green" })}
          </div>
        `,
      });
      return { subject: "Nueva promoción especial en Farmaboy 🔥", html, text: "Nueva promoción especial en Farmaboy." };
    },
  },

  NEWSLETTER_SENT: {
    id: "newsletter_sent",
    event: "NEWSLETTER_SENT",
    name: "Boletín de Noticias (Newsletter)",
    category: "COMMERCIAL",
    defaultSubject: "Novedades de salud, bienestar y ofertas de Farmaboy",
    allowedVariables: ["nombre", "asunto_boletin", "contenido_boletin"],
    description: "Boletín de novedades periódicas de salud.",
    render: (data) => {
      const nombre = data.nombre || "Suscriptor(a)";
      const html = renderEmailLayout({
        title: "Boletín de Salud Farmaboy",
        category: "COMMERCIAL",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            Novedades de Salud & Bienestar Farmaboy 🌿
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola ${nombre}, te compartimos las últimas recomendaciones farmacéuticas y novedades de nuestra droguería en Boyacá:
          </p>
          <div style="color: #334155; line-height: 1.6;">
            ${data.contenido_boletin || "Consejos sobre prevención de salud, vacunación y cuidado en casa."}
          </div>
        `,
      });
      return { subject: "Novedades de salud, bienestar y ofertas de Farmaboy", html, text: "Boletín de salud Farmaboy" };
    },
  },

  UNSUBSCRIBE_CONFIRMED: {
    id: "unsubscribe_confirmed",
    event: "UNSUBSCRIBE_CONFIRMED",
    name: "Confirmación de Desuscripción",
    category: "ACCOUNT",
    defaultSubject: "Has cancelado las comunicaciones promocionales — Farmaboy",
    allowedVariables: ["nombre", "correo", "enlace_preferencias"],
    description: "Confirmación tras hacer clic en Cancelar Suscripción comercial.",
    render: (data) => {
      const nombre = data.nombre || "Usuario";
      const siteUrl = data.siteUrl || "https://farmaboy.com";

      const html = renderEmailLayout({
        title: "Cancelación de suscripción confirmada",
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">
            Has cancelado las comunicaciones promocionales
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola ${nombre}, confirmamos que tu correo no recibirá más boletines ni correos publicitarios de Farmaboy.
          </p>
          <p style="font-size: 12px; color: #64748B;">
            Continuarás recibiendo únicamente las comunicaciones transaccionales esenciales (confirmación de tus pedidos, avisos de entrega y alertas de seguridad de tu cuenta). Si deseas cambiar tus preferencias en cualquier momento, puedes ingresar a tu perfil:
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "ADMINISTRAR MIS PREFERENCIAS", url: `${siteUrl}/mi-cuenta/notificaciones`, color: "dark" })}
          </div>
        `,
      });
      return { subject: "Has cancelado las comunicaciones promocionales — Farmaboy", html, text: "Confirmación de desuscripción de correos comerciales." };
    },
  },

  // ==========================================
  // 6. SUPPORT & CONTACT
  // ==========================================
  SUPPORT_TICKET_CREATED: {
    id: "support_ticket_created",
    event: "SUPPORT_TICKET_CREATED",
    name: "Ticket de Soporte Creado",
    category: "ACCOUNT",
    defaultSubject: "Hemos recibido tu solicitud #{{ticket}} — Farmaboy",
    allowedVariables: ["nombre", "ticket", "asunto", "mensaje", "enlace_ticket"],
    description: "Confirmación inmediata al usuario con el radicado de su PQR o consulta.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const ticket = data.ticket || "TICK-001";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlace = data.enlace_ticket || `${siteUrl}/mi-cuenta/soporte`;

      const html = renderEmailLayout({
        title: `Solicitud #${ticket} recibida`,
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            Hemos recibido tu solicitud de soporte #${ticket}
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, tu requerimiento fue radicado en nuestro Centro de Atención al Cliente de Farmaboy.
          </p>
          ${renderCard({
            title: `Ticket #${ticket}`,
            content: `
              <p style="margin: 0 0 4px 0;"><strong>Tema / Asunto:</strong> ${data.asunto || "Consulta de cliente"}</p>
              ${data.mensaje ? `<p style="margin: 0; color: #64748B;"><em>"${data.mensaje}"</em></p>` : ""}
            `,
          })}
          <p style="font-size: 13px; color: #64748B;">
            Un asesor farmacéutico en Boyacá responderá a tu solicitud en un tiempo máximo de 2 a 4 horas hábiles.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "VER ESTADO DE MI SOLICITUD", url: enlace, color: "green" })}
          </div>
        `,
      });
      return { subject: `Hemos recibido tu solicitud #${ticket} — Farmaboy`, html, text: `Hemos recibido tu solicitud #${ticket} en Farmaboy.` };
    },
  },

  SUPPORT_TICKET_REPLIED: {
    id: "support_ticket_replied",
    event: "SUPPORT_TICKET_REPLIED",
    name: "Respuesta a Ticket de Soporte",
    category: "ACCOUNT",
    defaultSubject: "Nueva respuesta a tu solicitud #{{ticket}} — Farmaboy",
    allowedVariables: ["nombre", "ticket", "respuesta", "agente", "enlace_ticket"],
    description: "Notifica al usuario cuando un operador responde a su caso.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const ticket = data.ticket || "TICK-001";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const enlace = data.enlace_ticket || `${siteUrl}/mi-cuenta/soporte`;

      const html = renderEmailLayout({
        title: `Respuesta a solicitud #${ticket}`,
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 20px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            Nueva respuesta a tu solicitud #${ticket} 💬
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, el equipo de soporte de Farmaboy (${data.agente || "Asesor Farmacéutico"}) ha respondido a tu consulta:
          </p>
          ${renderCard({
            title: "Respuesta del equipo Farmaboy",
            content: `<p style="margin: 0; font-size: 13px; color: #1E293B;">${data.respuesta || "Hemos verificado tu requerimiento y nos encontramos gestionando la solución."}</p>`,
          })}
          <div style="text-align: center;">
            ${renderButton({ text: "VER SOLICITUD Y RESPONDER", url: enlace, color: "green" })}
          </div>
        `,
      });
      return { subject: `Nueva respuesta a tu solicitud #${ticket} — Farmaboy`, html, text: `Nueva respuesta a tu solicitud #${ticket}.` };
    },
  },

  SUPPORT_TICKET_CLOSED: {
    id: "support_ticket_closed",
    event: "SUPPORT_TICKET_CLOSED",
    name: "Ticket de Soporte Cerrado",
    category: "ACCOUNT",
    defaultSubject: "Tu solicitud #{{ticket}} fue cerrada — Farmaboy",
    allowedVariables: ["nombre", "ticket", "enlace_ticket"],
    description: "Confirmación de resolución y cierre de caso de soporte.",
    render: (data) => {
      const nombre = data.nombre || "Cliente";
      const ticket = data.ticket || "TICK-001";
      const siteUrl = data.siteUrl || "https://farmaboy.com";

      const html = renderEmailLayout({
        title: `Solicitud #${ticket} cerrada`,
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">
            Tu solicitud #${ticket} ha sido cerrada
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, tu caso de soporte #${ticket} ha sido marcado como solucionado. Si consideras que aún necesitas asistencia, puedes reabrir el caso o iniciar un nuevo chat.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "VER RESUMEN DE LA SOLICITUD", url: `${siteUrl}/mi-cuenta/soporte`, color: "dark" })}
          </div>
        `,
      });
      return { subject: `Tu solicitud #${ticket} fue cerrada — Farmaboy`, html, text: `Tu solicitud #${ticket} fue cerrada.` };
    },
  },

  CONTACT_RECEIVED: {
    id: "contact_received",
    event: "CONTACT_RECEIVED",
    name: "Mensaje de Contacto Recibido",
    category: "ACCOUNT",
    defaultSubject: "Recibimos tu mensaje — Farmaboy",
    allowedVariables: ["nombre", "correo", "asunto"],
    description: "Acuse de recibo automático al visitante que envía el formulario web de contacto.",
    render: (data) => {
      const nombre = data.nombre || "Usuario";
      const html = renderEmailLayout({
        title: "Mensaje recibido",
        category: "ACCOUNT",
        content: `
          <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0;">
            ¡Gracias por escribirnos! ✉️
          </h2>
          <p style="color: #475569; margin: 0 0 14px 0;">
            Hola <strong>${nombre}</strong>, hemos recibido tu mensaje a través de nuestro portal web. Nuestro equipo de atención al cliente en Boyacá se comunicará contigo a la mayor brevedad.
          </p>
        `,
      });
      return { subject: "Recibimos tu mensaje — Farmaboy", html, text: "Hemos recibido tu mensaje de contacto en Farmaboy." };
    },
  },

  // ==========================================
  // 7. ADMIN NOTIFICATIONS
  // ==========================================
  ADMIN_NEW_USER: {
    id: "admin_new_user",
    event: "ADMIN_NEW_USER",
    name: "Alerta Admin: Nuevo Usuario",
    category: "ADMIN",
    defaultSubject: "👤 Nuevo usuario registrado en Farmaboy",
    allowedVariables: ["nombre", "correo", "telefono", "documento", "fecha"],
    description: "Notificación al administrador ante nuevos clientes.",
    render: (data) => {
      const html = renderEmailLayout({
        title: "Nuevo usuario registrado",
        category: "ADMIN",
        content: `
          <h2 style="font-size: 18px; font-weight: 900; color: #0F172A; margin: 0 0 12px 0;">
            👤 Nuevo usuario registrado en Farmaboy
          </h2>
          ${renderCard({
            title: "Ficha de usuario",
            content: `
              <p style="margin: 0 0 4px 0;"><strong>Nombre:</strong> ${data.nombre || "Cliente"}</p>
              <p style="margin: 0 0 4px 0;"><strong>Correo:</strong> ${data.correo || "N/A"}</p>
              <p style="margin: 0 0 4px 0;"><strong>Teléfono:</strong> ${data.telefono || "N/A"}</p>
              <p style="margin: 0 0 4px 0;"><strong>Documento:</strong> ${data.documento || "N/A"}</p>
              <p style="margin: 0;"><strong>Fecha:</strong> ${data.fecha || new Date().toLocaleString("es-CO")}</p>
            `,
          })}
        `,
      });
      return { subject: "👤 Nuevo usuario registrado en Farmaboy", html, text: `Nuevo usuario registrado: ${data.nombre} (${data.correo})` };
    },
  },

  ADMIN_NEW_ORDER: {
    id: "admin_new_order",
    event: "ADMIN_NEW_ORDER",
    name: "Alerta Admin: Nuevo Pedido de Venta",
    category: "ADMIN",
    defaultSubject: "🛒 Nuevo pedido #{{numero_pedido}} — Farmaboy Admin",
    allowedVariables: ["numero_pedido", "cliente", "correo", "telefono", "total", "metodo_pago", "entrega", "direccion", "enlace_admin"],
    description: "Alerta prioritaria a la administración ante cada nueva venta.",
    render: (data) => {
      const orderId = data.numero_pedido || "ORD-000";
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const total = data.total || 0;

      const html = renderEmailLayout({
        title: `Nuevo Pedido #${orderId}`,
        category: "ADMIN",
        content: `
          <div style="background-color: #0F172A; border-radius: 12px; padding: 14px 20px; color: #FFFFFF; margin-bottom: 16px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td><strong style="font-size: 16px;">🛒 NUEVA VENTA REGISTRADA</strong></td>
                <td align="right"><span style="font-size: 16px; font-weight: 800; color: #34D399;">$${Number(total).toLocaleString("es-CO")} COP</span></td>
              </tr>
            </table>
          </div>
          ${renderCard({
            title: `Pedido #${orderId}`,
            content: `
              <p style="margin: 0 0 4px 0;"><strong>Cliente:</strong> ${data.cliente || "Cliente"} (${data.correo || ""})</p>
              <p style="margin: 0 0 4px 0;"><strong>Teléfono:</strong> ${data.telefono || "N/A"}</p>
              <p style="margin: 0 0 4px 0;"><strong>Método de pago:</strong> ${data.metodo_pago || "En línea"}</p>
              <p style="margin: 0 0 4px 0;"><strong>Modalidad entrega:</strong> ${data.entrega || "Domicilio"}</p>
              <p style="margin: 0;"><strong>Dirección / Sede:</strong> ${data.direccion || "Boyacá"}</p>
            `,
          })}
          <div style="text-align: center;">
            ${renderButton({ text: "GESTIONAR PEDIDO EN PANEL ADMIN", url: `${siteUrl}/admin/pedidos`, color: "green" })}
          </div>
        `,
      });
      return { subject: `🛒 Nuevo pedido #${orderId} — Farmaboy Admin`, html, text: `Nuevo pedido #${orderId} por $${Number(total).toLocaleString("es-CO")} COP.` };
    },
  },

  ADMIN_HIGH_VALUE_ORDER: {
    id: "admin_high_value_order",
    event: "ADMIN_HIGH_VALUE_ORDER",
    name: "Alerta Admin: Pedido de Alto Valor",
    category: "ADMIN",
    defaultSubject: "💎 Alerta: Pedido de alto valor #{{numero_pedido}}",
    allowedVariables: ["numero_pedido", "cliente", "total", "enlace_admin"],
    description: "Alerta cuando una orden supera los $500.000 COP.",
    render: (data) => {
      const orderId = data.numero_pedido || "ORD-000";
      const total = data.total || 0;
      const html = renderEmailLayout({
        title: "Pedido de Alto Valor",
        category: "ADMIN",
        content: `
          <h2 style="font-size: 18px; font-weight: 900; color: #B45309; margin: 0 0 10px 0;">
            💎 Alerta: Pedido de alto valor #${orderId}
          </h2>
          <p style="color: #475569;">
            Se ha recibido una orden por valor de <strong>$${Number(total).toLocaleString("es-CO")} COP</strong> a nombre de <strong>${data.cliente || "Cliente"}</strong>.
          </p>
        `,
      });
      return { subject: `💎 Alerta: Pedido de alto valor #${orderId}`, html, text: `Pedido de alto valor #${orderId}: $${Number(total).toLocaleString("es-CO")} COP.` };
    },
  },

  ADMIN_PAYMENT_APPROVED: {
    id: "admin_payment_approved",
    event: "ADMIN_PAYMENT_APPROVED",
    name: "Alerta Admin: Pago Aprobado",
    category: "ADMIN",
    defaultSubject: "💰 Pago verificado en Pedido #{{numero_pedido}}",
    allowedVariables: ["numero_pedido", "total", "metodo_pago"],
    description: "Notificación interna de recaudo verificado.",
    render: (data) => {
      const html = renderEmailLayout({
        title: "Pago verificado",
        category: "ADMIN",
        content: `<p style="color: #475569;">Pago confirmado para el pedido #${data.numero_pedido || ""}.</p>`,
      });
      return { subject: `💰 Pago verificado en Pedido #${data.numero_pedido || ""}`, html, text: "Pago verificado admin" };
    },
  },

  ADMIN_PAYMENT_REJECTED: {
    id: "admin_payment_rejected",
    event: "ADMIN_PAYMENT_REJECTED",
    name: "Alerta Admin: Pago Rechazado",
    category: "ADMIN",
    defaultSubject: "❌ Pago rechazado / no verificado en Pedido #{{numero_pedido}}",
    allowedVariables: ["numero_pedido", "cliente", "motivo"],
    description: "Notificación de intento de pago fallido.",
    render: (data) => {
      const html = renderEmailLayout({
        title: "Pago rechazado",
        category: "ADMIN",
        content: `<p style="color: #475569;">Pago no procesado en pedido #${data.numero_pedido || ""}.</p>`,
      });
      return { subject: `❌ Pago rechazado en Pedido #${data.numero_pedido || ""}`, html, text: "Pago rechazado admin" };
    },
  },

  ADMIN_ORDER_CANCELLED: {
    id: "admin_order_cancelled",
    event: "ADMIN_ORDER_CANCELLED",
    name: "Alerta Admin: Pedido Cancelado",
    category: "ADMIN",
    defaultSubject: "🚫 Pedido cancelado #{{numero_pedido}}",
    allowedVariables: ["numero_pedido", "motivo"],
    description: "Aviso de anulación de orden.",
    render: (data) => {
      const html = renderEmailLayout({
        title: "Pedido cancelado",
        category: "ADMIN",
        content: `<p style="color: #475569;">El pedido #${data.numero_pedido || ""} fue cancelado.</p>`,
      });
      return { subject: `🚫 Pedido cancelado #${data.numero_pedido || ""}`, html, text: "Pedido cancelado admin" };
    },
  },

  ADMIN_LOW_STOCK: {
    id: "admin_low_stock",
    event: "ADMIN_LOW_STOCK",
    name: "Alerta Admin: Inventario Bajo",
    category: "ADMIN",
    defaultSubject: "⚠️ Inventario bajo en catálogo — Farmaboy Admin",
    allowedVariables: ["producto", "sku", "stock_actual", "stock_minimo", "enlace_admin"],
    description: "Alerta inmediata cuando las existencias caen al umbral de seguridad.",
    render: (data) => {
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const html = renderEmailLayout({
        title: "Alerta de inventario bajo",
        category: "ADMIN",
        content: `
          <h2 style="font-size: 18px; font-weight: 900; color: #B45309; margin: 0 0 10px 0;">
            ⚠️ Alerta de Inventario Bajo
          </h2>
          ${renderCard({
            title: data.producto || "Producto",
            content: `
              <p style="margin: 0 0 4px 0;"><strong>SKU:</strong> ${data.sku || "N/A"}</p>
              <p style="margin: 0 0 4px 0;"><strong>Stock Actual:</strong> <span style="color: #B45309; font-weight: 800;">${data.stock_actual || 0} unidades</span></p>
              <p style="margin: 0;"><strong>Umbral Mínimo:</strong> ${data.stock_minimo || 0} unidades</p>
            `,
          })}
          <div style="text-align: center;">
            ${renderButton({ text: "ABRIR KARDEX / INVENTARIO", url: `${siteUrl}/admin/inventario`, color: "dark" })}
          </div>
        `,
      });
      return { subject: `⚠️ Inventario bajo en: ${data.producto || "producto"} — Farmaboy`, html, text: `Inventario bajo para ${data.producto}. Stock actual: ${data.stock_actual}.` };
    },
  },

  ADMIN_OUT_OF_STOCK: {
    id: "admin_out_of_stock",
    event: "ADMIN_OUT_OF_STOCK",
    name: "Alerta Admin: Producto Agotado (Stock 0)",
    category: "ADMIN",
    defaultSubject: "🚨 Producto agotado (Stock 0) — Farmaboy Admin",
    allowedVariables: ["producto", "sku", "enlace_admin"],
    description: "Alerta crítica cuando un producto queda sin existencias.",
    render: (data) => {
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const html = renderEmailLayout({
        title: "Producto agotado",
        category: "ADMIN",
        content: `
          <h2 style="font-size: 18px; font-weight: 900; color: #DC2626; margin: 0 0 10px 0;">
            🚨 Producto agotado en catálogo
          </h2>
          <p style="color: #475569;">
            El producto <strong>${data.producto || ""}</strong> (SKU: ${data.sku || ""}) ha alcanzado un stock de 0 unidades y dejará de venderse si no se restockea.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "REGISTRAR ENTRADA EN KARDEX", url: `${siteUrl}/admin/inventario`, color: "green" })}
          </div>
        `,
      });
      return { subject: `🚨 Producto agotado: ${data.producto || ""} — Farmaboy`, html, text: `Producto agotado: ${data.producto}.` };
    },
  },

  ADMIN_SUPPORT_TICKET: {
    id: "admin_support_ticket",
    event: "ADMIN_SUPPORT_TICKET",
    name: "Alerta Admin: Nuevo Ticket de Soporte",
    category: "ADMIN",
    defaultSubject: "🎫 Nueva solicitud de soporte #{{ticket}}",
    allowedVariables: ["ticket", "cliente", "correo", "asunto", "mensaje", "enlace_admin"],
    description: "Notifica al personal de servicio al cliente sobre una nueva solicitud de soporte.",
    render: (data) => {
      const ticket = data.ticket || "TICK-001";
      const siteUrl = data.siteUrl || "https://farmaboy.com";

      const html = renderEmailLayout({
        title: `Nuevo ticket #${ticket}`,
        category: "ADMIN",
        content: `
          <h2 style="font-size: 18px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            🎫 Nueva solicitud de soporte radicado #${ticket}
          </h2>
          ${renderCard({
            title: "Datos de la consulta",
            content: `
              <p style="margin: 0 0 4px 0;"><strong>Usuario:</strong> ${data.cliente || "Cliente"} (${data.correo || ""})</p>
              <p style="margin: 0 0 4px 0;"><strong>Asunto:</strong> ${data.asunto || "Consulta"}</p>
              <p style="margin: 0;"><strong>Mensaje:</strong> ${data.mensaje || ""}</p>
            `,
          })}
          <div style="text-align: center;">
            ${renderButton({ text: "RESPONDER TICKET EN ADMIN", url: `${siteUrl}/admin/soporte`, color: "green" })}
          </div>
        `,
      });
      return { subject: `🎫 Nueva solicitud de soporte #${ticket}`, html, text: `Nuevo ticket #${ticket} de ${data.cliente}.` };
    },
  },

  ADMIN_PRESCRIPTION_RECEIVED: {
    id: "admin_prescription_received",
    event: "ADMIN_PRESCRIPTION_RECEIVED",
    name: "Alerta Admin: Nueva Fórmula Médica Cargada",
    category: "ADMIN",
    defaultSubject: "📋 Nueva fórmula médica cargada para validación",
    allowedVariables: ["solicitud_id", "paciente", "medico", "enlace_admin"],
    description: "Alerta al regente farmacéutico para revisar un archivo de prescripción médica.",
    render: (data) => {
      const siteUrl = data.siteUrl || "https://farmaboy.com";
      const html = renderEmailLayout({
        title: "Fórmula médica para revisión",
        category: "ADMIN",
        content: `
          <h2 style="font-size: 18px; font-weight: 900; color: #0F172A; margin: 0 0 10px 0;">
            📋 Nueva fórmula médica para validación profesional
          </h2>
          <p style="color: #475569;">
            El paciente <strong>${data.paciente || "Paciente"}</strong> ha subido una fórmula médica (Solicitud ID: <strong>#${data.solicitud_id || ""}</strong>). Por favor valida la vigencia sanitaria y sello médico.
          </p>
          <div style="text-align: center;">
            ${renderButton({ text: "REVISAR FÓRMULA EN ADMIN", url: `${siteUrl}/admin`, color: "green" })}
          </div>
        `,
      });
      return { subject: `📋 Nueva fórmula médica cargada (#${data.solicitud_id || ""})`, html, text: `Nueva fórmula médica cargada por ${data.paciente}.` };
    },
  },

  ADMIN_CRITICAL_ERROR: {
    id: "admin_critical_error",
    event: "ADMIN_CRITICAL_ERROR",
    name: "Alerta Admin: Error Crítico del Sistema",
    category: "ADMIN",
    defaultSubject: "🚨 Error crítico en el sistema — Farmaboy Admin",
    allowedVariables: ["modulo", "error", "fecha"],
    description: "Alerta técnica urgente enviada ante fallos en pasarelas, base de datos o cola de correos.",
    render: (data) => {
      const html = renderEmailLayout({
        title: "Error Crítico del Sistema",
        category: "ADMIN",
        content: `
          <h2 style="font-size: 18px; font-weight: 900; color: #991B1B; margin: 0 0 10px 0;">
            🚨 Alerta de Error Crítico en Farmaboy
          </h2>
          ${renderCard({
            title: `Módulo afectado: ${data.modulo || "Sistema General"}`,
            content: `
              <p style="margin: 0 0 4px 0;"><strong>Error:</strong> <code style="color: #991B1B;">${data.error || "Falla no especificada"}</code></p>
              <p style="margin: 0;"><strong>Fecha:</strong> ${data.fecha || new Date().toLocaleString("es-CO")}</p>
            `,
          })}
        `,
      });
      return { subject: "🚨 Error crítico en el sistema — Farmaboy Admin", html, text: `Error crítico en ${data.modulo}: ${data.error}` };
    },
  },

  TEST_EMAIL: {
    id: "test_email",
    event: "TEST_EMAIL",
    name: "Correo de Diagnóstico SMTP",
    category: "ADMIN",
    defaultSubject: "Diagnóstico SMTP: Correo de prueba Farmaboy",
    allowedVariables: ["destinatario", "servidor", "puerto", "fecha"],
    description: "Plantilla para la herramienta interactiva de verificación en /admin/emails/test.",
    render: (data) => {
      const html = renderEmailLayout({
        title: "Diagnóstico SMTP Exitoso",
        category: "ADMIN",
        content: `
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 54px; height: 54px; border-radius: 50%; background-color: #ECFDF5; line-height: 54px; font-size: 28px; color: #00A86B;">
              ⚡
            </div>
            <h2 style="font-size: 22px; font-weight: 900; color: #0F172A; margin: 12px 0 4px 0;">
              ¡Conexión SMTP Farmaboy Exitosa!
            </h2>
            <p style="color: #64748B; font-size: 13px; margin: 0;">
              Prueba de diagnóstico de servidor de correo transaccional
            </p>
          </div>
          ${renderCard({
            title: "Detalles de la conexión",
            content: `
              <p style="margin: 0 0 4px 0;"><strong>Servidor:</strong> ${data.servidor || "smtp.buzondecorreo.com"}</p>
              <p style="margin: 0 0 4px 0;"><strong>Puerto:</strong> ${data.puerto || 465} (SSL/TLS nativo)</p>
              <p style="margin: 0 0 4px 0;"><strong>Destinatario verificado:</strong> ${data.destinatario || ""}</p>
              <p style="margin: 0;"><strong>Fecha y hora del test:</strong> ${data.fecha || new Date().toLocaleString("es-CO")}</p>
            `,
          })}
          <p style="font-size: 12px; color: #059669; text-align: center; font-weight: 700;">
            ✓ Este mensaje confirma que el sitio farmaboy.com puede comunicarse correctamente con el buzón corporativo info@farmaboy.com.
          </p>
        `,
      });
      return {
        subject: "Diagnóstico SMTP: Correo de prueba Farmaboy",
        html,
        text: `Diagnóstico SMTP exitoso desde Farmaboy (${data.servidor}:${data.puerto}) hacia ${data.destinatario}.`,
      };
    },
  },
};
