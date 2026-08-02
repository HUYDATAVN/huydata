-- =============================================================================
-- HuyData Platform V2.0 — Lược đồ Supabase (Phase 3.8)
-- Cách dùng: Supabase > SQL Editor > dán toàn bộ file này > Run.
-- Sau đó vào admin của website: SEO & Xuất bản > Nguồn dữ liệu (Backend),
-- bật Supabase và dán URL + anon key.
-- =============================================================================

-- 1) Bảng khóa–giá trị: cấu hình chung và các khối nội dung trang chủ
create table if not exists public.site_data (
  key        text primary key,              -- 'config' | 'content' | 'products' | 'blog'
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2) Bài viết (Thư viện Tri thức)
create table if not exists public.posts (
  id         text primary key,
  slug       text unique not null,
  title      text not null default '',
  excerpt    text default '',
  body       text default '',
  category   text default '',
  tags       jsonb default '[]'::jsonb,
  author     text default '',
  date       date,
  updated_at date,
  cover      text default '',
  status     text not null default 'draft'
             check (status in ('draft','pending','published','archived')),
  featured   boolean not null default false,
  pillar     boolean not null default false,
  level      text default '',
  ai         jsonb default '{}'::jsonb,     -- {summary, keywords, entities, difficulty}
  faqs       jsonb default '[]'::jsonb,
  history    jsonb default '[]'::jsonb,     -- lịch sử phiên bản
  version    integer not null default 0,
  hash       text default '',
  created_at timestamptz not null default now()
);
create index if not exists posts_status_date_idx on public.posts (status, date desc);
create index if not exists posts_category_idx    on public.posts (category);

-- 3) Taxonomy, người dùng, media
create table if not exists public.categories (
  slug text primary key, name text not null, "desc" text default '', "order" integer default 0
);
create table if not exists public.tags (
  slug text primary key, name text not null
);
create table if not exists public.entities (
  slug text primary key, name text not null, type text default '',
  "desc" text default '', related jsonb default '[]'::jsonb
);
create table if not exists public.users (
  id    text primary key,
  name  text not null default '',
  email text default '',
  role  text not null default 'contributor'
        check (role in ('super-admin','admin','editor','author','contributor'))
);
create table if not exists public.media (
  id text primary key, name text default '', type text default 'image',
  url text default '', "desc" text default ''
);

-- =============================================================================
-- 4) BẢO MẬT — BẮT BUỘC: bật Row Level Security trên MỌI bảng.
--    Không bật RLS = bất kỳ ai có anon key (ai cũng xem được vì nó nằm trong
--    trình duyệt) đều sửa/xóa được dữ liệu của anh.
-- =============================================================================
alter table public.site_data  enable row level security;
alter table public.posts      enable row level security;
alter table public.categories enable row level security;
alter table public.tags       enable row level security;
alter table public.entities   enable row level security;
alter table public.users      enable row level security;
alter table public.media      enable row level security;

-- 5) Chính sách ĐỌC công khai (website là trang công khai).
--    Riêng posts: khách chỉ đọc được bài đã xuất bản (nháp/chờ duyệt bị ẩn).
create policy "public read site_data"  on public.site_data  for select using (true);
create policy "public read posts"      on public.posts      for select using (status = 'published');
create policy "public read categories" on public.categories for select using (true);
create policy "public read tags"       on public.tags       for select using (true);
create policy "public read entities"   on public.entities   for select using (true);
create policy "public read media"      on public.media      for select using (true);

-- Bảng users KHÔNG cho khách đọc (chứa email). Khách sẽ nhận mảng rỗng — đúng ý đồ.
create policy "auth read users" on public.users
  for select using (auth.role() = 'authenticated');

-- 6) Chính sách GHI: chỉ tài khoản đã ĐĂNG NHẬP mới được thêm/sửa/xóa.
create policy "auth write site_data"  on public.site_data  for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write posts"      on public.posts      for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write categories" on public.categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write tags"       on public.tags       for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write entities"   on public.entities   for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write users"      on public.users      for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write media"      on public.media      for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =============================================================================
-- 7) Ghi chú
--  * anon key là khóa CÔNG KHAI cho trình duyệt — không phải bí mật.
--    TUYỆT ĐỐI không dùng service_role key ở phía website.
--  * Nhớ thêm địa chỉ Supabase vào thẻ CSP trong index.html:
--      connect-src 'self' https://<project>.supabase.co;
--  * Muốn nâng cấp phân quyền theo vai trò (Editor chỉ sửa bài của mình…),
--    thay điều kiện auth.role() bằng truy vấn tới bảng users theo auth.uid().
-- =============================================================================
