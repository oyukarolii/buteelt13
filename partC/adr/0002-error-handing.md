# ADR-002: Centralized Error Handling Strategy

**Date**: 2025-05-09
**Status**: Accepted
**Deciders**: Solo developer (F CSM311) + AI consultation (Claude)

---

## Context

Build явцад гурван service (`BooksService`, `MembersService`, `LoansService`) тус
бүрд алдаа боловсруулах хэрэгтэй болсон. Анхны аргачлалд тус бүр дотроо
`try/catch` ашиглаж, HTTP status-ыг route дотор шийддэг байлаа:

```javascript
// Анхны хандлага — REJECTED
router.post('/', (req, res) => {
  try {
    const book = BooksService.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      res.status(409).json({ error: 'Duplicate ISBN' });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});
```

Энэ хандлагын асуудлууд:
1. Алдааны мэсэж string-ийн агуулгаас хамааралтай (`includes('UNIQUE constraint')`) — fragile
2. HTTP status logic route файл бүрт давтагдана — DRY зөрчил
3. SQLite-ийн internal error мэсэж хэрэглэгчид задарч болно — security risk

---

## Decision

**Бизнесийн алдааг тодорхой `code` property-тэй custom Error болгох,
`errorHandler.js` middleware дотор HTTP status-т mapping хийх.**

```javascript
// Service дотор
const err = new Error('Book with this ISBN already exists');
err.code = 'DUPLICATE_ISBN';
throw err;

// errorHandler.js дотор — нэг газарт бүх mapping
const statusMap = {
  DUPLICATE_ISBN:  409,
  BOOK_NOT_FOUND:  404,
  BOOK_UNAVAILABLE: 422,
  // ...
};
res.status(statusMap[err.code] || 500).json({ error: err.message, code: err.code });
```

---

## Rationale

### AI-тай ярилцсан байдал

Claude-д: *"Service-д throw хийж, route дотор catch хийх үү, эсвэл middleware
ашиглах үү?"*

Claude-ийн хариу: Middleware хандлагыг санал болгосон, учир нь:
- Express-ийн 4 параметртэй middleware (`err, req, res, next`) яг энэ зориулалтаар бүтсэн
- Routes нь `next(err)` дуудаж алдааг "delegate" хийж, HTTP concern-оос чөлөөлөгдөнө
- Нэг газарт алдааны format тогтоож, security check хийж болно (stack trace нуух)

**Хүний шийдвэр**: `code` property тогтолцооны нэрийг өөрөө тодорхойлсон.
Claude нь `ERROR_BOOK_NOT_FOUND` гэх санал өгсөн ч `BOOK_NOT_FOUND` (богиносгосон)
нь уншихад хялбар гэж дүгнэв.

### OWASP A05 холболт

`errorHandler.js` дотор `NODE_ENV === 'production'` шалгаж, production орчинд
stack trace буцаадаггүй болгосон. Энэ нь OWASP A05 (Security Misconfiguration)
шаардлагыг шууд хангаж байна.

---

## Consequences

### Positive
- Route файл бүр `try { ... } catch(err) { next(err); }` гэж богино бичиж болно
- Шинэ алдааны код нэмэхэд зөвхөн `errorHandler.js`-д нэг мөр нэмэх хангалттай
- Test дотор `expect(err.code).toBe('DUPLICATE_ISBN')` гэж тодорхой assert хийж болно
- Production-д stack trace задардаггүй — security зөв

### Negative
- `errorHandler.js` цаашид том болж болно (30+ алдааны код)
- Custom Error class (`class BookError extends Error`) ашиглаагүй — future refactor point

### Mitigations
- Алдааны код-уудыг `src/constants/errors.js` файлд төвлөрүүлэх (next refactor)
- Алдааны тоо 20+ болвол error class-уудаар бүлэглэх

---

## Alternatives Rejected

| Хандлага | Татгалзсан шалтгаан |
|----------|-------------------|
| Route бүрт try/catch + status шийдэх | DRY зөрчил, fragile string matching |
| HTTP status-г service-ээс буцаах | Service нь HTTP-г мэдэх ёсгүй (separation of concerns) |
| Custom Error class шатлал | Academic scope-д over-engineering |
