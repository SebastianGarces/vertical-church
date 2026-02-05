# Form Spam Protection Pattern

## Problem

Public intake forms (Contact, Plan Visit, Small Group Interest, Want to Serve) were receiving spam submissions that:
- Contained gibberish names like "CGoCymNyQTGXOIuMtEy"
- Had fake phone numbers like "xweCKHrQnLYAceyCPKbXL"
- Created junk records in Planning Center

---

## Solution: Multi-Layer Spam Protection

All public forms must implement 4 layers of protection using the shared `lib/spam-protection.ts` module.

### Architecture

```
Client Form                 Server Action
──────────────────────────────────────────────────────
1. Honeypot field    →     Check honeypot (silent reject if filled)
2. Form load time    →     Check timing (silent reject if < 3s)
3. Name inputs       →     Validate names (user error if gibberish)
4. Phone input       →     Validate US phone (user error if invalid)
                     ↓
              [All checks pass]
                     ↓
              Create/Find PCO Person
                     ↓
              Send notification email
```

### Key Behaviors

| Check | Fails | Behavior |
|-------|-------|----------|
| Honeypot filled | Bot detected | Return `{ success: true }` but skip PCO (silent) |
| Timing < 3s | Bot detected | Return `{ success: true }` but skip PCO (silent) |
| Gibberish name | Invalid input | Return `{ success: false, error: "..." }` |
| Invalid phone | Invalid input | Return `{ success: false, error: "..." }` |

Silent rejects return success to avoid alerting bots that they were detected.

---

## Implementation Checklist

When adding a new public form:

### 1. Client Component

```tsx
import { useState, useRef } from "react";

function MyForm() {
  // Add spam protection state
  const [honeypot, setHoneypot] = useState("");
  const formLoadedAt = useRef(Date.now());

  const handleSubmit = async () => {
    const result = await submitMyForm({
      ...formData,
      honeypot,
      formLoadedAt: formLoadedAt.current,
    });
    // ...
  };

  // Reset on form reset
  const handleReset = () => {
    setFormData(initialFormData);
    setHoneypot("");
    formLoadedAt.current = Date.now();
  };

  return (
    <form>
      {/* Honeypot field - MUST be hidden from users */}
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
        <label htmlFor="my-form-website">Website</label>
        <input
          type="text"
          id="my-form-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Rest of form fields */}
    </form>
  );
}
```

### 2. Server Action (Zod Schema)

```ts
import { validateSubmission } from "@/lib/spam-protection";

const myFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z.string().optional(),
  // ... other fields
  honeypot: z.string().optional(),
  formLoadedAt: z.number().optional(),
});
```

### 3. Server Action (Validation)

```ts
export async function submitMyForm(payload: MyFormPayload) {
  const parsed = myFormSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const formData = parsed.data;

  // Spam protection validation - ADD THIS BLOCK
  const spamCheck = validateSubmission({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    message: formData.message, // if form has a message field
    honeypot: formData.honeypot,
    formLoadedAt: formData.formLoadedAt,
  });

  if (!spamCheck.passed) {
    if (spamCheck.isSilentReject) {
      return { success: true }; // Don't alert bots
    }
    return { success: false, error: spamCheck.reason };
  }

  // Continue with PCO creation and email...
}
```

---

## Validation Rules

### Name Validation (`isValidName`)
- Length: 2-50 characters
- Must contain letters
- Gibberish detection:
  - Vowel ratio < 15% → rejected
  - 5+ consecutive consonants → rejected
  - Unusual uppercase sequences in middle (e.g., "WOCGZTI") → rejected
  - High case alternation ratio (> 40%) → rejected

### US Phone Validation (`isValidUSPhoneNumber`)
- Must be 10 digits (or 11 with leading 1)
- Area code cannot start with 0 or 1
- Accepts any common format: `(555) 123-4567`, `555-123-4567`, `5551234567`

### Honeypot Check
- Field must be empty
- Bots typically auto-fill all visible form fields

### Timing Check
- Form must be open for at least 3 seconds before submission
- Bots typically submit instantly

---

## Files Reference

| File | Purpose |
|------|---------|
| `lib/spam-protection.ts` | Shared validation functions |
| `app/contact/actions.ts` | Contact form server action |
| `app/visit/actions.ts` | Plan Visit server action |
| `app/get-involved/actions.ts` | Small Group + Want to Serve actions |

---

## Testing

Run the test script to verify spam detection:

```ts
// scripts/test-spam-protection.ts
import { validateSubmission } from "../lib/spam-protection";

// Spam submission should be rejected
validateSubmission({
  firstName: "CGoCymNyQTGXOIuMtEy",
  lastName: "LgawoWOCGZTIanjR",
  phone: "xweCKHrQnLYAceyCPKbXL",
});
// → { passed: false, reason: "Please enter a valid first name" }

// Legitimate submission should pass
validateSubmission({
  firstName: "John",
  lastName: "Smith",
  phone: "(440) 420-7335",
});
// → { passed: true }
```
