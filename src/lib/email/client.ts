import { EmailEventType } from "./types";

export interface TriggerEmailPayload {
  event: EmailEventType;
  recipient: string;
  recipientName?: string;
  event_id?: string;
  customSubject?: string;
  data: Record<string, any>;
}

/**
 * Dispatches an email event from the frontend to the secure server-side worker.
 * Operates asynchronously without blocking the user's browser or checkout flow.
 */
export async function triggerEmailEvent(payload: TriggerEmailPayload): Promise<void> {
  if (!payload.recipient || !payload.recipient.includes("@")) {
    return;
  }

  try {
    fetch("/api/emails/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn("[Background Email Dispatch Warn]:", err);
    });
  } catch (e) {
    console.warn("[Background Email Dispatch Warn]:", e);
  }
}
