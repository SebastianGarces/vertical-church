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

### Email Recipients (one required)

| Variable | Source | Description |
|----------|--------|-------------|
| `PLAN_VISIT_NOTIFY_EMAIL_1` | `lib/email.ts` | First recipient |
| `PLAN_VISIT_NOTIFY_EMAIL_2` | `lib/email.ts` | Second recipient |
| `PLAN_VISIT_NOTIFY_EMAIL_3` | `lib/email.ts` | Third recipient |
| `PLAN_VISIT_NOTIFY_EMAIL` | `lib/email.ts` | Comma-separated fallback |

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
