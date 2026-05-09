# Stack Comparison — Library Management System

Three candidate stacks were evaluated before selecting the final technology.

---

## Candidate Stacks

| Criteria | Stack A ✅ | Stack B | Stack C |
|----------|-----------|---------|---------|
| **Runtime** | Node.js 20 | Python 3.12 | Go 1.22 |
| **Framework** | Express 4 | FastAPI | Gin |
| **Database** | SQLite (better-sqlite3) | SQLite (aiosqlite) | SQLite (modernc) |
| **Testing** | Jest + Supertest | pytest | testing package |
| **Learning curve** | Low | Low | Medium |
| **Async support** | Callbacks/Promises | Native async/await | Goroutines |
| **Ecosystem size** | Very large (npm) | Large (pip) | Medium |
| **Setup speed** | Fast | Fast | Slower |
| **Type safety** | Optional (JSDoc) | Optional (type hints) | Strong (built-in) |
| **Cold start** | Fast | Moderate | Very fast |

---

## Evaluation Scores (1–5)

| Criteria | Weight | Node/Express | FastAPI | Go/Gin |
|----------|--------|-------------|---------|--------|
| Familiarity | 30% | 5 | 4 | 2 |
| Ecosystem | 25% | 5 | 4 | 3 |
| Performance | 20% | 3 | 3 | 5 |
| Testing tools | 15% | 5 | 5 | 3 |
| Deployment ease | 10% | 4 | 4 | 5 |
| **Weighted Total** | | **4.55** | **3.95** | **3.15** |

---

## Selected Stack: Node.js + Express + SQLite

### Reasons
1. **Highest familiarity** — less time spent on syntax, more on features
2. **Jest + Supertest** — excellent combo for unit + integration testing (supports Testing Pyramid)
3. **npm ecosystem** — `better-sqlite3`, `express-validator`, `nodemon` all available instantly
4. **Single language** — JS for both API and any future frontend work
5. **SQLite** — zero-config, file-based DB ideal for a solo project with no concurrency needs

### Trade-offs Accepted
- Go would be faster at runtime, but the development speed advantage of Node.js outweighs this for a solo academic project
- Python/FastAPI would also be a solid choice; ruled out only because Node.js familiarity is higher
