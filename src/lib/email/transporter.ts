import nodemailer, { Transporter } from "nodemailer";
import { SmtpConfig } from "./types";

export function getSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST || "smtp.buzondecorreo.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "false" ? false : port === 465;
  const user = process.env.SMTP_USER || "info@farmaboy.com";
  const pass = process.env.SMTP_PASSWORD || "";
  const from = process.env.EMAIL_FROM || "info@farmaboy.com";
  const fromName = process.env.EMAIL_FROM_NAME || "Farmaboy";
  const adminEmail = process.env.ADMIN_EMAIL || "info@farmaboy.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://farmaboy.com";

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
    fromName,
    adminEmail,
    siteUrl,
  };
}

let cachedTransporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const config = getSmtpConfig();

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      // Do not fail on invalid certs if server name matches or self-signed in intermediate
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  return cachedTransporter;
}

export async function verifySmtpConnection(): Promise<{
  success: boolean;
  message: string;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  error?: string;
}> {
  const config = getSmtpConfig();
  if (!config.pass) {
    return {
      success: false,
      message: "Contraseña SMTP no configurada en variables de entorno (SMTP_PASSWORD vacía)",
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.user,
      error: "MISSING_SMTP_PASSWORD",
    };
  }

  try {
    const transporter = getTransporter();
    await transporter.verify();
    return {
      success: true,
      message: `Conexión SMTP exitosa con ${config.host}:${config.port} (SSL/TLS autenticado como ${config.user})`,
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.user,
    };
  } catch (err: any) {
    console.error("[SMTP Verify Error]:", err);
    return {
      success: false,
      message: `Error al conectar con servidor SMTP (${config.host}:${config.port}): ${err.message || String(err)}`,
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.user,
      error: err.code || err.message,
    };
  }
}

export async function sendRawMail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getSmtpConfig();
  const transporter = getTransporter();

  const mailOptions = {
    from: `"${config.fromName}" <${config.from}>`,
    to: params.to,
    replyTo: params.replyTo || config.from,
    subject: params.subject,
    html: params.html,
    text: params.text || params.subject,
    headers: {
      "X-Mailer": "Farmaboy Transactional Mailer v2.0",
      ...params.headers,
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error(`[SMTP Send Error to ${params.to}]:`, err);
    return {
      success: false,
      error: err.message || String(err),
    };
  }
}
