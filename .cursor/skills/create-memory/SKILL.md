---
name: create-memory
description: Create a token-efficient memory/ directory that captures repo flows, contracts, and invariants. Use when setting up a new project for agent work, when asked to create a memory pack, or when onboarding agents to a codebase.
---

# Create Memory Pack

Create a `memory/` directory that captures the repo's key flows, contracts, and invariants so agents can avoid reading code files unnecessarily.

## When to Use

- Setting up a new project for agent collaboration
- Onboarding agents to an existing codebase
- User asks to "create memory", "document the repo", or "create context pack"

## Constraints

- **Size budget**: <= 50 KB total across all memory files
- **Summarize, don't dump**: No full code blocks or schemas
- **Code anchors**: Mermaid nodes reference `file:symbol()` format
- **One-level references**: Memory files link to code, not to other memory files

## Phase 1: Repo Scan

Systematically scan to identify:

1. **Entrypoints**: Where flows start (routes, actions, handlers, jobs)
2. **Flows**: Request/data flows worth diagramming
3. **Contracts**: API shapes, DB schemas, events, config
4. **Invariants**: Stable truths (auth, validation, error handling)

Focus on:
- Server actions / API routes
- External integrations (APIs, databases, queues)
- Core business logic flows
- Environment variable requirements

## Phase 2: Create Structure

```
memory/
├── README.md           # Purpose, usage, size budget
├── index.md            # TOC with links
├── entrypoints.md      # Where flows start
├── invariants.md       # Stable truths
├── flows/              # Mermaid diagrams
│   └── <flow-name>.mmd
└── contracts/
    ├── api.md          # Server actions, routes
    ├── db.md           # Database/external stores
    ├── events.md       # Event names/payloads
    └── config.md       # Env vars, feature flags
```

## Phase 3: Write Content

### index.md

Table of contents linking to all memory files:

```markdown
# Memory Index

## Entrypoints
- [entrypoints.md](./entrypoints.md) - Where flows start

## Invariants
- [invariants.md](./invariants.md) - Stable truths

## Flows
| Flow | File | Description |
|------|------|-------------|
| Flow Name | [flows/flow-name.mmd](./flows/flow-name.mmd) | Brief description |

## Contracts
| Contract | File | Description |
|----------|------|-------------|
| API | [contracts/api.md](./contracts/api.md) | Server actions, routes |
| DB | [contracts/db.md](./contracts/db.md) | External data stores |
| Events | [contracts/events.md](./contracts/events.md) | Event payloads |
| Config | [contracts/config.md](./contracts/config.md) | Env vars, flags |

## When Memory Suffices
- Planning which files to touch
- Understanding flow dependencies
- Checking env var requirements

## When to Open Code
- Writing implementation logic
- Debugging specific behavior
- Memory references a file to modify
```

### entrypoints.md

For each major flow:

```markdown
## Flow Name

**Purpose**: One line description

**Entrypoint**: `path/to/file.ts:functionName()`
**Trigger**: Route / form submit / cron / etc.

**Primary modules**:
- `path/to/file.ts` - What it does
- `path/to/other.ts` - What it does

**Key dependencies**: External services, env vars
```

### invariants.md

Bullet list of stable truths (max 2 lines each):

```markdown
## Category

- **Invariant name**: Description
- Source: `path/to/file.ts:function()`
```

Categories: validation, auth, error handling, integrations, conventions

### contracts/*.md

Summaries only with source pointers:

- **api.md**: Action/route signatures, input/output shapes
- **db.md**: Tables/external stores, key relations
- **events.md**: Event names, payload fields
- **config.md**: Env vars with required/optional, defaults

### flows/*.mmd

Mermaid sequence or flowchart diagrams:

```mermaid
%% Code anchors:
%%   Actor: path/to/file.ts:function()

sequenceDiagram
    participant User
    participant Action as actionName
    ...
```

Keep diagrams under ~50 lines. Split if larger.

### README.md

Overview and usage instructions:

```markdown
# Memory Pack

Token-efficient context for AI agents.

## Purpose
Curated context pack capturing flows, contracts, and invariants.
Load memory before opening source code.

## Size Budget
Target: <= 50 KB total. Summarize; don't dump.

## Usage
1. Start with `entrypoints.md`
2. Load relevant `flows/*.mmd`
3. Load relevant `contracts/*.md`
4. Check `invariants.md` if modifying behavior

## When Memory Suffices
- Understanding flow shape and dependencies
- Knowing which files to modify
- Checking API contracts and env vars

## When to Open Code
- Implementing specific logic
- Debugging runtime behavior
- Modifying code not covered by memory
```

## Phase 4: Create Supporting Skills/Rules

### Memory-First Skill

Create `.agents/skills/memory-first/SKILL.md` (or `.cursor/skills/`):

```markdown
---
name: memory-first
description: Load memory pack first to minimize tokens and file reads.
---

# Memory-First Skill

## Required Reading Order

1. `memory/entrypoints.md`
2. Relevant `memory/flows/*.mmd`
3. Relevant `memory/contracts/*.md`

## Rules

- If memory answers the question, do not open source files
- If memory is missing info, open only referenced file(s)
- Output unified diffs only, no explanations unless asked
```

### WIP Skill Update (if exists)

Add Memory Maintenance section to existing WIP skill:

```markdown
### Memory Maintenance

During planning: Check if changes impact entrypoints/flows/contracts/invariants
During execution: Update memory in same phase as code changes
Before commit: Verify memory is current or note "Memory unchanged"
```

### Token Efficiency Rules

Create `.cursor/rules/token-efficiency.md`:

```markdown
# Token Efficiency Rules

1. Read memory before code
2. Unified diffs only
3. No explanations unless asked
4. Ask one question if blocked
```

## Checklist

```
Memory Pack Creation:
- [ ] Scan repo for flows, contracts, invariants
- [ ] Create memory/ directory structure
- [ ] Write entrypoints.md
- [ ] Write invariants.md
- [ ] Write contracts/*.md files
- [ ] Create flows/*.mmd diagrams
- [ ] Write README.md and index.md
- [ ] Create memory-first skill
- [ ] Update WIP skill (if exists)
- [ ] Add token-efficiency rules
- [ ] Verify total size <= 50 KB
```

## Content Guidelines

### Do Include

- Entry points with file paths and symbols
- Flow diagrams for multi-step processes
- API contract shapes (brief)
- Required env vars
- Integration points
- Stable conventions

### Do Not Include

- Full code implementations
- Detailed styling/CSS
- Complete database schemas
- Generated or vendored code
- Time-sensitive information
