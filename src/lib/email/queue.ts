import fs from "fs";
import path from "path";
import { EmailEventType, EmailLog, QueueJob, EmailDeliveryStatus } from "./types";
import { emailTemplates } from "./templates/registry";
import { sendRawMail, getSmtpConfig } from "./transporter";

const DATA_DIR = path.join(process.cwd(), "data");
const QUEUE_FILE = path.join(DATA_DIR, "email_queue.json");
const LOGS_FILE = path.join(DATA_DIR, "email_logs.json");
const PROCESSED_EVENTS_FILE = path.join(DATA_DIR, "processed_events.json");

// In-memory cache for speed with disk sync
let memoryQueue: QueueJob[] = [];
let memoryLogs: EmailLog[] = [];
let memoryProcessedEvents: Set<string> = new Set();
let isInitialized = false;

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(QUEUE_FILE)) {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify([], null, 2), "utf8");
  }
  if (!fs.existsSync(LOGS_FILE)) {
    fs.writeFileSync(LOGS_FILE, JSON.stringify([], null, 2), "utf8");
  }
  if (!fs.existsSync(PROCESSED_EVENTS_FILE)) {
    fs.writeFileSync(PROCESSED_EVENTS_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

function initStorage() {
  if (isInitialized) return;
  try {
    ensureDataFiles();
    const queueData = fs.readFileSync(QUEUE_FILE, "utf8");
    memoryQueue = JSON.parse(queueData || "[]");

    const logsData = fs.readFileSync(LOGS_FILE, "utf8");
    memoryLogs = JSON.parse(logsData || "[]");

    const eventsData = fs.readFileSync(PROCESSED_EVENTS_FILE, "utf8");
    const arr = JSON.parse(eventsData || "[]");
    memoryProcessedEvents = new Set(arr);

    isInitialized = true;
  } catch (err) {
    console.error("[EmailQueue Storage Init Error]:", err);
    memoryQueue = [];
    memoryLogs = [];
    memoryProcessedEvents = new Set();
    isInitialized = true;
  }
}

function persistQueue() {
  try {
    ensureDataFiles();
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(memoryQueue, null, 2), "utf8");
  } catch (err) {
    console.error("[EmailQueue Persist Error]:", err);
  }
}

function persistLogs() {
  try {
    ensureDataFiles();
    // Keep last 500 logs to prevent unbounded file growth
    if (memoryLogs.length > 500) {
      memoryLogs = memoryLogs.slice(-500);
    }
    fs.writeFileSync(LOGS_FILE, JSON.stringify(memoryLogs, null, 2), "utf8");
  } catch (err) {
    console.error("[EmailLogs Persist Error]:", err);
  }
}

function persistProcessedEvents() {
  try {
    ensureDataFiles();
    const arr = Array.from(memoryProcessedEvents);
    // Keep last 1000 event IDs
    const trimmed = arr.length > 1000 ? arr.slice(-1000) : arr;
    fs.writeFileSync(PROCESSED_EVENTS_FILE, JSON.stringify(trimmed, null, 2), "utf8");
  } catch (err) {
    console.error("[ProcessedEvents Persist Error]:", err);
  }
}

/**
 * Checks if an event has already been successfully processed (Idempotency).
 */
export function isEventAlreadyProcessed(eventId: string): boolean {
  initStorage();
  return memoryProcessedEvents.has(eventId);
}

/**
 * Enqueues an email job to be sent asynchronously.
 */
export function enqueueEmailJob(jobData: {
  event: EmailEventType;
  event_id: string;
  recipient: string;
  recipientName?: string;
  customSubject?: string;
  data: Record<string, any>;
}): { queued: boolean; jobId: string; duplicateSkipped?: boolean } {
  initStorage();

  // 1. Idempotency Check: Prevent duplicate sends
  if (jobData.event_id && memoryProcessedEvents.has(jobData.event_id)) {
    console.log(`[Idempotency Hit] Skipping duplicate email event: ${jobData.event_id}`);
    return { queued: false, jobId: "", duplicateSkipped: true };
  }

  // Check if identical event is already in queue
  const alreadyInQueue = memoryQueue.some(
    (q) => q.event_id === jobData.event_id && (q.status === "PENDING" || q.status === "PROCESSING")
  );
  if (alreadyInQueue) {
    console.log(`[Queue Duplicate] Job with event_id ${jobData.event_id} is already queued.`);
    return { queued: false, jobId: "", duplicateSkipped: true };
  }

  const templateDef = emailTemplates[jobData.event];
  const templateId = templateDef ? templateDef.id : "generic";
  const category = templateDef ? templateDef.category : "ACCOUNT";
  const defaultSubj = templateDef ? templateDef.defaultSubject : "Notificación Farmaboy";

  const jobId = "job_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

  const job: QueueJob = {
    id: jobId,
    event_id: jobData.event_id,
    event: jobData.event,
    category,
    recipient: jobData.recipient,
    recipientName: jobData.recipientName,
    subject: jobData.customSubject || defaultSubj,
    templateId,
    data: jobData.data || {},
    attempts: 0,
    maxAttempts: 3,
    nextAttemptAt: Date.now(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  memoryQueue.push(job);
  persistQueue();

  // Trigger non-blocking worker execution
  setImmediate(() => {
    processQueueWorker().catch((e) => console.error("[Background Worker Error]:", e));
  });

  return { queued: true, jobId };
}

/**
 * Asynchronous Worker: Processes pending email jobs from the queue.
 */
export async function processQueueWorker(): Promise<{ processed: number; errors: number }> {
  initStorage();

  const now = Date.now();
  // Find jobs ready for processing
  const eligibleJobs = memoryQueue.filter(
    (job) => (job.status === "PENDING" || job.status === "FAILED") && job.attempts < job.maxAttempts && job.nextAttemptAt <= now
  );

  if (eligibleJobs.length === 0) {
    return { processed: 0, errors: 0 };
  }

  let processedCount = 0;
  let errorCount = 0;

  for (const job of eligibleJobs) {
    job.status = "PROCESSING";
    job.attempts += 1;
    persistQueue();

    try {
      // 1. Render Template
      const templateDef = emailTemplates[job.event];
      if (!templateDef) {
        throw new Error(`Plantilla no encontrada para el evento: ${job.event}`);
      }

      const rendered = templateDef.render({
        ...job.data,
        nombre: job.recipientName || job.data.nombre,
        correo: job.recipient,
      });

      const finalSubject = job.subject || rendered.subject;

      // 2. Dispatch via SMTP
      const sendResult = await sendRawMail({
        to: job.recipient,
        subject: finalSubject,
        html: rendered.html,
        text: rendered.text,
      });

      if (sendResult.success) {
        job.status = "COMPLETED";
        job.completedAt = new Date().toISOString();
        processedCount += 1;

        // Register in idempotency cache
        if (job.event_id) {
          memoryProcessedEvents.add(job.event_id);
          persistProcessedEvents();
        }

        // Add to email log
        addEmailLog({
          id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
          timestamp: new Date().toISOString(),
          recipient: job.recipient,
          template: job.templateId,
          event: job.event,
          subject: finalSubject,
          status: "SENT",
          provider: "smtp.buzondecorreo.com",
          message_id: sendResult.messageId,
          retry_count: job.attempts - 1,
          event_id: job.event_id,
        });
      } else {
        throw new Error(sendResult.error || "Error desconocido al enviar vía SMTP");
      }
    } catch (err: any) {
      errorCount += 1;
      job.lastError = err.message || String(err);

      // Backoff intervals: Attempt 1 -> 60s, Attempt 2 -> 300s (5min), Attempt 3 -> FAILED
      if (job.attempts < job.maxAttempts) {
        job.status = "PENDING";
        const delaySeconds = job.attempts === 1 ? 60 : 300;
        job.nextAttemptAt = Date.now() + delaySeconds * 1000;

        addEmailLog({
          id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
          timestamp: new Date().toISOString(),
          recipient: job.recipient,
          template: job.templateId,
          event: job.event,
          subject: job.subject,
          status: "RETRYING",
          provider: "smtp.buzondecorreo.com",
          error: `Intento ${job.attempts} falló: ${job.lastError}. Próximo reintento programado.`,
          retry_count: job.attempts,
          event_id: job.event_id,
        });
      } else {
        job.status = "FAILED";

        addEmailLog({
          id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
          timestamp: new Date().toISOString(),
          recipient: job.recipient,
          template: job.templateId,
          event: job.event,
          subject: job.subject,
          status: "FAILED",
          provider: "smtp.buzondecorreo.com",
          error: `Falló tras ${job.maxAttempts} intentos: ${job.lastError}`,
          retry_count: job.attempts,
          event_id: job.event_id,
        });
      }
    }
  }

  // Remove completed jobs older than 24 hours to keep queue light
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  memoryQueue = memoryQueue.filter(
    (j) => j.status !== "COMPLETED" || (j.completedAt && new Date(j.completedAt).getTime() > oneDayAgo)
  );

  persistQueue();
  return { processed: processedCount, errors: errorCount };
}

/**
 * Records an entry into the centralized audit email logs.
 */
export function addEmailLog(log: EmailLog) {
  initStorage();
  memoryLogs.unshift(log); // Most recent first
  persistLogs();
}

/**
 * Returns all stored email logs with optional filtering.
 */
export function getEmailLogs(options?: {
  limit?: number;
  status?: EmailDeliveryStatus;
  search?: string;
}): { logs: EmailLog[]; stats: Record<string, any> } {
  initStorage();

  let filtered = [...memoryLogs];

  if (options?.status) {
    filtered = filtered.filter((l) => l.status === options.status);
  }

  if (options?.search) {
    const term = options.search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.recipient.toLowerCase().includes(term) ||
        l.subject.toLowerCase().includes(term) ||
        l.event.toLowerCase().includes(term) ||
        l.event_id.toLowerCase().includes(term)
    );
  }

  const limit = options?.limit || 100;
  const sliced = filtered.slice(0, limit);

  // Calculate stats
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let sentToday = 0;
  let sentWeek = 0;
  let sentMonth = 0;
  let totalSent = 0;
  let totalFailed = 0;
  let totalRetrying = 0;

  memoryLogs.forEach((l) => {
    const t = new Date(l.timestamp).getTime();
    if (l.status === "SENT") {
      totalSent += 1;
      if (t >= startOfDay) sentToday += 1;
      if (t >= startOfWeek) sentWeek += 1;
      if (t >= startOfMonth) sentMonth += 1;
    } else if (l.status === "FAILED") {
      totalFailed += 1;
    } else if (l.status === "RETRYING") {
      totalRetrying += 1;
    }
  });

  const pendingInQueue = memoryQueue.filter((q) => q.status === "PENDING" || q.status === "PROCESSING").length;
  const totalAttempts = totalSent + totalFailed;
  const successRate = totalAttempts > 0 ? Math.round((totalSent / totalAttempts) * 100) : 100;
  const errorRate = totalAttempts > 0 ? Math.round((totalFailed / totalAttempts) * 100) : 0;

  return {
    logs: sliced,
    stats: {
      sentToday,
      sentWeek,
      sentMonth,
      totalSent,
      totalFailed,
      totalRetrying,
      pendingInQueue,
      successRate,
      errorRate,
    },
  };
}

/**
 * Manually retries a failed email log entry.
 */
export function retryEmailLog(logId: string): { success: boolean; message: string } {
  initStorage();
  const target = memoryLogs.find((l) => l.id === logId);
  if (!target) {
    return { success: false, message: "Registro de correo no encontrado" };
  }

  // Allow re-sending by generating a unique new event_id for manual re-send
  const resendEventId = target.event_id + "_resend_" + Date.now();

  enqueueEmailJob({
    event: target.event,
    event_id: resendEventId,
    recipient: target.recipient,
    customSubject: target.subject,
    data: {
      nombre: target.recipient.split("@")[0],
      correo: target.recipient,
    },
  });

  return { success: true, message: `Reenvío encolado para ${target.recipient}` };
}
