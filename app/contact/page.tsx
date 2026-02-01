import type { Metadata } from "next";
import { ContactPageClient } from "./components";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Vertical Church. We'd love to hear from you. Reach us by phone, email, or visit us at our North Ridgeville location.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
