import type { Metadata } from "next";
import { AccountLayoutWrapper } from "@/components/account/AccountLayoutWrapper";

export const metadata: Metadata = {
  title: "Mi Cuenta | Farmaboy Boyacá",
  description: "Espacio personal y centro de cuenta Farmaboy. Gestiona tus pedidos, fórmulas, direcciones y beneficios.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountLayoutWrapper>{children}</AccountLayoutWrapper>;
}
