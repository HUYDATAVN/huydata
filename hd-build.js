/* HuyData v9 — BỘ DỰNG TRANG.
   Nhận nội dung (noi-dung.json) → trả về danh sách file HTML/XML của cả website.
   Dùng chung cho: trang quản trị (bấm "Đăng lên GitHub") và công cụ dựng trên máy (tools/build.mjs).
   File code: sửa ở v9/src/hd-build.js. Không phụ thuộc thư viện ngoài, không cần DOM. */
(function(root){
"use strict";
var VERSION="9.3.0";

/* ---------------- Tiện ích ---------------- */
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function txt(html){ return String(html==null?"":html).replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/\s+/g," ").trim(); }
function has(v){ return String(v==null?"":v).trim()!==""; }
function slugify(s){
  return String(s||"").toLowerCase().replace(/đ/g,"d").normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);
}
function fmtDate(iso){ var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso||"")); return m?(m[3]+"/"+m[2]+"/"+m[1]):""; }
function isExt(h){ return /^(https?:)?\/\//i.test(String(h||"")) && !/^https?:\/\/(www\.)?huydata\.vn/i.test(String(h||"")); }
function aOpen(h,cls,extra){ h=String(h||"#"); return '<a href="'+esc(h)+'"'+(cls?' class="'+cls+'"':'')+(isExt(h)||/zalo\.me/i.test(h)?' target="_blank" rel="noopener noreferrer"':'')+(extra||'')+'>'; }
function today(){ return new Date().toISOString().slice(0,10); }
function readMinutes(html){ return Math.max(1,Math.round(txt(html).split(/\s+/).filter(Boolean).length/220)); }

/* ---------------- Biểu tượng (SVG nét) ---------------- */
var LOGO='<svg viewBox="0 0 180 180" aria-hidden="true"><rect width="180" height="180" rx="40" fill="#102A1D"/><line x1="50" y1="36" x2="50" y2="144" stroke="#74C69D" stroke-width="16" stroke-linecap="round"/><line x1="130" y1="36" x2="130" y2="144" stroke="#74C69D" stroke-width="16" stroke-linecap="round"/><line x1="50" y1="90" x2="130" y2="90" stroke="#2DD4A8" stroke-width="16" stroke-linecap="round"/><circle cx="50" cy="36" r="14" fill="#B7E4C7"/><circle cx="130" cy="36" r="14" fill="#2DD4A8"/><circle cx="50" cy="144" r="14" fill="#2DD4A8"/><circle cx="130" cy="144" r="14" fill="#B7E4C7"/><circle cx="90" cy="90" r="12" fill="#40916C"/></svg>';
var ZALO='<img class="zic" src="/anh/v9/zalo.png" alt="" width="24" height="23" decoding="async">';
var P={
  calculator:'<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6.5h8M8 11h.01M12 11h.01M16 11h.01M8 14.5h.01M12 14.5h.01M16 14.5h.01M8 18h.01M12 18h4"/>',
  store:'<path d="M3 9.5 4.5 4h15L21 9.5"/><path d="M3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8h14v-8M10 20v-5h4v5"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  check:'<path d="M5 12.5 10 17l9-10"/>',
  shield:'<path d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  monitor:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  table:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>',
  box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  phone:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/>',
  mobile:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin:'<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
  refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
  play:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3"/>',
  cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h12L22 7H6"/>',
  facebook:'<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'
};
function icon(n,cls){ var p=P[n]; if(!p) return ""; return '<svg'+(cls?' class="'+cls+'"':'')+' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+p+'</svg>'; }

/* ---------------- Địa chỉ ---------------- */
function site(c){ var u=String((c.settings&&c.settings.siteUrl)||"https://huydata.vn/"); return /\/$/.test(u)?u:u+"/"; }
function absUrl(c,p){ p=String(p||""); if(/^https?:\/\//i.test(p)) return p; return site(c)+p.replace(/^\/+/,""); }
function pageHref(pg){ return "/"+(pg.path||""); }
function postHref(p){ return "/bai-viet/"+p.slug+"/"; }
function zaloUrl(c){ return "https://zalo.me/"+String(c.settings.zalo||"").replace(/\D/g,""); }
function telUrl(c){ return "tel:"+String(c.settings.phone||"").replace(/[^\d+]/g,""); }
function linkHref(c,h){
  /* Liên kết đặc biệt trong nội dung: "zalo", "tel" */
  h=String(h||"").trim();
  if(h==="zalo") return zaloUrl(c);
  if(h==="tel") return telUrl(c);
  return h||"#";
}
function pages(c){ return (c.pages||[]).filter(function(p){ return p.enabled!==false; }); }
function pageById(c,id){ return (c.pages||[]).filter(function(p){return p.id===id;})[0]; }
function products(c){ return pages(c).filter(function(p){ return p.kind==="product"; }).sort(function(a,b){ return (a.order||0)-(b.order||0); }); }
function pubPosts(c){
  return ((c.blog&&c.blog.posts)||[]).filter(function(p){ return p.published && has(p.slug); })
    .sort(function(a,b){ return String(b.date||"").localeCompare(String(a.date||"")); });
}
function pubDocs(c){ return ((c.docs&&c.docs.items)||[]).filter(function(d){ return d.published!==false && has(d.slug); }); }

/* ---------------- Khung trang ---------------- */
/* Danh sách xổ xuống của một mục menu: tự sinh từ dữ liệu (auto) hoặc nhập tay (children) */
function services(c){ return pages(c).filter(function(p){ return p.kind==="service"; }).sort(function(a,b){ return (a.order||0)-(b.order||0); }); }
function navChildren(c,n){
  var out=[];
  if(n.auto==="products"){ products(c).forEach(function(p){ var k=p.card||{}; out.push({t:k.name||p.navTitle||p.title,d:k.line,h:pageHref(p)}); }); }
  if(n.auto==="services"){ services(c).forEach(function(p){ var k=p.card||{}; out.push({t:k.name||p.navTitle||p.title,d:k.line,h:pageHref(p)}); }); }
  if(n.auto==="knowledge"){ liveCats(c).forEach(function(k){ out.push({t:k.name,d:k.desc,h:catHref(k.slug)}); }); }
  (n.children||[]).forEach(function(x){ if(has(x.label)&&has(x.href)) out.push({t:x.label,d:x.desc,h:x.href}); });
  return out;
}
function isCur(cur,h){ return !!cur && (cur===h || (h!=="/" && cur.indexOf(h)===0)); }
function navLinks(c,cur){
  return (c.settings.nav||[]).map(function(n){
    var on=isCur(cur,n.href), kids=navChildren(c,n);
    var top='<a class="nav-top" href="'+esc(n.href)+'"'+(on?' aria-current="page"':'')+'>'+esc(n.label)+(kids.length?'<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>':'')+'</a>';
    if(!kids.length) return '<div class="nav-item">'+top+'</div>';
    return '<div class="nav-item has-dd">'+top+'<div class="dd"><ul>'+kids.map(function(x){
      return '<li><a href="'+esc(x.h)+'"'+(isCur(cur,x.h)?' aria-current="page"':'')+'><b>'+esc(x.t)+'</b>'+(has(x.d)?'<span>'+esc(x.d)+'</span>':'')+'</a></li>';
    }).join("")+'</ul></div></div>';
  }).join("");
}
function mobileLinks(c,cur){
  return (c.settings.nav||[]).map(function(n){
    var kids=navChildren(c,n), on=isCur(cur,n.href);
    if(!kids.length) return '<a class="m-top" href="'+esc(n.href)+'"'+(on?' aria-current="page"':'')+'>'+esc(n.label)+'</a>';
    return '<div class="m-grp"><a class="m-top" href="'+esc(n.href)+'"'+(on?' aria-current="page"':'')+'>'+esc(n.label)+'</a>'+
      kids.map(function(x){ return '<a class="m-sub" href="'+esc(x.h)+'"'+(isCur(cur,x.h)?' aria-current="page"':'')+'>'+esc(x.t)+'</a>'; }).join("")+'</div>';
  }).join("");
}
function header(c,cur){
  var s=c.settings;
  return '<a class="skip" href="#noi-dung">Bỏ qua menu, tới nội dung</a>'+
  '<header class="hd"><div class="wrap hd-in">'+
    '<a class="brand" href="/" aria-label="'+esc(s.brandName)+' — trang chủ">'+LOGO+'<span><b>'+esc(s.brandName)+'</b><i>'+esc(s.tagline)+'</i></span></a>'+
    '<nav class="nav" aria-label="Menu chính">'+navLinks(c,cur)+'</nav>'+
    aOpen(zaloUrl(c),"btn btn-zalo hd-zalo")+ZALO+'Nhắn Zalo</a>'+
    '<details class="mnav"><summary><span class="bars" aria-hidden="true"></span>Menu</summary><nav aria-label="Menu">'+mobileLinks(c,cur)+
      aOpen(zaloUrl(c),"btn btn-zalo")+ZALO+'Nhắn Zalo '+esc(s.phoneText)+'</a></nav></details>'+
  '</div></header>';
}
function footer(c){
  var s=c.settings, lg=s.legal||{};
  var prods=products(c).map(function(p){ return '<li><a href="'+esc(pageHref(p))+'">'+esc((p.card&&p.card.name)||p.title)+'</a></li>'; }).join("");
  var more=(s.footerLinks||[]).map(function(l){ return '<li><a href="'+esc(l.href)+'">'+esc(l.label)+'</a></li>'; }).join("");
  var legal=[has(lg.entity)?esc(lg.entity):"", has(lg.taxCode)?"Mã số hộ kinh doanh "+esc(lg.taxCode):"", has(lg.address)?esc(lg.address):"", has(lg.owner)?"Người chịu trách nhiệm: "+esc(lg.owner):""].filter(Boolean).join(" · ");
  var ga=has(s.analytics&&s.analytics.ga4), privacy=pages(c).filter(function(p){return p.id==="quyen-rieng-tu";})[0];
  return '<footer class="ft"><div class="wrap">'+
    '<div class="ft-grid">'+
      '<div><div class="ft-brand">'+LOGO+'<b>'+esc(s.brandName)+'</b></div><p class="ft-scope">'+esc(s.footerNote)+'</p></div>'+
      (prods?'<div><h2>Phần mềm</h2><ul>'+prods+'</ul></div>':'')+
      (more?'<div><h2>'+esc(s.brandName)+'</h2><ul>'+more+'</ul></div>':'')+
      '<div><h2>Liên hệ</h2><ul>'+
        '<li>'+aOpen(zaloUrl(c))+'Zalo '+esc(s.phoneText)+'</a></li>'+
        '<li><a href="'+esc(telUrl(c))+'">Gọi '+esc(s.phoneText)+'</a></li>'+
        (has(s.email)?'<li><a href="mailto:'+esc(s.email)+'">'+esc(s.email)+'</a></li>':'')+
        (has(s.facebook)?'<li>'+aOpen(s.facebook)+'Fanpage Facebook</a></li>':'')+
        (has(s.hours)?'<li>'+esc(s.hours)+'</li>':'')+
      '</ul></div>'+
    '</div>'+
    (legal?'<div class="ft-legal">'+legal+'</div>':'')+
    '<div class="ft-bottom"><span class="ft-copy"><a class="ft-admin" href="/quan-tri/" rel="nofollow" tabindex="-1" aria-hidden="true">'+icon("gear")+'</a>© '+new Date().getFullYear()+' '+esc(s.brandName)+'</span>'+
      (ga?'':'<span>Trang này không dùng cookie theo dõi.</span>')+(privacy?'<a class="ft-priv" href="'+esc(pageHref(privacy))+'">Quyền riêng tư</a>':'')+'</div>'+
  '</div></footer>'+
  aOpen(zaloUrl(c),"zfloat",' aria-label="Nhắn Zalo cho '+esc(s.brandName)+'"')+ZALO+'Zalo</a>';
}
function orgNode(c){
  var s=c.settings, lg=s.legal||{}, u=site(c);
  var n={"@type":"Organization","@id":u+"#huydata",name:s.legalName||s.brandName,alternateName:s.brandName,url:u,
    logo:u+"favicon.png",description:s.orgDescription||s.footerNote,
    telephone:"+84"+String(s.phone||"").replace(/\D/g,"").replace(/^0/,""),email:s.email||undefined};
  if(has(lg.taxCode)) n.taxID=lg.taxCode;
  if(s.postal) n.address={"@type":"PostalAddress",streetAddress:s.postal.street,addressLocality:s.postal.locality,addressRegion:s.postal.region,addressCountry:"VN"};
  if(has(lg.owner)) n.founder={"@type":"Person",name:lg.owner};
  if(has(s.facebook)) n.sameAs=[s.facebook];
  return n;
}
function layout(c,o){
  var s=c.settings, img=absUrl(c,o.image||s.ogImage||""), ga=(s.analytics&&s.analytics.ga4)||"", gsc=(s.analytics&&s.analytics.gsc)||"";
  var csp="default-src 'self'; base-uri 'self'; form-action 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' https://www.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; object-src 'none'";
  return '<!DOCTYPE html>\n<html lang="vi"'+(/^G-[A-Z0-9]{4,15}$/.test(ga)?' data-ga="'+esc(ga)+'"':'')+'><head>\n'+
  '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'+
  '<title>'+esc(o.title)+'</title>\n'+
  '<meta name="description" content="'+esc(o.desc)+'">\n'+
  (o.noindex?'<meta name="robots" content="noindex,follow">\n':'<link rel="canonical" href="'+esc(o.canonical)+'">\n<meta name="robots" content="index,follow,max-image-preview:large">\n')+
  (has(gsc)&&o.home?'<meta name="google-site-verification" content="'+esc(gsc)+'">\n':'')+
  '<meta property="og:type" content="'+(o.article?'article':'website')+'">\n'+
  '<meta property="og:site_name" content="'+esc(s.brandName)+'">\n<meta property="og:locale" content="vi_VN">\n'+
  '<meta property="og:title" content="'+esc(o.ogTitle||o.title)+'">\n<meta property="og:description" content="'+esc(o.desc)+'">\n'+
  '<meta property="og:url" content="'+esc(o.canonical)+'">\n'+
  (img?'<meta property="og:image" content="'+esc(img)+'">\n'+(/\/anh\/v9\/(bia\/|og-)/.test(img)?'<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n':'')+'<meta property="og:image:alt" content="'+esc(o.ogTitle||o.title)+'">\n':'')+
  (o.article&&o.published?'<meta property="article:published_time" content="'+esc(o.published)+'">\n':'')+
  (o.article&&o.modified?'<meta property="article:modified_time" content="'+esc(o.modified)+'">\n':'')+
  '<meta name="twitter:card" content="'+(img?'summary_large_image':'summary')+'">\n'+
  '<meta http-equiv="Content-Security-Policy" content="'+csp+'">\n'+
  '<meta name="referrer" content="strict-origin-when-cross-origin">\n<meta name="color-scheme" content="light">\n<meta name="theme-color" content="#1A3D2B">\n'+
  '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n<link rel="icon" href="/favicon.png" type="image/png">\n<link rel="apple-touch-icon" href="/favicon.png">\n'+
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'+
  '<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&amp;display=swap" rel="stylesheet">\n'+
  '<link rel="stylesheet" href="/giao-dien.css?v='+VERSION+'">\n'+
  (o.ld?'<script type="application/ld+json">'+JSON.stringify(o.ld).replace(/</g,"\\u003c")+'</script>\n':'')+
  '</head>\n<body>\n'+header(c,o.cur)+'\n<main id="noi-dung">\n'+o.body+'\n</main>\n'+footer(c)+'\n'+
  '<script src="/site.js?v='+VERSION+'" defer></script>\n</body></html>\n';
}

/* ---------------- Ảnh trong khung ---------------- */
function figure(img,cls){
  if(!img||!has(img.src)) return "";
  var wh=(img.w&&img.h)?' width="'+(+img.w)+'" height="'+(+img.h)+'"':'';
  var tag='<img src="'+esc(img.src)+'" alt="'+esc(img.alt||"")+'"'+wh+(img.eager?' fetchpriority="high"':' loading="lazy"')+' decoding="async">';
  var fr=img.frame||"plain", inner;
  if(fr==="laptop") inner='<div class="screen">'+tag+'</div><div class="base"></div>';
  else if(fr==="phone") inner='<div class="screen">'+tag+'</div>';
  else inner=tag;
  return '<figure class="frame frame-'+esc(fr)+(cls?' '+cls:'')+'">'+inner+(has(img.caption)?'<figcaption>'+esc(img.caption)+'</figcaption>':'')+'</figure>';
}

/* ---------------- Nút ---------------- */
function button(c,b,small){
  if(!b||!has(b.label)) return "";
  var st=b.style||"primary", h=linkHref(c,b.href);
  var ic = st==="zalo"?ZALO:(b.icon?icon(b.icon):"");
  return aOpen(h,"btn btn-"+esc(st))+ic+esc(b.label)+'</a>';
}
function buttons(c,arr){ var h=(arr||[]).map(function(b){return button(c,b);}).join(""); return h?'<div class="btn-row">'+h+'</div>':""; }

/* ---------------- Đầu trang nội dung ---------------- */
function hero(c,pg,crumbs){
  var h=pg.hero||{}, media=figure(h.image?Object.assign({eager:true},h.image):null);
  var doors=(h.doors||[]).filter(function(d){return has(d.label);}).map(function(d,i){
    var st=d.style||(i===0?"primary":"outline");
    return aOpen(linkHref(c,d.href),"door door-"+esc(st))+(d.icon?icon(d.icon,"door-ic"):(st==="zalo"?ZALO:""))+
      '<span><span class="door-t">'+esc(d.label)+'</span>'+(has(d.sub)?'<span class="door-s">'+esc(d.sub)+'</span>':'')+'</span>'+icon("arrow","door-arrow")+'</a>';
  }).join("");
  return '<section class="hero">'+(crumbs||"")+'<div class="wrap hero-in'+(media?' has-media':'')+'"><div class="hero-txt">'+
    (has(h.eyebrow)?'<p class="eyebrow">'+esc(h.eyebrow)+'</p>':'')+
    '<h1>'+esc(h.h1||pg.title)+'</h1>'+
    (has(h.sub)?'<p class="lead">'+esc(h.sub)+'</p>':'')+
    (doors?'<div class="doors">'+doors+'</div>':'')+
    (has(h.note)?'<p class="hero-note">'+esc(h.note)+'</p>':'')+
    '</div>'+(media?'<div class="hero-media">'+media+'</div>':'')+'</div></section>';
}
function crumbsHtml(c,pg){
  var trail=[{t:"Trang chủ",h:"/"}], par=pg.parent?pageById(c,pg.parent):null;
  if(par) trail.push({t:par.navTitle||par.title,h:pageHref(par)});
  trail.push({t:pg.navTitle||pg.title,h:null});
  return '<nav class="wrap bc" aria-label="Đường dẫn">'+trail.map(function(x){ return x.h?'<a href="'+esc(x.h)+'">'+esc(x.t)+'</a>':'<span aria-current="page">'+esc(x.t)+'</span>'; }).join('<span aria-hidden="true">›</span>')+'</nav>';
}
function crumbsLd(c,pg){
  var u=site(c), items=[{name:"Trang chủ",item:u}], par=pg.parent?pageById(c,pg.parent):null;
  if(par) items.push({name:par.navTitle||par.title,item:absUrl(c,par.path)});
  items.push({name:pg.navTitle||pg.title,item:absUrl(c,pg.path)});
  return {"@type":"BreadcrumbList","itemListElement":items.map(function(x,i){return {"@type":"ListItem",position:i+1,name:x.name,item:x.item};})};
}

/* ---------------- Các loại khối ---------------- */
function blockHead(b){
  if(!has(b.title)&&!has(b.intro)) return "";
  return '<div class="blk-head">'+(has(b.title)?'<h2>'+esc(b.title)+'</h2>':'')+(has(b.intro)?'<p>'+esc(b.intro)+'</p>':'')+'</div>';
}
function cardsHtml(items,cols){
  return '<div class="grid grid-'+(cols||3)+'">'+(items||[]).filter(function(x){return has(x.title)||has(x.text);}).map(function(x){
    return '<div class="card">'+(x.image&&has(x.image.src)?'<div class="card-img"><img src="'+esc(x.image.src)+'" alt="'+esc(x.image.alt||"")+'" loading="lazy" decoding="async"></div>':(x.icon?'<div class="ic">'+icon(x.icon)+'</div>':''))+
      (has(x.title)?'<h3>'+esc(x.title)+'</h3>':'')+(has(x.text)?'<div class="rich">'+x.text+'</div>':'')+
      (has(x.link)&&has(x.linkLabel)?'<div class="actions"><a class="btn btn-outline" href="'+esc(x.link)+'">'+esc(x.linkLabel)+'</a></div>':'')+'</div>';
  }).join("")+'</div>';
}
function productCards(c,b){
  var list=products(c);
  if(b.ids&&b.ids.length) list=b.ids.map(function(id){return pageById(c,id);}).filter(function(p){return p&&p.enabled!==false;});
  return '<div class="grid grid-'+(list.length>=3?3:2)+'">'+list.map(function(p){
    var k=p.card||{};
    return '<article class="card pcard">'+(k.image&&has(k.image.src)?'<a class="card-img'+(k.image.fit==="contain"?' contain':'')+'" href="'+esc(pageHref(p))+'" tabindex="-1" aria-hidden="true"><img src="'+esc(k.image.src)+'" alt="" loading="lazy" decoding="async"></a>':'')+
      '<h3 class="pname"><a href="'+esc(pageHref(p))+'" style="color:inherit;text-decoration:none">'+esc(k.name||p.title)+'</a></h3>'+
      (has(k.line)?'<p class="pline">'+esc(k.line)+'</p>':'')+
      '<dl>'+(has(k.for)?'<dt>Dành cho</dt><dd>'+esc(k.for)+'</dd>':'')+(has(k.platform)?'<dt>Chạy trên</dt><dd>'+esc(k.platform)+'</dd>':'')+(has(k.price)?'<dt>Giá</dt><dd>'+esc(k.price)+'</dd>':'')+'</dl>'+
      '<div class="actions"><a class="btn btn-primary" href="'+esc(pageHref(p))+'">'+esc(b.moreLabel||"Xem chi tiết")+'</a>'+
      ((k.zaloLabel||b.zaloLabel)?aOpen(zaloUrl(c),"btn btn-outline")+esc(k.zaloLabel||b.zaloLabel)+'</a>':'')+'</div></article>';
  }).join("")+'</div>';
}
function serviceCards(c,b){
  var list=services(c);
  return '<div class="grid grid-'+(list.length>=4?4:(list.length===3?3:2))+'">'+list.map(function(p){
    var k=p.card||{};
    return '<article class="card scard"><div class="ic">'+icon(k.icon||"check")+'</div>'+
      '<h3><a href="'+esc(pageHref(p))+'" style="color:inherit;text-decoration:none">'+esc(k.name||p.navTitle||p.title)+'</a></h3>'+
      (has(k.line)?'<p>'+esc(k.line)+'</p>':'')+
      '<div class="actions"><a class="btn btn-outline" href="'+esc(pageHref(p))+'">'+esc(b.moreLabel||"Xem chi tiết")+'</a></div></article>';
  }).join("")+'</div>';
}
function plansHtml(c,b){
  var items=(b.items||[]).filter(function(x){return has(x.name);});
  var cols=items.length>=4?4:(items.length===3?3:2);
  return '<div class="grid grid-'+cols+'">'+items.map(function(x){
    var price=has(x.price)?x.price:"Liên hệ", contact=/liên hệ/i.test(price);
    return '<div class="card plan'+(x.highlight?' hl':'')+'">'+(has(x.badge)?'<span class="badge">'+esc(x.badge)+'</span>':'')+
      '<h3>'+esc(x.name)+'</h3>'+(has(x.for)?'<p class="pfor">'+esc(x.for)+'</p>':'')+
      '<div class="price'+(contact?' contact':'')+'">'+(has(x.oldPrice)&&!contact?'<span class="old">'+esc(x.oldPrice)+'</span>':'')+esc(price)+'</div>'+
      (has(x.period)?'<div class="period">'+esc(x.period)+'</div>':'')+
      (x.features&&x.features.length?'<ul>'+x.features.filter(has).map(function(f){return '<li>'+esc(f)+'</li>';}).join("")+'</ul>':'')+
      (has(x.cta)?'<div class="actions">'+aOpen(linkHref(c,x.ctaHref||"zalo"),"btn "+(x.highlight?"btn-primary":"btn-outline"))+esc(x.cta)+'</a></div>':'')+
    '</div>';
  }).join("")+'</div>'+(has(b.note)?'<p class="plans-note">'+esc(b.note)+'</p>':'');
}
function storiesHtml(c,b){
  var all=(c.stories&&c.stories.items)||[], list=all;
  if(b.ids&&b.ids.length) list=b.ids.map(function(i){return all[i];}).filter(Boolean);
  if(b.limit) list=list.slice(0,b.limit);
  return '<div class="grid grid-2">'+list.map(function(x){
    return '<figure class="card story"><blockquote>'+esc(x.quote)+'</blockquote><figcaption class="who"><b>'+esc(x.name)+'</b><span>'+esc([x.biz,x.place].filter(has).join(" · "))+'</span>'+
      (x.tags&&x.tags.length?'<div style="margin-top:8px">'+x.tags.map(function(t){return '<span class="tag">'+esc(t)+'</span>';}).join("")+'</div>':'')+'</figcaption></figure>';
  }).join("")+'</div>'+(b.showNote!==false&&has(c.stories&&c.stories.note)?'<p class="stories-note">'+esc(c.stories.note)+'</p>':'');
}
function postsHtml(c,b){
  var list=pubPosts(c).slice(0,b.limit||3);
  if(!list.length) return "";
  return '<div class="post-list three">'+cardsOf(c,list)+'</div>'+
    '<div class="btn-row" style="margin-top:20px"><a class="btn btn-outline" href="/bai-viet/">'+esc(b.moreLabel||"Xem tất cả bài viết")+'</a></div>';
}
function contactHtml(c,b){
  var s=c.settings;
  var rows=[
    {i:"zalo",l:"Zalo",v:s.phoneText,h:zaloUrl(c)},
    {i:"phone",l:"Điện thoại",v:s.phoneText,h:telUrl(c)},
    has(s.email)?{i:"mail",l:"Email",v:s.email,h:"mailto:"+s.email}:null,
    has(s.facebook)?{i:"facebook",l:"Facebook",v:"Fanpage HuyData",h:s.facebook}:null,
    has(s.address)?{i:"pin",l:"Địa chỉ",v:s.address}:null,
    has(s.hours)?{i:"clock",l:"Giờ làm việc",v:s.hours}:null
  ].filter(Boolean);
  return '<ul class="contact-list">'+rows.map(function(r){ return '<li>'+(r.i==="zalo"?ZALO:icon(r.i))+'<span><small>'+esc(r.l)+'</small>'+(r.h?aOpen(r.h)+esc(r.v)+'</a>':'<b>'+esc(r.v)+'</b>')+'</span></li>'; }).join("")+'</ul>';
}
function paymentHtml(c,b){
  var pm=c.settings.payment||{};
  if(!pm.show) return null;
  var rows=[["Ngân hàng",pm.bank],["Số tài khoản",pm.account],["Chủ tài khoản",pm.holder],["Nội dung chuyển khoản",pm.memo]].filter(function(r){return has(r[1]);});
  return '<div class="pay">'+(has(pm.qr)?'<img src="'+esc(pm.qr)+'" alt="Mã QR chuyển khoản cho '+esc(c.settings.brandName)+'" loading="lazy">':'')+
    '<div><ul class="contact-list">'+rows.map(function(r){return '<li><span><small>'+esc(r[0])+'</small><b>'+esc(r[1])+'</b></span></li>';}).join("")+'</ul>'+
    (has(pm.note)?'<p style="margin-top:14px">'+esc(pm.note)+'</p>':'')+'</div></div>';
}
function compareHtml(b){
  var rows=(b.rows||[]).filter(function(r){return has(r.label);});
  if(!rows.length) return "";
  var hd=b.headers||["","",""];
  return '<div style="overflow-x:auto"><table class="cmp"><thead><tr>'+hd.map(function(h){return '<th scope="col">'+esc(h)+'</th>';}).join("")+'</tr></thead><tbody>'+
    rows.map(function(r){return '<tr><th scope="row">'+esc(r.label)+'</th><td>'+esc(r.a)+'</td><td>'+esc(r.b)+'</td></tr>';}).join("")+'</tbody></table></div>'+
    (has(b.note)?'<p class="cmp-note">'+esc(b.note)+'</p>':'');
}
function renderBlock(c,pg,b,idx){
  if(!b||b.hidden) return "";
  var inner="", t=b.type, narrow=false;
  switch(t){
    case "text": narrow=!b.wide; inner=blockHead({title:b.title})+(has(b.html)?'<div class="rich">'+b.html+'</div>':'')+buttons(c,b.buttons); break;
    case "split": inner='<div class="split'+(b.reverse?' rev':'')+'"><div>'+blockHead({title:b.title})+'<div class="rich">'+(b.html||"")+'</div>'+buttons(c,b.buttons)+'</div><div class="split-media">'+figure(b.image)+'</div></div>'; break;
    case "cards": inner=blockHead(b)+cardsHtml(b.items,b.cols); break;
    case "products": inner=blockHead(b)+productCards(c,b); break;
    case "services": inner=blockHead(b)+serviceCards(c,b); break;
    case "flow": inner=blockHead(b)+'<ol class="flow">'+(b.items||[]).map(function(x,i){return '<li><span class="fn">'+(i+1)+'</span><span><b>'+esc(x.title)+'</b><span>'+esc(x.text)+'</span></span></li>';}).join("")+'</ol>'+(has(b.after)?'<p style="margin-top:18px;color:var(--ink-2)">'+esc(b.after)+'</p>':''); break;
    case "steps": inner=blockHead(b)+'<ol class="steps'+(b.cols?' cols':'')+'"'+(b.cols?' style="--n:'+(+b.cols)+'"':'')+'>'+(b.items||[]).map(function(x){return '<li><b>'+esc(x.title)+'</b><span>'+esc(x.text)+'</span></li>';}).join("")+'</ol>'+(has(b.after)?'<div class="rich" style="margin-top:16px">'+b.after+'</div>':''); break;
    case "faq": inner=blockHead(b)+'<div class="faq">'+(b.items||[]).filter(function(x){return has(x.q);}).map(function(x){return '<details><summary>'+esc(x.q)+'</summary><div class="ans rich">'+(/^\s*</.test(x.a||"")?x.a:'<p>'+esc(x.a)+'</p>')+'</div></details>';}).join("")+'</div>'; break;
    case "plans": inner=blockHead(b)+plansHtml(c,b); break;
    case "stories": inner=blockHead(b)+storiesHtml(c,b); break;
    case "posts": var ph=postsHtml(c,b); if(!ph) return ""; inner=blockHead(b)+ph; break;
    case "compare": var ch=compareHtml(b); if(!ch) return ""; inner=blockHead(b)+ch; break;
    case "media": inner=blockHead(b)+figure(b.image); break;
    case "video": if(!has(b.url)) return ""; inner=blockHead(b)+'<p>'+aOpen(b.url,"btn btn-outline")+icon("play")+esc(b.label||"Xem video")+'</a></p>'; break;
    case "contact": narrow=true; inner=blockHead(b)+contactHtml(c,b)+(has(b.html)?'<div class="rich" style="margin-top:18px">'+b.html+'</div>':''); break;
    case "payment": var pyh=paymentHtml(c,b); if(pyh===null) return ""; inner=blockHead(b)+pyh; break;
    case "cta": inner='<div class="cta-band"><div class="cta-txt"><h2>'+esc(b.title)+'</h2>'+(has(b.text)?'<p>'+esc(b.text)+'</p>':'')+'</div>'+buttons(c,b.buttons)+'</div>'; break;
    default: return "";
  }
  var tone=b.tone?' tone-'+esc(b.tone):'';
  return '<section class="blk blk-'+esc(t)+tone+'"'+(has(b.anchor)?' id="'+esc(b.anchor)+'"':'')+'><div class="wrap">'+(narrow?'<div class="nar">'+inner+'</div>':inner)+'</div></section>';
}

/* ---------------- Trang thường (trang chủ, phần mềm, đồng hành…) ---------------- */
function faqLd(blocks){
  var qs=[];
  (blocks||[]).forEach(function(b){ if(b.type==="faq"&&!b.hidden) (b.items||[]).forEach(function(x){ if(has(x.q)&&has(x.a)) qs.push({"@type":"Question",name:x.q,acceptedAnswer:{"@type":"Answer",text:txt(x.a)}}); }); });
  return qs.length?{"@type":"FAQPage",mainEntity:qs}:null;
}
function renderPage(c,pg){
  var isHome=!pg.path, url=absUrl(c,pg.path), s=c.settings;
  var seo=pg.seo||{};
  var title=has(seo.title)?seo.title:((pg.hero&&pg.hero.h1)||pg.title)+" | "+s.brandName;
  var desc=has(seo.desc)?seo.desc:((pg.hero&&pg.hero.sub)||"");
  var graph=[orgNode(c)];
  if(isHome) graph.push({"@type":"WebSite","@id":site(c)+"#website",url:site(c),name:s.brandName,inLanguage:"vi-VN",publisher:{"@id":site(c)+"#huydata"}});
  else graph.push(crumbsLd(c,pg));
  graph.push({"@type":"WebPage","@id":url+"#webpage",url:url,name:title,description:desc,inLanguage:"vi-VN",isPartOf:{"@id":site(c)+"#website"}});
  if(pg.kind==="product"){
    var k=pg.card||{};
    graph.push({"@type":"SoftwareApplication",name:k.name||pg.title,applicationCategory:"BusinessApplication",operatingSystem:k.os||k.platform||undefined,
      description:desc,url:url,image:(pg.hero&&pg.hero.image&&has(pg.hero.image.src))?absUrl(c,pg.hero.image.src):undefined,publisher:{"@id":site(c)+"#huydata"}});
  }
  var fq=faqLd(pg.blocks); if(fq) graph.push(fq);
  var body=hero(c,pg,isHome?"":crumbsHtml(c,pg))+(pg.blocks||[]).map(function(b,i){return renderBlock(c,pg,b,i);}).join("\n");
  return layout(c,{title:title,desc:desc,canonical:url,home:isHome,cur:pageHref(pg),image:seo.image||s.ogImage||"",
    ld:{"@context":"https://schema.org","@graph":graph},body:body});
}

/* ---------------- Bài viết ---------------- */
function prepBody(html){
  var n=0, toc=[];
  html=String(html||"").replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi,function(m,attr,inner){
    n++; var id="muc-"+n; toc.push({id:id,t:txt(inner)});
    attr=String(attr||"").replace(/\sid="[^"]*"/i,"");
    return '<h2 id="'+id+'"'+attr+'>'+inner+'</h2>';
  });
  var first=true;
  html=html.replace(/<img\b([^>]*)>/gi,function(m,attr){
    if(!/\salt=/i.test(attr)) attr+=' alt=""';
    if(!/\sloading=/i.test(attr)&&!first) attr+=' loading="lazy"';
    if(!/\sdecoding=/i.test(attr)) attr+=' decoding="async"';
    first=false; return '<img'+attr+'>';
  });
  html=html.replace(/<a\s+href="(https?:\/\/[^"]+)"(?![^>]*target=)/gi,function(m,h){ return isExt(h)?'<a href="'+h+'" target="_blank" rel="noopener"':m; });
  return {html:html,toc:toc};
}
/* ---------------- Kiến thức: chuyên mục, đối tượng ---------------- */
function cats(c){ return ((c.blog&&c.blog.categories)||[]).filter(function(x){return has(x.slug);}); }
function catOf(c,slug){ return cats(c).filter(function(x){return x.slug===slug;})[0]||null; }
function audOf(c,slug){ return (((c.blog&&c.blog.audiences)||[]).filter(function(x){return x.slug===slug;})[0])||null; }
function catHref(slug){ return "/bai-viet/chuyen-muc/"+slug+"/"; }
function postsIn(c,slug){ var l=pubPosts(c).filter(function(p){return p.category===slug;}); return l.filter(function(p){return p.pillar;}).concat(l.filter(function(p){return !p.pillar;})); }
function liveCats(c){ return cats(c).filter(function(x){return postsIn(c,x.slug).length>0;}); }
function pillars(c){ return pubPosts(c).filter(function(p){return p.pillar;}); }
function pillarOf(c,p){ if(p.pillar) return null; return pillars(c).filter(function(x){return x.category===p.category;})[0]||null; }
function pillarCards(c,list){
  return '<div class="pillars">'+list.map(function(p){ var k=catOf(c,p.category);
    return '<a class="pillar" href="'+esc(postHref(p))+'"><span class="pl-k">'+icon("book")+'Cẩm nang'+(k?' · '+esc(k.name):'')+'</span><b>'+esc(p.title)+'</b><span class="pl-d">'+esc(p.excerpt||"")+'</span><span class="pl-go">Đọc cẩm nang '+icon("arrow")+'</span></a>';
  }).join("")+'</div>';
}
function blogName(c){ return (c.blog&&c.blog.navName)||"Kiến thức"; }
function postTags(c,p,linkCat){
  var k=catOf(c,p.category), h="";
  if(k) h+=linkCat?'<a class="tag tag-cat" href="'+esc(catHref(k.slug))+'">'+esc(k.name)+'</a>':'<span class="tag tag-cat">'+esc(k.name)+'</span>';
  (p.audience||[]).forEach(function(a){ var x=audOf(c,a); if(x) h+='<span class="tag tag-aud">'+esc(x.name)+'</span>'; });
  return h;
}
function searchText(c,p){ var k=catOf(c,p.category); return (p.title+" "+(p.excerpt||"")+" "+(k?k.name:"")).toLowerCase(); }
function postCard(p,c,big){
  return '<article class="card pcard-post'+(big?' big':'')+'" data-q="'+esc(searchText(c,p))+'" data-aud="'+esc((p.audience||[]).join(" "))+'">'+
    (p.cover&&has(p.cover)?'<a class="card-img cv'+(p.coverFit==="contain"?' contain':'')+'" href="'+esc(postHref(p))+'" tabindex="-1" aria-hidden="true"><img src="'+esc(p.cover)+'" alt="" loading="lazy" decoding="async"></a>':'')+
    '<div class="pc-body"><div class="meta">'+(p.pillar?'<span class="tag tag-pillar">Cẩm nang</span>':'')+postTags(c,p,false)+'</div>'+
    '<h3><a href="'+esc(postHref(p))+'">'+esc(p.title)+'</a></h3><p>'+esc(p.excerpt||"")+'</p>'+
    '<p class="pc-date"><time datetime="'+esc(p.updated||p.date)+'">'+(has(p.updated)&&p.updated>p.date?"Cập nhật "+esc(fmtDate(p.updated)):esc(fmtDate(p.date)))+'</time> · '+readMinutes(p.body)+' phút đọc</p></div></article>';
}
function cardsOf(c,list,big){ return list.map(function(p,i){ return postCard(p,c,big&&i===0); }).join(""); }
function catChips(c,cur){
  var all=pubPosts(c).length;
  return '<nav class="kt-chips" aria-label="Chuyên mục"><a class="chip'+(!cur?' on':'')+'" href="/bai-viet/"'+(!cur?' aria-current="page"':'')+'>Tất cả <span>'+all+'</span></a>'+
    liveCats(c).map(function(k){ var on=cur===k.slug; return '<a class="chip'+(on?' on':'')+'" href="'+esc(catHref(k.slug))+'"'+(on?' aria-current="page"':'')+'>'+esc(k.name)+' <span>'+postsIn(c,k.slug).length+'</span></a>'; }).join("")+'</nav>';
}
function audChips(c){
  var a=(c.blog&&c.blog.audiences)||[]; if(!a.length) return "";
  return '<div class="kt-aud" data-aud-filter hidden><span>Dành cho:</span><button type="button" class="chip on" data-aud="">Tất cả</button>'+
    a.map(function(x){ return '<button type="button" class="chip" data-aud="'+esc(x.slug)+'">'+esc(x.name)+'</button>'; }).join("")+'</div>';
}
function ktSearch(){ return '<div class="kt-search" data-kt-search hidden><label class="sr" for="kt-q">Tìm bài viết</label>'+icon("search")+'<input id="kt-q" type="search" placeholder="Tìm bài: hóa đơn, sổ doanh thu, thuế khoán…" autocomplete="off"></div>'; }
function ktHero(c,crumbs,eyebrow,h1,sub){
  return '<section class="hero kt-hero">'+crumbs+'<div class="wrap"><p class="eyebrow">'+esc(eyebrow)+'</p><h1>'+esc(h1)+'</h1>'+(has(sub)?'<p class="lead">'+esc(sub)+'</p>':'')+'</div></section>';
}
function ktCrumbs(trail){
  return '<nav class="wrap bc" aria-label="Đường dẫn">'+trail.map(function(x){ return x.h?'<a href="'+esc(x.h)+'">'+esc(x.t)+'</a>':'<span aria-current="page">'+esc(x.t)+'</span>'; }).join('<span aria-hidden="true">›</span>')+'</nav>';
}
function ktCrumbsLd(c,trail){ return {"@type":"BreadcrumbList","itemListElement":trail.map(function(x,i){ return {"@type":"ListItem",position:i+1,name:x.t,item:x.h?absUrl(c,x.h):undefined}; })}; }

/* ---------------- Trang một bài ---------------- */
function renderPost(c,p){
  var s=c.settings, url=absUrl(c,"bai-viet/"+p.slug+"/"), pb=prepBody(p.body), k=catOf(c,p.category);
  var desc=(has(p.metaDesc)?p.metaDesc:(p.excerpt||txt(p.body).slice(0,155))).trim();
  var modified=(has(p.updated)&&p.updated>(p.date||""))?p.updated:"";
  var title=(has(p.metaTitle)?p.metaTitle:p.title);
  if(title.indexOf(s.brandName)<0 && title.length<52) title+=" | "+s.brandName;
  var toc=pb.toc.length>=3?'<nav class="toc" aria-label="Mục lục"><b>Trong bài này</b><ol>'+pb.toc.map(function(x){return '<li><a href="#'+x.id+'">'+esc(x.t)+'</a></li>';}).join("")+'</ol></nav>':'';
  var facts=(p.facts||[]).filter(function(f){return has(f.k)&&has(f.v);});
  var factsBox=facts.length?'<aside class="facts" aria-label="Thông tin chính"><b>Thông tin chính</b><dl>'+facts.map(function(f){return '<dt>'+esc(f.k)+'</dt><dd>'+esc(f.v)+'</dd>';}).join("")+'</dl></aside>':'';
  var srcs=(p.sources||[]).filter(function(x){return has(x.t);});
  var srcBox=srcs.length?'<section class="sources"><h2 class="sr-h">Căn cứ và nguồn chính thức</h2><ul>'+srcs.map(function(x){ return '<li>'+(has(x.u)?aOpen(x.u)+esc(x.t)+'</a>':esc(x.t))+'</li>'; }).join("")+'</ul></section>':'';
  var note=has(p.note)?p.note:((k&&k.disclaimer)?(c.blog.disclaimer||""):"");
  var noteBox=has(note)?'<p class="disclaim">'+esc(note)+'</p>':'';
  var others=pubPosts(c).filter(function(x){return x.slug!==p.slug;});
  var rel=others.filter(function(x){return x.category===p.category;}).concat(others.filter(function(x){return x.category!==p.category;})).slice(0,3);
  var prod=has(p.product)?pageById(c,p.product):null;
  var prodBox=prod&&prod.enabled!==false?'<aside class="card rel-prod"><p class="meta" style="margin:0 0 6px">'+(prod.kind==="service"?"Dịch vụ từ HuyData":"Công cụ hỗ trợ từ HuyData")+'</p><h3 style="margin-bottom:6px"><a href="'+esc(pageHref(prod))+'" style="color:inherit">'+esc((prod.card&&prod.card.name)||prod.title)+'</a></h3><p>'+esc((prod.card&&prod.card.line)||"")+'</p>'+
    '<div class="actions"><a class="btn btn-outline" href="'+esc(pageHref(prod))+'">Tìm hiểu '+esc((prod.card&&prod.card.name)||prod.title)+'</a></div></aside>':'';
  var au=c.about||{};
  var author=has(au.name)?'<aside class="author" aria-label="Người viết"><div class="au-mark">'+esc(String(au.name).trim().split(/\s+/).pop().charAt(0))+'</div><div><b>'+esc(au.name)+'</b><p>'+esc(au.line||"")+' <a href="/gioi-thieu/">Về HuyData</a></p></div></aside>':'';
  var share='<div class="share"><span>Bài viết hữu ích? Anh chị có thể chia sẻ cho người quen:</span>'+aOpen("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url+"?utm_source=facebook&utm_medium=chia-se&utm_campaign=bai-viet"),"sbtn")+'Chia sẻ Facebook</a><button class="sbtn" type="button" data-copy="'+esc(url+"?utm_source=zalo&utm_medium=chia-se&utm_campaign=bai-viet")+'" hidden>Sao chép link (dán vào Zalo)</button></div>';
  var cta='<div class="cta-band" style="margin-top:28px"><div class="cta-txt"><h2>'+esc(s.postCtaTitle||"Anh chị cần hỗ trợ thêm?")+'</h2><p>'+esc(s.postCta||"Anh chị cứ nhắn Zalo, HuyData sẵn lòng giải đáp.")+'</p></div><div class="btn-row">'+aOpen(zaloUrl(c),"btn btn-zalo")+ZALO+'Nhắn Zalo cho HuyData</a></div></div>';
  var relHtml=rel.length?'<section class="blk" style="padding-top:20px"><div class="wrap"><h2>Bài viết liên quan</h2><div class="post-list three">'+cardsOf(c,rel)+'</div></div></section>':'';
  var trail=[{t:"Trang chủ",h:"/"},{t:blogName(c),h:"/bai-viet/"}]; if(k) trail.push({t:k.name,h:catHref(k.slug)});
  var graph=[orgNode(c),
    {"@type":"Article","@id":url+"#article",headline:String(p.title).slice(0,110),description:desc,datePublished:p.date||undefined,dateModified:(modified||p.date)||undefined,inLanguage:"vi-VN",
     articleSection:k?k.name:undefined,
     author:{"@type":"Person",name:au.name||s.brandName,url:site(c)+"gioi-thieu/"},publisher:{"@id":site(c)+"#huydata"},mainEntityOfPage:{"@type":"WebPage","@id":url},
     image:absUrl(c,has(p.cover)?p.cover:(s.ogImage||""))||undefined},
    ktCrumbsLd(c,trail.concat([{t:p.title,h:"/bai-viet/"+p.slug+"/"}]))];
  var body='<div class="wrap narrow">'+ktCrumbs(trail).replace('class="wrap bc"','class="bc"')+'</div>'+
    '<article class="wrap narrow article">'+
      '<p class="a-meta">'+(p.pillar?'<span class="tag tag-pillar">Cẩm nang</span>':'')+postTags(c,p,true)+'</p>'+
      '<h1>'+esc(p.title)+'</h1>'+(has(p.excerpt)?'<p class="a-lead">'+esc(p.excerpt)+'</p>':'')+
      '<p class="a-meta">Đăng <time datetime="'+esc(p.date||"")+'">'+esc(fmtDate(p.date))+'</time>'+(modified?' · Cập nhật <time datetime="'+esc(modified)+'">'+esc(fmtDate(modified))+'</time>':'')+' · '+readMinutes(p.body)+' phút đọc</p>'+
      factsBox+
      (pillarOf(c,p)?'<p class="in-pillar">Bài này thuộc cụm '+esc((catOf(c,p.category)||{}).name||"")+'. Đọc tổng quan tại <a href="'+esc(postHref(pillarOf(c,p)))+'">'+esc(pillarOf(c,p).title)+'</a>.</p>':'')+
      (has(p.cover)?'<img class="a-cover'+(p.coverFit==="contain"?' contain':'')+'" src="'+esc(p.cover)+'" alt="'+esc(p.coverAlt||p.title)+'" fetchpriority="high" decoding="async">':'')+
      toc+'<div class="prose rich">'+pb.html+'</div>'+srcBox+noteBox+prodBox+share+author+cta+
    '</article>'+relHtml;
  return layout(c,{title:title,desc:desc,canonical:url,article:true,published:p.date,modified:modified,cur:"/bai-viet/",image:has(p.cover)?p.cover:"",
    ld:{"@context":"https://schema.org","@graph":graph},body:body});
}

/* ---------------- Trang Kiến thức ---------------- */
function renderBlogIndex(c){
  var b=c.blog||{}, s=c.settings, url=absUrl(c,"bai-viet/"), list=pubPosts(c);
  var trail=[{t:"Trang chủ",h:"/"},{t:blogName(c),h:null}];
  var latest=list.filter(function(p){return !p.pillar;}).slice(0,3);
  var secs=liveCats(c).map(function(k){
    var ps=postsIn(c,k.slug);
    return '<section class="kt-sec"><div class="kt-sec-h"><div><h2>'+esc(k.name)+'</h2>'+(has(k.desc)?'<p>'+esc(k.desc)+'</p>':'')+'</div>'+
      (ps.length>3?'<a class="btn btn-outline" href="'+esc(catHref(k.slug))+'">Xem tất cả '+ps.length+' bài</a>':'<a class="kt-more" href="'+esc(catHref(k.slug))+'">Xem chuyên mục →</a>')+'</div>'+
      '<div class="post-list three">'+cardsOf(c,ps.slice(0,3))+'</div></section>';
  }).join("");
  var noCat=list.filter(function(p){return !catOf(c,p.category);});
  if(noCat.length) secs+='<section class="kt-sec"><div class="kt-sec-h"><div><h2>Bài viết khác</h2></div></div><div class="post-list three">'+cardsOf(c,noCat)+'</div></section>';
  var body=ktHero(c,ktCrumbs(trail),b.eyebrow||"Kiến thức",b.title||"Kiến thức",b.intro)+
    '<section class="blk kt" style="padding-top:8px"><div class="wrap">'+ktSearch()+catChips(c,"")+audChips(c)+
      '<div class="kt-results" data-kt-results hidden><h2 class="kt-rh">Kết quả</h2><p class="kt-empty" hidden>Chưa có bài phù hợp. Anh chị thử từ khóa khác, hoặc nhắn Zalo để HuyData giải đáp.</p><div class="post-list three">'+cardsOf(c,list)+'</div></div>'+
      '<div data-kt-main>'+
        (pillars(c).length?'<section class="kt-sec"><div class="kt-sec-h"><div><h2>Cẩm nang trọng tâm</h2><p>Bắt đầu từ đây: mỗi cẩm nang tổng hợp trọn một chủ đề và dẫn tới các bài chi tiết.</p></div></div>'+pillarCards(c,pillars(c))+'</section>':'')+
        (list.length>6?'<section class="kt-sec"><div class="kt-sec-h"><div><h2>Mới cập nhật</h2></div></div><div class="kt-latest">'+cardsOf(c,latest,true)+'</div></section>':(list.length?'':'<p>Chưa có bài viết.</p>'))+
        secs+
      '</div></div></section>';
  var graph=[orgNode(c),ktCrumbsLd(c,[{t:"Trang chủ",h:"/"},{t:blogName(c),h:"/bai-viet/"}]),{"@type":"CollectionPage",url:url,name:b.title,description:b.intro,inLanguage:"vi-VN",
    hasPart:list.map(function(p){return {"@type":"Article",headline:p.title,url:absUrl(c,"bai-viet/"+p.slug+"/")};})}];
  return layout(c,{title:(b.seoTitle||((b.title||"Kiến thức")+" | "+s.brandName)),desc:b.seoDesc||b.intro||"",canonical:url,cur:"/bai-viet/",image:b.image||"",ld:{"@context":"https://schema.org","@graph":graph},body:body});
}
function renderCategory(c,k){
  var s=c.settings, url=absUrl(c,"bai-viet/chuyen-muc/"+k.slug+"/"), list=postsIn(c,k.slug);
  var trail=[{t:"Trang chủ",h:"/"},{t:blogName(c),h:"/bai-viet/"},{t:k.name,h:null}];
  var body=ktHero(c,ktCrumbs(trail),blogName(c),k.name,k.desc)+
    '<section class="blk kt" style="padding-top:8px"><div class="wrap">'+catChips(c,k.slug)+
      '<div class="post-list three">'+cardsOf(c,list)+'</div></div></section>';
  var graph=[orgNode(c),ktCrumbsLd(c,[{t:"Trang chủ",h:"/"},{t:blogName(c),h:"/bai-viet/"},{t:k.name,h:"/bai-viet/chuyen-muc/"+k.slug+"/"}]),
    {"@type":"CollectionPage",url:url,name:k.name,description:k.desc,inLanguage:"vi-VN",hasPart:list.map(function(p){return {"@type":"Article",headline:p.title,url:absUrl(c,"bai-viet/"+p.slug+"/")};})}];
  return layout(c,{title:(k.seoTitle||(k.name+" | "+blogName(c)+" "+s.brandName)),desc:k.seoDesc||k.desc||"",canonical:url,cur:"/bai-viet/",image:k.image||c.blog.image||"",ld:{"@context":"https://schema.org","@graph":graph},body:body});
}

/* ---------------- Văn bản ---------------- */
function renderDocsIndex(c){
  var d=c.docs||{}, s=c.settings, url=absUrl(c,"van-ban/"), list=pubDocs(c);
  var pg={title:d.title||"Văn bản",navTitle:"Văn bản",path:"van-ban/",hero:{eyebrow:d.eyebrow,h1:d.title||"Văn bản",sub:d.intro}};
  var body=hero(c,pg,crumbsHtml(c,pg))+'<section class="blk" style="padding-top:12px"><div class="wrap"><div class="doc-list">'+
    list.map(function(x){return '<a href="/van-ban/'+esc(x.slug)+'/"><b>'+esc(x.title)+'</b><span>'+esc(x.excerpt||"")+'</span></a>';}).join("")+'</div></div></section>';
  return layout(c,{title:(d.seoTitle||((d.title||"Văn bản")+" | "+s.brandName)),desc:d.seoDesc||d.intro||"",canonical:url,cur:"/van-ban/",image:d.image||"",
    ld:{"@context":"https://schema.org","@graph":[orgNode(c),crumbsLd(c,pg)]},body:body});
}
/* Bọc file HTML văn bản do người dùng tải lên: thêm canonical/mô tả + nút "Về HuyData". */
function wrapDoc(c,d,raw){
  var url=absUrl(c,"van-ban/"+d.slug+"/");
  var bar='<!--hd:bar--><a href="/van-ban/" style="position:fixed;left:14px;bottom:14px;z-index:2147483647;font:600 14px/1 system-ui,-apple-system,Segoe UI,sans-serif;background:#102A1D;color:#2DD4A8;text-decoration:none;padding:12px 16px;border-radius:999px;box-shadow:0 6px 18px rgba(0,0,0,.22)">← Về HuyData</a><!--/hd:bar-->';
  var meta='<!--hd:meta-->\n<link rel="canonical" href="'+esc(url)+'">\n<link rel="icon" href="/favicon.svg">\n<meta property="og:title" content="'+esc(d.title)+'">\n<meta property="og:url" content="'+esc(url)+'">\n'+
    (has(d.excerpt)?'<meta name="description" content="'+esc(d.excerpt)+'">\n':'')+'<!--/hd:meta-->\n';
  raw=String(raw||"");
  if(/<html[\s>]/i.test(raw)){
    var out=raw;
    out=/<head[^>]*>/i.test(out)?out.replace(/<head([^>]*)>/i,function(m){return m+"\n"+meta;}):out.replace(/<html([^>]*)>/i,function(m){return m+"\n<head>\n"+meta+"</head>";});
    out=/<body[^>]*>/i.test(out)?out.replace(/<body([^>]*)>/i,function(m){return m+"\n"+bar;}):bar+out;
    return out;
  }
  return '<!DOCTYPE html>\n<html lang="vi"><head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>'+esc(d.title)+'</title>\n'+meta+'</head>\n<body>\n'+bar+'\n<!--hd:raw-->\n'+raw+'\n<!--/hd:raw-->\n</body></html>\n';
}

/* ---------------- 404 & chuyển hướng ---------------- */
function render404(c){
  var body='<section class="wrap nf"><h1>Không tìm thấy trang</h1><p>Rất tiếc, trang anh chị đang tìm không còn ở địa chỉ này. Anh chị có thể quay về trang chủ hoặc xem các mục bên dưới.</p>'+
    '<div class="btn-row"><a class="btn btn-primary" href="/">Về trang chủ</a><a class="btn btn-outline" href="/phan-mem/">Xem phần mềm</a><a class="btn btn-outline" href="/bai-viet/">Xem bài viết</a></div></section>';
  return layout(c,{title:"Không tìm thấy trang | "+c.settings.brandName,desc:"Trang này không còn tồn tại.",canonical:site(c),noindex:true,body:body});
}
function renderRedirect(c,r){
  var to=absUrl(c,r.to);
  return '<!DOCTYPE html>\n<html lang="vi"><head>\n<meta charset="UTF-8">\n<title>Trang đã chuyển — '+esc(c.settings.brandName)+'</title>\n'+
    '<link rel="canonical" href="'+esc(to)+'">\n<meta name="robots" content="noindex,follow">\n<meta http-equiv="refresh" content="0; url='+esc(r.to)+'">\n</head>\n'+
    '<body style="font-family:system-ui,sans-serif;padding:32px;font-size:18px">\n<p>Trang này đã chuyển sang địa chỉ mới: <a href="'+esc(r.to)+'">'+esc(to)+'</a></p>\n</body></html>\n';
}

/* ---------------- Sitemap, robots ---------------- */
function sitemap(c){
  var t=today(), u=site(c), urls=[];
  function lm(x){ var d=[x&&x.updated,x&&x.date].filter(function(v){return /^\d{4}-\d{2}-\d{2}$/.test(String(v||""));}).sort().pop(); return (d&&d<=t)?d:t; }
  pages(c).forEach(function(p){ urls.push({loc:absUrl(c,p.path),lm:lm(p),pri:p.path?(p.kind==="product"?"0.9":"0.8"):"1.0"}); });
  var posts=pubPosts(c);
  if(posts.length){ urls.push({loc:u+"bai-viet/",lm:lm(posts[0]),pri:"0.7"}); liveCats(c).forEach(function(k){ urls.push({loc:u+"bai-viet/chuyen-muc/"+k.slug+"/",lm:lm(postsIn(c,k.slug)[0]),pri:"0.6"}); }); posts.forEach(function(p){ urls.push({loc:absUrl(c,"bai-viet/"+p.slug+"/"),lm:lm(p),pri:"0.7"}); }); }
  var docs=pubDocs(c);
  if(docs.length){ urls.push({loc:u+"van-ban/",lm:t,pri:"0.5"}); docs.forEach(function(d){ urls.push({loc:absUrl(c,"van-ban/"+d.slug+"/"),lm:lm(d),pri:"0.5"}); }); }
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
    urls.map(function(x){return "  <url><loc>"+esc(x.loc)+"</loc><lastmod>"+x.lm+"</lastmod><priority>"+x.pri+"</priority></url>";}).join("\n")+"\n</urlset>\n";
}
function robots(c){ return "User-agent: *\nAllow: /\nDisallow: /quan-tri/\nDisallow: /_old/\n\nSitemap: "+site(c)+"sitemap.xml\n"; }

/* ---------------- Dựng cả site ---------------- */
/* opts.docRaw(slug) → chuỗi HTML gốc của văn bản mới tải lên (nếu có). Văn bản không có raw thì GIỮ NGUYÊN file đang có trên web. */
function build(c,opts){
  opts=opts||{};
  var files=[];
  pages(c).forEach(function(p){ files.push({name:(p.path||"")+"index.html",data:renderPage(c,p)}); });
  files.push({name:"bai-viet/index.html",data:renderBlogIndex(c)});
  pubPosts(c).forEach(function(p){ files.push({name:"bai-viet/"+p.slug+"/index.html",data:renderPost(c,p)}); });
  liveCats(c).forEach(function(k){ files.push({name:"bai-viet/chuyen-muc/"+k.slug+"/index.html",data:renderCategory(c,k)}); });
  if(pubDocs(c).length) files.push({name:"van-ban/index.html",data:renderDocsIndex(c)});
  pubDocs(c).forEach(function(d){ var raw=opts.docRaw?opts.docRaw(d.slug):""; if(has(raw)) files.push({name:"van-ban/"+d.slug+"/index.html",data:wrapDoc(c,d,raw)}); });
  (c.redirects||[]).forEach(function(r){ if(has(r.from)&&has(r.to)) files.push({name:String(r.from).replace(/^\/+/,"").replace(/\/?$/,"/")+"index.html",data:renderRedirect(c,r)}); });
  files.push({name:"404.html",data:render404(c)});
  files.push({name:"sitemap.xml",data:sitemap(c)});
  files.push({name:"robots.txt",data:robots(c)});
  files.push({name:"noi-dung.json",data:JSON.stringify(c,null,1)+"\n"});
  return files;
}

var HD={VERSION:VERSION,build:build,renderPage:renderPage,renderPost:renderPost,renderBlogIndex:renderBlogIndex,renderCategory:renderCategory,cats:cats,services:services,renderDocsIndex:renderDocsIndex,
  wrapDoc:wrapDoc,render404:render404,sitemap:sitemap,slugify:slugify,esc:esc,txt:txt,fmtDate:fmtDate,icon:icon,ICONS:Object.keys(P),
  pageHref:pageHref,postHref:postHref,products:products,pubPosts:pubPosts,absUrl:absUrl,LOGO:LOGO,ZALO:ZALO,
  BLOCK_TYPES:["text","split","cards","products","services","flow","steps","faq","plans","stories","posts","compare","media","video","contact","payment","cta"]};
if(typeof module!=="undefined"&&module.exports) module.exports=HD; else root.HD=HD;
})(typeof self!=="undefined"?self:this);
