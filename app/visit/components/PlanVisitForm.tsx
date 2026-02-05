"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { submitPlanVisitForm } from "@/app/visit/actions";

// Zod schema for Step 1 validation
const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  attendees: string;
  hasKids: string;
  wantsContact: string;
  questions: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  attendees: "",
  hasKids: "",
  wantsContact: "",
  questions: "",
};

export function PlanVisitForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Spam protection: honeypot field and form load timestamp
  const [honeypot, setHoneypot] = useState("");
  const formLoadedAt = useRef(Date.now());

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = (): boolean => {
    const result = step1Schema.safeParse({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    });

    if (!result.success) {
      const errors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        errors[field] = issue.message;
      });
      setFormErrors(errors);
      return false;
    }

    setFormErrors({});
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    const result = await submitPlanVisitForm({
      ...formData,
      honeypot,
      formLoadedAt: formLoadedAt.current,
    });
    setIsSubmitting(false);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setSubmitError(result.error);
    }
  };

  const isStep1Valid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.email.trim() !== "";
  const isStep2Valid = formData.attendees !== "" && formData.hasKids !== "";
  const isStep3Valid = formData.wantsContact !== "";

  if (isSubmitted) {
    return <ThankYouState onReset={() => {
      setIsSubmitted(false);
      setFormData(initialFormData);
      setCurrentStep(1);
      setHoneypot("");
      formLoadedAt.current = Date.now();
    }} />;
  }

  return (
    <section className="bg-navy py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-sm uppercase tracking-[0.2em] text-florence">
            Let Us Know You&apos;re Coming
          </h2>
          <p className="mt-4 font-heading text-3xl font-bold uppercase tracking-wide text-pipper md:text-4xl">
            Plan Your Visit
          </p>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-pipper/60">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-pipper/20" />
        </div>

        {/* Form Container */}
        <div className="rounded-[20px] border-2 border-pipper/20 bg-navy/50 p-6 md:p-8">
          {/* Honeypot field - hidden from users, bots will fill it */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              opacity: 0,
              height: 0,
              overflow: "hidden",
            }}
          >
            <label htmlFor="visit-website">Website</label>
            <input
              type="text"
              id="visit-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>
          
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1
                key="step1"
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                isValid={isStep1Valid}
                errors={formErrors}
              />
            )}
            {currentStep === 2 && (
              <Step2
                key="step2"
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
                isValid={isStep2Valid}
              />
            )}
            {currentStep === 3 && (
              <Step3
                key="step3"
                formData={formData}
                updateFormData={updateFormData}
                onSubmit={handleSubmit}
                onBack={handleBack}
                isValid={isStep3Valid}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

interface StepProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
  isValid: boolean;
}

interface Step1Props extends StepProps {
  onNext: () => void;
  errors: FormErrors;
}

function Step1({ formData, updateFormData, onNext, isValid, errors }: Step1Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="font-heading text-xl font-semibold text-pipper">
          Contact Information
        </h3>
        <p className="mt-1 text-sm text-pipper/60">
          Let us know how to reach you
        </p>
      </div>

      <FieldGroup className="gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.firstName}>
            <FieldLabel htmlFor="firstName" className="text-pipper">
              First name <span className="text-florence">*</span>
            </FieldLabel>
            <Input
              id="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => updateFormData("firstName", e.target.value)}
              aria-invalid={!!errors.firstName}
              className="border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40"
            />
            <FieldError className="text-red-400">{errors.firstName}</FieldError>
          </Field>

          <Field data-invalid={!!errors.lastName}>
            <FieldLabel htmlFor="lastName" className="text-pipper">
              Last name <span className="text-florence">*</span>
            </FieldLabel>
            <Input
              id="lastName"
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
              aria-invalid={!!errors.lastName}
              className="border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40"
            />
            <FieldError className="text-red-400">{errors.lastName}</FieldError>
          </Field>
        </div>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email" className="text-pipper">
            Email <span className="text-florence">*</span>
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            aria-invalid={!!errors.email}
            className="border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40"
          />
          <FieldError className="text-red-400">{errors.email}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="phone" className="text-pipper">
            Phone <span className="text-pipper/40">(optional)</span>
          </FieldLabel>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 555-5555"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            className="border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40"
          />
        </Field>
      </FieldGroup>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="inline-flex items-center justify-center rounded-md bg-florence px-8 py-3 font-button text-sm font-bold uppercase tracking-[0.2em] text-pipper transition-all duration-200 hover:bg-florence/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}

function Step2({ formData, updateFormData, onNext, onBack, isValid }: StepProps & { onNext: () => void; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="font-heading text-xl font-semibold text-pipper">
          Visit Details
        </h3>
        <p className="mt-1 text-sm text-pipper/60">
          Help us prepare for your visit
        </p>
      </div>

      <FieldGroup className="gap-6">
        <Field>
          <FieldLabel className="text-pipper">
            How many people will attend? <span className="text-florence">*</span>
          </FieldLabel>
          <Select
            value={formData.attendees}
            onValueChange={(value) => updateFormData("attendees", value)}
          >
            <SelectTrigger className="border-pipper/30 bg-navy/50 text-pipper">
              <SelectValue placeholder="Select number of attendees" />
            </SelectTrigger>
            <SelectContent className="border-pipper/30 bg-navy text-pipper">
              <SelectItem value="1">Just me</SelectItem>
              <SelectItem value="2">2 people</SelectItem>
              <SelectItem value="3">3 people</SelectItem>
              <SelectItem value="4">4 people</SelectItem>
              <SelectItem value="5">5 people</SelectItem>
              <SelectItem value="6+">6 or more</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel className="text-pipper">
            Will you have kids with you? <span className="text-florence">*</span>
          </FieldLabel>
          <RadioGroup
            value={formData.hasKids}
            onValueChange={(value) => updateFormData("hasKids", value)}
            className="flex gap-6"
          >
            <Field orientation="horizontal">
              <RadioGroupItem
                value="yes"
                id="kids-yes"
                className="border-pipper/50 text-florence"
              />
              <FieldLabel htmlFor="kids-yes" className="cursor-pointer text-pipper">
                Yes
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem
                value="no"
                id="kids-no"
                className="border-pipper/50 text-florence"
              />
              <FieldLabel htmlFor="kids-no" className="cursor-pointer text-pipper">
                No
              </FieldLabel>
            </Field>
          </RadioGroup>
          {formData.hasKids === "yes" && (
            <FieldDescription className="text-pipper/60">
              Great! Our Vertical Kids ministry has programs for toddlers through 6th grade.
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-md border-2 border-pipper/30 bg-transparent px-6 py-3 font-button text-sm font-bold uppercase tracking-[0.2em] text-pipper transition-all duration-200 hover:border-pipper/50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="inline-flex items-center justify-center rounded-md bg-florence px-8 py-3 font-button text-sm font-bold uppercase tracking-[0.2em] text-pipper transition-all duration-200 hover:bg-florence/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}

function Step3({
  formData,
  updateFormData,
  onSubmit,
  onBack,
  isValid,
  isSubmitting,
  submitError,
}: StepProps & {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="font-heading text-xl font-semibold text-pipper">
          Communication Preferences
        </h3>
        <p className="mt-1 text-sm text-pipper/60">
          Let us know how we can help
        </p>
      </div>

      {submitError && (
        <div
          role="alert"
          className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {submitError}
        </div>
      )}

      <FieldGroup className="gap-6">
        <Field>
          <FieldLabel className="text-pipper">
            Would you like someone to contact you before your visit?{" "}
            <span className="text-florence">*</span>
          </FieldLabel>
          <RadioGroup
            value={formData.wantsContact}
            onValueChange={(value) => updateFormData("wantsContact", value)}
            className="flex gap-6"
          >
            <Field orientation="horizontal">
              <RadioGroupItem
                value="yes"
                id="contact-yes"
                className="border-pipper/50 text-florence"
              />
              <FieldLabel htmlFor="contact-yes" className="cursor-pointer text-pipper">
                Yes, please reach out
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem
                value="no"
                id="contact-no"
                className="border-pipper/50 text-florence"
              />
              <FieldLabel htmlFor="contact-no" className="cursor-pointer text-pipper">
                No, I&apos;ll just show up
              </FieldLabel>
            </Field>
          </RadioGroup>
        </Field>

        <Field>
          <FieldLabel htmlFor="questions" className="text-pipper">
            Any questions for us? <span className="text-pipper/40">(optional)</span>
          </FieldLabel>
          <Textarea
            id="questions"
            placeholder="Feel free to ask us anything..."
            value={formData.questions}
            onChange={(e) => updateFormData("questions", e.target.value)}
            rows={4}
            className="border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40"
          />
        </Field>
      </FieldGroup>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md border-2 border-pipper/30 bg-transparent px-6 py-3 font-button text-sm font-bold uppercase tracking-[0.2em] text-pipper transition-all duration-200 hover:border-pipper/50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-florence px-8 py-3 font-button text-sm font-bold uppercase tracking-[0.2em] text-pipper transition-all duration-200 hover:bg-florence/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </motion.div>
  );
}

function ThankYouState({ onReset }: { onReset: () => void }) {
  return (
    <section className="bg-navy py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] border-2 border-florence/30 bg-navy/50 p-8 text-center md:p-12"
        >
          <div className="mb-6 text-6xl">🎉</div>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-pipper md:text-4xl">
            Thank You!
          </h2>
          <p className="mx-auto mt-6 max-w-md font-body text-lg leading-relaxed text-pipper/80">
            We&apos;re so excited that you&apos;ve decided to join us at Vertical Church. 
            Our community can&apos;t wait to welcome you and get to know you.
          </p>
          <p className="mt-4 font-heading text-xl font-semibold text-florence">
            See you Sunday!
          </p>
          <button
            onClick={onReset}
            className="mt-8 inline-flex items-center justify-center rounded-md border-2 border-pipper/30 bg-transparent px-6 py-3 font-button text-sm font-bold uppercase tracking-[0.2em] text-pipper transition-all duration-200 hover:border-pipper/50"
          >
            Plan Another Visit
          </button>
        </motion.div>
      </div>
    </section>
  );
}
