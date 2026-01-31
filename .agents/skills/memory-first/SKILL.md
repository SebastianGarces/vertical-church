---
name: memory-first
description: Load memory pack first to minimize tokens and file reads.
---

# Memory-First Skill

## When to Use

- Before starting any implementation task
- When exploring the codebase
- When planning changes to existing features

## Purpose

The `memory/` directory contains a curated context pack that captures the repo's key flows, contracts, and invariants. Loading memory first reduces token usage and avoids unnecessary file reads.

## Required Reading Order

1. **Always start with**: `memory/entrypoints.md`
2. **Then load relevant flow**: `memory/flows/<relevant>.mmd`
3. **Then load relevant contracts**: `memory/contracts/*.md`
4. **Check invariants if modifying behavior**: `memory/invariants.md`

## Rules

### Memory Suffices When

- Understanding where a flow starts and what files it touches
- Knowing which env vars are required
- Understanding API contracts and schemas
- Planning which files need modification

If memory answers your question, **do not open additional source files**.

### Open Code When

- Memory references a file you need to modify
- You need exact implementation details not in memory
- You're debugging specific runtime behavior
- Memory is missing information you need

### Minimal File Reads

- If memory is missing a required detail, open **only** the file(s) referenced by memory nodes
- Prefer reading specific functions over entire files
- If still blocked, ask **exactly one** short question

### Output Defaults

- **Unified diffs only** — no code restatement
- **No explanations** unless explicitly asked
- **Do not widen scope** or add "nice-to-haves"
- If blocked, ask **one question** then stop

## Memory Contents

| File | Purpose |
|------|---------|
| `memory/README.md` | Overview and usage |
| `memory/index.md` | Table of contents |
| `memory/entrypoints.md` | Where flows start |
| `memory/invariants.md` | Stable truths |
| `memory/flows/*.mmd` | Mermaid flow diagrams |
| `memory/contracts/api.md` | Server action contracts |
| `memory/contracts/db.md` | External data stores |
| `memory/contracts/events.md` | Event payloads |
| `memory/contracts/config.md` | Env vars and config |

## What Belongs in Memory

Memory should contain:

- **Entrypoints**: File path + symbol + trigger for each flow
- **Invariants**: Stable truths with source pointers (2 lines max each)
- **Flows**: Mermaid diagrams with code-anchored nodes
- **Contracts**: Summarized API/config/events with file references

Memory should NOT contain:

- Full code dumps
- Detailed implementation logic
- Styling or CSS details
- Entire schemas (summarize + link)

## Size Budget

**Target: <= 50 KB total** across all memory files.

If memory grows too large:
- Split large diagrams
- Summarize more aggressively
- Remove redundant content
