"use strict";
/*
 * HuyData — SEO (Phase 3.4)
 * -----------------------------------------------------------------------------
 * 1) Runtime: chèn canonical + JSON-LD (Organization, WebSite+SearchAction,
 *    Person, FAQPage, SoftwareApplication) cho trang chủ; Article + BreadcrumbList
 *    + meta riêng cho từng bài.
 * 2) Publish: sinh sitemap.xml, rss.xml, robots.txt và trang HTML tĩnh cho mỗi bài
 *    (chạy trong trình duyệt, không cần build tool).
 *
 * URL tuyệt đối lấy từ settings.siteBase (nếu đặt) hoặc origin + Router.base().
 */
var SEO = (function () {
  function DS() { return window.DataService; }
  function S() { return (DS() && DS().getSettings()) || {}; }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function txt(html) { var d = document.createElement("div"); d.innerHTML = html || ""; return (d.textContent || "").trim(); }

  function baseUrl() {
    var s = S();
    if (s.siteBase) return String(s.siteBase).replace(/\/+$/, "") + "/";
    var b = (window.Router ? Router.base() : "/");
    return location.origin + b;
  }
  function abs(pathFromBase) { return baseUrl() + String(pathFromBase || "").replace(/^\/+/, ""); }
  function postPath(post) {
    var cat = (post.category || post.categoryId || "bai-viet");
    return encodeURIComponent(cat) + "/" + encodeURIComponent(post.slug) + "/";
  }
  function postAbs(post) { return abs(postPath(post)); }

  /* ---------- head helpers ---------- */
  function setMetaContent(id, val) { var el = document.getElementById(id); if (el) el.setAttribute("content", val == null ? "" : val); }
  function setOgImage(img) {
    var oi = document.getElementById("og-img"), ti = document.getElementById("tw-img");
    if (img) { if (oi) { oi.setAttribute("content", img); oi.removeAttribute("data-off"); } if (ti) ti.setAttribute("content", img); }
  }
  function setCanonical(url) {
    var el = document.getElementById("link-canonical");
    if (!el) { el = document.createElement("link"); el.setAttribute("rel", "canonical"); el.id = "link-canonical"; document.head.appendChild(el); }
    el.setAttribute("href", url);
  }
  function setJsonLd(id, obj) {
    var el = document.getElementById(id);
    if (obj == null) { if (el) el.parentNode.removeChild(el); return; }
    if (!el) { el = document.createElement("script"); el.type = "application/ld+json"; el.id = id; document.head.appendChild(el); }
    el.textContent = JSON.stringify(obj);
  }

  /* ---------- schema builders ---------- */
  function orgSchema() {
    var s = S();
    return {
      "@type": "Organization", "@id": baseUrl() + "#org",
      "name": s.brandName || "HuyData", "url": baseUrl(),
      "email": s.email || undefined, "telephone": s.phone || undefined,
      "areaServed": "VN", "founder": { "@id": baseUrl() + "#founder" }
    };
  }
  function personSchema() {
    var about = (DS().getAbout && DS().getAbout()) || {};
    return { "@type": "Person", "@id": baseUrl() + "#founder", "name": about.name || "Trần Huy", "jobTitle": about.role || "", "worksFor": { "@id": baseUrl() + "#org" } };
  }
  function websiteSchema() {
    var s = S();
    return {
      "@type": "WebSite", "@id": baseUrl() + "#website", "url": baseUrl(), "name": s.brandName || "HuyData",
      "inLanguage": "vi", "publisher": { "@id": baseUrl() + "#org" },
      "potentialAction": { "@type": "SearchAction", "target": { "@type": "EntryPoint", "urlTemplate": baseUrl() + "?q={search_term_string}" }, "query-input": "required name=search_term_string" }
    };
  }
  function faqSchema() {
    var fq = DS().getFaq && DS().getFaq();
    if (!fq || fq.enabled === false || !arr(fq.items).length) return null;
    return { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": fq.items.map(function (it) { return { "@type": "Question", "name": it.q, "acceptedAnswer": { "@type": "Answer", "text": it.a } }; }) };
  }
  function softwareGraph() {
    var prods = (DS().getProducts && DS().getProducts()) || [];
    if (!prods.length) return null;
    return {
      "@context": "https://schema.org",
      "@graph": prods.map(function (p) {
        return { "@type": "SoftwareApplication", "name": p.name, "description": txt(p.desc), "applicationCategory": "BusinessApplication", "operatingSystem": "Windows", "offers": { "@type": "Offer", "priceCurrency": "VND", "price": "0" }, "publisher": { "@id": baseUrl() + "#org" } };
      })
    };
  }
  function articleSchema(post) {
    var cat = DS().getCategory && DS().getCategory(post.category);
    var au = DS().getAuthor && DS().getAuthor(post.author);
    var ai = post.ai || {};
    var o = {
      "@context": "https://schema.org", "@type": "BlogPosting", "@id": postAbs(post) + "#article",
      "headline": post.title, "description": post.excerpt || ai.summary || "",
      "datePublished": post.date || undefined, "dateModified": post.updatedAt || post.date || undefined,
      "author": { "@type": "Person", "name": (au && au.name) || "Trần Huy" },
      "publisher": { "@id": baseUrl() + "#org" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": postAbs(post) },
      "inLanguage": ai.language || "vi", "url": postAbs(post)
    };
    if (cat) o.articleSection = cat.name;
    if (ai.keywords && ai.keywords.length) o.keywords = ai.keywords.join(", ");
    else if (arr(post.tags).length) o.keywords = post.tags.join(", ");
    if (ai.summary) o.abstract = ai.summary;
    if (ai.difficulty) o.educationalLevel = ai.difficulty;
    var ents = (DS().getPostEntities && DS().getPostEntities(post)) || [];
    if (ents.length) o.about = ents.map(function (e) { return { "@type": "Thing", "name": e.name, "description": e.desc || undefined }; });
    if (post.cover) o.image = post.cover;
    return o;
  }
  function postFaqSchema(post) {
    if (!post.faqs || !post.faqs.length) return null;
    return { "@context": "https://schema.org", "@type": "FAQPage", "@id": postAbs(post) + "#faq", "mainEntity": post.faqs.map(function (f) { return { "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }; }) };
  }
  function breadcrumbSchema(post) {
    var cat = DS().getCategory && DS().getCategory(post.category);
    var items = [{ "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": baseUrl() }];
    var pos = 2;
    if (cat) { items.push({ "@type": "ListItem", "position": pos++, "name": cat.name }); }
    items.push({ "@type": "ListItem", "position": pos, "name": post.title, "item": postAbs(post) });
    return { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items };
  }

  /* ---------- runtime apply ---------- */
  function applyHome() {
    setCanonical(abs(""));
    setJsonLd("ld-site", { "@context": "https://schema.org", "@graph": [orgSchema(), personSchema(), websiteSchema()] });
    setJsonLd("ld-faq", faqSchema());
    setJsonLd("ld-software", softwareGraph());
    setJsonLd("ld-article", null);
    setJsonLd("ld-breadcrumb", null);
    setJsonLd("ld-article-faq", null);
  }
  function applyPost(post) {
    var s = S();
    var ai = post.ai || {};
    var title = post.title ? post.title + " · " + (s.brandName || "HuyData") : document.title;
    var desc = post.excerpt || ai.summary || "";
    document.title = title;
    var pt = document.getElementById("page-title"); if (pt) pt.textContent = title;
    setMetaContent("meta-desc", desc);
    setMetaContent("og-title", title); setMetaContent("og-desc", desc);
    setMetaContent("tw-title", title); setMetaContent("tw-desc", desc);
    if (post.cover) setOgImage(post.cover);
    setCanonical(postAbs(post));
    // Trên trang bài, gỡ schema chỉ dành cho trang chủ để tránh trùng FAQPage
    setJsonLd("ld-faq", null);
    setJsonLd("ld-software", null);
    setJsonLd("ld-article", articleSchema(post));
    setJsonLd("ld-breadcrumb", breadcrumbSchema(post));
    setJsonLd("ld-article-faq", postFaqSchema(post));
  }

  /* ---------- publish generators ---------- */
  function xmlEsc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }
  function isoDate(d) { if (!d) return ""; var t = new Date(d); return isNaN(t) ? "" : t.toISOString(); }

  function publishedPosts() { return (DS().getPublishedPosts && DS().getPublishedPosts()) || []; }

  function buildSitemap() {
    var urls = [{ loc: abs(""), lastmod: "", pri: "1.0", freq: "weekly" }];
    publishedPosts().forEach(function (p) {
      urls.push({ loc: postAbs(p), lastmod: isoDate(p.updatedAt || p.date), pri: p.featured ? "0.8" : "0.6", freq: "monthly" });
    });
    var body = urls.map(function (u) {
      return "  <url>\n    <loc>" + xmlEsc(u.loc) + "</loc>\n" +
        (u.lastmod ? "    <lastmod>" + u.lastmod + "</lastmod>\n" : "") +
        "    <changefreq>" + u.freq + "</changefreq>\n    <priority>" + u.pri + "</priority>\n  </url>";
    }).join("\n");
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "\n</urlset>\n";
  }

  function buildRSS() {
    var s = S();
    var items = publishedPosts().slice().sort(function (a, b) { return String(b.date || "").localeCompare(String(a.date || "")); }).slice(0, 30);
    var body = items.map(function (p) {
      return "    <item>\n      <title>" + xmlEsc(p.title) + "</title>\n      <link>" + xmlEsc(postAbs(p)) + "</link>\n      <guid isPermaLink=\"true\">" + xmlEsc(postAbs(p)) + "</guid>\n" +
        (p.date ? "      <pubDate>" + new Date(p.date).toUTCString() + "</pubDate>\n" : "") +
        "      <description>" + xmlEsc(p.excerpt || p.summary || "") + "</description>\n    </item>";
    }).join("\n");
    return '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n' +
      "    <title>" + xmlEsc(s.brandName || "HuyData") + " — Thư viện Tri thức</title>\n" +
      "    <link>" + xmlEsc(baseUrl()) + "</link>\n" +
      "    <description>" + xmlEsc((s.seo && s.seo.description) || "Kiến thức dữ liệu, thuế – kế toán, AI và quản trị.") + "</description>\n" +
      "    <language>vi</language>\n" + body + "\n</channel></rss>\n";
  }

  function buildRobots() {
    return "User-agent: *\nAllow: /\n\nSitemap: " + abs("sitemap.xml") + "\n";
  }

  // Trang HTML tĩnh cho 1 bài: nhân bản SHELL, chèn <base>, meta/JSON-LD, và
  // dựng sẵn nội dung bài (mở #postview) để bot đọc được ngay không cần JS.
  function buildPostPage(post, contentJson) {
    var shell = window.SHELL || ("<!DOCTYPE html>\n" + document.documentElement.outerHTML);
    var s = S();
    var title = post.title + " · " + (s.brandName || "HuyData");
    var desc = post.excerpt || post.summary || "";
    var img = post.cover || (s.seo && s.seo.ogImage) || "";

    var out = shell;
    // <base> để asset (css/js/data) phân giải về gốc site từ /{cat}/{slug}/
    out = out.replace(/<head>/, '<head>\n<base href="../../">');
    // title + meta
    out = out.replace(/(<title id="page-title">)[\s\S]*?(<\/title>)/, "$1" + attr(title) + "$2");
    out = setContentAttr(out, "meta-desc", desc);
    out = setContentAttr(out, "og-title", title); out = setContentAttr(out, "og-desc", desc);
    out = setContentAttr(out, "tw-title", title); out = setContentAttr(out, "tw-desc", desc);
    if (img) { out = setContentAttr(out, "og-img", img); out = setContentAttr(out, "tw-img", img); }
    // canonical + JSON-LD trước </head>
    var head = '<link rel="canonical" href="' + attr(postAbs(post)) + '">\n' +
      ld(articleSchema(post)) + ld(breadcrumbSchema(post)) +
      (postFaqSchema(post) ? ld(postFaqSchema(post)) : "") +
      ld({ "@context": "https://schema.org", "@graph": [orgSchema(), personSchema(), websiteSchema()] });
    out = out.replace(/<\/head>/, head + "</head>");
    // bake content vào #site-content (SPA hydrate ngay)
    if (contentJson != null) {
      var jsonSafe = String(contentJson).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
      out = out.replace(/(<script id="site-content" type="application\/json">)[\s\S]*?(<\/script>)/, function (_, a, z) { return a + jsonSafe + z; });
    }
    // dựng sẵn nội dung bài + mở postview để bot đọc
    var inner = articleInnerHTML(post).html;
    out = out.replace(/<div class="postview" id="postview">/, '<div class="postview open" id="postview">');
    out = out.replace(/(<article class="article" id="pv-article">)[\s\S]*?(<\/article>)/, function (_, a, z) { return a + inner + z; });
    return out;
  }
  function attr(v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function setContentAttr(html, id, val) { return html.replace(new RegExp('(<[^>]*id="' + id + '"[^>]*content=")[^"]*(")'), "$1" + attr(val) + "$2"); }
  function ld(obj) { return '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, "\\u003c") + "</script>\n"; }

  return {
    applyHome: applyHome, applyPost: applyPost, setCanonical: setCanonical,
    baseUrl: baseUrl, abs: abs, postPath: postPath, postAbs: postAbs,
    buildSitemap: buildSitemap, buildRSS: buildRSS, buildRobots: buildRobots, buildPostPage: buildPostPage
  };
})();
