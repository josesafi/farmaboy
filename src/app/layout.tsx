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
    default: "Droguería y Farmacia en Duitama, Boyacá | Farmaboy",
    template: "%s | Farmaboy Duitama",
  },
  description:
    "Farmaboy: Tu droguería y farmacia de confianza en Duitama, Boyacá. Venta y despacho de medicamentos éticos y genéricos, fórmulas médicas, cuidado personal, insumos hospitalarios y transporte asistencial. Domicilios rápidos en Duitama y Boyacá.",
  keywords: [
    "droguería en duitama",
    "droguerias en duitama",
    "farmacia en duitama",
    "farmacias duitama",
    "farmacia de turno duitama",
    "medicamentos a domicilio duitama",
    "drogueria a domicilio duitama",
    "farmacia boyaca",
    "droguería en Boyacá",
    "medicamentos en Boyacá",
    "insumos hospitalarios Duitama",
    "insumos medicos duitama boyaca",
    "transporte asistencial Boyacá",
    "farmaboy",
    "farmaboy duitama",
    "comprar medicamentos duitama",
  ],
  authors: [{ name: "Farmaboy Integrales de Servicios en Salud S.A.S." }],
  creator: "Farmaboy",
  publisher: "Farmaboy",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-farmaboy",
  },
  other: {
    "geo.region": "CO-BOY",
    "geo.placename": "Duitama, Boyacá",
    "geo.position": "5.8172853;-73.0295171",
    "ICBM": "5.8172853, -73.0295171",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://farmaboy.com.co",
    siteName: "Farmaboy Duitama",
    title: "Droguería y Farmacia en Duitama, Boyacá | Farmaboy",
    description:
      "Droguería y farmacia líder en Duitama, Boyacá. Medicamentos, fórmulas médicas, insumos clínicos y atención directa con entregas rápidas.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586015555751-63c2999e32a4?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Farmaboy - Droguería y Farmacia en Duitama, Boyacá",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Droguería y Farmacia en Duitama, Boyacá | Farmaboy",
    description:
      "Medicamentos, insumos médicos y farmacia en Duitama, Boyacá. Atención personalizada y despachos en Boyacá.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
    "@type": ["Pharmacy", "LocalBusiness"],
    name: "Farmaboy | Droguería & Farmacia en Duitama",
    legalName: farmaboyConfig.legalName,
    alternateName: ["Farmaboy", "Farmaboy Duitama", "Farmaboy Integrales"],
    url: "https://farmaboy.com.co",
    logo: "https://farmaboy.com.co/icon.png",
    image: "https://images.unsplash.com/photo-1586015555751-63c2999e32a4?q=80&w=1200",
    description: "Droguería y farmacia especializada en Duitama, Boyacá. Comercialización de medicamentos éticos y genéricos, insumos médico-hospitalarios y atención en salud.",
    telephone: farmaboyConfig.contact.phone,
    email: farmaboyConfig.contact.emailGeneral,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Transversal 29 # 10-63 (TV 29 10 63)",
      addressLocality: "Duitama",
      addressRegion: "Boyacá",
      postalCode: "150461",
      addressCountry: "CO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 5.8172853,
      longitude: -73.0295171,
    },
    hasMap: "https://www.google.com/maps/place/Farmaboy+integrales+de+servicios+en+salud+sas/@5.8172853,-73.0295171,17z/data=!3m1!4b1!4m6!3m5!1s0x8e6a3f01d0b41f3d:0x3f2f0298e4b78051!8m2!3d5.8172853!4d-73.0295171",
    areaServed: [
      {
        "@type": "City",
        name: "Duitama",
      },
      {
        "@type": "AdministrativeArea",
        name: "Boyacá",
      },
      {
        "@type": "City",
        name: "Sogamoso",
      },
      {
        "@type": "City",
        name: "Paipa",
      },
      {
        "@type": "City",
        name: "Tunja",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "07:00",
        closes: "20:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    priceRange: "$$",
    paymentAccepted: "Efectivo, Tarjeta Débito, Tarjeta Crédito, Nequi, Bancolombia, PSE, Wompi",
    currenciesAccepted: "COP",
    sameAs: [
      "https://www.google.com/maps/place/Farmaboy+integrales+de+servicios+en+salud+sas/@5.8172853,-73.0295171,17z/data=!3m1!4b1!4m6!3m5!1s0x8e6a3f01d0b41f3d:0x3f2f0298e4b78051!8m2!3d5.8172853!4d-73.0295171",
    ],
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
