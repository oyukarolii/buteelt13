# ADR-001: Technology Stack Selection

**Date**: 2025-05-06
**Status**: Accepted
**Deciders**: Solo developer (F CSM311)

---

## Context

Бид номын сангийн удирдлагын REST API-д зориулсан backend стекийг сонгох хэрэгтэй.
Систем нь ном, гишүүд болон зээлд зориулсан CRUD үйлдлүүдийг шаарддаг бөгөөд
дор хаяж 10 unit tests, цэвэр төслийн бүтэцтэй.

Гол хязгаарлалтууд:
- Бие даасан хөгжүүлэгч, эрдэм шинжилгээний төсөл
- Зөв туршилтын пирамид (нэгж + интеграцийн тест)-ийг дэмжих ёстой
- Нэг сессийн дотор тохируулж, ажиллуулах шаардлагатай
- SQLite-г илүүд үздэг (гадаад мэдээллийн сангийн серверийн тохиргоо байхгүй)

---

## Decision

**Selected: Node.js 20 + Express 4 + SQLite (better-sqlite3)**

---

## Rationale

### Node.js over Python (FastAPI)
- Higher personal familiarity → функцийг илүү хурдан хөгжүүлэх
- Ижил хэлийг ямар ч фронтенд ажилд дахин ашиглаж болно
- `better-sqlite3`синхрон бөгөөд энгийн — асинхрон мэдээллийн сангийн нарийн төвөгтэй байдал байхгүй

### Express over alternatives (Fastify, Koa)
- Node.js дахь REST API-уудын хамгийн өргөн баримтжуулсан хүрээ
- Дунд програм хангамжийн экосистем боловсорч гүйцсэн(`express-validator`, `cors`, `morgan`)
- Supertest integration is battle-tested

### SQLite over PostgreSQL / MySQL
- Zero configuration — single `.db` file
- Ганц хэрэглэгчийн эрдэм шинжилгээний төсөлд хангалттай
- Холболтын сан байгуулах эсвэл серверийн удирдлага шаардлагагүй
- Хөгжүүлэлтийн явцад дахин тохируулахад хялбар (`rm library.db && npm run db:init`)

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
- SQLite нь зэрэгцээ бичихийг дэмждэггүй — үйлдвэрлэлийн хэмжээнд тохируулж болохгүй.
- Суурилуулсан төрлийн аюулгүй байдал байхгүй (JSDoc тэмдэглэгээгээр багасгасан)
- Express нь FastAPI-ийн автоматаар үүсгэсэн баримт бичгийн эсрэг гарын авлагын загвар шаарддаг.

### Mitigations
- JSDoc + ESLint нь хангалттай төрлийн зааварчилгаа өгдөг.
- Шаардлагатай бол Swagger/OpenAPI баримт бичгүүдийг дараа нь нэмж болно.

---

## Alternatives Rejected

| Alternative | Reason Rejected |
|-------------|----------------|
| Python/FastAPI | Lower familiarity → slower development |
| Go/Gin | Steepest learning curve, less ecosystem familiarity |
| Deno | Too new, ecosystem gaps for this use case |
| MongoDB | Overkill for relational data (books ↔ loans ↔ members) |
