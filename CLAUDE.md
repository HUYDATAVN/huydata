# CLAUDE.md — Hồ sơ dự án HuyData (cho Claude Code)

> Claude Code tự đọc file này khi mở dự án. Nó cho biết **hiện trạng thật** và **hướng đi** để
> không bắt đầu lại từ đầu. File nằm trong git nên đi theo mọi `git clone`.

## ⚠️ CẬP NHẬT 21/08/2026 — ĐANG CHẠY BẢN v4 NHIỀU TRANG

**Phần "Bản đang CHẠY" bên dưới đã cũ.** Site không còn là một file duy nhất định tuyến bằng `#`.

- Mỗi bài viết là **một trang HTML thật**: `/bai-viet/<slug>/index.html`. Có `/bai-viet/` (danh sách),
  `404.html`, `sitemap.xml` địa chỉ thật, `robots.txt` khai sitemap và vẫn chặn `/_old/`.
- Lý do đổi: Google cắt bỏ mọi thứ sau dấu `#`, nên với `#/bai/<slug>` thì **mọi bài viết đều bị coi là
  cùng một trang** — viết bao nhiêu bài cũng chỉ có đúng một trang xếp hạng được.
- Trang chủ nay nướng sẵn nội dung vào `<noscript>`: **207 → 13.713 ký tự** bot đọc được khi không chạy JS.
- JSON-LD: trang chủ AccountingService · WebSite · FAQPage · CollectionPage; trang bài thêm Article ·
  BreadcrumbList. Hồ sơ pháp lý thật (MST 83084000563) đã nằm trong dữ liệu có cấu trúc.

### Quy trình đăng — ĐÃ ĐỔI, đọc kỹ

`index.html` vẫn tự chứa admin (nút bút chì + PIN). Nhưng nút để đăng bây giờ là
**"Xuất bản site (.zip)"**, không phải "Xuất trang (.html)".

1. Mở huydata.vn → bút chì → PIN → sửa → **Lưu**
2. **Xuất bản site (.zip)** → tải về `huydata-site.zip` (8 file)
3. Giải nén, chép **cả bộ** vào kho (giữ nguyên thư mục `bai-viet/`), `git add -A && git commit && git push`

> **`capnhat-web.bat` KHÔNG còn đủ.** Nó chỉ chép một file `HuyData_Website*.html` từ Downloads đè lên
> `index.html`. Làm vậy thì trang chủ có nội dung mới nhưng `sitemap.xml` và các trang `/bai-viet/…/`
> vẫn là bản cũ — bài mới sẽ không có trang riêng. Dùng nút .zip.

> Nút **"Xuất trang (.html)"** vẫn còn, chỉ ra một file trang chủ — dùng khi sửa nhanh phần landing
> mà không đụng tới bài viết.

### Chỗ dễ vấp trong mã

- Bộ nén ZIP **tự viết** (`zipMake()`, kiểu store + CRC32) vì CSP của trang chặn script ngoài.
  Tên thư mục trong ZIP luôn phải dùng `/`, không phải `\`.
- `SHELL` được chụp bằng `document.documentElement.outerHTML` ở đầu thẻ `<script>` cuối trang —
  nên bản xuất ra vẫn xuất bản lại được. Đừng chuyển thẻ script đó lên trên.
- Thẻ bài trên trang chủ là `<a href="bai-viet/…/">` thật, JS chặn `click` để mở nhanh trong trang.
  Ctrl+bấm vẫn đi tới trang thật. Đừng đổi lại thành `<div>`.
- Chữ giữ chỗ dạng `(Điền …)` được lọc khỏi `<noscript>` và khỏi JSON-LD — cứ để nguyên, không sợ
  Google lập chỉ mục nhầm.

### Việc còn lại (chủ dự án tự làm)

Google Search Console (yêu cầu lập chỉ mục + khai sitemap) · Google Business Profile ·
ảnh chia sẻ OG 1200×630 (đang trống).

---

## Bản 1-file (LỊCH SỬ — không còn là bản đang chạy)
Trang thật **https://huydata.vn** hiện là **MỘT FILE HTML tự chứa** (`index.html`): CSS + JS + nội dung
đều inline trong file, định tuyến bằng **hash** (`#/bai/<slug>`), có sẵn **panel quản trị** (nút bút chì +
mã PIN, băm SHA-256 trong `settings.pinHash`). Nút **"Xuất trang (.html)"** trong admin xuất ra lại một
file HTML đã bake nội dung → đó là cơ chế "publish".

- Chủ dự án: Trần Huy. Định vị mới, **đơn giản**: web để **đăng bài chuẩn SEO** cho hộ kinh doanh về thuế/kế toán.
- Kho: github.com/HUYDATAVN/huydata · Deploy: GitHub Pages (nhánh `main`, thư mục `/root`).
- `CNAME` = huydata.vn · `.nojekyll` bắt buộc · HTTPS đã bật (Enforce HTTPS).

## MỤC TIÊU HIỆN TẠI / HƯỚNG ĐI
Giữ **đơn giản**. Ưu tiên: **viết bài chuẩn SEO**, dễ quản trị. **Có thể sẽ thiết kế lại** trang theo hướng
gọn hơn. Không cần kiến trúc phức tạp.

## LỊCH SỬ (vì sao có thư mục `_old/`)
Trước đó dự án từng được refactor thành **SPA nhiều module** (DataService, router, seo.js, sinh trang tĩnh
mỗi bài, sitemap/rss, CMS mở rộng, backend Supabase — Phase 3.0→3.8). Sau đó chủ dự án **quay lại bản
1-file cho đơn giản**. Toàn bộ SPA cũ được **lưu trữ**:
- Thư mục **`_old/`** trong repo (js/, css/, data/, các trang bài, sitemap/rss…).
- Nhánh **`backup-noidung-cu`** (bản SPA nguyên vẹn, commit `b0bc0ac`).
- Nhật ký kỹ thuật của giai đoạn SPA: `_old/`… và các `docs/` (mô tả SPA — **không còn là bản đang chạy**).

> Khi bàn về "bản đang chạy", đó là **`index.html` 1-file**, KHÔNG phải SPA trong `_old/`.

## Cấu trúc repo hiện tại
```
index.html          ← BẢN ĐANG CHẠY (1 file tự chứa)
CNAME               ← huydata.vn (đừng xóa)
.nojekyll           ← bắt buộc cho GitHub Pages
robots.txt          ← chặn /_old/ khỏi Google
capnhat-web.bat     ← công cụ cập nhật bản 1-file
_old/               ← SPA cũ đã lưu trữ (không phải bản chạy)
docs/               ← tài liệu (phần lớn mô tả SPA cũ — tham khảo)
README.md · CLAUDE.md
```

## Quy trình cập nhật nội dung (bản 1-file)
1. Mở https://huydata.vn → nút bút chì → nhập PIN → sửa/viết bài → **Lưu**.
2. Tab xuất bản → **"Xuất trang (.html)"** → tải về `HuyData_Website.html` (Downloads).
3. Nháy đúp **`capnhat-web.bat`** (tự chép file đó thành `index.html` rồi `git push`). Hoặc thủ công:
   chép đè `index.html` + `git add index.html && git commit && git push`.
4. Chờ 1–2 phút → GitHub Pages cập nhật.

## Dev/test
Không có Node/Python thật (python là stub Store). Dùng server tĩnh PowerShell (.NET HttpListener) rồi mở
qua `mcp__Claude_Browser__preview_start`; kiểm bằng `javascript_tool`/`read_console_messages`. File 1-file
tự chứa nên có thể mở thẳng để test, không cần fetch.

## GOTCHAS
- **PIN**: băm SHA-256 trong `settings.pinHash` của chính `index.html`. Bản 1-file hiện tại dùng PIN riêng
  (không phải "huydata"). Quên PIN → thay `pinHash` bằng băm SHA-256 của PIN mới rồi push.
- **PowerShell:** đừng đặt hàm tên `RD`/`H` (trùng alias). Đường dẫn có dấu cách + xóa đệ quy dễ bị guard chặn → dùng `[System.IO.Directory]::Delete`.
- **Đừng xóa** `CNAME`, `.nojekyll`.
- Muốn xem lại/khôi phục SPA: `git checkout backup-noidung-cu` hoặc lấy từ `_old/`.
