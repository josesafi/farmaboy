/**
 * CONFIGURACIÓN CENTRAL DE PASARELA DE PAGOS WOMPI (BANCOLOMBIA)
 * 
 * Este archivo centraliza la configuración de Wompi para FARMABOY.
 * Lee las llaves desde las variables de entorno (.env.local),
 * y proporciona valores por defecto / placeholders para pruebas.
 */

export const wompiConfig = {
  // Llave pública (visible en el navegador)
  publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "pub_test_PLACEHOLDER_FARMABOY",
  
  // Entorno: "test" (Sandbox) o "prod" (Producción)
  environment: (process.env.NEXT_PUBLIC_WOMPI_ENV || "test") as "test" | "prod",

  // Moneda obligatoria para Wompi en Colombia
  currency: "COP",

  // URL del Widget oficial de Wompi
  widgetScriptUrl: "https://checkout.wompi.co/widget.js",

  // URLs de API según entorno
  apiBaseUrl: (process.env.NEXT_PUBLIC_WOMPI_ENV === "prod") 
    ? "https://production.wompi.co/v1" 
    : "https://sandbox.wompi.co/v1",

  // URL de redirección post-pago
  redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/pago-resultado`,

  // Tarifas de envío referenciales en Boyacá (en COP)
  shipping: {
    standardCost: 7000,          // Costo de domicilio estándar en Boyacá
    freeShippingThreshold: 80000, // Envío gratis a partir de $80.000 COP
  },

  // Formateador de moneda colombiana
  formatCOP: (amount: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  },
};
