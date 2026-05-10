# Stack Comparison — Library Management System

Эцсийн технологийг сонгохоос өмнө гурван нэр бүхий стекийг үнэлсэн.

---

## Candidate Stacks

| Criteria | Stack A  | Stack B | Stack C |
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
1. **Highest familiarity** — синтакс дээр бага цаг зарцуулж, функцуудад илүү их цаг зарцуулах
2. **Jest + Supertest** — unit + integration туршилтийн том хослол (Туршилтын пирамидыг дэмжинэ)
3. **npm ecosystem** — `better-sqlite3`, `express-validator`, `nodemon` бүгдийн шууд авах боломжтой
4. **Single language** — API болон ирээдүйн аливаа фронтенд ажилд зориулсан JS
5. **SQLite** — 0 тохиргоотой, файлд суурилсан мэдээллийн сан нь зэрэгцээ ажиллах шаардлагагүй ганцаарчилсан төсөлд тохиромжтой

### Trade-offs Accepted
- Ажиллах үед Go илүү хурдан байх боловч Node.js-ийн хөгжүүлэлтийн хурдны давуу тал нь ганцаарчилсан академик төслийн хувьд үүнээс илүү юм.
- Python/FastAPI нь бас сайн сонголт байх болно; зөвхөн Node.js-ийн танил байдал өндөр байгаа тул хасагдсан.
