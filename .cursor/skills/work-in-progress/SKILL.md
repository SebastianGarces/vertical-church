---
name: work-in-progress
description: Use to plan and execute current feature implementation.
---

# WIP – Working Feature Implementation Skill

## When to Use

* When starting implementation work on a feature
* When the user references `working-feature/` directory
* When asked to plan or prepare implementation for an FRD

## Purpose

The `working-feature/` directory is an ephemeral workspace for planning and executing feature implementation.
It provides structure without requiring version control of planning artifacts.

## Directory Structure

```
working-feature/
├── README.md           # Permanent - do not delete
├── notes.md            # High-level notes for current feature
└── implementation.md   # Detailed implementation plan
```

## Workflow

### 1. Starting a New Feature

When beginning work on a feature:

1. Reset the directory (keep only `README.md`)
2. Create `notes.md` using the template below
3. Create `implementation.md` using the template below
4. Apply **Risk Gate** (see below)

## Risk Gate (IMPORTANT)

Determine risk level before proceeding.

**High-risk changes** (STOP and wait for approval):

* Database schema or migrations
* Auth / permissions / roles
* Payments or billing
* Multi-tenant boundaries
* Security-sensitive data flows

**Low / medium-risk changes**:

* UI changes
* Local logic refactors
* Non-breaking API changes
* Internal tooling

### Behavior

* **High risk** → STOP after planning and wait for explicit approval
* **Low / medium risk** → Proceed after plan unless user says “stop”

## notes.md Template

```markdown
# [Feature Name] – Implementation Notes

**FRD:** `product-docs/features/<feature-name>/frd.md`
**Date Started:** YYYY-MM-DD
**Risk Level:** Low / Medium / High

## Goal

[One sentence describing what we're building]

## Key Decisions

-

## Constraints

-

## Acceptance Criteria

- [ ] What must be true for this to be considered done

## Verification

- Commands to run
- Manual checks (if any)

## Open Questions

-

## Out of Scope

-

## FRD Issues (if any)

- Gaps, ambiguities, or inconsistencies found in FRD
```

## implementation.md Template

```markdown
# [Feature Name] – Implementation Plan

**FRD:** `product-docs/features/<feature-name>/frd.md`
**Scope:** MVP / Full / Specific requirements

## Requirements Covered

[List requirement IDs from FRD, e.g., P-001 through P-012]

## Scope Capsule (copy into Cursor)

Goal: <1 sentence>
Allowed files: <explicit list>
Forbidden: anything else
Output: unified diff only, ±3 lines context, no commentary
Ask: 1 question if blocked
Run: <verification commands>

## Implementation Steps

### Phase 1: [Name]

- [ ] Step 1
- [ ] Step 2

### Phase 2: [Name]

- [ ] Step 1

## File Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `path/to/file` | Create / Update | Description |

## Database Schema

[If applicable – include migration steps]

## API Routes

[If applicable]

## Components

[If applicable]

## Rollout / Rollback (if needed)

- Rollout:
- Rollback:
```

## Rules

### Pause for Review

* If **High risk** (per Risk Gate): STOP after creating `notes.md` and `implementation.md` and wait for explicit user approval.
* If **Low / Medium risk**: proceed after planning unless user says “stop”.

### DO NOT Modify FRDs

The FRD is the source of truth.

* If the FRD has errors or gaps, note them in `notes.md` under **FRD Issues**
* Propose FRD changes separately, not during implementation
* Implementation must conform to FRD requirements

### Reset Before New Features

Always reset the directory when switching features. Delete all files except `README.md`:

```bash
cd working-feature && find . -type f ! -name 'README.md' -delete
```

### Context Loading

When working on implementation, load:

1. `memory/entrypoints.md` (start here — see Memory-First Skill)
2. `working-feature/notes.md`
3. `working-feature/implementation.md`
4. The target FRD (read-only reference)
5. Relevant `memory/flows/*.mmd` and `memory/contracts/*.md`
6. `product-docs/system-architecture.md` (for tech stack and constraints)

Do NOT load other FRDs unless there is a cross-feature dependency.

### Memory Maintenance

The `memory/` directory contains a token-efficient context pack. See `.agents/skills/memory-first/SKILL.md` for what belongs in memory.

#### During Planning

After creating `notes.md` and `implementation.md`, determine if the planned change impacts:

- **Entrypoints**: New routes, server actions, or flow triggers
- **Invariants**: Auth, validation, error handling, or integration behavior
- **Flows**: Request/data flow changes worth diagramming
- **Contracts**: API shapes, env vars, external integrations

If yes, add explicit checklist items to `implementation.md`:

```markdown
## Memory Updates

- [ ] Update `memory/entrypoints.md` (new route: /foo)
- [ ] Update `memory/contracts/api.md` (new action: doThing)
- [ ] Create `memory/flows/foo-flow.mmd` (new flow)
```

#### During Execution

When implementation changes any of the following, update memory in the **same phase** (not after):

- Routes or page entrypoints
- Server actions or API contracts
- Env vars or config requirements
- Flow logic (validation, integrations, error handling)
- Invariants (auth, retry behavior, etc.)

#### Before Commit

Run a memory check:

1. If touched areas imply memory drift → ensure memory was updated
2. If no drift → add to `working-feature/notes.md`:

   ```markdown
   ## Memory

   Memory unchanged — no new entrypoints, flows, or contracts.
   ```

#### Memory Guidelines

- **Keep it small**: Target <= 50 KB total
- **Summarize, don't dump**: No full code blocks in memory
- **Code anchors**: Mermaid nodes reference file paths and symbols
- **Split large diagrams**: If a flow diagram exceeds ~50 lines, split it

### Keep notes.md Light

`notes.md` is for:

* High-level decisions
* Constraints discovered during implementation
* Acceptance + verification
* Questions to resolve
* Things explicitly out of scope
* FRD issues (if any found)

NOT for:

* Detailed implementation steps (use `implementation.md`)
* Code snippets (use `implementation.md`)

### Keep implementation.md Actionable

`implementation.md` should be:

* Specific enough to execute
* Organized in phases/steps
* Updated as work progresses (check off completed items)
* Include file paths, schema definitions, component names

### Token Efficient Output Defaults

* Prefer **unified diffs** / patches
* Do not restate unchanged code
* No explanations unless explicitly asked
* Do not widen scope or add “nice-to-haves” unless requested
* If blocked, ask **exactly one** short question

## Completion Workflow

### After Each Phase

When a phase is completed:

1. Ask:

   * “Phase complete — continue to next phase or adjust plan?”

2. If continuing: proceed with the next phase from `implementation.md`

3. If done:

   * Propose a commit message following this format:

     ```
     <type>: <short summary>

     <optional body explaining what and why>
     ```

   * Types: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`

   * Wait for user confirmation or edits to the message

4. Update checklists before committing:

   * `working-feature/implementation.md` (check off completed items)
   * `product-docs/features/<feature-name>/checklist.md` (if checklist exists)

5. After commit message confirmed: execute the git commit following the Selective Commit Protocol below.

## Selective Commit Protocol

**IMPORTANT**: Multiple LLM agents may be working in this repository simultaneously. Only commit files directly related to the current task.

1. Run `git status` to see all modified, staged, and untracked files.

2. Identify task-related files: determine which files were modified as part of THIS task only.

3. Check for unrelated changes: if there are modified files NOT related to the current task:

   * List the unrelated files to the user
   * Ask: “These files were also modified but appear unrelated to this task: `[file list]`. Do you want to include them in this commit, or commit only the task-related files?”
   * Wait for user response before proceeding

4. Stage selectively: only stage the files the user confirms:

   ```bash
   git add <file1> <file2> ...
   ```

   Do NOT use `git add -A` or `git add .` unless the user explicitly confirms all changes should be included.

5. Commit:

   ```bash
   git commit -m "<confirmed message>"
   ```

## Resetting the Directory

When the user asks to “reset” or “start fresh” on a new feature:

1. Delete all files in `working-feature/` except `README.md`
2. Create fresh `notes.md` using the template
3. Create fresh `implementation.md` using the template
4. Populate based on the target FRD
