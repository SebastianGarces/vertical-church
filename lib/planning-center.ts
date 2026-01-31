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

interface PCOPersonData {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
}

interface PCOPersonResponse {
  data?: PCOPersonData;
}

interface PCOPeopleListResponse {
  data?: PCOPersonData[];
}

interface PCOEmailData {
  id: string;
  attributes?: {
    address?: string;
    primary?: boolean;
  };
}

interface PCOPhoneData {
  id: string;
  attributes?: {
    number?: string;
  };
}

interface PCOEmailsResponse {
  data?: PCOEmailData[];
}

interface PCOPhonesResponse {
  data?: PCOPhoneData[];
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

export interface FindOrCreatePersonInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface FindOrCreatePersonResult {
  success: boolean;
  personId: string | null;
  isExisting: boolean;
  emailAdded: boolean;
  phoneAdded: boolean;
}

/**
 * Search for a person in Planning Center by email (most reliable).
 * Returns the first match or null if not found.
 */
async function searchPersonByEmail(
  email: string,
  authHeader: string,
  baseUrl: string
): Promise<PCOPersonData | null> {
  const searchUrl = `${baseUrl}/people/v2/people?where[search_name_or_email_or_phone_number]=${encodeURIComponent(email)}`;
  
  try {
    const res = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Planning Center search failed:", res.status, text.slice(0, 300));
      return null;
    }

    const json = (await res.json()) as PCOPeopleListResponse;
    if (json.data && json.data.length > 0) {
      return json.data[0];
    }
    return null;
  } catch (err) {
    console.error("Planning Center search error:", err);
    return null;
  }
}

/**
 * Get existing emails for a person.
 */
async function getPersonEmails(
  personId: string,
  authHeader: string,
  baseUrl: string
): Promise<PCOEmailData[]> {
  const url = `${baseUrl}/people/v2/people/${personId}/emails`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: authHeader },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as PCOEmailsResponse;
    return json.data || [];
  } catch {
    return [];
  }
}

/**
 * Get existing phone numbers for a person.
 */
async function getPersonPhones(
  personId: string,
  authHeader: string,
  baseUrl: string
): Promise<PCOPhoneData[]> {
  const url = `${baseUrl}/people/v2/people/${personId}/phone_numbers`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: authHeader },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as PCOPhonesResponse;
    return json.data || [];
  } catch {
    return [];
  }
}

/**
 * Add email to an existing person if they don't have one.
 */
async function addEmailIfMissing(
  personId: string,
  email: string,
  authHeader: string,
  baseUrl: string
): Promise<boolean> {
  const existing = await getPersonEmails(personId, authHeader, baseUrl);
  const hasEmail = existing.some(
    (e) => e.attributes?.address?.toLowerCase() === email.toLowerCase()
  );
  if (hasEmail) return true; // Already has this email

  const url = `${baseUrl}/people/v2/people/${personId}/emails`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "Email",
          attributes: {
            address: email,
            location: "Home",
            primary: existing.length === 0, // Primary only if no other emails
          },
        },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Planning Center add email failed:", res.status, text.slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("Planning Center add email error:", err);
    return false;
  }
}

/**
 * Add phone to an existing person if they don't have one.
 */
async function addPhoneIfMissing(
  personId: string,
  phone: string,
  authHeader: string,
  baseUrl: string
): Promise<boolean> {
  const existing = await getPersonPhones(personId, authHeader, baseUrl);
  // Normalize phone for comparison (strip non-digits)
  const normalizePhone = (p: string) => p.replace(/\D/g, "");
  const phoneDigits = normalizePhone(phone);
  const hasPhone = existing.some(
    (p) => normalizePhone(p.attributes?.number || "") === phoneDigits
  );
  if (hasPhone) return true; // Already has this phone

  const url = `${baseUrl}/people/v2/people/${personId}/phone_numbers`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "PhoneNumber",
          attributes: {
            number: phone,
            location: "Mobile",
          },
        },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Planning Center add phone failed:", res.status, text.slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("Planning Center add phone error:", err);
    return false;
  }
}

/**
 * Find an existing person by email, or create a new one.
 * If found, update their email/phone if missing.
 * Never throws; returns status for email notification.
 */
export async function findOrCreatePerson(
  input: FindOrCreatePersonInput
): Promise<FindOrCreatePersonResult> {
  const fail: FindOrCreatePersonResult = {
    success: false,
    personId: null,
    isExisting: false,
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

  // Search for existing person by email
  const existingPerson = await searchPersonByEmail(input.email, authHeader, baseUrl);

  if (existingPerson) {
    // Person exists - update email/phone if missing
    const emailAdded = await addEmailIfMissing(
      existingPerson.id,
      input.email,
      authHeader,
      baseUrl
    );
    const phoneAdded = input.phone?.trim()
      ? await addPhoneIfMissing(existingPerson.id, input.phone.trim(), authHeader, baseUrl)
      : true;

    return {
      success: true,
      personId: existingPerson.id,
      isExisting: true,
      emailAdded,
      phoneAdded,
    };
  }

  // Person not found - create new
  const createResult = await createPerson(input);
  
  return {
    success: createResult.personCreated,
    personId: null, // We don't return the ID from createPerson currently
    isExisting: false,
    emailAdded: createResult.emailAdded,
    phoneAdded: createResult.phoneAdded,
  };
}
