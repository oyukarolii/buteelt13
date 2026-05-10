# AI Usage Report — Library Management System

**Course**: F CSM311 — Burdaalt 13
**Phase**: C (Reflect)
**Student**: Агваны Отгонбаяр
**Date**: 2025-05-09

---

## 1. Юг AI хийсэн, юг өөрөө хийсэн?

### AI хийсэн зүйлс

**Boilerplate болон бүтэц үүсгэх** нь AI-ийн хамгийн тод оролцоо байлаа.
`BooksService.js`, `LoansService.js`, `MembersService.js` гурван файлын анхны
бүтцийг бүхэлд нь Claude үүсгэсэн. Класс бүтэц, method-уудын нэр, JSDoc
annotation, error code тогтолцоо — эдгээр бүгдийг нэг prompt-оор авсан.
Энэ нь ойролцоогоор 350 мөр код бөгөөд гараар бичвэл 2-3 цаг зарцуулах байлаа.

**Unit test үүсгэх** нь AI-ийн хоёр дахь гол хувь нэмэр. `/test` slash command
ашиглан 18 тест нэг session-д гарлаа. Тест бүр Testing Pyramid-ын аль давхаргад
хамаарахаа тодорхой тэмдэглэсэн, AAA (Arrange-Act-Assert) pattern баримталсан,
in-memory SQLite ашигласан. Хэрэв тест бүрийг гараар бодож бичвэл тус бүр 10-15
минут зарцуулна — нийт 3-4 цаг болох байсан.

**Баримт бичиг (documentation)** бүхэлдээ AI-ийн бүтээл. `partA/ARCHITECTURE.md`
дахь Mermaid диаграм (module, sequence, ER гурвуулаа), `STACK-COMPARISON.md`
дахь харьцуулалтын хүснэгт, `openapi.yaml` дахь бүх endpoint тайлбар, `CLAUDE.md`
дахь no-go zone жагсаалт — эдгээр бүгд Claude үүсгэсэн.

**Slash command-уудын system prompt** боловсруулах ажлыг AI хийсэн. `/review`,
`/test`, `/docs`, `/commit`, `/security`, `/refactor` зургаан командын нарийн
зааварчилгааг OWASP, Testing Pyramid, Conventional Commits, Lec07 refactoring
pattern зэрэг сурч судалсан material дээр үндэслэн бичсэн.

### Өөрөө хийсэн зүйлс

**Архитектурын шийдвэр** бүхэлдээ хүний гар дээр байлаа. "3 давхар бүтэц
(Routes → Services → DB) ашиглах уу, эсвэл Repository pattern нэмэх үү?" гэсэн
асуултад AI-аас санал авсан ч эцсийн шийдвэр миний өөрийнх. Academic scope-д
Repository layer нэмэх нь over-engineering болно гэж дүгнэн хялбарчилсан.

**Тест assertions шалгах** — AI бичсэн тест бүрийн assert утгыг гараар шалгасан.
Жишээлбэл `expect(book.available).toBe(1)` гэсэн assertion буруу байвал тест
"ногоон" болж байхад бодит алдаа нуугдана. Тиймээс `BooksService.test.js`-ийн
7 тест, `LoansService.test.js`-ийн 8 тест тус бүрийн утгыг өөрөө verify хийсэн.

**Error code системийг зохион байгуулах** — `BOOK_UNAVAILABLE`, `DUPLICATE_ISBN`,
`MEMBER_INACTIVE` зэрэг error code-уудыг `errorHandler.js` дахь HTTP status-тай
уялдуулах нь хүний шийдвэр байлаа. AI нэрийн санал өгсөн ч mapping-ийг өөрөө
тогтоосон.

**Commit granularity (нарийвчлал)** — 15+ commit-ийг хэрхэн хуваах нь бүхэлдээ
миний шийдвэр. `feat(loans): add overdue detection` ба `feat(loans): implement
return transaction` гэж хоёр commit болгох нь AI-ийн зөвлөмж биш, өөрийн сонголт.

---

## 2. Hallucination — AI ямар буруу зүйл санал болгосон? Та яаж олж засав?

### Hallucination 1 — SQLite AUTOINCREMENT буруу ойлголт

AI анх `better-sqlite3` дээр дараах код санал болгосон:

```javascript
// AI-ийн анхны санал (БУРУУ)
const result = db.prepare('INSERT INTO books ...').run(...);
return result.insertId; // ← MySQL-ийн property!
```

`result.insertId` нь MySQL/PostgreSQL-ийн property юм. `better-sqlite3`-д
`result.lastInsertRowid` гэж байдаг. Энэ алдааг `npm test` ажиллуулахад
`undefined` буцааж байснаар олж илрүүлсэн. `better-sqlite3` документацийг
шалгаад `lastInsertRowid` болгон засав.

**Яаж олж илрүүлсэн**: Тест ажиллуулсан — `book.id` нь `undefined` гарсан.
**Зассан арга**: Албан ёсны `better-sqlite3` README шалгаж, зөв property нэр олов.

### Hallucination 2 — `isISBN()` validator

`express-validator`-ийн validator функцийн талаар AI дараах санал өгсөн:

```javascript
// AI-ийн санал
body('isbn').optional().isISBN().withMessage('invalid ISBN')
```

`isISBN()` нь validator.js-д байдаг боловч зарим хуучин хувилбарт ISBN-13-ийг
зөв validate хийдэггүй байсан. Дэлгүүрийн ном (`9780132350884`) validate
хийхэд `false` буцааж байсан. Энэ нь `express-validator` v7 дахь validator.js
хувилбараас хамаарсан асуудал гэдгийг npm docs-оос олж тогтоов.

**Зассан арга**: `isISBN({ version: '13' })` болгон нарийвчлах, эсвэл
custom regex ашиглах боломжийг судалсан. Одоогоор optional validation-аар
үлдээсэн — production болбол custom validator нэмэх.

---

## 3. Security / License-ийн анхаарал — AI-аас гарсан код ямар нэгэн security risk-тэй байсан уу?

### Security Risk 1 — Helmet middleware дутмаг

AI үүсгэсэн `app.js` дотор `cors()`, `morgan()`, `express.json()` middleware
байсан ч `helmet` нэмэгдээгүй байлаа. `helmet` нь Express-д автоматаар
`X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`
HTTP header-уудыг тавьдаг бөгөөд энэ нь OWASP A05 (Security Misconfiguration)-ийг
шийдэх хамгийн энгийн арга. `/security` slash command ажиллуулахад энэ дутагдлыг
шууд тодорхойлсон.

**Засал**: `npm install helmet` + `app.use(helmet())` нэмэх.

### Security Risk 2 — Error stack trace задрах

AI-ийн `errorHandler.js` анхны хувилбарт:

```javascript
// БУРУУ — stack trace хэрэглэгчид харагдана
res.status(500).json({ error: err.message, stack: err.stack });
```

Production дахь `err.stack` нь сервер бүтцийг (file path, module нэр, мөрийн дугаар)
задруулдаг. Энэ нь OWASP A05-тай холбоотой. `/security` audit хийхэд тодорхойлж,
500 алдаанд зөвхөн `"Internal server error"` буцаах болгон засав.

### Security Risk 3 — Rate limiting дутмаг

`POST /api/loans` endpoint-д rate limit байхгүй. Энэ нь автоматаар олон loan
үүсгэх халдлагад өртөх боломжтой. `express-rate-limit` package нэмэх шаардлагатай
ч MVP scope-д тэмдэглэлд үлдээсэн.

### License анхаарал

`better-sqlite3` — MIT license ✅
`express` — MIT license ✅
`express-validator` — MIT license ✅
`jest` — MIT license ✅

Бүх dependency-уудын license нь MIT бөгөөд academic болон commercial ашиглалтанд
хязгааргүй. `npm audit` ажиллуулахад 0 known vulnerability гарав.

---

## 4. Юг AI-аар хурдан хийсэн? (Production benefit)

**Хамгийн том давуу тал**: Boilerplate code-ийн хурд. Service, route,
middleware гурвыг нэгэн зэрэг consistency-тэй үүсгэх нь AI-гүйгээр хийвэл
тус бүрийг ялгаатай бичих, дараа нь нэгтгэх асуудал гардаг. AI нэг session-д
нэгдмэл naming convention, error handling pattern, JSDoc format баримталж бүгдийг
үүсгэсэн.

**Тоон байдлаар**: Б хэсгийн 27 файл, ~800 мөр кодыг 1 session-д (~3 цаг)
дуусгасан. Гараар хийвэл өдрийн ажил (8+ цаг) болох байлаа. Хугацааны хэмнэлт
~60-70%.

**Testing Pyramid шаардлагыг хангах**: 10+ тест бичих шаардлага нь AI-гүйгээр
дарамттай байх байлаа. Тест тус бүрийн edge case-ийг AI санал болгосон нь
("что же можно еще тестировать?" гэдгийн хариулт) өөрийгөө дахин сануулав.

---

## 5. Юг AI-аар удаан хийсэн? (Бэрхшээл, антипаттерн)

**Verification цаг зарцуулалт**: AI-ийн гаралт бүрийг шалгах нь нийт хугацааны
30-40%-ийг эзэлсэн. "Verify, don't trust" зарчим нь зөв ч практикт ачааллах.
Жишээлбэл `LoansService.js`-ийн `db.transaction()` ажиллагааг мэдэхгүй байсан тул
хуурамч тест бичиж туршив — хоосон зарцуулалт.

**Context window хязгаарлалт**: Урт conversation дотор AI өмнөх шийдвэрийг
мартдаг. Session-ийн дундуур `errorHandler.js`-ийн error code-уудыг
`BooksService.js`-тэй уялдуулах шаардлага гарахад AI өмнөх кодын контекстийг
алдаж, шинээр нэр санал болгосон. `BOOK_NOT_FOUND` vs `NOTFOUND_BOOK` зэрэг
зөрчил гарч, гараар нэгтгэх шаардлагатай болсон.

**Over-engineering санал**: AI заримдаа scope-оос давсан санал өгдөг. "Repository
pattern нэмэх үү?", "Redis кэш ашиглах уу?", "JWT authentication?" — эдгээр бүгдийг
academic MVP-д хэрэггүй гэж татгалзах шийдвэр гаргах нь хүний үүрэг байв.

---

## 6. Skill Atrophy эрсдэлийг өөртөө яаж зохицуулсан?

"AI байхгүй" цаг гаргасан уу гэвэл — шууд хариулт: **зарим хэсэгт гаргасан**.

`db.js` дахь schema-г гараар бичсэн. SQLite foreign key pragma, WAL journal mode,
index үүсгэх syntax — эдгээрийг AI-д өгөхгүйгээр өөрөө бичиж, дараа нь AI-аар
шалгуулсан. Энэ нь "AI шалгагч, хүн бичигч" дүрийг туршиж үзсэн туршлага.

`errorHandler.js`-ийн HTTP status mapping (`422 Unprocessable` vs `409 Conflict`
ялгааг) өөрөө шийдсэн. RFC 9110 стандарт шалган, AI-аас зөвхөн template авсан.

**Гэсэн хэдий ч**, тест бүр болон route бүрийг AI бичсэн нь сул тал болж мэдэхийг
анзаарч байна. Дараагийн project-д "тест эхлээд гараар бич, дараа AI-аар нэмэлт
хий" (TDD + AI assist) арга барилыг туршиж үзнэ.

**Дүгнэлт**: AI нь productivity хэрэгсэл — мотоцикл шиг. Хурдан явдаг ч жолоодох
ур чадвар суларч болно. "Verify, don't trust" + "зарим хэсгийг заавал гараар хий"
гэсэн тэнцвэр чухал.

---

*Нийт үг: ~1600*
