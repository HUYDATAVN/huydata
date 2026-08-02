"use strict";
/*
 * HuyData — Search (Phase 3.3)
 * Lọc bài viết theo từ khóa + category + tag. Thuần logic, không đụng DOM render.
 */
var Search = (function () {
  function arr(x) { return Array.isArray(x) ? x : []; }
  function norm(s) { return String(s == null ? "" : s).toLowerCase(); }
  function strip(html) { var d = document.createElement("div"); d.innerHTML = html || ""; return d.textContent || ""; }

  // Tìm trên metadata (nhanh, không quét toàn bộ body — trọng yếu khi hàng nghìn bài).
  function matchesQuery(post, q) {
    if (!q) return true;
    var ai = post.ai || {};
    var hay = norm(
      post.title + " " + (post.excerpt || "") + " " + (ai.summary || post.summary || "") + " " +
      arr(post.tags).join(" ") + " " + arr(ai.keywords).join(" ")
    );
    return hay.indexOf(q) >= 0;
  }

  // filter(posts, {query, category, tag}) -> mảng bài khớp
  function filter(posts, opt) {
    opt = opt || {};
    var q = norm((opt.query || "").trim());
    var cat = opt.category || "";
    var tag = opt.tag || "";
    return arr(posts).filter(function (p) {
      if (cat && p.category !== cat) return false;
      if (tag && arr(p.tags).indexOf(tag) < 0) return false;
      return matchesQuery(p, q);
    });
  }

  return { filter: filter };
})();
