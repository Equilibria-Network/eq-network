# Handoff NNNN: <title>

- Date: YYYY-MM-DD
- From: <session/agent> → To: the next agent/session
- Branch: <git branch> · Last commit: <sha + subject>
- Status of the working tree: <clean / what is uncommitted and why>

> Handoffs live in `docs/handoffs/` (gitignored). This is working context for the next agent, not a
> committed record. Durable decisions belong in ADRs; durable work belongs in tasks.

## 1. TL;DR — where things stand

Two or three sentences: what was being done, how far it got, what the next agent should do first.

## 2. Read these in full before doing anything

Ordered. Say _why_ each matters and what to extract from it.

- `path/to/file` — why.

## 3. What is done (and verified how)

Bullet the completed work with commit shas and the evidence that it works (build/lint/tests/manual).

## 4. What remains — in order

Numbered, with the causal dependencies called out (do X before Y because …). Point each item at its task
file. Flag anything that is blocked on an owner decision, and name the decision.

## 5. Open decisions needed from the owner

The specific questions, each with the smallest set of options and what changes based on the answer.

## 6. Landmines / context the next agent will not infer

Non-obvious things: retracted findings, gotchas, running processes (dev server ports), tool quirks,
conventions to honour (e.g. commit-attribution voice, no em dashes), things that look wrong but are right.

## 7. How to resume

The exact commands / branch / server state to pick up cleanly (e.g. "dev server runs at …; `pnpm …`").
