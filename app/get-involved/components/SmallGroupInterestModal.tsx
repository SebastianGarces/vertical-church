"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  submitSmallGroupInterestForm,
  type SmallGroupInterestFormPayload,
} from "@/app/get-involved/actions";

// Zod schema for client-side validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: z.string().optional(),
  gender: z.enum(["Male", "Female"], "Please select your gender"),
  ageRange: z.string().min(1, "Please select your age range"),
  groupType: z.enum(["Coed", "Men's only", "Women's only"], "Please select your group type preference"),
  city: z.string().min(1, "City is required"),
  preferredDay: z.string().min(1, "Please select your preferred day"),
  needsKidsCare: z.enum(["Yes", "No"], "Please indicate if you need kids care"),
});

type FormData = z.infer<typeof formSchema>;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  ageRange?: string;
  groupType?: string;
  city?: string;
  preferredDay?: string;
  needsKidsCare?: string;
}

const initialFormData: Partial<FormData> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
};

const AGE_RANGES = ["18-25", "26-35", "36-45", "46-55", "56+"];
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface SmallGroupInterestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SmallGroupInterestModal({
  open,
  onOpenChange,
}: SmallGroupInterestModalProps) {
  const [formData, setFormData] = useState<Partial<FormData>>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    const submitResult = await submitSmallGroupInterestForm(
      result.data as SmallGroupInterestFormPayload
    );

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
    formData.gender &&
    formData.ageRange &&
    formData.groupType &&
    formData.city?.trim() &&
    formData.preferredDay &&
    formData.needsKidsCare;

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
              Our Small Group Coordinator, Cory Tutor, will reach out to help you find
              the perfect group for you.
            </p>
            <p className="mt-6 font-heading text-lg font-semibold text-florence">
              We&apos;re excited to connect you!
            </p>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-pipper/20 bg-navy sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-semibold text-pipper">
            Find a Small Group
          </DialogTitle>
          <DialogDescription className="text-pipper/60">
            Tell us about yourself so we can help match you with the right group.
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div
            role="alert"
            className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {submitError}
          </div>
        )}

        <div className="space-y-5">
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sg-firstName" className="text-pipper">
                  First name <span className="text-florence">*</span>
                </Label>
                <Input
                  id="sg-firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className={`border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40 focus:border-florence ${
                    formErrors.firstName ? "border-red-500" : ""
                  }`}
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-400">{formErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sg-lastName" className="text-pipper">
                  Last name <span className="text-florence">*</span>
                </Label>
                <Input
                  id="sg-lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  className={`border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40 focus:border-florence ${
                    formErrors.lastName ? "border-red-500" : ""
                  }`}
                />
                {formErrors.lastName && (
                  <p className="text-sm text-red-400">{formErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sg-email" className="text-pipper">
                  Email <span className="text-florence">*</span>
                </Label>
                <Input
                  id="sg-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className={`border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40 focus:border-florence ${
                    formErrors.email ? "border-red-500" : ""
                  }`}
                />
                {formErrors.email && (
                  <p className="text-sm text-red-400">{formErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sg-phone" className="text-pipper">
                  Phone <span className="text-pipper/40">(optional)</span>
                </Label>
                <Input
                  id="sg-phone"
                  type="tel"
                  placeholder="(555) 555-5555"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className="border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40 focus:border-florence"
                />
              </div>
            </div>
          </div>

          {/* Demographics */}
          <div className="space-y-4 border-t border-pipper/10 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-pipper">
                  Gender <span className="text-florence">*</span>
                </Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) =>
                    updateFormData("gender", value as "Male" | "Female")
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Male"
                      id="sg-gender-male"
                      className="border-pipper/50 text-florence"
                    />
                    <Label htmlFor="sg-gender-male" className="cursor-pointer text-pipper">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Female"
                      id="sg-gender-female"
                      className="border-pipper/50 text-florence"
                    />
                    <Label
                      htmlFor="sg-gender-female"
                      className="cursor-pointer text-pipper"
                    >
                      Female
                    </Label>
                  </div>
                </RadioGroup>
                {formErrors.gender && (
                  <p className="text-sm text-red-400">{formErrors.gender}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-pipper">
                  Age range <span className="text-florence">*</span>
                </Label>
                <Select
                  value={formData.ageRange}
                  onValueChange={(value) => updateFormData("ageRange", value)}
                >
                  <SelectTrigger
                    className={`border-pipper/30 bg-navy/50 text-pipper focus:border-florence ${
                      formErrors.ageRange ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent className="border-pipper/30 bg-navy text-pipper">
                    {AGE_RANGES.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.ageRange && (
                  <p className="text-sm text-red-400">{formErrors.ageRange}</p>
                )}
              </div>
            </div>
          </div>

          {/* Group Preferences */}
          <div className="space-y-4 border-t border-pipper/10 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-pipper">
                  Group type preference <span className="text-florence">*</span>
                </Label>
                <Select
                  value={formData.groupType}
                  onValueChange={(value) =>
                    updateFormData(
                      "groupType",
                      value as "Coed" | "Men's only" | "Women's only"
                    )
                  }
                >
                  <SelectTrigger
                    className={`border-pipper/30 bg-navy/50 text-pipper focus:border-florence ${
                      formErrors.groupType ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                  <SelectContent className="border-pipper/30 bg-navy text-pipper">
                    <SelectItem value="Coed">Coed</SelectItem>
                    <SelectItem value="Men's only">Men&apos;s only</SelectItem>
                    <SelectItem value="Women's only">Women&apos;s only</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.groupType && (
                  <p className="text-sm text-red-400">{formErrors.groupType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sg-city" className="text-pipper">
                  City <span className="text-florence">*</span>
                </Label>
                <Input
                  id="sg-city"
                  type="text"
                  placeholder="Your city"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  className={`border-pipper/30 bg-navy/50 text-pipper placeholder:text-pipper/40 focus:border-florence ${
                    formErrors.city ? "border-red-500" : ""
                  }`}
                />
                {formErrors.city && (
                  <p className="text-sm text-red-400">{formErrors.city}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-pipper">
                  Preferred day <span className="text-florence">*</span>
                </Label>
                <Select
                  value={formData.preferredDay}
                  onValueChange={(value) => updateFormData("preferredDay", value)}
                >
                  <SelectTrigger
                    className={`border-pipper/30 bg-navy/50 text-pipper focus:border-florence ${
                      formErrors.preferredDay ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent className="border-pipper/30 bg-navy text-pipper">
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.preferredDay && (
                  <p className="text-sm text-red-400">{formErrors.preferredDay}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-pipper">
                  Need kids care? <span className="text-florence">*</span>
                </Label>
                <RadioGroup
                  value={formData.needsKidsCare}
                  onValueChange={(value) =>
                    updateFormData("needsKidsCare", value as "Yes" | "No")
                  }
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Yes"
                      id="sg-kids-yes"
                      className="border-pipper/50 text-florence"
                    />
                    <Label htmlFor="sg-kids-yes" className="cursor-pointer text-pipper">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="No"
                      id="sg-kids-no"
                      className="border-pipper/50 text-florence"
                    />
                    <Label htmlFor="sg-kids-no" className="cursor-pointer text-pipper">
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {formErrors.needsKidsCare && (
                  <p className="text-sm text-red-400">{formErrors.needsKidsCare}</p>
                )}
              </div>
            </div>
          </div>
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
      </DialogContent>
    </Dialog>
  );
}
