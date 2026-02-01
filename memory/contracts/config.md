# Config Contracts

Environment variables and runtime configuration.

---

## Required Environment Variables

### Email (Resend)

| Variable | Required | Source | Description |
|----------|----------|--------|-------------|
| `RESEND_API_KEY` | Yes | `lib/email.ts` | Resend API key |
| `RESEND_FROM_EMAIL` | No | `lib/email.ts` | Sender address (default: `onboarding@resend.dev`) |
| `RESEND_REPLY_TO` | No | `lib/email.ts` | Reply-to address |

### Email Recipients

| Variable | Required | Source | Description |
|----------|----------|--------|-------------|
| `PLAN_VISIT_NOTIFY_EMAILS` | Yes | `lib/email.ts` | Plan Visit recipients (comma-separated) |
| `SMALL_GROUP_NOTIFY_EMAILS` | Yes | `lib/email.ts` | Small Group Interest recipients (comma-separated) |
| `WANT_TO_SERVE_NOTIFY_EMAILS` | Yes | `lib/email.ts` | Want To Serve recipients (comma-separated) |

### Better Auth (Admin Dashboard)

| Variable | Required | Source | Description |
|----------|----------|--------|-------------|
| `BETTER_AUTH_SECRET` | Yes | `lib/auth.ts` | Encryption secret (min 32 chars, generate: `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Prod only | `lib/auth.ts` | Base URL for auth (e.g., `https://admin.vertical.family`). **Do not set in local dev.** |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Prod only | `lib/auth.ts` | Comma-separated trusted origins for CSRF |
| `BETTER_AUTH_COOKIE_DOMAIN` | Prod only | `lib/auth.ts` | Cookie domain for cross-subdomain auth (e.g., `.vertical.family`). **Do not set in local dev.** |

### Planning Center

| Variable | Required | Source | Description |
|----------|----------|--------|-------------|
| `PLANNING_CENTER_CLIENT_ID` | Yes | `lib/planning-center.ts` | PCO app client ID |
| `PLANNING_CENTER_SECRET_KEY` | Yes | `lib/planning-center.ts` | PCO app secret |
| `PLANNING_CENTER_URL` | No | `lib/planning-center.ts` | API base URL (default: `https://api.planningcenteronline.com`) |

---

## Feature Flags

**None currently**.

---

## Custom Colors (Tailwind)

Defined in `app/globals.css`:

| Color | Usage |
|-------|-------|
| `navy` | Background, dark theme base |
| `pipper` | Text, light elements |
| `florence` | Accent, CTAs, highlights |

---

## Fonts

Configured in `app/layout.tsx`:

| Font | Variable | Usage |
|------|----------|-------|
| Fraunces | `--font-fraunces` | Headings (italic) |
| Overpass | `--font-overpass` | Body text |
| PT Mono | `--font-pt-mono` | Monospace |
