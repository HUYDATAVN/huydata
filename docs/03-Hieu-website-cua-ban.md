# 3. Hiểu website của mình

> Không cần biết lập trình. Tài liệu này giải thích **anh đang sở hữu cái gì** và **nó chạy ra sao**,
> đủ để anh tự tin trao đổi với bất kỳ ai sau này.

---

## 1. Website này thuộc loại nào?

Đây là **website tĩnh** (static website).

**So sánh dễ hiểu:**

| | Website tĩnh (của anh) | Website động (WordPress…) |
|---|---|---|
| Cần máy chủ + cơ sở dữ liệu | Không | Có |
| Chi phí hằng tháng | ~0đ (GitHub Pages miễn phí) | Hosting + có thể phí plugin |
| Tốc độ | Rất nhanh | Tùy máy chủ |
| Nguy cơ bị hack | Rất thấp (không có máy chủ để tấn công) | Cao hơn (phải vá lỗi thường xuyên) |
| Cập nhật nội dung | Sửa → **Xuất bản** → tải lên | Sửa là xong |

Đổi lại sự an toàn và rẻ, anh có thêm **một bước "Xuất bản"** mỗi lần cập nhật.

---

## 2. Ba lớp của website

Hãy hình dung như một cửa hàng:

```
   NỘI DUNG  (data/)          →  Hàng hóa: bài viết, sản phẩm, thông tin liên hệ
        ↓
   BỘ NÃO    (js/)            →  Nhân viên: lấy hàng ra, sắp lên kệ đúng chỗ
        ↓
   GIAO DIỆN (css/ + index)   →  Cách trưng bày: màu sắc, chữ, bố cục
```

Điểm hay: **ba lớp tách rời nhau.** Đổi nội dung không đụng giao diện. Đổi nơi chứa nội dung
(từ file sang cơ sở dữ liệu) cũng **không phải làm lại giao diện**.

---

## 3. Từng thư mục làm gì

### `data/` — **quan trọng nhất với anh**
Nội dung của anh nằm ở đây, dưới dạng file `.json` (file chữ, mở bằng Notepad cũng đọc được).

| File | Chứa gì |
|---|---|
| `config.json` | Tên thương hiệu, Zalo, điện thoại, email, mã PIN (đã băm), bố cục trang |
| `content.json` | Nội dung các mục trang chủ (Hero, Giải pháp, Bảng giá, Hỏi đáp…) |
| `posts.json` | **Toàn bộ bài viết** |
| `products.json` | Danh sách sản phẩm/phần mềm |
| `categories.json`, `tags.json` | 7 chuyên mục và các thẻ tag |
| `entities.json` | Các "thực thể" (khái niệm, sản phẩm) để AI hiểu mối liên hệ |
| `users.json`, `media.json` | Người dùng & danh mục tài sản |

> **Sao lưu `data/` = sao lưu toàn bộ công sức viết lách của anh.**

### `js/` — bộ não (8 tập tin, mỗi tập một việc)

| File | Nhiệm vụ |
|---|---|
| `data-service.js` | **Cửa duy nhất** lấy dữ liệu. Mọi phần khác đều hỏi qua đây |
| `backend-adapter.js` | Cầu nối sang cơ sở dữ liệu Supabase (khi cần) |
| `router.js` | Quyết định hiện trang nào theo đường dẫn |
| `render.js` *(nằm trong app.js)* | Vẽ nội dung ra màn hình |
| `blog.js` | Tính thời gian đọc, sinh mục lục, tìm bài liên quan |
| `search.js` | Lọc và tìm kiếm bài |
| `seo.js` | Tạo thẻ mô tả cho Google/Facebook/Zalo, sinh sitemap, RSS, trang tĩnh |
| `dashboard.js` | Bảng thống kê trong trang quản trị |
| `zip.js` | Đóng gói file `.zip` khi xuất bản |
| `app.js` | Điều phối chung + toàn bộ trang quản trị |

**Vì sao chia nhỏ?** Để sau này sửa một việc không làm hỏng việc khác — và người khác tiếp quản
cũng hiểu nhanh.

### `css/main.css` — giao diện
Toàn bộ màu sắc, phông chữ, bố cục, hiệu ứng. Bảng màu xanh lá – teal và hai phông chữ
(Cormorant Garamond cho tiêu đề, Be Vietnam Pro cho nội dung) được định nghĩa ở đây.

### `index.html` và `404.html`
- `index.html`: cái khung. Khi mở, nó gọi bộ não trong `js/` để đổ nội dung từ `data/` vào.
- `404.html`: trang dự phòng, giúp link vào thẳng một bài viết vẫn mở đúng.

---

## 4. Điều quan trọng nhất: **DataService**

Đây là thiết kế cốt lõi khiến website "sống" được 5–10 năm.

Mọi phần của website **không bao giờ đọc file dữ liệu trực tiếp**. Chúng đều hỏi qua `DataService`:

> *"Cho tôi danh sách bài viết"* → `DataService.getPosts()`

`DataService` mới là chỗ biết dữ liệu nằm ở đâu. Hiện tại nó lấy từ thư mục `data/`.
Ngày mai nếu chuyển sang cơ sở dữ liệu Supabase, **chỉ mình nó đổi** — giao diện, bài viết,
cách hiển thị **giữ nguyên 100%**.

*(Điều này đã được kiểm chứng: khi thử chuyển sang Supabase, trang hiển thị y hệt, không lệch một chữ.)*

**Ý nghĩa với anh:** anh không bị khóa vào một công nghệ. Muốn lớn lên thì nâng cấp phần ruột,
không phải đập đi xây lại.

---

## 5. Đường dẫn bài viết

Mỗi bài có địa chỉ riêng, dạng: `/{chuyên-mục}/{tên-bài}/`

Ví dụ: `https://tenban.github.io/huydata/data-foundation/du-lieu-sach-la-gi/`

Đường dẫn "sạch" như vậy quan trọng vì:
- Người đọc nhìn là hiểu bài nói gì
- Google xếp hạng tốt hơn URL khó hiểu
- Chia sẻ lên Zalo/Facebook hiện đúng tiêu đề, mô tả

Khi **Xuất bản**, hệ thống tạo hẳn **một trang HTML thật cho mỗi bài** — nhờ vậy Google và AI
đọc được nội dung mà **không cần chạy mã**, và link vào thẳng bài luôn hoạt động.

---

## 6. Cơ chế tự ẩn/hiện

Website tự biết **giấu mục trống**: nếu chưa có bài viết nào, mục "Thư viện Tri thức" tự ẩn;
chưa có bảng giá thì mục bảng giá tự ẩn. Anh không bao giờ để lộ một mục trống trơn cho khách.

Anh cũng có thể chủ động bật/tắt và đổi thứ tự các mục ở tab **Bố cục trang**.

---

## 7. Nội dung được lấy ra sao (thứ tự ưu tiên)

1. **Backend Supabase** — nếu anh bật (mặc định: tắt)
2. **Thư mục `data/`** — nguồn chính hiện nay
3. **Dữ liệu nhúng sẵn trong `js/app.js`** — phao cứu sinh

Nhờ lớp 3, kể cả khi mở file bằng cách nhấp đúp (không qua web server) hoặc mất mạng,
website **vẫn hiện đủ nội dung**, không bao giờ trắng trang.

---

## 8. Những gì website này **không** làm (và vì sao)

| Không có | Lý do |
|---|---|
| Không đếm lượt xem | Cố ý **không theo dõi người đọc** — đúng cam kết riêng tư của HuyData |
| Không có form đăng ký/thanh toán | Website tĩnh không xử lý được; khách liên hệ qua Zalo/điện thoại |
| Không đăng nhập nhiều người | Cần backend — xem [tài liệu 6](06-Nang-cap-Backend-Supabase.md) |
| Không tự động sao lưu lên mây | Anh chủ động bấm **Xuất .json** định kỳ |

Muốn có lượt xem: gắn công cụ phân tích (analytics) — nhưng cân nhắc, vì nó đi ngược
cam kết "không theo dõi" đang là điểm mạnh thương hiệu của anh.
