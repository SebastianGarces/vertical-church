"use server";

import { z } from "zod";
import { findOrCreatePerson } from "@/lib/planning-center";
import { sendContactFormNotification } from "@/lib/email";
import { validateSubmission } from "@/lib/spam-protection";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  honeypot: z.string().optional(),
  formLoadedAt: z.number().optional(),
});

export type ContactFormPayload = z.infer<typeof contactFormSchema>;

export type SubmitContactFormResult =
  | { success: true }
  | { success: false; error: string };

const USER_FACING_ERROR =
  "Something went wrong. Please try again or contact the church office.";

/**
 * Submit Contact Form: validate for spam, find or create person in Planning Center,
 * then send notification email with form data and PCO status.
 */
export async function submitContactForm(
  payload: ContactFormPayload
): Promise<SubmitContactFormResult> {
  const parsed = contactFormSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Invalid form data" };
  }

  const formData = parsed.data;

  // Spam protection validation
  const spamCheck = validateSubmission({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    message: formData.message,
    honeypot: formData.honeypot,
    formLoadedAt: formData.formLoadedAt,
  });

  if (!spamCheck.passed) {
    // Silent reject for bots - return success but don't create PCO record
    if (spamCheck.isSilentReject) {
      return { success: true };
    }
    // User-facing error for invalid input
    return { success: false, error: spamCheck.reason };
  }

  const pcoResult = await findOrCreatePerson({
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim(),
    phone: formData.phone?.trim() || undefined,
  });

  try {
    await sendContactFormNotification({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() ?? "",
      message: formData.message.trim(),
      isExistingPerson: pcoResult.isExisting,
      planningCenterStatus: pcoResult.success
        ? pcoResult.isExisting
          ? "Found"
          : "Created"
        : "Failed",
      planningCenterEmailAdded: pcoResult.success
        ? pcoResult.emailAdded
          ? "Succeeded"
          : "Failed"
        : "N/A",
      planningCenterPhoneAdded: formData.phone?.trim()
        ? pcoResult.success
          ? pcoResult.phoneAdded
            ? "Succeeded"
            : "Failed"
          : "N/A"
        : "N/A",
    });
  } catch (err) {
    console.error("Contact form notification failed:", err);
    return { success: false, error: USER_FACING_ERROR };
  }

  return { success: true };
}
