"use strict";
/*
 * HuyData — BackendAdapter (Phase 3.8)
 * -----------------------------------------------------------------------------
 * Adapter đọc/ghi dữ liệu từ Supabase qua REST (PostgREST) — KHÔNG cần SDK ngoài,
 * nên vẫn hợp Content-Security-Policy của site.
 *
 * Nhờ DataService, bật adapter này KHÔNG phải sửa giao diện: chỉ cần điền
 * settings.backend = { enabled:true, provider:"supabase", url:"https://xxx.supabase.co", anonKey:"..." }
 *
 * LƯU Ý BẢO MẬT:
 *  - anonKey là khóa công khai dành cho trình duyệt. BẮT BUỘC bật RLS (Row Level Security)
 *    trên mọi bảng: cho phép ĐỌC công khai, chỉ cho GHI khi đã đăng nhập.
 *  - Phải thêm origin Supabase vào CSP `connect-src` trong index.html.
 *  - Xem docs/supabase-schema.sql để tạo bảng + chính sách.
 */
var BackendAdapter = (function () {
  function arr(x) { return Array.isArray(x) ? x : []; }
  function cfg() {
    var s = (window.content && window.content.settings) || {};
    return s.backend || {};
  }
  function enabled() { var c = cfg(); return !!(c.enabled && c.url); }
  function base() { return String(cfg().url || "").replace(/\/+$/, "") + "/rest/v1/"; }
  function headers(extra) {
    var c = cfg(), h = { "apikey": c.anonKey || "", "Accept": "application/json" };
    if (c.anonKey) h["Authorization"] = "Bearer " + c.anonKey;
    if (extra) for (var k in extra) h[k] = extra[k];
    return h;
  }
  function q(table, params) {
    return fetch(base() + table + (params ? "?" + params : ""), { headers: headers(), cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(table + " HTTP " + r.status); return r.json(); });
  }

  /* --- ánh xạ hàng DB -> đối tượng của model --- */
  function mapPost(r) {
    return {
      id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt || "", body: r.body || "",
      category: r.category || "", tags: arr(r.tags), author: r.author || "",
      date: r.date || "", updatedAt: r.updated_at || "", cover: r.cover || "",
      status: r.status || "draft", published: (r.status || "draft") === "published",
      featured: !!r.featured, pillar: !!r.pillar, level: r.level || "",
      ai: r.ai || {}, faqs: arr(r.faqs), history: arr(r.history),
      version: r.version || 0, hash: r.hash || ""
    };
  }
  function unmapPost(p) {
    return {
      id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt || "", body: p.body || "",
      category: p.category || "", tags: arr(p.tags), author: p.author || "",
      date: p.date || null, updated_at: p.updatedAt || null, cover: p.cover || "",
      status: p.status || (p.published ? "published" : "draft"),
      featured: !!p.featured, pillar: !!p.pillar, level: p.level || "",
      ai: p.ai || {}, faqs: arr(p.faqs), history: arr(p.history),
      version: p.version || 0, hash: p.hash || ""
    };
  }

  /* --- Đọc toàn bộ model --- */
  function load() {
    return Promise.all([
      q("site_data", "select=key,data"),
      q("posts", "select=*&order=date.desc"),
      q("categories", "select=*"),
      q("tags", "select=*"),
      q("entities", "select=*"),
      q("users", "select=*"),
      q("media", "select=*")
    ]).then(function (r) {
      var kv = {};
      arr(r[0]).forEach(function (row) { kv[row.key] = row.data; });
      var sections = kv.content || {};
      var blogMeta = kv.blog || {};
      var model = Object.assign({}, sections, {
        settings: kv.config || {},
        products: kv.products || {},
        blog: Object.assign({ enabled: true, eyebrow: "", title: "", intro: "" }, blogMeta, { posts: arr(r[1]).map(mapPost) }),
        categories: arr(r[2]).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); }),
        tags: arr(r[3]),
        entities: arr(r[4]),
        users: arr(r[5]),
        media: arr(r[6])
      });
      return model;
    });
  }

  /* --- Ghi (cần đã đăng nhập + RLS cho phép; anonKey đơn thuần sẽ bị RLS chặn) --- */
  function upsertPost(post) {
    return fetch(base() + "posts?on_conflict=slug", {
      method: "POST",
      headers: headers({ "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=representation" }),
      body: JSON.stringify([unmapPost(post)])
    }).then(function (r) { if (!r.ok) throw new Error("upsertPost HTTP " + r.status); return r.json(); });
  }
  function deletePost(slug) {
    return fetch(base() + "posts?slug=eq." + encodeURIComponent(slug), { method: "DELETE", headers: headers() })
      .then(function (r) { if (!r.ok) throw new Error("deletePost HTTP " + r.status); return true; });
  }
  function saveSiteData(key, data) {
    return fetch(base() + "site_data?on_conflict=key", {
      method: "POST",
      headers: headers({ "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates" }),
      body: JSON.stringify([{ key: key, data: data }])
    }).then(function (r) { if (!r.ok) throw new Error("saveSiteData HTTP " + r.status); return true; });
  }

  return {
    enabled: enabled, load: load,
    upsertPost: upsertPost, deletePost: deletePost, saveSiteData: saveSiteData,
    mapPost: mapPost, unmapPost: unmapPost
  };
})();
