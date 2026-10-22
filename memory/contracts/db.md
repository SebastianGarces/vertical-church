# Database Contracts

External data stores used by this application.

---

## Database: Neon Postgres

**Client**: `lib/db/index.ts` uses Drizzle with `DATABASE_URL`.
**Schema**: `lib/db/schema.ts` stores sermon series, sermons, and re-exports admin auth tables.

**NFC links**: `nfc_links` holds five colors (orange, green, black, burgundy, blue), an editable label and HTTPS destination, and enabled status. All start inactive without destinations.
- Public `/nfc/[color]` looks up the destination on each request and sends a non-cacheable 302. Inactive colors display a holding message; unknown colors return 404.
- `nfc_opens` records UUID, color, label/destination snapshots, and timestamp. HEAD does not track. Tracking failures do not block redirects.
- Admin `/dashboard/nfc` manages destinations and shows 30-day open counts by color. Both the page and save action require authentication.
- Migration: `scripts/setup-nfc-links.sql` creates/seeds NFC tables. The retired `qr_opens` table remains unused to preserve its history. Existing `/q/giving` links are retired; the website Give Now button links directly to Church Center.

---

## External: Planning Center People API

**Source**: `lib/planning-center.ts`

**Base URL**: `https://api.planningcenteronline.com/people/v2`

**Auth**: HTTP Basic (client ID : secret key)

### Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/people` | Create a person |
| POST | `/people/{id}/emails` | Add email to person |
| POST | `/people/{id}/phone_numbers` | Add phone to person |

### Person Create Payload

```json
{
  "data": {
    "type": "Person",
    "attributes": {
      "first_name": "string",
      "last_name": "string"
    }
  }
}
```

### Email Add Payload

```json
{
  "data": {
    "type": "Email",
    "attributes": {
      "address": "string",
      "location": "Home",
      "primary": true
    }
  }
}
```

### Phone Add Payload

```json
{
  "data": {
    "type": "PhoneNumber",
    "attributes": {
      "number": "string",
      "location": "Mobile"
    }
  }
}
```

**Reference**: https://developer.planning.center/docs/#/apps/people
