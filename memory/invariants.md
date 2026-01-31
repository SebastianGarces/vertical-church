# Invariants

Stable truths enforced across the codebase.

---

## Form Validation

- **Client + Server validation**: Forms validate on client (UX) AND server (security)
- Source: `app/visit/components/PlanVisitForm.tsx` (client), `app/visit/actions.ts` (server)

- **Zod schemas**: All server actions use Zod for input validation
- Source: `app/visit/actions.ts:planVisitFormSchema`

---

## Email Sending

- **Email always attempts to send**: Even if Planning Center fails, notification email is sent
- Source: `app/visit/actions.ts:submitPlanVisitForm()` - PCO result passed to email, no early return

- **Idempotency keys**: Each email send uses a unique idempotency key
- Source: `lib/email.ts:sendPlanVisitNotification()` - `crypto.randomUUID()`

- **Retry with backoff**: Retryable errors (rate limit, 5xx) retry up to 3 times with exponential backoff
- Source: `lib/email.ts` - `MAX_RETRIES`, `isRetryableError()`

- **Plain text fallback**: All emails include plain text version
- Source: `lib/email.ts` - `render(reactElement, { plainText: true })`

---

## Planning Center Integration

- **Non-blocking failures**: PCO API errors are logged but don't fail the form submission
- Source: `lib/planning-center.ts:createPerson()` - catches errors, returns status object

- **Basic auth**: Uses HTTP Basic auth with client ID + secret key
- Source: `lib/planning-center.ts:basicAuthHeader()`

---

## Environment Variables

- **Required for email**: `RESEND_API_KEY`, at least one `PLAN_VISIT_NOTIFY_EMAIL_*`
- Source: `lib/email.ts:getResendApiKey()`, `getNotificationRecipients()`

- **Required for PCO**: `PLANNING_CENTER_CLIENT_ID`, `PLANNING_CENTER_SECRET_KEY`
- Source: `lib/planning-center.ts:getAuth()`

---

## Tech Stack

- **Next.js 16 App Router**: All pages use RSC by default, client components marked with `"use client"`
- **Server Actions**: `"use server"` directive, async functions exported from actions.ts
- **Tailwind CSS v4**: Utility-first styling, custom colors (navy, pipper, florence)
- **Motion (Framer Motion)**: Animations via `motion/react`

---

## Component Organization

- **Shared app components**: `app/components/` — used across multiple pages (Header, Footer, Hero, etc.)
- **Route-specific components**: `app/<route>/components/` — scoped to that route only
- **UI primitives**: `components/ui/` — shadcn/ui (Radix-based) form controls
- Source: See `memory/entrypoints.md` for full component inventory
