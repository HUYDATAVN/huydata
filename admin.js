/* HuyData — phần QUẢN TRỊ (soạn nội dung, xuất bản). Trang chủ chỉ tải file này khi mở quản trị.
   File này do Claude cập nhật; bảng quản trị KHÔNG tự ghi đè file này khi đăng. */
"use strict";
async function sha256(str){
  var buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(str));
  return Array.prototype.map.call(new Uint8Array(buf),function(b){return b.toString(16).padStart(2,"0");}).join("");
}
function showPin(){ if(!$("#pinmodal")) return; $("#pinmodal").classList.add("open"); $("#pinerr").textContent=""; $("#pininput").value=""; setTimeout(function(){$("#pininput").focus();},50); }
on("#pincancel","click",function(){ $("#pinmodal").classList.remove("open"); if(location.hash==="#quan-tri") location.hash=""; });
on("#pinok","click",tryPin);
on("#pininput","keydown",function(e){if(e.key==="Enter")tryPin();});
async function tryPin(){
  var h=await sha256($("#pininput").value);
  if(h===content.settings.pinHash){ unlocked=true; $("#pinmodal").classList.remove("open"); openAdmin(); }
  else { $("#pinerr").textContent="Mã PIN chưa đúng. Thử lại nhé."; $("#pininput").select(); }
}

/* Menu quản trị: gom theo 3 nhóm cho khớp cấu trúc v5.
   Nhóm "Danh mục sản phẩm" liệt kê từng khu vực catalog (Giải pháp / Công cụ /
   Văn bản / khu vực tự thêm) thành mục riêng — mở thẳng, không phải chọn trong 1 tab. */
function tabList(){
  var arr=[{head:"Danh mục sản phẩm"}];
  (catRoot().sections||[]).forEach(function(s){
    if(s.kind==="article") return;               /* Kiến thức có tab "bài viết" riêng */
    arr.push({id:"cat:"+s.id,label:s.label||s.id});
  });
  arr.push({id:"blog",label:"Kiến thức (bài viết)"});
  arr.push({id:"hub",label:"Dải “Khám phá” (trang chủ)"});
  arr.push({addsec:true,label:"＋ Thêm khu vực mới"});
  arr.push(
    {head:"Trang chủ & trang bán hàng"},
    {id:"layout",label:"Bố cục & thứ tự khối"},
    {id:"hero",label:"Đầu trang (Hero)"},
    {id:"pain",label:"Bối cảnh & Vì sao"},
    {id:"solutions",label:"Khối “Giải pháp” (bán hàng)"},
    {id:"decision",label:"Tầm nhìn & Chân dung KH"},
    {id:"stories",label:"Khách hàng thật"},
    {id:"process",label:"Quy trình"},
    {id:"ctv",label:"Cộng tác viên"},
    {id:"more",label:"HuyData còn làm gì"},
    {id:"privacy",label:"Riêng tư & Giới thiệu"},
    {id:"pricing",label:"Bảng giá & Bản quyền"},
    {id:"faq",label:"Hỏi đáp (FAQ)"}
  );
  arr.push(
    {head:"Cài đặt chung"},
    {id:"brand",label:"Thương hiệu & Liên hệ"},
    {id:"seo",label:"SEO & Chia sẻ"},
    {id:"pin",label:"Đổi mã PIN"}
  );
  return arr;
}
var curTab="layout";
function openAdmin(){ if(!unlocked){ showPin(); return; } buildAdmin(); $("#admin").classList.add("open"); document.body.style.overflow="hidden"; }
function closeAdmin(){ $("#admin").classList.remove("open"); document.body.style.overflow=""; if(location.hash==="#quan-tri")location.hash=""; }
function buildAdmin(){
  var draft=lsGet(DRAFT_KEY), hasDraft=false, draftInfo="";
  if(draft){ try{var dj=JSON.parse(draft); if(JSON.stringify(dj.c)!==JSON.stringify(content)){hasDraft=true; draftInfo=new Date(dj.t).toLocaleString("vi-VN");}}catch(e){} }
  var top='<div class="admin-top"><span class="at-title">'+LOGO+' Quản trị nội dung</span>'+
    (hasDraft?'<button class="abtn" id="a-restore" title="Bản nháp lúc '+esc(draftInfo)+'"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg> Khôi phục nháp</button>':'')+
    '<button class="abtn" id="a-import"><svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="M8 11l4 4 4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg> Nhập .json</button>'+
    '<button class="abtn" id="a-json"><svg viewBox="0 0 24 24"><path d="M12 21V9"/><path d="M8 13l4-4 4 4"/><path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/></svg> Xuất .json</button>'+
    '<button class="abtn primary" id="a-github"><svg viewBox="0 0 24 24"><path d="M12 13v8"/><path d="m8 17 4-4 4 4"/><path d="M20 16.7A5 5 0 0 0 18 7h-1.3A8 8 0 1 0 4 15"/></svg> Đăng lên GitHub</button>'+
    '<button class="abtn" id="a-github-cfg" title="Cấu hình chìa khóa GitHub"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>'+
    '<button class="abtn" id="a-zip"><svg viewBox="0 0 24 24"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg> Xuất .zip</button>'+
    '<button class="abtn" id="a-html"><svg viewBox="0 0 24 24"><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M8 21V9h8"/></svg> Xuất .html</button>'+
    '<button class="abtn" id="a-close"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg> Đóng</button></div>';
  var tabs='<div class="admin-tabs">'+tabList().map(function(t){
    if(t.head) return '<div class="admin-tab-head">'+esc(t.head)+'</div>';
    if(t.addsec) return '<button data-addsec="1" class="admin-addsec">'+esc(t.label)+'</button>';
    return '<button data-tab="'+t.id+'" class="'+(t.id===curTab?'active':'')+'">'+esc(t.label)+'</button>';
  }).join('')+'</div>';
  $("#admin").innerHTML=top+'<div class="admin-main">'+tabs+'<div class="admin-body" id="admin-body"></div></div>';
  $("#a-close").addEventListener("click",closeAdmin);
  $("#a-html").addEventListener("click",exportHTML);
  $("#a-json").addEventListener("click",exportJSON);
  $("#a-import").addEventListener("click",importJSON);
  $("#a-zip").addEventListener("click",publishSite);
  $("#a-github").addEventListener("click",ghPush);
  $("#a-github-cfg").addEventListener("click",openGitHubModal);
  if(hasDraft) $("#a-restore").addEventListener("click",function(){ try{content=deepMerge(clone(DEFAULT),JSON.parse(draft).c); renderAll(); buildAdmin(); toast("Đã khôi phục bản nháp");}catch(e){} });
  Array.prototype.forEach.call($("#admin").querySelectorAll(".admin-tabs button[data-tab]"),function(b){
    b.addEventListener("click",function(){ curTab=b.getAttribute("data-tab"); buildAdmin(); });
  });
  var asb=$("#admin").querySelector('.admin-tabs [data-addsec]');
  if(asb) asb.addEventListener("click",function(){
    var nm=prompt("Tên khu vực mới (vd: Khóa học):"); if(!nm)return;
    var id=uid("sec");
    catRoot().sections.push({id:id,label:nm,slug:catSlugify(nm),nav:true,kind:"page",enabled:true,eyebrow:nm,title:nm,intro:"",homeDesc:""});
    renderCatalogPanel.cur=id; curTab="cat:"+id; renderAll(); scheduleDraft(); buildAdmin();
  });
  renderPanel();
}

function fld(label,val,onInput,opt){
  opt=opt||{}; var id="f"+Math.random().toString(36).slice(2,8);
  var input = opt.textarea
    ? '<textarea id="'+id+'" rows="'+(opt.rows||3)+'">'+esc(val)+'</textarea>'
    : opt.select
      ? '<select id="'+id+'">'+opt.select.map(function(o){return '<option value="'+esc(o.v)+'"'+(o.v===val?' selected':'')+'>'+esc(o.t)+'</option>';}).join('')+'</select>'
      : '<input type="'+(opt.type||"text")+'" id="'+id+'" value="'+esc(val)+'"'+(opt.ph?' placeholder="'+esc(opt.ph)+'"':'')+'>';
  var el=document.createElement("div"); el.className="fld";
  el.innerHTML='<label>'+esc(label)+(opt.sub?' <span class="sub">— '+esc(opt.sub)+'</span>':'')+'</label>'+input;
  var inp=el.querySelector("#"+id);
  var ev=function(){ onInput(inp.value); scheduleSiteRender(); scheduleDraft(); };
  inp.addEventListener("input",ev);
  if(opt.select) inp.addEventListener("change",ev);
  return el;
}
/* Đếm ký tự cho ô SEO: xanh khi vừa, cam khi quá dài (Google sẽ cắt bớt) */
function withCounter(el,max,getVal){
  var c=document.createElement("div"); c.style.cssText="font-size:12px;margin-top:5px;color:var(--text-light)";
  function upd(){ var n=String(getVal()||"").trim().length; c.textContent=n+" / "+max+" ký tự"+(n>max?" — hơi dài, Google có thể cắt bớt":(n&&n<Math.round(max*0.45)?" — hơi ngắn":"")); c.style.color=n>max?"#B8860B":"var(--text-light)"; }
  var inp=el.querySelector("input,textarea"); if(inp) inp.addEventListener("input",function(){ setTimeout(upd,0); });
  el.appendChild(c); upd(); return el;
}
/* Bảng kiểm nhanh trước khi đăng bài — chỉ là gợi ý, không chặn đăng */
function seoChecklist(post,ed){
  var box=document.createElement("div");
  box.style.cssText="margin-top:14px;padding:14px 16px;border:1px solid var(--line);border-radius:12px;background:#fff;font-size:13px;line-height:1.8";
  function upd(){
    var links=Array.prototype.map.call(ed.querySelectorAll("a[href]"),function(a){return a.getAttribute("href");});
    var inner=links.filter(function(h){return !isExternalHref(h);}).length;
    var imgs=ed.querySelectorAll("img"), noAlt=Array.prototype.filter.call(imgs,function(i){return !String(i.getAttribute("alt")||"").trim();}).length;
    var words=stripTags(ed.innerHTML).split(/\s+/).filter(Boolean).length;
    var h2n=ed.querySelectorAll("h2").length;
    var desc=realVal(post.metaDesc)||post.excerpt||"";
    var rows=[
      [words>=600, "Độ dài bài: "+words+" chữ"+(words<600?" (nên từ 600 chữ trở lên cho bài kiến thức)":"")],
      [h2n>=2, "Tiêu đề mục (H2): "+h2n+(h2n<2?" — nên chia bài thành vài mục H2":" — đủ 3 mục sẽ tự có Mục lục")],
      [inner>=1, "Link nội bộ: "+inner+(inner<1?" — nên dẫn ít nhất 1 link sang trang dịch vụ hoặc bài liên quan (nút 🔗 Link)":"")],
      [noAlt===0, imgs.length?("Ảnh: "+imgs.length+(noAlt?" — "+noAlt+" ảnh chưa có mô tả (alt)":" — đều có mô tả")):"Ảnh: chưa có (không bắt buộc)"],
      [!!String(desc).trim(), "Mô tả trên Google: "+(String(desc).trim()?"đã có":"chưa có — điền Tóm tắt hoặc Mô tả SEO")]
    ];
    box.innerHTML='<b style="display:block;color:var(--green-deep);margin-bottom:4px">Kiểm tra nhanh trước khi đăng</b>'+
      rows.map(function(r){return '<div>'+(r[0]?'<span style="color:#1E824C">✓</span>':'<span style="color:#B8860B">•</span>')+' '+esc(r[1])+'</div>';}).join("");
  }
  ed.addEventListener("input",upd); ed.addEventListener("focusout",upd);
  var mo=new MutationObserver(function(){ clearTimeout(mo.t); mo.t=setTimeout(upd,250); }); mo.observe(ed,{childList:true,subtree:true,attributes:true});
  upd(); return box;
}
function h2(t){var e=document.createElement("h2");e.textContent=t;return e;}
function hint(t){var e=document.createElement("p");e.className="hint";e.innerHTML=t;return e;}
function iconOptions(){return Object.keys(ICONS).map(function(k){return {v:k,t:k};});}

function listEditor(title, arr, nameFn, fields, opt){
  opt=opt||{};
  var wrap=document.createElement("div");
  var head=document.createElement("h2"); head.textContent=title; head.style.fontSize="20px"; head.style.marginTop="24px"; wrap.appendChild(head);
  var list=document.createElement("div"); wrap.appendChild(list);
  function refresh(){
    list.innerHTML="";
    arr.forEach(function(item,idx){
      var card=document.createElement("div"); card.className="card-block";
      var actions='<div class="li-actions">'+
        '<button class="iconbtn" data-a="up" title="Lên"><svg viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg></button>'+
        '<button class="iconbtn" data-a="down" title="Xuống"><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>'+
        '<button class="iconbtn danger" data-a="del" title="Xóa"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg></button></div>';
      var hd=document.createElement("div"); hd.className="li-head";
      hd.innerHTML='<span class="li-name"><span class="dot"></span>'+esc(opt.simpleStrings?item:(nameFn(item)||"(mục)"))+'</span>'+actions;
      card.appendChild(hd);
      if(opt.simpleStrings){
        card.appendChild(fld("Nội dung",item,function(v){arr[idx]=v;}));
      } else {
        fields.forEach(function(f){
          if(f.lines){
            var lw=document.createElement("div");lw.className="fld";
            lw.innerHTML='<label>'+esc(f.l)+' <span class="sub">— mỗi dòng một ý</span></label><textarea rows="'+(f.rows||3)+'"></textarea>';
            var ta=lw.querySelector("textarea"); ta.value=(item[f.k]||[]).join("\n");
            ta.addEventListener("input",function(){ item[f.k]=ta.value.split("\n").map(function(x){return x.trim();}).filter(Boolean); renderAll(); scheduleDraft(); });
            card.appendChild(lw); return;
          }
          if(f.bool){
            var bw=document.createElement("div");bw.className="fld";
            bw.innerHTML='<label style="cursor:pointer"><input type="checkbox" style="width:auto;margin-right:8px;vertical-align:middle" '+(item[f.k]?"checked":"")+'>'+esc(f.l)+'</label>';
            bw.querySelector("input").addEventListener("change",function(e){ item[f.k]=e.target.checked; renderAll(); scheduleDraft(); });
            card.appendChild(bw); return;
          }
          card.appendChild(fld(f.l,item[f.k],function(v){item[f.k]=v;},{
            textarea:f.textarea,rows:f.rows,type:f.type,ph:f.ph,
            select: f.icon?iconOptions():(f.select||null)
          }));
        });
      }
      hd.querySelector('[data-a=up]').onclick=function(){if(idx>0){arr.splice(idx-1,0,arr.splice(idx,1)[0]);refresh();renderAll();scheduleDraft();}};
      hd.querySelector('[data-a=down]').onclick=function(){if(idx<arr.length-1){arr.splice(idx+1,0,arr.splice(idx,1)[0]);refresh();renderAll();scheduleDraft();}};
      hd.querySelector('[data-a=del]').onclick=function(){if(confirm("Xóa mục này?")){arr.splice(idx,1);refresh();renderAll();scheduleDraft();}};
      list.appendChild(card);
    });
    var add=document.createElement("button"); add.className="addbtn";
    add.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> '+(opt.addLabel||"Thêm mục");
    add.onclick=function(){ opt.add(); refresh(); renderAll(); scheduleDraft(); };
    list.appendChild(add);
  }
  refresh();
  return wrap;
}

function renderPanel(){
  var b=$("#admin-body"); b.innerHTML=""; var p=document.createElement("div"); p.className="panel active"; b.appendChild(p);
  var c=content;
  if(curTab==="catalog") curTab="cat:giai-phap";           /* tương thích liên kết cũ */
  if(curTab==="hub"){ renderHubPanel(p); return; }
  if(curTab.indexOf("cat:")===0){ renderCatalogPanel.cur=curTab.slice(4); renderCatalogPanel(p); return; }
  if(curTab==="layout"){
    reconcileSections();
    p.appendChild(h2("Bố cục trang"));
    p.appendChild(hint("Đổi thứ tự bằng ▲▼. Bỏ \"Hiện\" để ẩn hẳn một khối. <b>\"Hiện ở\"</b> quyết định khối xuất hiện ở Trang chủ, Trang giải pháp (chi tiết thuế), hay Cả hai — nhờ đó anh tự kéo nội dung giữa hai trang mà không cần sửa code. Đầu trang và Liên hệ luôn cố định."));
    var lw=document.createElement("div");
    function refreshL(){
      lw.innerHTML="";
      content.settings.sections.forEach(function(x,i){
        var meta=SECTION_META[x.key]||{label:x.key}, avail=sectionAvailable(x.key);
        var card=document.createElement("div");card.className="card-block";card.style.padding="13px 16px";
        card.innerHTML='<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">'+
          '<div class="li-actions"><button class="iconbtn" data-a="up"><svg viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg></button>'+
          '<button class="iconbtn" data-a="down"><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button></div>'+
          '<b style="flex:1;font-size:14px;color:var(--green-deep);min-width:120px">'+esc(meta.label)+(avail?'':' <span style="color:#B8860B;font-weight:400;font-size:12px">· trống</span>')+'</b>'+
          '<label style="font-size:13px;color:var(--text-mid);cursor:pointer;display:inline-flex;align-items:center;gap:6px"><input type="checkbox" data-a="on" '+(x.on!==false?"checked":"")+' style="width:auto">Hiện</label>'+
          '<label style="font-size:12px;color:var(--text-light);display:inline-flex;align-items:center;gap:5px">Hiện ở <select data-a="where" style="font-size:12.5px;padding:4px 6px;border:1px solid var(--line);border-radius:7px;background:#fff">'+
            [["home","Trang chủ"],["both","Cả hai"],["solution","Trang giải pháp"]].map(function(o){return '<option value="'+o[0]+'"'+(sectionWhere(x)===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+
          '</select></label></div>';
        card.querySelector('[data-a=up]').onclick=function(){if(i>0){var a=content.settings.sections;a.splice(i-1,0,a.splice(i,1)[0]);refreshL();renderAll();scheduleDraft();}};
        card.querySelector('[data-a=down]').onclick=function(){var a=content.settings.sections;if(i<a.length-1){a.splice(i+1,0,a.splice(i,1)[0]);refreshL();renderAll();scheduleDraft();}};
        card.querySelector('[data-a=on]').onchange=function(e){x.on=e.target.checked;renderAll();scheduleDraft();};
        card.querySelector('[data-a=where]').onchange=function(e){x.where=e.target.value;renderAll();scheduleDraft();};
        lw.appendChild(card);
      });
    }
    refreshL();
    p.appendChild(lw);
  }
  else if(curTab==="brand"){
    p.appendChild(h2("Thương hiệu & Liên hệ"));
    p.appendChild(hint("Những thông tin này xuất hiện ở đầu trang, chân trang và mục liên hệ."));
    var s=c.settings;
    p.appendChild(fld("Tên thương hiệu",s.brandName,function(v){s.brandName=v;},{sub:"kết thúc bằng \"Data\" sẽ được tô teal"}));
    p.appendChild(fld("Dòng phụ dưới logo",s.sub,function(v){s.sub=v;}));
    p.appendChild(fld("Khẩu hiệu công ty (chân trang)",s.coSlogan,function(v){s.coSlogan=v;},{ph:"Giải pháp thông minh · Vận hành tinh gọn",sub:"dòng in nghiêng dưới tên thương hiệu ở chân trang, và ở chân mọi trang bài viết"}));
    p.appendChild(fld("Slogan dịch vụ",s.slogan,function(v){s.slogan=v;},{sub:"chỉ hiện ở chân trang khi ô trên để trống"}));
    var g=document.createElement("div");g.className="grid2";
    g.appendChild(fld("Số Zalo (chỉ số)",s.zalo,function(v){s.zalo=v;},{ph:"0917324328"}));
    g.appendChild(fld("Zalo hiển thị",s.zaloText,function(v){s.zaloText=v;}));
    g.appendChild(fld("Điện thoại (tel:)",s.phone,function(v){s.phone=v;},{ph:"+84917324328"}));
    g.appendChild(fld("SĐT hiển thị",s.phoneText,function(v){s.phoneText=v;}));
    g.appendChild(fld("Email",s.email,function(v){s.email=v;}));
    g.appendChild(fld("Địa điểm",s.location,function(v){s.location=v;}));
    p.appendChild(g);
    p.appendChild(fld("Dòng bản quyền",s.copyright,function(v){s.copyright=v;}));
    var lg=s.legal||(s.legal={show:true});
    var hl=h2("Hồ sơ pháp lý (chân trang)");hl.style.fontSize="20px";hl.style.marginTop="26px";p.appendChild(hl);
    p.appendChild(hint("Đây là khối tăng niềm tin mạnh nhất mà tốn ít công nhất. Người mua dịch vụ thuế luôn muốn biết mình đang giao số liệu cho ai, ở đâu. <b>Điền đúng theo giấy đăng ký kinh doanh</b> — đừng ghi ước chừng. Ô nào chưa có thì xóa trắng, khối sẽ tự ẩn dòng đó."));
    var le=document.createElement("div");le.className="fld";
    le.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="lg-en" '+(lg.show!==false?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện khối hồ sơ pháp lý ở chân trang</label>';
    le.querySelector("#lg-en").addEventListener("change",function(e){lg.show=e.target.checked;renderAll();scheduleDraft();});
    p.appendChild(le);
    p.appendChild(fld("Tên đơn vị theo đăng ký",lg.entity,function(v){lg.entity=v;}));
    var g2=document.createElement("div");g2.className="grid2";
    g2.appendChild(fld("Mã số hộ kinh doanh",lg.taxCode,function(v){lg.taxCode=v;}));
    g2.appendChild(fld("Người chịu trách nhiệm",lg.owner,function(v){lg.owner=v;}));
    p.appendChild(g2);
    p.appendChild(fld("Địa chỉ đầy đủ",lg.address,function(v){lg.address=v;},{sub:"có số nhà và ấp — càng cụ thể càng đáng tin"}));
    p.appendChild(fld("Giờ làm việc",lg.hours,function(v){lg.hours=v;},{textarea:true,rows:2}));
  }
  else if(curTab==="hero"){
    p.appendChild(h2("Đầu trang (Hero)"));
    p.appendChild(hint("Tiêu đề cho phép xuống dòng bằng <code>&lt;br&gt;</code> và tô nhấn teal bằng <code>&lt;span class=\"em\"&gt;chữ&lt;/span&gt;</code>."));
    var h=c.hero;
    p.appendChild(fld("Nhãn nhỏ (eyebrow)",h.eyebrow,function(v){h.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề chính",h.title,function(v){h.title=v;},{textarea:true,rows:2}));
    p.appendChild(fld("Dòng từ khóa dưới tiêu đề (H2)",h.kw,function(v){h.kw=v;},{textarea:true,rows:2,ph:"Giải pháp ghi sổ doanh thu cho hộ kinh doanh tại Chợ Lách, Vĩnh Long",sub:"để trống thì không hiện gì — trang giữ nguyên như cũ"}));
    p.appendChild(hint("Tiêu đề lớn hiện nay là câu slogan, hay về giọng điệu nhưng không chứa chữ nào bà con gõ vào Google. Ô này thêm một dòng nhỏ ngay dưới slogan, vừa cho người đọc hiểu ngay HuyData làm nghề gì, vừa cho Google một tiêu đề phụ (H2) có từ khóa. Điền vào rồi xem thử — không ưng thì xóa đi là về như cũ."));
    p.appendChild(fld("Mô tả ngắn",h.sub,function(v){h.sub=v;},{textarea:true}));
    var g=document.createElement("div");g.className="grid2";
    g.appendChild(fld("Nút chính (Zalo)",h.ctaText,function(v){h.ctaText=v;}));
    g.appendChild(fld("Nút phụ",h.ctaText2,function(v){h.ctaText2=v;}));
    p.appendChild(g);
    p.appendChild(fld("Liên kết nút phụ",h.ctaLink2,function(v){h.ctaLink2=v;},{ph:"#giai-phap"}));
    p.appendChild(listEditor("Chip tin cậy (dưới hero)",h.trust,null,null,{simpleStrings:true,addLabel:"Thêm chip",add:function(){h.trust.push("Điểm mới");}}));
  }
  else if(curTab==="pain"){
    var pa=c.pain;
    p.appendChild(h2("Bối cảnh"));
    p.appendChild(fld("Nhãn",pa.eyebrow,function(v){pa.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",pa.title,function(v){pa.title=v;}));
    p.appendChild(fld("Mô tả",pa.intro,function(v){pa.intro=v;},{textarea:true}));
    p.appendChild(listEditor("Nỗi lo (cột trái)",pa.items,function(it){return it.title;},
      [{k:"title",l:"Tiêu đề"},{k:"desc",l:"Mô tả",textarea:true}],
      {addLabel:"Thêm nỗi lo",add:function(){pa.items.push({title:"Nỗi lo mới",desc:""});}}));
    p.appendChild(fld("Khối trả lời — tiêu đề",pa.answerTitle,function(v){pa.answerTitle=v;},{textarea:true,rows:2,sub:"dùng <br> để xuống dòng"}));
    p.appendChild(fld("Khối trả lời — nội dung",pa.answerBody,function(v){pa.answerBody=v;},{textarea:true}));
    p.appendChild(fld("Khối trả lời — dòng ký",pa.answerSig,function(v){pa.answerSig=v;}));
    var w=c.why;
    p.appendChild(h2("Vì sao chọn HuyData"));
    p.appendChild(fld("Nhãn",w.eyebrow,function(v){w.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",w.title,function(v){w.title=v;}));
    p.appendChild(fld("Mô tả",w.intro,function(v){w.intro=v;},{textarea:true}));
    p.appendChild(listEditor("Thẻ khác biệt",w.cards,function(it){return it.title;},
      [{k:"icon",l:"Biểu tượng",icon:true},{k:"title",l:"Tiêu đề"},{k:"desc",l:"Mô tả",textarea:true}],
      {addLabel:"Thêm thẻ",add:function(){w.cards.push({icon:"doc",title:"Điểm mới",desc:""});}}));
  }
  else if(curTab==="decision"){
    var d=c.decision;
    p.appendChild(h2("Tầm nhìn: Số liệu → Quyết định"));
    p.appendChild(fld("Nhãn",d.eyebrow,function(v){d.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",d.title,function(v){d.title=v;},{textarea:true,rows:2,sub:"dùng <br> để xuống dòng"}));
    p.appendChild(fld("Mô tả",d.intro,function(v){d.intro=v;},{textarea:true}));
    p.appendChild(listEditor("Các tầng",d.rungs,function(it){return it.title;},
      [{k:"k",l:"Nhãn tầng"},{k:"title",l:"Tên tầng"},{k:"desc",l:"Mô tả",textarea:true}],
      {addLabel:"Thêm tầng",add:function(){d.rungs.push({k:"Tầng",title:"Mới",desc:""});}}));
    p.appendChild(fld("Ghi chú cuối mục",d.note,function(v){d.note=v;},{textarea:true}));
    var wh=c.who;
    p.appendChild(h2("Dành cho ai"));
    p.appendChild(fld("Nhãn",wh.eyebrow,function(v){wh.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",wh.title,function(v){wh.title=v;}));
    p.appendChild(listEditor("Nhóm khách hàng",wh.cards,function(it){return it.title;},
      [{k:"tag",l:"Nhãn"},{k:"title",l:"Tên nhóm"},{k:"desc",l:"Mô tả",textarea:true}],
      {addLabel:"Thêm nhóm",add:function(){wh.cards.push({tag:"Nhóm",title:"Mới",desc:""});}}));
  }
  else if(curTab==="stories"){
    var st=c.stories;
    p.appendChild(h2("Khách hàng thật nói gì"));
    p.appendChild(hint("<b>Trước khi đăng:</b> gửi từng đoạn cho chính chủ hộ xem qua Zalo và xin họ đồng ý. Giữ lại tin nhắn đồng ý làm bằng chứng. Không đăng số điện thoại hay doanh thu của khách.<br><b>Ảnh:</b> dán link ảnh đã đăng ở nơi khác (Facebook, Google Drive công khai, hoặc cùng thư mục với trang này, vd <code>anh/hoa-mai.jpg</code>). Để trống thì trang hiện khung chờ ảnh — không bị vỡ."));
    var en=document.createElement("div");en.className="fld";
    en.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="st-en" '+(st.enabled!==false?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện mục Khách hàng thật trên trang</label>';
    en.querySelector("#st-en").addEventListener("change",function(e){st.enabled=e.target.checked;renderAll();scheduleDraft();});
    p.appendChild(en);
    p.appendChild(fld("Nhãn",st.eyebrow,function(v){st.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",st.title,function(v){st.title=v;}));
    p.appendChild(fld("Mô tả",st.intro,function(v){st.intro=v;},{textarea:true,rows:3}));
    var sp=document.createElement("div");sp.className="fld";
    sp.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="st-pic" '+(st.showPhotos===true?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện ảnh khách hàng trên trang</label>';
    sp.querySelector("#st-pic").addEventListener("change",function(e){st.showPhotos=e.target.checked;renderAll();scheduleDraft();});
    p.appendChild(sp);
    p.appendChild(hint("Chưa có ảnh thật thì <b>để tắt</b> — trang hiện thẻ chữ gọn gàng, không có khung viền đứt nét. Chụp xong ảnh, dán link vào từng khách rồi bật lại. Bật khi chưa có ảnh sẽ hiện khung chờ, chỉ nên dùng lúc anh xem thử."));
    p.appendChild(listEditor("Danh sách khách hàng",st.items,function(it){return it.name;},
      [{k:"name",l:"Tên hộ / cơ sở"},{k:"place",l:"Địa bàn (xã)"},{k:"biz",l:"Ngành nghề (dòng nhỏ phía trên)"},
       {k:"photo",l:"Link ảnh (để trống = khung chờ ảnh)",type:"url",ph:"anh/hoa-mai.jpg hoặc https://..."},
       {k:"photoAlt",l:"Mô tả ảnh (cho người khiếm thị & Google)"},
       {k:"quote",l:"Lời của chủ hộ",textarea:true,rows:6},
       {k:"tags",l:"Thẻ tóm ý",lines:true,rows:3}],
      {addLabel:"Thêm khách hàng",add:function(){st.items.push({name:"Tên hộ mới",place:"",biz:"",photo:"",photoAlt:"",quote:"",tags:[]});}}));
    p.appendChild(fld("Ghi chú cuối mục (về việc xin phép đăng)",st.note,function(v){st.note=v;},{textarea:true,rows:3}));
  }
  else if(curTab==="process"){
    var pc=c.process;
    p.appendChild(h2("Quy trình làm việc"));
    p.appendChild(hint("Mục này biến dịch vụ vô hình thành thứ khách hình dung được. Ảnh mẫu sổ tháng là bằng chứng mạnh nhất — chụp một trang sổ thật rồi che hết số liệu của khách trước khi đăng."));
    var en=document.createElement("div");en.className="fld";
    en.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="pc-en" '+(pc.enabled!==false?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện mục Quy trình trên trang</label>';
    en.querySelector("#pc-en").addEventListener("change",function(e){pc.enabled=e.target.checked;renderAll();scheduleDraft();});
    p.appendChild(en);
    p.appendChild(fld("Nhãn",pc.eyebrow,function(v){pc.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",pc.title,function(v){pc.title=v;}));
    p.appendChild(fld("Mô tả",pc.intro,function(v){pc.intro=v;},{textarea:true,rows:3}));
    p.appendChild(listEditor("Các bước",pc.steps,function(it){return it.title;},
      [{k:"k",l:"Nhãn bước"},{k:"title",l:"Tên bước"},{k:"desc",l:"Mô tả",textarea:true,rows:3}],
      {addLabel:"Thêm bước",add:function(){pc.steps.push({k:"Bước",title:"Bước mới",desc:""});}}));
    var hh=h2("Khối ảnh mẫu sổ tháng");hh.style.fontSize="20px";p.appendChild(hh);
    var pp=document.createElement("div");pp.className="fld";
    pp.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="pc-pic" '+(pc.showPhoto===true?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện ảnh mẫu sổ tháng</label>';
    pp.querySelector("#pc-pic").addEventListener("change",function(e){pc.showPhoto=e.target.checked;renderAll();scheduleDraft();});
    p.appendChild(pp);
    p.appendChild(hint("Tắt thì khối bên phải chỉ có chữ, vẫn đẹp. Có ảnh mẫu sổ rồi thì bật lên — đây là bằng chứng mạnh nhất trên cả trang."));
    p.appendChild(fld("Link ảnh mẫu sổ",pc.samplePhoto,function(v){pc.samplePhoto=v;},{type:"url",ph:"anh/so-thang.jpg hoặc https://..."}));
    p.appendChild(fld("Mô tả ảnh",pc.samplePhotoAlt,function(v){pc.samplePhotoAlt=v;}));
    p.appendChild(fld("Tiêu đề khối",pc.sampleTitle,function(v){pc.sampleTitle=v;}));
    p.appendChild(fld("Nội dung khối",pc.sampleBody,function(v){pc.sampleBody=v;},{textarea:true,rows:3}));
  }
  else if(curTab==="more"){
    var mo=c.more;
    p.appendChild(h2("HuyData còn làm gì"));
    p.appendChild(hint("Mục này dùng cho các nội dung phụ trợ không thuộc luồng bán chính. Có thể tắt ở trang chủ và giữ các công cụ trong khu vực Khám phá HuyData."));
    var men=document.createElement("div");men.className="fld";
    men.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="mo-en" '+(mo.enabled!==false?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện mục này trên trang</label>';
    men.querySelector("#mo-en").addEventListener("change",function(e){mo.enabled=e.target.checked;renderAll();scheduleDraft();});
    p.appendChild(men);
    p.appendChild(fld("Nhãn",mo.eyebrow,function(v){mo.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",mo.title,function(v){mo.title=v;}));
    p.appendChild(fld("Mô tả",mo.intro,function(v){mo.intro=v;},{textarea:true,rows:3}));
    p.appendChild(hint("<b>Phần mô tả từng sản phẩm đang bỏ trống có chủ ý.</b> Em chỉ điền tên — mô tả thì anh tự viết, vì em không rõ mỗi công cụ làm được đúng những gì, mà trang này không nên có câu nào anh chưa nói ra. Ô nào còn chữ <i>(Điền …)</i> thì thẻ đó chỉ hiện tên, không hiện dòng mô tả — trông vẫn gọn."));
    p.appendChild(hint("<b>Cân nhắc trước khi mô tả quá hay:</b> một thẻ hấp dẫn sẽ có người gọi hỏi. Sản phẩm nào anh chưa muốn nhận khách lúc này thì để tên trơn, hoặc xóa khỏi danh sách — thêm lại lúc nào cũng được."));
    p.appendChild(listEditor("Danh sách",mo.items,function(it){return it.name;},
      [{k:"name",l:"Tên sản phẩm / công cụ"},
       {k:"tag",l:"Nhãn nhóm khách",ph:"Cho hộ kinh doanh · Cho cơ quan, đơn vị …"},
       {k:"desc",l:"Một dòng mô tả (để trống hoặc để nguyên chữ trong ngoặc thì không hiện)",textarea:true,rows:2}],
      {addLabel:"Thêm sản phẩm",add:function(){mo.items.push({name:"(Điền tên sản phẩm)",tag:"",desc:"(Điền một dòng mô tả)"});}}));
    p.appendChild(fld("Dòng khép lại (dưới danh sách)",mo.note,function(v){mo.note=v;},{textarea:true,rows:3}));
  }
  else if(curTab==="ctv"){
    var cv=c.ctv;
    p.appendChild(h2("Cộng tác viên tại địa bàn"));
    p.appendChild(hint("<b>Xin phép trước khi đăng:</b> tên và ảnh của cộng tác viên là dữ liệu cá nhân — phải được chính họ đồng ý (Luật 91/2025/QH15). Nếu chưa xin được, cứ để nguyên chữ trong ngoặc, trang vẫn chạy bình thường; hoặc tắt mục này cho tới khi sẵn sàng.<br><b>Ảnh:</b> ảnh chân dung vuông, rõ mặt, chụp ngoài đời thật — đừng dùng ảnh mẫu trên mạng."));
    var en=document.createElement("div");en.className="fld";
    en.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="cv-en" '+(cv.enabled!==false?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện mục Cộng tác viên trên trang</label>';
    en.querySelector("#cv-en").addEventListener("change",function(e){cv.enabled=e.target.checked;renderAll();scheduleDraft();});
    p.appendChild(en);
    p.appendChild(fld("Nhãn",cv.eyebrow,function(v){cv.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",cv.title,function(v){cv.title=v;}));
    p.appendChild(fld("Mô tả",cv.intro,function(v){cv.intro=v;},{textarea:true,rows:3}));
    var cm=document.createElement("div");cm.className="fld";
    cm.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="cv-mem" '+(cv.showMembers===true?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện danh sách từng cộng tác viên</label>';
    cm.querySelector("#cv-mem").addEventListener("change",function(e){cv.showMembers=e.target.checked;renderAll();buildAdmin();scheduleDraft();});
    p.appendChild(cm);
    var cp=document.createElement("div");cp.className="fld";
    cp.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="cv-pic" '+(cv.showPhotos===true?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện ảnh chân dung cộng tác viên</label>';
    cp.querySelector("#cv-pic").addEventListener("change",function(e){cv.showPhotos=e.target.checked;renderAll();scheduleDraft();});
    p.appendChild(cp);
    p.appendChild(hint("<b>Đang tắt danh sách là đúng.</b> Chưa xin được tên và ảnh thì đừng hiện 4 thẻ trống — trang sẽ trông dở dang. Lúc này mục chỉ hiện đoạn giới thiệu mạng lưới, dải địa bàn phục vụ và khối mời cộng tác viên: đủ ý, không hở chỗ nào.<br>Khi đã có tên (và họ đồng ý), bật <i>Hiện danh sách</i> lên. Có ảnh nữa thì bật tiếp <i>Hiện ảnh chân dung</i>."));
    p.appendChild(listEditor("Địa bàn đang phục vụ",cv.areas,null,null,
      {simpleStrings:true,addLabel:"Thêm địa bàn",add:function(){cv.areas.push("Xã ...");}}));
    p.appendChild(listEditor("Danh sách cộng tác viên",cv.members,function(it){return it.name;},
      [{k:"name",l:"Họ tên"},{k:"area",l:"Địa bàn phụ trách"},
       {k:"photo",l:"Link ảnh chân dung (để trống = khung chờ ảnh)",type:"url",ph:"anh/ctv-1.jpg hoặc https://..."},
       {k:"photoAlt",l:"Mô tả ảnh"},
       {k:"note",l:"Một dòng giới thiệu",textarea:true,rows:2}],
      {addLabel:"Thêm cộng tác viên",add:function(){cv.members.push({name:"(Điền tên cộng tác viên)",area:"(Điền tên xã)",photo:"",photoAlt:"Ảnh cộng tác viên",note:"(Điền một dòng giới thiệu ngắn.)"});}}));
    var hh2=h2("Khối mời làm cộng tác viên");hh2.style.fontSize="20px";p.appendChild(hh2);
    p.appendChild(fld("Tiêu đề khối",cv.ctaTitle,function(v){cv.ctaTitle=v;},{sub:"để trống để ẩn khối này"}));
    p.appendChild(fld("Nội dung khối",cv.ctaBody,function(v){cv.ctaBody=v;},{textarea:true,rows:3}));
    p.appendChild(fld("Chữ trên nút",cv.ctaText,function(v){cv.ctaText=v;}));
  }
  else if(curTab==="privacy"){
    var pv=c.privacy;
    p.appendChild(h2("Cam kết riêng tư & bảo mật"));
    p.appendChild(fld("Nhãn",pv.eyebrow,function(v){pv.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",pv.title,function(v){pv.title=v;}));
    p.appendChild(fld("Mô tả",pv.intro,function(v){pv.intro=v;},{textarea:true}));
    p.appendChild(listEditor("Các cam kết",pv.items,function(it){return it.title;},
      [{k:"icon",l:"Biểu tượng",icon:true},{k:"title",l:"Tiêu đề"},{k:"desc",l:"Mô tả",textarea:true}],
      {addLabel:"Thêm cam kết",add:function(){pv.items.push({icon:"lock",title:"Cam kết mới",desc:""});}}));
    p.appendChild(fld("Lằn ranh — tiêu đề",pv.firewallTitle,function(v){pv.firewallTitle=v;}));
    p.appendChild(fld("Lằn ranh — nội dung",pv.firewallBody,function(v){pv.firewallBody=v;},{textarea:true}));
    var ab=c.about;
    p.appendChild(h2("Về HuyData"));
    p.appendChild(fld("Nhãn",ab.eyebrow,function(v){ab.eyebrow=v;}));
    p.appendChild(fld("Câu trích lớn",ab.quote,function(v){ab.quote=v;},{textarea:true}));
    p.appendChild(fld("Đoạn giới thiệu",ab.body,function(v){ab.body=v;},{textarea:true,rows:5}));
    var g=document.createElement("div");g.className="grid2";
    g.appendChild(fld("Tên người sáng lập",ab.name,function(v){ab.name=v;}));
    g.appendChild(fld("Vai trò",ab.role,function(v){ab.role=v;}));
    p.appendChild(g);
    p.appendChild(withUpload(fld("Ảnh chân dung (hiện ở khối Về HuyData và hộp tác giả cuối bài)",ab.photo||"",function(v){ab.photo=v;},{ph:"/anh/... — ảnh vuông, rõ mặt"}),600,function(){return "chan-dung-"+(ab.name||"");}));
    var ct=c.contact;
    p.appendChild(h2("Mục liên hệ"));
    p.appendChild(fld("Nhãn",ct.eyebrow,function(v){ct.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",ct.title,function(v){ct.title=v;}));
    p.appendChild(fld("Mô tả",ct.sub,function(v){ct.sub=v;},{textarea:true}));
  }
  else if(curTab==="solutions"){
    var sol=c.solutions;
    p.appendChild(h2("Giải pháp"));
    p.appendChild(hint("Sắp theo nhóm bài toán; mỗi nhóm chứa các công cụ/dịch vụ. Đổi thứ tự bằng ▲▼. Điền URL để hiện nút liên kết trên thẻ."));
    var en=document.createElement("div");en.className="fld";
    en.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="sol-en" '+(sol.enabled!==false?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện mục Giải pháp trên trang</label>';
    en.querySelector("#sol-en").addEventListener("change",function(e){sol.enabled=e.target.checked;renderAll();scheduleDraft();});
    p.appendChild(en);
    p.appendChild(fld("Nhãn",sol.eyebrow,function(v){sol.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",sol.title,function(v){sol.title=v;}));
    p.appendChild(fld("Mô tả",sol.intro,function(v){sol.intro=v;},{textarea:true}));
    var gw=document.createElement("div");
    function refreshG(){
      gw.innerHTML="";
      var gh=document.createElement("h2");gh.textContent="Các nhóm giải pháp";gh.style.fontSize="20px";gh.style.marginTop="24px";gw.appendChild(gh);
      sol.groups.forEach(function(g,gi){
        var card=document.createElement("div");card.className="card-block";card.style.borderLeft="3px solid var(--teal-bright)";
        var hd=document.createElement("div");hd.className="li-head";
        hd.innerHTML='<span class="li-name"><span class="dot"></span>'+esc(g.name||"(nhóm)")+'</span><div class="li-actions">'+
          '<button class="iconbtn" data-a="up"><svg viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg></button>'+
          '<button class="iconbtn" data-a="down"><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>'+
          '<button class="iconbtn danger" data-a="del"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg></button></div>';
        card.appendChild(hd);
        card.appendChild(fld("Nhãn nhỏ (kicker)",g.kicker,function(v){g.kicker=v;}));
        card.appendChild(fld("Tên nhóm",g.name,function(v){g.name=v;}));
        card.appendChild(fld("Nhãn trạng thái nhóm (để trống nếu không)",g.badge,function(v){g.badge=v;},{ph:"vd: Đang thực hiện"}));
        card.appendChild(fld("Mô tả nhóm",g.tagline,function(v){g.tagline=v;},{textarea:true,rows:2}));
        card.appendChild(listEditor("Công cụ / dịch vụ trong nhóm",g.items,function(it){return it.name;},
          [{k:"name",l:"Tên"},{k:"badgeText",l:"Nhãn trạng thái (chữ)"},
           {k:"badge",l:"Màu nhãn",select:[{v:"live",t:"Xanh — Đang cung cấp"},{v:"soon",t:"Vàng — Sắp ra mắt"},{v:"dev",t:"Xanh dương — Đang phát triển"},{v:"core",t:"Tím — Nền tảng"}]},
           {k:"desc",l:"Mô tả",textarea:true,rows:3},{k:"foot",l:"Dòng chân thẻ"},
           {k:"url",l:"URL (tùy chọn)",type:"url",ph:"https://..."},{k:"linkText",l:"Chữ trên nút",ph:"Tìm hiểu"}],
          {addLabel:"Thêm công cụ/dịch vụ",add:function(){g.items.push({name:"Mục mới",badge:"dev",badgeText:"Đang phát triển",desc:"",foot:"",url:"",linkText:"Tìm hiểu"});}}));
        hd.querySelector('[data-a=up]').onclick=function(){if(gi>0){sol.groups.splice(gi-1,0,sol.groups.splice(gi,1)[0]);refreshG();renderAll();scheduleDraft();}};
        hd.querySelector('[data-a=down]').onclick=function(){if(gi<sol.groups.length-1){sol.groups.splice(gi+1,0,sol.groups.splice(gi,1)[0]);refreshG();renderAll();scheduleDraft();}};
        hd.querySelector('[data-a=del]').onclick=function(){if(confirm("Xóa nhóm \""+(g.name||"")+"\"?")){sol.groups.splice(gi,1);refreshG();renderAll();scheduleDraft();}};
        gw.appendChild(card);
      });
      var add=document.createElement("button");add.className="addbtn";add.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Thêm nhóm giải pháp';
      add.onclick=function(){sol.groups.push({id:"nhom-"+Date.now().toString(36),kicker:"",name:"Nhóm mới",badge:"",tagline:"",items:[]});refreshG();renderAll();scheduleDraft();};
      gw.appendChild(add);
    }
    refreshG();
    p.appendChild(gw);
  }
  else if(curTab==="pricing"){
    var pr=c.pricing;
    p.appendChild(h2("Bảng giá & Bản quyền"));
    p.appendChild(hint("Giá là ô chữ tự do — có thể ghi \"Liên hệ\", \"Miễn phí\", hay số tiền cụ thể. Để trống ô \"Link nút\" thì nút sẽ tự dẫn về Zalo."));
    var en=document.createElement("div");en.className="fld";
    en.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="pr-en" '+(pr.enabled!==false?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện mục Bảng giá trên trang</label>';
    en.querySelector("#pr-en").addEventListener("change",function(e){pr.enabled=e.target.checked;renderAll();scheduleDraft();});
    p.appendChild(en);
    p.appendChild(fld("Nhãn",pr.eyebrow,function(v){pr.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",pr.title,function(v){pr.title=v;}));
    p.appendChild(fld("Mô tả",pr.intro,function(v){pr.intro=v;},{textarea:true}));
    p.appendChild(fld("Ghi chú dưới bảng",pr.note,function(v){pr.note=v;},{textarea:true,rows:2}));
    p.appendChild(listEditor("Các gói",pr.tiers,function(it){return it.name;},
      [{k:"name",l:"Tên gói"},{k:"badge",l:"Nhãn nổi bật (vd: Phổ biến — để trống nếu không)"},
       {k:"price",l:"Giá (chữ tự do)"},{k:"period",l:"Dòng phụ dưới giá"},
       {k:"desc",l:"Mô tả ngắn",textarea:true,rows:2},
       {k:"features",l:"Tính năng",lines:true,rows:4},
       {k:"cta",l:"Chữ trên nút"},{k:"ctaLink",l:"Link nút (để trống = Zalo)",type:"url",ph:"để trống để dẫn về Zalo"},
       {k:"highlight",l:"Làm nổi bật gói này (viền teal)",bool:true}],
      {addLabel:"Thêm gói",add:function(){pr.tiers.push({name:"Gói mới",price:"Liên hệ",period:"",desc:"",features:[],cta:"Liên hệ",ctaLink:"",highlight:false,badge:""});}}));
  }
  else if(curTab==="faq"){
    var fq=c.faq;
    p.appendChild(h2("Câu hỏi thường gặp"));
    p.appendChild(hint("Nhấp từng câu hỏi ngoài trang sẽ mở/đóng phần trả lời."));
    var en2=document.createElement("div");en2.className="fld";
    en2.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="fq-en" '+(fq.enabled!==false?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện mục Hỏi đáp trên trang</label>';
    en2.querySelector("#fq-en").addEventListener("change",function(e){fq.enabled=e.target.checked;renderAll();scheduleDraft();});
    p.appendChild(en2);
    p.appendChild(fld("Nhãn",fq.eyebrow,function(v){fq.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề",fq.title,function(v){fq.title=v;}));
    p.appendChild(fld("Mô tả",fq.intro,function(v){fq.intro=v;},{textarea:true,rows:2}));
    p.appendChild(listEditor("Danh sách câu hỏi",fq.items,function(it){return it.q;},
      [{k:"q",l:"Câu hỏi"},{k:"a",l:"Trả lời",textarea:true,rows:3}],
      {addLabel:"Thêm câu hỏi",add:function(){fq.items.push({q:"Câu hỏi mới",a:""});}}));
  }
  else if(curTab==="blog"){ renderBlogPanel(p); }
  else if(curTab==="seo"){
    var seo=c.settings.seo||(c.settings.seo={});
    p.appendChild(h2("SEO & Chia sẻ mạng xã hội"));
    p.appendChild(hint("Để trống sẽ tự lấy từ tên thương hiệu và tiêu đề trang. Ảnh chia sẻ nên cỡ 1200×630px — dán URL ảnh đã đăng ở nơi khác."));
    p.appendChild(fld("Tiêu đề trang (title / OG)",seo.title,function(v){seo.title=v;},{ph:"HuyData — Lo thuế cho hộ kinh doanh..."}));
    p.appendChild(fld("Mô tả (description / OG)",seo.description,function(v){seo.description=v;},{textarea:true,rows:3}));
    p.appendChild(withUpload(fld("Ảnh chia sẻ (OG image URL)",seo.ogImage,function(v){seo.ogImage=v;},{ph:"/anh/og.jpg (để trống cũng dùng ảnh này)"}),1200,function(){return "anh-chia-se";}));
    var an=c.settings.analytics||(c.settings.analytics={ga4:"",gsc:""});
    p.appendChild(h2("Đo lường (Google Analytics & Search Console)"));
    p.appendChild(hint("Dán <b>Mã đo lường GA4</b> (dạng <code>G-XXXXXXXXXX</code>, lấy ở analytics.google.com → Quản trị → Luồng dữ liệu). Khi có mã, web tự đếm lượt xem và <b>lượt bấm Zalo / gọi điện / email</b> (sự kiện <code>contact_click</code>). Để trống = không đo."));
    p.appendChild(fld("Mã đo lường GA4",an.ga4,function(v){an.ga4=String(v||"").trim().toUpperCase();},{ph:"G-XXXXXXXXXX"}));
    p.appendChild(fld("Mã xác minh Google Search Console (tùy chọn)",an.gsc,function(v){var m=String(v||"").match(/content="([^"]+)"/); an.gsc=(m?m[1]:String(v||"")).trim();},{ph:"dán nguyên thẻ <meta name=\"google-site-verification\"…> hoặc chỉ phần mã",sub:"chỉ cần nếu Search Console chưa xác minh bằng DNS"}));
    p.appendChild(hint("<b>Ảnh chia sẻ đang trống là lỗi nặng nhất hiện nay.</b> Link không ảnh trên Zalo trông giống link lừa đảo. Làm một ảnh 1200×630 (logo nền xanh + dòng <i>Ghi đúng · Khai đủ · Đúng hạn</i>), tải lên cùng thư mục với trang, rồi dán đường dẫn đầy đủ vào ô trên."));
    p.appendChild(fld("Địa chỉ trang (canonical / sitemap)",seo.siteUrl,function(v){seo.siteUrl=v;},{type:"url",ph:"https://huydata.vn/"}));
    p.appendChild(fld("Địa bàn phục vụ",seo.areas,function(v){seo.areas=v;},{sub:"cách nhau bằng dấu phẩy — dùng cho dữ liệu có cấu trúc"}));
    p.appendChild(fld("Từ khóa mục tiêu (ghi nhớ nội bộ)",seo.keywords,function(v){seo.keywords=v;},{textarea:true,rows:2,sub:"không đưa vào trang; chỉ để anh bám khi viết bài"}));
    p.appendChild(hint("<b>Vì sao tìm \"huydata\" trên Google chỉ ra gói cước Viettel:</b> cú pháp hủy gói data của Viettel là <code>HUYDATA</code>, có hàng nghìn trang viết về nó. Đua từ khóa đó là đua với nhà mạng — không thắng nổi, mà cũng không cần: hộ kinh doanh ở Chợ Lách không gõ \"huydata\", họ gõ \"dịch vụ kê khai thuế hộ kinh doanh\". Vì vậy tiêu đề và mô tả ở trên đã đổi sang nhóm từ khóa theo <b>nghề + địa bàn</b>."));
    p.appendChild(hint("<b>Ba việc phải làm ngoài trang này thì Google mới hiện:</b><br>1. <b>Google Search Console</b> (search.google.com/search-console) — thêm huydata.vn, xác minh, rồi dán địa chỉ trang vào ô \"Kiểm tra URL\" và bấm <i>Yêu cầu lập chỉ mục</i>. Không làm bước này thì trang mới có thể nằm chờ rất lâu.<br>2. Bấm <b>Xuất sitemap + robots</b> ở thanh trên, tải hai file lên cùng thư mục với trang, rồi khai báo sitemap trong Search Console.<br>3. <b>Google Business Profile</b> (business.google.com) — đăng ký hồ sơ doanh nghiệp có địa chỉ Chợ Lách. Đây là cách nhanh nhất để hiện khi bà con tìm dịch vụ thuế quanh vùng, thường ăn tiền hơn cả SEO trang web."));
    p.appendChild(hint("<b>Hai nút xuất khác nhau thế nào:</b><br><b>Xuất bản site (.zip)</b> — dùng nút này để đăng. Gói tải về gồm trang chủ, <b>một trang riêng cho từng bài viết</b> (huydata.vn/bai-viet/&lt;tên-bài&gt;/), trang danh sách bài, sitemap.xml, robots.txt, trang 404, kèm CNAME và .nojekyll. Giải nén rồi tải toàn bộ lên hosting, giữ nguyên cấu trúc thư mục.<br><b>Xuất trang (.html)</b> — chỉ một file trang chủ, dùng khi sửa nhanh phần landing mà không đụng tới bài viết."));
    p.appendChild(hint("<b>Vì sao mỗi bài phải có trang riêng:</b> Google cắt bỏ mọi thứ sau dấu <code>#</code>. Với địa chỉ kiểu <code>huydata.vn/#/bai/abc</code>, mọi bài viết đều bị coi là cùng một trang — viết 10 bài hay 300 bài thì Google vẫn chỉ thấy đúng một trang. Trang riêng thật (<code>/bai-viet/abc/</code>) mới là một cửa vào riêng cho mỗi bài."));
    p.appendChild(hint("Cả hai bản xuất đều tự kèm: thẻ chia sẻ trong &lt;head&gt;, địa chỉ chuẩn (canonical), dữ liệu có cấu trúc schema.org, và bản chữ thuần trong thẻ &lt;noscript&gt; để trình quét không chạy JavaScript vẫn đọc được đủ nội dung."));
  }
  else if(curTab==="pin"){
    p.appendChild(h2("Đổi mã PIN quản trị"));
    p.appendChild(hint("<b>Lưu ý bảo mật:</b> đây là lớp che chắn phía trình duyệt. Nó ngăn khách vãng lai mở bảng quản trị, nhưng KHÔNG phải bảo mật cấp máy chủ — bản băm PIN nằm trong file HTML. Bảo vệ thật nằm ở chỗ chỉ người có quyền truy cập hosting mới xuất bản được. Đừng dùng lại PIN quan trọng."));
    var w1=document.createElement("div");w1.className="fld";w1.innerHTML='<label>PIN mới</label><input type="password" id="np1" placeholder="Nhập PIN mới">';
    var w2=document.createElement("div");w2.className="fld";w2.innerHTML='<label>Nhập lại PIN mới</label><input type="password" id="np2" placeholder="Nhập lại">';
    p.appendChild(w1);p.appendChild(w2);
    var btn=document.createElement("button");btn.className="btn btn-primary";btn.style.marginTop="6px";btn.textContent="Cập nhật PIN";
    btn.addEventListener("click",async function(){
      var v1=$("#np1").value,v2=$("#np2").value;
      if(!v1){toast("Chưa nhập PIN");return;}
      if(v1!==v2){toast("Hai ô PIN chưa khớp");return;}
      content.settings.pinHash=await sha256(v1); scheduleDraft();
      toast("Đã đổi PIN. Nhớ Xuất trang (.html) để lưu vĩnh viễn."); $("#np1").value="";$("#np2").value="";
    });
    p.appendChild(btn);
  }
}

/* Trình soạn thảo giàu định dạng dùng chung (bài viết & trang mục) */
function makeRichEditor(html,onChange){
  var tools=document.createElement("div");tools.className="wy-tools";
  var ed=document.createElement("div");ed.className="editor";ed.contentEditable="true";ed.setAttribute("data-ph","Viết nội dung ở đây…");ed.innerHTML=sanitize(html||"","post");
  var buttons=[
    {c:"formatBlock:H2",h:"H2",t:"Tiêu đề mục (H2)"},{c:"formatBlock:H3",h:"H3",t:"Tiêu đề phụ (H3)"},{c:"formatBlock:P",h:"¶",t:"Đoạn văn thường"},{sep:1},
    {c:"bold",h:"<b>B</b>",t:"In đậm"},{c:"italic",h:"<i>I</i>",t:"In nghiêng"},{c:"underline",h:"<u>U</u>",t:"Gạch chân"},{sep:1},
    {c:"insertUnorderedList",h:"• DS",t:"Danh sách chấm"},{c:"insertOrderedList",h:"1. Số",t:"Danh sách số"},{c:"formatBlock:BLOCKQUOTE",h:"❝",t:"Trích dẫn"},{sep:1},
    {c:"createLink",h:"🔗 Link",t:"Chèn / sửa liên kết (chọn được trang trong web)"},{c:"unlink",h:"⛓ Bỏ link",t:"Bỏ liên kết ở chữ đang chọn"},
    {c:"insertImage",h:"🖼 Ảnh",t:"Chèn ảnh (kèm mô tả ảnh)"},{c:"insertTable",h:"▦ Bảng",t:"Chèn bảng"},{sep:1},
    {c:"removeFormat",h:"✕ Xóa ĐD",t:"Xóa định dạng chữ"}
  ];
  function push(){ onChange(sanitize(ed.innerHTML,"post")); scheduleDraft(); }
  function exec(cmd){ ed.focus();
    if(cmd.indexOf("formatBlock:")===0) document.execCommand("formatBlock",false,cmd.split(":")[1]);
    else if(cmd==="createLink"){ openLinkDialog(ed,push); return; }
    else if(cmd==="insertImage"){ openImageDialog(ed,push); return; }
    else if(cmd==="insertTable"){
      var cols=parseInt(prompt("Số cột:","3"),10), rows=parseInt(prompt("Số dòng (không tính dòng tiêu đề):","3"),10);
      if(!(cols>0&&cols<=8&&rows>0&&rows<=40)) return;
      var th="<tr>"+Array(cols+1).join("<th>Tiêu đề</th>")+"</tr>", tr="<tr>"+Array(cols+1).join("<td>&nbsp;</td>")+"</tr>";
      document.execCommand("insertHTML",false,"<table><thead>"+th+"</thead><tbody>"+Array(rows+1).join(tr)+"</tbody></table><p><br></p>");
    }
    else document.execCommand(cmd,false,null);
    push();
  }
  buttons.forEach(function(bt){
    if(bt.sep){var s=document.createElement("span");s.className="sep";tools.appendChild(s);return;}
    var btn=document.createElement("button");btn.type="button";btn.innerHTML=bt.h; if(bt.t) btn.title=bt.t;
    btn.addEventListener("mousedown",function(e){e.preventDefault();});
    btn.addEventListener("click",function(){ exec(bt.c); });
    tools.appendChild(btn);
  });
  ed.addEventListener("input",push);
  /* Dán từ Word/Zalo/web: làm sạch ngay trong khung soạn để thấy đúng thứ sẽ đăng */
  ed.addEventListener("paste",function(e){
    var cd=e.clipboardData; if(!cd) return;
    var html=cd.getData("text/html"); if(!html) return;
    e.preventDefault();
    document.execCommand("insertHTML",false,sanitize(html.replace(/<!--[\s\S]*?-->/g,""),"post"));
    push();
  });
  return {tools:tools,ed:ed};
}

/* Danh sách trang trong web để chèn link nội bộ nhanh (đường dẫn dạng /duong-dan/) */
function internalPages(){
  reconcileCatalog();
  var out=[{g:"Trang chính",t:"Trang chủ",u:"/"}];
  catSections().forEach(function(sec){
    if(!sectionHasContent(sec.id)) return;
    out.push({g:"Khu vực",t:sec.title||sec.label,u:"/"+sectionPath(sec)});
    if(isArticleSection(sec)) return;
    pubItems(sec.id).forEach(function(it){ if(itemIsPage(it)) out.push({g:sec.label,t:it.title,u:"/"+itemPath(sec,it)}); });
  });
  pubPosts().forEach(function(p){ out.push({g:"Bài viết",t:p.title,u:"/"+postPath(p.slug)}); });
  out.push({g:"Trang chính",t:"Liên hệ (cuối trang chủ)",u:"/#lien-he"});
  return out;
}
function openLinkDialog(ed,done){
  var sel=window.getSelection(), range=(sel&&sel.rangeCount)?sel.getRangeAt(0).cloneRange():null;
  if(!range||!ed.contains(range.commonAncestorContainer)){ toast("Bấm vào chỗ cần chèn link (hoặc bôi đen chữ) trước đã"); return; }
  var node=range.startContainer; node=node.nodeType===3?node.parentNode:node;
  var cur=node&&node.closest?node.closest("a"):null; if(cur&&!ed.contains(cur)) cur=null;
  var curRel=cur?String(cur.getAttribute("rel")||""):"";
  var m=$("#linkmodal"); if(!m){ m=document.createElement("div"); m.className="modal"; m.id="linkmodal"; document.body.appendChild(m); }
  var pages=internalPages(), groups={};
  pages.forEach(function(p,i){ (groups[p.g]=groups[p.g]||[]).push('<option value="'+i+'">'+esc(p.t)+'</option>'); });
  var opts='<option value="">— Chọn trang trong web HuyData —</option>'+Object.keys(groups).map(function(g){return '<optgroup label="'+esc(g)+'">'+groups[g].join("")+'</optgroup>';}).join("");
  var L='style="display:block;font-size:12.5px;font-weight:600;color:var(--green-deep);margin:0 0 6px"';
  var I='style="text-align:left;letter-spacing:normal;font-size:14px;margin-bottom:12px"';
  m.innerHTML='<div class="modal-card" style="max-width:520px;text-align:left">'+
    '<h3 style="text-align:center">'+(cur?"Sửa liên kết":"Chèn liên kết")+'</h3>'+
    '<label '+L+'>Liên kết nội bộ (nên dùng — giúp Google hiểu các trang liên quan)</label>'+
    '<select id="lk-pick" style="width:100%;padding:11px 12px;border:1px solid var(--line);border-radius:12px;font:inherit;font-size:14px;margin-bottom:12px">'+opts+'</select>'+
    '<label '+L+'>Hoặc dán địa chỉ (URL)</label>'+
    '<input id="lk-url" '+I+' placeholder="https://… hoặc /bai-viet/ten-bai/" value="'+esc(cur?cur.getAttribute("href"):"")+'">'+
    (range.collapsed&&!cur?'<label '+L+'>Chữ hiển thị</label><input id="lk-text" '+I+' placeholder="vd: dịch vụ ghi sổ cho hộ kinh doanh">':'')+
    '<div id="lk-extopt" style="font-size:13px;color:var(--text-mid);margin:0 0 12px;line-height:1.9">'+
      '<label style="cursor:pointer;display:block"><input type="checkbox" id="lk-nof" style="width:auto;margin:0 8px 0 0;vertical-align:middle"'+(/nofollow/.test(curRel)?" checked":"")+'>Link ra ngoài không muốn “bảo chứng” (nofollow)</label>'+
      '<label style="cursor:pointer;display:block"><input type="checkbox" id="lk-spon" style="width:auto;margin:0 8px 0 0;vertical-align:middle"'+(/sponsored/.test(curRel)?" checked":"")+'>Link quảng cáo / tài trợ (sponsored)</label>'+
      '<span style="font-size:12px;color:var(--text-light)">Link ra web khác tự mở tab mới; link trong web mở ngay tại chỗ.</span></div>'+
    '<div class="modal-err" id="lk-err"></div>'+
    '<div style="display:flex;gap:10px">'+
      (cur?'<button class="btn btn-ghost" id="lk-remove" style="flex:1;justify-content:center">Bỏ link</button>':'')+
      '<button class="btn btn-ghost" id="lk-cancel" style="flex:1;justify-content:center">Đóng</button>'+
      '<button class="btn btn-primary" id="lk-ok" style="flex:1;justify-content:center">Chèn</button></div></div>';
  m.classList.add("open");
  var urlI=$("#lk-url"), txtI=$("#lk-text"), ext=$("#lk-extopt");
  function sync(){ ext.style.display=isExternalHref(urlI.value)?"":"none"; }
  $("#lk-pick").onchange=function(){ var p=pages[this.value]; if(!p) return; urlI.value=p.u; if(txtI&&!txtI.value.trim()) txtI.value=p.t; sync(); };
  urlI.oninput=sync; sync();
  function close(){ m.classList.remove("open"); }
  function restore(){ ed.focus(); var s=window.getSelection(); s.removeAllRanges(); s.addRange(range); }
  $("#lk-cancel").onclick=close;
  if(cur) $("#lk-remove").onclick=function(){ var f=document.createDocumentFragment(); while(cur.firstChild) f.appendChild(cur.firstChild); cur.replaceWith(f); close(); done(); };
  $("#lk-ok").onclick=function(){
    var u=urlI.value.trim();
    if(/^(www\.)/i.test(u)) u="https://"+u;
    if(!u||!safeHref(u)){ $("#lk-err").textContent="Địa chỉ chưa hợp lệ. Dùng https://… hoặc /duong-dan/"; return; }
    var rel=[]; if(isExternalHref(u)){ if($("#lk-nof").checked) rel.push("nofollow"); if($("#lk-spon").checked) rel.push("sponsored"); }
    close();
    var a=cur;
    if(!a){
      restore();
      if(range.collapsed){
        var t=(txtI&&txtI.value.trim())||u;
        document.execCommand("insertHTML",false,'<a href="'+esc(u)+'">'+esc(t)+'</a>');
      } else document.execCommand("createLink",false,u);
      a=Array.prototype.filter.call(ed.querySelectorAll("a"),function(x){return x.getAttribute("href")===u;}).pop();
    }
    if(a){ a.setAttribute("href",u); if(rel.length) a.setAttribute("rel",rel.join(" ")); else a.removeAttribute("rel"); }
    done();
  };
  setTimeout(function(){ (cur?urlI:$("#lk-pick")).focus(); },60);
}

/* =========================================================
   TẢI ẢNH LÊN — thu nhỏ + nén ngay trong máy rồi đẩy vào thư mục anh/ của kho GitHub.
   Dùng chung chìa khóa với nút "Đăng lên GitHub". Ảnh hiện trên web sau 1–2 phút.
   ========================================================= */
function shrinkImage(file,maxW,quality){
  return new Promise(function(resolve,reject){
    if(!/^image\//.test(file.type)){ reject(new Error("File không phải ảnh")); return; }
    if(/svg|gif/.test(file.type)){ var r0=new FileReader(); r0.onload=function(){ resolve({b64:String(r0.result).split(",")[1],ext:file.type.indexOf("svg")>0?"svg":"gif",w:0,h:0}); }; r0.onerror=reject; r0.readAsDataURL(file); return; }
    /* Đọc dạng data: (CSP của trang chỉ cho ảnh 'self' / data: / https:, không cho blob:) */
    var img=new Image(), rd=new FileReader();
    rd.onload=function(){ img.src=String(rd.result); }; rd.onerror=function(){ reject(new Error("Không đọc được file ảnh")); };
    img.onload=function(){
      var w=img.naturalWidth, h=img.naturalHeight, k=Math.min(1,maxW/w);
      var cw=Math.round(w*k), ch=Math.round(h*k), cv=document.createElement("canvas"); cv.width=cw; cv.height=ch;
      var cx=cv.getContext("2d"); cx.fillStyle="#fff"; cx.fillRect(0,0,cw,ch); cx.drawImage(img,0,0,cw,ch);
      var webp=cv.toDataURL("image/webp",quality), useWebp=/^data:image\/webp/.test(webp);
      var data=useWebp?webp:cv.toDataURL("image/jpeg",quality);
      resolve({b64:data.split(",")[1],ext:useWebp?"webp":"jpg",w:cw,h:ch});
    };
    img.onerror=function(){ reject(new Error("Không đọc được ảnh (định dạng lạ? thử JPG/PNG)")); };
    rd.readAsDataURL(file);
  });
}
async function uploadImage(file,hintName,maxW){
  var tok=ghToken(), cfg=ghCfg();
  if(!tok){ openGitHubModal(); throw new Error("Chưa có chìa khóa GitHub — lưu chìa khóa rồi thử lại"); }
  var im=await shrinkImage(file,maxW||1600,0.82);
  var base=slugify(hintName||file.name.replace(/\.[^.]+$/,"")).slice(0,50)||"anh";
  var path="anh/"+new Date().toISOString().slice(0,7)+"/"+base+"-"+Date.now().toString(36).slice(-4)+"."+im.ext;
  await ghApi(cfg,tok,"PUT","/contents/"+path,{message:"Tải ảnh "+path,content:im.b64,branch:cfg.branch});
  return {url:"/"+path,w:im.w,h:im.h};
}
/* Gắn nút "Tải ảnh lên" cạnh một ô nhập URL ảnh (ảnh bìa, ảnh chia sẻ, chân dung…) */
function withUpload(el,maxW,nameFn){
  var inp=el.querySelector("input"); if(!inp) return el;
  var row=document.createElement("div"); row.style.cssText="display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap";
  var btn=document.createElement("button"); btn.type="button"; btn.className="btn btn-ghost"; btn.style.cssText="padding:8px 14px;font-size:13px"; btn.textContent="📤 Tải ảnh từ máy";
  var fi=document.createElement("input"); fi.type="file"; fi.accept="image/*"; fi.style.display="none";
  var st=document.createElement("span"); st.style.cssText="font-size:12px;color:var(--text-light)";
  btn.onclick=function(){ fi.click(); };
  fi.onchange=async function(){
    var f=fi.files&&fi.files[0]; if(!f) return;
    btn.disabled=true; st.textContent="Đang nén và tải lên…";
    try{ var r=await uploadImage(f,nameFn?nameFn():"",maxW); inp.value=r.url; inp.dispatchEvent(new Event("input")); st.textContent="✓ Đã tải lên — ảnh hiện trên web sau 1–2 phút"; }
    catch(e){ st.textContent="✗ "+(e&&e.message?e.message:e); }
    finally{ btn.disabled=false; fi.value=""; }
  };
  row.appendChild(btn); row.appendChild(st); el.appendChild(row); el.appendChild(fi);
  return el;
}
function openImageDialog(ed,done){
  var sel=window.getSelection(), range=(sel&&sel.rangeCount)?sel.getRangeAt(0).cloneRange():null;
  if(!range||!ed.contains(range.commonAncestorContainer)){ toast("Bấm vào chỗ cần chèn ảnh trước đã"); return; }
  var m=$("#imgmodal"); if(!m){ m=document.createElement("div"); m.className="modal"; m.id="imgmodal"; document.body.appendChild(m); }
  var L='style="display:block;font-size:12.5px;font-weight:600;color:var(--green-deep);margin:0 0 6px"';
  var I='style="text-align:left;letter-spacing:normal;font-size:14px;margin-bottom:12px"';
  m.innerHTML='<div class="modal-card" style="max-width:520px;text-align:left">'+
    '<h3 style="text-align:center">Chèn ảnh</h3>'+
    '<label '+L+'>Ảnh từ máy (tự thu nhỏ, nén rồi tải lên web)</label>'+
    '<div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap"><button type="button" class="btn btn-ghost" id="im-pick">📤 Chọn ảnh…</button><span id="im-st" style="font-size:12.5px;color:var(--text-light)"></span><input type="file" id="im-file" accept="image/*" style="display:none"></div>'+
    '<label '+L+'>Hoặc dán địa chỉ ảnh có sẵn</label>'+
    '<input id="im-url" '+I+' placeholder="https://… hoặc /anh/ten-anh.jpg">'+
    '<label '+L+'>Mô tả ảnh (alt) — nói ảnh có gì, Google đọc phần này</label>'+
    '<input id="im-alt" '+I+' placeholder="vd: Sổ doanh thu tháng của một tiệm tạp hóa ở Chợ Lách">'+
    '<label '+L+'>Chú thích dưới ảnh (tùy chọn)</label>'+
    '<input id="im-cap" '+I+' placeholder="vd: Mẫu sổ HuyData gửi qua Zalo mỗi tháng">'+
    '<div class="modal-err" id="im-err"></div>'+
    '<div style="display:flex;gap:10px"><button class="btn btn-ghost" id="im-cancel" style="flex:1;justify-content:center">Đóng</button>'+
    '<button class="btn btn-primary" id="im-ok" style="flex:1;justify-content:center">Chèn ảnh</button></div></div>';
  m.classList.add("open");
  var dims={w:0,h:0};
  $("#im-pick").onclick=function(){ $("#im-file").click(); };
  $("#im-file").onchange=async function(){
    var f=this.files&&this.files[0]; if(!f) return;
    var ok=$("#im-ok"); ok.disabled=true; $("#im-st").textContent="Đang nén và tải lên…"; $("#im-err").textContent="";
    try{ var r=await uploadImage(f,$("#im-alt").value||f.name.replace(/\.[^.]+$/,""),1600); $("#im-url").value=r.url; dims={w:r.w,h:r.h}; $("#im-st").textContent="✓ Đã tải lên ("+r.w+"×"+r.h+"). Ảnh hiện trên web sau 1–2 phút."; }
    catch(e){ $("#im-err").textContent="Chưa tải được: "+(e&&e.message?e.message:e); $("#im-st").textContent=""; }
    finally{ ok.disabled=false; this.value=""; }
  };
  $("#im-cancel").onclick=function(){ m.classList.remove("open"); };
  $("#im-ok").onclick=function(){
    var u=$("#im-url").value.trim(), alt=$("#im-alt").value.trim(), cap=$("#im-cap").value.trim();
    if(!u||!safeSrc(u)){ $("#im-err").textContent="Chưa có ảnh. Chọn ảnh từ máy hoặc dán địa chỉ https://… / /anh/…"; return; }
    if(!alt){ $("#im-err").textContent="Nên điền mô tả ảnh — một câu ngắn là đủ."; $("#im-alt").focus(); if(!$("#im-alt").dataset.warned){ $("#im-alt").dataset.warned=1; return; } }
    m.classList.remove("open");
    ed.focus(); var s=window.getSelection(); s.removeAllRanges(); s.addRange(range);
    var wh=dims.w?' width="'+dims.w+'" height="'+dims.h+'"':'';
    var tag='<img src="'+esc(u)+'" alt="'+esc(alt)+'"'+wh+'>';
    document.execCommand("insertHTML",false, cap?'<figure>'+tag+'<figcaption>'+esc(cap)+'</figcaption></figure><p><br></p>':tag);
    done();
  };
}

/* Xem trước trang như bản đăng thật (mở tab mới). Đường dẫn ảnh/link tính theo địa chỉ thật trên web. */
function previewPage(html,absUrl){
  var out=String(html).replace(/<head>/i,'<head>\n<base href="'+esc(absUrl)+'">')
    .replace(/<meta name="robots" content="[^"]*">/i,'<meta name="robots" content="noindex">')
    .replace(/<body>/i,'<body>\n<div style="background:#B8860B;color:#fff;text-align:center;padding:8px 12px;font:600 13px/1.4 system-ui,sans-serif">BẢN XEM TRƯỚC — chưa đăng. Đóng tab này để quay lại soạn.</div>');
  var w=window.open(URL.createObjectURL(new Blob([out],{type:"text/html"})),"_blank");
  if(!w) toast("Trình duyệt chặn cửa sổ mới — cho phép cửa sổ bật lên rồi bấm lại");
}

/* Dải “Khám phá” trên trang chủ — cửa dẫn sang các khu vực catalog */
function renderHubPanel(p){
  reconcileCatalog();
  var cat=content.catalog, hb=cat.hub||(cat.hub={enabled:true});
  p.appendChild(h2("Dải “Khám phá” trên trang chủ"));
  p.appendChild(hint("Đây là khối trên trang chủ dẫn khách sang từng khu vực (Giải pháp · Công cụ · Văn bản · Kiến thức). Nội dung từng khu vực soạn ở các mục tương ứng trong nhóm “Danh mục sản phẩm”."));
  var hen=document.createElement("div");hen.className="fld";
  hen.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="hub-en" '+(hb.enabled!==false?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện dải Khám phá trên trang chủ</label>';
  hen.querySelector("#hub-en").addEventListener("change",function(e){hb.enabled=e.target.checked;renderAll();scheduleDraft();});
  p.appendChild(hen);
  p.appendChild(fld("Nhãn",hb.eyebrow,function(v){hb.eyebrow=v;}));
  p.appendChild(fld("Tiêu đề",hb.title,function(v){hb.title=v;}));
  p.appendChild(fld("Mô tả",hb.intro,function(v){hb.intro=v;},{textarea:true,rows:2}));
}

function renderCatalogPanel(p){
  reconcileCatalog();
  var cat=content.catalog;
  var secs=cat.sections;
  if(!renderCatalogPanel.cur || !sectionById(renderCatalogPanel.cur)) renderCatalogPanel.cur=(secs.find(function(s){return s.kind!=="article";})||secs[0]||{}).id;
  var sec=sectionById(renderCatalogPanel.cur); if(!sec) return;

  var mh=h2("Khu vực: "+sec.label);mh.style.fontSize="21px";p.appendChild(mh);
  p.appendChild(hint("Mỗi khu vực có <b>nhóm</b> (phân loại) tự thêm và các <b>mục</b>. Mỗi mục là <b>Trang riêng</b> (tự sinh URL thật, có SEO), <b>Nhúng HTML</b> hoặc <b>Link ngoài</b>. Thêm nhóm/mục ở đây là xong — không phải sửa code."));
  var men=document.createElement("div");men.className="fld";
  men.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="sec-en" '+(sec.enabled!==false?"checked":"")+' style="width:auto;margin-right:6px;vertical-align:middle">Bật khu vực</label>'+
    '<label style="cursor:pointer;margin-left:16px"><input type="checkbox" id="sec-nav" '+(sec.nav!==false?"checked":"")+' style="width:auto;margin-right:6px;vertical-align:middle">Hiện trên menu</label>';
  men.querySelector("#sec-en").addEventListener("change",function(e){sec.enabled=e.target.checked;renderAll();scheduleDraft();});
  men.querySelector("#sec-nav").addEventListener("change",function(e){sec.nav=e.target.checked;renderAll();scheduleDraft();});
  p.appendChild(men);
  var g2=document.createElement("div");g2.className="grid2";
  g2.appendChild(fld("Tên hiển thị / menu",sec.label,function(v){sec.label=v;}));
  g2.appendChild(fld("Đường dẫn khu vực (slug)",sec.slug,function(v){sec.slug=catSlugify(v);},{sub:"vd: giai-phap → /giai-phap/"}));
  p.appendChild(g2);
  p.appendChild(fld("Tiêu đề trang khu vực",sec.title,function(v){sec.title=v;}));
  p.appendChild(fld("Mô tả (đầu trang khu vực)",sec.intro,function(v){sec.intro=v;},{textarea:true,rows:2}));
  p.appendChild(fld("Mô tả ngắn (thẻ ở dải Khám phá)",sec.homeDesc,function(v){sec.homeDesc=v;}));

  var grh=h2("Nhóm trong "+sec.label);grh.style.fontSize="18px";grh.style.marginTop="22px";p.appendChild(grh);
  p.appendChild(hint("Đây là các “phân loại” anh thêm tùy ý — vd Văn bản: Thuế / Tài chính / Thống kê. Sửa tên ngay tại ô, ▲▼ đổi thứ tự."));
  var gw=document.createElement("div");p.appendChild(gw);
  function refreshGroups(){
    gw.innerHTML="";
    catGroups(sec.id).forEach(function(g){
      var card=document.createElement("div");card.className="card-block";card.style.padding="9px 12px";
      card.innerHTML='<div style="display:flex;align-items:center;gap:7px">'+
        '<span class="dot"></span><input type="text" value="'+esc(g.name)+'" style="flex:1;border:1px solid var(--line);border-radius:8px;padding:7px 10px;font-size:14px">'+
        '<button class="iconbtn" data-a="up"><svg viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg></button>'+
        '<button class="iconbtn" data-a="down"><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>'+
        '<button class="iconbtn danger" data-a="del"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg></button></div>';
      card.querySelector("input").addEventListener("input",function(e){g.name=e.target.value;renderAll();scheduleDraft();});
      function move(dir){var arr=cat.groups,i=arr.indexOf(g),j=i+dir;while(j>=0&&j<arr.length&&arr[j].section!==sec.id)j+=dir;if(j>=0&&j<arr.length){var t=arr[i];arr[i]=arr[j];arr[j]=t;}}
      card.querySelector('[data-a=up]').onclick=function(){move(-1);refreshGroups();renderAll();scheduleDraft();};
      card.querySelector('[data-a=down]').onclick=function(){move(1);refreshGroups();renderAll();scheduleDraft();};
      card.querySelector('[data-a=del]').onclick=function(){
        var used=catItems(sec.id).some(function(it){return it.group===g.id;})||(sec.kind==="article"&&((content.blog.posts||[]).some(function(pp){return pp.group===g.id;})));
        if(!confirm(used?("Nhóm \""+g.name+"\" đang có mục/bài. Xóa nhóm? (mục sẽ chuyển sang \"Khác\")"):("Xóa nhóm \""+g.name+"\"?"))) return;
        catItems(sec.id).forEach(function(it){ if(it.group===g.id) it.group=""; });
        if(sec.kind==="article")(content.blog.posts||[]).forEach(function(pp){ if(pp.group===g.id) pp.group=""; });
        cat.groups.splice(cat.groups.indexOf(g),1);refreshGroups();renderAll();scheduleDraft();
      };
      gw.appendChild(card);
    });
    var add=document.createElement("button");add.className="addbtn";add.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Thêm nhóm';
    add.onclick=function(){cat.groups.push({id:uid("g"),section:sec.id,name:"Nhóm mới"});refreshGroups();renderAll();scheduleDraft();};
    gw.appendChild(add);
  }
  refreshGroups();

  if(sec.kind==="article"){
    var an=document.createElement("p");an.className="hint";an.innerHTML="Khu vực Kiến thức dùng chung kho bài viết. <b>Viết/sửa bài trong tab “Kiến thức (bài viết)”</b>; mỗi bài chọn nhóm ngay trong phần soạn bài.";
    p.appendChild(an);
    return;
  }

  var ih=h2("Các mục trong "+sec.label);ih.style.fontSize="18px";ih.style.marginTop="22px";p.appendChild(ih);
  var iw=document.createElement("div");p.appendChild(iw);
  function refreshItems(){
    iw.innerHTML="";
    catItems(sec.id).forEach(function(it){
      var card=document.createElement("div");card.className="card-block";
      var gname=(groupById(it.group)||{}).name||"Khác";
      card.innerHTML='<div class="li-head"><div class="li-name"><span class="dot"></span>'+esc(it.title||"(chưa tên)")+' '+
        (it.published===false?'<span style="color:#B8860B;font-weight:500;font-size:12px">· nháp</span>':'')+
        (it.mode==="link"?'<span style="color:var(--teal-deep);font-size:12px">· link ngoài</span>':'')+'</div>'+
        '<div class="li-actions">'+
        '<button class="iconbtn" data-a="up"><svg viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg></button>'+
        '<button class="iconbtn" data-a="down"><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>'+
        '<button class="iconbtn" data-a="edit"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>'+
        '<button class="iconbtn danger" data-a="del"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg></button></div></div>'+
        '<div style="font-size:12.5px;color:var(--text-light)">'+esc(gname)+(it.mode==="link"?" · "+esc(it.url||""):" · /"+esc(sec.slug)+"/"+esc(it.slug)+"/")+'</div>';
      function move(dir){var arr=cat.items,i=arr.indexOf(it),j=i+dir;while(j>=0&&j<arr.length&&arr[j].section!==sec.id)j+=dir;if(j>=0&&j<arr.length){var t=arr[i];arr[i]=arr[j];arr[j]=t;}}
      card.querySelector('[data-a=up]').onclick=function(){move(-1);refreshItems();renderAll();scheduleDraft();};
      card.querySelector('[data-a=down]').onclick=function(){move(1);refreshItems();renderAll();scheduleDraft();};
      card.querySelector('[data-a=edit]').onclick=function(){editCatItem(it,sec);};
      card.querySelector('[data-a=del]').onclick=function(){if(confirm("Xóa mục \""+(it.title||"")+"\"?")){cat.items.splice(cat.items.indexOf(it),1);refreshItems();renderAll();scheduleDraft();toast("Đã xóa mục");}};
      iw.appendChild(card);
    });
    var add=document.createElement("button");add.className="addbtn";add.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Thêm mục mới';
    add.onclick=function(){
      var g0=catGroups(sec.id)[0];
      var ni={id:uid("it"),section:sec.id,group:g0?g0.id:"",slug:"muc-moi-"+Date.now().toString(36),title:"Mục mới",badge:"",excerpt:"",mode:(sec.kind==="doc"?"link":"page"),url:"",body:"<p></p>",cover:"",metaTitle:"",published:false,date:new Date().toISOString().slice(0,10)};
      cat.items.push(ni);editCatItem(ni,sec);
    };
    iw.appendChild(add);
  }
  refreshItems();
}
renderCatalogPanel.cur="";

function editCatItem(item,sec){
  var b=$("#admin-body"); b.innerHTML="";
  var p=document.createElement("div");p.className="panel active";b.appendChild(p);
  var back=document.createElement("button");back.className="addbtn";back.style.cssText="width:auto;margin-bottom:18px;background:var(--green-mist)";
  back.innerHTML='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 18l-6-6 6-6"/></svg> Xong, về danh mục';
  back.onclick=function(){renderPanel();};
  p.appendChild(back);
  p.appendChild(h2("Mục trong "+sec.label));
  var originalSlug=item.slug||"";
  var slugTouched=!!item.slug && item.slug.indexOf("muc-moi-")<0;
  var fSlug=fld("Đường dẫn (slug)",item.slug,function(v){
    var next=catSlugify(v);
    if(slugTouched && originalSlug && next!==originalSlug && item.published===true){
      if(!confirm("Đổi slug sẽ làm thay đổi URL mục này và có thể ảnh hưởng liên kết/SEO của URL cũ. Tiếp tục?")){
        fSlug.querySelector("input").value=item.slug; return;
      }
    }
    slugTouched=true; item.slug=next; originalSlug=next;
  },{ph:"vi-du-duong-dan"});
  p.appendChild(fld("Tên mục",item.title,function(v){item.title=v; if(!slugTouched && item.mode!=="link"){item.slug=catSlugify(v); fSlug.querySelector("input").value=item.slug;}}));
  var g2=document.createElement("div");g2.className="grid2";
  var gsel=catGroups(sec.id).map(function(g){return {v:g.id,t:g.name};}); gsel.unshift({v:"",t:"— Khác —"});
  g2.appendChild(fld("Nhóm",item.group,function(v){item.group=v;},{select:gsel}));
  g2.appendChild(fld("Kiểu",item.mode,function(v){item.mode=v;renderAll();scheduleDraft();editCatItem(item,sec);},{select:[{v:"page",t:"Trang riêng (soạn thảo)"},{v:"html",t:"Nhúng HTML (dán nguyên file)"},{v:"link",t:"Link ngoài (trỏ ra ngoài)"}]}));
  p.appendChild(g2);
  p.appendChild(fld("Nhãn nhỏ (badge, tùy chọn)",item.badge,function(v){item.badge=v;},{ph:"vd: Đang cung cấp · Chủ lực"}));
  p.appendChild(fld("Tóm tắt (hiện ở trang danh sách)",item.excerpt,function(v){item.excerpt=v;},{textarea:true,rows:2}));
  if(item.mode==="link"){
    p.appendChild(fld("Địa chỉ liên kết (URL)",item.url,function(v){item.url=v;},{type:"url",ph:"https://... hoặc / để về trang chủ"}));
    p.appendChild(hint("Mục kiểu <b>Link ngoài</b> chỉ hiện trên trang danh sách và bấm là mở địa chỉ này — không tạo trang riêng trên huydata.vn."));
  } else if(item.mode==="html"){
    if(!String(item.html||"").trim() && item.htmlOnPage && !item._loadTried){
      /* Nội dung văn bản nằm ở trang riêng (không cất trong trang chủ cho nhẹ) → tải về để sửa */
      item._loadTried=true;
      p.appendChild(hint("⏳ Đang tải nội dung văn bản từ trang đã đăng <code>/"+esc(itemPath(sec,item))+"</code>…"));
      ensureHtmlLoaded(sec,item).then(function(ok){ if(!ok) toast("Chưa tải được nội dung văn bản — dán lại file HTML nếu cần sửa"); editCatItem(item,sec); },
        function(){ toast("Chưa tải được nội dung văn bản (mạng?) — thử mở lại"); item._loadTried=false; });
      return;
    }
    p.appendChild(fSlug);
    p.appendChild(fld("Tiêu đề SEO (<title>, để trống dùng tên mục)",item.metaTitle,function(v){item.metaTitle=v;}));
    p.appendChild(hint("Dán <b>nguyên file HTML</b> của tài liệu vào ô dưới (mở file .html của anh, chọn hết, sao chép, dán vào). Khi <b>Xuất bản site</b>, HuyData tạo trang thật <code>/"+esc(sec.slug)+"/"+esc(item.slug||"…")+"/</code> <b>giữ nguyên định dạng</b>, tự thêm thẻ chia sẻ + canonical + thanh nhỏ “← Về HuyData” ở đầu. Traffic/SEO về thẳng huydata.vn."));
    p.appendChild(fld("Mã HTML của tài liệu",item.html,function(v){item.html=v;},{textarea:true,rows:14,ph:"<!DOCTYPE html> … dán cả file vào đây …"}));
    var filePick=document.createElement("div"); filePick.className="fld"; filePick.innerHTML='<label>Hoặc chọn file HTML</label><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button type="button" class="btn btn-ghost" id="pick-html-file">📄 Chọn file .html / .htm</button><span id="html-file-name" style="font-size:12.5px;color:var(--text-light)">'+(item.html?"Đã có nội dung HTML":"Chưa chọn file")+'</span><input id="html-file-input" type="file" accept=".html,.htm,text/html" style="display:none"></div>';
    p.appendChild(filePick);
    var fi=filePick.querySelector("#html-file-input"); filePick.querySelector("#pick-html-file").onclick=function(){fi.click();};
    fi.onchange=function(){var f=fi.files&&fi.files[0]; if(!f)return; if(!/\.(html?|HTML?)$/.test(f.name)&&f.type!=="text/html"){toast("Chỉ chọn file .html hoặc .htm");return;} var r=new FileReader(); r.onload=function(){item.html=String(r.result||""); filePick.querySelector("#html-file-name").textContent=f.name+" · "+Math.ceil(f.size/1024)+" KB"; scheduleDraft(); toast("Đã nạp toàn bộ file HTML");}; r.onerror=function(){toast("Không đọc được file HTML");}; r.readAsText(f);};
  } else if(item.flagship){
    p.appendChild(fSlug);
    p.appendChild(withCounter(fld("Tiêu đề SEO (<title>, để trống dùng tên mục)",item.metaTitle,function(v){item.metaTitle=v;}),60,function(){return realVal(item.metaTitle)||item.title;}));
    p.appendChild(withCounter(fld("Mô tả SEO (để trống thì dùng Tóm tắt)",item.metaDesc||"",function(v){item.metaDesc=v;},{textarea:true,rows:2}),160,function(){return realVal(item.metaDesc)||item.excerpt||"";}));
    p.appendChild(hint("<b>Đây là trang giải pháp chủ lực.</b> Nội dung chi tiết (Bối cảnh, CaPi, Bảng giá, Quy trình, Khách hàng, FAQ…) <b>lấy từ các khối gắn “Trang giải pháp”</b> ở tab <b>Bố cục trang</b> — sửa nội dung ở các tab tương ứng, còn muốn khối nào nằm trên trang này thì chỉnh “Hiện ở” trong Bố cục. Trang tự dựng lại khi xuất bản."));
  } else {
    p.appendChild(fSlug);
    p.appendChild(withUpload(fld("Ảnh bìa (URL, tùy chọn)",item.cover,function(v){item.cover=v;},{ph:"https://... hoặc /anh/... hoặc để trống"}),1600,function(){return item.title;}));
    p.appendChild(withCounter(fld("Tiêu đề SEO (<title>, để trống dùng tên mục)",item.metaTitle,function(v){item.metaTitle=v;}),60,function(){return realVal(item.metaTitle)||item.title;}));
    p.appendChild(withCounter(fld("Mô tả SEO (để trống thì dùng Tóm tắt)",item.metaDesc||"",function(v){item.metaDesc=v;},{textarea:true,rows:2}),160,function(){return realVal(item.metaDesc)||item.excerpt||"";}));
    var lab=document.createElement("label");lab.style.cssText="display:block;font-size:12.5px;font-weight:600;color:var(--green-deep);margin:14px 0 7px";lab.textContent="Nội dung trang";
    p.appendChild(lab);
    var er=makeRichEditor(item.body||"<p></p>",function(html){item.body=html;});
    p.appendChild(er.tools);p.appendChild(er.ed);
  }
  var snap=JSON.stringify([item.title,item.excerpt,item.body,item.html,item.metaTitle,item.metaDesc]);
  if(item.mode!=="link"){
    var pvb=document.createElement("button"); pvb.type="button"; pvb.className="btn btn-ghost"; pvb.style.cssText="margin-top:12px;padding:9px 16px;font-size:13.5px";
    pvb.textContent="👁 Xem trước bản đăng";
    pvb.onclick=function(){
      var html=item.mode==="html"?buildHtmlDocPage(sec,item):((item.flagship&&!String(item.body||"").trim())?buildFlagshipSolutionPage(sec,item):buildItemPage(sec,item));
      previewPage(html, siteURL()+itemPath(sec,item));
    };
    p.appendChild(pvb);
  }
  var pub=document.createElement("div");pub.className="fld";pub.style.marginTop="16px";
  pub.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="cit-pub" '+(item.published!==false?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Xuất bản mục này (hiện trên trang)</label>';
  pub.querySelector("#cit-pub").addEventListener("change",function(e){item.published=e.target.checked;renderAll();scheduleDraft();});
  p.appendChild(pub);
  var save=document.createElement("button");save.className="btn btn-primary";save.style.marginTop="6px";save.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg> Lưu & về danh mục';
  save.onclick=function(){ if(item.mode!=="link"&&!item.excerpt)item.excerpt=stripTags(item.body||"").slice(0,140);
    if(JSON.stringify([item.title,item.excerpt,item.body,item.html,item.metaTitle,item.metaDesc])!==snap) item.updated=new Date().toISOString().slice(0,10);
    renderAll();scheduleDraft();toast("Đã lưu — nhớ Xuất bản site (.zip) rồi tải lên"); renderPanel(); };
  p.appendChild(save);
}

function renderBlogPanel(p){
  var b=content.blog;
  p.appendChild(h2("Bài viết"));
  p.appendChild(hint("Bật/tắt mục bài viết, viết bài mới bằng trình soạn thảo có nút định dạng. Bài chưa \"Xuất bản\" sẽ không hiện trên trang."));
  var en=document.createElement("div");en.className="fld";
  en.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="blog-en" '+(b.enabled?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Hiện mục Bài viết trên trang</label>';
  en.querySelector("#blog-en").addEventListener("change",function(e){b.enabled=e.target.checked;renderAll();scheduleDraft();});
  p.appendChild(en);
  var g=document.createElement("div");g.className="grid2";
  g.appendChild(fld("Nhãn mục",b.eyebrow,function(v){b.eyebrow=v;}));
  g.appendChild(fld("Tiêu đề mục",b.title,function(v){b.title=v;}));
  p.appendChild(g);
  p.appendChild(fld("Mô tả mục",b.intro,function(v){b.intro=v;},{textarea:true,rows:2}));
  var listWrap=document.createElement("div");
  function refresh(){
    listWrap.innerHTML="";
    b.posts.forEach(function(post,idx){
      var card=document.createElement("div");card.className="card-block";
      card.innerHTML='<div class="li-head"><div class="li-name"><span class="dot"></span>'+esc(post.title||"(chưa có tiêu đề)")+' '+(post.published?'':'<span style="color:#B8860B;font-weight:500;font-size:12px">· nháp</span>')+'</div>'+
        '<div class="li-actions">'+
        '<button class="iconbtn" data-a="up" title="Lên"><svg viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg></button>'+
        '<button class="iconbtn" data-a="down" title="Xuống"><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>'+
        '<button class="iconbtn" data-a="edit" title="Sửa"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>'+
        '<button class="iconbtn danger" data-a="del" title="Xóa"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg></button></div></div>'+
        '<div style="font-size:12.5px;color:var(--text-light)">'+esc(fmtDate(post.date))+' · /'+esc(post.slug)+'</div>';
      card.querySelector('[data-a=up]').onclick=function(){if(idx>0){b.posts.splice(idx-1,0,b.posts.splice(idx,1)[0]);refresh();renderAll();scheduleDraft();}};
      card.querySelector('[data-a=down]').onclick=function(){if(idx<b.posts.length-1){b.posts.splice(idx+1,0,b.posts.splice(idx,1)[0]);refresh();renderAll();scheduleDraft();}};
      card.querySelector('[data-a=del]').onclick=function(){if(confirm("Xóa bài \""+(post.title||"")+"\"?")){b.posts.splice(idx,1);refresh();renderAll();scheduleDraft();toast("Đã xóa bài");}};
      card.querySelector('[data-a=edit]').onclick=function(){editPost(post);};
      listWrap.appendChild(card);
    });
    var add=document.createElement("button");add.className="addbtn";add.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Viết bài mới';
    add.onclick=function(){var np={id:"p"+Date.now(),slug:"bai-viet-moi-"+Date.now().toString(36),title:"Bài viết mới",date:new Date().toISOString().slice(0,10),excerpt:"",cover:"",published:false,body:"<p></p>"};b.posts.unshift(np);editPost(np);};
    listWrap.appendChild(add);
  }
  refresh();
  p.appendChild(listWrap);
}


function editPost(post){
  var b=$("#admin-body"); b.innerHTML="";
  var p=document.createElement("div");p.className="panel active";b.appendChild(p);
  var back=document.createElement("button");back.className="addbtn";back.style.cssText="width:auto;margin-bottom:18px;background:var(--green-mist)";
  back.innerHTML='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 18l-6-6 6-6"/></svg> Xong, về danh sách bài';
  back.onclick=function(){renderPanel();};
  p.appendChild(back);
  p.appendChild(h2(post.published?"Sửa bài viết":"Bài viết mới"));
  var originalSlug=post.slug||"";
  var slugTouched = !!post.slug && post.slug.indexOf("bai-viet-moi-")<0;
  var fSlug=fld("Đường dẫn (slug)",post.slug,function(v){
    var next=slugify(v);
    if(slugTouched && originalSlug && next!==originalSlug && post.published===true){
      if(!confirm("Đổi slug sẽ làm thay đổi URL bài viết và có thể ảnh hưởng liên kết/SEO của URL cũ. Tiếp tục?")){
        fSlug.querySelector("input").value=post.slug; return;
      }
    }
    slugTouched=true; post.slug=next; originalSlug=next;
  },{ph:"vi-du-duong-dan"});
  p.appendChild(fld("Tiêu đề bài",post.title,function(v){post.title=v; if(!slugTouched){post.slug=slugify(v); fSlug.querySelector("input").value=post.slug;}}));
  var g=document.createElement("div");g.className="grid2";
  g.appendChild(fld("Ngày đăng",post.date,function(v){post.date=v;},{type:"date"}));
  g.appendChild(fld("Ngày cập nhật (khi sửa nội dung đáng kể)",post.updated||"",function(v){post.updated=v;},{type:"date"}));
  p.appendChild(g);
  p.appendChild(fSlug);
  var ktg=catGroups("kien-thuc").map(function(gr){return {v:gr.id,t:gr.name};}); ktg.unshift({v:"",t:"— Chưa phân loại —"});
  p.appendChild(fld("Nhóm (phân loại Kiến thức)",post.group||"",function(v){post.group=v;},{select:ktg,sub:"quản lý danh sách nhóm ở tab “Danh mục & Trang riêng”"}));
  p.appendChild(withUpload(fld("Ảnh bìa (URL, tùy chọn — nên 1200×630 để chia sẻ đẹp)",post.cover,function(v){post.cover=v;},{ph:"https://... hoặc /anh/... hoặc để trống"}),1600,function(){return post.title;}));
  p.appendChild(withCounter(fld("Tiêu đề SEO (thẻ <title>, để trống thì dùng tiêu đề bài)",post.metaTitle,function(v){post.metaTitle=v;},{ph:"ngắn gọn, dưới 60 ký tự"}),60,function(){return realVal(post.metaTitle)||post.title;}));
  p.appendChild(fld("Tóm tắt (hiện trên thẻ bài & đầu bài)",post.excerpt,function(v){post.excerpt=v;},{textarea:true,rows:2}));
  p.appendChild(withCounter(fld("Mô tả SEO (hiện dưới tiêu đề trên Google — để trống thì dùng Tóm tắt)",post.metaDesc||"",function(v){post.metaDesc=v;},{textarea:true,rows:2}),160,function(){return realVal(post.metaDesc)||post.excerpt||"";}));
  var lab=document.createElement("label");lab.style.cssText="display:block;font-size:12.5px;font-weight:600;color:var(--green-deep);margin-bottom:7px";lab.textContent="Nội dung bài viết";
  p.appendChild(lab);
  var rich=makeRichEditor(post.body||"<p></p>",function(html){ post.body=html; });
  var ed=rich.ed;
  p.appendChild(rich.tools); p.appendChild(ed);
  p.appendChild(seoChecklist(post,ed));
  var pvb=document.createElement("button"); pvb.type="button"; pvb.className="btn btn-ghost"; pvb.style.cssText="margin-top:12px;padding:9px 16px;font-size:13.5px";
  pvb.textContent="👁 Xem trước bản đăng";
  pvb.onclick=function(){ post.body=sanitize(ed.innerHTML,"post"); previewPage(buildPostPage(post), postAbsURL(post.slug)); };
  p.appendChild(pvb);
  var pubWrap=document.createElement("div");pubWrap.className="fld";pubWrap.style.marginTop="18px";
  pubWrap.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="pub" '+(post.published?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Xuất bản bài này (hiện trên trang)</label>';
  pubWrap.querySelector("#pub").addEventListener("change",function(e){post.published=e.target.checked;renderAll();scheduleDraft();});
  p.appendChild(pubWrap);
  var save=document.createElement("button");save.className="btn btn-primary";save.style.marginTop="6px";save.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg> Lưu bài & về danh sách';
  save.onclick=function(){ post.body=sanitize(ed.innerHTML,"post"); if(!post.excerpt)post.excerpt=stripTags(post.body).slice(0,140); renderAll();scheduleDraft();toast("Đã lưu bài — nhớ bấm Xuất bản site (.zip) rồi tải lên thì khách mới thấy"); renderPanel(); };
  p.appendChild(save);
}

function download(name,text,mime){
  var blob=new Blob([text],{type:mime||"text/plain"});var url=URL.createObjectURL(blob);
  var a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(url);a.remove();},400);
}
function exportJSON(){ download("HuyData_noidung.json",JSON.stringify(content,null,2),"application/json"); toast("Đã tải file nội dung .json"); }
function importJSON(){
  var inp=document.createElement("input");inp.type="file";inp.accept="application/json,.json";
  inp.onchange=function(){ var f=inp.files[0]; if(!f)return; var r=new FileReader();
    r.onload=function(){ try{ content=deepMerge(clone(DEFAULT),JSON.parse(r.result)); renderAll(); buildAdmin(); scheduleDraft(); toast("Đã nhập nội dung từ file"); }catch(e){ toast("File không hợp lệ"); } };
    r.readAsText(f); };
  inp.click();
}
function plainSnapshot(){
  // Bản chữ thuần của trang, dành cho trình quét không chạy JS (Zalo, Facebook, Cốc Cốc, Bing).
  // Nội dung y hệt bản người đọc thấy — không phải kỹ thuật che giấu.
  var c=content, s=c.settings, out=[];
  function esq(x){return String(x==null?"":x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  function H(n,t){ t=String(t==null?"":t).trim(); if(!t||/^\(\s*Điền/i.test(t)) return; out.push("<h"+n+">"+esq(stripTags(sanitize(t.replace(/<br\s*\/?>/gi," "),"inline")))+"</h"+n+">"); }
  function real(t){ t=String(t==null?"":t).trim(); return /^\(\s*Điền/i.test(t)?"":t; }
  function P(t){ t=real(t); if(t) out.push("<p>"+esq(t)+"</p>"); }
  function UL(a,f){ if(!a||!a.length) return; var li=a.map(function(x){return real(f(x)).replace(/\s*—\s*$/,"").replace(/^\s*—\s*/,"");}).filter(Boolean);
    if(li.length) out.push("<ul>"+li.map(function(x){return "<li>"+esq(x)+"</li>";}).join("")+"</ul>"); }
  /* Chỉ đưa vào những khối đang HIỆN trên trang chủ — bản chữ thuần phải khớp thứ khách nhìn thấy */
  var vis=homeShows;
  H(1,c.hero.title); if(c.hero.kw) H(2,c.hero.kw); P(c.hero.sub);
  P(String(s.brandName||"HuyData")+" — "+(s.sub||"")+". "+(s.slogan||"")+(s.coSlogan?" "+s.coSlogan:""));
  if(vis("boi-canh")){ H(2,c.pain.title); P(c.pain.intro); UL(c.pain.items,function(x){return x.title+" — "+x.desc;}); }
  if(vis("vi-sao")){ H(2,c.why.title); P(c.why.intro); UL(c.why.cards,function(x){return x.title+" — "+x.desc;}); }
  if(vis("giai-phap")){ H(2,c.solutions.title); P(c.solutions.intro);
    (c.solutions.groups||[]).forEach(function(g){ H(3,g.name); P(g.tagline); UL(g.items,function(x){return x.name+" — "+x.desc;}); }); }
  if(vis("bang-gia")){ H(2,c.pricing.title); P(c.pricing.intro);
    UL(c.pricing.tiers,function(t){return t.name+": "+t.price+" "+(t.period||"")+" — "+(t.desc||"");}); P(c.pricing.note); }
  if(vis("quyet-dinh")){ H(2,c.decision.title); P(c.decision.intro); UL(c.decision.rungs,function(x){return x.title+" — "+x.desc;}); }
  if(vis("khach-hang")){ H(2,c.who.title); P(c.who.intro); UL(c.who.cards,function(x){return x.title+" — "+x.desc;}); }
  if(vis("cau-chuyen")){ H(2,c.stories.title); P(c.stories.intro);
    (c.stories.items||[]).forEach(function(x){ H(3,x.name+" — "+x.place); P(x.biz); P(x.quote); }); P(c.stories.note); }
  if(vis("quy-trinh")){ H(2,c.process.title); P(c.process.intro);
    UL(c.process.steps,function(x){return x.k+": "+x.title+" — "+x.desc;}); H(3,c.process.sampleTitle); P(c.process.sampleBody); }
  if(vis("cong-tac-vien")){ H(2,c.ctv.title); P(c.ctv.intro);
    if(c.ctv.showMembers===true) UL(c.ctv.members,function(x){return [real(x.name),real(x.area),real(x.note)].filter(Boolean).join(" — ");});
    else if((c.ctv.areas||[]).length) P("Địa bàn đang phục vụ: "+c.ctv.areas.map(real).filter(Boolean).join(", "));
    H(3,c.ctv.ctaTitle); P(c.ctv.ctaBody); }
  /* Dẫn tới các trang dịch vụ / công cụ — nơi chứa nội dung chi tiết */
  var pages=internalPages().filter(function(x){return x.u!=="/" && !/^\/#/.test(x.u) && x.g!=="Bài viết";});
  if(pages.length) out.push("<ul>"+pages.map(function(x){return '<li><a href="'+esq(x.u.replace(/^\//,""))+'">'+esq(x.t)+"</a></li>";}).join("")+"</ul>");
  var pp=pubPosts();
  if(pp.length && vis("bai-viet")){ H(2,(c.blog&&c.blog.title)||"Bài viết");
    out.push("<ul>"+pp.map(function(p){return '<li><a href="'+esq(postPath(p.slug))+'">'+esq(p.title)+"</a> — "+esq(p.excerpt||"")+"</li>";}).join("")+"</ul>"); }
  if(vis("con-lam-gi")){ H(2,c.more.title); P(c.more.intro);
    UL(c.more.items,function(x){return x.name+(realVal(x.desc)?" — "+realVal(x.desc):"");}); P(c.more.note); }
  if(vis("rieng-tu")){ H(2,c.privacy.title); P(c.privacy.intro); UL(c.privacy.items,function(x){return x.title+" — "+x.desc;}); }
  if(vis("faq")){ H(2,c.faq.title);
    (c.faq.items||[]).forEach(function(x){ H(3,x.q); P(x.a); }); }
  if(vis("ve-huydata")){ H(2,c.about.eyebrow); P(c.about.quote); P(c.about.body); }
  H(2,c.contact.title); P(c.contact.sub);
  var lg=s.legal||{};
  P([real(lg.entity),real(lg.taxCode)?("Mã số hộ kinh doanh "+real(lg.taxCode)):"",real(lg.address),real(lg.owner)].filter(Boolean).join(" · "));
  P("Liên hệ: Zalo "+(s.zaloText||"")+" · Điện thoại "+(s.phoneText||"")+" · "+(s.email||""));
  return out.join("\n");
}
function seoFiles(){
  var u=siteURL(), today=new Date().toISOString().slice(0,10), posts=pubPosts();
  var urls=[{loc:u,pri:"1.0",cf:"weekly",lm:today}];
  reconcileCatalog();
  function lm(x){ var d=[x.updated,x.date].filter(function(v){return /^\d{4}-\d{2}-\d{2}$/.test(String(v||""));}).sort().pop(); return (d&&d<=today)?d:today; }
  catSections().forEach(function(sec){
    if(!sectionHasContent(sec.id)) return;
    var secUrl={loc:u+sectionPath(sec),pri:"0.7",cf:"weekly",lm:""}; urls.push(secUrl);
    var kids=[];
    if(isArticleSection(sec)){
      posts.forEach(function(p){ var d=lm(p); kids.push(d); urls.push({loc:postAbsURL(p.slug),pri:"0.8",cf:"monthly",lm:d}); });
    } else {
      pubItems(sec.id).forEach(function(it){ var d=lm(it); kids.push(d); if(itemIsPage(it)) urls.push({loc:u+itemPath(sec,it),pri:"0.6",cf:"monthly",lm:d}); });
    }
    /* Trang danh sách đổi khi có mục mới/sửa → lấy ngày mới nhất của các mục bên trong */
    secUrl.lm=kids.sort().pop()||today;
  });
  var sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
    urls.map(function(x){return "  <url>\n    <loc>"+x.loc+"</loc>\n    <lastmod>"+x.lm+"</lastmod>\n    <changefreq>"+x.cf+"</changefreq>\n    <priority>"+x.pri+"</priority>\n  </url>";}).join("\n")+
    "\n</urlset>\n";
  var robots="User-agent: *\nAllow: /\nDisallow: /_old/\n\nSitemap: "+u+"sitemap.xml\n";
  return {sitemap:sitemap,robots:robots};
}
/* ==================================================================
   XUẤT BẢN SITE NHIỀU TRANG — mỗi bài viết là một trang HTML thật
   Địa chỉ: huydata.vn/bai-viet/<slug>/  (không dùng dấu #)
   Lý do: Google cắt bỏ mọi thứ sau dấu "#", nên bài viết trong bản
   một-file cũ không bao giờ được lập chỉ mục thành trang riêng.
   ================================================================== */

/* ZALO_IC đã khai báo ở trên */

/* ---------- Địa chỉ ---------- */
/* Ảnh trong bài: tải lười, giải mã nền, luôn có alt để không bị báo lỗi trợ năng */
function prepStaticImages(root){
  Array.prototype.forEach.call(root.querySelectorAll("img"),function(im,i){
    if(i>0) im.setAttribute("loading","lazy");
    im.setAttribute("decoding","async");
    if(!im.hasAttribute("alt")) im.setAttribute("alt","");
  });
}
/* Nút chia sẻ cuối bài: Facebook mở trực tiếp; "Sao chép link" để dán vào Zalo (cần /site.js, không có JS thì nút tự ẩn) */
function shareBlock(url,title){
  var fb="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url);
  return '<div class="share"><span>Thấy hữu ích? Gửi cho người cần:</span>'+
    '<a class="sbtn" href="'+esc(fb)+'" target="_blank" rel="noopener noreferrer">Chia sẻ Facebook</a>'+
    '<button class="sbtn" type="button" data-copy="'+esc(url)+'" hidden>Sao chép link (dán vào Zalo)</button></div>';
}
function readMinutes(html){ var w=stripTags(html||"").split(/\s+/).filter(Boolean).length; return Math.max(1,Math.round(w/220)); }
/* Hộp tác giả cuối bài: nội dung thuế là chủ đề “ảnh hưởng tiền bạc” — Google coi trọng việc biết ai viết */
function authorBox(up){
  var a=content.about||{}, name=realVal(a.name); if(!name) return "";
  var mark=safeSrc(a.photo)?'<img class="au-photo" src="'+esc(relURL(a.photo,up))+'" alt="'+esc(name)+'" width="64" height="64" loading="lazy" decoding="async">':'<div class="au-mark">'+esc(name.split(" ").pop().charAt(0))+'</div>';
  return '<aside class="author" aria-label="Tác giả">'+mark+'<div>'+
    '<div class="au-name">'+esc(name)+'</div>'+(realVal(a.role)?'<div class="au-role">'+esc(a.role)+'</div>':'')+
    (realVal(a.quote)?'<p>'+esc(a.quote)+' <a href="'+esc(up)+'#ve-huydata">Về HuyData →</a></p>':'')+'</div></aside>';
}
function faviconHref(){ var l=document.querySelector('link[rel="icon"]'); return l?l.getAttribute("href"):""; }
function fontsHref(){ var l=document.querySelector('link[href*="fonts.googleapis.com/css2"]'); return l?l.getAttribute("href"):""; }

/* ---------- Giao diện dùng chung cho các trang tĩnh ---------- */
function pageCSS(){ return [
":root{--green-deep:#1A3D2B;--green-darkest:#102A1D;--green-mid:#2D6A4F;--green-soft:#74C69D;--green-pale:#B7E4C7;--green-mist:#D8F3DC;--teal-deep:#0E5C4A;--teal:#168F6F;--teal-bright:#2DD4A8;--cream:#F8F5EE;--warm-white:#FDFCF8;--text-dark:#1A2E1F;--text-mid:#3D5A45;--text-light:#6B8F72;--line:rgba(26,61,43,.10);--serif:'Cormorant Garamond',Georgia,'Times New Roman',serif;--sans:'Be Vietnam Pro',system-ui,-apple-system,'Segoe UI',sans-serif}",
"*{margin:0;padding:0;box-sizing:border-box}",
"body{font-family:var(--sans);background:var(--warm-white);color:var(--text-dark);line-height:1.75;-webkit-font-smoothing:antialiased}",
"a{color:var(--teal-deep);text-decoration:none}a:hover{text-decoration:underline}",
"img{max-width:100%;height:auto;display:block;border-radius:12px}",
".wrap{max-width:760px;margin:0 auto;padding:0 24px}",
".sh{border-bottom:1px solid var(--line);background:rgba(253,252,248,.94);backdrop-filter:blur(10px);position:sticky;top:0;z-index:10}",
".sh .wrap,.sf .wrap{max-width:1100px}",
".sh-in{display:flex;align-items:center;gap:20px;height:66px}",
".sh-brand{display:flex;align-items:center;gap:11px;color:inherit}.sh-brand:hover{text-decoration:none}",
".sh-brand svg{width:34px;height:34px;border-radius:9px;flex:none}",
".sh-brand b{font-size:19px;font-weight:600;color:var(--green-deep);display:block;line-height:1}",
".sh-brand i{font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:var(--text-light);font-style:normal;display:block;margin-top:4px}",
".sh-brand .accent{color:var(--teal)}",
".sh-nav{display:flex;gap:20px;margin-left:auto}",
".sh-nav a{font-size:14px;font-weight:500;color:var(--text-mid)}.sh-nav a:hover{color:var(--teal-deep);text-decoration:none}",
".zbtn{display:inline-flex;align-items:center;gap:8px;background:var(--teal);color:#fff;padding:11px 20px;border-radius:999px;font-size:14px;font-weight:500;white-space:nowrap}",
".zbtn:hover{background:var(--teal-deep);text-decoration:none}.zbtn svg{width:17px;height:17px;fill:currentColor}",
".zbtn .zic{width:20px;height:20px}",
"@media(max-width:820px){.sh-nav{display:none}.sh-brand i{display:none}}",
".sh-menu{display:none;position:relative}",
".sh-menu summary{list-style:none;cursor:pointer;width:42px;height:42px;border:1px solid var(--line);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}",
".sh-menu summary::-webkit-details-marker{display:none}",
".sh-menu summary span{display:block;width:18px;height:2px;border-radius:2px;background:var(--green-deep)}",
".sh-menu nav{position:absolute;right:0;top:50px;min-width:220px;background:var(--warm-white);border:1px solid var(--line);border-radius:14px;box-shadow:0 18px 40px rgba(16,42,29,.14);padding:8px;display:flex;flex-direction:column}",
".sh-menu nav a{padding:11px 14px;border-radius:9px;font-size:15px;font-weight:500;color:var(--green-deep)}.sh-menu nav a:hover{background:var(--green-mist);text-decoration:none}",
"@media(max-width:820px){.sh-menu{display:block}.sh-in{gap:10px}.zbtn{margin-left:auto;padding:10px 14px}}",
"@media(max-width:420px){.zbtn .zt{display:none}}",
".prose h4{font-weight:600;font-size:17.5px;color:var(--green-deep);margin:24px 0 8px}",
".prose table{width:100%;border-collapse:collapse;margin:24px 0;font-size:15px;display:block;overflow-x:auto}",
".prose th,.prose td{border:1px solid var(--line);padding:10px 12px;text-align:left;vertical-align:top}",
".prose th{background:var(--green-mist);color:var(--green-deep);font-weight:600}",
".prose caption{caption-side:bottom;font-size:13px;color:var(--text-light);padding-top:8px}",
".prose figure{margin:28px 0}.prose figure img{margin:0}.prose figcaption{font-size:13.5px;color:var(--text-light);margin-top:8px;text-align:center}",
".author{display:flex;gap:16px;align-items:flex-start;margin-top:44px;padding:22px;border:1px solid var(--line);border-radius:16px;background:var(--cream)}",
".au-mark{flex:none;width:52px;height:52px;border-radius:50%;background:var(--green-darkest);color:var(--teal-bright);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:24px;font-weight:600}",
".au-name{font-weight:600;color:var(--green-deep);font-size:16px}.au-role{font-size:13px;color:var(--text-light);margin-bottom:6px}",
".author p{font-size:14.5px;color:var(--text-mid);margin:0;line-height:1.65}",
".au-photo{flex:none;width:64px;height:64px;border-radius:50%;object-fit:cover;margin:0!important}",
".share{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:36px;font-size:14px;color:var(--text-mid)}",
".sbtn{display:inline-flex;align-items:center;padding:9px 16px;border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--green-deep);font:500 14px var(--sans);cursor:pointer}",
".sbtn:hover{border-color:var(--teal);text-decoration:none}",
".bc{font-size:13px;color:var(--text-light);padding:24px 0 0}.bc a{color:var(--text-light)}.bc span{opacity:.5;margin:0 6px}",
"article{padding:0 0 10px}",
".a-date{font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:var(--teal);font-weight:600;margin:26px 0 12px}",
"h1{font-family:var(--serif);font-weight:500;font-size:clamp(30px,5.4vw,46px);line-height:1.14;color:var(--green-deep);letter-spacing:.2px}",
".a-lead{font-size:17.5px;font-weight:300;color:var(--text-mid);margin-top:18px;line-height:1.7}",
".a-cover{margin:32px 0}",
".prose{margin-top:34px;font-size:17px}",
".prose h2{font-family:var(--serif);font-weight:500;font-size:29px;color:var(--green-deep);margin:46px 0 14px;line-height:1.2;scroll-margin-top:86px}",
".prose h3{font-family:var(--serif);font-weight:600;font-size:22px;color:var(--green-mid);margin:32px 0 10px}",
".prose p{margin:0 0 18px}.prose ul,.prose ol{margin:0 0 20px 22px}.prose li{margin-bottom:8px}",
".prose blockquote{border-left:3px solid var(--teal-bright);padding:4px 0 4px 20px;margin:26px 0;color:var(--text-mid);font-style:italic}",
".prose img{margin:28px 0}.prose strong{font-weight:600;color:var(--green-deep)}.prose a{text-decoration:underline}",
".toc{background:var(--cream);border:1px solid var(--line);border-radius:14px;padding:20px 24px;margin-top:32px}",
".toc b{display:block;font-size:11.5px;letter-spacing:1.6px;text-transform:uppercase;color:var(--teal-deep);margin-bottom:10px;font-weight:600}",
".toc ol{margin:0 0 0 18px}.toc li{margin:5px 0;font-size:15px}",
".cta{background:var(--green-darkest);color:var(--cream);border-radius:20px;padding:34px 32px;margin-top:50px}",
".cta h2{font-family:var(--serif);font-weight:500;font-size:27px;color:#fff;margin-bottom:10px;line-height:1.22}",
".cta p{color:var(--green-pale);font-weight:300;margin-bottom:22px;font-size:15.5px}",
".cta .zbtn{background:var(--teal-bright);color:var(--green-darkest);font-weight:600}.cta .zbtn:hover{background:#fff}",
".rel{margin-top:56px;border-top:1px solid var(--line);padding-top:30px}",
".rel h2{font-family:var(--serif);font-weight:500;font-size:24px;color:var(--green-deep);margin-bottom:12px}",
".rel ul,.plist{list-style:none}",
".rel li{padding:14px 0;border-bottom:1px solid var(--line)}",
".rel a{font-size:16.5px;color:var(--green-deep);font-weight:500}",
".rel em{display:block;font-size:13.5px;color:var(--text-light);font-weight:300;font-style:normal;margin-top:3px}",
".page-head{padding:34px 0 0}.page-head h1{font-size:clamp(28px,5vw,40px)}",
".page-head .sub{font-size:17px;color:var(--text-mid);font-weight:300;margin-top:14px}",
".plist{margin:30px 0 10px}",
".plist li{padding:24px 0;border-bottom:1px solid var(--line)}",
".plist .d{font-size:11.5px;letter-spacing:1.1px;text-transform:uppercase;color:var(--teal);font-weight:600}",
".plist a{font-family:var(--serif);font-size:26px;color:var(--green-deep);line-height:1.2;display:block;margin:6px 0}",
".plist a:hover{color:var(--teal-deep);text-decoration:none}",
".plist p{font-size:15px;color:var(--text-mid);font-weight:300}",
".sf{background:var(--green-darkest);color:var(--green-pale);padding:46px 0;margin-top:64px;font-size:14.5px}",
".sf a{color:var(--teal-bright)}",
".sf-cta{font-size:16.5px;color:var(--cream);margin-bottom:16px}",
".sf-legal{font-size:13.5px;color:var(--green-soft);margin-bottom:8px}",
".sf-slogan{font-family:var(--serif);font-style:italic;font-size:15.5px;color:var(--green-soft);margin-bottom:10px}",
".sf-meta{font-size:13px;color:var(--text-light)}",
".nf{padding:70px 0 40px;text-align:center}.nf h1{margin-bottom:16px}.nf p{color:var(--text-mid);font-weight:300;font-size:17px;margin-bottom:26px}",
".sec-hero{background:linear-gradient(180deg,var(--green-mist),var(--warm-white));border-bottom:1px solid var(--line);padding:26px 0 30px;margin-bottom:10px}",
".sec-hero .bc{padding-top:0;margin-bottom:14px}",
".sec-hero .eyebrow{display:inline-block;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:var(--teal-deep);font-weight:600;margin-bottom:10px}",
".sec-hero h1{font-family:var(--serif);font-weight:500;font-size:clamp(28px,5vw,40px);line-height:1.14;color:var(--green-deep)}",
".sec-hero p{font-size:16.5px;color:var(--text-mid);font-weight:300;margin-top:14px;max-width:620px;line-height:1.7}",
".sec-group{margin-top:36px}",
".sec-group>h2{font-family:var(--serif);font-weight:500;font-size:23px;color:var(--green-deep);margin-bottom:16px}",
".item-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}",
".item-card{display:flex;flex-direction:column;background:var(--warm-white);border:1px solid var(--line);border-radius:16px;padding:22px;transition:transform .3s,box-shadow .3s,border-color .3s}",
".item-card:hover{transform:translateY(-4px);border-color:var(--teal-bright);box-shadow:0 14px 32px rgba(16,42,29,.10);text-decoration:none}",
".item-card .ic-tag{font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--teal-deep);margin-bottom:9px}",
".item-card h3{font-family:var(--serif);font-weight:600;font-size:20px;color:var(--green-deep);line-height:1.25}",
".item-card .ic-ext{color:var(--text-light);font-weight:400}",
".item-card p{font-size:14px;font-weight:300;color:var(--text-mid);line-height:1.6;margin-top:8px;flex:1}",
".ic-more{display:inline-flex;align-items:center;gap:6px;margin-top:15px;font-size:13px;font-weight:600;color:var(--teal-deep)}",
".ic-more svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2}",
"@media(max-width:640px){.item-grid{grid-template-columns:1fr}}"
].join("\n"); }

function staticHeader(up){
  var s=content.settings;
  var links='<a href="'+esc(up)+'">Trang chủ</a>'+
      catNavSections().map(function(sec){ return '<a href="'+esc(up+sectionPath(sec))+'">'+esc(sec.label)+'</a>'; }).join('')+
      '<a href="'+esc(up)+'#lien-he">Liên hệ</a>';
  return '<header class="sh"><div class="wrap sh-in">'+
    '<a class="sh-brand" href="'+esc(up)+'">'+LOGO+'<span><b>'+brandName(s)+'</b><i>'+esc(s.sub||"")+'</i></span></a>'+
    '<nav class="sh-nav" aria-label="Điều hướng">'+links+'</nav>'+
    '<a class="zbtn" href="'+esc(zaloURL(s))+'" target="_blank" rel="noopener noreferrer">'+ZALO_IC+'<span class="zt"> Nhắn</span> Zalo</a>'+
    /* Menu điện thoại không cần JavaScript (trang tĩnh chặn script) */
    '<details class="sh-menu"><summary aria-label="Mở menu"><span></span><span></span><span></span></summary><nav aria-label="Điều hướng">'+links+'</nav></details>'+
    '</div></header>';
}
function staticFooter(up){
  var s=content.settings, lg=s.legal||{};
  var legalLine=[realVal(lg.entity),realVal(lg.taxCode)?("Mã số hộ kinh doanh "+realVal(lg.taxCode)):"",realVal(lg.address),realVal(lg.owner)].filter(Boolean).join(" · ");
  return '<footer class="sf"><div class="wrap">'+
    '<p class="sf-cta">Cần người lo phần sổ sách? Nhắn Zalo <a href="'+esc(zaloURL(s))+'" target="_blank" rel="noopener noreferrer">'+esc(s.zaloText||"")+'</a>'+((s.phoneText&&s.phoneText!==s.zaloText)?' — hoặc gọi '+esc(s.phoneText):'')+'.</p>'+
    (legalLine?'<p class="sf-legal">'+esc(legalLine)+'</p>':'')+
    (s.coSlogan?'<p class="sf-slogan">'+esc(s.coSlogan)+'</p>':'')+
    '<p class="sf-meta">'+esc(s.copyright||"")+' · <a href="'+esc(up)+'">Trang chủ</a> · <a href="'+esc(up)+'bai-viet/">Bài viết</a>'+(homeShows("rieng-tu")?' · <a href="'+esc(up)+'#rieng-tu">Riêng tư</a>':'')+(homeShows("ve-huydata")?' · <a href="'+esc(up)+'#ve-huydata">Về HuyData</a>':'')+'</p>'+
    '</div></footer>';
}
function ctaBlock(){
  var s=content.settings;
  return '<section class="cta"><h2>'+esc(s.slogan||("Cứ lo bán hàng, sổ sách đã có "+(s.brandName||"HuyData")))+'.</h2>'+
    '<p>Ghi sổ doanh thu, nhắc hạn, hướng dẫn tận nơi — giải pháp cho hộ kinh doanh ở '+esc(s.location||"Chợ Lách")+'. Nhắn một tin, HuyData gọi lại tư vấn miễn phí.</p>'+
    '<a class="zbtn" href="'+esc(zaloURL(s))+'" target="_blank" rel="noopener noreferrer">'+ZALO_IC+' Nhắn Zalo '+esc(s.zaloText||"")+'</a></section>';
}
function staticPage(o){
  var img=absURL(o.image||"");
  return '<!DOCTYPE html>\n<html lang="vi"><head>\n'+
  '<meta charset="UTF-8">\n'+
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'+
  '<title>'+esc(o.title)+'</title>\n'+
  '<meta name="description" content="'+esc(o.desc)+'">\n'+
  (o.noindex?'':'<link rel="canonical" href="'+esc(o.canonical)+'">\n')+
  '<meta name="robots" content="'+(o.noindex?'noindex,follow':'index,follow,max-image-preview:large')+'">\n'+
  '<meta property="og:type" content="'+esc(o.ogType||"website")+'">\n'+
  '<meta property="og:site_name" content="'+esc(content.settings.brandName||"HuyData")+'">\n'+
  (o.published?'<meta property="article:published_time" content="'+esc(o.published)+'">\n':'')+
  (o.modified?'<meta property="article:modified_time" content="'+esc(o.modified)+'">\n':'')+
  '<meta property="og:title" content="'+esc(o.title)+'">\n'+
  '<meta property="og:description" content="'+esc(o.desc)+'">\n'+
  '<meta property="og:url" content="'+esc(o.canonical)+'">\n'+
  '<meta property="og:locale" content="vi_VN">\n'+
  (img?'<meta property="og:image" content="'+esc(img)+'">\n':'')+
  '<meta name="twitter:card" content="'+(img?'summary_large_image':'summary')+'">\n'+
  '<meta name="twitter:title" content="'+esc(o.title)+'">\n'+
  '<meta name="twitter:description" content="'+esc(o.desc)+'">\n'+
  (img?'<meta name="twitter:image" content="'+esc(img)+'">\n':'')+
  '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; base-uri \'self\'; form-action \'none\'; img-src \'self\' data: https:; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src \'self\' https://www.googletagmanager.com; connect-src \'self\' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; object-src \'none\'">\n'+
  '<meta name="referrer" content="strict-origin-when-cross-origin">\n'+
  '<meta name="color-scheme" content="light">\n'+
  '<link rel="icon" href="'+esc(faviconHref())+'">\n'+
  '<link rel="apple-touch-icon" href="/favicon.png">\n'+
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n'+
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'+
  '<link href="'+esc(fontsHref())+'" rel="stylesheet">\n'+
  (o.ld?'<script type="application/ld+json">'+o.ld.replace(/</g,"\\u003c")+'<\/script>\n':'')+
  '<style>\n'+pageCSS()+'\n</style>\n'+
  '</head>\n<body>\n'+o.body+'\n<script src="/site.js" defer><\/script>\n</body></html>\n';
}

/* ---------- Trang bài viết ---------- */
function buildPostPage(p){
  var s=content.settings, up="../../", url=postAbsURL(p.slug);
  var d=document.createElement("div");
  d.innerHTML=sanitize(p.body,"post");
  /* đổi đường dẫn tương đối trong bài cho đúng với thư mục con */
  Array.prototype.forEach.call(d.querySelectorAll("img[src]"),function(el){ el.setAttribute("src",relURL(el.getAttribute("src"),up)); });
  Array.prototype.forEach.call(d.querySelectorAll("a[href]"),function(el){ el.setAttribute("href",relURL(el.getAttribute("href"),up)); });
  /* mục lục tự động khi bài có từ 3 tiểu mục trở lên */
  var hs=d.querySelectorAll("h2"), toc="";
  if(hs.length>=3){
    var items=[];
    Array.prototype.forEach.call(hs,function(h,i){
      var id="muc-"+(i+1); h.id=id;
      items.push('<li><a href="#'+id+'">'+esc(h.textContent.trim())+'</a></li>');
    });
    toc='<nav class="toc" aria-label="Mục lục"><b>Trong bài này</b><ol>'+items.join("")+'</ol></nav>';
  }
  prepStaticImages(d);
  var body=d.innerHTML;
  var lead=String(p.excerpt||"").trim();
  var desc=(realVal(p.metaDesc)||lead||stripTags(p.body).slice(0,155)).trim();
  var modified=(p.updated&&p.updated>(p.date||""))?p.updated:"";
  /* Bài liên quan: ưu tiên cùng nhóm, thiếu thì lấy bài mới nhất */
  var others=pubPosts().filter(function(x){return x.slug!==p.slug;});
  var rel=others.filter(function(x){return p.group&&x.group===p.group;}).concat(others.filter(function(x){return !(p.group&&x.group===p.group);})).slice(0,3);
  var relBlock = rel.length ? '<section class="rel"><h2>Bài viết liên quan</h2><ul>'+rel.map(function(x){
      return '<li><a href="'+esc(up+postPath(x.slug))+'">'+esc(x.title)+'</a><em>'+esc(x.excerpt||"")+'</em></li>';
    }).join("")+'</ul></section>' : '';
  var cover=p.cover?'<img class="a-cover" src="'+esc(relURL(p.cover,up))+'" alt="'+esc(p.title)+'" decoding="async">':'';
  var authorName=(content.about&&content.about.name)||"Trần Huy";

  var graph=[bizNode(),
    {"@type":"Article","@id":url+"#article",
     headline:String(p.title||"").slice(0,110),
     description:desc,
     datePublished:p.date||undefined, dateModified:(modified||p.date)||undefined,
     inLanguage:"vi-VN",
     author:{"@type":"Person",name:authorName,url:siteURL()+"#ve-huydata",worksFor:{"@id":siteURL()+"#huydata"}},
     publisher:{"@id":siteURL()+"#huydata"},
     mainEntityOfPage:{"@type":"WebPage","@id":url},
     image:absURL(p.cover||ogDefault())||undefined},
    {"@type":"BreadcrumbList","@id":url+"#bc",itemListElement:[
      {"@type":"ListItem",position:1,name:"Trang chủ",item:siteURL()},
      {"@type":"ListItem",position:2,name:"Bài viết",item:siteURL()+"bai-viet/"},
      {"@type":"ListItem",position:3,name:p.title,item:url}]}];

  return staticPage({
    title: (realVal(p.metaTitle)||p.title)+" | "+(s.brandName||"HuyData"),
    desc: desc, canonical: url, ogType:"article",
    image: p.cover||ogDefault(),
    published: p.date, modified: modified,
    ld: JSON.stringify({"@context":"https://schema.org","@graph":graph},null,1),
    body: staticHeader(up)+
      '<div class="wrap">'+
      '<nav class="bc" aria-label="Đường dẫn"><a href="'+up+'">Trang chủ</a><span>›</span><a href="'+up+'bai-viet/">Bài viết</a></nav>'+
      '<article>'+
      '<div class="a-date"><time datetime="'+esc(p.date||"")+'">'+esc(fmtDate(p.date))+'</time>'+
        (modified?' · Cập nhật <time datetime="'+esc(modified)+'">'+esc(fmtDate(modified))+'</time>':'')+
        ' · '+readMinutes(p.body)+' phút đọc</div>'+
      '<h1>'+esc(p.title)+'</h1>'+
      (lead?'<p class="a-lead">'+esc(lead)+'</p>':'')+
      cover+toc+
      '<div class="prose">'+body+'</div>'+
      shareBlock(url,p.title)+
      authorBox(up)+
      ctaBlock()+relBlock+
      '</article></div>'+
      staticFooter(up)
  });
}

/* ---------- Trang danh sách bài viết ---------- */
function buildBlogIndexPage(){
  var s=content.settings, b=content.blog||{}, up="../", url=siteURL()+"bai-viet/";
  var posts=pubPosts();
  var title=(b.title||"Bài viết")+" | "+(s.brandName||"HuyData");
  var desc=b.intro||"Kiến thức thuế, sổ sách, hóa đơn cho hộ kinh doanh.";
  var graph=[bizNode(),
    {"@type":"CollectionPage","@id":url,url:url,name:b.title||"Bài viết",description:desc,inLanguage:"vi-VN",
     isPartOf:{"@id":siteURL()+"#site"},
     hasPart:posts.map(function(p){return {"@type":"Article","@id":postAbsURL(p.slug)+"#article",headline:p.title,url:postAbsURL(p.slug),datePublished:p.date||undefined};})},
    {"@type":"BreadcrumbList","@id":url+"#bc",itemListElement:[
      {"@type":"ListItem",position:1,name:"Trang chủ",item:siteURL()},
      {"@type":"ListItem",position:2,name:b.title||"Bài viết",item:url}]}];
  return staticPage({
    title:title, desc:desc, canonical:url,
    image:ogDefault(),
    ld: JSON.stringify({"@context":"https://schema.org","@graph":graph},null,1),
    body: staticHeader(up)+
      '<div class="wrap">'+
      '<nav class="bc" aria-label="Đường dẫn"><a href="'+up+'">Trang chủ</a></nav>'+
      '<div class="page-head"><h1>'+esc(b.title||"Bài viết")+'</h1><p class="sub">'+esc(desc)+'</p></div>'+
      '<ul class="plist">'+posts.map(function(p){
        return '<li><div class="d">'+esc(fmtDate(p.date))+'</div>'+
          '<a href="'+esc(postPath(p.slug))+'">'+esc(p.title)+'</a>'+
          '<p>'+esc(p.excerpt||stripTags(p.body).slice(0,150))+'</p></li>';
      }).join("")+'</ul>'+
      ctaBlock()+
      '</div>'+staticFooter(up)
  });
}

/* ---------- Trang danh sách khu vực catalog (Giải pháp/Công cụ/Văn bản/Kiến thức) ---------- */
function buildSectionIndexPage(sec){
  var s=content.settings, up="../", url=siteURL()+sectionPath(sec);
  var article=isArticleSection(sec);
  var groups=catGroups(sec.id);
  var desc=sec.intro||(article?"Kiến thức thuế, sổ sách, hóa đơn cho hộ kinh doanh.":("Danh mục "+sec.label+" của HuyData."));
  function itemsFor(gid){
    return article ? postsByGroup(gid) : pubItems(sec.id).filter(function(it){return (it.group||"")===gid;});
  }
  var orphan = article
    ? pubPosts().filter(function(p){return !groupById(p.group);})
    : pubItems(sec.id).filter(function(it){return !groupById(it.group);});
  function cardArticle(p){
    return '<a class="item-card" href="'+esc(up+postPath(p.slug))+'">'+
      (p.date?'<span class="ic-tag">'+esc(fmtDate(p.date))+'</span>':'')+
      '<h3>'+esc(p.title)+'</h3><p>'+esc(p.excerpt||stripTags(p.body).slice(0,120))+'</p>'+
      '<span class="ic-more">Đọc tiếp <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>';
  }
  function cardItem(it){
    var external = it.mode==="link" && /^https?:\/\//i.test(String(it.url||"").trim());
    var href=it.mode==="link"?esc(relURL(it.url,up)):esc(it.slug+"/");
    var attrs=external?'href="'+href+'" target="_blank" rel="noopener noreferrer"':'href="'+href+'"';
    return '<a class="item-card" '+attrs+'>'+
      (realVal(it.badge)?'<span class="ic-tag">'+esc(it.badge)+'</span>':'')+
      '<h3>'+esc(it.title)+(external?' <span class="ic-ext">↗</span>':'')+'</h3>'+
      (it.excerpt?'<p>'+esc(it.excerpt)+'</p>':'')+
      '<span class="ic-more">'+(external?"Mở tài liệu":"Xem chi tiết")+' <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>';
  }
  function blk(name,arr){ if(!arr.length) return ''; return '<div class="sec-group"><h2>'+esc(name)+'</h2><div class="item-grid">'+arr.map(article?cardArticle:cardItem).join('')+'</div></div>'; }
  var blocks=groups.map(function(g){ return blk(g.name,itemsFor(g.id)); }).filter(Boolean).join('');
  if(orphan.length) blocks+=blk("Khác",orphan);
  if(!blocks) blocks='<p class="sec-intro">Chưa có nội dung trong mục này.</p>';
  var graph=[bizNode(),
    {"@type":"CollectionPage","@id":url,url:url,name:sec.title||sec.label,description:desc,inLanguage:"vi-VN",isPartOf:{"@id":siteURL()+"#site"}},
    {"@type":"BreadcrumbList","@id":url+"#bc",itemListElement:[
      {"@type":"ListItem",position:1,name:"Trang chủ",item:siteURL()},
      {"@type":"ListItem",position:2,name:sec.title||sec.label,item:url}]}];
  return staticPage({
    title:(sec.title||sec.label)+" | "+(s.brandName||"HuyData"), desc:desc, canonical:url,
    image:ogDefault(),
    ld: JSON.stringify({"@context":"https://schema.org","@graph":graph},null,1),
    body: staticHeader(up)+
      '<div class="sec-hero"><div class="wrap">'+
      '<nav class="bc" aria-label="Đường dẫn"><a href="'+up+'">Trang chủ</a></nav>'+
      '<span class="eyebrow">'+esc(sec.eyebrow||sec.label)+'</span>'+
      '<h1>'+esc(sec.title||sec.label)+'</h1>'+(desc?'<p>'+esc(desc)+'</p>':'')+'</div></div>'+
      '<div class="wrap">'+blocks+ctaBlock()+'</div>'+
      staticFooter(up)
  });
}
/* ---------- Trang chi tiết một mục catalog (mode "page") ---------- */
function buildItemPage(sec,it){
  var s=content.settings, up="../../", url=siteURL()+itemPath(sec,it);
  var d=document.createElement("div");
  d.innerHTML=sanitize(it.body||"","post");
  Array.prototype.forEach.call(d.querySelectorAll("img[src]"),function(el){ el.setAttribute("src",relURL(el.getAttribute("src"),up)); });
  Array.prototype.forEach.call(d.querySelectorAll("a[href]"),function(el){ el.setAttribute("href",relURL(el.getAttribute("href"),up)); });
  var hs=d.querySelectorAll("h2"), toc="";
  if(hs.length>=3){
    var items=[];
    Array.prototype.forEach.call(hs,function(h,i){ var id="muc-"+(i+1); h.id=id; items.push('<li><a href="#'+id+'">'+esc(h.textContent.trim())+'</a></li>'); });
    toc='<nav class="toc" aria-label="Mục lục"><b>Trong trang này</b><ol>'+items.join("")+'</ol></nav>';
  }
  prepStaticImages(d);
  var body=d.innerHTML;
  var lead=String(it.excerpt||"").trim();
  var desc=(realVal(it.metaDesc)||lead||stripTags(it.body).slice(0,155)).trim();
  var rel=pubItems(sec.id).filter(function(x){return x.id!==it.id && itemIsPage(x);}).slice(0,3);
  var relBlock = rel.length ? '<section class="rel"><h2>Cùng mục '+esc(sec.label)+'</h2><ul>'+rel.map(function(x){
      return '<li><a href="'+esc("../"+x.slug+"/")+'">'+esc(x.title)+'</a><em>'+esc(x.excerpt||"")+'</em></li>';
    }).join("")+'</ul></section>' : '';
  var cover=it.cover?'<img class="a-cover" src="'+esc(relURL(it.cover,up))+'" alt="'+esc(it.title)+'">':'';
  var graph=[bizNode(),
    {"@type":"WebPage","@id":url+"#page",name:it.title,description:desc,inLanguage:"vi-VN",
     isPartOf:{"@id":siteURL()+"#site"},mainEntityOfPage:{"@type":"WebPage","@id":url},
     image:absURL(it.cover||ogDefault())||undefined},
    {"@type":"BreadcrumbList","@id":url+"#bc",itemListElement:[
      {"@type":"ListItem",position:1,name:"Trang chủ",item:siteURL()},
      {"@type":"ListItem",position:2,name:sec.title||sec.label,item:siteURL()+sectionPath(sec)},
      {"@type":"ListItem",position:3,name:it.title,item:url}]}];
  return staticPage({
    title:(realVal(it.metaTitle)||it.title)+" | "+(s.brandName||"HuyData"),
    desc:desc, canonical:url, image:it.cover||ogDefault(),
    ld: JSON.stringify({"@context":"https://schema.org","@graph":graph},null,1),
    body: staticHeader(up)+
      '<div class="wrap">'+
      '<nav class="bc" aria-label="Đường dẫn"><a href="'+up+'">Trang chủ</a><span>›</span><a href="'+up+sectionPath(sec)+'">'+esc(sec.label)+'</a></nav>'+
      '<article>'+
      (realVal(it.badge)?'<div class="a-date">'+esc(it.badge)+'</div>':'')+
      '<h1>'+esc(it.title)+'</h1>'+
      (lead?'<p class="a-lead">'+esc(lead)+'</p>':'')+
      cover+toc+
      '<div class="prose">'+body+'</div>'+
      ctaBlock()+relBlock+
      '</article></div>'+
      staticFooter(up)
  });
}

/* ---------- Trang GIẢI PHÁP CHỦ LỰC (đầy đủ, giữ nguyên thiết kế) ----------
   Tái dùng chính các khối đã render trên trang chủ (những khối gắn "Trang giải pháp"),
   ghép lại thành một trang thật tại /giai-phap/<slug>/ — nhìn giống hệt bản landing cũ. */
function appCSS(){ return Array.prototype.map.call(document.querySelectorAll('head style'),function(s){return s.textContent;}).join("\n"); }
function buildFlagshipSolutionPage(sec,it){
  var s=content.settings, up="../../", url=siteURL()+itemPath(sec,it);
  var host=document.createElement("div");
  var hero=document.getElementById("top");
  if(hero){ host.appendChild(hero.cloneNode(true)); }
  orderedSections().forEach(function(x){
    if(!(x.on!==false && sectionOnSolution(x) && sectionAvailable(x.key))) return;
    var el=document.getElementById(x.key); if(!el) return;
    var c=el.cloneNode(true); c.classList.remove("hide"); host.appendChild(c);
  });
  /* dọn bản sao cho môi trường tĩnh (không JS) */
  Array.prototype.forEach.call(host.querySelectorAll("canvas"),function(n){n.remove();});
  Array.prototype.forEach.call(host.querySelectorAll(".reveal"),function(n){n.classList.add("in");});
  var heroClone=host.firstChild;
  if(heroClone && heroClone.querySelector){
    var gb=heroClone.querySelector(".hero-cta .btn-ghost"); if(gb) gb.remove();
    /* Chống ăn thịt từ khóa: trang flagship KHÔNG dùng lại H1 slogan + dòng từ khóa H2 của
       trang chủ. Cho nó tiêu đề riêng (tên dịch vụ) để hai trang không cạnh tranh cùng heading. */
    var fh1=heroClone.querySelector("h1"); if(fh1) fh1.innerHTML=esc(it.title);
    var feb=heroClone.querySelector(".eyebrow"); if(feb) feb.textContent="Dịch vụ trọn gói";
    var fkw=heroClone.querySelector(".hero-kw"); if(fkw) fkw.parentNode.removeChild(fkw);
    var fsub=heroClone.querySelector(".hero-sub"); if(fsub && String(it.excerpt||"").trim()) fsub.textContent=String(it.excerpt).trim();
  }
  Array.prototype.forEach.call(host.querySelectorAll("img[src]"),function(n){ n.setAttribute("src",relURL(n.getAttribute("src"),up)); });
  Array.prototype.forEach.call(host.querySelectorAll("a[href]"),function(n){
    var href=n.getAttribute("href");
    if(/^#/.test(href)){
      var tid=href.slice(1);
      if(!tid){ n.setAttribute("href",up); }
      else if(!host.querySelector('[id="'+tid+'"]')){ n.setAttribute("href",up+"#"+tid); }
    } else if(!/^(https?:|data:|mailto:|tel:|\/\/)/i.test(href)){
      n.setAttribute("href",relURL(href,up));
    }
  });
  var lead=String(it.excerpt||"").trim();
  var desc=(realVal(it.metaDesc)||lead||stripTags(s.seo&&s.seo.description)||"").slice(0,160);
  var fq=(content.faq&&content.faq.enabled!==false&&sectionOnSolution({key:"faq"})&&content.faq.items)||[];
  var graph=[bizNode(),
    {"@type":"Service","@id":url+"#service",name:it.title,serviceType:it.title,description:desc,
     provider:{"@id":siteURL()+"#huydata"},areaServed:String((s.seo&&s.seo.areas)||"Chợ Lách, Vĩnh Long").split(",").map(function(x){return {"@type":"AdministrativeArea",name:x.trim()};}),
     url:url,inLanguage:"vi-VN"},
    {"@type":"WebPage","@id":url,url:url,name:it.title,isPartOf:{"@id":siteURL()+"#site"},inLanguage:"vi-VN"},
    {"@type":"BreadcrumbList","@id":url+"#bc",itemListElement:[
      {"@type":"ListItem",position:1,name:"Trang chủ",item:siteURL()},
      {"@type":"ListItem",position:2,name:sec.title||sec.label,item:siteURL()+sectionPath(sec)},
      {"@type":"ListItem",position:3,name:it.title,item:url}]}];
  if(fq.length) graph.push({"@type":"FAQPage","@id":url+"#faq",mainEntity:fq.map(function(x){return {"@type":"Question",name:x.q,acceptedAnswer:{"@type":"Answer",text:x.a}};})});
  var title=(realVal(it.metaTitle)||it.title)+" | "+(s.brandName||"HuyData");
  var img=absURL(it.cover||ogDefault());
  var head='<!DOCTYPE html>\n<html lang="vi"><head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'+
    '<title>'+esc(title)+'</title>\n<meta name="description" content="'+esc(desc)+'">\n'+
    '<link rel="canonical" href="'+esc(url)+'">\n<meta name="robots" content="index,follow,max-image-preview:large">\n'+
    '<meta property="og:type" content="website">\n<meta property="og:title" content="'+esc(title)+'">\n<meta property="og:description" content="'+esc(desc)+'">\n<meta property="og:url" content="'+esc(url)+'">\n<meta property="og:locale" content="vi_VN">\n'+
    (img?'<meta property="og:image" content="'+esc(img)+'">\n':'')+
    '<meta name="twitter:card" content="'+(img?'summary_large_image':'summary')+'">\n<meta name="twitter:title" content="'+esc(title)+'">\n<meta name="twitter:description" content="'+esc(desc)+'">\n'+
    (img?'<meta name="twitter:image" content="'+esc(img)+'">\n':'')+
    '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; base-uri \'self\'; form-action \'none\'; img-src \'self\' data: https:; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src \'self\' https://www.googletagmanager.com; connect-src \'self\' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; object-src \'none\'">\n'+
    '<meta name="referrer" content="strict-origin-when-cross-origin">\n<meta name="color-scheme" content="light">\n'+
    '<link rel="icon" href="'+esc(faviconHref())+'">\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="'+esc(fontsHref())+'" rel="stylesheet">\n'+
    '<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@graph":graph},null,1).replace(/</g,"\\u003c")+'<\/script>\n'+
    '<style>\n'+pageCSS()+"\n"+appCSS()+'\n</style>\n</head>\n<body>\n';
  var bc='<div class="sh"><div class="wrap" style="max-width:1100px;height:auto;padding-top:14px;padding-bottom:0"><nav class="bc" aria-label="Đường dẫn"><a href="'+up+'">Trang chủ</a><span>›</span><a href="'+up+sectionPath(sec)+'">'+esc(sec.label)+'</a></nav></div></div>';
  return head+staticHeader(up)+host.innerHTML+
    '<section class="band" id="lien-he"><div class="wrap">'+ctaBlock()+'</div></section>'+
    staticFooter(up)+'\n<script src="/site.js" defer><\/script>\n</body></html>\n';
}

/* ---------- Trang VĂN BẢN NHÚNG HTML (giữ nguyên file người dùng dán) ---------- */
function buildHtmlDocPage(sec,it){
  var s=content.settings, up="../../", url=siteURL()+itemPath(sec,it);
  var raw=String(it.html||"").trim();
  var title=(realVal(it.metaTitle)||it.title)+" | "+(s.brandName||"HuyData");
  var desc=String(it.excerpt||"").trim();
  /* Nút nổi góc dưới — position:fixed nên KHÔNG chen vào bố cục của file gốc (mục lục, cột, cuộn giữ nguyên) */
  /* Các phần tự chèn được bọc dấu <!--hd:…--> để lần sau gỡ ra lấy lại đúng file gốc (xem rawFromPublished) */
  var bar='<!--hd:bar--><a href="'+esc(up)+'" style="position:fixed;left:14px;bottom:14px;z-index:2147483647;font:600 13px/1 system-ui,-apple-system,Segoe UI,sans-serif;background:#102A1D;color:#2DD4A8;text-decoration:none;padding:10px 15px;border-radius:999px;box-shadow:0 6px 18px rgba(0,0,0,.22);opacity:.92">← Về HuyData</a><!--/hd:bar-->';
  var meta='<!--hd:meta-->\n<link rel="canonical" href="'+esc(url)+'">\n'+
    (/<link[^>]+rel=["'][^"']*icon/i.test(raw)?'':'<link rel="icon" href="/favicon.svg">\n')+
    '<meta property="og:title" content="'+esc(it.title)+'">\n<meta property="og:type" content="article">\n<meta property="og:url" content="'+esc(url)+'">\n'+
    (desc?'<meta name="description" content="'+esc(desc)+'">\n<meta property="og:description" content="'+esc(desc)+'">\n':'')+
    '<meta property="og:image" content="'+esc(absURL(ogDefault()))+'">\n<!--/hd:meta-->\n';
  if(/<html[\s>]/i.test(raw)){
    var out=raw;
    if(/<head[^>]*>/i.test(out)) out=out.replace(/<head([^>]*)>/i, function(m){return m+"\n"+meta;});
    else out=out.replace(/<html([^>]*)>/i, function(m){return m+"\n<head>\n"+meta+"</head>";});
    if(/<body[^>]*>/i.test(out)) out=out.replace(/<body([^>]*)>/i, function(m){return m+"\n"+bar;});
    else if(/<\/head>/i.test(out)) out=out.replace(/<\/head>/i, function(m){return m+"\n<body>\n"+bar;});
    else out=bar+out;
    return out;
  }
  return '<!DOCTYPE html>\n<html lang="vi"><head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>'+esc(title)+'</title>\n'+meta+'</head>\n<body>\n'+bar+'\n<!--hd:raw-->\n'+raw+'\n<!--/hd:raw-->\n</body></html>\n';
}
/* Lấy lại đúng file HTML gốc từ trang đã đăng: gỡ các phần HuyData tự chèn.
   Trang đăng trước bản này chưa có dấu <!--hd:…--> thì gỡ theo đúng mẫu đã chèn lúc đó. */
function rawFromPublished(pg){
  pg=String(pg||"");
  var m=pg.match(/<!--hd:raw-->\n?([\s\S]*?)\n?<!--\/hd:raw-->/); if(m) return m[1];
  var out=pg.replace(/\n?<!--hd:meta-->\n?[\s\S]*?<!--\/hd:meta-->\n?/,"").replace(/\n?<!--hd:bar-->[\s\S]*?<!--\/hd:bar-->/,"");
  if(out!==pg) return out;
  return pg
    .replace(/(<head[^>]*>)\n<link rel="canonical"[^>]*>\n(?:<link rel="icon" href="\/favicon\.svg">\n)?<meta property="og:title"[^>]*>\n<meta property="og:type" content="article">\n<meta property="og:url"[^>]*>\n(?:<meta name="description" content="[^"]*">\n<meta property="og:description" content="[^"]*">\n)?(?:<meta property="og:image"[^>]*>\n)?/,"$1")
    .replace(/(<body[^>]*>)\n(?:<div style="font-family:system-ui[^"]*"><a [^>]*>← Về HuyData<\/a><\/div>|<a href="[^"]*" style="position:fixed[^"]*">← Về HuyData<\/a>)/,"$1");
}
/* Văn bản nhúng đã đăng không còn cất nội dung trong trang chủ — cần sửa thì tải lại từ trang riêng */
async function ensureHtmlLoaded(sec,it){
  if(String(it.html||"").trim()) return true;
  var r=await fetch("/"+itemPath(sec,it)+"?t="+Date.now(),{cache:"no-store"});
  if(!r.ok) return false;
  it.html=rawFromPublished(await r.text());
  return !!it.html.trim();
}

/* ---------- Trang 404 ---------- */
function build404Page(){
  var up="/", s=content.settings;
  return staticPage({
    title:"Không tìm thấy trang | "+(s.brandName||"HuyData"),
    desc:"Trang này không còn tồn tại. Về trang chủ hoặc xem danh sách bài viết.",
    canonical:siteURL(), noindex:true,
    body: staticHeader(up)+
      '<div class="wrap nf"><h1>Không tìm thấy trang</h1>'+
      '<p>Trang anh chị tìm không còn ở đây. Có thể đường dẫn đã đổi.</p>'+
      '<p><a href="'+up+'">Về trang chủ</a> · <a href="'+up+'bai-viet/">Xem bài viết</a></p></div>'+
      staticFooter(up)
  });
}

/* ---------- Nén ZIP (kiểu store, không nén — đủ dùng và không cần thư viện) ---------- */
var CRC_TABLE=(function(){var t=[],c,n,k;for(n=0;n<256;n++){c=n;for(k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);t[n]=c>>>0;}return t;})();
function crc32(buf){var c=0xFFFFFFFF;for(var i=0;i<buf.length;i++)c=CRC_TABLE[(c^buf[i])&0xFF]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
function zipMake(files){
  var enc=new TextEncoder(), parts=[], central=[], offset=0;
  function u16(n){return [n&255,(n>>>8)&255];}
  function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];}
  files.forEach(function(f){
    var name=enc.encode(String(f.name).replace(/\\/g,"/"));   // ZIP luôn dùng dấu /
    var data=enc.encode(String(f.data==null?"":f.data));
    var crc=crc32(data);
    var loc=[].concat(u32(0x04034b50),u16(20),u16(0x0800),u16(0),u16(0),u16(33),
                      u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0));
    parts.push(new Uint8Array(loc),name,data);
    central.push({name:name,crc:crc,len:data.length,off:offset});
    offset+=loc.length+name.length+data.length;
  });
  var cdir=[], cstart=offset;
  central.forEach(function(c){
    var h=[].concat(u32(0x02014b50),u16(20),u16(20),u16(0x0800),u16(0),u16(0),u16(33),
                    u32(c.crc),u32(c.len),u32(c.len),u16(c.name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(c.off));
    cdir.push(new Uint8Array(h),c.name);
    offset+=h.length+c.name.length;
  });
  var end=new Uint8Array([].concat(u32(0x06054b50),u16(0),u16(0),u16(central.length),u16(central.length),
                                   u32(offset-cstart),u32(cstart),u16(0)));
  return new Blob(parts.concat(cdir,[end]),{type:"application/zip"});
}
function downloadBlob(name,blob){
  var url=URL.createObjectURL(blob);
  var a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(url);a.remove();},800);
}

/* ---------- Danh sách toàn bộ file của site (dùng chung cho .zip và Đăng lên GitHub) ---------- */
/* Favicon dạng FILE thật (không phải data: URI) để Google hiện được logo trong kết quả tìm kiếm.
   Google bỏ qua favicon data:URI — bắt buộc là file có URL crawl được. */
var FAVICON_SVG="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180' width='180' height='180'><rect width='180' height='180' rx='40' fill='#102A1D'/><line x1='50' y1='36' x2='50' y2='144' stroke='#74C69D' stroke-width='16' stroke-linecap='round'/><line x1='130' y1='36' x2='130' y2='144' stroke='#74C69D' stroke-width='16' stroke-linecap='round'/><line x1='50' y1='90' x2='130' y2='90' stroke='#2DD4A8' stroke-width='16' stroke-linecap='round'/><circle cx='50' cy='36' r='14' fill='#B7E4C7'/><circle cx='130' cy='36' r='14' fill='#2DD4A8'/><circle cx='50' cy='144' r='14' fill='#2DD4A8'/><circle cx='130' cy='144' r='14' fill='#B7E4C7'/><circle cx='90' cy='90' r='12' fill='#40916C'/></svg>\n";
/* Mã GA4 hợp lệ (G-XXXX) hoặc chuỗi rỗng */
function ga4Id(){ var a=content.settings.analytics||{}; var id=String(a.ga4||"").trim().toUpperCase(); return /^G-[A-Z0-9]{4,15}$/.test(id)?id:""; }
function gscCode(){ var a=content.settings.analytics||{}; var c=String(a.gsc||"").trim(); return /^[A-Za-z0-9_\-]{10,100}$/.test(c)?c:""; }
/* /site.js — dùng chung cho mọi trang: đo lường GA4 (nếu có mã) + nút "Sao chép link" */
function siteJS(){
  var id=ga4Id();
  return '/* HuyData site.js — sinh tự động từ trang quản trị, đừng sửa tay */\n(function(){\n'+
    'var ID='+JSON.stringify(id)+';\n'+
    'function track(n,p){ if(window.gtag) window.gtag("event",n,p||{}); }\n'+
    'if(ID && !/#quan-tri/.test(location.hash)){\n'+
    '  var s=document.createElement("script"); s.async=true; s.src="https://www.googletagmanager.com/gtag/js?id="+ID; document.head.appendChild(s);\n'+
    '  window.dataLayer=window.dataLayer||[]; window.gtag=function(){ window.dataLayer.push(arguments); };\n'+
    '  window.gtag("js",new Date()); window.gtag("config",ID);\n'+
    '}\n'+
    '/* Đếm lượt bấm liên hệ: Zalo / gọi điện / email */\n'+
    'document.addEventListener("click",function(e){\n'+
    '  var a=e.target.closest&&e.target.closest("a[href]"); if(!a) return;\n'+
    '  var h=a.getAttribute("href")||"", m=/zalo\\.me/i.test(h)?"zalo":/^tel:/i.test(h)?"phone":/^mailto:/i.test(h)?"email":/facebook\\.com\\/sharer/i.test(h)?"share_facebook":"";\n'+
    '  if(m) track(m==="share_facebook"?"share":"contact_click",{method:m,page_path:location.pathname});\n'+
    '},true);\n'+
    '/* Nút sao chép link bài (để dán vào Zalo) */\n'+
    'Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"),function(b){\n'+
    '  b.hidden=false;\n'+
    '  b.addEventListener("click",function(){\n'+
    '    var u=b.getAttribute("data-copy"), old=b.textContent;\n'+
    '    function ok(){ b.textContent="✓ Đã chép — mở Zalo và dán"; setTimeout(function(){ b.textContent=old; },2500); track("share",{method:"copy_link",page_path:location.pathname}); }\n'+
    '    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(ok,function(){ prompt("Sao chép link này:",u); });\n'+
    '    else prompt("Sao chép link này:",u);\n'+
    '  });\n'+
    '});\n'+
    '})();\n';
}
function siteFiles(){
  reconcileCatalog();
  var f=seoFiles(), posts=pubPosts();
  var files=[
    {name:"index.html",   data:bakedIndex()},
    {name:"404.html",     data:build404Page()},
    {name:"sitemap.xml",  data:f.sitemap},
    {name:"robots.txt",   data:f.robots},
    {name:"CNAME",        data:siteHost()+"\n"},
    {name:".nojekyll",    data:""},
    {name:"favicon.svg",  data:FAVICON_SVG},
    {name:"site.js",      data:siteJS()}
  ];
  catSections().forEach(function(sec){
    if(!sectionHasContent(sec.id)) return;
    files.push({name:sectionPath(sec)+"index.html",data:buildSectionIndexPage(sec)});
    if(isArticleSection(sec)){
      posts.forEach(function(p){ files.push({name:postPath(p.slug)+"index.html",data:buildPostPage(p)}); });
    } else {
      pubItems(sec.id).forEach(function(it){
        if(!itemIsPage(it)) return;
        if(it.mode==="html" && !String(it.html||"").trim()) return;
        var data = (it.flagship && !String(it.body||"").trim()) ? buildFlagshipSolutionPage(sec,it) : (it.mode==="html" ? buildHtmlDocPage(sec,it) : buildItemPage(sec,it));
        files.push({name:itemPath(sec,it)+"index.html",data:data});
      });
    }
  });
  return files;
}

/* ---------- Gói toàn bộ site thành .zip ---------- */
async function publishSite(){
  toast("Đang gom file…");
  var files=siteFiles(), miss=[];
  /* Gói zip phải đủ: kèm admin.js và các trang văn bản nhúng chưa mở sửa (lấy nguyên trang đang có trên web) */
  try{ var a=await fetch("/admin.js?v="+ADMIN_VER,{cache:"no-store"}); if(a.ok) files.push({name:"admin.js",data:await a.text()}); else miss.push("admin.js"); }catch(_){ miss.push("admin.js"); }
  reconcileCatalog();
  for(var i=0;i<catSections().length;i++){
    var sec=catSections()[i]; if(!sectionHasContent(sec.id)) continue;
    var its=pubItems(sec.id).filter(function(it){ return it.mode==="html" && !String(it.html||"").trim() && it.htmlOnPage; });
    for(var j=0;j<its.length;j++){
      var path=itemPath(sec,its[j])+"index.html";
      try{ var r=await fetch("/"+itemPath(sec,its[j])+"?t="+Date.now(),{cache:"no-store"}); if(r.ok) files.push({name:path,data:await r.text()}); else miss.push(path); }catch(_){ miss.push(path); }
    }
  }
  downloadBlob("huydata-site.zip", zipMake(files));
  toast("Đã tải huydata-site.zip — "+files.length+" file."+(miss.length?" Thiếu: "+miss.join(", "):" Giải nén rồi tải TOÀN BỘ lên hosting."));
}

/* =========================================================
   ĐĂNG LÊN GITHUB — một nút, đẩy thẳng toàn bộ site lên kho.
   Chìa khóa (token) chỉ lưu trong máy này (localStorage), KHÔNG bao giờ
   nằm trong file xuất ra hay trong nội dung .json → không lộ ra web công khai.
   Đẩy bằng Git Data API: gộp mọi thay đổi vào MỘT commit, giữ nguyên các
   file khác trong kho (vd: _old/). Chỉ cần quyền Contents: Read and write.
   ========================================================= */
var GH_TOKEN_KEY="hd_gh_token", GH_CFG_KEY="hd_gh_cfg";
function ghCfg(){
  var d={owner:"HUYDATAVN",repo:"huydata",branch:"main"};
  try{ var s=JSON.parse(localStorage.getItem(GH_CFG_KEY)||"{}"); if(s.owner)d.owner=String(s.owner).trim(); if(s.repo)d.repo=String(s.repo).trim(); if(s.branch)d.branch=String(s.branch).trim(); }catch(_){}
  return d;
}
function ghToken(){ try{ return (localStorage.getItem(GH_TOKEN_KEY)||"").trim(); }catch(_){ return ""; } }
async function ghApi(cfg,tok,method,path,body){
  var res=await fetch("https://api.github.com/repos/"+cfg.owner+"/"+cfg.repo+path,{
    method:method,
    headers:{ "Authorization":"Bearer "+tok, "Accept":"application/vnd.github+json", "Content-Type":"application/json", "X-GitHub-Api-Version":"2022-11-28" },
    body: body?JSON.stringify(body):undefined
  });
  var txt=await res.text(); var data=null; try{ data=txt?JSON.parse(txt):null; }catch(_){ data=null; }
  if(!res.ok){ var m=(data&&data.message)?data.message:(txt||("HTTP "+res.status)); var e=new Error(m); e.status=res.status; throw e; }
  return data;
}
async function ghPush(){
  var tok=ghToken(), cfg=ghCfg();
  if(!tok){ openGitHubModal(); return; }
  var btn=$("#a-github"), old=btn?btn.innerHTML:"";
  try{
    if(btn){ btn.disabled=true; btn.innerHTML='<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg> Đang đăng…'; }
    toast("Đang chuẩn bị nội dung…");
    var files=siteFiles();
    var ref=await ghApi(cfg,tok,"GET","/git/ref/heads/"+cfg.branch);
    var baseSha=ref.object.sha;
    var baseCommit=await ghApi(cfg,tok,"GET","/git/commits/"+baseSha);
    var tree=files.map(function(f){ return {path:String(f.name).replace(/^\/+/,""), mode:"100644", type:"blob", content:String(f.data==null?"":f.data)}; });
    var newTree=await ghApi(cfg,tok,"POST","/git/trees",{base_tree:baseCommit.tree.sha, tree:tree});
    var msg="Cập nhật nội dung từ trang quản trị — "+new Date().toLocaleString("vi-VN");
    var commit=await ghApi(cfg,tok,"POST","/git/commits",{message:msg, tree:newTree.sha, parents:[baseSha]});
    await ghApi(cfg,tok,"PATCH","/git/refs/heads/"+cfg.branch,{sha:commit.sha, force:false});
    toast("✅ Đã đăng lên GitHub ("+files.length+" file). Chờ 1–2 phút để web cập nhật.");
  }catch(e){
    var m=(e&&e.message)?e.message:String(e), st=e&&e.status;
    var hint = st===401 ? "Chìa khóa (token) sai hoặc đã hết hạn — tạo lại và lưu chìa khóa mới."
             : st===403 ? "Chìa khóa thiếu quyền — cần quyền Contents: Read and write cho đúng kho này."
             : st===404 ? "Không thấy kho/nhánh — kiểm tra tên chủ kho, tên kho, tên nhánh trong phần Cấu hình."
             : "Kiểm tra mạng và thử lại.";
    toast("Chưa đăng được lên GitHub.");
    alert("Chưa đăng được lên GitHub.\n\nLý do: "+m+"\n\n"+hint);
  }finally{ if(btn){ btn.disabled=false; btn.innerHTML=old; } }
}
function openGitHubModal(){
  var cfg=ghCfg(), tok=ghToken(), m=$("#ghmodal");
  if(!m){
    m=document.createElement("div"); m.className="modal"; m.id="ghmodal";
    document.body.appendChild(m);
  }
  m.innerHTML=
    '<div class="modal-card" style="max-width:520px;text-align:left">'+
      '<h3 style="text-align:center">Đăng lên GitHub</h3>'+
      '<p style="margin-bottom:14px">Dán <b>chìa khóa (token)</b> của GitHub vào đây. Chìa khóa chỉ được lưu <b>trong máy này</b>, không bao giờ nằm trong file web hay bản .json xuất ra.</p>'+
      '<label style="display:block;font-size:12.5px;font-weight:600;color:var(--green-deep);margin:0 0 6px">Chìa khóa (Personal Access Token)</label>'+
      '<input type="password" id="gh-token" placeholder="ghp_… hoặc github_pat_…" autocomplete="off" spellcheck="false" style="text-align:left;letter-spacing:normal;font-size:14px" value="'+esc(tok)+'">'+
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:2px 0 8px">'+
        '<div><label style="display:block;font-size:11.5px;color:var(--text-light);margin:0 0 4px">Chủ kho</label><input id="gh-owner" style="text-align:left;letter-spacing:normal;font-size:13px;margin:0" value="'+esc(cfg.owner)+'"></div>'+
        '<div><label style="display:block;font-size:11.5px;color:var(--text-light);margin:0 0 4px">Tên kho</label><input id="gh-repo" style="text-align:left;letter-spacing:normal;font-size:13px;margin:0" value="'+esc(cfg.repo)+'"></div>'+
        '<div><label style="display:block;font-size:11.5px;color:var(--text-light);margin:0 0 4px">Nhánh</label><input id="gh-branch" style="text-align:left;letter-spacing:normal;font-size:13px;margin:0" value="'+esc(cfg.branch)+'"></div>'+
      '</div>'+
      '<div class="modal-err" id="gh-err"></div>'+
      '<div style="display:flex;gap:10px;flex-wrap:wrap">'+
        '<button class="btn btn-ghost" id="gh-cancel" style="flex:1;justify-content:center">Đóng</button>'+
        '<button class="btn btn-ghost" id="gh-test" style="flex:1;justify-content:center">Kiểm tra</button>'+
        '<button class="btn btn-primary" id="gh-save" style="flex:1;justify-content:center">Lưu & đăng ngay</button>'+
      '</div>'+
      '<div style="margin-top:14px;font-size:12px;color:var(--text-light);line-height:1.6;border-top:1px solid var(--line);padding-top:12px">'+
        'Chưa có chìa khóa? Tạo tại <b>github.com → Settings → Developer settings → Fine-grained tokens</b>. '+
        'Chọn đúng kho <b>'+esc(cfg.owner)+'/'+esc(cfg.repo)+'</b>, quyền <b>Contents: Read and write</b>, đặt hạn dùng (vd 90 ngày). '+
        '<button type="button" id="gh-clear" style="background:none;border:none;color:#C0392B;cursor:pointer;padding:0;font:inherit;text-decoration:underline">Xóa chìa khóa khỏi máy này</button>'+
      '</div>'+
    '</div>';
  m.classList.add("open");
  function save(){ try{ localStorage.setItem(GH_TOKEN_KEY,$("#gh-token").value.trim()); localStorage.setItem(GH_CFG_KEY,JSON.stringify({owner:$("#gh-owner").value.trim(),repo:$("#gh-repo").value.trim(),branch:$("#gh-branch").value.trim()})); }catch(_){ } }
  $("#gh-cancel").onclick=function(){ m.classList.remove("open"); };
  $("#gh-clear").onclick=function(){ try{ localStorage.removeItem(GH_TOKEN_KEY); }catch(_){}; $("#gh-token").value=""; $("#gh-err").textContent="Đã xóa chìa khóa khỏi máy này."; };
  $("#gh-save").onclick=function(){ if(!$("#gh-token").value.trim()){ $("#gh-err").textContent="Chưa dán chìa khóa."; return; } save(); m.classList.remove("open"); ghPush(); };
  $("#gh-test").onclick=async function(){
    save(); $("#gh-err").style.color="var(--text-mid)"; $("#gh-err").textContent="Đang kiểm tra…";
    try{ var r=await ghApi(ghCfg(),ghToken(),"GET",""); $("#gh-err").style.color="#1E824C"; $("#gh-err").textContent="✅ Kết nối được: "+r.full_name+(r.permissions&&r.permissions.push?" (được quyền ghi)":" (⚠ chưa có quyền ghi)"); }
    catch(e){ $("#gh-err").style.color="#C0392B"; $("#gh-err").textContent="✗ "+(e&&e.message?e.message:e); }
  };
  setTimeout(function(){ var t=$("#gh-token"); if(t&&!t.value) t.focus(); },60);
}

/* ---------- Trang chủ đã nướng sẵn nội dung cho trình quét ---------- */
function bakedIndex(){
  /* Xuất HTML đã render sẵn để nội dung chính có mặt ngay trong HTTP response; JS vẫn được giữ để tương tác. */
  /* Văn bản nhúng HTML đã đăng: KHÔNG cất nội dung trong trang chủ (nó đã nằm ở trang riêng /van-ban/<tên>/).
     Trang chủ chỉ giữ tên, mô tả, đường dẫn → không phình theo số văn bản. Bản nháp (chưa đăng) vẫn giữ nguyên. */
  var pubC=JSON.parse(JSON.stringify(content,function(k,v){ return k.charAt(0)==="_"?undefined:v; }));
  ((pubC.catalog&&pubC.catalog.items)||[]).forEach(function(it){
    if(it.mode==="html" && it.published!==false && (String(it.html||"").trim() || it.htmlOnPage)){ delete it.html; it.htmlOnPage=true; }
  });
  var jsonSafe=JSON.stringify(pubC).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026");
  var doc=document.documentElement.cloneNode(true);
  /* Phần quản trị là file riêng /admin.js — không đưa thẻ nạp nó vào bản đăng (trang chủ chỉ nạp khi mở quản trị) */
  Array.prototype.forEach.call(doc.querySelectorAll('#admin-js,script[src^="/admin.js"]'),function(n){ n.remove(); });
  doc.classList.remove("rv"); if(!doc.getAttribute("class")) doc.removeAttribute("class");
  var adm=doc.querySelector("#admin"); if(adm){ adm.innerHTML=""; adm.removeAttribute("class"); }
  /* Giữ #pinmodal để mở khóa quản trị được trên bản đã đăng; chỉ gỡ #ghmodal (có thể chứa token). */
  ["#ghmodal"].forEach(function(sel){var el=doc.querySelector(sel); if(el) el.remove();});
  Array.prototype.forEach.call(doc.querySelectorAll("#postview,#catview"),function(el){ el.classList.remove("open"); });
  /* Reset thông báo tạm (toast) kẻo bị đông cứng "Đang chuẩn bị nội dung…" trong bản đăng. */
  var tst=doc.querySelector("#toast"); if(tst){ tst.className="toast"; tst.innerHTML=""; }
  /* Xóa dấu vết trạng thái lúc bấm đăng (đang mở quản trị, đã cuộn trang, hiệu ứng đã chạy…) —
     để file đăng lên lần nào cũng giống nhau và khách không JS vẫn cuộn được trang. */
  var bd=doc.querySelector("body"); if(bd) bd.removeAttribute("style");
  /* Gỡ bản cũ rồi gắn lại (tránh nhân đôi qua mỗi lần đăng) */
  Array.prototype.forEach.call(doc.querySelectorAll('script[src="/site.js"],meta[name="google-site-verification"]'),function(n){ n.remove(); });
  var hd0=doc.querySelector("head");
  if(hd0 && gscCode()){ var gm=document.createElement("meta"); gm.setAttribute("name","google-site-verification"); gm.setAttribute("content",gscCode()); hd0.insertBefore(gm, hd0.querySelector('meta[name="robots"]')||null); }
  if(bd){ var sj=document.createElement("script"); sj.setAttribute("src","/site.js"); sj.setAttribute("defer",""); bd.appendChild(sj); }
  ["#imgmodal"].forEach(function(sel){var el=doc.querySelector(sel); if(el) el.remove();});
  var hdr=doc.querySelector("#hdr"); if(hdr) hdr.className="on-hero";
  var cvs=doc.querySelector("#constellation"); if(cvs){ cvs.removeAttribute("width"); cvs.removeAttribute("height"); cvs.removeAttribute("style"); }
  Array.prototype.forEach.call(doc.querySelectorAll(".reveal"),function(n){ n.classList.remove("in","obs"); });
  Array.prototype.forEach.call(doc.querySelectorAll(".modal.open"),function(n){ n.classList.remove("open"); });
  ["#linkmodal"].forEach(function(sel){var el=doc.querySelector(sel); if(el) el.remove();});
  var nl=doc.querySelector("#navlinks"); if(nl) nl.classList.remove("open");
  var bg=doc.querySelector("#burger"); if(bg) bg.setAttribute("aria-expanded","false");
  var embedded=doc.querySelector("#site-content"); if(embedded) embedded.textContent=jsonSafe;
  var out="<!DOCTYPE html>\n"+doc.outerHTML;
  var s=content.settings, seo=s.seo||{}, h=content.hero;
  var t=(seo.title||(String(s.brandName||"HuyData")+" — "+stripTags(sanitize(h.title,"inline")))).trim();
  var d=(seo.description||h.sub||"").trim();
  var img=absURL(ogDefault());
  function attr(v){ return String(v||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function setContent(id,val){ out=out.replace(new RegExp('(<[^>]*id="'+id+'"[^>]*content=")[^"]*(")'), '$1'+attr(val)+'$2'); }
  out=out.replace(/(<title id="page-title">)[\s\S]*?(<\/title>)/, '$1'+attr(t)+'$2');
  setContent("meta-desc",d); setContent("og-title",t); setContent("og-desc",d);
  setContent("tw-title",t); setContent("tw-desc",d);
  if(img){ setContent("og-img",img); setContent("tw-img",img); }
  out=out.replace(/(<link id="canonical" rel="canonical" href=")[^"]*(")/, '$1'+attr(siteURL())+'$2');
  out=out.replace(/(<script type="application\/ld\+json" id="ld-json">)[\s\S]*?(<\/script>)/,
    function(_,a,z){ return a+buildLD().replace(/</g,"\\u003c")+z; });
  out=out.replace(/(<noscript id="nojs-content">)[\s\S]*?(<\/noscript>)/,
    function(_,a,z){ return a+plainSnapshot()+z; });
  return out;
}
function exportHTML(){
  download("HuyData_Website.html",bakedIndex(),"text/html");
  toast("Đã tải trang chủ (.html). Có bài viết thì nên dùng \"Xuất bản site (.zip)\" để mỗi bài có trang riêng.");
}
