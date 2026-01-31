/**
 * Planning Center People API v2 client.
 * Creates a person and optionally adds primary email and phone.
 * Auth: Basic (PLANNING_CENTER_CLIENT_ID:PLANNING_CENTER_SECRET_KEY).
 * @see https://developer.planning.center/docs/#/apps/people/2025-11-10/vertices/person
 */

const DEFAULT_BASE_URL = "https://api.planningcenteronline.com";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CreatePersonInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CreatePersonResult {
  personCreated: boolean;
  personId: string | null;
  emailAdded: boolean;
  phoneAdded: boolean;
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

interface PCOPersonData {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
}

interface PCOResponse<T> {
  data?: T;
}

interface PCOResourceData {
  id: string;
  attributes?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// PCOClient - Centralized API client
// ─────────────────────────────────────────────────────────────────────────────

interface PCOFetchResult<T> {
  ok: boolean;
  data?: T;
  status?: number;
}

/**
 * Planning Center API client with centralized auth and error handling.
 */
class PCOClient {
  private authHeader: string;
  private baseUrl: string;

  private constructor(authHeader: string, baseUrl: string) {
    this.authHeader = authHeader;
    this.baseUrl = baseUrl;
  }

  /**
   * Try to create a client. Returns null if credentials are missing.
   * Use this for non-throwing flows.
   */
  static tryCreate(): PCOClient | null {
    const clientId = process.env.PLANNING_CENTER_CLIENT_ID;
    const secret = process.env.PLANNING_CENTER_SECRET_KEY;
    if (!clientId || !secret) {
      console.error(
        "Planning Center auth failed: Missing PLANNING_CENTER_CLIENT_ID or PLANNING_CENTER_SECRET_KEY"
      );
      return null;
    }

    const baseUrl = (process.env.PLANNING_CENTER_URL?.trim() || DEFAULT_BASE_URL).replace(/\/$/, "");
    const encoded = Buffer.from(`${clientId}:${secret}`, "utf-8").toString("base64");
    const authHeader = `Basic ${encoded}`;

    return new PCOClient(authHeader, baseUrl);
  }

  /**
   * Make a request to the PCO API.
   */
  async fetch<T>(
    path: string,
    options: { method?: string; body?: unknown; logPrefix?: string } = {}
  ): Promise<PCOFetchResult<T>> {
    const { method = "GET", body, logPrefix = "Planning Center" } = options;
    const url = `${this.baseUrl}${path}`;

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
        },
      };
      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }

      const res = await fetch(url, fetchOptions);

      if (!res.ok) {
        const text = await res.text();
        console.error(`${logPrefix} failed:`, res.status, text.slice(0, 300));
        return { ok: false, status: res.status };
      }

      const json = (await res.json()) as T;
      return { ok: true, data: json };
    } catch (err) {
      console.error(`${logPrefix} error:`, err);
      return { ok: false };
    }
  }

  /**
   * Get resources for a person (emails, phone_numbers, etc.)
   */
  async getPersonResources<T extends PCOResourceData>(
    personId: string,
    resource: string
  ): Promise<T[]> {
    const result = await this.fetch<PCOResponse<T[]>>(
      `/people/v2/people/${personId}/${resource}`,
      { logPrefix: `Planning Center get ${resource}` }
    );
    return result.data?.data || [];
  }

  /**
   * Search for a person by email.
   */
  async searchPersonByEmail(email: string): Promise<PCOPersonData | null> {
    const result = await this.fetch<PCOResponse<PCOPersonData[]>>(
      `/people/v2/people?where[search_name_or_email_or_phone_number]=${encodeURIComponent(email)}`,
      { logPrefix: "Planning Center search" }
    );
    const people = result.data?.data;
    return people && people.length > 0 ? people[0] : null;
  }

  /**
   * Create a new person.
   */
  async createPerson(
    firstName: string,
    lastName: string
  ): Promise<{ ok: boolean; personId: string | null }> {
    const result = await this.fetch<PCOResponse<PCOPersonData>>(
      "/people/v2/people",
      {
        method: "POST",
        body: {
          data: {
            type: "Person",
            attributes: { first_name: firstName, last_name: lastName },
          },
        },
        logPrefix: "Planning Center create person",
      }
    );

    if (!result.ok || !result.data?.data?.id) {
      return { ok: false, personId: null };
    }
    return { ok: true, personId: result.data.data.id };
  }

  /**
   * Add email to a person.
   */
  async addEmail(
    personId: string,
    email: string,
    primary: boolean
  ): Promise<boolean> {
    const result = await this.fetch(
      `/people/v2/people/${personId}/emails`,
      {
        method: "POST",
        body: {
          data: {
            type: "Email",
            attributes: { address: email, location: "Home", primary },
          },
        },
        logPrefix: "Planning Center add email",
      }
    );
    return result.ok;
  }

  /**
   * Add phone number to a person.
   */
  async addPhone(personId: string, phone: string): Promise<boolean> {
    const result = await this.fetch(
      `/people/v2/people/${personId}/phone_numbers`,
      {
        method: "POST",
        body: {
          data: {
            type: "PhoneNumber",
            attributes: { number: phone, location: "Mobile" },
          },
        },
        logPrefix: "Planning Center add phone",
      }
    );
    return result.ok;
  }

  /**
   * Add email if the person doesn't already have it.
   */
  async addEmailIfMissing(personId: string, email: string): Promise<boolean> {
    const existing = await this.getPersonResources<PCOResourceData>(personId, "emails");
    const hasEmail = existing.some(
      (e) =>
        (e.attributes?.address as string | undefined)?.toLowerCase() ===
        email.toLowerCase()
    );
    if (hasEmail) return true;

    return this.addEmail(personId, email, existing.length === 0);
  }

  /**
   * Add phone if the person doesn't already have it.
   */
  async addPhoneIfMissing(personId: string, phone: string): Promise<boolean> {
    const existing = await this.getPersonResources<PCOResourceData>(personId, "phone_numbers");
    const normalizePhone = (p: string) => p.replace(/\D/g, "");
    const phoneDigits = normalizePhone(phone);
    const hasPhone = existing.some(
      (p) => normalizePhone((p.attributes?.number as string) || "") === phoneDigits
    );
    if (hasPhone) return true;

    return this.addPhone(personId, phone);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a person in Planning Center People, then add primary email and phone if provided.
 * Never throws on PCO request failure; returns status for each step so the flow can continue
 * (e.g. send notification email regardless).
 */
export async function createPerson(
  input: CreatePersonInput
): Promise<CreatePersonResult> {
  const fail: CreatePersonResult = {
    personCreated: false,
    personId: null,
    emailAdded: false,
    phoneAdded: false,
  };

  const client = PCOClient.tryCreate();
  if (!client) return fail;

  const { ok, personId } = await client.createPerson(input.firstName, input.lastName);
  if (!ok || !personId) return fail;

  const emailAdded = input.email
    ? await client.addEmail(personId, input.email, true)
    : false;

  const phoneAdded = input.phone?.trim()
    ? await client.addPhone(personId, input.phone.trim())
    : false;

  return { personCreated: true, personId, emailAdded, phoneAdded };
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

  const client = PCOClient.tryCreate();
  if (!client) return fail;

  // Search for existing person by email
  const existingPerson = await client.searchPersonByEmail(input.email);

  if (existingPerson) {
    const emailAdded = await client.addEmailIfMissing(existingPerson.id, input.email);
    const phoneAdded = input.phone?.trim()
      ? await client.addPhoneIfMissing(existingPerson.id, input.phone.trim())
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
    personId: createResult.personId,
    isExisting: false,
    emailAdded: createResult.emailAdded,
    phoneAdded: createResult.phoneAdded,
  };
}
