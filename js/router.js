"use strict";
/*
 * HuyData — Router (Phase 3.2)
 * -----------------------------------------------------------------------------
 * URL sạch cho bài viết: /{category}/{slug}/  (thay cho #/bai/{slug}).
 * - Điều hướng trong app dùng History API (pushState) — không tải lại trang.
 * - GIỮ hash cũ (#/bai/{slug}, #quan-tri, #section) làm fallback: link đã chia sẻ
 *   vẫn chạy, và mỗi lần mở bài sẽ tự "nâng cấp" URL lên dạng sạch (canonical).
 * - Base path TỰ PHÁT HIỆN từ vị trí router.js → chạy đúng cả localhost lẫn
 *   GitHub Pages project site (https://user.github.io/<repo>/).
 * - Deep-link tải trực tiếp /{category}/{slug}/ được xử lý bởi 404.html (chuyển
 *   path thành query) + đoạn giải mã trong <head> index.html.
 *
 * Bài viết được PHÂN GIẢI theo slug (đoạn cuối path); đoạn category chỉ mang tính
 * canonical — nhờ vậy khi Phase 3.3 gán category thật, URL cũ vẫn phân giải đúng.
 */
var Router = (function () {
  // --- Base path: lấy từ URL của chính router.js ("{BASE}js/router.js") ---
  var src = (document.currentScript && document.currentScript.src) || "";
  var baseUrl = src.replace(/js\/router\.js(?:\?.*)?$/, "");
  var BASE = "/";
  try { BASE = baseUrl ? new URL(baseUrl, location.href).pathname : "/"; } catch (e) { BASE = "/"; }
  if (BASE.charAt(BASE.length - 1) !== "/") BASE += "/";

  function catSeg(post) { return (post && (post.category || post.categoryId)) || "bai-viet"; }
  function postUrl(post) { return BASE + encodeURIComponent(catSeg(post)) + "/" + encodeURIComponent(post.slug) + "/"; }

  function findPost(slug) {
    var posts = (window.DataService ? DataService.getPosts() : []);
    return posts.filter(function (p) { return p.published; })
                .find(function (p) { return p.slug === slug; });
  }

  // Phân giải URL hiện tại → {type:'post'|'home'|'admin', slug?, viaHash?, viaPath?}
  function resolve() {
    var h = location.hash;
    var m = h.match(/^#\/bai\/(.+)$/);
    if (m) return { type: "post", slug: decodeURIComponent(m[1]), viaHash: true };
    if (h === "#quan-tri") return { type: "admin" };

    var p = location.pathname;
    if (p.indexOf(BASE) === 0) p = p.slice(BASE.length);
    p = p.replace(/^\/+|\/+$/g, "");
    if (p) {
      var segs = p.split("/");
      var slug = decodeURIComponent(segs[segs.length - 1]);
      // Bỏ qua các file tĩnh (index.html, sitemap.xml…) — không coi là bài viết
      if (/\.(html?|xml|json|txt|ico|png|jpe?g|svg|css|js)$/i.test(slug)) return { type: "home" };
      return { type: "post", slug: slug, viaPath: true };
    }
    return { type: "home" };
  }

  // pushState sang URL sạch của bài (dùng khi bấm vào thẻ bài). Trả false nếu không tìm thấy.
  function goPost(slug) {
    var post = findPost(slug);
    if (!post) return false;
    try { history.pushState({ slug: slug }, "", postUrl(post)); } catch (e) { location.hash = "#/bai/" + encodeURIComponent(slug); }
    return true;
  }

  // Về trang chủ (đóng bài). anchor (không dấu #) để cuộn tới section, ví dụ 'bai-viet'.
  function goHome(anchor) {
    try { history.pushState({}, "", BASE); } catch (e) { location.hash = ""; }
    if (anchor) { var el = document.getElementById(anchor); if (el) el.scrollIntoView({ behavior: "smooth" }); }
  }

  // Đảm bảo URL trên thanh địa chỉ là dạng sạch canonical của bài (nâng cấp từ hash).
  function setCanonical(post) {
    if (!post || !window.history || !history.replaceState) return;
    var want = postUrl(post);
    if (location.pathname !== want) {
      try { history.replaceState({ slug: post.slug }, "", want); } catch (e) {}
    }
  }

  return {
    base: function () { return BASE; },
    postUrl: postUrl,
    resolve: resolve,
    goPost: goPost,
    goHome: goHome,
    setCanonical: setCanonical
  };
})();
