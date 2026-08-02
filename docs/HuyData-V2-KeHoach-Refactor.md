# HuyData Platform V2.0 — Kế hoạch Refactor Kiến trúc

> Tài liệu này là sản phẩm của **Phase 1–3** theo đúng "QUY TRÌNH THỰC HIỆN" trong `Kế hoạch.docx`.
> **Chưa có dòng code website nào bị sửa.** Việc sửa code (Phase 4) chỉ bắt đầu **sau khi anh phê duyệt**, và làm **từng phase một** — mỗi phase: kiểm thử → báo cáo → chờ xác nhận → mới sang phase kế.
>
> Nguyên tắc bất di bất dịch (theo spec): **KHÔNG đổi** thiết kế, màu sắc, typography, animation, responsive, UX, phong cách, và **cơ chế ẩn/hiện section**. Chỉ tinh chỉnh rất nhỏ khi thật sự cần.

---

## PHASE 1 — PHÂN TÍCH HIỆN TRẠNG

### 1.1 Tổng quan
- **File:** `HuyData_Website_6.html` — **1 file HTML duy nhất, 1467 dòng (~126 KB)**, tự chứa toàn bộ: HTML + CSS inline + JS inline + dữ liệu nội dung + CMS quản trị.
- **Mô hình vận hành:** trang tĩnh, **không backend**, chạy hoàn toàn phía trình duyệt. Không cookie, không tracking, không gọi mạng (CSP `connect-src 'none'`).
- **Mô hình xuất bản:** admin sửa nội dung trong trình duyệt → bấm **"Xuất trang (.html)"** → tải 1 file HTML mới đã nhúng nội dung → **upload file đó lên hosting**. Có thêm Export/Import `.json`.

### 1.2 Bản đồ thành phần hiện tại

| Vùng | Dòng | Vai trò |
|---|---|---|
| `<head>` + meta | 1–22 | Title, description, OG/Twitter (id động), **CSP nghiêm ngặt**, favicon SVG inline, Google Fonts |
| CSS inline `<style>` | 23–388 | Design system đầy đủ: biến CSS (bảng màu xanh lá/teal), 2 font (Cormorant Garamond serif + Be Vietnam Pro sans), band layout, `.reveal` animation, canvas hero, responsive `@media` 1024/980/680, `prefers-reduced-motion`, `.hide{display:none!important}` |
| `#site-content` JSON | 392 | Ô chứa nội dung xuất bản (hiện `null`) — được `deepMerge` đè lên `DEFAULT` |
| Khung section rỗng | 406–423 | Các `<section>` chỉ chứa `<div id="r-*">` rỗng — nội dung do JS bơm vào |
| Post overlay / Admin / Modal PIN | 425–449 | Lớp phủ đọc bài (`#postview`), nút quản trị, modal nhập PIN, container `#admin` |
| `DEFAULT` (dữ liệu) | 455–616 | **Toàn bộ nội dung** nhúng thẳng trong JS: settings, hero, pain, why, solutions, products, decision, who, privacy, about, contact, blog, pricing, faq |
| Tiện ích render | 618–732 | `$`, `esc`, `clone`, `deepMerge`, `sanitize` (allowlist tag), `ICONS/LOGO/MARK`, `reconcileSections`, `sectionAvailable`, `applyLayout`, `setSEO` |
| Render engine | 734–911 | `renderAll()` + các hàm render từng section bằng **nối chuỗi innerHTML** |
| Đọc bài + Router | 913–931 | `openPost(slug)` mở overlay; **router hash**: `#/bai/{slug}`, `#quan-tri` |
| Hiệu ứng | 933–970 | IntersectionObserver reveal, header scroll, burger menu, canvas "constellation" |
| CMS Admin | 972–1461 | PIN (SHA-256 client-side), 12 tab, `listEditor` generic, editor blog `contentEditable`, draft autosave localStorage, Export HTML/JSON, Import JSON |
| Boot | 1463–1464 | `renderAll(); route();` |

### 1.3 Điểm mạnh (phải giữ và kế thừa)
1. **Design system trưởng thành** — biến CSS nhất quán, typography/động/màu rất chỉn chu. Đây là tài sản, không được phá.
2. **Đã có tư duy data-driven** — nội dung tách khỏi khung nhìn qua object `content`; render đọc từ `content`. Đây là *phôi thai* của DataService.
3. **Cơ chế ẩn/hiện section thông minh** — `sections[]` (`on`/`nav`) + `sectionAvailable()` tự ẩn khi rỗng. Spec yêu cầu **giữ nguyên** — sẽ bảo toàn nguyên vẹn.
4. **Bảo mật cơ bản tốt** — CSP chặt, `sanitize()` allowlist, không tracking, thoát HTML (`esc`) khắp nơi.
5. **CMS không cần server** — sửa tại chỗ, autosave nháp, export/import. Rất hợp bối cảnh 1 người vận hành.
6. **A11y & hiệu năng nền tốt** — `prefers-reduced-motion`, `:focus-visible`, canvas dừng khi tab ẩn, lazy reveal.

### 1.4 Điểm yếu / khoảng cách so với mục tiêu V2.0

| # | Vấn đề | Ảnh hưởng tới mục tiêu 5–10 năm |
|---|---|---|
| Y1 | **Tất cả trong 1 file** (logic + data + CMS) | Vi phạm "KIẾN TRÚC PROJECT" (phải tách module css/ js/ data/). Không thể mở rộng, khó bảo trì, dễ vỡ. |
| Y2 | **Không có DataService** — render đọc thẳng `content.*` | Spec bắt buộc lớp DataService để sau này đổi sang Firebase/Supabase/REST **không sửa giao diện**. |
| Y3 | **Nội dung nhúng trong HTML** | 10.000 bài viết trong 1 blob JSON → tải nặng mỗi lần vào trang, **giết Core Web Vitals**. Không đạt "KHẢ NĂNG MỞ RỘNG". |
| Y4 | **URL dạng hash** `#/bai/slug` | Spec đòi URL sạch `/data-foundation/du-lieu-sach-la-gi`. Hash **không phải URL thật** → yếu SEO & AI Search cho từng bài. |
| Y5 | **SEO gần như trống ở tầng bài viết** | Thiếu: canonical, `sitemap.xml`, `robots.txt`, RSS, **toàn bộ Structured Data** (Organization/Article/FAQ/Breadcrumb/Person/Service/SoftwareApplication/SearchAction), OG riêng theo bài. |
| Y6 | **Thư viện Tri thức chưa tồn tại** | Spec coi đây là **trung tâm website**. Hiện chỉ có blog phẳng: không category, không tag, không TOC, không related/featured, không breadcrumb, không reading time, không author/updated. |
| Y7 | **CMS không có phân quyền / workflow / version / media / data vault** | Spec đòi Super Admin→Contributor, Draft→Pending→Published→Archived, lưu lịch sử sửa, thư viện media, kho tri thức. |
| Y8 | **PIN hash nằm trong file** | Chỉ là lớp che phía client (spec cũng thừa nhận). Không đủ cho 50 cộng tác viên. |
| Y9 | **Chưa có Backup/Restore, Thống kê quản trị, AI metadata, Entity, Topic cluster, bảo vệ nội dung** | Là các mục lớn trong spec chưa có. |
| Y10 | **Render bằng nối chuỗi `innerHTML`** | Khó tái sử dụng, khó test, dễ lỗi khi hệ thống lớn. Cần lớp render/template gọn hơn (vẫn vanilla). |

### 1.5 Đánh giá theo trục
- **Kiến trúc:** 4/10 — sạch trong phạm vi 1 file, nhưng không module hoá, không tách tầng dữ liệu.
- **UI:** 9/10 — xuất sắc, **giữ nguyên**.
- **UX:** 8/10 — mượt, a11y tốt; thiếu điều hướng tri thức (breadcrumb, TOC, related).
- **SEO:** 3/10 — meta cơ bản OK; thiếu toàn bộ structured data, sitemap, URL thật.
- **Hiệu năng:** 7/10 hiện tại, nhưng **sẽ sụp** khi dữ liệu lớn nếu vẫn nhúng hết vào HTML.
- **Khả năng mở rộng:** 2/10 — kiến trúc hiện tại không chịu nổi quy mô 10k bài/50 CTV.

**Kết luận Phase 1:** Nền UI/UX/design **rất tốt và phải bảo toàn**. Vấn đề nằm ở **tầng kiến trúc & dữ liệu**. Đây đúng là bài toán *refactor kiến trúc* chứ không phải thiết kế lại — khớp với spec.

---

## PHASE 2 — KIẾN TRÚC MỤC TIÊU (V2.0)

### 2.1 Nguyên tắc
1. **Bảo toàn tuyệt đối** giao diện: CSS/animation/responsive bê nguyên sang `css/main.css`, không đổi giá trị.
2. **Vanilla JS + ES6 Module**, không framework, **giữ chạy tĩnh** — trung thành với "không đổi công nghệ nếu chưa cần".
3. **Mọi giao diện chỉ nói chuyện với `DataService`**, không đọc JSON/DB trực tiếp → tương lai đổi nguồn dữ liệu không đụng UI.
4. **Tách dữ liệu ra khỏi HTML** để mở rộng tới hàng chục nghìn bản ghi mà không nặng trang.
5. **SEO & AI-Search là công dân hạng nhất** ngay từ kiến trúc, không vá sau.
6. Mỗi bước refactor **độc lập, kiểm thử được, deploy được**, và **không phá regression** giao diện.

### 2.2 Sơ đồ module (đúng cây thư mục spec)

```
/
├── index.html                      # chỉ còn khung (shell) + điểm treo section, nạp module
├── css/
│   └── main.css                    # toàn bộ CSS hiện tại, bê nguyên (+ tách file con nếu cần)
├── js/
│   ├── app.js                      # bootstrap: khởi tạo DataService, router, render
│   ├── data-service.js             # LỚP TRỪU TƯỢNG DỮ LIỆU (interface + adapters)
│   ├── router.js                   # điều hướng URL sạch + hash fallback
│   ├── render.js                   # engine render section (template thuần)
│   ├── blog.js                     # Thư viện Tri thức: list, filter, TOC, related, post view
│   ├── search.js                   # tìm kiếm tiêu đề/nội dung/category/tag/author
│   ├── seo.js                      # meta + canonical + JSON-LD + sitemap/rss/robots (export)
│   ├── cms.js                      # CMS: tab, editor, quản lý bài/sp/dv/category/tag/media/user
│   ├── auth.js                     # PIN hiện tại → nền cho role/workflow
│   ├── dashboard.js                # thống kê quản trị
│   ├── storage.js                  # localStorage/draft/cache tiện ích
│   └── backup.js                   # backup/restore + export ZIP/JSON/HTML/Markdown
├── data/
│   ├── config.json                 # settings + bố cục section (thay cho phần settings hiện tại)
│   ├── posts.json                  # CHỈ SỐ (index) bài viết (metadata, không chứa body dài)
│   ├── posts/<slug>.json           # nội dung từng bài (tải theo yêu cầu) — để mở rộng
│   ├── products.json
│   ├── services.json
│   ├── categories.json
│   ├── tags.json
│   ├── entities.json               # thực thể cho AI Search
│   └── users.json                  # tài khoản/role (giai đoạn tĩnh: cấu hình; sau: backend)
├── images/                         # ảnh tĩnh
├── uploads/                        # media do CMS thêm
├── backup/                         # bản sao lưu xuất ra
├── sitemap.xml                     # sinh khi publish
├── rss.xml                         # sinh khi publish
└── robots.txt
```

> **Tương thích ngược:** `index.html` vẫn giữ được **chế độ "1 file"** — nếu `data/*.json` không tải được (mở bằng `file://` hoặc host tối giản), DataService **fallback** về `#site-content`/`DEFAULT` nhúng. Nhờ vậy không bao giờ mất khả năng "portable 1 file" mà anh đang có.

### 2.3 Luồng dữ liệu

```mermaid
flowchart LR
  A[index.html shell] --> B[app.js bootstrap]
  B --> C{DataService}
  C -->|Adapter Embedded| D[#site-content / DEFAULT]
  C -->|Adapter Static JSON| E[data/*.json + posts/slug.json]
  C -.->|Adapter Backend (tương lai)| F[Supabase / REST]
  B --> G[router.js]
  G --> H[render.js / blog.js / dashboard.js]
  H -->|chỉ gọi getPosts()/getProducts()...| C
  H --> I[DOM sections]
  B --> J[seo.js] --> K[<head> meta + JSON-LD]
  L[cms.js/auth.js] --> C
  L --> M[backup.js export ZIP/JSON/HTML]
```

**Cốt lõi:** UI **chỉ gọi** `DataService.getPosts()`, `getPost(slug)`, `getProducts()`, `getCategories()`, `getTags()`, `getServices()`, `getUsers()`, `getConfig()`… Đằng sau là **adapter** có thể tráo:
- **EmbeddedAdapter** (như hiện nay, cho chế độ 1 file / offline)
- **StaticJsonAdapter** (đọc `data/*.json`) — mặc định của V2.0
- **BackendAdapter** (Supabase/REST) — tương lai, **không đổi UI**

### 2.4 Mô hình dữ liệu bài viết (Knowledge Library)

```jsonc
{
  "id": "p-2026-0001",
  "slug": "du-lieu-sach-la-gi",
  "categoryId": "data-foundation",       // 1 trong 7 nhóm spec
  "tags": ["du-lieu-sach", "nhap-mon"],
  "title": "Dữ liệu sạch là gì",
  "summary": "Tóm tắt 1–2 câu cho AI trích dẫn & thẻ card",
  "cover": "images/...",                   // hoặc rỗng
  "author": "tran-huy",
  "editor": "tran-huy",
  "createdAt": "2026-01-15",
  "updatedAt": "2026-02-01",
  "publishAt": "2026-01-16",
  "status": "published",                  // draft|pending|published|archived
  "version": 3,
  "hash": "sha256…",                      // toàn vẹn nội dung
  "readingTime": 6,                        // phút (tự tính)
  "featured": false,
  "body": "…HTML đã sanitize…",
  "toc": [ {"id":"dinh-nghia","text":"Định nghĩa","level":2}, … ],  // tự sinh
  "seo": { "title":"", "description":"", "canonical":"", "ogImage":"" },
  "ai": {                                  // AI METADATA (spec)
    "keywords": [], "entities": ["Data Platform"], "topic": "data-foundation",
    "difficulty": "beginner", "language": "vi", "summary": ""
  },
  "related": [],                           // tự suy ra từ category/tag/entity
  "history": [ {"version":2,"at":"…","by":"…","hash":"…"} ]  // VERSION: không xoá bản cũ
}
```

- **7 category** cố định theo spec: Data Foundation, Data to Decision, Quản trị doanh nghiệp, Thuế & Kế toán, AI cho doanh nghiệp, Case Study, Học cùng HuyData.
- **Bài chuẩn AI-First:** Summary → Mục lục → Định nghĩa → Nội dung → Ví dụ → FAQ → Kết luận (CMS gợi ý khung này).

### 2.5 URL sạch & khả năng crawl — ✅ ĐÃ CHỐT: Phương án B
Mục tiêu: `/{category}/{slug}/` thay cho `#/bai/{slug}`.
- **Phương án B (đã chọn):** CMS khi bấm **Publish** sẽ **sinh sẵn 1 file HTML thật cho mỗi bài** (`/{category}/{slug}/index.html`) + `sitemap.xml` + `rss.xml` + `robots.txt`, tất cả **chạy trong trình duyệt** (không cần Node/build tool), rồi xuất ra **1 thư mục/ZIP** để upload lên GitHub Pages. → URL thật, SEO/AI tối đa, **vẫn hosting tĩnh**, vẫn trung thành "không backend".
- (A giữ hash / C backend Supabase: đã cân nhắc và bỏ qua ở giai đoạn này. C được để dành làm Phase 3.8 tương lai.)

### 2.5b Điều chỉnh kỹ thuật cho GitHub Pages — ✅ ĐÃ CHỐT hạ tầng
GitHub Pages là host tĩnh; cần lưu ý khi thiết kế để không dính bẫy:
1. **Đường dẫn tương đối / base path.** Project site chạy dưới `https://user.github.io/<repo>/`. Vì vậy **mọi tham chiếu tài nguyên dùng đường dẫn tương đối** (hoặc đặt `<base>` / biến `SITE_BASE` trong `config.json`) để không vỡ khi ở sub-path. Nếu sau này gắn **custom domain**, `SITE_BASE` đổi 1 chỗ.
2. **`.nojekyll`** ở gốc repo để GitHub Pages **không chạy Jekyll** (tránh nó bỏ qua thư mục `_*` và xử lý sai file). Bắt buộc cho web thuần tĩnh.
3. **URL sạch = thư mục + `index.html`.** GitHub Pages tự phục vụ `/{category}/{slug}/` → `/{category}/{slug}/index.html`. Đây là lý do Phương án B sinh theo cấu trúc thư mục.
4. **`404.html` ở gốc** làm fallback: nếu người dùng vào 1 URL chưa có trang tĩnh (ví dụ bài mới chưa publish lại, hoặc điều hướng nội bộ SPA), `404.html` sẽ nạp app và route lại đúng bài — vừa mượt cho người dùng, vừa an toàn.
5. **`sitemap.xml`/`rss.xml`/canonical cần URL tuyệt đối** → lấy từ `SITE_BASE` trong `config.json` (mặc định điền sẵn `https://<user>.github.io/<repo>/`, đổi khi có domain riêng).
6. **CSP hiện tại rất chặt** (`connect-src 'none'`). Khi DataService đọc `data/*.json` bằng `fetch` **cùng gốc**, cần nới `connect-src 'self'` (chỉ 'self', không mở ra ngoài) — thay đổi tối thiểu, giữ nguyên tinh thần bảo mật.
7. **Không secret trong repo.** PIN hash vẫn chỉ là lớp che client (spec đã chấp nhận). Repo public thì ai cũng đọc được mã nguồn — không đặt gì nhạy cảm; quản trị thật dựa vào quyền push GitHub. Cân nhắc để **repo private + Pages** nếu muốn kín mã nguồn (Pages vẫn phục vụ public).

### 2.6 Tầng SEO (`seo.js`)
- Runtime: set `<title>`, description, canonical, OG/Twitter theo trang/bài; nhúng **JSON-LD**: Organization, WebSite + **SearchAction**, Person (Trần Huy), SoftwareApplication (mỗi app), Service, BreadcrumbList, Article (mỗi bài), FAQPage (mục FAQ + FAQ trong bài).
- Khi **Publish**: sinh `sitemap.xml`, `rss.xml`, `robots.txt`, và (nếu chọn phương án B) HTML tĩnh mỗi bài với đủ meta + JSON-LD.

### 2.7 Tầng AI Search
- **Entity** (`entities.json`): HuyData, Data Platform, Dashboard, Decision Support, Hóa Đơn Pro, KhoPro… liên kết chéo.
- **Topic cluster:** mỗi category có Pillar Page + cluster; internal link tự sinh (Related, Cùng chuyên mục, Bài nền tảng, Bài nâng cao, Chuỗi học tập).
- **AI metadata** nhúng vào mỗi bài (mục 2.4) để AI dễ hiểu & trích dẫn.

### 2.8 CMS / Auth / Role / Workflow / Version / Media / Data Vault
- Kế thừa CMS hiện tại (tab, listEditor, editor), **mở rộng dần**:
  - **Roles:** Super Admin, Admin, Editor, Author, Contributor (giai đoạn tĩnh: gán trong `users.json`, giới hạn theo UI; **thực thi thật cần backend** ở Phase sau).
  - **Workflow:** Draft → Pending → Published → Archived (đã có `published` → mở rộng thành `status`).
  - **Version:** lưu `history[]`, xem/khôi phục, **không xoá bản cũ**.
  - **Media Library:** ảnh/PDF/Excel/Video/Prompt/Dataset/Template (metadata trong `data/`, file trong `uploads/`).
  - **Data Vault:** quản lý mọi tài sản tri thức (bài, prompt, dashboard, dataset, template, PDF, video, case study) như một loại "asset" thống nhất.

### 2.9 Backup / Restore / Thống kê / Bảo vệ nội dung / Hiệu năng
- **Backup:** export Website/Data/Images/JSON; định dạng **ZIP/JSON/HTML/Markdown**. **Restore:** toàn bộ / từng bài / từ backup.
- **Thống kê (`dashboard.js`):** tổng bài/sp/dv/user/lượt xem, top bài, top chuyên mục.
- **Bảo vệ nội dung:** chặn copy cơ bản, watermark ảnh, tự thêm nguồn khi copy — **không ảnh hưởng SEO**.
- **Hiệu năng:** lazy load bài & ảnh, cache DataService, tách/nạp module theo trang (code splitting mức module), tối ưu Core Web Vitals.

### 2.10 Lộ trình tiến hoá lên backend (không đổi UI)
Nhờ DataService, khi cần role/version/media thật & quy mô lớn: viết `BackendAdapter` (Supabase) → đổi 1 dòng cấu hình `config.json` → UI **giữ nguyên**. Đây là "van an toàn" cho mục tiêu 5–10 năm.

---

## PHASE 3 — KẾ HOẠCH REFACTOR THEO PHASE NHỎ

> Mỗi phase **độc lập, kiểm thử được, deploy được**. Sau mỗi phase: **kiểm thử → báo cáo thay đổi → chờ anh xác nhận → sang phase kế**. Không bỏ bước.
> Cột "An toàn regression": mỗi phase đều phải **giữ y hệt giao diện & cơ chế ẩn/hiện** so với bản trước.

| Phase | Mục tiêu | Việc chính | Tiêu chí nghiệm thu |
|---|---|---|---|
| **3.0** Tách file (0 đổi hành vi) | Bóc CSS & JS ra `css/main.css`, `js/app.js` (tạm gộp) khỏi `index.html` | Cắt–dán nguyên văn, thêm `<link>`/`<script type="module">` | Trang **giống hệt pixel-by-pixel**; mọi tính năng + admin chạy nguyên |
| **3.1** DataService + tách dữ liệu | Tạo `data-service.js` với Embedded + StaticJson adapter; đưa nội dung ra `data/config.json`, `data/posts.json`… | Mọi render đổi sang gọi `DataService.*`; fallback embedded | Nội dung hiển thị y cũ dù đọc từ JSON; tắt mạng vẫn chạy nhờ fallback |
| **3.2** Router + URL bài viết | `router.js` URL sạch `/{category}/{slug}` (+ hash fallback); trang xem bài tách khỏi overlay | Điều hướng, back/forward, deep-link | Mở link trực tiếp tới 1 bài hoạt động; không vỡ `#quan-tri` |
| **3.3** Thư viện Tri thức | Category (7 nhóm), tag, search, filter, breadcrumb, related, featured, reading time, author, updated, TOC | `blog.js`+`search.js`; `categories.json`/`tags.json` | Lọc theo category/tag; TOC & related hiển thị đúng; ẩn/hiện khi rỗng vẫn đúng |
| **3.4** SEO nền tảng | canonical + JSON-LD (Org/WebSite/Person/Breadcrumb/Article/FAQ/Service/SoftwareApplication/SearchAction); sinh `sitemap.xml`/`rss.xml`/`robots.txt` khi publish | `seo.js` + mở rộng export | Kiểm bằng Rich Results Test; sitemap/rss hợp lệ |
| **3.5** AI Search | `entities.json`, AI metadata mỗi bài, topic cluster + internal link tự sinh, khung bài AI-First | mở rộng `blog.js`/`seo.js`/CMS | Bài có Summary/FAQ/Entity; related & cluster tự sinh đúng |
| **3.6** CMS mở rộng | Role/Workflow(status)/Version(history)/Media/Data Vault + Backup/Restore + Thống kê | `cms.js`,`auth.js`,`backup.js`,`dashboard.js` | Draft→Pending→Published→Archived; khôi phục version; export ZIP/JSON/HTML/MD; số liệu đúng |
| **3.7** Hiệu năng + Bảo vệ nội dung | Lazy load bài/ảnh, cache, code splitting; chặn copy + watermark + gắn nguồn | tinh chỉnh loader + `storage.js` | Core Web Vitals tốt với dữ liệu lớn (test bằng bộ 500+ bài giả lập); copy tự gắn nguồn |
| **3.8** *(Tùy chọn, tương lai)* Backend | `BackendAdapter` Supabase để role/version/media thật + quy mô lớn | thêm adapter, đổi cấu hình | UI **không đổi**; dữ liệu chạy qua backend |

**Thứ tự phụ thuộc:** 3.0 → 3.1 là nền bắt buộc cho tất cả. 3.2 cần trước 3.3/3.4. 3.5 sau 3.3/3.4. 3.6 độc lập tương đối (có thể xen). 3.7 cuối. 3.8 khi thực sự cần.

---

## QUYẾT ĐỊNH ĐÃ CHỐT (2026-07-23)
1. **Hạ tầng:** ✅ **GitHub Pages** cho giai đoạn đầu (web còn đơn giản); sẽ gợi ý nâng cấp khi cần.
2. **URL/SEO bài viết:** ✅ **Phương án B** — static + publish tự sinh trang HTML thật + sitemap/RSS trong trình duyệt.
3. **Mô hình:** ✅ giữ **tĩnh, không backend** giai đoạn đầu; backend (Supabase) để dành **Phase 3.8** tương lai.

## CỔNG PHÊ DUYỆT → PHASE 4
Kế hoạch đã khớp hạ tầng. Thực hiện từng phase, mỗi phase kiểm thử → báo cáo → chờ xác nhận.

---

## NHẬT KÝ THỰC HIỆN

### ✅ Phase 3.0 — Tách file (hoàn tất, đã kiểm thử) — 2026-07-23
**Đã làm (cắt–dán nguyên văn, không sửa logic/CSS):**
- `index.html` (126 KB) → còn **shell 5.8 KB**: khung HTML + `<link rel="stylesheet" href="css/main.css">` + `<script src="js/app.js"></script>`. Giữ nguyên `<script id="site-content">`, toàn bộ section/header/footer/modal.
- `css/main.css` (33.8 KB) — toàn bộ CSS cũ, byte-exact.
- `js/app.js` (86.5 KB) — toàn bộ JS cũ, byte-exact (nạp dạng **classic script** để bảo toàn global scope; ES6 module thật sẽ làm ở 3.1 khi tách nhiều module).
- Thêm `.nojekyll` (bắt buộc cho GitHub Pages).
- File gốc `HuyData_Website_6.html` **giữ lại nguyên vẹn** làm bản đối chiếu/backup.

**Kiểm thử (serve HTTP tĩnh, mô phỏng GitHub Pages):**
- CSS áp đúng (`body` bg = `--warm-white`, hero gradient đúng); 7 nav links; brand + canvas + **cả 13 vùng render** có nội dung; **0 section ẩn sai**; **0 lỗi console**.
- Global funcs (`renderAll/openAdmin/exportHTML/sanitize/route/tryPin`) còn nguyên; **modal PIN mở đúng**; cơ chế ẩn/hiện section nguyên vẹn.

**Hệ quả duy nhất (đã lường trước):** nút admin **"Xuất trang (.html)"** nay tạo file HTML **tham chiếu** `css/main.css` + `js/app.js` (thay vì self-contained). Điều này **đúng** với mô hình nhiều-file của GitHub Pages (upload cả thư mục). Nếu vẫn muốn 1 bản "1 file portable" để lưu trữ, sẽ bổ sung ở **Phase 3.6 (Backup)**.

**Chưa đụng tới:** mọi hành vi hiển thị/tương tác của trang **giữ y hệt**.

> **Bước kế:** Phase 3.1 — DataService + tách dữ liệu ra `data/*.json`. Chờ anh xác nhận "duyệt 3.1" để tiếp tục.

### ✅ Phase 3.1 — DataService + tách dữ liệu (hoàn tất, đã kiểm thử) — 2026-07-23
**Đã làm:**
- Tạo `js/data-service.js` — lớp trừu tượng dữ liệu. Model dựng theo 3 lớp ưu tiên: `DEFAULT` (nhúng, giữ shape) ← `data/*.json` (nguồn tĩnh chính) ← `#site-content` (bản publish bake vào HTML). Không tải được JSON (file://, offline) → **tự fallback** về dữ liệu nhúng = đúng hành vi trước 3.1.
- Tách dữ liệu ra 4 file (sinh **byte-exact từ `DEFAULT`** qua trình duyệt, không gõ tay): `data/config.json` (settings), `data/content.json` (11 section), `data/products.json`, `data/posts.json`.
- Chuyển **toàn bộ tầng render** sang gọi `DataService.getHero()/getPosts()/…` (getter trả về cùng tham chiếu object → CMS sửa vẫn phản ánh). Tầng **CMS/auth/export giữ nguyên** đọc `content` trực tiếp (sẽ trừu tượng hóa ở 3.6).
- Boot: vẽ ngay từ dữ liệu hiện có (giữ hành vi cũ) → nạp `data/*.json` ở nền → chỉ vẽ lại nếu nội dung khác (không nhấp nháy khi trùng).
- Nới CSP `connect-src 'none'` → `'self'` (chỉ để `fetch` JSON cùng gốc).
- Thêm `<script src="js/data-service.js">` trước `app.js`.

**Kiểm thử (HTTP tĩnh):** nguồn = `json`; **mọi độ dài render khớp chính xác baseline 3.0** (r-hero 1737, r-solutions 7892, r-footer 1769…); getters đúng tham chiếu; posts=1/products=6/sections=10; 0 section ẩn sai; **0 lỗi console**; **CMS sửa→render phản ánh đúng** (test + revert OK); **fallback offline OK** (fetch lỗi → embedded, khớp dữ liệu nhúng); bảng quản trị dựng đủ 12 tab, panel bài viết OK, đóng mở sạch.

**Trạng thái publish (chuyển tiếp):** hiện `data/*.json` == `DEFAULT`. Nút "Xuất trang (.html)" vẫn bake `#site-content` (override thắng) → chưa xung đột. Sẽ hợp nhất write-path (CMS xuất thẳng `data/*.json`) ở **Phase 3.6**.

> **Bước kế:** Phase 3.2 — Router + URL sạch `/{category}/{slug}/` + trang xem bài tách khỏi overlay. Chờ "duyệt 3.2".

### ✅ Phase 3.2 — Router + URL sạch (hoàn tất, đã kiểm thử) — 2026-07-23
**Đã làm:**
- Tạo `js/router.js` — URL sạch `/{category}/{slug}/` qua History API. **Base path tự phát hiện** từ vị trí `router.js` → chạy đúng cả localhost lẫn `user.github.io/<repo>/`. Bài viết phân giải theo **slug** (đoạn cuối), category chỉ mang tính canonical (để 3.3 gán category không gãy URL cũ).
- `app.js`: thẻ bài click → `Router.goPost()` (pushState, không tải lại); `pv-back` → `Router.goHome()`; `route()` dùng `Router.resolve()` (đọc cả pathname lẫn hash); thêm listener `popstate`; `openPost` gọi `Router.setCanonical()` để **nâng cấp** link hash cũ thành URL sạch.
- **Giữ hash fallback**: `#/bai/{slug}` vẫn mở đúng bài rồi tự đổi URL sang dạng sạch; `#quan-tri` (admin) và `#section` (cuộn) giữ nguyên.
- Tạo `404.html` (spa-github-pages: chuyển path sạch → query `?/…`, `pathSegmentsToKeep` tự phát hiện theo hostname) + đoạn head trong `index.html` đặt `<base>` = gốc site rồi `replaceState` khôi phục URL sạch (khắc phục lỗi asset tương đối bị lệch sau replaceState).
- Nạp `router.js` giữa `data-service.js` và `app.js`.

**Kiểm thử (HTTP tĩnh, server test mô phỏng 404 GitHub Pages):**
- Click thẻ bài → URL `/bai-viet/{slug}/`, mở bài, không tải lại; **Back** → về `/`, đóng bài. ✓
- **Deep-link** tải thẳng `/bai-viet/{slug}/` → 404.html → redirect → `<base>` + decode → mở đúng bài (Router/DataService nạp đúng, `source=json`). ✓
- **Hash cũ** `#/bai/{slug}` → mở bài + canonical hóa URL sạch (bỏ hash). ✓
- `#quan-tri` → hiện modal PIN đúng. ✓
- Render parity nguyên vẹn (r-hero 1737, r-solutions 7892, r-footer 1769…), 7 nav links, **0 lỗi console**.

**Lưu ý (chuyển tiếp):** URL bài hiện là `/bai-viet/{slug}/` (chưa có category); Phase 3.3 gán 7 category thật → URL thành `/{category}/{slug}/` (phân giải theo slug nên không gãy). Trang bài vẫn render qua overlay SPA (UI không đổi); **file HTML tĩnh riêng cho mỗi bài** sẽ do trình publish sinh ở Phase 3.4 (khi đó deep-link không cần qua 404 nữa).

> **Bước kế:** Phase 3.3 — Thư viện Tri thức (7 category, tag, search, filter, breadcrumb, related, featured, reading time, author, updated, TOC). Chờ "duyệt 3.3".

### ✅ Phase 3.3 — Thư viện Tri thức (hoàn tất, đã kiểm thử) — 2026-07-23
**Đã làm:**
- **Dữ liệu**: thêm vào `DEFAULT` (app.js) `settings.authors`, `categories` (7 nhóm), `tags` (9), và bộ **9 bài mẫu** đầy đủ trường (category, tags, author, date, updatedAt, featured, body có heading). Bài viết nay có: category, tag, tác giả, ngày đăng/cập nhật, nổi bật. Sinh lại `data/*.json` từ DEFAULT (thêm `categories.json`, `tags.json`; `config.json` có authors) — **một nguồn sự thật**, fallback offline khớp.
- **Module mới**: `js/search.js` (lọc theo query + category + tag, tìm cả trong nội dung) và `js/blog.js` (reading time, **buildTOC** tự gắn id vào h2/h3 + sinh mục lục, **related** chấm điểm theo category+tag).
- **DataService**: thêm taxonomy getters (`getCategories/getCategory/getTags/getTag/getPostsByCategory/getPostsByTag/getFeaturedPosts/getAuthors/getAuthor/getPublishedPosts`), nạp thêm `categories.json`+`tags.json`.
- **UI Thư viện** (`renderBlogList`): thanh lọc **category chips** (chỉ hiện nhóm có bài) + **tag chips** + ô tìm kiếm; thẻ bài thêm **nhãn category, thời gian đọc, badge Nổi bật**; nổi bật xếp đầu; đếm số bài.
- **Trang xem bài** (`openPost`): **breadcrumb** (Trang chủ › Category › Tựa), **meta** (tác giả · ngày · cập nhật · thời gian đọc), **mục lục (TOC)** nhấp cuộn trong bài (không kích hoạt router), **bài liên quan**. URL bài nay là **`/{category}/{slug}/`** (Router lấy category từ bài; phân giải theo slug).
- **CSS**: thêm style Thư viện dùng đúng biến thiết kế sẵn có (green/teal, serif, --r/--line/--cream); responsive kèm theo. Đổi nhãn menu "Bài viết" → "Thư viện" (điều chỉnh nhỏ, khớp menu trong spec).

**Kiểm thử (HTTP tĩnh, json mode):** source=json, **0 lỗi console**; 7 category / 9 tag / 3 nổi bật; 8 chip + 9 thẻ; **lọc category** (Thuế & Kế toán → 2 bài), **tìm kiếm** ('dashboard' → 3 bài, tìm cả nội dung), **lọc tag** (#dashboard → 2 bài); trang bài: breadcrumb + meta + **TOC 4 mục có id** + **1 bài liên quan**, click related mở đúng bài, breadcrumb-category đóng bài & lọc đúng; **parity các section khác khớp tuyệt đối** (hero 1737, solutions 7892, pricing 2707…); không section ẩn sai.

**Lưu ý:** 9 bài là **nội dung mẫu** minh hoạ hệ thống — anh sửa/thay qua CMS. (CMS chưa có ô chọn category/tag cho bài — sẽ bổ sung ở Phase 3.6 khi mở rộng CMS; hiện chỉnh qua Xuất/Nhập JSON hoặc sửa `data/posts.json`.)

> **Bước kế:** Phase 3.4 — SEO nền tảng (canonical + JSON-LD Organization/WebSite/Person/Breadcrumb/Article/FAQ/Service/SoftwareApplication/SearchAction; sinh `sitemap.xml`/`rss.xml`/`robots.txt` + trang HTML tĩnh mỗi bài khi publish). Chờ "duyệt 3.4".

### ✅ Phase 3.4 — SEO nền tảng (hoàn tất, đã kiểm thử) — 2026-07-23
**Đã làm — Runtime (`js/seo.js`):**
- Chèn động vào `<head>`: **canonical** + **JSON-LD**: Organization, Person (Trần Huy), WebSite + **SearchAction**, **FAQPage**, **SoftwareApplication** (mỗi sản phẩm) cho trang chủ; **BlogPosting** (Article) + **BreadcrumbList** + meta (title/description/OG/Twitter) riêng cho mỗi bài. Rời bài tự gỡ Article/Breadcrumb và reset canonical/meta về trang chủ.
- Wire: `setSEO()`→`SEO.applyHome()`, `openPost()`→`SEO.applyPost()`, `route()` home→reset. Thêm đọc `?q=` (khớp SearchAction) để mở trang với sẵn từ khóa tìm trong Thư viện.
- Tách `articleInnerHTML(post)` dùng chung cho xem bài runtime và sinh trang tĩnh.

**Đã làm — Publish (`js/zip.js` + `publishSite()` trong admin):**
- `js/zip.js`: tạo `.zip` thuần trong trình duyệt (store, CRC32), không cần thư viện (hợp CSP).
- Nút **"Xuất bản site (.zip)"** trong tab SEO của admin đóng gói: `index.html` + `css/js` + `data/*.json` (từ nội dung hiện tại) + **`sitemap.xml`** + **`rss.xml`** + **`robots.txt`** + **trang HTML tĩnh cho mỗi bài** (`/{category}/{slug}/index.html`, có `<base href="../../">`, meta + JSON-LD, và nội dung bài dựng sẵn để bot đọc không cần JS). Thêm ô **siteBase** (cho canonical/sitemap/rss).

**Kiểm thử (HTTP tĩnh):** 0 lỗi console; trang chủ có Organization/Person/WebSite + FAQPage(6) + SoftwareApplication(6), tất cả JSON-LD hợp lệ; trang bài có BlogPosting (headline/section/date/keywords/url) + BreadcrumbList + canonical + title riêng, về home reset đúng; `?q=` lọc sẵn Thư viện; **sitemap 10 URL / RSS 9 item / robots** hợp lệ; đóng gói 25 file (9 trang bài) → **ZIP giải nén được bằng PowerShell**, trang bài mẫu có `<base>`+BlogPosting+canonical, sitemap.xml là XML hợp lệ; parity các section khác khớp tuyệt đối.

> **Bước kế:** Phase 3.5 — AI Search (entities.json, AI metadata mỗi bài, topic cluster + internal link tự sinh, khung bài AI-First: Summary/Định nghĩa/Ví dụ/FAQ/Kết luận). Chờ "duyệt 3.5".

### ✅ Phase 3.5 — AI Search Optimization (hoàn tất, đã kiểm thử) — 2026-07-23
**Đã làm:**
- **Entity** (`data/entities.json`, 8 thực thể liên kết chéo: HuyData, Data Platform, Dashboard, Decision Support, Kế Toán Pro, KhoPro, Hóa đơn điện tử, Dữ liệu sạch).
- **AI metadata** mỗi bài: `ai:{summary, keywords, entities, difficulty}` (+ `level`, `pillar`, và `faqs` cho bài trụ). Sinh lại toàn bộ `data/*.json` từ DEFAULT.
- **DataService**: getEntities/getEntity/getPostEntities/getRelatedEntities + **topic cluster**: getPillar, getClusterPosts, **getLearningChain** (xếp theo cấp độ nền tảng→nâng cao).
- **Trang bài AI-First** (`articleInnerHTML`): hộp **Tóm tắt** (ai.summary), nhãn **độ khó**, mục **Câu hỏi thường gặp** (faqs), **Chủ đề & thực thể liên quan** (entity chips), **Chuỗi học tập** (cluster nav đánh số, làm nổi bài đang đọc, nhãn Nền tảng/cấp độ) — tất cả là internal link tự sinh. `wireArticle` xử lý mọi `a[data-slug]`.
- **JSON-LD giàu** (`seo.js`): Article thêm `keywords` (từ ai.keywords), `about` (thực thể), `educationalLevel` (độ khó), `abstract` (summary); thêm **FAQPage riêng cho bài** khi có faqs; khi xem bài **gỡ** FAQPage/SoftwareApplication của trang chủ để không trùng, về home khôi phục lại. Trang tĩnh (`buildPostPage`) chứa đủ AI-First + FAQPage LD.
- **CSS**: thêm style cho summary/độ khó/FAQ bài/entity/cluster theo đúng design tokens.

**Kiểm thử (json mode):** 8 thực thể, related-entities đúng, pillar + learning chain đúng; trang bài hiện Tóm tắt + độ khó + 2 FAQ + 2 thực thể + cluster nav (đánh dấu bài hiện tại); Article JSON-LD có keywords/educationalLevel/about/abstract, FAQPage riêng 2 Q&A, gỡ/khôi phục schema trang chủ đúng; trang tĩnh chứa đủ; **parity các section khác khớp tuyệt đối**; **0 lỗi console**.

> **Bước kế:** Phase 3.6 — CMS mở rộng (Role/Workflow(status Draft→Pending→Published→Archived)/Version(history)/Media/Data Vault) + Backup/Restore + Thống kê quản trị; và bổ sung ô category/tag/AI-metadata cho bài trong CMS. Chờ "duyệt 3.6".

### ✅ Phase 3.6 — CMS mở rộng + Backup/Restore + Thống kê (hoàn tất, đã kiểm thử) — 2026-07-23
**Đã làm (thật, chạy được trong mô hình tĩnh):**
- **Trình soạn thảo bài đủ metadata**: chuyên mục, tag, **trạng thái (workflow)**, tác giả, ngày cập nhật, cấp độ, độ khó, nổi bật, **bài trụ (pillar)**, Tóm tắt AI, từ khóa, **thực thể** (checkbox), **FAQ của bài** (list editor). (Hoàn tất lời hẹn từ 3.3.)
- **Workflow** `status`: Draft → Pending → Published → Archived (tương thích ngược cờ `published`); Thư viện chỉ hiện bài Published (`DataService.getPublishedPosts` theo status).
- **Version history**: mỗi lần lưu tạo snapshot (version, thời gian, hash, tiêu đề, body), **không xóa bản cũ**, xem danh sách + **Khôi phục** bản bất kỳ; giới hạn 20 bản.
- **Thống kê** (`js/dashboard.js` + tab "Thống kê", mở mặc định): tiles (bài theo trạng thái, nổi bật, sản phẩm, chuyên mục, tag, thực thể, người dùng, media) + **Top chuyên mục** (thanh); ghi chú rõ lượt xem cần analytics/backend.
- **Người dùng & Phân quyền** (tab): CRUD `users` với vai trò Super Admin→Contributor. **Media & Kho tri thức (Data Vault)** (tab): CRUD `media` (ảnh/PDF/Excel/video/prompt/dataset/template) dạng đăng ký đường dẫn.
- **Backup/Restore**: thêm **Backup Markdown (.zip)** (mỗi bài một .md + noi-dung.json); cùng với JSON (Xuất/Nhập .json), HTML (Xuất trang), ZIP site (Xuất bản site) đã có → đủ **ZIP/JSON/HTML/Markdown**. Khôi phục toàn bộ = Nhập .json; **khôi phục từng bài** = Lịch sử phiên bản trong editor.
- Dữ liệu: thêm `data/users.json`, `data/media.json`; DataService thêm getMedia/stats/getPostsByStatus/ROLES/STATUSES.

**Ranh giới (đúng như đã báo):** thực thi **RBAC nhiều người + đăng nhập** và **tải file thật vào kho** cần backend — để **Phase 3.8** (Supabase). Hiện Người dùng/Media là cấu hình dữ liệu; một mã PIN mở toàn quyền.

**Kiểm thử (json mode):** 15 tab (thêm Thống kê/Media/Người dùng); Dashboard 11 tiles + 5 thanh top-category (số liệu đúng: 9 bài published, 7 cat, 8 entity, 3 nổi bật…); editor 5 select + 10 checkbox + FAQ + AI + version; đổi status→draft **rớt khỏi Thư viện** (9→8) rồi khôi phục; snapshot version (v1) + section Khôi phục hiện đúng; Markdown zip build OK; **parity front-end khớp tuyệt đối**; **0 lỗi console**.

> **Bước kế:** Phase 3.7 — Hiệu năng (lazy load bài & ảnh, cache, code splitting theo trang) + Bảo vệ nội dung (chặn copy cơ bản, watermark ảnh, tự gắn nguồn khi copy) — không ảnh hưởng SEO. Chờ "duyệt 3.7".

### ✅ Phase 3.7 — Hiệu năng + Bảo vệ nội dung (hoàn tất, đã kiểm thử) — 2026-07-23
**Hiệu năng:**
- **Lazy-load ảnh**: ảnh trong bài + ảnh bìa nhận `loading="lazy"` + `decoding="async"`.
- **Tìm kiếm theo metadata** (title/excerpt/summary/keywords/tags) — **không quét toàn bộ body** → nhanh khi hàng nghìn bài.
- **Cache theo phiên** (`DataService.load` dùng sessionStorage): lần tải trang sau trong cùng phiên không fetch lại `data/*.json` (`source="cache"`). `#site-content` vẫn override đúng theo trang; có `clearCache()`.
- **Code-splitting**: `dashboard.js` + `zip.js` chỉ nạp **theo yêu cầu** khi mở admin (`loadScript`/`ensureAdminModules`) — người đọc không phải tải. `publishSite` vẫn đóng gói 2 file này vào ZIP.

**Bảo vệ nội dung (không ảnh hưởng SEO):**
- **Copy trong bài tự thêm nguồn**: chọn & copy văn bản trong bài → clipboard được thêm dòng "— Nguồn: {tựa} · {thương hiệu}\n{URL}".
- **Ảnh bài**: `draggable="false"` + chặn kéo/menu chuột phải; **watermark** thương hiệu góc ảnh bìa (CSS overlay).
- Bật mặc định; tôn trọng `settings.protect===false` nếu muốn tắt.

**Kiểm thử:** lần đầu `source=json` + ghi cache; reload → `source=cache`; mở admin → dashboard.js/zip.js nạp on-demand (11 tiles hiện); ảnh có lazy/decoding/draggable; search metadata (khớp qua summary, không cần body); **500+ bài giả lập (509)**: renderBlogList **3ms**, search **1ms**, filter **3ms** (phân trang 9/thẻ); copy trong bài chèn nguồn + preventDefault; **parity các section khác khớp**; **0 lỗi console**.

> **Bước kế:** Phase 3.8 *(tùy chọn, tương lai)* — BackendAdapter (Supabase) để có role/version/media/đăng nhập thật + quy mô lớn, **không đổi giao diện**. Đây là bước để dành khi thực sự cần; anh có thể dừng ở 3.7 (đã đủ chạy tĩnh trên GitHub Pages) hoặc "duyệt 3.8" khi muốn lên backend.

### ✅ Phase 3.8 — BackendAdapter (Supabase) (hoàn tất, đã kiểm thử) — 2026-07-23
**Đã làm:**
- `js/backend-adapter.js`: đọc/ghi Supabase qua **REST (PostgREST)** — không cần SDK ngoài nên hợp CSP. `load()` ghép model đúng shape; `upsertPost/deletePost/saveSiteData` cho đường ghi; ánh xạ hàng DB ↔ đối tượng (`updated_at`↔`updatedAt`, `status`→`published`).
- `DataService.load()` thành **điểm vào duy nhất** với thứ tự: **Backend (nếu bật) → cache phiên → nguồn tĩnh**; backend lỗi thì **tự quay về tĩnh**.
- `settings.backend = {enabled, provider, url, anonKey}` + UI cấu hình trong admin (tab SEO & Xuất bản), kèm cảnh báo RLS và cấm dùng `service_role key`.
- `docs/supabase-schema.sql`: bảng `site_data/posts/categories/tags/entities/users/media` + **bật RLS** + chính sách (đọc công khai, `posts` chỉ lộ bài published, `users` không lộ; **ghi chỉ khi đã đăng nhập**).
- CSP thêm `https://*.supabase.co` vào `connect-src` để bật backend không phải sửa tay.

**Kiểm thử (Supabase **giả lập** qua endpoint `/rest/v1/*` trên server test — không thể tạo dự án Supabase thật của chủ dự án):**
- Bật backend → `DataService.source = "backend"`; model ghép đủ: 9 bài (có `ai.summary`, `published` đúng), 7 category, 9 tag, 8 entity, 1 user, 6 sản phẩm, settings + hero.
- **Render từ backend cho độ dài KHỚP TUYỆT ĐỐI với nguồn tĩnh** (hero 1737, solutions 7892, pricing 2707, footer 1769, blog 7411; 9 thẻ, 7 nav, 0 section ẩn sai) → đúng cam kết *đổi nguồn dữ liệu không đổi giao diện*.
- Mở bài từ dữ liệu backend: đúng tiêu đề, có hộp Tóm tắt.
- **Fallback**: trỏ backend sang địa chỉ hỏng → tự quay về `source="json"`, đủ 9 bài.
- Tắt backend → trở lại nguồn tĩnh bình thường. **0 lỗi console.**

**Chưa làm (cần khi dùng thật):** màn hình **đăng nhập** trong admin (adapter đã có sẵn hàm ghi; RLS đã chặn ghi ẩn danh) và công cụ **đổ dữ liệu** từ `data/*.json` sang Supabase — hướng dẫn thủ công đã ghi trong `docs/06-Nang-cap-Backend-Supabase.md`.

---

## 📚 BỘ TÀI LIỆU CHO NGƯỜI DÙNG (2026-07-23)
Viết cho người **không chuyên IT**, đặt tại `README.md` (trang chủ tài liệu) và `docs/`:
1. `01-Deploy-GitHub-Pages.md` — đăng web lần đầu, cập nhật, tên miền riêng, bảng xử lý sự cố.
2. `02-Quan-tri-noi-dung.md` — dùng bảng quản trị, viết bài đủ metadata, workflow, lịch sử phiên bản, sao lưu.
3. `03-Hieu-website-cua-ban.md` — giải thích kiến trúc bằng ngôn ngữ đời thường (3 lớp, vai trò từng thư mục, DataService, URL sạch, cơ chế tự ẩn/hiện).
4. `04-Bao-mat-va-luu-y.md` — **nói thẳng** PIN chỉ là lớp che phía trình duyệt, bảo vệ thật là tài khoản GitHub (bật 2FA); danh sách tuyệt đối không đưa lên web (gồm số liệu công vụ); chống mất dữ liệu; RLS bắt buộc nếu bật Supabase; giới hạn thật của chống sao chép.
5. `05-SEO-va-AI-Search.md` — những gì đã tự động có, việc cần làm một lần (siteBase, Search Console, OG image), công thức viết bài cho AI trích dẫn, topic cluster, sai lầm cần tránh, cách đo.
6. `06-Nang-cap-Backend-Supabase.md` — khi nào chưa cần / nên nâng cấp, các bước, chi phí & rủi ro, cách quay lại chạy tĩnh.
