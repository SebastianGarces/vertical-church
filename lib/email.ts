import { render } from "@react-email/components";
import {
  PlanVisitNotificationEmail,
  type PlanVisitNotificationData,
} from "@/emails/plan-visit-notification";
import { Resend } from "resend";

const MAX_RETRIES = 3;
const RETRYABLE_ERROR_NAMES = [
  "rate_limit_exceeded",
  "application_error",
  "internal_server_error",
] as const;

function getResendApiKey(): string {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return key;
}

/**
 * Get notification recipient emails from env.
 * Uses PLAN_VISIT_NOTIFY_EMAIL_1, PLAN_VISIT_NOTIFY_EMAIL_2, PLAN_VISIT_NOTIFY_EMAIL_3, or
 * PLAN_VISIT_NOTIFY_EMAIL (comma-separated).
 */
function getNotificationRecipients(): string[] {
  const one = process.env.PLAN_VISIT_NOTIFY_EMAIL_1?.trim();
  const two = process.env.PLAN_VISIT_NOTIFY_EMAIL_2?.trim();
  const three = process.env.PLAN_VISIT_NOTIFY_EMAIL_3?.trim();
  const fromEnv = [one, two, three].filter((e): e is string => e !== undefined);
  if (fromEnv.length > 0) return fromEnv;
  const combined = process.env.PLAN_VISIT_NOTIFY_EMAIL?.trim();
  if (combined) {
    return combined.split(",").map((e) => e.trim()).filter(Boolean);
  }
  throw new Error(
    "Plan Visit notification recipients not configured: set PLAN_VISIT_NOTIFY_EMAIL_1, PLAN_VISIT_NOTIFY_EMAIL_2, PLAN_VISIT_NOTIFY_EMAIL_3, or PLAN_VISIT_NOTIFY_EMAIL (comma-separated)"
  );
}

function isRetryableError(error: { name?: string }): boolean {
  return (
    !!error.name &&
    RETRYABLE_ERROR_NAMES.includes(error.name as (typeof RETRYABLE_ERROR_NAMES)[number])
  );
}

/**
 * Send Plan Your Visit notification email with idempotency, retries, and plain-text fallback.
 * Per email-best-practices / resend send-email: idempotency key per send, exponential backoff
 * for 429/5xx, tags for tracking, optional reply_to for deliverability.
 */
export async function sendPlanVisitNotification(
  data: PlanVisitNotificationData
): Promise<{ success: true }> {
  const apiKey = getResendApiKey();
  const recipients = getNotificationRecipients();
  const resend = new Resend(apiKey);

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";
  const replyTo = process.env.RESEND_REPLY_TO?.trim() || undefined;

  const subject = `Plan Your Visit: ${data.firstName} ${data.lastName}`;
  const reactElement = PlanVisitNotificationEmail({ formData: data });

  const text = await render(reactElement, { plainText: true });

  const payload = {
    from,
    to: recipients,
    subject,
    react: reactElement,
    text,
    ...(replyTo && { reply_to: [replyTo] }),
    tags: [
      { name: "email_type", value: "plan-visit-notification" },
    ],
  };

  const idempotencyKey = `plan-visit-notification/${crypto.randomUUID()}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const { data: result, error } = await resend.emails.send(
      payload,
      { idempotencyKey }
    );

    if (!error) {
      return { success: true };
    }

    if (!isRetryableError(error) || attempt === MAX_RETRIES) {
      throw new Error(`Resend send failed: ${error.message}`);
    }

    const delayMs = Math.pow(2, attempt) * 1000;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error("Resend send failed after retries");
}
