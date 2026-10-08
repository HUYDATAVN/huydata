/* HuyData v9 — site.js: dùng chung cho mọi trang.
   Trang vẫn đọc và dùng được đầy đủ khi tắt JavaScript; file này chỉ thêm tiện ích nhỏ. */
(function(){
"use strict";
/* Vào trang quản trị: địa chỉ cũ #quan-tri, phím Ctrl/⌘ + Alt + A */
if(/^#quan-tri$/.test(location.hash)){ location.replace("/quan-tri/"); return; }
document.addEventListener("keydown",function(e){
  if((e.ctrlKey||e.metaKey)&&e.altKey&&(e.key==="a"||e.key==="A")){ e.preventDefault(); location.href="/quan-tri/"; }
});

/* Đo lường Google Analytics 4 — chỉ chạy khi trang quản trị đã điền mã G-… */
var ID=document.documentElement.getAttribute("data-ga")||"";
function track(n,p){ if(window.gtag) window.gtag("event",n,p||{}); }
if(/^G-[A-Z0-9]{4,15}$/.test(ID)){
  var s=document.createElement("script"); s.async=true; s.src="https://www.googletagmanager.com/gtag/js?id="+ID; document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[]; window.gtag=function(){ window.dataLayer.push(arguments); };
  window.gtag("js",new Date()); window.gtag("config",ID);
}
/* Đếm lượt bấm liên hệ: Zalo / gọi / email */
document.addEventListener("click",function(e){
  var a=e.target.closest&&e.target.closest("a[href]"); if(!a) return;
  var h=a.getAttribute("href")||"", m=/zalo\.me/i.test(h)?"zalo":/^tel:/i.test(h)?"phone":/^mailto:/i.test(h)?"email":/facebook\.com\/sharer/i.test(h)?"share_facebook":"";
  if(m) track(m==="share_facebook"?"share":"contact_click",{method:m,page_path:location.pathname});
},true);

/* Nút "Sao chép link" để dán vào Zalo */
Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"),function(b){
  b.hidden=false;
  b.addEventListener("click",function(){
    var u=b.getAttribute("data-copy"), old=b.textContent;
    function ok(){ b.textContent="✓ Đã chép — mở Zalo và dán"; setTimeout(function(){ b.textContent=old; },2500); track("share",{method:"copy_link",page_path:location.pathname}); }
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(ok,function(){ window.prompt("Sao chép link này:",u); });
    else window.prompt("Sao chép link này:",u);
  });
});

/* Trang Kiến thức: ô tìm bài + lọc "Dành cho" (không có JavaScript thì trang vẫn hiện đủ các chuyên mục) */
(function(){
  var box=document.querySelector("[data-kt-search]"), res=document.querySelector("[data-kt-results]"), main=document.querySelector("[data-kt-main]");
  if(!box||!res||!main) return;
  var aud=document.querySelector("[data-aud-filter]"), q=document.getElementById("kt-q"), empty=res.querySelector(".kt-empty"), curAud="";
  var cards=Array.prototype.slice.call(res.querySelectorAll(".pcard-post"));
  box.hidden=false; if(aud) aud.hidden=false;
  function norm(s){ return String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d"); }
  function run(){
    var phrase=norm(q.value).replace(/\s+/g," ").trim(), words=phrase.split(" ").filter(Boolean), on=words.length||curAud, n=0;
    main.hidden=!!on; res.hidden=!on;
    /* Ưu tiên khớp nguyên cụm; không bài nào khớp cụm thì mới khớp từng chữ */
    var byPhrase=phrase&&cards.some(function(cd){ return norm(cd.getAttribute("data-q")).indexOf(phrase)>=0; });
    cards.forEach(function(cd){
      var t=norm(cd.getAttribute("data-q")), a=" "+(cd.getAttribute("data-aud")||"")+" ";
      var hit=byPhrase?t.indexOf(phrase)>=0:words.every(function(w){ return t.indexOf(w)>=0; });
      var ok=hit&&(!curAud||a.indexOf(" "+curAud+" ")>=0);
      cd.hidden=!ok; if(ok) n++;
    });
    if(empty) empty.hidden=n>0;
  }
  q.addEventListener("input",run);
  if(aud) aud.addEventListener("click",function(e){
    var b=e.target.closest("[data-aud]"); if(!b) return;
    curAud=b.getAttribute("data-aud"); Array.prototype.forEach.call(aud.querySelectorAll("[data-aud]"),function(x){ x.classList.toggle("on",x===b); }); run();
  });
})();

/* Đóng menu điện thoại khi bấm ra ngoài */
document.addEventListener("click",function(e){
  var d=document.querySelector(".mnav[open]"); if(d&&!d.contains(e.target)) d.removeAttribute("open");
});
})();
