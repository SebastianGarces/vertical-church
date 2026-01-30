/**
 * Planning Center People API v2 client.
 * Creates a person and optionally adds primary email and phone.
 * Auth: Basic (PLANNING_CENTER_CLIENT_ID:PLANNING_CENTER_SECRET_KEY).
 * @see https://developer.planning.center/docs/#/apps/people/2025-11-10/vertices/person
 */

const DEFAULT_BASE_URL = "https://api.planningcenteronline.com";

export interface CreatePersonInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

function getBaseUrl(): string {
  const url = process.env.PLANNING_CENTER_URL?.trim();
  return url || DEFAULT_BASE_URL;
}

function getAuth(): { username: string; password: string } {
  const clientId = process.env.PLANNING_CENTER_CLIENT_ID;
  const secret = process.env.PLANNING_CENTER_SECRET_KEY;
  if (!clientId || !secret) {
    throw new Error(
      "Missing Planning Center credentials: PLANNING_CENTER_CLIENT_ID and PLANNING_CENTER_SECRET_KEY must be set"
    );
  }
  return { username: clientId, password: secret };
}

function basicAuthHeader(username: string, password: string): string {
  const encoded = Buffer.from(`${username}:${password}`, "utf-8").toString("base64");
  return `Basic ${encoded}`;
}

interface PCOPersonResponse {
  data?: {
    id: string;
    type: string;
    attributes?: Record<string, unknown>;
  };
}

export interface CreatePersonResult {
  personCreated: boolean;
  emailAdded: boolean;
  phoneAdded: boolean;
}

/**
 * Create a person in Planning Center People, then add primary email and phone if provided.
 * Never throws on PCO request failure; returns status for each step so the flow can continue
 * (e.g. send notification email regardless).
 * Uses JSON:API-style requests per PCO People API v2.
 */
export async function createPerson(
  input: CreatePersonInput
): Promise<CreatePersonResult> {
  const fail: CreatePersonResult = {
    personCreated: false,
    emailAdded: false,
    phoneAdded: false,
  };

  let authHeader: string;
  let baseUrl: string;
  try {
    baseUrl = getBaseUrl().replace(/\/$/, "");
    const { username, password } = getAuth();
    authHeader = basicAuthHeader(username, password);
  } catch (err) {
    console.error("Planning Center auth failed:", err);
    return fail;
  }

  const peopleUrl = `${baseUrl}/people/v2/people`;

  const createRes = await fetch(peopleUrl, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        type: "Person",
        attributes: {
          first_name: input.firstName,
          last_name: input.lastName,
        },
      },
    }),
  });

  const createText = await createRes.text();
  if (!createRes.ok) {
    console.error(
      "Planning Center create person failed:",
      createRes.status,
      createText.slice(0, 500)
    );
    return fail;
  }

  const createJson = JSON.parse(createText) as PCOPersonResponse;
  const personId = createJson.data?.id;
  if (!personId) {
    console.error("Planning Center did not return a person id:", createText.slice(0, 200));
    return fail;
  }

  let emailAdded = false;
  if (input.email) {
    const emailUrl = `${baseUrl}/people/v2/people/${personId}/emails`;
    const emailRes = await fetch(emailUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "Email",
          attributes: {
            address: input.email,
            location: "Home",
            primary: true,
          },
        },
      }),
    });
    if (emailRes.ok) {
      emailAdded = true;
    } else {
      const emailText = await emailRes.text();
      console.error(
        "Planning Center add email failed:",
        emailRes.status,
        emailText.slice(0, 300)
      );
    }
  }

  let phoneAdded = false;
  if (input.phone?.trim()) {
    const phoneUrl = `${baseUrl}/people/v2/people/${personId}/phone_numbers`;
    const phoneRes = await fetch(phoneUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "PhoneNumber",
          attributes: {
            number: input.phone.trim(),
            location: "Mobile",
          },
        },
      }),
    });
    if (phoneRes.ok) {
      phoneAdded = true;
    } else {
      const phoneText = await phoneRes.text();
      console.error(
        "Planning Center add phone failed:",
        phoneRes.status,
        phoneText.slice(0, 300)
      );
    }
  }

  return {
    personCreated: true,
    emailAdded,
    phoneAdded,
  };
}
