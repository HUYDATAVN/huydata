# 4. Bảo mật & những điều cần lưu ý

> **Đọc kỹ tài liệu này.** Nó giúp anh tránh hai rủi ro lớn nhất: **mất dữ liệu** và **lộ thông tin**.

---

## ⚠️ PHẦN 1 — Điều quan trọng nhất phải hiểu đúng

### Mã PIN **không phải** bảo mật cấp máy chủ

Mã PIN mở bảng quản trị chỉ là **lớp che chắn phía trình duyệt**. Nó ngăn khách vãng lai
tò mò bấm vào, **nhưng người có hiểu biết kỹ thuật vẫn có thể mở được bảng quản trị**.

**Vì sao?** Website là file tĩnh; mọi thứ chạy trong máy người xem. Bản băm (hash) của PIN
nằm trong file của website. Không có máy chủ nào đứng ra kiểm tra.

### Nhưng điều đó **không nguy hiểm** — vì:

> **Người lạ mở được bảng quản trị cũng KHÔNG sửa được website của anh.**

Họ chỉ sửa được bản hiển thị trong máy họ. Muốn thay đổi website thật, phải **đăng file lên
GitHub** — mà việc đó cần **tài khoản GitHub của anh**.

### 🔑 Bảo vệ thật nằm ở **tài khoản GitHub**

Đây mới là thứ cần giữ:

- Đặt **mật khẩu GitHub mạnh**, không dùng lại từ nơi khác
- **Bật xác thực 2 bước (2FA)** trong GitHub → Settings → Password and authentication
- Không chia sẻ tài khoản GitHub cho ai

**Tóm lại:** PIN = khóa cửa phòng. Tài khoản GitHub = khóa két sắt. Hãy giữ két sắt.

---

## PHẦN 2 — Tuyệt đối KHÔNG đưa vào website

Mọi thứ trong thư mục này, khi đăng lên, **ai cũng có thể xem được** (kể cả file `data/`).
Vì vậy **không bao giờ** đặt vào đây:

| ❌ Không đưa vào | Vì sao |
|---|---|
| Mật khẩu, khóa API bí mật, `service_role key` của Supabase | Lộ là mất quyền kiểm soát dữ liệu |
| Thông tin khách hàng: danh sách, số điện thoại, email cá nhân | Vi phạm riêng tư, có thể vi phạm pháp luật |
| **Số liệu điều tra – thống kê công vụ** | Chính là "lằn ranh đạo đức" HuyData đã cam kết công khai |
| Số tài khoản ngân hàng, ảnh CCCD, hợp đồng | Rủi ro lừa đảo, giả mạo |
| File kế toán thật của khách | Đây là dữ liệu của người khác |

> **Quy tắc đơn giản:** trước khi đưa gì vào, hãy tự hỏi
> *"Nếu cái này in lên báo, tôi có sao không?"* — Nếu có, đừng đưa vào.

---

## PHẦN 3 — Chống mất dữ liệu

### Rủi ro lớn nhất: sửa xong mà quên xuất bản

Thay đổi trong bảng quản trị **chỉ nằm trong trình duyệt**. Đóng trình duyệt là có thể mất.

**Thói quen an toàn:**
1. Sửa xong → bấm **Xuất .json** ngay (mất 3 giây)
2. Rồi mới **Xuất bản site (.zip)** và tải lên GitHub

### Lịch sao lưu khuyến nghị

| Khi nào | Làm gì | Lưu ở đâu |
|---|---|---|
| Sau mỗi buổi làm việc | **Xuất .json** | Thư mục trên máy |
| Mỗi tháng | **Backup Markdown (.zip)** | Google Drive / ổ cứng ngoài |
| Trước khi thay đổi lớn | **Xuất bản site (.zip)** | Lưu lại như một mốc |

### Ba lớp an toàn đã có sẵn

1. **Lịch sử phiên bản** — mỗi bài giữ 20 bản gần nhất, khôi phục được
2. **Bản nháp tự động** — lưu tạm trong trình duyệt (nút *Khôi phục nháp*)
3. **GitHub giữ lịch sử** — mọi lần tải lên đều được lưu, có thể xem lại bản cũ

> Đừng phụ thuộc riêng lớp 2 — nó nằm trong trình duyệt và có thể mất khi xóa bộ nhớ đệm.

### Giữ bản gốc
File `HuyData_Website_6.html` là **bản website nguyên gốc trước khi nâng cấp**.
**Đừng xóa.** Đó là phao cuối cùng nếu mọi thứ khác hỏng.

---

## PHẦN 4 — Đổi mã PIN

Bảng quản trị → tab **Đổi mã PIN** → nhập PIN mới 2 lần → **Cập nhật PIN**
→ sau đó **Xuất bản site (.zip)** và tải lên (nếu không, PIN mới chỉ có trên máy anh).

**Quên PIN?** Không khôi phục được từ website. Cách xử lý: mở file `data/config.json`,
tìm dòng `"pinHash"`, thay giá trị bằng bản băm SHA-256 của PIN mới (nhờ người biết kỹ thuật
tạo giúp, hoặc dùng công cụ tạo SHA-256 trực tuyến), rồi tải file lên lại.

**Nguyên tắc:** dùng PIN **riêng cho website này**. Đừng dùng lại PIN thẻ ngân hàng hay điện thoại.

---

## PHẦN 5 — Bảo vệ nội dung khỏi sao chép

Website đã có sẵn:
- Khi ai đó copy đoạn văn trong bài → clipboard **tự thêm dòng nguồn** (tên bài, thương hiệu, địa chỉ)
- Ảnh trong bài **không kéo–thả được**, chuột phải bị chặn
- Ảnh bìa có **watermark** thương hiệu ở góc

**Nói thật với anh:** đây là biện pháp **gây khó, không phải chống tuyệt đối**.
Người quyết tâm vẫn sao chép được (mọi website đều vậy — nội dung phải hiển thị mới đọc được).
Muốn watermark "chết" vào file ảnh thì phải xử lý ảnh trước khi đăng.

Các biện pháp này **không ảnh hưởng SEO** — Google vẫn đọc bình thường.

---

## PHẦN 6 — Nếu bật Backend Supabase

Chỉ áp dụng khi anh bật tính năng ở [tài liệu 6](06-Nang-cap-Backend-Supabase.md).

### Bắt buộc: BẬT RLS (Row Level Security)

**anon key** dán vào website là **khóa công khai** — ai xem mã nguồn cũng thấy. Đó là thiết kế bình thường.
An toàn **hoàn toàn phụ thuộc vào RLS** ở phía Supabase:

- ✅ Cho **đọc** công khai (website là trang công khai)
- ✅ Chỉ cho **ghi** khi đã đăng nhập
- ❌ **Không bật RLS = bất kỳ ai cũng xóa sạch dữ liệu của anh**

File `docs/supabase-schema.sql` đã viết sẵn đầy đủ chính sách này — chạy nguyên file, đừng bỏ bớt.

### Tuyệt đối không dùng `service_role key`
Khóa đó có **toàn quyền**, chỉ dùng ở máy chủ. Dán vào website = trao chìa khóa cho cả thiên hạ.

---

## PHẦN 7 — Riêng tư với người đọc

Website **cố ý không** dùng cookie, không theo dõi, không quảng cáo. Đây là **điểm mạnh thương hiệu**
của HuyData và đã ghi thành cam kết trên trang.

Trước khi gắn thêm bất cứ công cụ nào (Google Analytics, Facebook Pixel, chat widget…), hãy cân nhắc:
nó **mâu thuẫn với lời hứa anh đã đăng công khai**. Nếu vẫn gắn, hãy sửa lại phần cam kết cho trung thực.

---

## ✅ Bảng kiểm nhanh

- [ ] Tài khoản GitHub đã bật **2FA**
- [ ] PIN quản trị **riêng biệt**, không trùng PIN quan trọng khác
- [ ] Trong `data/` **không có** thông tin khách hàng hay số liệu công vụ
- [ ] Đã **Xuất .json** gần đây và lưu nơi an toàn
- [ ] File `HuyData_Website_6.html` vẫn còn
- [ ] Nếu dùng Supabase: **RLS đã bật**, và **không** có service_role key trong website
- [ ] **siteBase** khớp địa chỉ web thật (nếu không, sitemap sai)
