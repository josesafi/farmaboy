import { NextRequest, NextResponse } from "next/server";
import { EmailService } from "@/lib/email/emailService";
import { EmailEventType } from "@/lib/email/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, recipient, recipientName, event_id, customSubject, data } = body;

    if (!event || !recipient) {
      return NextResponse.json(
        { success: false, error: "Parámetros faltantes: 'event' y 'recipient' son obligatorios" },
        { status: 400 }
      );
    }

    const result = await EmailService.dispatch({
      event: event as EmailEventType,
      recipient,
      recipientName,
      event_id,
      customSubject,
      data: data || {},
    });

    return NextResponse.json({
      success: true,
      queued: result.queued,
      jobId: result.jobId,
      event_id: result.event_id,
      duplicateSkipped: result.duplicateSkipped,
      message: result.duplicateSkipped
        ? "Evento duplicado omitido por política de idempotencia"
        : "Correo transaccional encolado exitosamente para despacho",
    });
  } catch (err: any) {
    console.error("[API /api/emails/send Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Error interno del servidor al procesar el correo" },
      { status: 500 }
    );
  }
}
