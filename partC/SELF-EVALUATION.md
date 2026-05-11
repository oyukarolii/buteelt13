# Self-Evaluation — Library Management System


---

## 1. Хэрэв шалгалт өнөөдөр болбол би энэ кодыг өөрөө бичиж чадах уу?


**SQLite schema болон `db.js`** — өөрөө бичиж чадна. Энэ хэсгийг AI-гүйгээр
эхлэж бичсэн, дараа нь AI-аар шалгуулсан. Foreign key, WAL journal mode, index
syntax-ийг ойлгосон.

**Error handling middleware** — бичиж чадна. `statusMap` тогтолцоо энгийн.
`err.code` → HTTP status mapping нь switch/object lookup — ойлгомжтой.

**Route handler бүтэц** — бичиж чадна. Express-ийн `router.get/post/put/delete`
syntax, `validationResult` ашиглах арга танил болсон.

**Тест AAA pattern** — бичиж чадна. `beforeEach` дотор in-memory DB үүсгэх,
`afterEach` дотор хаах pattern-ийг гараар туршиж шалгасан.

---

## 2. Дахин хийнэ гэвэл юуг өөрөөр хийх вэ?

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
---

## 3. Энэ туршлагаас юу сурсан бэ?

**"Verify, don't trust" зарчим биет болсон.** Сургалтад онолоор мэдэж байсан ч
`result.insertId` hallucination-ийг туршлагаараа олж засах нь ойлголтыг гүнзгийрүүллээ.

**Slash command нь AI-тай харилцах "protocol" болдог.** `/review` command бичихдээ
OWASP checklist-ийг дахин давтан уншсан нь security мэдлэгийг шинэчилсэн.
Command бичих = тухайн domain-ийг ойлгох шаардлага — сайн давхар үр дүн.

**AI нь "хурдан прототип" хэрэгсэл, "архитектор" биш.** Over-engineering санал
(`Redis кэш`, `Repository pattern`, `JWT`) бүгд татгалзсан. AI нь technical debt
болон scope creep-ийн эрсдэлтэй — "simple working solution" өөрийн гараар
тодорхойлох чадвар чухал.

`better-sqlite3`-ийн synchronous API нь async/await-оос хурдан бөгөөд energy
тест бичихэд энгийн гэдгийг практикт ойлгосон. `db.transaction(fn)()` pattern
нь atomic operation-д маш тохиромжтой — энэ ойлголт банк, е-коммерс системд
шууд хэрэглэгдэнэ.

Express-ийн error middleware-ийн `(err, req, res, next)` дөрвөн параметрийн
тусгай утга (`err` эхний байрлалд байснаар Express тусгай дуудагдана) практик
туршлагаар бат болсон.
