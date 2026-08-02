# 5. SEO & AI Search — để Google và AI tìm thấy, hiểu đúng

> **SEO** = làm cho Google tìm thấy và xếp hạng tốt.
> **AI Search** = làm cho ChatGPT, Gemini, Copilot… hiểu đúng và **trích dẫn** bài của anh.
> Cả hai đã được xây sẵn vào website. Tài liệu này giúp anh **giữ và phát huy**.

---

## Phần 1 — Website đã tự làm sẵn những gì

Anh **không phải làm gì thêm**, mỗi lần **Xuất bản site (.zip)** những thứ này tự sinh:

| Thứ | Tác dụng |
|---|---|
| **Đường dẫn sạch** `/{chuyên-mục}/{tên-bài}/` | Người đọc và Google đều hiểu ngay |
| **Trang HTML thật cho từng bài** | Google/AI đọc được **không cần chạy mã** → lập chỉ mục tốt hơn hẳn |
| **`sitemap.xml`** | Bản đồ website nộp cho Google |
| **`rss.xml`** | Người đọc/công cụ theo dõi bài mới |
| **`robots.txt`** | Chỉ dẫn cho bot thu thập |
| **Thẻ canonical** | Chống trùng lặp nội dung |
| **Open Graph / Twitter Card** | Dán link lên Zalo, Facebook hiện đẹp (tiêu đề, mô tả, ảnh) |
| **Dữ liệu có cấu trúc (JSON-LD)** | Xem bảng dưới |

### Dữ liệu có cấu trúc — "phiên dịch viên" cho máy

| Loại | Nói với Google/AI điều gì |
|---|---|
| `Organization` | HuyData là tổ chức nào, liên hệ ra sao |
| `Person` | Trần Huy là ai, vai trò gì |
| `WebSite` + `SearchAction` | Website có chức năng tìm kiếm |
| `BlogPosting` | Đây là bài viết: tiêu đề, tác giả, ngày, chuyên mục, từ khóa |
| `BreadcrumbList` | Bài nằm ở đâu trong cấu trúc site |
| `FAQPage` | Đây là các câu hỏi–đáp (có thể hiện ngay trên kết quả Google) |
| `SoftwareApplication` | Các phần mềm HuyData cung cấp |

---

## Phần 2 — Việc anh cần làm (một lần)

### 1. Điền đúng **siteBase**
Bảng quản trị → **SEO & Xuất bản** → ô **Địa chỉ website (siteBase)**
→ điền đúng địa chỉ thật, ví dụ `https://tenban.github.io/huydata/` hoặc `https://huydata.vn/`.

> Sai ô này thì sitemap và canonical trỏ nhầm — Google sẽ bối rối. **Đây là lỗi hay gặp nhất.**

### 2. Đăng ký Google Search Console *(miễn phí, nên làm)*
1. Vào <https://search.google.com/search-console>
2. Thêm tài sản (property) → nhập địa chỉ website
3. Xác minh quyền sở hữu (thường bằng cách tải một file lên, hoặc thẻ meta)
4. Vào **Sitemaps** → nộp `sitemap.xml`

Từ đó anh xem được: ai tìm từ khóa gì mà ra web mình, bài nào được xem nhiều.

### 3. Đặt ảnh chia sẻ
**SEO & Xuất bản** → **Ảnh chia sẻ (OG image)** → dán địa chỉ một ảnh **1200×630px**.
Đây là ảnh hiện khi ai đó dán link website lên Zalo/Facebook.

### 4. Điền tiêu đề & mô tả trang
Cùng tab đó. Để trống thì hệ thống tự lấy từ tiêu đề Hero — vẫn dùng được, nhưng tự viết sẽ hay hơn.
- **Tiêu đề**: 50–60 ký tự
- **Mô tả**: 150–160 ký tự, có lợi ích rõ ràng

---

## Phần 3 — Viết bài cho AI trích dẫn

Đây là điểm khác biệt lớn. AI ngày càng trả lời trực tiếp thay vì đưa link — muốn được **nhắc tên**,
bài phải **dễ hiểu với máy**.

### Công thức cho mỗi bài

| Thành phần | Ở đâu trong trình soạn thảo | Vì sao quan trọng |
|---|---|---|
| **Tóm tắt cho AI** | Mục "AI & Tri thức" | ★ AI hay lấy nguyên câu này để trích |
| **Tiêu đề mục (H2/H3)** | Nút H2/H3 khi soạn | Sinh mục lục, giúp AI nắm dàn ý |
| **Định nghĩa rõ ràng** | Một mục H2 tên "Định nghĩa"/"… là gì" | AI thích trích định nghĩa |
| **Ví dụ cụ thể** | Một mục H2 "Ví dụ" | Tăng độ tin cậy |
| **FAQ** | Mục "Câu hỏi thường gặp" | ★ Vừa hiện trên Google, vừa được AI dùng |
| **Từ khóa** | Mục "AI & Tri thức" | Giúp phân loại chủ đề |
| **Thực thể liên quan** | Tick trong "AI & Tri thức" | Nối bài với khái niệm/sản phẩm — AI hiểu ngữ cảnh |

### Cụm chủ đề (Topic Cluster) — sức mạnh cộng dồn

Mỗi chuyên mục nên có:
- **1 bài trụ (pillar)** — bài nền tảng, tick ô *"Bài trụ"*, đặt **Cấp độ: Nền tảng**
- **Nhiều bài con** — đi sâu từng khía cạnh, đặt **Cấp độ: Nâng cao / Chuyên sâu**

Hệ thống **tự nối chúng thành "Chuỗi học tập"** hiện ở cuối mỗi bài. Google đánh giá cao
những cụm nội dung liên kết chặt như vậy — nó chứng minh anh **am hiểu sâu một lĩnh vực**,
chứ không viết lan man.

---

## Phần 4 — Sai lầm cần tránh

| ❌ Đừng làm | Vì sao |
|---|---|
| Đổi đường dẫn (slug) của bài đã đăng lâu | Mất thứ hạng, link cũ gãy. Nếu buộc phải đổi, chấp nhận mất và đổi sớm |
| Nhồi từ khóa lặp đi lặp lại | Google phạt; người đọc khó chịu |
| Copy bài từ nơi khác | Bị đánh giá trùng lặp, có thể vi phạm bản quyền |
| Bài quá ngắn (dưới 300 chữ) | Ít giá trị, khó xếp hạng |
| Bỏ trống Tóm tắt và FAQ | Mất cơ hội được AI trích dẫn — phần dễ ăn điểm nhất |
| Quên **Xuất bản** sau khi viết | Bài không tồn tại với thế giới bên ngoài |
| Để sai **siteBase** | Sitemap sai địa chỉ, Google không lần ra |

---

## Phần 5 — Đo kết quả

**Sau 1–2 tuần đăng:** vào Google, gõ `site:tenban.github.io/huydata` → xem Google đã lập chỉ mục bao nhiêu trang.

**Kiểm tra dữ liệu có cấu trúc:** dán địa chỉ một bài vào
<https://search.google.com/test/rich-results> → phải thấy `BlogPosting`, `BreadcrumbList`,
và `FAQPage` (nếu bài đó có FAQ).

**Kiểm tra hiển thị khi chia sẻ:** dán link vào khung soạn tin Zalo/Facebook → xem tiêu đề, mô tả, ảnh.

**Thử với AI:** hỏi ChatGPT/Gemini một câu mà bài anh trả lời được, kèm "theo huydata" —
xem AI có tìm và trích đúng không. (Cần thời gian để AI cập nhật.)

> **Lưu ý thực tế:** SEO cần **kiên nhẫn**. Thường 1–3 tháng mới thấy chuyển biến rõ.
> Đăng đều đặn quan trọng hơn đăng nhiều một lúc.
