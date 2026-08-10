"use strict";
/*
 * HuyData — Dashboard (Phase 3.6)
 * Thống kê quản trị từ dữ liệu thật (không theo dõi người đọc).
 */
var Dashboard = (function () {
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function tile(num, label, sub) {
    return '<div class="stat-tile"><div class="st-num">' + num + '</div><div class="st-label">' + esc(label) + '</div>' +
      (sub ? '<div class="st-sub">' + esc(sub) + '</div>' : '') + '</div>';
  }
  function render(container) {
    if (!window.DataService || !DataService.stats) { container.textContent = "Chưa sẵn sàng."; return; }
    var s = DataService.stats();
    var bs = s.byStatus || {};
    var tiles =
      tile(s.published, "Bài đã xuất bản", "trên " + s.posts + " bài") +
      tile(bs.draft || 0, "Nháp") +
      tile(bs.pending || 0, "Chờ duyệt") +
      tile(bs.archived || 0, "Lưu trữ") +
      tile(s.featured, "Nổi bật") +
      tile(s.products, "Sản phẩm") +
      tile(s.categories, "Chuyên mục") +
      tile(s.tags, "Tag") +
      tile(s.entities, "Thực thể") +
      tile(s.users, "Người dùng") +
      tile(s.media, "Media");
    var counts = s.topCategories.map(function (c) { return c.count; }).concat([1]);
    var maxCount = Math.max.apply(null, counts);
    var topCat = s.topCategories.filter(function (c) { return c.count > 0; }).map(function (c) {
      var w = Math.round((c.count / maxCount) * 100);
      return '<div class="stat-bar-row"><span class="sbr-label">' + esc(c.name) + '</span>' +
        '<span class="sbr-track"><span class="sbr-fill" style="width:' + w + '%"></span></span>' +
        '<span class="sbr-val">' + c.count + '</span></div>';
    }).join('');
    container.innerHTML =
      '<div class="stat-grid">' + tiles + '</div>' +
      (topCat ? '<h2 style="font-size:20px;margin:28px 0 14px">Top chuyên mục</h2><div class="stat-bars">' + topCat + '</div>' : '') +
      '<p class="hint" style="margin-top:22px">Lượt xem và “bài xem nhiều nhất” cần công cụ phân tích (analytics). Trang này cố ý không theo dõi người đọc, nên các số này chỉ có khi gắn backend/analytics ở giai đoạn sau (Phase 3.8).</p>';
  }
  return { render: render };
})();
