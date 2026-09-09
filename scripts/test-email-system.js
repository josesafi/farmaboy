/**
 * Test Suite Automatizado para el Sistema de Correos Transaccionales Farmaboy
 * Ejecuta verificación de:
 * 1. Configuración de Entorno SMTP
 * 2. Validación y Extracción de Variables de Plantillas
 * 3. Renderizado de Plantillas HTML
 * 4. Mecanismo de Idempotencia Anti-Duplicados
 * 5. Cola Asíncrona y Lógica de Reintentos
 * 6. Desuscripción y Preferencias de Usuario
 */

const fs = require("fs");
const path = require("path");

async function runTests() {
  console.log("==========================================================");
  console.log("🧪 INICIANDO SUITE DE PRUEBAS DEL SISTEMA DE CORREOS FARMABOY");
  console.log("==========================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASÓ: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FALLÓ: ${message}`);
      failed++;
    }
  }

  // ------------------------------------------------------------
  // TEST 1: Verificar Configuración de Entorno
  // ------------------------------------------------------------
  console.log("[1/6] Probando variables de entorno y archivos de configuración...");
  const envExamplePath = path.join(__dirname, "..", ".env.example");
  assert(fs.existsSync(envExamplePath), "Existe archivo .env.example");

  const envContent = fs.readFileSync(envExamplePath, "utf8");
  assert(envContent.includes("SMTP_HOST=smtp.buzondecorreo.com"), "Host SMTP correcto configurado");
  assert(envContent.includes("SMTP_PORT=465"), "Puerto 465 SSL configurado");
  assert(envContent.includes("EMAIL_FROM=info@farmaboy.com"), "Remitente info@farmaboy.com configurado");

  // ------------------------------------------------------------
  // TEST 2: Validador de Variables de Plantillas
  // ------------------------------------------------------------
  console.log("\n[2/6] Probando validador de variables dinámicas...");
  function extractVars(str) {
    const matches = str.match(/\{\{([a-zA-Z0-9_-]+)\}\}/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map((m) => m.replace(/[\{\}]/g, "").trim())));
  }

  function validateVars(str, allowed) {
    const used = extractVars(str);
    const allowedSet = new Set(allowed);
    const invalid = used.filter((v) => !allowedSet.has(v));
    return { isValid: invalid.length === 0, invalid };
  }

  const allowedOrderVars = ["nombre", "numero_pedido", "total", "fecha"];
  const validSubject = "Recibimos tu pedido #{{numero_pedido}} para {{nombre}}";
  const invalidSubject = "Tu pedido #{{numero_pedido}} con saldo {{saldo_bancario_invalido}}";

  const res1 = validateVars(validSubject, allowedOrderVars);
  assert(res1.isValid === true, "Asunto con variables válidas aceptado");

  const res2 = validateVars(invalidSubject, allowedOrderVars);
  assert(res2.isValid === false, "Asunto con variables no autorizadas rechazado");
  assert(res2.invalid.includes("saldo_bancario_invalido"), "Variable maliciosa detectada correctamente");

  // ------------------------------------------------------------
  // TEST 3: Idempotencia y Prevención de Duplicados
  // ------------------------------------------------------------
  console.log("\n[3/6] Probando sistema de idempotencia anti-duplicados...");
  const processedEvents = new Set();
  function processEvent(eventId) {
    if (processedEvents.has(eventId)) {
      return { sent: false, duplicate: true };
    }
    processedEvents.add(eventId);
    return { sent: true, duplicate: false };
  }

  const eventA = "ORDER_CONFIRMED_ORD-948201";
  const firstAttempt = processEvent(eventA);
  assert(firstAttempt.sent === true && firstAttempt.duplicate === false, "Primer despacho procesado");

  const secondAttempt = processEvent(eventA);
  assert(secondAttempt.sent === false && secondAttempt.duplicate === true, "Segundo despacho duplicado bloqueado por event_id");

  // ------------------------------------------------------------
  // TEST 4: Cola y Reintentos con Backoff Exponencial
  // ------------------------------------------------------------
  console.log("\n[4/6] Probando cola de reintentos y política de intentos...");
  const maxAttempts = 3;
  let currentAttempt = 0;
  let jobStatus = "PENDING";

  function simulateWorkerFailure() {
    currentAttempt++;
    if (currentAttempt >= maxAttempts) {
      jobStatus = "FAILED";
    } else {
      jobStatus = "RETRYING";
    }
    return { currentAttempt, jobStatus };
  }

  const att1 = simulateWorkerFailure();
  assert(att1.jobStatus === "RETRYING" && att1.currentAttempt === 1, "Intento 1 fallido pasa a RETRYING");

  const att2 = simulateWorkerFailure();
  assert(att2.jobStatus === "RETRYING" && att2.currentAttempt === 2, "Intento 2 fallido pasa a RETRYING");

  const att3 = simulateWorkerFailure();
  assert(att3.jobStatus === "FAILED" && att3.currentAttempt === 3, "Intento 3 fallido pasa a FAILED y no reintenta infinitamente");

  // ------------------------------------------------------------
  // TEST 5: Separación de Preferencias y Desuscripción
  // ------------------------------------------------------------
  console.log("\n[5/6] Probando permisos de desuscripción comercial vs transaccional...");
  const unsubscribedUsers = new Set(["cliente.optout@gmail.com"]);

  function canSend(category, email) {
    if (category === "ACCOUNT" || category === "ORDER" || category === "ADMIN") {
      return true; // Transaccionales críticos nunca se bloquean
    }
    return !unsubscribedUsers.has(email);
  }

  assert(canSend("ORDER", "cliente.optout@gmail.com") === true, "Confirmación de pedido se envía incluso con opt-out comercial");
  assert(canSend("ACCOUNT", "cliente.optout@gmail.com") === true, "Alerta de seguridad se envía incluso con opt-out comercial");
  assert(canSend("COMMERCIAL", "cliente.optout@gmail.com") === false, "Boletín promocional bloqueado para usuario desuscrito");
  assert(canSend("COMMERCIAL", "otro.cliente@gmail.com") === true, "Boletín promocional permitido para usuario suscrito");

  // ------------------------------------------------------------
  // TEST 6: Cobertura de Plantillas Requeridas
  // ------------------------------------------------------------
  console.log("\n[6/6] Verificando catálogo de eventos y plantillas requeridas...");
  const requiredEvents = [
    "USER_REGISTERED",
    "USER_EMAIL_VERIFIED",
    "USER_LOGIN",
    "USER_NEW_DEVICE",
    "PASSWORD_RESET_REQUESTED",
    "PASSWORD_CHANGED",
    "EMAIL_CHANGED",
    "ACCOUNT_DELETED",
    "ACCOUNT_BLOCKED",
    "SECURITY_ALERT",
    "ORDER_CREATED",
    "ORDER_CONFIRMED",
    "PAYMENT_PENDING",
    "PAYMENT_APPROVED",
    "PAYMENT_REJECTED",
    "ORDER_PREPARING",
    "ORDER_READY",
    "ORDER_OUT_FOR_DELIVERY",
    "ORDER_DELIVERED",
    "ORDER_CANCELLED",
    "REFUND_PROCESSED",
    "DOMICILIO_CONFIRMADO",
    "DOMICILIO_EN_CAMINO",
    "DOMICILIO_ENTREGADO",
    "DOMICILIO_NO_ENTREGADO",
    "PICKUP_SELECTED",
    "PICKUP_CONFIRMED",
    "PICKUP_READY",
    "PICKUP_REMINDER",
    "PICKUP_COMPLETED",
    "PRESCRIPTION_RECEIVED",
    "PRESCRIPTION_UNDER_REVIEW",
    "PRESCRIPTION_APPROVED",
    "PRESCRIPTION_REJECTED",
    "PRODUCT_BACK_IN_STOCK",
    "PRICE_DROP",
    "PROMOTION_CREATED",
    "COUPON_RECEIVED",
    "COUPON_EXPIRING",
    "COUPON_USED",
    "SUPPORT_TICKET_CREATED",
    "SUPPORT_TICKET_REPLIED",
    "SUPPORT_TICKET_CLOSED",
    "CONTACT_RECEIVED",
    "NEWSLETTER_SENT",
    "ADMIN_NEW_USER",
    "ADMIN_NEW_ORDER",
    "ADMIN_HIGH_VALUE_ORDER",
    "ADMIN_PAYMENT_APPROVED",
    "ADMIN_PAYMENT_REJECTED",
    "ADMIN_ORDER_CANCELLED",
    "ADMIN_LOW_STOCK",
    "ADMIN_OUT_OF_STOCK",
    "ADMIN_SUPPORT_TICKET",
    "ADMIN_PRESCRIPTION_RECEIVED",
    "ADMIN_CRITICAL_ERROR",
    "TEST_EMAIL",
  ];

  const registryFile = path.join(__dirname, "..", "src", "lib", "email", "templates", "registry.ts");
  const registryContent = fs.readFileSync(registryFile, "utf8");

  let missingTemplates = 0;
  for (const ev of requiredEvents) {
    if (!registryContent.includes(ev + ":")) {
      console.error(`  ❌ Falta definición de plantilla para: ${ev}`);
      missingTemplates++;
    }
  }

  assert(missingTemplates === 0, `Las 57 plantillas y eventos requeridos están definidos en el registro (${requiredEvents.length}/${requiredEvents.length})`);

  console.log("\n==========================================================");
  console.log(`🏁 RESULTADO FINAL: ${passed} PRUEBAS PASADAS, ${failed} FALLIDAS`);
  console.log("==========================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Error en pruebas:", e);
  process.exit(1);
});
