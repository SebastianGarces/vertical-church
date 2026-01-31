# Events Contracts

Event names and payloads used in this application.

---

## Current Events

**None**. This app does not currently use custom events or webhooks.

---

## Future Considerations

If webhooks are added (e.g., Resend webhooks for delivery status):

- Webhook endpoint would be a Route Handler in `app/api/webhooks/`
- Resend events: `email.sent`, `email.delivered`, `email.bounced`, etc.
- See `.agents/skills/resend/send-email/references/webhooks.md` for Resend webhook patterns
