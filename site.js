/* HuyData site.js — sinh tự động từ trang quản trị, đừng sửa tay */
(function(){
var ID="";
function track(n,p){ if(window.gtag) window.gtag("event",n,p||{}); }
if(ID && !/#quan-tri/.test(location.hash)){
  var s=document.createElement("script"); s.async=true; s.src="https://www.googletagmanager.com/gtag/js?id="+ID; document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[]; window.gtag=function(){ window.dataLayer.push(arguments); };
  window.gtag("js",new Date()); window.gtag("config",ID);
}
/* Đếm lượt bấm liên hệ: Zalo / gọi điện / email */
document.addEventListener("click",function(e){
  var a=e.target.closest&&e.target.closest("a[href]"); if(!a) return;
  var h=a.getAttribute("href")||"", m=/zalo\.me/i.test(h)?"zalo":/^tel:/i.test(h)?"phone":/^mailto:/i.test(h)?"email":/facebook\.com\/sharer/i.test(h)?"share_facebook":"";
  if(m) track(m==="share_facebook"?"share":"contact_click",{method:m,page_path:location.pathname});
},true);
/* Nút sao chép link bài (để dán vào Zalo) */
Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"),function(b){
  b.hidden=false;
  b.addEventListener("click",function(){
    var u=b.getAttribute("data-copy"), old=b.textContent;
    function ok(){ b.textContent="✓ Đã chép — mở Zalo và dán"; setTimeout(function(){ b.textContent=old; },2500); track("share",{method:"copy_link",page_path:location.pathname}); }
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(ok,function(){ prompt("Sao chép link này:",u); });
    else prompt("Sao chép link này:",u);
  });
});
})();
