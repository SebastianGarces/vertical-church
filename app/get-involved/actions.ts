"use server";

import { z } from "zod";
import { findOrCreatePerson } from "@/lib/planning-center";
import {
  sendSmallGroupInterestNotification,
  sendWantToServeNotification,
} from "@/lib/email";

const smallGroupInterestFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z.string().optional(),
  gender: z.enum(["Male", "Female"], "Please select your gender"),
  ageRange: z.string().min(1, "Please select your age range"),
  groupType: z.enum(["Coed", "Men's only", "Women's only"], "Please select your group type preference"),
  city: z.string().min(1, "City is required"),
  preferredDay: z.string().min(1, "Please select your preferred day"),
  needsKidsCare: z.enum(["Yes", "No"], "Please indicate if you need kids care"),
});

export type SmallGroupInterestFormPayload = z.infer<typeof smallGroupInterestFormSchema>;

export type SubmitSmallGroupInterestResult =
  | { success: true }
  | { success: false; error: string };

const USER_FACING_ERROR =
  "Something went wrong. Please try again or contact the church office.";

/**
 * Submit Small Group Interest form: search for existing person in Planning Center
 * (create if not found, update email/phone if missing), then send notification email.
 */
export async function submitSmallGroupInterestForm(
  payload: SmallGroupInterestFormPayload
): Promise<SubmitSmallGroupInterestResult> {
  const parsed = smallGroupInterestFormSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Invalid form data" };
  }

  const formData = parsed.data;

  const pcoResult = await findOrCreatePerson({
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim(),
    phone: formData.phone?.trim() || undefined,
  });

  try {
    await sendSmallGroupInterestNotification({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone ?? "",
      gender: formData.gender,
      ageRange: formData.ageRange,
      groupType: formData.groupType,
      city: formData.city,
      preferredDay: formData.preferredDay,
      needsKidsCare: formData.needsKidsCare,
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
    console.error("Resend notification failed:", err);
    return { success: false, error: USER_FACING_ERROR };
  }

  return { success: true };
}

const wantToServeFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z.string().optional(),
  serviceInterests: z
    .array(z.string())
    .min(1, "Please select at least one service interest"),
});

export type WantToServeFormPayload = z.infer<typeof wantToServeFormSchema>;

export type SubmitWantToServeResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Submit Want To Serve form: search for existing person in Planning Center
 * (create if not found, update email/phone if missing), then send notification email.
 */
export async function submitWantToServeForm(
  payload: WantToServeFormPayload
): Promise<SubmitWantToServeResult> {
  const parsed = wantToServeFormSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Invalid form data" };
  }

  const formData = parsed.data;

  const pcoResult = await findOrCreatePerson({
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim(),
    phone: formData.phone?.trim() || undefined,
  });

  try {
    await sendWantToServeNotification({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone ?? "",
      serviceInterests: formData.serviceInterests,
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
    console.error("Resend notification failed:", err);
    return { success: false, error: USER_FACING_ERROR };
  }

  return { success: true };
}
