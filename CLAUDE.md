# CLAUDE.md — kho huydata.vn (bản v9)

> Claude Code đọc file này khi mở kho. Ghi đúng hiện trạng để phiên sau không bắt đầu lại từ đầu.

## Hiện trạng: bản v9 (từ 10/2026)

Định vị: **"Phần mềm và hỗ trợ sổ sách cho hộ kinh doanh, doanh nghiệp nhỏ"** (theo kế hoạch chiến lược v3, 07/10/2026).
Phần mềm đứng trước (Hóa Đơn Pro, Kho Pro, Sổ Doanh Thu), gói Đồng hành đi sau.

**Mọi trang là HTML tĩnh**, không còn lớp phủ SPA. Bộ dựng `hd-build.js` biến `noi-dung.json` thành toàn bộ trang.

| File | Vai trò | Ai sửa |
|---|---|---|
| `noi-dung.json` | Toàn bộ nội dung (trang, khối, bài viết, giá, cài đặt) | Trang quản trị |
| `hd-build.js` | Bộ dựng trang (chạy trong trình duyệt và Node) | Code |
| `giao-dien.css`, `site.js` | Giao diện, tiện ích nhỏ | Code |
| `quan-tri/` | Trang quản trị (PIN → soạn → Đăng lên GitHub) | Code |
| `index.html`, `phan-mem/…`, `dich-vu/…`, `dong-hanh/…`, `bai-viet/…`, `sitemap.xml`, `robots.txt`, `404.html` | Trang sinh ra | Trang quản trị sinh lại mỗi lần đăng |
| `giai-phap/…`, `cong-cu/…` | Trang chuyển hướng địa chỉ cũ (noindex) | Sinh từ `redirects` trong noi-dung.json |
| `van-ban/<slug>/index.html` | Văn bản HTML tải lên, giữ nguyên | Chỉ ghi lại khi chọn file mới |
| `anh/` | Ảnh. `anh/v9/` là ảnh chụp phần mềm bằng dữ liệu MẪU | Trang quản trị tải ảnh lên |

Mã nguồn gốc và công cụ dựng/chụp ảnh nằm ngoài kho: `D:\CLAUDE CODE\HUYDATA.VN\v9\` (src/, tools/).
Sửa code ở đó, `node tools/build.mjs` → `node tools/kiem-tra.mjs` → `tools/dang-len.ps1`.

## Kiến thức (/bai-viet/)
Thư viện kiến thức, không phải chỗ quảng cáo phần mềm. Chuyên mục (`blog.categories`, có trang `/bai-viet/chuyen-muc/<slug>/`, tự ẩn khi trống), nhãn "Dành cho" (`blog.audiences`), mỗi bài có `category`, `audience[]`, `facts[]` (khung Thông tin chính), `sources[]`, `product` (gợi ý công cụ, không bắt buộc). Bài `pillar:true` là **Cẩm nang** (mỗi chuyên mục một bài tổng quan): hiện ở khối "Cẩm nang trọng tâm", đứng đầu chuyên mục, các bài cùng chuyên mục tự dẫn về. Khối "Mới cập nhật" chỉ hiện khi > 6 bài và không lặp cẩm nang. Tìm bài + lọc chạy bằng site.js.

## Menu và dịch vụ
`settings.nav[]`: mỗi mục có `label`, `href`, tùy chọn `auto` ("products" | "services" | "knowledge" — danh sách thả xuống tự lấy) và `children[]` (label, href, desc — thêm tay). Rê chuột/tab vào mục sẽ thả xuống (CSS thuần). Trang dịch vụ: `kind:"service"`, `parent:"dich-vu"`, `order`, `card{name,line,icon}`; khối `services` liệt kê tự động. Hub `/dich-vu/`; Đồng hành giữ địa chỉ `/dong-hanh/`.

## Ảnh bìa bài viết
`anh/v9/bia/<slug>.jpg` (1200×630, cũng là ảnh chia sẻ Zalo/Facebook). Vẽ từ khuôn `v9/tools/chup/bia.html` (minh họa SVG riêng từng bài, tông màu theo chuyên mục, bài Cẩm nang nền xanh thẫm) rồi `node tools/chup/bia.mjs`. Bài mới: thêm một mục vào `COVERS` + một hàm vào `ART`. Không dùng ảnh rập khuôn. Ảnh chia sẻ chung `anh/v9/og-*.jpg` (huydata, phan-mem, dich-vu, kien-thuc, van-ban) vẽ cùng khuôn (mục `og:true`); trang dùng `seo.image`, Kiến thức `blog.image`, Văn bản `docs.image`. Ảnh chụp phần mềm của 6 bài cũ nằm trong thân bài (`<figure>`).

## Đo lượt xem
GA4 (`settings.analytics.ga4`) + Search Console (`analytics.gsc`); site.js đếm `contact_click` (zalo/phone/email) và `share`. Nút chia sẻ cuối bài gắn `utm_source=zalo|facebook&utm_medium=chia-se`. Trang `/chinh-sach-quyen-rieng-tu/` (link ở chân trang). Hướng dẫn cho chủ dự án: `noi-dung/GD6-HUONG-DAN-GOOGLE-VA-DO-LUOT-XEM.md`.

## Giọng văn
Giọng bán hàng ấm, lịch sự, đủ ý: xưng "HuyData/chúng tôi", gọi "anh chị/cô chú anh chị". Không "tụi tôi", không câu cộc, không dạy đời.

## Ranh giới nội dung (bắt buộc)
- Không dùng: "kế toán trọn gói", "dịch vụ kế toán", "khai thuế thay", "đại lý thuế", "cam kết không bị phạt".
- Không ghi số năm kinh nghiệm, không ghi "thống kê", chức danh, nơi công tác của chủ hộ.
- Giá để "Liên hệ" trừ khi chủ dự án đổi. Không nhắc Kế Toán Pro (chưa phát hành).
- Lời khách thật: chỉ cắt bớt, không viết thêm.
- Nguồn cuối bài ("Căn cứ và nguồn chính thức"): CHỈ văn bản gốc và trang nhà nước (vanban/congbao/xaydungchinhsach.chinhphu.vn, baochinhphu.vn, gdt.gov.vn, mof.gov.vn, vbpl.vn). Không dẫn MISA, Sapo, các hãng hóa đơn hay công ty tư vấn. kiem-tra.mjs báo lỗi nếu vi phạm.
- Hóa đơn điện tử: từ 01/7/2026 căn cứ là Nghị định 254/2026/NĐ-CP + Thông tư 91/2026/TT-BTC (thay NĐ 123/2020, NĐ 70/2025).

## Quản trị
- Vào: `huydata.vn/quan-tri/` (bánh răng 11px rất mờ ngay trước "© năm HuyData" ở chân trang, `#quan-tri` cũ, Ctrl/⌘+Alt+A).
- PIN: băm SHA-256 ở `noi-dung.json → settings.pinHash`. Đổi trong Cài đặt chung.
- Chìa khóa GitHub: localStorage `hd_gh_token` / `hd_gh_cfg` (dùng chung bản cũ). Không bao giờ vào file.
- Nút Đăng: một commit qua Git Data API, **chỉ thêm/ghi đè, không xóa file**. Gỡ trang đã đăng: dùng nút Xóa trang (tự thêm chuyển hướng) hoặc `git rm`.

## Sao lưu
Nhánh `sao-luu-v8-truoc-v9` = bản ngay trước v9. Nhánh `backup-noidung-cu` = SPA cũ.
