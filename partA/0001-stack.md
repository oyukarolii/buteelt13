# ADR-001: Technology Stack Selection

**Date**: 2025-05-08
**Status**: Accepted
**Deciders**: Solo developer (F CSM311)

---

## Context

We need to select a backend stack for a library management REST API.
The system requires CRUD operations for books, members, and loans,
with at least 10 unit tests and a clean project structure.

Key constraints:
- Solo developer, academic project
- Must support a proper Testing Pyramid (unit + integration tests)
- Needs to be set up and running within one session
- SQLite is preferred (no external DB server setup)

---

## Decision

**Selected: Node.js 20 + Express 4 + SQLite (better-sqlite3)**

---

## Rationale

### Node.js over Python (FastAPI)
- Higher personal familiarity → faster feature development
- Same language can be reused for any frontend work
- `better-sqlite3` is synchronous and simple — no async DB complexity

### Express over alternatives (Fastify, Koa)
- Most widely documented framework for REST APIs in Node.js
- Middleware ecosystem is mature (`express-validator`, `cors`, `morgan`)
- Supertest integration is battle-tested

### SQLite over PostgreSQL / MySQL
- Zero configuration — single `.db` file
- Sufficient for a single-user academic project
- No connection pooling or server management needed
- Easy to reset during development (`rm library.db && npm run db:init`)

### Jest + Supertest for testing
- Jest is the de facto standard for Node.js unit testing
- Supertest allows full HTTP-layer integration tests without a running server
- Coverage reporting built-in (`--coverage` flag)

---

## Consequences

### Positive
- Fast setup: `npm install` + `npm run dev` is sufficient
- Single language throughout the stack
- Excellent testing tooling satisfies the Testing Pyramid requirement

### Negative
- SQLite does not support concurrent writes — not production-scalable
- No built-in type safety (mitigated with JSDoc annotations)
- Express requires manual boilerplate vs FastAPI's auto-generated docs

### Mitigations
- SQLite limitation is acceptable for academic scope
- JSDoc + ESLint provide sufficient type guidance
- Swagger/OpenAPI docs can be added later if needed

---

## Alternatives Rejected

| Alternative | Reason Rejected |
|-------------|----------------|
| Python/FastAPI | Lower familiarity → slower development |
| Go/Gin | Steepest learning curve, less ecosystem familiarity |
| Deno | Too new, ecosystem gaps for this use case |
| MongoDB | Overkill for relational data (books ↔ loans ↔ members) |
