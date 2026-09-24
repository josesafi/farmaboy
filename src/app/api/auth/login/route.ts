import { NextRequest, NextResponse } from "next/server";
import { authenticateCustomer } from "@/lib/server/customersDb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Correo/celular y contraseña son requeridos." },
        { status: 400 }
      );
    }

    const authResult = await authenticateCustomer(identifier, password);

    if (!authResult.success || !authResult.customer) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.reason || "Contraseña incorrecta.",
        },
        { status: 401 }
      );
    }

    const customer = authResult.customer;
    const userProfile = {
      id: customer.id,
      name: customer.name,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      documentType: customer.documentType || "CC",
      documentNumber: customer.documentNumber || "",
      city: customer.city || "Duitama",
      address: customer.address || "",
      segment: customer.segment || "NUEVO",
      lifetimeDiscountPercentage: customer.lifetimeDiscountPercentage || 0,
      lifetimeDiscountReason: customer.lifetimeDiscountReason || "",
      isLifetimeDiscountActive: customer.isLifetimeDiscountActive || false,
    };

    return NextResponse.json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    console.error("Error en login endpoint:", error);
    return NextResponse.json(
      { success: false, error: "Error en el servidor al autenticar." },
      { status: 500 }
    );
  }
}
