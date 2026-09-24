import { NextRequest, NextResponse } from "next/server";
import {
  getAllCustomers,
  saveCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/lib/server/customersDb";
import { CustomerCRM } from "@/types/admin";

export async function GET() {
  try {
    const customers = await getAllCustomers();
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    return NextResponse.json(
      { success: false, error: "Error al consultar clientes." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCustomer: CustomerCRM = {
      ...body,
      id: body.id || "crm-" + Date.now(),
      registrationDate: body.registrationDate || new Date().toLocaleDateString("es-CO"),
      lastLoginDate: "Nunca",
      totalOrders: 0,
      totalSpentCOP: 0,
      averageTicketCOP: 0,
    };

    const saved = await saveCustomer(newCustomer);
    return NextResponse.json({ success: true, customer: saved });
  } catch (error) {
    console.error("Error guardando cliente:", error);
    return NextResponse.json(
      { success: false, error: "Error al guardar cliente en base de datos." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "ID requerido." }, { status: 400 });
    }

    const updated = await updateCustomer(id, updates);
    return NextResponse.json({ success: true, customer: updated });
  } catch (error) {
    console.error("Error actualizando cliente:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar cliente." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID requerido." }, { status: 400 });
    }

    const deleted = await deleteCustomer(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("Error eliminando cliente:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar cliente." },
      { status: 500 }
    );
  }
}
