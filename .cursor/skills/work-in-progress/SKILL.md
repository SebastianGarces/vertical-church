---
name: work-in-progress
description: Use to plan and execute current feature implementation.
---

# WIP – Working Feature Implementation Skill

## Quick Reference

1. **Reset** → Create `notes.md` + `implementation.md`
2. **Risk Gate** → High-risk? STOP for approval
3. **Break down tasks** → Assign to subagents (parallel where possible)
4. **Execute** → Each subagent works in designated scope
5. **Review** → `@code-reviewer` must review before commit
6. **Commit** → Selective staging only

## Available Subagents

| Subagent | Model | Responsibilities |
|----------|-------|------------------|
| `@architect` | claude-opus-4-5 | System design, planning, documentation, big-picture decisions |
| `@frontend-engineer` | gemini-3-pro | UI components, React, Tailwind, shadcn/ui |
| `@backend-engineer` | claude-opus-4-5 | Server Actions, API routes, Next.js config, data fetching |
| `@code-reviewer` | gpt-5.2-codex-high | Security, performance, best practices review |

## Directory Structure

```
working-feature/
├── README.md           # Permanent - do not delete
├── notes.md            # High-level notes for current feature
└── implementation.md   # Detailed implementation plan
```

## Workflow

### 1. Starting a New Feature

1. Reset the directory (keep only `README.md`)
2. Create `notes.md` and `implementation.md` using templates below
3. Apply **Risk Gate**
4. Apply **Parallel Work Breakdown**

## Risk Gate

Determine risk level before proceeding.

| Risk Level | Examples | Behavior |
|------------|----------|----------|
| **High** | DB migrations, auth, payments, security flows | STOP after planning, wait for approval |
| **Low/Medium** | UI changes, refactors, non-breaking API changes | Proceed unless user says "stop" |

## Parallel Work Breakdown

Break down tasks to enable parallel execution across subagents.

### Process

1. **Identify independent workstreams**: Separate frontend, backend, and config tasks
2. **Define contracts first**: API shapes, Server Action signatures, component props, data models
3. **Assign and tag tasks** in `implementation.md`:

```markdown
### Phase 1: Foundation (Parallel)
- [ ] Define API contract → `@architect`
- [ ] Create ItemCard component → `@frontend-engineer`
- [ ] Implement getItems action → `@backend-engineer`

### Phase 2: Integration (Sequential, depends on Phase 1)
- [ ] Wire ItemCard to action → `@frontend-engineer`
```

### Delegation Rules

- **Architecture questions** → `@architect` (before implementation)
- **UI/UX** → `@frontend-engineer`
- **Server logic** → `@backend-engineer`
- **Cross-cutting** → `@architect` defines approach, then delegate

### Execution

1. Start independent tasks simultaneously
2. Each subagent works within designated scope
3. Reconvene at integration points
4. Resolve contract mismatches before proceeding

## Code Review Gate (REQUIRED)

**Before any commit**, invoke `@code-reviewer`:

```
@code-reviewer Review the changes for [feature name]
```

- 🔴 **Critical**: Must fix before commit
- 🟠 **Warnings**: Fix unless documented reason to defer
- 🟡 **Suggestions**: Optional, document if skipped

## Rules

### FRD is Source of Truth

- Do NOT modify FRDs during implementation
- Note errors/gaps in `notes.md` under **FRD Issues**
- Propose FRD changes separately

### Context Loading

Load in order:
1. `memory/entrypoints.md`
2. `working-feature/notes.md` and `implementation.md`
3. Target FRD (read-only)
4. Relevant `memory/flows/*.mmd` and `memory/contracts/*.md`

### Memory Maintenance

See `.agents/skills/memory-first/SKILL.md`. Key rule: update memory in the **same phase** as implementation, not after.

If no memory changes needed, note in `notes.md`:
```markdown
## Memory
Memory unchanged — no new entrypoints, flows, or contracts.
```

### File Guidelines

**notes.md** — High-level only: decisions, constraints, acceptance criteria, open questions, out of scope, FRD issues. NO implementation details or code.

**implementation.md** — Actionable: specific steps, file paths, schema definitions, component names. Update as work progresses.

### Token Efficiency

- Prefer unified diffs / patches
- Do not restate unchanged code
- No explanations unless asked
- If blocked, ask **one** short question

## Completion Workflow

### After Each Phase

1. Ask: "Phase complete — continue to next phase or adjust plan?"
2. Update checklists in `implementation.md`

### Before Commit

1. Ensure `@code-reviewer` has reviewed
2. Propose commit message:
   ```
   <type>: <short summary>
   
   <optional body>
   ```
   Types: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`
3. Wait for user confirmation

## Selective Commit Protocol

Multiple agents may work simultaneously. Only commit task-related files.

1. `git status` to see all changes
2. Identify files for THIS task only
3. If unrelated changes exist, ask user before including
4. Stage selectively: `git add <file1> <file2>` (never `git add .` without confirmation)
5. Commit with confirmed message

---

## Templates

### notes.md

```markdown
# [Feature Name] – Implementation Notes

**FRD:** `product-docs/features/<feature-name>/frd.md`
**Date Started:** YYYY-MM-DD
**Risk Level:** Low / Medium / High

## Goal
[One sentence]

## Key Decisions
-

## Constraints
-

## Acceptance Criteria
- [ ] 

## Verification
- Commands to run
- Manual checks

## Open Questions
-

## Out of Scope
-

## FRD Issues
-
```

### implementation.md

```markdown
# [Feature Name] – Implementation Plan

**FRD:** `product-docs/features/<feature-name>/frd.md`
**Scope:** MVP / Full / Specific requirements

## Requirements Covered
[List requirement IDs, e.g., P-001 through P-012]

## Implementation Steps

### Phase 1: [Name] (Parallel/Sequential)
- [ ] Task → `@subagent`
- [ ] Task → `@subagent`

### Phase 2: [Name]
- [ ] Task → `@subagent`

## File Changes

| File | Change | Description |
|------|--------|-------------|
| `path/to/file` | Create/Update | Description |

## Pre-Commit Checklist
- [ ] Implementation complete
- [ ] `@code-reviewer` review done
- [ ] 🔴 Critical issues resolved
- [ ] 🟠 Warnings addressed
- [ ] Memory updated (if applicable)
- [ ] Ready for commit

<!-- Optional sections as needed: Database Schema, API Routes, Components, Rollout/Rollback -->
```

## Resetting the Directory

```bash
cd working-feature && find . -type f ! -name 'README.md' -delete
```
