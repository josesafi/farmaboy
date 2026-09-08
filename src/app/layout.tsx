import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { AdminStoreProvider } from "@/context/AdminStoreContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { farmaboyConfig } from "@/config/farmaboy";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#00A86B",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://farmaboy.com.co"),
  title: {
    default: "Farmaboy | Tu farmacia de confianza en Boyacá",
    template: "%s | Farmaboy",
  },
  description:
    "Farmacia y droguería moderna en Boyacá, Colombia. Medicamentos, cuidado personal, bienestar, insumos hospitalarios y transporte asistencial. Pagos seguros con Wompi (Bancolombia, PSE, Nequi).",
  keywords: [
    "farmacia en Boyacá",
    "droguería en Boyacá",
    "medicamentos en Boyacá",
    "farmacia en Tunja",
    "droguería en Tunja",
    "comprar medicamentos Boyacá",
    "pagar medicamentos wompi",
    "cuidado personal Boyacá",
    "insumos hospitalarios Boyacá",
    "transporte asistencial Boyacá",
    "toma de tensión Boyacá",
  ],
  authors: [{ name: "Farmaboy" }],
  creator: "Farmaboy",
  publisher: "Farmaboy",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://farmaboy.com.co",
    siteName: "Farmaboy",
    title: "Farmaboy | Tu farmacia de confianza en Boyacá",
    description:
      "Medicamentos, productos de cuidado personal, bienestar e insumos para tu hogar en Boyacá con atención cercana y pagos seguros con Wompi.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586015555751-63c2999e32a4?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Farmaboy - Farmacia y Droguería en Boyacá",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Farmaboy | Tu farmacia de confianza en Boyacá",
    description:
      "Medicamentos, bienestar y productos de cuidado para ti y tu familia en Boyacá con pagos seguros Wompi.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://farmaboy.com.co",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    name: farmaboyConfig.name,
    legalName: farmaboyConfig.legalName,
    url: "https://farmaboy.com.co",
    description: farmaboyConfig.subtagline,
    telephone: farmaboyConfig.contact.phone,
    email: farmaboyConfig.contact.emailGeneral,
    address: {
      "@type": "PostalAddress",
      streetAddress: farmaboyConfig.contact.address,
      addressLocality: "Duitama",
      addressRegion: "Boyacá",
      addressCountry: "CO",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Boyacá",
    },
    openingHours: "Mo-Sa 07:00-20:30, Su 08:00-17:00",
    priceRange: "$$",
    paymentAccepted: "Wompi, PSE, Nequi, Bancolombia, Cash, Credit Card",
    currenciesAccepted: "COP",
  };

  return (
    <html lang="es" className={`scroll-smooth ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900`}>
        <AdminStoreProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <MobileBottomBar />
              <WhatsAppButton customMessage="Hola Farmaboy, quiero consultar la disponibilidad de un producto en la farmacia." />
              <CartDrawer />
              <CheckoutModal />
            </CartProvider>
          </AuthProvider>
        </AdminStoreProvider>
      </body>
    </html>
  );
}
