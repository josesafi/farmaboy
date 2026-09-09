import { NextRequest, NextResponse } from "next/server";
import { getEmailLogs, retryEmailLog } from "@/lib/email/queue";
import { EmailDeliveryStatus } from "@/lib/email/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as EmailDeliveryStatus | null;
    const search = searchParams.get("search") || undefined;
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const data = getEmailLogs({
      status: status || undefined,
      search,
      limit,
    });

    return NextResponse.json({
      success: true,
      logs: data.logs,
      stats: data.stats,
    });
  } catch (err: any) {
    console.error("[API /api/emails/logs Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Error al obtener logs de correos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { logId } = body;

    if (!logId) {
      return NextResponse.json(
        { success: false, error: "ID de registro de correo no especificado" },
        { status: 400 }
      );
    }

    const result = retryEmailLog(logId);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (err: any) {
    console.error("[API /api/emails/logs Retry Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Error al reintentar el correo" },
      { status: 500 }
    );
  }
}
