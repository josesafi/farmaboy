import { NextRequest, NextResponse } from "next/server";
import { EmailService } from "@/lib/email/emailService";
import fs from "fs";
import path from "path";

const UNSUBSCRIBE_FILE = path.join(process.cwd(), "data", "unsubscribed_emails.json");

function getUnsubscribedList(): string[] {
  try {
    if (fs.existsSync(UNSUBSCRIBE_FILE)) {
      return JSON.parse(fs.readFileSync(UNSUBSCRIBE_FILE, "utf8"));
    }
  } catch (e) {}
  return [];
}

function saveUnsubscribed(email: string) {
  try {
    const dir = path.dirname(UNSUBSCRIBE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const list = getUnsubscribedList();
    const clean = email.toLowerCase().trim();
    if (!list.includes(clean)) {
      list.push(clean);
      fs.writeFileSync(UNSUBSCRIBE_FILE, JSON.stringify(list, null, 2), "utf8");
    }
  } catch (e) {
    console.error("Failed to save unsubscribed email:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Correo electrónico no válido" },
        { status: 400 }
      );
    }

    saveUnsubscribed(email);

    // Send confirmation of commercial unsubscribe
    await EmailService.dispatch({
      event: "UNSUBSCRIBE_CONFIRMED",
      recipient: email,
      data: {
        nombre: email.split("@")[0],
        correo: email,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Has cancelado exitosamente las comunicaciones comerciales de Farmaboy.",
    });
  } catch (err: any) {
    console.error("[API /api/emails/unsubscribe Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Error al procesar la cancelación de suscripción" },
      { status: 500 }
    );
  }
}
