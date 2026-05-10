# Self-Evaluation — Library Management System

**Course**: F CSM311 — Burdaalt 13
**Student**: Агваны Отгонбаяр
**Date**: 2025-05-09

---

## 1. Хэрэв шалгалт өнөөдөр болбол би энэ кодыг өөрөө бичиж чадах уу?

**Хариулт: Хэсэгчлэн — тайлбартай**

### Тийм гэж хэлж болох хэсгүүд

**SQLite schema болон `db.js`** — өөрөө бичиж чадна. Энэ хэсгийг AI-гүйгээр
эхлэж бичсэн, дараа нь AI-аар шалгуулсан. Foreign key, WAL journal mode, index
syntax-ийг ойлгосон.

**Error handling middleware** — бичиж чадна. `statusMap` тогтолцоо энгийн.
`err.code` → HTTP status mapping нь switch/object lookup — ойлгомжтой.

**Route handler бүтэц** — бичиж чадна. Express-ийн `router.get/post/put/delete`
syntax, `validationResult` ашиглах арга танил болсон.

**Тест AAA pattern** — бичиж чадна. `beforeEach` дотор in-memory DB үүсгэх,
`afterEach` дотор хаах pattern-ийг гараар туршиж шалгасан.

### Хэцүү байх хэсгүүд

**`db.transaction()` синтакс** — `better-sqlite3`-ийн transaction нь
`db.transaction(fn)()` гэж хоёр дахин дуудах хэлбэртэй. Энэ нь сонин
бөгөөд AI-аас олж мэдсэн. Дахин бичихэд документаци харах шаардлагатай болно.

**`express-validator`-ийн chain syntax** — `.isInt({ min: 1 }).withMessage(...)` 
гэсэн chain-уудыг дурсамжаар бичихэд алдаа гарч болно. Library-ийн документаци
шаардлагатай.

**Mermaid sequence diagram** — тиймгүй. Syntax-ийг AI-аас сурч байна,
бие даан бичих түвшинд хүрээгүй.

### Дүгнэлт

60-70% код дахин бичиж чадна гэж үнэлж байна. Core business logic ойлгогдсон.
Syntax-ийн нарийн ширийн хэсэг (library-specific API-ууд) хэвлэсэн documentation
шаардлагатай.

---

## 2. Дахин хийнэ гэвэл юуг өөрөөр хийх вэ?

### 1 — TDD (Test-Driven Development) эхлэлд ашиглах

Энэ удаад: код бичсэн → тест бичсэн → AI review хийсэн.
Дараагийнх: тест эхлэж бичих → AI-аар code stub үүсгэх → гараар нөхөх.

TDD-д AI нь "тест хангах хамгийн бага код бич" гэж prompt хийхэд маш сайн ажилладаг.
Энэ нь over-engineering-ийг байгалиараа хязгаарладаг.

### 2 — `CLAUDE.md`-ийг эхнээс нь тодорхой бичих

Build явцад `CLAUDE.md` хэд дахин засагдлаа. "SQL injection-оос сэргийлэхийн тулд
parameterized query заавал ашиглах" гэсэн дүрмийг эхний өдрөөс оруулсан байсан бол
AI-ийн гаралт илүү consistent байх байлаа.

### 3 — Feature branch workflow заавал ашиглах

`main` branch дээр шууд commit хийсэн нь хялбар байсан ч курсын shаардлагын
"feature branch ашиглавал илүү сайн" зөвлөмжийг өнгөрөөсөн. Дараагийнх:
```
git checkout -b feat/books-service
# ... код бичих ...
git checkout main && git merge feat/books-service
```

### 4 — AI session log бодитоор хөтлөх

`partB/ai-sessions/build-session-1.md`-д бичсэн зүйл нь retroactively нэгтгэсэн.
Бодит conversation-ыг дундуур нь тэмдэглэсэн бол илүү үнэн зөв байх байлаа.
Дараагийнх: prompt болгоны дараа 2 мөр тэмдэглэл хөтлөх.

### 5 — `helmet` болон `express-rate-limit`-ийг эхнээс нэмэх

Security middleware-ийг "дараа нэмнэ" гэж хойшлуулсан. Production-д deploy хийхэд
эхнээс байсан бол test-үүд дотор security header-уудыг verify хийх тест бичих
боломжтой байлаа.

---

## 3. Энэ туршлагаас юу сурсан бэ?

### AI-тай ажиллах практик ур чадвар

**"Verify, don't trust" зарчим биет болсон.** Сургалтад онолоор мэдэж байсан ч
`result.insertId` hallucination-ийг туршлагаараа олж засах нь ойлголтыг гүнзгийрүүллээ.
Цаашид AI-ийн гаралт бүрт "энэ library-д үнэхээр байгаа уу?" гэж шалгах зуршил
тогтлоо.

**Slash command нь AI-тай харилцах "protocol" болдог.** `/review` command бичихдээ
OWASP checklist-ийг дахин давтан уншсан нь security мэдлэгийг шинэчилсэн.
Command бичих = тухайн domain-ийг ойлгох шаардлага — сайн давхар үр дүн.

**AI нь "хурдан прототип" хэрэгсэл, "архитектор" биш.** Over-engineering санал
(`Redis кэш`, `Repository pattern`, `JWT`) бүгд татгалзсан. AI нь technical debt
болон scope creep-ийн эрсдэлтэй — "simple working solution" өөрийн гараар
тодорхойлох чадвар чухал.

### Node.js болон Express дахь шинэ мэдлэг

`better-sqlite3`-ийн synchronous API нь async/await-оос хурдан бөгөөд energy
тест бичихэд энгийн гэдгийг практикт ойлгосон. `db.transaction(fn)()` pattern
нь atomic operation-д маш тохиромжтой — энэ ойлголт банк, е-коммерс системд
шууд хэрэглэгдэнэ.

Express-ийн error middleware-ийн `(err, req, res, next)` дөрвөн параметрийн
тусгай утга (`err` эхний байрлалд байснаар Express тусгай дуудагдана) практик
туршлагаар бат болсон.

### Өөрийгөө таних

Боловсруулалтын хурд нэмэгдэхэд ажилд ороо алдах эрсдэл нэмэгддэг гэдгийг
анзаарсан. AI хурдтай код өгөхөд "яг зөв байх" гэж итгэх татах хүч байдаг.
Энэ нь "automation bias" — AI-д шаардлагаас илүү итгэх хандлага. Мэддэг байсан
ч практик туршлага нь ухамсрыг сэрэмжлүүлсэн.
