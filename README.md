# HuyData Platform — Website

Đây là website của HuyData: một **nền tảng dữ liệu và tri thức** chạy hoàn toàn bằng file tĩnh
(không cần máy chủ, không cần thuê bao), tự quản trị nội dung ngay trong trình duyệt.

> **Anh không cần biết lập trình để dùng nó.** Hãy đọc theo thứ tự bên dưới.

---

## 📚 Bộ tài liệu (đọc theo thứ tự)

| # | Tài liệu | Dành cho việc gì |
|---|---|---|
| 1 | [Đưa website lên mạng bằng GitHub Pages](docs/01-Deploy-GitHub-Pages.md) | Lần đầu đăng web, và mỗi lần cập nhật |
| 2 | [Quản trị nội dung (viết bài, sửa trang)](docs/02-Quan-tri-noi-dung.md) | Công việc hằng ngày |
| 3 | [Hiểu website của mình](docs/03-Hieu-website-cua-ban.md) | Biết mình đang sở hữu cái gì |
| 4 | [Bảo mật & những điều cần lưu ý](docs/04-Bao-mat-va-luu-y.md) | **Đọc kỹ** — tránh mất dữ liệu, lộ thông tin |
| 5 | [SEO & AI Search](docs/05-SEO-va-AI-Search.md) | Để Google và AI tìm thấy, hiểu đúng |
| 6 | [Nâng cấp lên Backend (Supabase)](docs/06-Nang-cap-Backend-Supabase.md) | Khi cần nhiều người cùng viết |

Hồ sơ kỹ thuật: [Kế hoạch & nhật ký refactor](docs/HuyData-V2-KeHoach-Refactor.md) · [Lược đồ CSDL](docs/supabase-schema.sql)

---

## 🗂 Trong thư mục này có gì

```
index.html          Trang chính (khung website)
404.html            Trang dự phòng — giúp link bài viết vào thẳng được
.nojekyll           Báo GitHub Pages đừng xử lý lại file (bắt buộc, đừng xóa)

css/main.css        Toàn bộ giao diện: màu, chữ, bố cục, hiệu ứng
js/                 Bộ não của website (8 tập tin, mỗi tập một nhiệm vụ)
data/               ★ NỘI DUNG của anh: bài viết, sản phẩm, thông tin liên hệ…
docs/               Bộ tài liệu này
HuyData_Website_6.html   Bản website cũ (một file) — GIỮ LẠI làm bản gốc dự phòng
```

**Quan trọng:** thư mục `data/` là nơi chứa nội dung. Sao lưu thư mục này = sao lưu công sức của anh.

---

## ⚡ Ba việc hay dùng nhất

**1. Xem thử website trên máy**
Website cần được "phục vụ" qua một web server nhỏ để chạy đầy đủ.
Cách nhanh nhất: dùng bản đã đăng trên GitHub Pages. Nếu mở thẳng file `index.html`
bằng trình duyệt, trang vẫn chạy nhưng ở *chế độ dự phòng* (đọc nội dung nhúng sẵn).

**2. Sửa nội dung**
Mở website → bấm **nút bút chì** ở góc dưới bên phải → nhập **mã PIN** → sửa.
Xem chi tiết: [Quản trị nội dung](docs/02-Quan-tri-noi-dung.md).

**3. Đăng lên mạng**
Trong bảng quản trị: tab **SEO & Xuất bản** → **Xuất bản site (.zip)** → giải nén → tải lên GitHub.
Xem chi tiết: [Deploy GitHub Pages](docs/01-Deploy-GitHub-Pages.md).

---

## ✅ Website này đã có sẵn

- **Thư viện Tri thức**: 7 chuyên mục, thẻ tag, tìm kiếm, mục lục bài, bài liên quan, chuỗi học tập
- **SEO đầy đủ**: đường dẫn sạch, sitemap, RSS, dữ liệu có cấu trúc (Google hiểu được)
- **Tối ưu cho AI**: tóm tắt, thực thể, FAQ — để AI trích dẫn đúng
- **Quản trị**: viết bài, duyệt bài theo trạng thái, lịch sử phiên bản, thống kê, sao lưu
- **Riêng tư**: không cookie, không theo dõi người đọc
