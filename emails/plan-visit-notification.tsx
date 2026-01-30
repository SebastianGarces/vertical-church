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

export interface PlanVisitFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  attendees: string;
  hasKids: string;
  wantsContact: string;
  questions: string;
}

export interface PlanningCenterStatus {
  personCreated: boolean;
  emailAdded: boolean;
  phoneAdded: boolean;
}

export interface PlanVisitNotificationData extends PlanVisitFormData {
  planningCenterPersonCreated: "Succeeded" | "Failed";
  planningCenterEmailAdded: "Succeeded" | "Failed";
  planningCenterPhoneAdded: "Succeeded" | "Failed";
}

interface PlanVisitNotificationEmailProps {
  formData: PlanVisitNotificationData;
}

const fieldLabels: Record<keyof PlanVisitFormData, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  attendees: "Number of attendees",
  hasKids: "Bringing kids?",
  wantsContact: "Wants contact before visit?",
  questions: "Questions / notes",
};

export function PlanVisitNotificationEmail({ formData }: PlanVisitNotificationEmailProps) {
  const preview = `Plan Your Visit: ${formData.firstName} ${formData.lastName}`;
  return <PlanVisitNotificationEmailInner formData={formData} preview={preview} />;
}

function PlanVisitNotificationEmailInner({
  formData,
  preview,
}: PlanVisitNotificationEmailProps & { preview: string }) {

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New &quot;Plan Your Visit&quot; Submission</Heading>
          <Text style={intro}>
            Someone submitted the Plan Your Visit form. Details below.
          </Text>
          <Hr style={hr} />
          <Section style={section}>
            {(Object.keys(fieldLabels) as (keyof PlanVisitFormData)[]).map((key) => {
              const value = formData[key]?.trim();
              if (value === undefined || value === "") return null;
              return (
                <Text key={key} style={row}>
                  <strong>{fieldLabels[key]}:</strong> {value}
                </Text>
              );
            })}
          </Section>
          <Hr style={hr} />
          <Section style={section}>
            <Text style={subsectionLabel}>Planning Center</Text>
            <Text style={row}>
              <strong>Person added to Planning Center:</strong>{" "}
              {formData.planningCenterPersonCreated}
            </Text>
            <Text style={row}>
              <strong>Email added to Planning Center:</strong>{" "}
              {formData.planningCenterEmailAdded}
            </Text>
            <Text style={row}>
              <strong>Phone added to Planning Center:</strong>{" "}
              {formData.planningCenterPhoneAdded}
            </Text>
          </Section>
          <Hr style={hr} />
          {/* Footer as raw HTML to test clipping; no React Email Text/Section wrapper */}
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<p style="color:#8898aa;font-size:12px;margin:24px 0 0">Vertical Church – Plan Your Visit</p>',
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

export default PlanVisitNotificationEmail;

const defaultFormData: PlanVisitNotificationData = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "(555) 123-4567",
  attendees: "2 people",
  hasKids: "yes",
  wantsContact: "yes",
  questions: "What time does service start?",
  planningCenterPersonCreated: "Succeeded",
  planningCenterEmailAdded: "Succeeded",
  planningCenterPhoneAdded: "Succeeded",
};

PlanVisitNotificationEmail.PreviewProps = {
  formData: defaultFormData,
} satisfies PlanVisitNotificationEmailProps;
