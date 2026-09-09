import { NextRequest, NextResponse } from "next/server";
import { EmailService } from "@/lib/email/emailService";

export async function POST(req: NextRequest) {
  try {
    const { token, email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Correo no especificado" },
        { status: 400 }
      );
    }

    // In a real database this marks user.emailVerified = true
    // Send confirmation email
    await EmailService.sendEmailVerification({
      email,
      name: email.split("@")[0],
      token: token || "verified",
    });

    return NextResponse.json({
      success: true,
      message: "¡Correo electrónico verificado correctamente!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Error al verificar el correo" },
      { status: 500 }
    );
  }
}
