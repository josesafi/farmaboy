import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Cuenta | Farmaboy",
  description: "Recupera tu acceso a la plataforma de farmacia Farmaboy.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecuperarCuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
