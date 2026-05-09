# Library Management System

> F CSM311 — Бие даалт 13 | Build phase

A lightweight REST API for managing a personal book collection — track inventory,
register members, issue loans, and monitor overdue books.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Initialize database
npm run db:init

# 3. Start development server
npm run dev

# Server running at http://localhost:3000
```

## Run Tests

```bash
npm test              # all tests
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

---

## API Endpoints

### Books
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/books` | List all books (supports `?search=`, `?available=true`) |
| `POST` | `/api/books` | Add a new book |
| `GET` | `/api/books/:id` | Get book by ID |
| `PUT` | `/api/books/:id` | Update book details |
| `DELETE` | `/api/books/:id` | Remove a book |

### Members
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/members` | List all members |
| `POST` | `/api/members` | Register new member |
| `GET` | `/api/members/:id` | Get member + loan history |
| `PATCH` | `/api/members/:id/deactivate` | Deactivate member |

### Loans
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/loans` | List all active loans |
| `POST` | `/api/loans` | Issue a book to a member |
| `PATCH` | `/api/loans/:id/return` | Mark book as returned |
| `GET` | `/api/loans/overdue` | List overdue loans |

---

## Project Structure

```
library-system/
├── src/
│   ├── app.js              # Express app
│   ├── server.js           # Entry point
│   ├── db/
│   │   └── db.js           # SQLite setup + schema
│   ├── routes/
│   │   ├── books.routes.js
│   │   ├── members.routes.js
│   │   └── loans.routes.js
│   └── services/
│       ├── BooksService.js
│       ├── MembersService.js
│       └── LoansService.js
├── tests/
│   ├── unit/
│   │   ├── BooksService.test.js
│   │   ├── MembersService.test.js
│   │   └── LoansService.test.js
│   └── integration/
│       ├── books.api.test.js
│       └── loans.api.test.js
├── partA/                  # Plan phase documents
├── .claude/commands/       # Custom slash commands
├── CLAUDE.md               # AI collaboration guide
├── package.json
└── README.md
```

---

## Features

1. **Book Inventory** — Add, edit, delete, search books
2. **Member Management** — Register, view, deactivate members
3. **Loan Tracking** — Issue books with due dates
4. **Return & Overdue Detection** — Auto-flag overdue loans
5. **Search & Filter** — Full-text search + availability filter
