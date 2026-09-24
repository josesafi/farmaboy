import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import { CustomerCRM } from "@/types/admin";
import { initialCustomers } from "@/config/initialAdminData";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "customers.json");

const SEED_CUSTOMERS: CustomerCRM[] = [
  ...initialCustomers,
  {
    id: "crm-josesafi",
    name: "José",
    lastName: "Safi",
    email: "josesafi9508@gmail.com",
    phone: "310 000 0000",
    documentType: "CC",
    documentNumber: "1049000001",
    city: "Duitama",
    address: "Calle Principal",
    registrationDate: "2026-09-24",
    lastLoginDate: "Nunca",
    totalOrders: 0,
    totalSpentCOP: 0,
    averageTicketCOP: 0,
    segment: "NUEVO",
    tempPassword: "4DtQPfDz",
    isLifetimeDiscountActive: false,
  },
];

async function ensureDb(): Promise<CustomerCRM[]> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    const content = await readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // File doesn't exist or corrupt, initialize with seed
    await writeFile(DB_FILE, JSON.stringify(SEED_CUSTOMERS, null, 2), "utf-8");
    return SEED_CUSTOMERS;
  }
  return SEED_CUSTOMERS;
}

export async function getAllCustomers(): Promise<CustomerCRM[]> {
  return await ensureDb();
}

export async function saveCustomer(cust: CustomerCRM): Promise<CustomerCRM> {
  const current = await ensureDb();
  const existingIndex = current.findIndex(
    (c) =>
      c.id === cust.id ||
      (c.email && cust.email && c.email.toLowerCase().trim() === cust.email.toLowerCase().trim())
  );

  let updated: CustomerCRM[];
  if (existingIndex >= 0) {
    updated = current.map((c, idx) => (idx === existingIndex ? { ...c, ...cust } : c));
  } else {
    updated = [cust, ...current];
  }

  await writeFile(DB_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return cust;
}

export async function updateCustomer(
  id: string,
  updates: Partial<CustomerCRM>
): Promise<CustomerCRM | null> {
  const current = await ensureDb();
  const idx = current.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const updatedCust = { ...current[idx], ...updates };
  current[idx] = updatedCust;
  await writeFile(DB_FILE, JSON.stringify(current, null, 2), "utf-8");
  return updatedCust;
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const current = await ensureDb();
  const filtered = current.filter((c) => c.id !== id);
  if (filtered.length === current.length) return false;

  await writeFile(DB_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export async function findCustomer(identifier: string): Promise<CustomerCRM | null> {
  const current = await ensureDb();
  const cleanId = identifier.trim().toLowerCase();
  const cleanPhone = identifier.replace(/\s+/g, "");

  return (
    current.find(
      (c) =>
        c.email?.toLowerCase().trim() === cleanId ||
        c.phone?.replace(/\s+/g, "") === cleanPhone ||
        c.documentNumber?.trim() === cleanId
    ) || null
  );
}

export async function authenticateCustomer(
  identifier: string,
  passwordAttempt: string
): Promise<{ success: boolean; customer?: CustomerCRM; reason?: string }> {
  const cleanPass = passwordAttempt.trim();
  const customer = await findCustomer(identifier);

  // Master fallback password
  const MASTER_PASSWORD = "X7ilfjnmua";

  if (customer) {
    // 1. Check temporary password
    if (customer.tempPassword && customer.tempPassword.trim() === cleanPass) {
      // Update last login date
      await updateCustomer(customer.id, {
        lastLoginDate: "Hoy " + new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      });
      return { success: true, customer };
    }

    // 2. Check personal registered password
    if (customer.password && customer.password === cleanPass) {
      await updateCustomer(customer.id, {
        lastLoginDate: "Hoy " + new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      });
      return { success: true, customer };
    }

    // 3. Master password fallback
    if (cleanPass === MASTER_PASSWORD) {
      return { success: true, customer };
    }

    return {
      success: false,
      reason: "Contraseña incorrecta. Verifica la contraseña temporal enviada o tu clave registrada.",
    };
  }

  // Not in DB, but check master password for guest/generic logins
  if (cleanPass === MASTER_PASSWORD) {
    return {
      success: true,
      customer: {
        id: "crm-temp-" + Date.now(),
        name: "Usuario",
        lastName: "Farmaboy",
        email: identifier.includes("@") ? identifier.trim() : "usuario@farmaboy.com.co",
        phone: !identifier.includes("@") ? identifier.trim() : "312 000 0000",
        documentType: "CC",
        documentNumber: "1049000000",
        city: "Duitama",
        address: "Duitama, Boyacá",
        registrationDate: new Date().toLocaleDateString("es-CO"),
        lastLoginDate: "Hoy",
        totalOrders: 0,
        totalSpentCOP: 0,
        averageTicketCOP: 0,
        segment: "NUEVO",
      },
    };
  }

  return {
    success: false,
    reason: "No se encontró una cuenta con ese correo ni coincide la contraseña.",
  };
}
