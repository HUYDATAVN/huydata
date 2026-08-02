"use strict";
/*
 * HuyData — Blog helpers (Phase 3.3)
 * Suy diễn dữ liệu cho Thư viện Tri thức: thời gian đọc, mục lục (TOC), bài liên quan.
 * Thuần hàm, nhận dữ liệu vào — trả kết quả; phần render nằm ở app.js.
 */
var Blog = (function () {
  function arr(x) { return Array.isArray(x) ? x : []; }
  function strip(html) { var d = document.createElement("div"); d.innerHTML = html || ""; return d.textContent || ""; }

  // Thời gian đọc ước lượng (phút), ~200 từ/phút, tối thiểu 1.
  function readingTime(post) {
    var text = strip((post && post.body) || "") + " " + ((post && post.excerpt) || "");
    var words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }

  function slugifyHeading(text, i) {
    var base = String(text || "muc").toLowerCase().normalize("NFD")
      .replace(/[̀-ͯ]/g, "").replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
    return (base || "muc") + "-" + i;
  }

  // Gắn id vào các heading h2/h3 và trả mục lục.
  // -> { html: body đã có id, toc: [{id, text, level}] }
  function buildTOC(bodyHtml) {
    var doc = new DOMParser().parseFromString("<div>" + (bodyHtml || "") + "</div>", "text/html");
    var root = doc.body.firstChild;
    var heads = root.querySelectorAll("h2, h3");
    var toc = [];
    Array.prototype.forEach.call(heads, function (h, i) {
      var text = (h.textContent || "").trim();
      var id = slugifyHeading(text, i);
      h.setAttribute("id", id);
      toc.push({ id: id, text: text, level: h.tagName === "H3" ? 3 : 2 });
    });
    // Hiệu năng + bảo vệ: ảnh trong bài tải lười và chống kéo (Phase 3.7)
    Array.prototype.forEach.call(root.querySelectorAll("img"), function (img) {
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
      img.setAttribute("draggable", "false");
    });
    return { html: root.innerHTML, toc: toc };
  }

  // Bài liên quan: cùng category (+2 điểm) và trùng tag (+1 điểm mỗi tag), loại chính nó.
  function related(post, allPosts, n) {
    n = n || 3;
    var tags = arr(post.tags);
    return arr(allPosts)
      .filter(function (p) { return p.published && p.slug !== post.slug; })
      .map(function (p) {
        var s = 0;
        if (p.category === post.category) s += 2;
        s += arr(p.tags).filter(function (t) { return tags.indexOf(t) >= 0; }).length;
        return { p: p, s: s };
      })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s || String(b.p.date || "").localeCompare(String(a.p.date || "")); })
      .slice(0, n)
      .map(function (x) { return x.p; });
  }

  return { readingTime: readingTime, buildTOC: buildTOC, related: related };
})();
