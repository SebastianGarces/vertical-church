# Token Efficiency Rules

Rules for minimizing token usage and file reads.

## Memory-First

1. **Read memory before code**: Always load `memory/entrypoints.md` first
2. **Check flows**: Load relevant `memory/flows/*.mmd` for the task
3. **Check contracts**: Load relevant `memory/contracts/*.md` for API/config details
4. **Skip code if memory suffices**: If memory answers the question, don't open source files

## Output Defaults

1. **Unified diffs only**: Output changes as unified diffs with ±3 lines context
2. **No explanations**: Do not explain code unless explicitly asked
3. **No code restatement**: Do not repeat unchanged code
4. **No scope creep**: Do not add "nice-to-haves" or widen scope

## When Blocked

1. **Ask one question**: If blocked, ask exactly one short question
2. **Minimal file reads**: If memory is missing info, open only the referenced file(s)
3. **Prefer targeted reads**: Read specific functions, not entire files

## Planning

1. **Reference memory**: Cite memory artifacts when planning changes
2. **Memory impact check**: Note if changes affect entrypoints, flows, or contracts
3. **Update memory**: If implementation changes flows/contracts, update memory in same phase

## Commit Messages

Follow conventional commits:

```
<type>: <short summary>

<optional body>
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`
