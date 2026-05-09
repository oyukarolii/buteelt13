# Architecture — Library Management System

## Module Overview

The system is divided into three layers: **API (Routes)**, **Service (Business Logic)**,
and **Data (SQLite via better-sqlite3)**.

---

## Layer Diagram

```mermaid
graph TD
    Client["🌐 Client (Browser / curl)"]
    Router["Express Router\n/api/books\n/api/members\n/api/loans"]
    BooksService["BooksService\n- addBook()\n- searchBooks()\n- deleteBook()"]
    MembersService["MembersService\n- registerMember()\n- getMember()\n- deactivate()"]
    LoansService["LoansService\n- issueLoan()\n- returnBook()\n- getOverdue()"]
    DB[("SQLite Database\nlibrary.db")]

    Client --> Router
    Router --> BooksService
    Router --> MembersService
    Router --> LoansService
    BooksService --> DB
    MembersService --> DB
    LoansService --> DB
```

---

## Data Flow — Issue a Loan

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Router
    participant LS as LoansService
    participant BS as BooksService
    participant DB as SQLite

    C->>R: POST /api/loans { bookId, memberId, dueDate }
    R->>LS: issueLoan(bookId, memberId, dueDate)
    LS->>BS: isAvailable(bookId)
    BS->>DB: SELECT available FROM books WHERE id=?
    DB-->>BS: { available: true }
    BS-->>LS: true
    LS->>DB: INSERT INTO loans ...
    LS->>DB: UPDATE books SET available=false WHERE id=?
    DB-->>LS: ok
    LS-->>R: { loanId, dueDate }
    R-->>C: 201 Created { loanId, dueDate }
```

---

## Database Schema

```mermaid
erDiagram
    BOOKS {
        int id PK
        string isbn
        string title
        string author
        string genre
        bool available
        datetime created_at
    }
    MEMBERS {
        int id PK
        string name
        string email
        bool active
        datetime joined_at
    }
    LOANS {
        int id PK
        int book_id FK
        int member_id FK
        datetime issued_at
        datetime due_date
        datetime returned_at
    }

    BOOKS ||--o{ LOANS : "loaned via"
    MEMBERS ||--o{ LOANS : "borrows"
```

---

## Module Descriptions

| Module | Path | Responsibility |
|--------|------|----------------|
| `app.js` | `src/` | Express app setup, middleware |
| `server.js` | `src/` | HTTP server entry point |
| `db.js` | `src/db/` | SQLite connection + schema init |
| `books.routes.js` | `src/routes/` | HTTP routes for books |
| `members.routes.js` | `src/routes/` | HTTP routes for members |
| `loans.routes.js` | `src/routes/` | HTTP routes for loans |
| `BooksService.js` | `src/services/` | Book business logic |
| `MembersService.js` | `src/services/` | Member business logic |
| `LoansService.js` | `src/services/` | Loan + overdue logic |
