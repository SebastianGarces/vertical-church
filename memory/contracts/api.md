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

### `sendPlanVisitNotification` (Email)

**Source**: `lib/email.ts`

**Input**: `PlanVisitNotificationData` (form data + PCO status)

**Output**: `{ success: true }` or throws on permanent failure
