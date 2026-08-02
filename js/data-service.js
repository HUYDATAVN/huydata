"use strict";
/*
 * HuyData — DataService (Phase 3.1)
 * -----------------------------------------------------------------------------
 * Lớp trừu tượng dữ liệu. Toàn bộ tầng render chỉ nói chuyện với DataService,
 * không đọc JSON/DB trực tiếp. Sau này chỉ cần thêm một "adapter" (Supabase /
 * REST / …) là đổi được nguồn dữ liệu mà không phải sửa giao diện.
 *
 * Nguồn dữ liệu được xếp lớp theo độ ưu tiên (thấp → cao):
 *   1) DEFAULT              — dữ liệu mặc định nhúng trong js/app.js (bảo đảm shape)
 *   2) data/*.json          — nguồn tĩnh chính (StaticJsonAdapter)
 *   3) #site-content        — bản "publish" bake vào HTML (EmbeddedAdapter, override)
 *
 * Nếu KHÔNG tải được data/*.json (mở bằng file://, offline, thiếu file) thì tự
 * fallback về DEFAULT ← #site-content — tức đúng hành vi bản trước Phase 3.1.
 *
 * Phụ thuộc (biến toàn cục do js/app.js cung cấp, dùng lúc gọi hàm — không lúc parse):
 *   DEFAULT, deepMerge(), clone(), readEmbedded(), window.content
 */
var DataService = (function () {
  var source = "embedded"; // "json" | "embedded" — nguồn thực tế đã dùng ở lần load gần nhất

  var STATIC_FILES = {
    config: "data/config.json",
    content: "data/content.json",
    products: "data/products.json",
    posts: "data/posts.json",
    categories: "data/categories.json",
    tags: "data/tags.json",
    entities: "data/entities.json",
    users: "data/users.json",
    media: "data/media.json"
  };

  function loadJson(path) {
    return fetch(path, { cache: "no-cache" }).then(function (res) {
      if (!res.ok) throw new Error(path + " HTTP " + res.status);
      return res.json();
    });
  }

  // Cache theo phiên (Phase 3.7): tránh fetch lại data/*.json ở các lần tải trang
  // trong cùng phiên. Chỉ cache model từ JSON (chưa gộp #site-content — thứ theo trang).
  var CACHE_KEY = "huydata_model_v1";
  function readCache() { try { var s = sessionStorage.getItem(CACHE_KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function writeCache(m) { try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(m)); } catch (e) {} }
  function withOverride(model) { var emb = readEmbedded(); return emb ? deepMerge(model, emb) : model; }

  /* Nguồn TĨNH: DEFAULT <- data/*.json <- #site-content. Trả về Promise<content>. */
  function loadStatic() {
    var model = clone(DEFAULT); // lớp 1: shape + giá trị mặc định
    return Promise.all([
      loadJson(STATIC_FILES.config),
      loadJson(STATIC_FILES.content),
      loadJson(STATIC_FILES.products),
      loadJson(STATIC_FILES.posts),
      loadJson(STATIC_FILES.categories),
      loadJson(STATIC_FILES.tags),
      loadJson(STATIC_FILES.entities),
      loadJson(STATIC_FILES.users),
      loadJson(STATIC_FILES.media)
    ]).then(function (r) {
      // lớp 2: gộp data/*.json về đúng shape của content
      var assembled = Object.assign({}, r[1], {
        settings: r[0], products: r[2], blog: r[3], categories: r[4],
        tags: r[5], entities: r[6], users: r[7], media: r[8]
      });
      model = deepMerge(model, assembled);
      source = "json";
      writeCache(model); // cache bản JSON cho lần tải sau trong phiên
    }).catch(function (e) {
      source = "embedded";
      if (window.console) console.warn("[DataService] Không tải được data/*.json — dùng dữ liệu nhúng.", e && e.message);
    }).then(function () {
      // lớp 3: #site-content (bản publish bake vào HTML) luôn thắng nếu có
      return withOverride(model);
    });
  }
  function clearCache() { try { sessionStorage.removeItem(CACHE_KEY); } catch (e) {} }

  /* Điểm vào duy nhất: Backend (nếu bật) -> cache phiên -> nguồn tĩnh.
     Đổi nguồn dữ liệu KHÔNG cần sửa giao diện — đó là mục đích của DataService. */
  function load() {
    if (window.BackendAdapter && BackendAdapter.enabled()) {
      return BackendAdapter.load().then(function (m) {
        source = "backend";
        return withOverride(deepMerge(clone(DEFAULT), m)); // DEFAULT giữ shape, backend đè lên
      }).catch(function (e) {
        if (window.console) console.warn("[DataService] Backend lỗi — quay về nguồn tĩnh.", e && e.message);
        return loadStatic();
      });
    }
    var cached = readCache();
    if (cached) { source = "cache"; return Promise.resolve(withOverride(clone(cached))); }
    return loadStatic();
  }

  // Đọc model đang hoạt động (do app.js giữ ở biến toàn cục `content`).
  function c() { return window.content || {}; }
  function arr(x) { return Array.isArray(x) ? x : []; }
  // Workflow: status ưu tiên; tương thích ngược với cờ published cũ.
  function isPublished(p) { return p && (p.status ? p.status === "published" : !!p.published); }

  var ROLES = ["super-admin", "admin", "editor", "author", "contributor"];
  var STATUSES = ["draft", "pending", "published", "archived"];

  return {
    load: load,
    clearCache: clearCache,
    get source() { return source; },

    // --- Getter theo section (tầng render dùng) ---
    getContent:   function () { return c(); },
    getConfig:    function () { return c().settings; },
    getSettings:  function () { return c().settings; },
    getSections:  function () { return arr(c().settings && c().settings.sections); },
    getHero:      function () { return c().hero; },
    getPain:      function () { return c().pain; },
    getWhy:       function () { return c().why; },
    getSolutions: function () { return c().solutions; },
    getDecision:  function () { return c().decision; },
    getWho:       function () { return c().who; },
    getPrivacy:   function () { return c().privacy; },
    getAbout:     function () { return c().about; },
    getContact:   function () { return c().contact; },
    getPricing:   function () { return c().pricing; },
    getFaq:       function () { return c().faq; },
    getBlog:      function () { return c().blog; },

    // --- Getter theo bộ sưu tập (API theo spec) ---
    getPosts:     function () { var b = c().blog; return arr(b && b.posts); },
    getPublishedPosts: function () { return arr(c().blog && c().blog.posts).filter(isPublished); },
    getPostsByStatus: function (status) { return arr(c().blog && c().blog.posts).filter(function (p) { return (p.status || (p.published ? "published" : "draft")) === status; }); },
    isPublished: isPublished,
    ROLES: ROLES, STATUSES: STATUSES,
    getProducts:  function () { var p = c().products; return arr(p && p.items); },
    getServices:  function () { return []; },   // (kích hoạt ở Phase sau)
    getUsers:     function () { return arr(c().users); }, // (kích hoạt ở Phase 3.6+)

    // --- Taxonomy (Phase 3.3) ---
    getCategories: function () {
      return arr(c().categories).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    },
    getCategory: function (slug) {
      return arr(c().categories).find(function (x) { return x.slug === slug; }) || null;
    },
    getTags: function () { return arr(c().tags); },
    getTag: function (slug) {
      return arr(c().tags).find(function (x) { return x.slug === slug; }) || null;
    },
    getPostsByCategory: function (slug) {
      return this.getPublishedPosts().filter(function (p) { return p.category === slug; });
    },
    getPostsByTag: function (slug) {
      return this.getPublishedPosts().filter(function (p) { return arr(p.tags).indexOf(slug) >= 0; });
    },
    getFeaturedPosts: function () {
      return this.getPublishedPosts().filter(function (p) { return !!p.featured; });
    },
    getAuthors: function () { var s = c().settings; return (s && s.authors) || {}; },
    getAuthor: function (id) {
      var a = this.getAuthors()[id];
      return a || (id ? { name: id, role: "" } : null);
    },

    // --- Entity & Topic Cluster (Phase 3.5) ---
    getEntities: function () { return arr(c().entities); },
    getEntity: function (slug) { return arr(c().entities).find(function (x) { return x.slug === slug; }) || null; },
    // Thực thể của một bài (giải slug -> object), bỏ slug không tồn tại.
    getPostEntities: function (post) {
      var self = this;
      return arr(post && post.ai && post.ai.entities).map(function (s) { return self.getEntity(s); }).filter(Boolean);
    },
    // Thực thể liên quan (từ trường related), bỏ slug không tồn tại.
    getRelatedEntities: function (entity) {
      var self = this;
      return arr(entity && entity.related).map(function (s) { return self.getEntity(s); }).filter(Boolean);
    },
    // Bài trụ (pillar) của một chuyên mục; nếu không đánh dấu thì lấy bài nền tảng đầu tiên.
    getPillar: function (catSlug) {
      var posts = this.getPostsByCategory(catSlug);
      return posts.find(function (p) { return p.pillar; }) || posts[0] || null;
    },
    // Các bài trong chuyên mục (không tính bài trụ).
    getClusterPosts: function (catSlug) {
      var pillar = this.getPillar(catSlug);
      return this.getPostsByCategory(catSlug).filter(function (p) { return !pillar || p.slug !== pillar.slug; });
    },
    // Chuỗi học tập: bài trong chuyên mục xếp theo cấp độ (nền tảng -> nâng cao) rồi theo ngày.
    getLearningChain: function (catSlug) {
      var order = { foundation: 0, intermediate: 1, advanced: 2 };
      return this.getPostsByCategory(catSlug).slice().sort(function (a, b) {
        var la = order[a.level] == null ? 1 : order[a.level], lb = order[b.level] == null ? 1 : order[b.level];
        if (la !== lb) return la - lb;
        return String(a.date || "").localeCompare(String(b.date || ""));
      });
    },

    // --- CMS mở rộng (Phase 3.6) ---
    getMedia: function () { return arr(c().media); },
    stats: function () {
      var self = this;
      var posts = arr(c().blog && c().blog.posts);
      var byStatus = {}; STATUSES.forEach(function (s) { byStatus[s] = 0; });
      posts.forEach(function (p) { var s = p.status || (p.published ? "published" : "draft"); byStatus[s] = (byStatus[s] || 0) + 1; });
      var byCat = self.getCategories().map(function (cat) { return { slug: cat.slug, name: cat.name, count: self.getPostsByCategory(cat.slug).length }; });
      byCat.sort(function (a, b) { return b.count - a.count; });
      return {
        posts: posts.length, published: self.getPublishedPosts().length, byStatus: byStatus,
        featured: self.getFeaturedPosts().length,
        products: self.getProducts().length,
        categories: self.getCategories().length, tags: self.getTags().length, entities: self.getEntities().length,
        users: self.getUsers().length, media: self.getMedia().length,
        topCategories: byCat.slice(0, 5)
      };
    }
  };
})();
