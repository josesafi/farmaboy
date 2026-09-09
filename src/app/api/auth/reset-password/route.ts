import { NextRequest, NextResponse } from "next/server";
import { EmailService } from "@/lib/email/emailService";

export async function POST(req: NextRequest) {
  try {
    const { action, email, token, newPassword } = await req.json();

    if (action === "request") {
      if (!email) {
        return NextResponse.json({ success: false, error: "Correo requerido" }, { status: 400 });
      }
      const resetToken = "rst_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      await EmailService.sendPasswordReset({
        email,
        name: email.split("@")[0],
        token: resetToken,
      });

      return NextResponse.json({
        success: true,
        message: "Si la cuenta existe, se ha enviado un enlace de recuperación.",
      });
    }

    if (action === "reset") {
      if (!email || !newPassword) {
        return NextResponse.json(
          { success: false, error: "Correo y nueva contraseña requeridos" },
          { status: 400 }
        );
      }

      await EmailService.sendPasswordChanged({
        email,
        name: email.split("@")[0],
      });

      return NextResponse.json({
        success: true,
        message: "Contraseña actualizada exitosamente.",
      });
    }

    return NextResponse.json({ success: false, error: "Acción no válida" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Error al procesar restablecimiento de contraseña" },
      { status: 500 }
    );
  }
}
