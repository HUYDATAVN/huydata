# 1. Đưa website lên mạng bằng GitHub Pages

> Mục tiêu: sau tài liệu này, anh có một địa chỉ web thật (ví dụ `https://tenban.github.io/huydata/`)
> và biết cách cập nhật mỗi khi sửa nội dung.

**GitHub Pages là gì?** Là dịch vụ **đăng website tĩnh miễn phí** của GitHub. Anh tải các file
website lên, GitHub cho nó một địa chỉ và phục vụ cho người xem. Không cần thuê máy chủ.

---

## Phần A — Lần đầu (làm một lần duy nhất)

### Bước 1. Tạo tài khoản GitHub
Vào <https://github.com> → **Sign up** → làm theo hướng dẫn. Nhớ kỹ **tên đăng nhập (username)**,
nó sẽ nằm trong địa chỉ web của anh.

### Bước 2. Tạo kho chứa (repository)
1. Bấm dấu **+** góc trên bên phải → **New repository**
2. **Repository name**: đặt là `huydata` (chữ thường, không dấu, không khoảng trắng)
3. Chọn **Public** *(xem lưu ý ở cuối)*
4. **KHÔNG** tick "Add a README file"
5. Bấm **Create repository**

### Bước 3. Chuẩn bị file website
Trong bảng quản trị website: tab **SEO & Xuất bản** → nút **Xuất bản site (.zip)**.
Anh sẽ tải về `HuyData_site.zip`. **Giải nén** ra một thư mục.

> Trước khi xuất bản lần đầu, hãy điền ô **Địa chỉ website (siteBase)** trong cùng tab đó,
> ví dụ `https://tenban.github.io/huydata/`. Ô này dùng cho sitemap và đường dẫn chuẩn (canonical).
> Điền sai thì Google sẽ nhận nhầm địa chỉ.

### Bước 4. Tải file lên GitHub
1. Ở trang kho vừa tạo, bấm **uploading an existing file**
2. **Kéo thả toàn bộ nội dung bên trong thư mục vừa giải nén** vào (kéo *các file và thư mục con*,
   không kéo thư mục mẹ)
3. Kéo xong, kéo xuống dưới bấm **Commit changes**

Kiểm tra: trong kho phải nhìn thấy `index.html`, `404.html`, `css/`, `js/`, `data/`.

> ⚠️ File `.nojekyll` bắt đầu bằng dấu chấm nên **có thể bị ẩn** khi kéo thả.
> Nếu không thấy nó trong kho: bấm **Add file → Create new file**, đặt tên đúng `.nojekyll`,
> để trống nội dung, bấm **Commit**. Thiếu file này website có thể vỡ giao diện.

### Bước 5. Bật GitHub Pages
1. Trong kho, vào tab **Settings** (bánh răng)
2. Cột trái, chọn **Pages**
3. Mục **Source**: chọn **Deploy from a branch**
4. **Branch**: chọn `main`, thư mục `/ (root)` → bấm **Save**
5. Chờ 1–3 phút, tải lại trang. GitHub sẽ hiện dòng:
   *"Your site is live at https://tenban.github.io/huydata/"*

**Xong.** Mở địa chỉ đó để xem website của anh.

---

## Phần B — Mỗi lần cập nhật nội dung

1. Sửa nội dung trong bảng quản trị (nút bút chì) → xem [tài liệu 2](02-Quan-tri-noi-dung.md)
2. Tab **SEO & Xuất bản** → **Xuất bản site (.zip)** → giải nén
3. Lên GitHub, vào kho → **Add file → Upload files** → kéo thả lại toàn bộ nội dung
4. **Commit changes** → chờ 1–2 phút → tải lại website

> **Vì sao phải tải lại toàn bộ?** Vì khi xuất bản, hệ thống sinh lại cả `data/` lẫn các
> **trang tĩnh cho từng bài viết** (`/chuyen-muc/ten-bai/index.html`) và `sitemap.xml`.
> Tải đủ mới đồng bộ.

**Mẹo:** nếu chỉ sửa một bài, anh vẫn nên tải lại đủ — GitHub tự bỏ qua file không đổi.

---

## Phần C — Dùng tên miền riêng (ví dụ `huydata.vn`)

1. Mua tên miền ở nhà cung cấp bất kỳ
2. Trong phần quản lý DNS của tên miền, thêm:
   - 4 bản ghi **A** trỏ về: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Hoặc 1 bản ghi **CNAME** cho `www` trỏ về `tenban.github.io`
3. Về GitHub → **Settings → Pages → Custom domain** → nhập `huydata.vn` → **Save**
4. Tick **Enforce HTTPS** (chờ vài phút để GitHub cấp chứng chỉ)
5. **Quan trọng:** vào bảng quản trị → **SEO & Xuất bản** → sửa **siteBase** thành `https://huydata.vn/`
   → **Xuất bản site (.zip)** lại → tải lên. Nếu quên bước này, sitemap vẫn ghi địa chỉ cũ.

---

## Khi có trục trặc

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Trang trắng, mất giao diện | Thiếu `.nojekyll`, hoặc kéo nhầm cả thư mục mẹ | Tạo lại `.nojekyll`; kiểm tra `index.html` phải nằm ở gốc kho |
| Vào link bài viết báo 404 | Chưa xuất bản lại sau khi thêm bài | Xuất bản site (.zip) và tải lên lại |
| Sửa xong mà web không đổi | Trình duyệt nhớ bản cũ | Bấm `Ctrl + F5`; hoặc chờ 2–3 phút |
| Google chưa thấy web | Mới đăng, chưa được thu thập | Gửi `sitemap.xml` trong Google Search Console; chờ vài ngày |
| Sitemap ghi sai địa chỉ | Chưa điền/điền sai **siteBase** | Sửa siteBase → xuất bản lại |

---

## Lưu ý về Public / Private

- **Public**: ai cũng xem được **mã nguồn** trong kho (nhưng nội dung website vốn đã công khai).
  GitHub Pages miễn phí. **Khuyến nghị dùng Public.**
- **Private**: giấu mã nguồn, nhưng Pages cho kho private **yêu cầu gói trả phí**.

Dù chọn gì, hãy nhớ: **đừng bao giờ đặt mật khẩu, khóa bí mật hay dữ liệu khách hàng vào kho này.**
Đọc kỹ [tài liệu 4 — Bảo mật](04-Bao-mat-va-luu-y.md).
