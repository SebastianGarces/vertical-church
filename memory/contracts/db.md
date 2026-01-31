# Database Contracts

External data stores used by this application.

---

## Local Database

**None**. This app has no local database.

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
