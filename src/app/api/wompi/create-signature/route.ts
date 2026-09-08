import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { wompiConfig } from "@/config/wompi";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference, amountInCents, currency = "COP" } = body;

    if (!reference || !amountInCents) {
      return NextResponse.json(
        { error: "reference y amountInCents son requeridos" },
        { status: 400 }
      );
    }

    // Secreto de integridad configurado en Wompi
    const integritySecret =
      process.env.WOMPI_INTEGRITY_SECRET || "test_integrity_PLACEHOLDER_FARMABOY";

    // Cadena de concatenación oficial de Wompi:
    // <Referencia><MontoEnCentavos><Moneda><SecretoDeIntegridad>
    const stringToSign = `${reference}${amountInCents}${currency}${integritySecret}`;

    // Cálculo del hash SHA-256
    const signature = crypto
      .createHash("sha256")
      .update(stringToSign, "utf8")
      .digest("hex");

    const isPlaceholder =
      wompiConfig.publicKey.includes("PLACEHOLDER") ||
      integritySecret.includes("PLACEHOLDER");

    return NextResponse.json({
      success: true,
      signature,
      reference,
      amountInCents,
      currency,
      publicKey: wompiConfig.publicKey,
      redirectUrl: wompiConfig.redirectUrl,
      environment: wompiConfig.environment,
      isPlaceholder,
      message: isPlaceholder
        ? "Firma generada con credenciales placeholder de prueba. Cuando configures tus llaves reales en .env.local, Wompi validará la transacción en producción."
        : "Firma SHA-256 generada exitosamente para Wompi.",
    });
  } catch (error: any) {
    console.error("Error generating Wompi signature:", error);
    return NextResponse.json(
      { error: "Error interno calculando la firma de Wompi" },
      { status: 500 }
    );
  }
}
