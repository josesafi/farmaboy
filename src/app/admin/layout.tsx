import type { Metadata } from "next";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Panel de Administración Integral | FARMABOY",
  description: "Sistema de gestión farmacéutica, catálogo, inventario Kardex, pedidos y CMS de Farmaboy en Boyacá.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
