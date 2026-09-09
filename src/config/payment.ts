/**
 * CONFIGURACION OFICIAL DE PAGOS FARMABOY
 * Metodo principal: Codigo QR Interoperable Bancolombia / Bre-B
 * Llave: 0092016726
 * Verificacion manual por WhatsApp y Panel Administrativo
 */

export const paymentConfig = {
  currency: 'COP',
  shipping: {
    freeShippingThreshold: 50000,
    standardShippingCost: 5000,
  },
  formatCOP: (amount: number): string => {
    return `$${amount.toLocaleString('es-CO')} COP`;
  },
  
  bancolombia: {
    nombre: 'Código QR Bancolombia & Bre-B',
    comercio: 'Farmaboy Integrales de Servicios en Salud S.A.S.',
    llave: '0092016726',
    qrImage: '/images/qr-bancolombia-farmaboy.png',
    qrCleanImage: '/images/qr-farmaboy-clean.png',
    tipoCuenta: 'Cuenta Empresarial',
    red: 'Bre-B | Bancolombia (Interoperable con todos los bancos)',
    bancosCompatibles: [
      'Bancolombia App Personas',
      'Bancolombia A la mano',
      'Nequi',
      'Daviplata',
      'Davivienda',
      'Banco de Bogotá',
      'BBVA',
      'Scotiabank Colpatria',
      'Cualquier app bancaria con Bre-B',
    ],
    instrucciones: [
      'Abre tu app bancaria (Bancolombia, Nequi o cualquier banco compatible con Bre-B).',
      'Selecciona "Pagar con QR" o "Transferir con Llave".',
      'Escanea el código QR oficial de Farmaboy o digita la Llave: 0092016726.',
      'Transfiere el monto exacto de tu pedido.',
      'Envía la captura o foto de tu comprobante a nuestro WhatsApp para verificación manual y despacho inmediato.',
    ],
  },

  whatsappVerification: {
    phone: '+57 313 427 9559',
    phoneClean: '573134279559',
    secondaryPhone: '+57 321 265 1303',
    secondaryPhoneClean: '573212651303',
    buildMessage: (orderRef: string, totalCOP: string, customerName?: string) => {
      const nameStr = customerName ? `\n*Cliente:* ${customerName}` : '';
      return `Hola Farmaboy, realicé el pago de mi pedido *#${orderRef}* por valor de *${totalCOP}* a través del QR Bancolombia / Bre-B (Llave 0092016726).${nameStr}\n\nAdjunto el comprobante de pago para su verificación manual y confirmación de despacho. ¡Muchas gracias!`;
    },
  },
};
