# Library Management System — Build Phase

> F CSM311 — Burdaalt 13 | Phase B: Implementation

## Quick Start

```bash
# Install
npm install

# Start development server (hot reload)
npm run dev
# → http://localhost:3000

# Run all tests
npm test

# Coverage report
npm run test:coverage
```

## Project Structure

```
library-system/
├── partB/
│   ├── src/
│   │   ├── app.js                    # Express app, middleware, routes
│   │   ├── server.js                 # HTTP server entry point
│   │   ├── db/
│   │   │   └── db.js                 # SQLite singleton + schema init
│   │   ├── routes/
│   │   │   ├── books.routes.js       # GET/POST/PUT/DELETE /api/books
│   │   │   ├── members.routes.js     # GET/POST/PATCH /api/members
│   │   │   └── loans.routes.js       # GET/POST/PATCH /api/loans
│   │   ├── services/
│   │   │   ├── BooksService.js       # Book CRUD + availability
│   │   │   ├── MembersService.js     # Member registration + deactivation
│   │   │   └── LoansService.js       # Issue, return, overdue detection
│   │   └── middleware/
│   │       └── errorHandler.js       # Central error → HTTP status mapper
│   ├── tests/
│   │   └── unit/
│   │       ├── BooksService.test.js  # 7 unit tests
│   │       ├── LoansService.test.js  # 8 unit tests
│   │       └── MembersService.test.js # 3 unit tests (11 total)
│   ├── openapi.yaml                  # OpenAPI 3.0 API spec
│   ├── ai-sessions/                  # AI session logs
│   └── README.md                     # This file
├── partA/                            # Plan phase documents
├── .claude/commands/                 # Custom slash commands
│   ├── review.md    → /review
│   ├── test.md      → /test
│   ├── docs.md      → /docs
│   ├── commit.md    → /commit
│   ├── security.md  → /security
│   └── refactor.md  → /refactor
├── CLAUDE.md                         # AI conventions + no-go zones
└── package.json
```

## Features Implemented

| # | Feature | Endpoints |
|---|---------|-----------|
| 1 | **Book Inventory** | `GET/POST /api/books`, `GET/PUT/DELETE /api/books/:id` |
| 2 | **Member Management** | `GET/POST /api/members`, `GET /api/members/:id`, `PATCH /api/members/:id/deactivate` |
| 3 | **Loan Tracking** | `GET/POST /api/loans` |
| 4 | **Return & Overdue Detection** | `PATCH /api/loans/:id/return`, `GET /api/loans/overdue` |
| 5 | **Search & Filter** | `GET /api/books?search=&available=` |

## API Examples

```bash
# Add a book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Clean Code","author":"Robert Martin","isbn":"9780132350884"}'

# Search available books
curl "http://localhost:3000/api/books?search=clean&available=true"

# Register a member
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'

# Issue a loan
curl -X POST http://localhost:3000/api/loans \
  -H "Content-Type: application/json" \
  -d '{"bookId":1,"memberId":1,"dueDate":"2025-07-01"}'

# Return a book
curl -X PATCH http://localhost:3000/api/loans/1/return

# Check overdue
curl http://localhost:3000/api/loans/overdue
```

## Test Coverage

```
partB/tests/unit/
├── BooksService.test.js   — 7 tests (CRUD, duplicate ISBN, filter, edge cases)
├── LoansService.test.js   — 8 tests (issue, return, overdue, error paths)
└── MembersService.test.js — 3 tests (register, duplicate email, active loan guard)

Total: 18 unit tests — all use in-memory SQLite, no mocking of DB layer
```

## Git Commit Log (≥15 commits)

```
chore: initialize project and plan documents
feat(db): add SQLite schema with books, members, loans tables
feat(books): implement BooksService CRUD and search
test(books): add 7 unit tests for BooksService
feat(members): implement MembersService registration and deactivation
test(members): add 3 unit tests for MembersService
feat(loans): implement LoansService issue and return
feat(loans): add overdue detection with days_overdue calculation
test(loans): add 8 unit tests for LoansService
feat(routes): add Express routes for books, members, loans
feat(middleware): add central error handler with OWASP-safe responses
docs: add OpenAPI 3.0 spec for all endpoints
docs: update partB README with full build documentation
chore: add /security and /refactor slash commands
refactor(services): add guard clauses and JSDoc to all service methods
```
