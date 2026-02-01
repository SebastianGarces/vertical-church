import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactFormNotificationData extends ContactFormData {
  isExistingPerson: boolean;
  planningCenterStatus: "Found" | "Created" | "Failed";
  planningCenterEmailAdded: "Succeeded" | "Failed" | "N/A";
  planningCenterPhoneAdded: "Succeeded" | "Failed" | "N/A";
}

interface ContactFormNotificationEmailProps {
  formData: ContactFormNotificationData;
}

const fieldLabels: Record<keyof ContactFormData, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  message: "Message",
};

export function ContactFormNotificationEmail({
  formData,
}: ContactFormNotificationEmailProps) {
  const preview = `Contact Form: ${formData.firstName} ${formData.lastName}`;
  const pcoStatusLabel = formData.isExistingPerson
    ? "Existing person in Planning Center"
    : "New person added to Planning Center";

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>
          <Text style={intro}>
            Someone submitted the contact form on the website. Details below.
          </Text>
          <Hr style={hr} />
          <Section style={section}>
            {(Object.keys(fieldLabels) as (keyof ContactFormData)[]).map(
              (key) => {
                const value = formData[key]?.trim();
                if (value === undefined || value === "") return null;
                return (
                  <Text key={key} style={key === "message" ? messageRow : row}>
                    <strong>{fieldLabels[key]}:</strong>{" "}
                    {key === "message" ? (
                      <span style={messageText}>{value}</span>
                    ) : (
                      value
                    )}
                  </Text>
                );
              }
            )}
          </Section>
          <Hr style={hr} />
          <Section style={section}>
            <Text style={subsectionLabel}>Planning Center</Text>
            <Text style={row}>
              <strong>Status:</strong> {pcoStatusLabel} ({formData.planningCenterStatus})
            </Text>
            {formData.planningCenterEmailAdded !== "N/A" && (
              <Text style={row}>
                <strong>Email added/verified:</strong> {formData.planningCenterEmailAdded}
              </Text>
            )}
            {formData.planningCenterPhoneAdded !== "N/A" && (
              <Text style={row}>
                <strong>Phone added/verified:</strong> {formData.planningCenterPhoneAdded}
              </Text>
            )}
          </Section>
          <Hr style={hr} />
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<p style="color:#8898aa;font-size:12px;margin:24px 0 0">Vertical Church – Contact Form</p>',
            }}
          />
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "24px",
  marginBottom: "64px",
  maxWidth: "560px",
};

const h1 = {
  color: "#1a1a2e",
  fontSize: "24px",
  fontWeight: "bold" as const,
  margin: "0 0 16px",
};

const intro = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const section = {
  margin: "0 0 24px",
};

const row = {
  color: "#1a1a2e",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 8px",
};

const messageRow = {
  color: "#1a1a2e",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "16px 0 0",
};

const messageText = {
  display: "block",
  marginTop: "8px",
  whiteSpace: "pre-wrap" as const,
};

const subsectionLabel = {
  color: "#4a5568",
  fontSize: "12px",
  fontWeight: "bold" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 8px",
};

export default ContactFormNotificationEmail;

const defaultFormData: ContactFormNotificationData = {
  firstName: "John",
  lastName: "Smith",
  email: "john@example.com",
  phone: "(555) 123-4567",
  message: "I have a question about your church services and would love to learn more about getting involved.",
  isExistingPerson: false,
  planningCenterStatus: "Created",
  planningCenterEmailAdded: "Succeeded",
  planningCenterPhoneAdded: "Succeeded",
};

ContactFormNotificationEmail.PreviewProps = {
  formData: defaultFormData,
} satisfies ContactFormNotificationEmailProps;
