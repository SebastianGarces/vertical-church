"use server";

import { z } from "zod";
import { createPerson } from "@/lib/planning-center";
import { sendPlanVisitNotification } from "@/lib/email";
import { validateSubmission } from "@/lib/spam-protection";

const planVisitFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z.string().optional(),
  attendees: z.string().min(1, "Attendees is required"),
  hasKids: z.string().min(1, "Please indicate if you have kids"),
  wantsContact: z.string().min(1, "Please indicate contact preference"),
  questions: z.string().optional(),
  honeypot: z.string().optional(),
  formLoadedAt: z.number().optional(),
});

export type PlanVisitFormPayload = z.infer<typeof planVisitFormSchema>;

export type SubmitPlanVisitResult =
  | { success: true }
  | { success: false; error: string };

const USER_FACING_ERROR =
  "Something went wrong. Please try again or contact the church office.";

/**
 * Submit Plan Your Visit form: validate for spam, attempt to create person in Planning Center
 * (never errors out on PCO failure), then always send notification email with form data
 * and Planning Center status (person added, email added, phone added).
 */
export async function submitPlanVisitForm(
  payload: PlanVisitFormPayload
): Promise<SubmitPlanVisitResult> {
  const parsed = planVisitFormSchema.safeParse(payload);
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
    message: formData.questions,
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

  const pcoResult = await createPerson({
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim(),
    phone: formData.phone?.trim() || undefined,
  });

  try {
    await sendPlanVisitNotification({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone ?? "",
      attendees: formData.attendees,
      hasKids: formData.hasKids,
      wantsContact: formData.wantsContact,
      questions: formData.questions ?? "",
      planningCenterPersonCreated: pcoResult.personCreated ? "Succeeded" : "Failed",
      planningCenterEmailAdded: pcoResult.emailAdded ? "Succeeded" : "Failed",
      planningCenterPhoneAdded: pcoResult.phoneAdded ? "Succeeded" : "Failed",
    });
  } catch (err) {
    console.error("Resend notification failed:", err);
    return { success: false, error: USER_FACING_ERROR };
  }

  return { success: true };
}
