import { NextRequest, NextResponse } from "next/server";
import { emailTemplates } from "@/lib/email/templates/registry";
import { validateTemplateVariables } from "@/lib/email/templates/validator";
import { EmailEventType } from "@/lib/email/types";
import fs from "fs";
import path from "path";

const TEMPLATES_OVERRIDE_FILE = path.join(process.cwd(), "data", "email_template_overrides.json");

function getOverrides(): Record<string, { subject?: string; customNotes?: string }> {
  try {
    if (fs.existsSync(TEMPLATES_OVERRIDE_FILE)) {
      return JSON.parse(fs.readFileSync(TEMPLATES_OVERRIDE_FILE, "utf8"));
    }
  } catch (e) {}
  return {};
}

function saveOverrides(data: Record<string, any>) {
  try {
    const dir = path.dirname(TEMPLATES_OVERRIDE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(TEMPLATES_OVERRIDE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to save template overrides:", e);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const event = searchParams.get("event") as EmailEventType | null;
    const overrides = getOverrides();

    if (event && emailTemplates[event]) {
      const t = emailTemplates[event];
      const preview = t.render({
        nombre: "Carlos Rodríguez",
        correo: "carlos@ejemplo.com",
        numero_pedido: "ORD-184920",
        fecha: new Date().toLocaleDateString("es-CO"),
        hora: "10:30 AM",
        subtotalCOP: 85000,
        discountCOP: 8500,
        shippingCOP: 0,
        totalCOP: 76500,
        metodo_pago: "Bancolombia QR",
        domicilio_o_recogida: "Domicilio a Tunja",
        deliveryAddress: "Carrera 9 # 18-42",
        deliveryCity: "Tunja",
        ticket: "TICK-7294",
        asunto: "Consulta de prueba",
        dispositivo: "iPhone 15 Pro",
        codigo: "FARMA10",
        descuento: "10% de descuento",
      });

      return NextResponse.json({
        success: true,
        template: {
          id: t.id,
          event: t.event,
          name: t.name,
          category: t.category,
          defaultSubject: t.defaultSubject,
          currentSubject: overrides[event]?.subject || t.defaultSubject,
          allowedVariables: t.allowedVariables,
          description: t.description,
          previewHtml: preview.html,
          previewSubject: preview.subject,
        },
      });
    }

    const list = Object.values(emailTemplates).map((t) => ({
      id: t.id,
      event: t.event,
      name: t.name,
      category: t.category,
      defaultSubject: t.defaultSubject,
      currentSubject: overrides[t.event]?.subject || t.defaultSubject,
      allowedVariables: t.allowedVariables,
      description: t.description,
    }));

    return NextResponse.json({
      success: true,
      templates: list,
    });
  } catch (err: any) {
    console.error("[API /api/emails/templates Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Error al obtener plantillas" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, subject, restoreDefault } = body;

    if (!event || !emailTemplates[event as EmailEventType]) {
      return NextResponse.json(
        { success: false, error: "Evento de plantilla inválido o no reconocido" },
        { status: 400 }
      );
    }

    const templateDef = emailTemplates[event as EmailEventType];
    const overrides = getOverrides();

    if (restoreDefault) {
      delete overrides[event];
      saveOverrides(overrides);
      return NextResponse.json({
        success: true,
        message: `Plantilla ${templateDef.name} restaurada a valores predeterminados`,
        subject: templateDef.defaultSubject,
      });
    }

    if (subject) {
      // Validate variables inside subject
      const validation = validateTemplateVariables(subject, templateDef.allowedVariables);
      if (!validation.isValid) {
        return NextResponse.json(
          {
            success: false,
            error: `Variables no permitidas encontradas en el asunto: ${validation.invalidVariables.join(", ")}. Variables permitidas: ${templateDef.allowedVariables.join(", ")}`,
            invalidVariables: validation.invalidVariables,
            allowedVariables: templateDef.allowedVariables,
          },
          { status: 400 }
        );
      }

      overrides[event] = {
        ...overrides[event],
        subject,
      };
      saveOverrides(overrides);
    }

    return NextResponse.json({
      success: true,
      message: "Plantilla actualizada exitosamente",
      currentSubject: overrides[event]?.subject || templateDef.defaultSubject,
    });
  } catch (err: any) {
    console.error("[API /api/emails/templates Save Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Error al guardar plantilla" },
      { status: 500 }
    );
  }
}
