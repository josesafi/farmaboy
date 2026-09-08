import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Cuenta | Farmaboy",
  description: "Regístrate en Farmaboy para gestionar tus pedidos y fórmulas médicas en Boyacá.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
