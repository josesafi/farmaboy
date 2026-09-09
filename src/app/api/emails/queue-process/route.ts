import { NextRequest, NextResponse } from "next/server";
import { processQueueWorker } from "@/lib/email/queue";

export async function POST(req: NextRequest) {
  try {
    const result = await processQueueWorker();
    return NextResponse.json({
      success: true,
      message: `Cola procesada: ${result.processed} correos despachados, ${result.errors} reintentos pendientes`,
      ...result,
    });
  } catch (err: any) {
    console.error("[API /api/emails/queue-process Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Error al procesar la cola de correos" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const result = await processQueueWorker();
  return NextResponse.json({
    success: true,
    message: "Worker ejecutado correctamente",
    ...result,
  });
}
