# API Contracts

Server actions and their request/response shapes.

---

## Server Actions

### `submitPlanVisitForm`

**Source**: `app/visit/actions.ts`

**Input** (Zod-validated):
```typescript
{
  firstName: string    // required, min 1
  lastName: string     // required, min 1
  email: string        // required, valid email
  phone?: string       // optional
  attendees: string    // required, min 1
  hasKids: string      // required, min 1
  wantsContact: string // required, min 1
  questions?: string   // optional
}
```

**Output**:
```typescript
| { success: true }
| { success: false; error: string }
```

**Side effects**:
1. Creates person in Planning Center (non-blocking on failure)
2. Sends notification email to configured recipients

---

### `submitSmallGroupInterestForm`

**Source**: `app/get-involved/actions.ts`

**Input** (Zod-validated):
```typescript
{
  firstName: string      // required, min 1
  lastName: string       // required, min 1
  email: string          // required, valid email
  phone?: string         // optional
  gender: "Male" | "Female"
  ageRange: string       // e.g., "18-25", "26-35", etc.
  groupType: "Coed" | "Men's only" | "Women's only"
  city: string           // required, min 1
  preferredDay: string   // e.g., "Wednesday"
  needsKidsCare: "Yes" | "No"
}
```

**Output**:
```typescript
| { success: true }
| { success: false; error: string }
```

**Side effects**:
1. Finds or creates person in Planning Center (non-blocking on failure)
2. Sends notification email to small group coordinator(s)

---

### `submitWantToServeForm`

**Source**: `app/get-involved/actions.ts`

**Input** (Zod-validated):
```typescript
{
  firstName: string      // required, min 1
  lastName: string       // required, min 1
  email: string          // required, valid email
  phone?: string         // optional
  serviceInterests: string[] // required, select >= 1 service/team interests
}
```

**Output**:
```typescript
| { success: true }
| { success: false; error: string }
```

**Side effects**:
1. Finds or creates person in Planning Center (non-blocking on failure)
2. Sends notification email to configured recipients

---

## Internal Functions

### `createPerson` (Planning Center)

**Source**: `lib/planning-center.ts`

**Input**:
```typescript
{
  firstName: string
  lastName: string
  email: string
  phone?: string
}
```

**Output**:
```typescript
{
  personCreated: boolean
  emailAdded: boolean
  phoneAdded: boolean
}
```

### `findOrCreatePerson` (Planning Center)

**Source**: `lib/planning-center.ts`

**Input**:
```typescript
{
  firstName: string
  lastName: string
  email: string
  phone?: string
}
```

**Output**:
```typescript
{
  success: boolean
  personId: string | null
  isExisting: boolean    // true if found, false if created
  emailAdded: boolean
  phoneAdded: boolean
}
```

**Behavior**: Searches by email first. If found, updates missing email/phone. If not found, creates new person.

---

### `sendPlanVisitNotification` (Email)

**Source**: `lib/email.ts`

**Input**: `PlanVisitNotificationData` (form data + PCO status)

**Output**: `{ success: true }` or throws on permanent failure

### `sendSmallGroupInterestNotification` (Email)

**Source**: `lib/email.ts`

**Input**: `SmallGroupInterestNotificationData` (form data + PCO status)

**Output**: `{ success: true }` or throws on permanent failure

### `sendWantToServeNotification` (Email)

**Source**: `lib/email.ts`

**Input**: `WantToServeNotificationData` (form data + PCO status)

**Output**: `{ success: true }` or throws on permanent failure
