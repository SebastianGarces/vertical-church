"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldTitle,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import {
  submitWantToServeForm,
  type WantToServeFormPayload,
} from "@/app/get-involved/actions";
import { SERVE_TEAM_OPTIONS } from "./serve-teams-data";

// Zod schema for client-side validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: z.string().optional(),
  serviceInterests: z.array(z.string()).min(1, "Please select at least one service interest"),
});

type FormData = z.infer<typeof formSchema>;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  serviceInterests?: string;
}

const initialFormData: Partial<FormData> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  serviceInterests: [],
};

interface WantToServeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WantToServeModal({ open, onOpenChange }: WantToServeModalProps) {
  const [formData, setFormData] = useState<Partial<FormData>>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const serviceInterestIds = useMemo(() => {
    return SERVE_TEAM_OPTIONS.map((t) => ({
      ...t,
      id: `serve-interest-${t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    }));
  }, []);

  // Auto-close after success
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        onOpenChange(false);
        // Reset form after closing
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData(initialFormData);
          setFormErrors({});
        }, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, onOpenChange]);

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleServiceInterest = (title: string) => {
    const current = formData.serviceInterests ?? [];
    const next = current.includes(title)
      ? current.filter((t) => t !== title)
      : [...current, title];
    updateFormData("serviceInterests", next);
  };

  const handleSubmit = async () => {
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const errors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        errors[field] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    const submitResult = await submitWantToServeForm(result.data as WantToServeFormPayload);

    setIsSubmitting(false);

    if (submitResult.success) {
      setIsSubmitted(true);
    } else {
      setSubmitError(submitResult.error);
    }
  };

  const isFormValid =
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    formData.email?.trim() &&
    (formData.serviceInterests?.length ?? 0) > 0;

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-florence/30 bg-navy sm:max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="py-8 text-center"
          >
            <div className="mb-6 text-5xl">🎉</div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-pipper">
              Thank You!
            </h2>
            <p className="mx-auto mt-4 max-w-sm font-body text-base leading-relaxed text-pipper/80">
              We&apos;re grateful you want to serve. Someone from our team will reach out soon
              with next steps.
            </p>
            <p className="mt-6 font-heading text-lg font-semibold text-florence">
              We&apos;re excited to serve with you!
            </p>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden border-pipper/20 bg-navy p-0 sm:max-w-xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="font-heading text-xl font-semibold text-pipper">
            I Want to Serve
          </DialogTitle>
          <DialogDescription className="text-pipper/60">
            Tell us a bit about you and which teams you&apos;d like to explore.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-6 pb-6">
          {submitError && (
            <div
              role="alert"
              className="mb-5 rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {submitError}
            </div>
          )}

          <div className="space-y-5">
          <FieldGroup className="gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field data-invalid={!!formErrors.firstName}>
                <FieldLabel htmlFor="serve-firstName" className="text-pipper">
                  First name <span className="text-florence">*</span>
                </FieldLabel>
                <Input
                  id="serve-firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  aria-invalid={!!formErrors.firstName}
                  className="border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40"
                />
                <FieldError className="text-red-400">{formErrors.firstName}</FieldError>
              </Field>

              <Field data-invalid={!!formErrors.lastName}>
                <FieldLabel htmlFor="serve-lastName" className="text-pipper">
                  Last name <span className="text-florence">*</span>
                </FieldLabel>
                <Input
                  id="serve-lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  aria-invalid={!!formErrors.lastName}
                  className="border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40"
                />
                <FieldError className="text-red-400">{formErrors.lastName}</FieldError>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field data-invalid={!!formErrors.email}>
                <FieldLabel htmlFor="serve-email" className="text-pipper">
                  Email <span className="text-florence">*</span>
                </FieldLabel>
                <Input
                  id="serve-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  aria-invalid={!!formErrors.email}
                  className="border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40"
                />
                <FieldError className="text-red-400">{formErrors.email}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="serve-phone" className="text-pipper">
                  Phone <span className="text-pipper/40">(optional)</span>
                </FieldLabel>
                <Input
                  id="serve-phone"
                  type="tel"
                  placeholder="(555) 555-5555"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className="border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40"
                />
              </Field>
            </div>
          </FieldGroup>

          <Field
            data-invalid={!!formErrors.serviceInterests}
            className="space-y-3 border-t border-pipper/10 pt-4"
          >
            <div className="space-y-1">
              <FieldLabel className="text-pipper">
                Service interests <span className="text-florence">*</span>
              </FieldLabel>
              <FieldDescription className="text-pipper/60">
                Select one or more teams you&apos;re interested in.
              </FieldDescription>
              <FieldError className="text-red-400">{formErrors.serviceInterests}</FieldError>
            </div>

            <div className="space-y-3">
              {serviceInterestIds.map((team) => {
                const checked = (formData.serviceInterests ?? []).includes(team.title);
                return (
                  <FieldLabel
                    key={team.title}
                    className={`cursor-pointer border-pipper/20 bg-navy/40 transition-colors hover:border-florence/40 has-data-[state=checked]:border-florence/60 has-data-[state=checked]:bg-florence/5 ${
                      checked ? "border-florence/60" : ""
                    }`}
                  >
                    <Field orientation="horizontal">
                      <Checkbox
                        id={team.id}
                        checked={checked}
                        onCheckedChange={() => toggleServiceInterest(team.title)}
                        className="border-pipper/40 bg-navy/50 data-[state=checked]:border-florence data-[state=checked]:bg-florence data-[state=checked]:text-pipper"
                      />
                      <FieldContent>
                        <FieldTitle className="font-heading text-sm font-semibold uppercase tracking-wide text-pipper">
                          {team.title}
                        </FieldTitle>
                        <FieldDescription className="font-body text-sm text-pipper/60">
                          {team.description}
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                );
              })}
            </div>
          </Field>
        </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="inline-flex items-center justify-center rounded-md bg-florence px-8 py-3 font-button text-sm font-bold uppercase tracking-[0.2em] text-pipper transition-all duration-200 hover:bg-florence/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
