# AI Build Session 1 — Core Services & Tests

**Phase**: B (Build)
**Date**: 2025-05-09
**Tool**: Claude Sonnet (Anthropic)
**Session goal**: Implement 5 features + write ≥10 unit tests

---

## What was built in this session

### Features implemented
1. `BooksService.js` — CRUD захиалах, хайлт хийх, бэлэн байдлыг шалгах, ISBN хамгаалалтын давхардлыг захиалах
2. `MembersService.js` — Гишүүнчлэлийн бүртгэл, идэвхгүй болгох, идэвхтэй зээлийн хамгаалагч
3. `LoansService.js` — Гүйлгээ, буцаалт, хугацаа хэтэрсэн баримт илрүүлэхтэй холбоотой асуудал
4. Бүх 3 нөөцийн экспресс маршрутууд
5. OWASP-аас аюулгүй алдааны хариу үйлдэлтэй төв алдааны зохицуулагч

### Tests generated (AI, human-reviewed)
- `BooksService.test.js` — 7 tests
- `LoansService.test.js` — 8 tests
- `MembersService.test.js` — 3 tests
- Total: **18 unit tests**

All tests use an in-memory SQLite database. No mocks for the DB layer —
real SQL runs in memory, which tests actual query correctness.

---

## Ашигласан prompt

**Prompt 1** — Architecture confirmation
> "Node.js + Express + SQLite. 5 features: book inventory, members, loans, return/overdue, search. Implement BooksService first with full JSDoc."

**Claude output**: Full `BooksService.js` with 5 methods, JSDoc, error codes.
**Human review**: Added `isAvailable()` method, confirmed error code names match errorHandler.

**Prompt 2** — Test generation
> "/test BooksService.js — generate unit tests using Testing Pyramid, AAA pattern, in-memory SQLite"

**Claude output**: 7 tests covering CRUD, duplicate, filter, edge case.
**Human review**: Verified assertions, confirmed `setDb()` pattern for test isolation.

**Prompt 3** — LoansService
> "Implement LoansService with issue (with SQLite transaction), returnBook, getOverdue. Use existing error code pattern."

**Claude output**: Full `LoansService.js` with transaction for atomicity.
**Human review**: Confirmed `db.transaction()` wraps both INSERT and UPDATE correctly.

**Prompt 4** — Security check
> "/security — check routes and services for OWASP issues"

**Claude output**: Identified missing `helmet`, no rate limiting on POST endpoints.
**Human action**: Added to CLAUDE.md no-go zones; helmet to be added in next session.

---

## AI contribution notes

- All service files: AI-generated, human-reviewed and approved
- All test files: AI-generated, human-verified assertions line by line
- openapi.yaml: AI-generated from routes, human-confirmed endpoint accuracy
- No AI output committed without human review
