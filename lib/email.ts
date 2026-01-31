import { render } from "@react-email/components";
import {
  PlanVisitNotificationEmail,
  type PlanVisitNotificationData,
} from "@/emails/plan-visit-notification";
import {
  SmallGroupInterestNotificationEmail,
  type SmallGroupInterestNotificationData,
} from "@/emails/small-group-interest-notification";
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
 * Get notification recipient emails from a comma-separated env var.
 */
function getRecipientsFromEnv(envVar: string, flowName: string): string[] {
  const value = process.env[envVar]?.trim();
  if (!value) {
    throw new Error(
      `${flowName} notification recipients not configured: set ${envVar} (comma-separated emails)`
    );
  }
  const emails = value.split(",").map((e) => e.trim()).filter(Boolean);
  if (emails.length === 0) {
    throw new Error(
      `${flowName} notification recipients not configured: ${envVar} is empty`
    );
  }
  return emails;
}

/**
 * Get Plan Visit notification recipient emails from env.
 */
function getPlanVisitRecipients(): string[] {
  return getRecipientsFromEnv("PLAN_VISIT_NOTIFY_EMAILS", "Plan Visit");
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
  const recipients = getPlanVisitRecipients();
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
    const { error } = await resend.emails.send(payload, { idempotencyKey });

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

/**
 * Get Small Group Interest notification recipient emails from env.
 */
function getSmallGroupRecipients(): string[] {
  return getRecipientsFromEnv("SMALL_GROUP_NOTIFY_EMAILS", "Small Group Interest");
}

/**
 * Send Small Group Interest notification email with idempotency, retries, and plain-text fallback.
 */
export async function sendSmallGroupInterestNotification(
  data: SmallGroupInterestNotificationData
): Promise<{ success: true }> {
  const apiKey = getResendApiKey();
  const recipients = getSmallGroupRecipients();
  const resend = new Resend(apiKey);

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";
  const replyTo = process.env.RESEND_REPLY_TO?.trim() || undefined;

  const subject = `Small Group Interest: ${data.firstName} ${data.lastName}`;
  const reactElement = SmallGroupInterestNotificationEmail({ formData: data });

  const text = await render(reactElement, { plainText: true });

  const payload = {
    from,
    to: recipients,
    subject,
    react: reactElement,
    text,
    ...(replyTo && { reply_to: [replyTo] }),
    tags: [{ name: "email_type", value: "small-group-interest-notification" }],
  };

  const idempotencyKey = `small-group-interest-notification/${crypto.randomUUID()}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const { error } = await resend.emails.send(payload, { idempotencyKey });

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
