"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { z } from "zod";
import { MapPin, Clock, Phone } from "lucide-react";
import { Footer } from "../components/Footer";
import { PartnersBanner } from "../components/PartnersBanner";
import { Header } from "../components/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { submitContactForm } from "./actions";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  message: z.string().min(1, "Message is required"),
});

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

function PageIntro() {
  return (
    <section className="bg-navy pt-32 pb-12 md:pt-40 md:pb-16">
      <div className="mx-auto max-w-[1080px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-3xl font-bold uppercase tracking-[0.05em] text-pipper md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
            Get in Touch
          </p>
          <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-pipper/80 md:text-lg">
            Have a question or want to learn more about Vertical Church? We&apos;d
            love to hear from you. Fill out the form below or use our contact
            information to reach us.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ContactInfo() {
  return (
    <section className="bg-navy pb-12 md:pb-16">
      <div className="mx-auto max-w-[1080px] px-4 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-lg border border-pipper/20 p-6"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-florence/20">
              <MapPin className="h-6 w-6 text-florence" />
            </div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-pipper">
              Meeting Address
            </h3>
            <Link
              href="https://maps.google.com/?q=5400+Lear+Nagle+Rd+North+Ridgeville+Ohio+44039"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block font-body text-base text-pipper/70 transition-colors hover:text-florence"
            >
              5400 Lear Nagle Rd
              <br />
              North Ridgeville, OH 44039
            </Link>
          </motion.div>

          {/* Service Times */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-lg border border-pipper/20 p-6"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-florence/20">
              <Clock className="h-6 w-6 text-florence" />
            </div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-pipper">
              Worship Gatherings
            </h3>
            <p className="mt-2 font-body text-base text-pipper/70">
              Sundays at 10am
            </p>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-lg border border-pipper/20 p-6"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-florence/20">
              <Phone className="h-6 w-6 text-florence" />
            </div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-pipper">
              Phone Number
            </h3>
            <Link
              href="tel:4404207335"
              className="mt-2 block font-body text-base text-pipper/70 transition-colors hover:text-florence"
            >
              440.420.7335
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = formSchema.safeParse(formData);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitError(null);
    setIsSubmitting(true);
    const result = await submitContactForm(formData);
    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setSubmitError(result.error);
    }
  };

  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.message.trim() !== "";

  if (isSubmitted) {
    return (
      <section className="bg-navy pb-16 md:pb-24">
        <div className="mx-auto max-w-[1080px] px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-pipper p-8 text-center md:p-12"
          >
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy md:text-3xl">
              Thank You!
            </h2>
            <p className="mx-auto mt-4 max-w-md font-body text-base leading-relaxed text-navy/70 md:text-lg">
              We&apos;ve received your message and will get back to you as soon
              as possible.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData(initialFormData);
              }}
              className="mt-8 inline-flex items-center justify-center border-2 border-navy bg-transparent px-6 py-3 font-button text-sm font-bold uppercase tracking-[0.2em] text-navy transition-all duration-200 hover:bg-navy/10"
            >
              Send Another Message
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-navy pb-16 md:pb-24">
      <div className="mx-auto max-w-[1080px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-lg bg-pipper p-6 md:p-10"
        >
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy md:text-3xl">
            Send Us a Message
          </h2>
          <p className="mt-2 font-body text-base text-navy/70">
            Fill out the form below and we&apos;ll get back to you soon.
          </p>

          {submitError && (
            <div
              role="alert"
              className="mt-6 rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-600"
            >
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8">
            <FieldGroup className="gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field data-invalid={!!formErrors.firstName}>
                  <FieldLabel htmlFor="firstName" className="text-navy">
                    First name <span className="text-florence">*</span>
                  </FieldLabel>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    aria-invalid={!!formErrors.firstName}
                    variant="light"
                  />
                  <FieldError className="text-red-600">{formErrors.firstName}</FieldError>
                </Field>

                <Field data-invalid={!!formErrors.lastName}>
                  <FieldLabel htmlFor="lastName" className="text-navy">
                    Last name <span className="text-florence">*</span>
                  </FieldLabel>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    aria-invalid={!!formErrors.lastName}
                    variant="light"
                  />
                  <FieldError className="text-red-600">{formErrors.lastName}</FieldError>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field data-invalid={!!formErrors.email}>
                  <FieldLabel htmlFor="email" className="text-navy">
                    Email <span className="text-florence">*</span>
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    aria-invalid={!!formErrors.email}
                    variant="light"
                  />
                  <FieldError className="text-red-600">{formErrors.email}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone" className="text-navy">
                    Phone <span className="text-navy/50">(optional)</span>
                  </FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 555-5555"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    variant="light"
                  />
                </Field>
              </div>

              <Field data-invalid={!!formErrors.message}>
                <FieldLabel htmlFor="message" className="text-navy">
                  Message <span className="text-florence">*</span>
                </FieldLabel>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => updateFormData("message", e.target.value)}
                  aria-invalid={!!formErrors.message}
                  variant="light"
                  rows={5}
                />
                <FieldError className="text-red-600">{formErrors.message}</FieldError>
              </Field>
            </FieldGroup>

            <div className="mt-8">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="inline-flex items-center justify-center border-2 border-navy bg-navy px-8 py-3 font-button text-base font-bold uppercase tracking-[0.2em] text-pipper transition-all duration-200 hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main className="pb-16 md:pb-24">
        <PageIntro />
        <ContactInfo />
        <ContactForm />
      </main>
      <PartnersBanner />
      <Footer />
    </div>
  );
}
