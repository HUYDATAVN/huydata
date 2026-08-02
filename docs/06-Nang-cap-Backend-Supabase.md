# 6. Nâng cấp lên Backend (Supabase)

> **Tài liệu này chỉ dùng khi anh THỰC SỰ cần.** Website hiện tại chạy tĩnh rất tốt,
> miễn phí và an toàn. Đừng nâng cấp chỉ vì "nghe hiện đại".

---

## 1. Khi nào **chưa cần** backend

Nếu anh đang ở tình huống sau thì **giữ nguyên như hiện tại**:

- Một mình anh (hoặc 1–2 người thân tín) viết bài
- Dưới vài trăm bài viết
- Không cần đăng nhập cho cộng tác viên
- Chấp nhận quy trình: sửa → Xuất bản → tải lên GitHub

→ **Chi phí 0đ, gần như không thể bị hack, không phải bảo trì.** Rất khó có lựa chọn tốt hơn.

## 2. Khi nào **nên** nâng cấp

Cân nhắc backend khi xuất hiện ít nhất một trong các nhu cầu:

| Nhu cầu thật | Vì sao cần backend |
|---|---|
| **Nhiều người cùng viết**, mỗi người một tài khoản | Cần đăng nhập thật + phân quyền thật |
| **Phân quyền có hiệu lực** (Contributor không tự xuất bản được) | Bản tĩnh chỉ có 1 mã PIN mở toàn quyền |
| **Tải file trực tiếp** vào kho media | Bản tĩnh chỉ lưu *đường dẫn* tới file |
| **Hàng nghìn bài viết** | Cần truy vấn/phân trang phía máy chủ |
| Muốn **bỏ bước "Xuất bản rồi tải lên"** | Backend lưu thẳng, đăng là hiện |

---

## 3. Điều quan trọng nhất: **giao diện không đổi**

Website được thiết kế sẵn cho việc này. Toàn bộ phần hiển thị chỉ nói chuyện với `DataService`;
đổi nguồn dữ liệu là **đổi phần ruột, không đụng giao diện**.

> Điều này **đã được kiểm chứng thực tế**: khi thử chạy toàn bộ website từ Supabase,
> mọi phần hiển thị ra **giống hệt** bản tĩnh — không lệch một chữ.
> Và khi backend gặp sự cố, website **tự động quay về dữ liệu tĩnh**, không sập.

Nghĩa là: nâng cấp **không rủi ro giao diện**, và **có đường lui**.

---

## 4. Các bước thực hiện

### Bước 1. Tạo dự án Supabase
1. Vào <https://supabase.com> → đăng ký (có gói miễn phí)
2. **New project** → đặt tên, chọn vùng gần Việt Nam (Singapore), đặt mật khẩu CSDL
3. Chờ vài phút cho dự án khởi tạo

### Bước 2. Tạo bảng và **bật bảo mật**
1. Trong dự án → **SQL Editor** → **New query**
2. Mở file `docs/supabase-schema.sql` trong thư mục website, **copy toàn bộ**, dán vào
3. Bấm **Run**

> ⚠️ **Chạy nguyên file, đừng bỏ bớt phần cuối.** Phần đó bật **RLS (Row Level Security)** —
> thứ duy nhất ngăn người lạ xóa dữ liệu của anh. Xem [tài liệu 4](04-Bao-mat-va-luu-y.md).

### Bước 3. Chuyển nội dung hiện có sang Supabase
Trong **Table Editor**, với mỗi bảng dùng chức năng **Insert → Import data from CSV**,
hoặc nhờ người biết kỹ thuật đổ dữ liệu từ các file trong `data/` sang.

Ánh xạ dữ liệu:

| File hiện tại | Vào bảng |
|---|---|
| `config.json` | `site_data`, dòng có `key = 'config'` |
| `content.json` | `site_data`, dòng `key = 'content'` |
| `products.json` | `site_data`, dòng `key = 'products'` |
| `posts.json` → phần thông tin mục | `site_data`, dòng `key = 'blog'` |
| `posts.json` → mảng `posts` | bảng `posts` (mỗi bài một dòng) |
| `categories.json`, `tags.json`, `entities.json`, `users.json`, `media.json` | các bảng cùng tên |

> Lưu ý: trong bảng `posts`, cột tên là `updated_at` (không phải `updatedAt`), và trạng thái
> nằm ở cột `status` với giá trị `draft` / `pending` / `published` / `archived`.

### Bước 4. Lấy thông tin kết nối
Supabase → **Project Settings → API**:
- **Project URL** — dạng `https://xxxxx.supabase.co`
- **anon public key** — khóa công khai

> ❌ **Tuyệt đối KHÔNG lấy `service_role key`.** Khóa đó toàn quyền, chỉ dùng ở máy chủ.

### Bước 5. Bật trong website
Bảng quản trị → **SEO & Xuất bản** → mục **Nguồn dữ liệu (Backend)**:
1. Tick **"Dùng backend Supabase thay cho dữ liệu tĩnh"**
2. Dán **Supabase URL**
3. Dán **anon key**
4. **Xuất bản site (.zip)** → tải lên GitHub → tải lại trang

Kiểm tra: nếu nội dung vẫn hiện đúng, backend đã chạy. (Website đã được cho phép sẵn kết nối
tới `*.supabase.co` trong chính sách bảo mật CSP, anh không phải sửa gì thêm.)

### Bước 6. Bật đăng nhập cho người viết
Supabase → **Authentication → Users** → thêm tài khoản cho từng cộng tác viên.
Nhờ chính sách RLS đã cài, **chỉ tài khoản đã đăng nhập mới ghi được dữ liệu**.

> Phần màn hình đăng nhập trong trang quản trị là **bước phát triển tiếp theo** —
> adapter đã sẵn sàng (có hàm ghi dữ liệu), phần giao diện đăng nhập cần làm thêm khi anh dùng tới.

---

## 5. Chi phí & rủi ro cần biết trước

| Khoản | Thực tế |
|---|---|
| **Chi phí** | Supabase có gói miễn phí (đủ cho quy mô nhỏ). Vượt hạn mức sẽ tính phí |
| **Phụ thuộc** | Website giờ phụ thuộc một dịch vụ bên ngoài — Supabase lỗi thì lấy dữ liệu chậm/không được (nhưng đã có **tự động quay về dữ liệu tĩnh**) |
| **Bảo trì** | Phải theo dõi hạn mức, cập nhật, sao lưu CSDL |
| **Bảo mật** | Phụ thuộc **hoàn toàn** vào việc RLS cấu hình đúng |
| **Sao lưu** | Bật **Database Backups** trong Supabase; và vẫn nên giữ thói quen **Xuất .json** |

---

## 6. Muốn quay lại chạy tĩnh?

Rất dễ, và **không mất gì**:

1. Bảng quản trị → **Nguồn dữ liệu (Backend)** → **bỏ tick**
2. **Xuất bản site (.zip)** → tải lên GitHub

Website lập tức đọc lại thư mục `data/`. Đây chính là giá trị của kiến trúc DataService:
**anh không bị khóa vào bất kỳ nhà cung cấp nào.**

---

## 7. Lời khuyên thẳng thắn

Với quy mô hiện tại của HuyData, **bản tĩnh là lựa chọn đúng**: rẻ, nhanh, an toàn, không bảo trì.

Hãy nâng cấp khi có **nhu cầu thật** — cụ thể là khi đã có **vài cộng tác viên thực sự đang viết bài
đều đặn** và việc gửi file qua lại trở thành phiền toái. Trước thời điểm đó, backend chỉ thêm
chi phí và việc phải trông coi.

Kiến trúc đã sẵn sàng. Nâng cấp lúc nào cũng được — **không cần làm lại website.**
