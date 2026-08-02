# 2. Quản trị nội dung — viết bài, sửa trang

> Đây là công việc hằng ngày. Toàn bộ diễn ra **ngay trong trình duyệt**, không cần cài phần mềm.

---

## Mở bảng quản trị

1. Mở website của anh
2. Bấm **nút bút chì** mờ ở **góc dưới bên phải**
3. Nhập **mã PIN** → bảng quản trị hiện ra

> Quên PIN? Xem cách đặt lại ở [tài liệu 4 — Bảo mật](04-Bao-mat-va-luu-y.md).

---

## Bảng quản trị có gì

| Tab | Dùng để |
|---|---|
| **Thống kê** | Xem tổng quan: bao nhiêu bài, theo trạng thái nào, chuyên mục nào nhiều bài |
| **Bố cục trang** | Bật/tắt và đổi thứ tự các mục trên trang chủ; chọn mục nào lên thanh menu |
| **Thương hiệu & Liên hệ** | Tên, slogan, Zalo, điện thoại, email, địa chỉ |
| **Đầu trang (Hero)** | Câu tiêu đề lớn nhất — thứ khách nhìn thấy đầu tiên |
| **Bối cảnh / Giải pháp / Tầm nhìn / Riêng tư / Bảng giá / Hỏi đáp** | Nội dung từng mục trang chủ |
| **Thư viện Tri thức** | ★ Viết và quản lý bài viết |
| **Media & Kho tri thức** | Danh mục tài sản: ảnh, PDF, Excel, video, prompt, dataset, template |
| **Người dùng & Phân quyền** | Danh sách người viết và vai trò |
| **SEO & Xuất bản** | Địa chỉ website, ảnh chia sẻ, **nút Xuất bản**, sao lưu |
| **Đổi mã PIN** | Đổi mã vào bảng quản trị |

---

## Viết một bài mới

**Tab "Thư viện Tri thức" → nút "Viết bài mới"**

### Phần thông tin cơ bản
- **Tiêu đề bài** — đường dẫn (slug) tự sinh theo tiêu đề, anh có thể sửa
- **Ngày đăng**, **Ảnh bìa** (dán địa chỉ ảnh, có thể để trống)
- **Tóm tắt** — câu hiện trên thẻ bài ở trang danh sách

### Phần phân loại
- **Chuyên mục** — chọn 1 trong 7 nhóm (Data Foundation, Thuế & Kế toán, AI cho doanh nghiệp…)
- **Trạng thái** — xem bảng bên dưới
- **Tác giả**, **Ngày cập nhật**
- **Tag** — các từ khóa ngắn, cách nhau bằng dấu phẩy
- **Cấp độ** — Nền tảng / Nâng cao / Chuyên sâu (dùng để xếp *chuỗi học tập*)
- **Độ khó** — Cơ bản / Trung cấp / Nâng cao (hiện trên bài)
- **Bài nổi bật** — có huy hiệu và được xếp lên đầu
- **Bài trụ (pillar)** — bài nền tảng của chuyên mục, đứng đầu chuỗi học tập

### Phần nội dung
Trình soạn thảo có các nút: **H2 / H3** (tiêu đề mục), **B / I / U**, danh sách, trích dẫn, link, ảnh.

> **Mẹo quan trọng:** hãy dùng **H2/H3** để chia bài thành các mục.
> Hệ thống tự sinh **Mục lục** từ đó, và Google/AI cũng dựa vào đó để hiểu bài.

### Phần "AI & Tri thức" *(nên điền — giúp AI trích dẫn đúng)*
- **Tóm tắt cho AI** — 1–2 câu súc tích về bài
- **Từ khóa** — cách nhau bằng dấu phẩy
- **Thực thể liên quan** — tick các khái niệm/sản phẩm bài có nhắc đến
- **Câu hỏi thường gặp (FAQ)** — mỗi câu hỏi + trả lời; hiện ở cuối bài và được gửi cho Google dạng FAQ

### Lưu
Bấm **"Lưu bài & về danh sách"**. Mỗi lần lưu, hệ thống tạo một **phiên bản** mới.

---

## Trạng thái bài viết (workflow)

| Trạng thái | Ý nghĩa | Có hiện trên web không? |
|---|---|---|
| **Nháp** | Đang viết dở | ❌ |
| **Chờ duyệt** | Viết xong, đợi người có quyền xem lại | ❌ |
| **Đã xuất bản** | Hoàn chỉnh | ✅ |
| **Lưu trữ** | Cũ, cất đi nhưng không xóa | ❌ |

---

## Lịch sử phiên bản — cứu tinh khi lỡ tay

Mỗi lần lưu bài, hệ thống chụp lại một bản (giữ 20 bản gần nhất, **không xóa bản cũ**).
Trong trình soạn thảo, kéo xuống mục **"Lịch sử phiên bản"** → bấm **Khôi phục** ở bản muốn quay lại.

> Dùng khi: xóa nhầm đoạn, sửa hỏng, hoặc muốn so lại bản cũ.

---

## ⚠️ Quy tắc vàng: Sửa xong ≠ Đã đăng

Khi anh sửa trong bảng quản trị, thay đổi **chỉ nằm trong trình duyệt của anh**.
Để khách nhìn thấy, phải:

1. **SEO & Xuất bản → Xuất bản site (.zip)**
2. Giải nén, tải lên GitHub ([tài liệu 1](01-Deploy-GitHub-Pages.md))

**Nếu đóng trình duyệt trước khi xuất bản, thay đổi có thể mất.**
Hệ thống có lưu bản nháp tạm trong máy (nút *Khôi phục nháp*), nhưng **đừng dựa vào nó** —
hãy xuất bản, hoặc ít nhất bấm **Xuất .json** để giữ một bản.

---

## Sao lưu (làm định kỳ!)

| Cách | Nút | Được gì |
|---|---|---|
| **JSON** | *Xuất .json* (thanh trên) | Toàn bộ nội dung trong 1 file — dùng để khôi phục |
| **Markdown** | *Backup Markdown (.zip)* | Mỗi bài một file `.md` dễ đọc + file JSON |
| **Cả website** | *Xuất bản site (.zip)* | Trọn bộ website để đăng hoặc lưu trữ |
| **Một file HTML** | *Xuất trang (.html)* | Bản gọn một file, tiện gửi/lưu |

**Khôi phục toàn bộ:** nút **Nhập .json** trên thanh trên → chọn file đã lưu.
**Khôi phục một bài:** dùng *Lịch sử phiên bản* trong trình soạn thảo bài đó.

> Khuyến nghị: mỗi tháng bấm **Xuất .json** một lần, lưu vào Google Drive hoặc ổ cứng ngoài.

---

## Mẹo viết bài tốt cho HuyData

- Viết như đang **nói chuyện với bà con** — đúng giọng thương hiệu
- Mỗi bài giải **một câu hỏi cụ thể**
- Chia mục bằng H2/H3; mỗi mục 2–4 câu
- Điền **Tóm tắt cho AI** và **FAQ** — đây là phần AI hay trích nhất
- Gắn đúng **chuyên mục** và **cấp độ** để bài vào đúng *chuỗi học tập*
- Bài đầu tiên của một chuyên mục nên đặt **Bài trụ (pillar)**
