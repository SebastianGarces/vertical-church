import { render } from "@react-email/components";
import {
  PlanVisitNotificationEmail,
  type PlanVisitNotificationData,
} from "@/emails/plan-visit-notification";
import {
  SmallGroupInterestNotificationEmail,
  type SmallGroupInterestNotificationData,
} from "@/emails/small-group-interest-notification";
import {
  WantToServeNotificationEmail,
  type WantToServeNotificationData,
} from "@/emails/want-to-serve-notification";
import {
  ContactFormNotificationEmail,
  type ContactFormNotificationData,
} from "@/emails/contact-form-notification";
import { Resend } from "resend";

const MAX_RETRIES = 3;
const RETRYABLE_ERROR_NAMES = [
  "rate_limit_exceeded",
  "application_error",
  "internal_server_error",
] as const;

/**
 * Configuration for a notification email type.
 */
interface NotificationConfig<T> {
  /** Identifier used for tags and idempotency key prefix */
  emailType: string;
  /** Environment variable name containing comma-separated recipient emails */
  recipientsEnvVar: string;
  /** Human-readable name for error messages */
  flowName: string;
  /** Generate subject line from form data */
  getSubject: (data: T) => string;
  /** Render the React email component */
  renderEmail: (data: T) => React.ReactElement;
  /** Additional recipients to include (e.g., team-specific emails) */
  additionalRecipients?: string[];
}

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
  const emails = value
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (emails.length === 0) {
    throw new Error(
      `${flowName} notification recipients not configured: ${envVar} is empty`
    );
  }
  return emails;
}

function isRetryableError(error: { name?: string }): boolean {
  return (
    !!error.name &&
    RETRYABLE_ERROR_NAMES.includes(
      error.name as (typeof RETRYABLE_ERROR_NAMES)[number]
    )
  );
}

/**
 * Generic notification sender with idempotency, retries, and plain-text fallback.
 * Per email-best-practices / resend send-email: idempotency key per send, exponential backoff
 * for 429/5xx, tags for tracking, optional reply_to for deliverability.
 */
async function sendNotification<T>(
  config: NotificationConfig<T>,
  data: T
): Promise<{ success: true }> {
  const apiKey = getResendApiKey();
  const baseRecipients = getRecipientsFromEnv(
    config.recipientsEnvVar,
    config.flowName
  );
  // Merge base recipients with any additional team-specific recipients
  const recipients = [
    ...new Set([...baseRecipients, ...(config.additionalRecipients ?? [])]),
  ];
  const resend = new Resend(apiKey);

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";
  const replyTo = process.env.RESEND_REPLY_TO?.trim() || undefined;

  const subject = config.getSubject(data);
  const reactElement = config.renderEmail(data);
  const text = await render(reactElement, { plainText: true });

  const payload = {
    from,
    to: recipients,
    subject,
    react: reactElement,
    text,
    ...(replyTo && { reply_to: [replyTo] }),
    tags: [{ name: "email_type", value: config.emailType }],
  };

  const idempotencyKey = `${config.emailType}/${crypto.randomUUID()}`;

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
 * Generic email sender for auth-related emails (password reset, etc.)
 */
export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}): Promise<{ success: true }> {
  const apiKey = getResendApiKey();
  const resend = new Resend(apiKey);

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";
  const text = await render(react, { plainText: true });

  const payload = {
    from,
    to,
    subject,
    react,
    text,
    tags: [{ name: "email_type", value: "auth" }],
  };

  const idempotencyKey = `auth/${crypto.randomUUID()}`;

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
 * Send Plan Your Visit notification email.
 */
export async function sendPlanVisitNotification(
  data: PlanVisitNotificationData
): Promise<{ success: true }> {
  return sendNotification(
    {
      emailType: "plan-visit-notification",
      recipientsEnvVar: "PLAN_VISIT_NOTIFY_EMAILS",
      flowName: "Plan Visit",
      getSubject: (d) => `Plan Your Visit: ${d.firstName} ${d.lastName}`,
      renderEmail: (d) => PlanVisitNotificationEmail({ formData: d }),
    },
    data
  );
}

/**
 * Send Small Group Interest notification email.
 */
export async function sendSmallGroupInterestNotification(
  data: SmallGroupInterestNotificationData
): Promise<{ success: true }> {
  return sendNotification(
    {
      emailType: "small-group-interest-notification",
      recipientsEnvVar: "SMALL_GROUP_NOTIFY_EMAILS",
      flowName: "Small Group Interest",
      getSubject: (d) => `Small Group Interest: ${d.firstName} ${d.lastName}`,
      renderEmail: (d) => SmallGroupInterestNotificationEmail({ formData: d }),
    },
    data
  );
}

/**
 * Send Want To Serve notification email.
 * @param data - Form submission data
 * @param teamEmails - Optional team-specific notification emails
 */
export async function sendWantToServeNotification(
  data: WantToServeNotificationData,
  teamEmails?: string[]
): Promise<{ success: true }> {
  return sendNotification(
    {
      emailType: "want-to-serve-notification",
      recipientsEnvVar: "WANT_TO_SERVE_NOTIFY_EMAILS",
      flowName: "Want To Serve",
      getSubject: (d) => `Want to Serve: ${d.firstName} ${d.lastName}`,
      renderEmail: (d) => WantToServeNotificationEmail({ formData: d }),
      additionalRecipients: teamEmails,
    },
    data
  );
}

/**
 * Send Contact Form notification email.
 */
export async function sendContactFormNotification(
  data: ContactFormNotificationData
): Promise<{ success: true }> {
  return sendNotification(
    {
      emailType: "contact-form-notification",
      recipientsEnvVar: "CONTACT_FORM_NOTIFY_EMAILS",
      flowName: "Contact Form",
      getSubject: (d) => `Contact Form: ${d.firstName} ${d.lastName}`,
      renderEmail: (d) => ContactFormNotificationEmail({ formData: d }),
    },
    data
  );
}
