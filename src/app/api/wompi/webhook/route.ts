import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, data, signature, timestamp } = body;

    console.log(`[WOMPI WEBHOOK] Evento recibido: ${event}`);

    // Secreto de eventos de Wompi
    const integritySecret =
      process.env.WOMPI_INTEGRITY_SECRET || "test_integrity_PLACEHOLDER_FARMABOY";

    // Si Wompi envía firma para validar el evento:
    if (signature && signature.properties && signature.checksum) {
      // Concatenar valores de las propiedades indicadas + timestamp + secreto
      const propertiesValues = signature.properties
        .map((prop: string) => {
          const keys = prop.split(".");
          let val: any = body.data;
          for (const k of keys) {
            val = val ? val[k] : "";
          }
          return val;
        })
        .join("");

      const stringToValidate = `${propertiesValues}${timestamp}${integritySecret}`;
      const calculatedChecksum = crypto
        .createHash("sha256")
        .update(stringToValidate, "utf8")
        .digest("hex");

      const isValid = calculatedChecksum === signature.checksum;
      console.log(`[WOMPI WEBHOOK] Validación de firma: ${isValid ? "VÁLIDA" : "INVÁLIDA"}`);
    }

    if (event === "transaction.updated" && data?.transaction) {
      const { id, status, reference, amount_in_cents } = data.transaction;
      console.log(
        `[WOMPI WEBHOOK] Transacción ${id} (${reference}) estado actualizado a: ${status}, monto: $${amount_in_cents / 100} COP`
      );
    }

    return NextResponse.json({ status: "received", success: true });
  } catch (error: any) {
    console.error("[WOMPI WEBHOOK] Error procesando evento:", error);
    return NextResponse.json(
      { error: "Error procesando webhook de Wompi" },
      { status: 400 }
    );
  }
}
