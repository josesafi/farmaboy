export interface BaseLayoutOptions {
  title?: string;
  preheader?: string;
  content: string;
  category?: "ACCOUNT" | "ORDER" | "COMMERCIAL" | "ADMIN";
  unsubscribeUrl?: string;
  siteUrl?: string;
}

export function renderEmailLayout(options: BaseLayoutOptions): string {
  const siteUrl = options.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://farmaboy.com";
  const preheader = options.preheader || options.title || "Notificación oficial de Farmaboy";
  const unsubscribeUrl = options.unsubscribeUrl || `${siteUrl}/cancelar-suscripcion`;
  const isCommercial = options.category === "COMMERCIAL";

  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${options.title || "Farmaboy"}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    @media screen and (max-width: 600px) {
      .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-center { text-align: center !important; }
      .mobile-hide { display: none !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; color: #1E293B;">
  <!-- Preheader preview text -->
  <div style="display: none; font-size: 1px; color: #F1F5F9; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F1F5F9;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <!-- Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
          
          <!-- Top Accent Bar -->
          <tr>
            <td height="6" style="background: linear-gradient(90deg, #00A86B 0%, #008755 50%, #0F172A 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; background-color: #FFFFFF; border-bottom: 1px solid #F1F5F9;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td valign="middle">
                    <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="${siteUrl}/images/logo-farmaboy.png" alt="FARMABOY" height="40" style="height: 40px; max-width: 100%; border: 0; outline: none; text-decoration: none; display: block;" />
                    </a>
                  </td>
                  <td align="right" valign="middle" class="mobile-hide">
                    <span style="display: inline-block; padding: 4px 10px; border-radius: 12px; background-color: #ECFDF5; border: 1px solid #A7F3D0; font-size: 11px; font-weight: 700; color: #065F46;">
                      Boyacá, Colombia
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 28px 32px; font-size: 14px; line-height: 1.6; color: #334155;" class="mobile-padding">
              ${options.content}
            </td>
          </tr>

          <!-- Pharmacy Help / Contact Box -->
          <tr>
            <td style="padding: 0 32px 28px 32px;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px;">
                <tr>
                  <td>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td valign="middle" width="36" style="padding-right: 12px;">
                          <div style="background-color: #E2E8F0; border-radius: 50%; width: 34px; height: 34px; text-align: center; line-height: 34px; font-size: 16px;">
                            💬
                          </div>
                        </td>
                        <td valign="middle">
                          <p style="margin: 0; font-size: 12px; font-weight: 700; color: #0F172A;">
                            ¿Necesitas asistencia farmacéutica o ayuda con tu pedido?
                          </p>
                          <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748B;">
                            Línea directa & WhatsApp: <strong style="color: #00A86B;">+57 321 265 1303</strong> | Correo: <a href="mailto:info@farmaboy.com" style="color: #00A86B; text-decoration: none;">info@farmaboy.com</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0F172A; padding: 32px; border-radius: 0 0 20px 20px; color: #94A3B8; font-size: 11px; line-height: 1.6;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <p style="margin: 0; font-size: 13px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.5px;">
                      FARMABOY INTEGRALES DE SERVICIOS EN SALUD S.A.S.
                    </p>
                    <p style="margin: 4px 0 0 0; color: #94A3B8; font-size: 11px;">
                      Droguería y Servicios de Salud | NIT: 901.865.432-1
                    </p>
                    <p style="margin: 2px 0 0 0; color: #64748B; font-size: 10px;">
                      Duitama, Sogamoso y Tunja — Boyacá, Colombia
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 16px; border-top: 1px solid #1E293B; padding-top: 16px;">
                    <a href="${siteUrl}/mi-cuenta" target="_blank" style="color: #38BDF8; text-decoration: none; margin: 0 8px; font-weight: 600;">Mi Cuenta</a>
                    <span style="color: #475569;">•</span>
                    <a href="${siteUrl}/terminos" target="_blank" style="color: #94A3B8; text-decoration: none; margin: 0 8px;">Términos</a>
                    <span style="color: #475569;">•</span>
                    <a href="${siteUrl}/privacidad" target="_blank" style="color: #94A3B8; text-decoration: none; margin: 0 8px;">Privacidad</a>
                    <span style="color: #475569;">•</span>
                    <a href="${siteUrl}/contacto" target="_blank" style="color: #94A3B8; text-decoration: none; margin: 0 8px;">Contacto</a>
                  </td>
                </tr>
                ${isCommercial ? `
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <p style="margin: 0; color: #64748B; font-size: 10px;">
                      Recibes este correo porque te registraste en Farmaboy o te suscribiste a nuestras novedades de salud.
                      Si deseas dejar de recibir correos comerciales, puedes <a href="${unsubscribeUrl}" target="_blank" style="color: #F87171; text-decoration: underline;">cancelar tu suscripción aquí</a>.
                    </p>
                  </td>
                </tr>
                ` : `
                <tr>
                  <td align="center" style="padding-bottom: 8px;">
                    <p style="margin: 0; color: #475569; font-size: 10px;">
                      Este es un correo transaccional y de seguridad necesario para la prestación del servicio de Farmaboy. No contiene publicidad no solicitada.
                    </p>
                  </td>
                </tr>
                `}
                <tr>
                  <td align="center" style="color: #475569; font-size: 9px; line-height: 1.4;">
                    Vigilado por la Secretaría de Salud de Boyacá e INVIMA. Todos los derechos reservados © ${new Date().getFullYear()} Farmaboy.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
