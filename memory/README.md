# Memory Pack

Token-efficient context for AI agents working in this repo.

## Purpose

This directory contains a curated "context pack" that captures the repo's key flows, contracts, and invariants. Agents should load memory files **before** opening source code to minimize token usage and file reads.

## Size Budget

**Target: <= 50 KB total** across all memory files.

Keep content minimal and code-anchored. Summarize; don't dump.

## Usage

1. **Start here**: Read `entrypoints.md` to understand where flows begin
2. **Check flows**: Load relevant `flows/*.mmd` diagrams for the task
3. **Check contracts**: Load relevant `contracts/*.md` for API/config details
4. **Check invariants**: Read `invariants.md` for stable truths

## When Memory Suffices

- Understanding a flow's shape and dependencies
- Knowing which files to modify for a given feature
- Understanding env var requirements
- Checking API contracts and schemas

## When to Open Code

- Implementing specific logic within a function
- Debugging runtime behavior
- Understanding exact component props or styling
- Modifying code that isn't covered by memory

## Directory Structure

```
memory/
├── README.md           # This file
├── index.md            # Table of contents
├── entrypoints.md      # Where flows start
├── invariants.md       # Stable truths
├── flows/              # Mermaid flow diagrams
│   └── *.mmd
└── contracts/          # API, config, events
    ├── api.md
    ├── db.md
    ├── events.md
    └── config.md
```

## Maintenance

Memory should be updated when:
- New entrypoints are added
- Flow logic changes significantly
- API contracts change
- New env vars are required
- Invariants change

See `.agents/skills/memory-first/SKILL.md` for agent instructions.
