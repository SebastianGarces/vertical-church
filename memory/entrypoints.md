# Entrypoints

Where each major flow starts in the codebase.

---

## Plan Visit Form Submission

**Purpose**: Collect visitor info, create person in Planning Center, send notification email.

**Entrypoint**:
- `app/visit/actions.ts` : `submitPlanVisitForm(payload)`
- Trigger: Form submit from `app/visit/components/PlanVisitForm.tsx`

**Primary modules**:
- `app/visit/actions.ts` - Server action, Zod validation
- `lib/planning-center.ts` - Planning Center API client (`createPerson`)
- `lib/email.ts` - Resend email sender
- `emails/plan-visit-notification.tsx` - Email template

**Key dependencies**:
- External: Planning Center People API
- External: Resend email service
- Env vars: See `contracts/config.md`

---

## Small Group Interest Form Submission

**Purpose**: Collect small group interest, find/create person in Planning Center, send notification to coordinator.

**Entrypoint**:
- `app/get-involved/actions.ts` : `submitSmallGroupInterestForm(payload)`
- Trigger: Form submit from `app/get-involved/components/SmallGroupInterestModal.tsx`

**Primary modules**:
- `app/get-involved/actions.ts` - Server action, Zod validation
- `lib/planning-center.ts` - Planning Center API client (`findOrCreatePerson`)
- `lib/email.ts` - Resend email sender
- `emails/small-group-interest-notification.tsx` - Email template

**Key dependencies**:
- External: Planning Center People API (search, create, update)
- External: Resend email service
- Env vars: See `contracts/config.md`

---

## Want To Serve Form Submission

**Purpose**: Collect serving interest, find/create person in Planning Center, send notification to serving coordinator(s).

**Entrypoint**:
- `app/get-involved/actions.ts` : `submitWantToServeForm(payload)`
- Trigger: Form submit from `app/get-involved/components/WantToServeModal.tsx` (opened from `ServeTeams`)

**Primary modules**:
- `app/get-involved/actions.ts` - Server action, Zod validation
- `lib/planning-center.ts` - Planning Center API client (`findOrCreatePerson`)
- `lib/email.ts` - Resend email sender
- `emails/want-to-serve-notification.tsx` - Email template

**Key dependencies**:
- External: Planning Center People API (search, create, update)
- External: Resend email service
- Env vars: See `contracts/config.md`

---

## Events Page Data Fetching

**Purpose**: Display upcoming events from Planning Center Registrations API.

**Entrypoint**:
- `app/events/page.tsx` : Server component that renders `EventsList`
- `app/events/components/EventsList.tsx` : Server component that calls `getEvents()`

**Primary modules**:
- `lib/planning-center.ts` - PCO client with `getEvents()` function
- `app/events/components/EventCard.tsx` - Client component for expandable event card

**Key dependencies**:
- External: Planning Center Registrations API (`/registrations/v2/signups`)
- Env vars: Uses existing `PLANNING_CENTER_CLIENT_ID`, `PLANNING_CENTER_SECRET_KEY`

**Data flow**:
1. Page renders with Suspense boundary
2. `EventsList` calls `getEvents()` on server
3. PCO client fetches signups with locations and times included
4. Response transformed to `EventWithDetails[]`
5. Events rendered as expandable cards

---

## Page Routes

| Route | Entrypoint | Purpose |
|-------|------------|---------|
| `/` | `app/page.tsx` | Home page with hero, welcome, ministry cards |
| `/about` | `app/about/page.tsx` | Church mission, pillars, leadership |
| `/about/beliefs` | `app/about/beliefs/page.tsx` | Doctrinal statements and beliefs (MDX) |
| `/visit` | `app/visit/page.tsx` | Plan Your Visit page with form |
| `/get-involved` | `app/get-involved/page.tsx` | Ministries, next steps, small groups |
| `/events` | `app/events/page.tsx` | Upcoming events from PCO Registrations |

**Shared layout**: `app/layout.tsx` (fonts, metadata)

**Shared components**:
- `app/components/Header.tsx` - Navigation header
- `app/components/Footer.tsx` - Site footer

---

## Component Structure

### Shared App Components (`app/components/`)

Site-wide components used across multiple pages:

| Component | File | Purpose |
|-----------|------|---------|
| `Header` | `app/components/Header.tsx` | Fixed nav with mobile menu |
| `Footer` | `app/components/Footer.tsx` | Site footer |
| `Hero` | `app/components/Hero.tsx` | Hero section with images |
| `Button` | `app/components/Button.tsx` | Styled button component |
| `VideoHero` | `app/components/VideoHero.tsx` | Video hero variant |
| `Welcome` | `app/components/Welcome.tsx` | Welcome section |
| `MinistryCards` | `app/components/MinistryCards.tsx` | Ministry card grid |
| `FeatureSection` | `app/components/FeatureSection.tsx` | Feature highlight section |
| `Marquee` | `app/components/Marquee.tsx` | Scrolling text marquee |
| Icons | `app/components/icons/*.tsx` | Logo and social icons |

### Route-Specific Components

Each route has its own `components/` folder:

| Route | Components Dir | Key Components |
|-------|----------------|----------------|
| `/visit` | `app/visit/components/` | `PlanVisitForm` (multi-step form) |
| `/about` | `app/about/components/` | `Leadership`, `OurMission`, `OurPillars`, `OurPrinciples`, `OurHistory`, `OurVision`, `PastorBio` |
| `/get-involved` | `app/get-involved/components/` | `NextSteps`, `Ministries`, `SmallGroups`, `ServeTeams`, `PageIntro` |
| `/events` | `app/events/components/` | `PageIntro`, `EventCard`, `EventsList` |

### UI Primitives (`components/ui/`)

shadcn/ui components (Radix-based):

| Component | File | Purpose |
|-----------|------|---------|
| `Input` | `components/ui/input.tsx` | Text input |
| `Label` | `components/ui/label.tsx` | Form label |
| `Textarea` | `components/ui/textarea.tsx` | Multi-line input |
| `Select` | `components/ui/select.tsx` | Dropdown select |
| `RadioGroup` | `components/ui/radio-group.tsx` | Radio button group |
| `Progress` | `components/ui/progress.tsx` | Progress bar |
| `Accordion` | `components/ui/accordion.tsx` | Collapsible accordion |
| `Card` | `components/ui/card.tsx` | Card container |
