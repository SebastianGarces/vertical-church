# Memory Index

Quick reference to all memory artifacts.

## Entrypoints

- [entrypoints.md](./entrypoints.md) - Where flows start, primary modules, dependencies

## Invariants

- [invariants.md](./invariants.md) - Stable truths enforced across the codebase

## Flows (Mermaid)

| Flow | File | Description |
|------|------|-------------|
| Plan Visit Submission | [flows/plan-visit-submission.mmd](./flows/plan-visit-submission.mmd) | Form submission -> PCO create -> Email |
| Small Group Interest | [flows/small-group-interest-submission.mmd](./flows/small-group-interest-submission.mmd) | Modal form -> PCO find/create -> Email |
| Want To Serve | [flows/want-to-serve-submission.mmd](./flows/want-to-serve-submission.mmd) | Modal form -> PCO find/create -> Email |

## Contracts

| Contract | File | Description |
|----------|------|-------------|
| API | [contracts/api.md](./contracts/api.md) | Server actions, request/response shapes |
| DB | [contracts/db.md](./contracts/db.md) | External data stores (Planning Center) |
| Events | [contracts/events.md](./contracts/events.md) | Event names and payloads |
| Config | [contracts/config.md](./contracts/config.md) | Env vars, feature flags |

## Patterns

|| Pattern | File | Description |
||---------|------|-------------|
|| Subdomain Routing | [patterns/subdomain-routing.md](./patterns/subdomain-routing.md) | Admin subdomain via proxy.ts |
|| Form Spam Protection | [patterns/form-spam-protection.md](./patterns/form-spam-protection.md) | Honeypot, gibberish detection, timing checks |

## When Memory Is Sufficient

Use memory alone when:
- Planning which files to touch for a feature
- Understanding flow dependencies
- Checking required env vars
- Reviewing API contracts

## When to Open Code

Open source files when:
- Writing implementation logic
- Debugging specific behavior
- Checking exact prop types or styling
- Memory references a file you need to modify

## Size Budget

Target: **<= 50 KB total**. Keep it minimal.
