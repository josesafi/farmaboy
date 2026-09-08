import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Farmaboy",
  description: "Accede a tu espacio personal y centro de cuenta Farmaboy en Boyacá.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
