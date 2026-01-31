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

export interface WantToServeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceInterests: string[];
}

export interface WantToServeNotificationData extends WantToServeFormData {
  isExistingPerson: boolean;
  planningCenterStatus: "Found" | "Created" | "Failed";
  planningCenterEmailAdded: "Succeeded" | "Failed" | "N/A";
  planningCenterPhoneAdded: "Succeeded" | "Failed" | "N/A";
}

interface WantToServeNotificationEmailProps {
  formData: WantToServeNotificationData;
}

const fieldLabels: Record<keyof WantToServeFormData, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  serviceInterests: "Service interests",
};

export function WantToServeNotificationEmail({
  formData,
}: WantToServeNotificationEmailProps) {
  const preview = `Want to Serve: ${formData.firstName} ${formData.lastName}`;
  return <WantToServeNotificationEmailInner formData={formData} preview={preview} />;
}

function WantToServeNotificationEmailInner({
  formData,
  preview,
}: WantToServeNotificationEmailProps & { preview: string }) {
  const pcoStatusLabel = formData.isExistingPerson
    ? "Existing person in Planning Center"
    : "New person added to Planning Center";

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New &quot;Want to Serve&quot; Submission</Heading>
          <Text style={intro}>
            Someone submitted the Want to Serve form. Details below.
          </Text>
          <Hr style={hr} />
          <Section style={section}>
            {(
              ["firstName", "lastName", "email", "phone"] as (keyof WantToServeFormData)[]
            ).map((key) => {
              const value = (formData[key] as string | undefined)?.trim();
              if (value === undefined || value === "") return null;
              return (
                <Text key={key} style={row}>
                  <strong>{fieldLabels[key]}:</strong> {value}
                </Text>
              );
            })}
            <Text style={row}>
              <strong>{fieldLabels.serviceInterests}:</strong>{" "}
              {(formData.serviceInterests ?? []).join(", ")}
            </Text>
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
                '<p style="color:#8898aa;font-size:12px;margin:24px 0 0">Vertical Church – Want to Serve</p>',
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

const subsectionLabel = {
  color: "#4a5568",
  fontSize: "12px",
  fontWeight: "bold" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 8px",
};

export default WantToServeNotificationEmail;

const defaultFormData: WantToServeNotificationData = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "(555) 123-4567",
  serviceInterests: ["Guest Services", "Tech Team"],
  isExistingPerson: false,
  planningCenterStatus: "Created",
  planningCenterEmailAdded: "Succeeded",
  planningCenterPhoneAdded: "Succeeded",
};

WantToServeNotificationEmail.PreviewProps = {
  formData: defaultFormData,
} satisfies WantToServeNotificationEmailProps;

