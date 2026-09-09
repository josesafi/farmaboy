import { NextRequest, NextResponse } from "next/server";
import { verifySmtpConnection, sendRawMail, getSmtpConfig } from "@/lib/email/transporter";
import { emailTemplates } from "@/lib/email/templates/registry";
import { EmailEventType } from "@/lib/email/types";

export async function GET() {
  try {
    const check = await verifySmtpConnection();
    return NextResponse.json(check, { status: check.success ? 200 : 500 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Error al probar conexión SMTP: ${err.message || String(err)}`,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipient, templateId, customSubject } = body;

    const config = getSmtpConfig();
    const targetRecipient = recipient || config.adminEmail;

    if (!targetRecipient) {
      return NextResponse.json(
        { success: false, error: "Destinatario de prueba no especificado" },
        { status: 400 }
      );
    }

    const eventToUse: EmailEventType = (templateId as EmailEventType) || "TEST_EMAIL";
    const template = emailTemplates[eventToUse] || emailTemplates.TEST_EMAIL;

    const rendered = template.render({
      nombre: "Administrador Farmaboy",
      destinatario: targetRecipient,
      servidor: config.host,
      puerto: config.port,
      fecha: new Date().toLocaleString("es-CO"),
      numero_pedido: "TEST-9999",
      total: 125000,
      cliente: "Carlos Rodríguez",
      correo: targetRecipient,
      ticket: "TICK-TEST",
      asunto: "Prueba técnica de diagnóstico",
    });

    const subject = customSubject || rendered.subject;

    const result = await sendRawMail({
      to: targetRecipient,
      subject,
      html: rendered.html,
      text: rendered.text,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Correo de prueba enviado exitosamente a ${targetRecipient}`,
        messageId: result.messageId,
        provider: `${config.host}:${config.port}`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          provider: `${config.host}:${config.port}`,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("[API /api/emails/test Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Error interno al enviar prueba SMTP" },
      { status: 500 }
    );
  }
}
