/* HuyData v9 — TRANG QUẢN TRỊ.
   Soạn nội dung (noi-dung.json) → bấm "Đăng lên GitHub" → hd-build.js dựng lại mọi trang → đẩy MỘT lần lên kho.
   Chìa khóa GitHub chỉ nằm trong máy này (localStorage, dùng chung với bản cũ nên không phải nhập lại).
   File code: sửa ở v9/src/quan-tri/quan-tri.js. */
"use strict";
var HDB=window.HD;
var content=null, loadedUpdated="", dirty=false, cur={tab:"posts",edit:null}, pendingDocs={};
var DRAFT_KEY="hd9_nhap", GH_TOKEN_KEY="hd_gh_token", GH_CFG_KEY="hd_gh_cfg";

/* ---------------- Tiện ích ---------------- */
function $(s,r){ return (r||document).querySelector(s); }
function $$(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
function esc(s){ return HDB.esc(s); }
function el(tag,attrs,kids){
  var e=document.createElement(tag);
  if(attrs) Object.keys(attrs).forEach(function(k){
    var v=attrs[k]; if(v==null||v===false) return;
    if(k==="html") e.innerHTML=v; else if(k==="text") e.textContent=v; else if(k.slice(0,2)==="on") e.addEventListener(k.slice(2),v); else e.setAttribute(k,v===true?"":v);
  });
  (kids||[]).forEach(function(k){ if(k!=null) e.appendChild(typeof k==="string"?document.createTextNode(k):k); });
  return e;
}
function toast(m,ms){ var t=$("#toast"); t.textContent=m; t.classList.add("show"); clearTimeout(toast.t); toast.t=setTimeout(function(){ t.classList.remove("show"); },ms||3200); }
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function uid(p){ return (p||"x")+Date.now().toString(36)+Math.random().toString(36).slice(2,5); }
function today(){ var d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function changed(){ dirty=true; var d=$("#dirty"); if(d) d.hidden=false; clearTimeout(changed.t); changed.t=setTimeout(saveDraft,600); }
function saveDraft(){ try{ localStorage.setItem(DRAFT_KEY,JSON.stringify({t:Date.now(),base:loadedUpdated,c:content})); }catch(e){ toast("Máy không lưu được bản nháp (bộ nhớ đầy?)"); } }
async function sha256(str){ var buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(str)); return Array.prototype.map.call(new Uint8Array(buf),function(b){return b.toString(16).padStart(2,"0");}).join(""); }
function isExternalHref(h){ return /^(https?:)?\/\//i.test(String(h||"")) && !/^https?:\/\/(www\.)?huydata\.vn/i.test(String(h||"")); }
function safeHref(h){ h=String(h||"").trim(); return /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(h)||h==="zalo"||h==="tel"; }
function safeSrc(s){ s=String(s||"").trim(); return /^(https:\/\/|\/)/i.test(s); }

/* ---------------- Làm sạch HTML từ trình soạn (dán từ Word/Zalo/web) ---------------- */
var ALLOW={P:[],BR:[],H2:[],H3:[],H4:[],STRONG:[],B:[],EM:[],I:[],U:[],UL:[],OL:[],LI:[],A:["href","rel","target"],BLOCKQUOTE:[],TABLE:[],THEAD:[],TBODY:[],TR:[],TH:["colspan","rowspan"],TD:["colspan","rowspan"],IMG:["src","alt","width","height"],FIGURE:[],FIGCAPTION:[],CODE:[],HR:[]};
var RENAME={H1:"H2",H5:"H3",H6:"H3"};
var BLOCKY=/^(P|DIV|H[1-6]|UL|OL|LI|TABLE|BLOCKQUOTE|FIGURE|SECTION|ARTICLE|HR)$/;
function sanitize(html){
  var doc=new DOMParser().parseFromString("<body>"+String(html||"")+"</body>","text/html");
  function walk(node,out){
    Array.prototype.forEach.call(node.childNodes,function(n){
      if(n.nodeType===3){ out.appendChild(document.createTextNode(n.nodeValue)); return; }
      if(n.nodeType!==1) return;
      var t=n.tagName; if(/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|NOSCRIPT|TEMPLATE|META|LINK)$/.test(t)) return;
      /* DIV/SECTION: chứa khối con thì bỏ vỏ; chỉ chứa chữ thì thành đoạn văn (trừ khi đang nằm trong đoạn văn) */
      if(/^(DIV|SECTION|ARTICLE)$/.test(t)){
        var blocky=Array.prototype.some.call(n.children,function(k){ return BLOCKY.test(k.tagName); });
        t=(blocky||/^(P|LI|TD|TH|H2|H3|H4|BLOCKQUOTE|FIGCAPTION)$/.test(out.tagName))?"":"P";
        if(!t){ walk(n,out); return; }
      }
      t=RENAME[t]||t;
      if(t==="P"&&out.tagName==="P"){ walk(n,out); return; }
      if(!ALLOW[t]){ walk(n,out); return; }
      if(t==="IMG"&&!safeSrc(n.getAttribute("src"))) return;
      if(t==="A"&&!safeHref(n.getAttribute("href"))){ walk(n,out); return; }
      var e=document.createElement(t);
      ALLOW[t].forEach(function(a){ var v=n.getAttribute(a); if(v==null) return;
        if(a==="href"&&!safeHref(v)) return; if(a==="src"&&!safeSrc(v)) return; e.setAttribute(a,v); });
      walk(n,e); out.appendChild(e);
    });
  }
  var box=document.createElement("div"); walk(doc.body,box);
  var h=box.innerHTML.replace(/<p>(\s|&nbsp;|<br>)*<\/p>/g,"").replace(/<(b)>/g,"<strong>").replace(/<\/b>/g,"</strong>");
  return h.trim();
}

/* ---------------- GitHub ---------------- */
function ghCfg(){ var d={owner:"HUYDATAVN",repo:"huydata",branch:"main"}; try{ var s=JSON.parse(localStorage.getItem(GH_CFG_KEY)||"{}"); if(s.owner)d.owner=String(s.owner).trim(); if(s.repo)d.repo=String(s.repo).trim(); if(s.branch)d.branch=String(s.branch).trim(); }catch(_){} return d; }
function ghToken(){ try{ return (localStorage.getItem(GH_TOKEN_KEY)||"").trim(); }catch(_){ return ""; } }
async function ghApi(cfg,tok,method,path,body,raw){
  var res=await fetch("https://api.github.com/repos/"+cfg.owner+"/"+cfg.repo+path,{method:method,
    headers:{"Authorization":"Bearer "+tok,"Accept":raw?"application/vnd.github.raw+json":"application/vnd.github+json","Content-Type":"application/json","X-GitHub-Api-Version":"2022-11-28"},
    body:body?JSON.stringify(body):undefined,cache:"no-store"});
  var txt=await res.text(); if(raw&&res.ok) return txt;
  var data=null; try{ data=txt?JSON.parse(txt):null; }catch(_){}
  if(!res.ok){ var e=new Error((data&&data.message)||txt||("HTTP "+res.status)); e.status=res.status; throw e; }
  return data;
}
function ghHint(e){ var st=e&&e.status;
  return st===401?"Chìa khóa (token) sai hoặc đã hết hạn — tạo chìa khóa mới rồi lưu lại.":st===403?"Chìa khóa thiếu quyền — cần Contents: Read and write cho đúng kho.":st===404?"Không thấy kho/nhánh — kiểm tra phần Cấu hình GitHub.":"Kiểm tra mạng rồi thử lại."; }
function openGitHubModal(after){
  var cfg=ghCfg(), m=modal();
  m.card.innerHTML='<h3>Chìa khóa GitHub</h3><p class="hint">Dán chìa khóa (token) của GitHub. Chìa khóa chỉ lưu <b>trong máy này</b>, không bao giờ nằm trong nội dung web.</p>'+
    '<div class="f"><label>Chìa khóa (Personal Access Token)</label><input id="gh-t" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…" value="'+esc(ghToken())+'"></div>'+
    '<div class="g2 g3"><div class="f"><label>Chủ kho</label><input id="gh-o" value="'+esc(cfg.owner)+'"></div><div class="f"><label>Tên kho</label><input id="gh-r" value="'+esc(cfg.repo)+'"></div><div class="f"><label>Nhánh</label><input id="gh-b" value="'+esc(cfg.branch)+'"></div></div>'+
    '<div class="modal-err" id="gh-err"></div><div class="row"><button class="b" id="gh-c">Đóng</button><button class="b" id="gh-test">Kiểm tra</button><button class="b b-pri" id="gh-s">Lưu</button></div>'+
    '<p class="hint" style="margin-top:14px">Chưa có chìa khóa? Vào github.com → Settings → Developer settings → Fine-grained tokens. Chọn đúng kho <b>'+esc(cfg.owner+"/"+cfg.repo)+'</b>, quyền <b>Contents: Read and write</b>. <button type="button" class="b b-sm b-red" id="gh-x">Xóa chìa khóa khỏi máy này</button></p>';
  function save(){ try{ localStorage.setItem(GH_TOKEN_KEY,$("#gh-t").value.trim()); localStorage.setItem(GH_CFG_KEY,JSON.stringify({owner:$("#gh-o").value.trim(),repo:$("#gh-r").value.trim(),branch:$("#gh-b").value.trim()})); }catch(_){} }
  $("#gh-c").onclick=m.close;
  $("#gh-x").onclick=function(){ try{ localStorage.removeItem(GH_TOKEN_KEY); }catch(_){} $("#gh-t").value=""; $("#gh-err").textContent="Đã xóa chìa khóa khỏi máy này."; };
  $("#gh-s").onclick=function(){ save(); m.close(); toast("Đã lưu cấu hình GitHub"); if(after) after(); };
  $("#gh-test").onclick=async function(){ save(); $("#gh-err").textContent="Đang kiểm tra…";
    try{ var r=await ghApi(ghCfg(),ghToken(),"GET",""); $("#gh-err").textContent="✓ Kết nối được "+r.full_name+(r.permissions&&r.permissions.push?" — có quyền ghi.":" — CHƯA có quyền ghi."); }
    catch(e){ $("#gh-err").textContent="✗ "+e.message+" — "+ghHint(e); } };
}
async function publish(){
  var tok=ghToken(), cfg=ghCfg();
  if(!tok){ openGitHubModal(publish); return; }
  var btn=$("#t-pub"); btn.disabled=true; var old=btn.textContent; btn.textContent="Đang đăng…";
  try{
    /* Chống ghi đè: nếu trên kho đã có bản mới hơn bản đang sửa (đăng từ máy khác) thì hỏi trước */
    try{
      var remote=JSON.parse(await ghApi(cfg,tok,"GET","/contents/noi-dung.json?ref="+encodeURIComponent(cfg.branch),null,true));
      if(remote&&remote.updated&&loadedUpdated&&remote.updated>loadedUpdated){
        if(!confirm("Trên web đã có bản đăng MỚI HƠN bản anh đang sửa (lúc "+new Date(remote.updated).toLocaleString("vi-VN")+").\n\nĐăng tiếp sẽ ghi đè bản đó. Vẫn đăng?")) return;
      }
    }catch(e){ if(e.status&&e.status!==404) throw e; }
    content.updated=new Date().toISOString();
    var files=HDB.build(content,{docRaw:function(slug){ return pendingDocs[slug]||""; }});
    toast("Đang gửi "+files.length+" file lên GitHub…",8000);
    var ref=await ghApi(cfg,tok,"GET","/git/ref/heads/"+cfg.branch);
    var base=await ghApi(cfg,tok,"GET","/git/commits/"+ref.object.sha);
    var tree=files.map(function(f){ return {path:f.name,mode:"100644",type:"blob",content:String(f.data)}; });
    var nt=await ghApi(cfg,tok,"POST","/git/trees",{base_tree:base.tree.sha,tree:tree});
    var cm=await ghApi(cfg,tok,"POST","/git/commits",{message:"Cập nhật nội dung từ trang quản trị — "+new Date().toLocaleString("vi-VN"),tree:nt.sha,parents:[ref.object.sha]});
    await ghApi(cfg,tok,"PATCH","/git/refs/heads/"+cfg.branch,{sha:cm.sha,force:false});
    loadedUpdated=content.updated; dirty=false; pendingDocs={}; $("#dirty").hidden=true; saveDraft();
    toast("✓ Đã đăng "+files.length+" file. Chờ 1–2 phút để web cập nhật.",6000);
  }catch(e){ alert("Chưa đăng được lên GitHub.\n\nLý do: "+e.message+"\n\n"+ghHint(e)); }
  finally{ btn.disabled=false; btn.textContent=old; }
}

/* ---------------- Ảnh: thu nhỏ, nén, đẩy thẳng vào thư mục anh/ trên kho ---------------- */
function shrinkImage(file,maxW,quality){
  return new Promise(function(resolve,reject){
    if(!/^image\//.test(file.type)){ reject(new Error("File không phải ảnh")); return; }
    var img=new Image(), rd=new FileReader();
    rd.onload=function(){ img.src=String(rd.result); }; rd.onerror=function(){ reject(new Error("Không đọc được file ảnh")); };
    img.onload=function(){
      var w=img.naturalWidth,h=img.naturalHeight,k=Math.min(1,maxW/w),cw=Math.round(w*k),ch=Math.round(h*k),cv=document.createElement("canvas"); cv.width=cw; cv.height=ch;
      var cx=cv.getContext("2d"); cx.fillStyle="#fff"; cx.fillRect(0,0,cw,ch); cx.drawImage(img,0,0,cw,ch);
      var webp=cv.toDataURL("image/webp",quality), ok=/^data:image\/webp/.test(webp), data=ok?webp:cv.toDataURL("image/jpeg",quality);
      resolve({b64:data.split(",")[1],ext:ok?"webp":"jpg",w:cw,h:ch,data:data});
    };
    img.onerror=function(){ reject(new Error("Không đọc được ảnh — thử JPG hoặc PNG")); };
    rd.readAsDataURL(file);
  });
}
async function uploadImage(file,hint,maxW){
  var tok=ghToken(), cfg=ghCfg();
  if(!tok){ openGitHubModal(); throw new Error("Chưa có chìa khóa GitHub — lưu chìa khóa rồi thử lại"); }
  var im=await shrinkImage(file,maxW||1600,0.82);
  var base=HDB.slugify(hint||file.name.replace(/\.[^.]+$/,"")).slice(0,50)||"anh";
  var path="anh/"+today().slice(0,7)+"/"+base+"-"+Date.now().toString(36).slice(-4)+"."+im.ext;
  await ghApi(cfg,tok,"PUT","/contents/"+path,{message:"Tải ảnh "+path,content:im.b64,branch:cfg.branch});
  return {url:"/"+path,w:im.w,h:im.h};
}

/* ---------------- Hộp thoại ---------------- */
function modal(){
  var m=$("#modal"); if(!m){ m=el("div",{id:"modal",class:"modal"},[el("div",{class:"modal-card"})]); document.body.appendChild(m);
    m.addEventListener("click",function(e){ if(e.target===m) m.classList.remove("open"); }); }
  m.classList.add("open");
  return {card:m.firstChild,close:function(){ m.classList.remove("open"); }};
}

/* ---------------- Ô nhập ---------------- */
function fld(label,val,set,o){
  o=o||{}; var id=uid("f"), inp;
  if(o.area) inp=el("textarea",{id:id,rows:o.rows||3,placeholder:o.ph||""});
  else if(o.select){ inp=el("select",{id:id}); o.select.forEach(function(op){ var v=typeof op==="string"?op:op.v, t=typeof op==="string"?op:op.t; var oe=el("option",{value:v,text:t}); if(String(v)===String(val==null?"":val)) oe.selected=true; inp.appendChild(oe); }); }
  else inp=el("input",{id:id,type:o.type||"text",placeholder:o.ph||""});
  if(!o.select) inp.value=val==null?"":val;
  if(o.readonly) inp.readOnly=true;
  var wrap=el("div",{class:"f"},[el("label",{for:id,html:esc(label)+(o.sub?' <span class="sub">— '+esc(o.sub)+'</span>':'')}),inp]);
  var cnt=null;
  if(o.max){ cnt=el("div",{class:"cnt"}); wrap.appendChild(cnt); }
  function upd(){ if(!cnt) return; var n=String(o.countOf?o.countOf():inp.value).trim().length; cnt.textContent=n+" / "+o.max+" ký tự"+(n>o.max?" — hơi dài, Google có thể cắt bớt":""); cnt.className="cnt"+(n>o.max?" over":""); }
  inp.addEventListener(o.select?"change":"input",function(){ set(o.select||o.type==="number"?(o.num?+inp.value:inp.value):inp.value); changed(); upd(); if(o.after) o.after(inp.value); });
  upd(); wrap.input=inp; return wrap;
}
function chk(label,val,set){ var c=el("input",{type:"checkbox"}); c.checked=!!val; c.addEventListener("change",function(){ set(c.checked); changed(); }); return el("label",{class:"chk"},[c,label]); }
function linesFld(label,arr,set,o){ return fld(label+" (mỗi dòng một ý)",(arr||[]).join("\n"),function(v){ set(v.split("\n").map(function(x){return x.trim();}).filter(Boolean)); },Object.assign({area:true,rows:4},o||{})); }
function head(t,hint){ var d=el("div"); d.appendChild(el("h2",{class:"h",text:t})); if(hint) d.appendChild(el("p",{class:"hint",html:hint})); return d; }
function panel(title,kids){ var p=el("div",{class:"panel"}); if(title) p.appendChild(el("h3",{text:title})); (kids||[]).forEach(function(k){ if(k) p.appendChild(k); }); return p; }
function grid(kids,three){ var g=el("div",{class:"g2"+(three?" g3":"")}); kids.forEach(function(k){ if(k) g.appendChild(k); }); return g; }

/* Danh sách có nút lên/xuống/xóa */
function listEd(arr,nameOf,renderItem,addFn,opt){
  opt=opt||{}; var box=el("div",{class:"list"});
  function draw(){
    box.innerHTML="";
    arr.forEach(function(it,i){
      var card=el("div",{class:"item"+(it&&it.hidden?" hide":"")});
      var h=el("div",{class:"item-h"},[el("span",{class:"nm",text:nameOf(it,i)||"(mục)"})]);
      if(opt.tagOf){ var tg=opt.tagOf(it); if(tg) h.appendChild(el("span",{class:"tag"+(tg.off?" off":""),text:tg.t})); }
      h.appendChild(el("button",{class:"b b-ico",title:"Lên",text:"▲",onclick:function(){ if(i>0){ arr.splice(i-1,0,arr.splice(i,1)[0]); changed(); draw(); } }}));
      h.appendChild(el("button",{class:"b b-ico",title:"Xuống",text:"▼",onclick:function(){ if(i<arr.length-1){ arr.splice(i+1,0,arr.splice(i,1)[0]); changed(); draw(); } }}));
      h.appendChild(el("button",{class:"b b-ico b-red",title:"Xóa",text:"✕",onclick:function(){ if(confirm("Xóa mục này?")){ arr.splice(i,1); changed(); draw(); } }}));
      card.appendChild(h);
      var bodyEl=el("div"); renderItem(it,bodyEl,i,draw); card.appendChild(bodyEl);
      box.appendChild(card);
    });
    if(addFn) box.appendChild(el("button",{class:"add",text:"＋ "+(opt.addLabel||"Thêm mục"),onclick:function(){ arr.push(addFn()); changed(); draw(); }}));
  }
  draw(); return box;
}

/* ---------------- Trình soạn chữ có định dạng ---------------- */
function internalLinks(){
  var out=[{g:"Trang",t:"Trang chủ",u:"/"}];
  (content.pages||[]).forEach(function(p){ if(p.enabled!==false&&p.path) out.push({g:"Trang",t:p.navTitle||p.title,u:"/"+p.path}); });
  out.push({g:"Kiến thức",t:"Trang Kiến thức",u:"/bai-viet/"});
  (content.blog.categories||[]).forEach(function(k){ out.push({g:"Kiến thức",t:"Chuyên mục: "+k.name,u:"/bai-viet/chuyen-muc/"+k.slug+"/"}); });
  HDB.pubPosts(content).forEach(function(p){ out.push({g:"Bài viết",t:p.title,u:"/bai-viet/"+p.slug+"/"}); });
  out.push({g:"Liên hệ",t:"Nhắn Zalo",u:"zalo"});
  return out;
}
function richEditor(html,onChange,small){
  var tools=el("div",{class:"wy-tools"}), ed=el("div",{class:"editor"+(small?" small":""),contenteditable:"true","data-ph":"Viết nội dung ở đây…"});
  ed.innerHTML=sanitize(html||"");
  function push(){ onChange(sanitize(ed.innerHTML)); changed(); }
  var bts=[["H2","formatBlock:H2","Tiêu đề mục"],["H3","formatBlock:H3","Tiêu đề phụ"],["¶","formatBlock:P","Đoạn văn"],0,["<b>B</b>","bold","In đậm"],["<i>I</i>","italic","Nghiêng"],0,["• DS","insertUnorderedList","Danh sách chấm"],["1. DS","insertOrderedList","Danh sách số"],["❝","formatBlock:BLOCKQUOTE","Trích dẫn"],0,["🔗 Link","link","Chèn liên kết"],["🖼 Ảnh","image","Chèn ảnh"],["▦ Bảng","table","Chèn bảng"],0,["✕ Xóa ĐD","removeFormat","Xóa định dạng"]];
  if(small) bts=[["<b>B</b>","bold","In đậm"],["• DS","insertUnorderedList","Danh sách"],["🔗 Link","link","Chèn liên kết"],["¶","formatBlock:P","Đoạn văn"]];
  bts.forEach(function(b){
    if(!b){ tools.appendChild(el("span",{class:"sep"})); return; }
    var bt=el("button",{type:"button",html:b[0],title:b[2]});
    bt.addEventListener("mousedown",function(e){ e.preventDefault(); });
    bt.addEventListener("click",function(){ ed.focus(); var c=b[1];
      if(c.indexOf("formatBlock:")===0) document.execCommand("formatBlock",false,c.split(":")[1]);
      else if(c==="link"){ linkDialog(ed,push); return; }
      else if(c==="image"){ imageDialog(ed,push); return; }
      else if(c==="table"){ var cols=parseInt(prompt("Số cột:","3"),10), rows=parseInt(prompt("Số dòng (không tính dòng tiêu đề):","3"),10);
        if(!(cols>0&&cols<=8&&rows>0&&rows<=40)) return;
        document.execCommand("insertHTML",false,"<table><thead><tr>"+Array(cols+1).join("<th>Tiêu đề</th>")+"</tr></thead><tbody>"+Array(rows+1).join("<tr>"+Array(cols+1).join("<td>&nbsp;</td>")+"</tr>")+"</tbody></table><p><br></p>"); }
      else document.execCommand(c,false,null);
      push(); });
    tools.appendChild(bt);
  });
  ed.addEventListener("input",function(){ clearTimeout(ed.t); ed.t=setTimeout(push,250); });
  ed.addEventListener("blur",push);
  ed.addEventListener("paste",function(e){ var cd=e.clipboardData; if(!cd) return; var h=cd.getData("text/html"); if(!h) return; e.preventDefault(); document.execCommand("insertHTML",false,sanitize(h.replace(/<!--[\s\S]*?-->/g,""))); push(); });
  var w=el("div",{class:"f"},[tools,ed]); w.ed=ed; return w;
}
function keepRange(ed){ var s=window.getSelection(); var r=(s&&s.rangeCount)?s.getRangeAt(0).cloneRange():null; return (r&&ed.contains(r.commonAncestorContainer))?r:null; }
function restore(ed,r){ ed.focus(); var s=window.getSelection(); s.removeAllRanges(); s.addRange(r); }
function linkDialog(ed,done){
  var range=keepRange(ed); if(!range){ toast("Bấm vào chỗ cần chèn link (hoặc bôi đen chữ) trước đã"); return; }
  var node=range.startContainer; node=node.nodeType===3?node.parentNode:node; var cur=node&&node.closest?node.closest("a"):null; if(cur&&!ed.contains(cur)) cur=null;
  var pages=internalLinks(), m=modal();
  m.card.innerHTML='<h3>'+(cur?"Sửa liên kết":"Chèn liên kết")+'</h3><div class="f"><label>Trang trong web HuyData (nên dùng)</label><select id="lk-p"><option value="">— Chọn trang —</option>'+
    pages.map(function(p,i){return '<option value="'+i+'">'+esc(p.g+" · "+p.t)+'</option>';}).join("")+'</select></div>'+
    '<div class="f"><label>Hoặc dán địa chỉ</label><input id="lk-u" placeholder="https://… hoặc /bai-viet/ten-bai/" value="'+esc(cur?cur.getAttribute("href"):"")+'"></div>'+
    (range.collapsed&&!cur?'<div class="f"><label>Chữ hiện ra</label><input id="lk-t" placeholder="vd: phần mềm tải hóa đơn"></div>':'')+
    '<div class="modal-err" id="lk-e"></div><div class="row">'+(cur?'<button class="b b-red" id="lk-x">Bỏ link</button>':'')+'<button class="b" id="lk-c">Đóng</button><button class="b b-pri" id="lk-ok">Chèn</button></div>';
  $("#lk-p").onchange=function(){ var p=pages[this.value]; if(!p) return; $("#lk-u").value=p.u==="zalo"?"https://zalo.me/"+String(content.settings.zalo).replace(/\D/g,""):p.u; var t=$("#lk-t"); if(t&&!t.value) t.value=p.t; };
  $("#lk-c").onclick=m.close;
  if(cur) $("#lk-x").onclick=function(){ var f=document.createDocumentFragment(); while(cur.firstChild) f.appendChild(cur.firstChild); cur.replaceWith(f); m.close(); done(); };
  $("#lk-ok").onclick=function(){
    var u=$("#lk-u").value.trim(); if(/^www\./i.test(u)) u="https://"+u;
    if(!u||!safeHref(u)){ $("#lk-e").textContent="Địa chỉ chưa hợp lệ. Dùng https://… hoặc /duong-dan/"; return; }
    m.close();
    if(cur){ cur.setAttribute("href",u); done(); return; }
    restore(ed,range);
    if(range.collapsed){ var t=($("#lk-t")&&$("#lk-t").value.trim())||u; document.execCommand("insertHTML",false,'<a href="'+esc(u)+'">'+esc(t)+'</a>'); }
    else document.execCommand("createLink",false,u);
    done();
  };
}
function imageDialog(ed,done){
  var range=keepRange(ed); if(!range){ toast("Bấm vào chỗ cần chèn ảnh trước đã"); return; }
  var m=modal(), dims={w:0,h:0};
  m.card.innerHTML='<h3>Chèn ảnh</h3><div class="f"><label>Ảnh từ máy (tự thu nhỏ, nén rồi tải lên web)</label><div class="row"><button class="b" id="im-pick">📤 Chọn ảnh…</button><span class="hint" id="im-st" style="margin:0"></span></div><input type="file" id="im-f" accept="image/*" hidden></div>'+
    '<div class="f"><label>Hoặc địa chỉ ảnh có sẵn</label><input id="im-u" placeholder="/anh/… hoặc https://…"></div>'+
    '<div class="f"><label>Mô tả ảnh (alt) — Google đọc phần này</label><input id="im-a" placeholder="vd: Bảng kê hóa đơn mua vào trên Hóa Đơn Pro"></div>'+
    '<div class="f"><label>Chú thích dưới ảnh (không bắt buộc)</label><input id="im-c"></div>'+
    '<div class="modal-err" id="im-e"></div><div class="row"><button class="b" id="im-x">Đóng</button><button class="b b-pri" id="im-ok">Chèn ảnh</button></div>';
  $("#im-pick").onclick=function(){ $("#im-f").click(); };
  $("#im-f").onchange=async function(){ var f=this.files&&this.files[0]; if(!f) return; $("#im-st").textContent="Đang nén và tải lên…"; $("#im-e").textContent="";
    try{ var r=await uploadImage(f,$("#im-a").value||f.name,1600); $("#im-u").value=r.url; dims={w:r.w,h:r.h}; $("#im-st").textContent="✓ Đã tải lên ("+r.w+"×"+r.h+"). Ảnh hiện trên web sau 1–2 phút."; }
    catch(e){ $("#im-e").textContent="Chưa tải được: "+e.message; $("#im-st").textContent=""; } this.value=""; };
  $("#im-x").onclick=m.close;
  $("#im-ok").onclick=function(){
    var u=$("#im-u").value.trim(), a=$("#im-a").value.trim(), c=$("#im-c").value.trim();
    if(!u||!safeSrc(u)){ $("#im-e").textContent="Chưa có ảnh. Chọn ảnh từ máy hoặc dán địa chỉ /anh/… hoặc https://…"; return; }
    if(!a&&!$("#im-a").dataset.w){ $("#im-a").dataset.w=1; $("#im-e").textContent="Nên điền mô tả ảnh — một câu ngắn là đủ. Bấm Chèn lần nữa nếu muốn bỏ qua."; return; }
    m.close(); restore(ed,range);
    var tag='<img src="'+esc(u)+'" alt="'+esc(a)+'"'+(dims.w?' width="'+dims.w+'" height="'+dims.h+'"':'')+'>';
    document.execCommand("insertHTML",false,c?'<figure>'+tag+'<figcaption>'+esc(c)+'</figcaption></figure><p><br></p>':tag);
    done();
  };
}
/* Ô địa chỉ ảnh + nút tải ảnh từ máy */
function imageFld(label,obj,key,hintFn,maxW){
  var w=fld(label,obj[key]||"",function(v){ obj[key]=v; },{ph:"/anh/… hoặc https://…"});
  var row=el("div",{class:"row",style:"margin-top:6px"}), fi=el("input",{type:"file",accept:"image/*",hidden:true}), st=el("span",{class:"hint",style:"margin:0"});
  var prev=el("img",{class:"thumb",alt:""}); if(obj[key]) prev.src=obj[key]; else prev.hidden=true;
  row.appendChild(prev);
  row.appendChild(el("button",{type:"button",class:"b b-sm",text:"📤 Tải ảnh từ máy",onclick:function(){ fi.click(); }}));
  row.appendChild(st);
  fi.onchange=async function(){ var f=fi.files&&fi.files[0]; if(!f) return; st.textContent="Đang nén và tải lên…";
    try{ var r=await uploadImage(f,hintFn?hintFn():"",maxW||1600); obj[key]=r.url; w.input.value=r.url; prev.src=r.url; prev.hidden=false; if(obj.w!==undefined||key==="src"){ obj.w=r.w; obj.h=r.h; } changed(); st.textContent="✓ Đã tải lên — hiện trên web sau 1–2 phút"; }
    catch(e){ st.textContent="✗ "+e.message; } fi.value=""; };
  w.input.addEventListener("input",function(){ prev.src=w.input.value; prev.hidden=!w.input.value; });
  w.appendChild(row); w.appendChild(fi); return w;
}
function imageBox(obj,label,hintFn){
  return panel(label||"Ảnh",[
    imageFld("Địa chỉ ảnh",obj,"src",hintFn),
    fld("Mô tả ảnh (alt)",obj.alt,function(v){obj.alt=v;},{ph:"Ảnh có gì — Google đọc phần này"}),
    grid([fld("Khung",obj.frame||"plain",function(v){obj.frame=v;},{select:[{v:"laptop",t:"Máy tính"},{v:"phone",t:"Điện thoại"},{v:"plain",t:"Không khung"}]}),
          fld("Chú thích dưới ảnh",obj.caption,function(v){obj.caption=v;})])
  ]);
}

/* ---------------- Nút bấm ---------------- */
var STYLES=[{v:"primary",t:"Xanh đậm (chính)"},{v:"outline",t:"Viền"},{v:"zalo",t:"Zalo (xanh dương)"},{v:"light",t:"Trắng (trên nền tối)"}];
var LINK_HINT="zalo = mở Zalo · tel = gọi điện · /duong-dan/ = trang trong web";
function buttonsEd(arr,withSub){
  return listEd(arr,function(b){return b.label;},function(b,box){
    box.appendChild(grid([fld("Chữ trên nút",b.label,function(v){b.label=v;}),fld("Bấm vào thì đi đâu",b.href,function(v){b.href=v;},{sub:LINK_HINT})]));
    box.appendChild(grid([withSub?fld("Dòng nhỏ dưới chữ",b.sub,function(v){b.sub=v;}):null,fld("Kiểu nút",b.style||"primary",function(v){b.style=v;},{select:STYLES}),
      fld("Biểu tượng",b.icon||"",function(v){b.icon=v;},{select:[{v:"",t:"(không)"}].concat(HDB.ICONS.map(function(k){return {v:k,t:k};}))})]));
  },function(){ return {label:"Nhắn Zalo",href:"zalo",style:"zalo"}; },{addLabel:"Thêm nút"});
}

/* ---------------- Trang & khối ---------------- */
var BLOCK_NAMES={text:"Đoạn chữ",split:"Chữ + ảnh",cards:"Thẻ (tính năng)",products:"Danh sách phần mềm",services:"Danh sách dịch vụ",flow:"Dòng chảy 3 bước",steps:"Các bước",faq:"Hỏi đáp",plans:"Gói / bảng giá",stories:"Khách hàng thật",posts:"Bài viết mới",compare:"Bảng so sánh",media:"Ảnh lớn",video:"Video",contact:"Thông tin liên hệ",payment:"Chuyển khoản",cta:"Dải kêu gọi"};
function newBlock(t){
  var b={type:t,title:BLOCK_NAMES[t]};
  if(t==="text"||t==="contact") b.html="<p>Viết nội dung…</p>";
  if(t==="split"){ b.html="<p>Viết nội dung…</p>"; b.image={src:"",alt:"",frame:"laptop"}; }
  if(t==="cards") b.items=[{icon:"check",title:"Tiêu đề",text:"<p>Nội dung</p>"}];
  if(t==="flow"||t==="steps") b.items=[{title:"Bước 1",text:""},{title:"Bước 2",text:""},{title:"Bước 3",text:""}];
  if(t==="faq") b.items=[{q:"Câu hỏi?",a:"Trả lời."}];
  if(t==="plans") b.items=[{name:"Gói 1",for:"",price:"Liên hệ",cta:"Nhắn Zalo hỏi giá",ctaHref:"zalo"}];
  if(t==="compare"){ b.headers=["Việc","Trước","Sau"]; b.rows=[{label:"",a:"",b:""}]; }
  if(t==="media") b.image={src:"",alt:"",frame:"plain"};
  if(t==="video"){ b.url=""; b.label="Xem video"; }
  if(t==="cta"){ b.title="Có gì chưa rõ, nhắn một tiếng"; b.text=""; b.buttons=[{label:"Nhắn Zalo",href:"zalo",style:"zalo"}]; }
  if(t==="posts") b.limit=3;
  return b;
}
function blockEditor(b,box){
  var common=grid([chk("Ẩn khối này (chưa hiện trên web)",b.hidden,function(v){b.hidden=v;}),
    fld("Nền",b.tone||"",function(v){b.tone=v;},{select:[{v:"",t:"Trắng"},{v:"mist",t:"Xanh nhạt"},{v:"dark",t:"Xanh đậm"}]})]);
  var t=b.type;
  if(t!=="cta") box.appendChild(fld("Tiêu đề khối (H2)",b.title,function(v){b.title=v;},{sub:"để trống nếu không cần"}));
  if(/^(cards|products|flow|steps|faq|plans|stories|posts|compare|media)$/.test(t)) box.appendChild(fld("Dòng giới thiệu",b.intro,function(v){b.intro=v;},{area:true,rows:2}));
  if(t==="text"||t==="split"||t==="contact"){ box.appendChild(richEditor(b.html,function(h){b.html=h;})); }
  if(t==="split"){ box.appendChild(imageBox(b.image=b.image||{},"Ảnh bên cạnh")); box.appendChild(chk("Ảnh nằm bên trái",b.reverse,function(v){b.reverse=v;})); }
  if(t==="text"||t==="split"){ b.buttons=b.buttons||[]; box.appendChild(panel("Nút bấm dưới đoạn chữ",[buttonsEd(b.buttons)])); }
  if(t==="cards"){
    box.appendChild(fld("Số cột trên máy tính",String(b.cols||3),function(v){b.cols=+v;},{select:["2","3","4"]}));
    b.items=b.items||[];
    box.appendChild(listEd(b.items,function(x){return x.title;},function(x,bx){
      bx.appendChild(grid([fld("Tiêu đề",x.title,function(v){x.title=v;}),fld("Biểu tượng",x.icon||"",function(v){x.icon=v;},{select:[{v:"",t:"(không)"}].concat(HDB.ICONS.map(function(k){return {v:k,t:k};}))})]));
      bx.appendChild(richEditor(x.text,function(h){x.text=h;},true));
      bx.appendChild(grid([fld("Nút: chữ",x.linkLabel,function(v){x.linkLabel=v;}),fld("Nút: đi đâu",x.link,function(v){x.link=v;})]));
    },function(){ return {icon:"check",title:"Tiêu đề",text:"<p>Nội dung</p>"}; },{addLabel:"Thêm thẻ"}));
  }
  if(t==="products"){ box.appendChild(grid([fld("Chữ nút xem",b.moreLabel,function(v){b.moreLabel=v;}),fld("Chữ nút Zalo",b.zaloLabel,function(v){b.zaloLabel=v;})]));
    box.appendChild(el("p",{class:"hint",text:"Danh sách lấy tự động từ các trang phần mềm đang bật (mục Trang). Thêm phần mềm mới ở mục Trang → ＋ Thêm phần mềm."})); }
  if(t==="services") box.appendChild(el("p",{class:"hint",text:"Danh sách lấy tự động từ các trang dịch vụ đang bật (mục Trang → nhóm Dịch vụ). Thêm dịch vụ mới ở mục Trang → ＋ Thêm dịch vụ."}));
  if(t==="flow"||t==="steps"){
    if(t==="steps") box.appendChild(fld("Số cột trên máy tính",String(b.cols||""),function(v){b.cols=v?+v:0;},{select:[{v:"",t:"Một cột"},"2","3","4"]}));
    b.items=b.items||[];
    box.appendChild(listEd(b.items,function(x,i){return (i+1)+". "+x.title;},function(x,bx){ bx.appendChild(fld("Tên bước",x.title,function(v){x.title=v;})); bx.appendChild(fld("Giải thích",x.text,function(v){x.text=v;},{area:true,rows:2})); },function(){ return {title:"Bước mới",text:""}; },{addLabel:"Thêm bước"}));
    box.appendChild(fld("Dòng ghi chú dưới các bước",typeof b.after==="string"?b.after.replace(/<[^>]+>/g,""):"",function(v){ b.after=t==="steps"?(v?"<p>"+esc(v)+"</p>":""):v; },{area:true,rows:2}));
  }
  if(t==="faq"){ b.items=b.items||[];
    box.appendChild(listEd(b.items,function(x){return x.q;},function(x,bx){ bx.appendChild(fld("Câu hỏi",x.q,function(v){x.q=v;})); bx.appendChild(fld("Trả lời",String(x.a||"").replace(/<[^>]+>/g,""),function(v){x.a=v;},{area:true,rows:3})); },function(){ return {q:"Câu hỏi mới?",a:""}; },{addLabel:"Thêm câu hỏi"})); }
  if(t==="plans"){ box.appendChild(fld("Ghi chú dưới bảng giá",b.note,function(v){b.note=v;},{area:true,rows:2})); b.items=b.items||[];
    box.appendChild(listEd(b.items,function(x){return x.name+" — "+(x.price||"Liên hệ");},planItemEd,function(){ return {name:"Gói mới",for:"",price:"Liên hệ",cta:"Nhắn Zalo hỏi giá",ctaHref:"zalo"}; },{addLabel:"Thêm gói"})); }
  if(t==="stories") box.appendChild(grid([fld("Chỉ hiện các lời kể số (vd: 3,2 — để trống là tất cả)",(b.ids||[]).map(function(x){return x+1;}).join(","),function(v){ b.ids=v.split(/[,\s]+/).map(function(x){return parseInt(x,10)-1;}).filter(function(x){return x>=0;}); }),fld("Tối đa bao nhiêu lời",b.limit||"",function(v){b.limit=+v||0;})]));
  if(t==="posts") box.appendChild(grid([fld("Số bài hiện",String(b.limit||3),function(v){b.limit=+v||3;}),fld("Chữ nút xem tất cả",b.moreLabel,function(v){b.moreLabel=v;})]));
  if(t==="compare"){ b.headers=b.headers||["","",""]; b.rows=b.rows||[];
    box.appendChild(grid(b.headers.map(function(h,i){ return fld("Tiêu đề cột "+(i+1),h,function(v){b.headers[i]=v;}); }),true));
    box.appendChild(listEd(b.rows,function(r){return r.label;},function(r,bx){ bx.appendChild(grid([fld("Cột 1",r.label,function(v){r.label=v;}),fld("Cột 2",r.a,function(v){r.a=v;}),fld("Cột 3",r.b,function(v){r.b=v;})],true)); },function(){ return {label:"",a:"",b:""}; },{addLabel:"Thêm dòng"}));
    box.appendChild(fld("Ghi chú dưới bảng",b.note,function(v){b.note=v;})); }
  if(t==="media") box.appendChild(imageBox(b.image=b.image||{},"Ảnh"));
  if(t==="video") box.appendChild(grid([fld("Địa chỉ video (YouTube…)",b.url,function(v){b.url=v;},{sub:"trống thì khối tự ẩn"}),fld("Chữ trên nút",b.label,function(v){b.label=v;})]));
  if(t==="payment") box.appendChild(el("p",{class:"hint",text:"Số tài khoản, mã QR sửa ở Cài đặt → Chuyển khoản. Khối tự ẩn khi chưa bật hiện."}));
  if(t==="cta"){ box.appendChild(fld("Tiêu đề",b.title,function(v){b.title=v;})); box.appendChild(fld("Đoạn chữ",b.text,function(v){b.text=v;},{area:true,rows:2})); b.buttons=b.buttons||[]; box.appendChild(panel("Nút bấm",[buttonsEd(b.buttons)])); }
  box.appendChild(common);
}
function planItemEd(x,bx){
  bx.appendChild(grid([fld("Tên gói",x.name,function(v){x.name=v;}),fld("Dành cho",x.for,function(v){x.for=v;})]));
  bx.appendChild(grid([fld("Giá",x.price,function(v){x.price=v;},{sub:"để “Liên hệ” nếu chưa công bố"}),fld("Giá cũ (gạch ngang)",x.oldPrice,function(v){x.oldPrice=v;}),fld("Kỳ trả",x.period,function(v){x.period=v;},{ph:"/ năm"})],true));
  bx.appendChild(linesFld("Gồm những gì",x.features,function(v){x.features=v;}));
  bx.appendChild(grid([fld("Chữ trên nút",x.cta,function(v){x.cta=v;}),fld("Nút đi đâu",x.ctaHref,function(v){x.ctaHref=v;},{sub:LINK_HINT})]));
  bx.appendChild(grid([chk("Làm nổi gói này",x.highlight,function(v){x.highlight=v;}),fld("Nhãn nhỏ (vd: Hay chọn)",x.badge,function(v){x.badge=v;})]));
}
function pageEditor(pg,body){
  body.appendChild(el("button",{class:"b",text:"← Về danh sách trang",onclick:function(){ cur.edit=null; render(); }}));
  body.appendChild(head("Sửa trang: "+(pg.navTitle||pg.title),"Địa chỉ: <b>huydata.vn/"+esc(pg.path||"")+"</b>. Sửa xong bấm <b>Xem trước</b> để xem, rồi <b>Đăng lên GitHub</b>."));
  var info=panel("Thông tin trang",[
    grid([fld("Tên trang (dùng trong menu, đường dẫn)",pg.navTitle,function(v){pg.navTitle=v;}),fld("Tên đầy đủ",pg.title,function(v){pg.title=v;})]),
    pg.id!=="home"?chk("Trang đang bật (hiện trên web)",pg.enabled!==false,function(v){pg.enabled=v;}):null
  ]);
  body.appendChild(info);
  pg.seo=pg.seo||{};
  body.appendChild(panel("Hiện trên Google",[
    fld("Tiêu đề trên Google (thẻ title)",pg.seo.title,function(v){pg.seo.title=v;},{max:60}),
    fld("Mô tả dưới tiêu đề (meta description)",pg.seo.desc,function(v){pg.seo.desc=v;},{area:true,rows:2,max:160}),
    fld("Ảnh khi chia sẻ lên Zalo, Facebook (để trống = ảnh chung của web)",pg.seo.image,function(v){pg.seo.image=v.trim();},{ph:"/anh/v9/og-huydata.jpg",sub:"Ảnh ngang 1200×630"})
  ]));
  if(pg.kind==="product"){ pg.card=pg.card||{};
    var k=pg.card;
    body.appendChild(panel("Thẻ phần mềm (hiện ở trang chủ, trang Phần mềm)",[
      grid([fld("Tên phần mềm",k.name,function(v){k.name=v;}),fld("Giá hiện trên thẻ",k.price,function(v){k.price=v;},{sub:"vd: Liên hệ"})]),
      fld("Một câu giới thiệu",k.line,function(v){k.line=v;},{area:true,rows:2}),
      grid([fld("Dành cho",k.for,function(v){k.for=v;}),fld("Chạy trên",k.platform,function(v){k.platform=v;}),fld("Chữ nút Zalo trên thẻ",k.zaloLabel,function(v){k.zaloLabel=v;})],true),
      fld("Thứ tự (số nhỏ đứng trước)",String(pg.order||""),function(v){pg.order=+v||0;}),
      imageBox(k.image=k.image||{},"Ảnh trên thẻ")
    ]));
  }
  if(pg.kind==="service"){ pg.card=pg.card||{};
    var sk=pg.card;
    body.appendChild(panel("Thẻ dịch vụ (hiện ở trang chủ, trang Dịch vụ và menu thả xuống)",[
      fld("Tên dịch vụ",sk.name,function(v){sk.name=v;}),
      fld("Một câu giới thiệu",sk.line,function(v){sk.line=v;},{area:true,rows:2}),
      grid([fld("Biểu tượng",sk.icon||"",function(v){sk.icon=v;},{select:[{v:"",t:"(mặc định)"},{v:"users",t:"Người đồng hành"},{v:"store",t:"Cửa hàng"},{v:"file",t:"Hồ sơ, giấy tờ"},{v:"book",t:"Sổ sách"},{v:"shield",t:"An toàn"},{v:"phone",t:"Điện thoại, tư vấn"},{v:"calculator",t:"Tính toán"}]}),
            fld("Thứ tự (số nhỏ đứng trước)",String(pg.order||""),function(v){pg.order=+v||0;})])
    ]));
  }
  pg.hero=pg.hero||{}; var h=pg.hero; h.doors=h.doors||[];
  var hp=panel("Phần đầu trang",[
    fld("Dòng nhỏ trên cùng",h.eyebrow,function(v){h.eyebrow=v;}),
    fld("Tiêu đề lớn (H1)",h.h1,function(v){h.h1=v;},{area:true,rows:2}),
    fld("Dòng phụ",h.sub,function(v){h.sub=v;},{area:true,rows:2})]);
  hp.appendChild(el("h3",{text:"Nút lớn"})); hp.appendChild(buttonsEd(h.doors,true));
  if(!h.image) h.image={src:"",alt:"",frame:"laptop"};
  hp.appendChild(imageBox(h.image,"Ảnh đầu trang (để trống địa chỉ nếu không dùng ảnh)"));
  body.appendChild(hp);
  body.appendChild(head("Các khối nội dung","Mỗi khối là một đoạn trên trang, xếp từ trên xuống. Đổi thứ tự bằng ▲▼, ẩn tạm bằng ô “Ẩn khối này”."));
  pg.blocks=pg.blocks||[];
  body.appendChild(listEd(pg.blocks,function(b){return (BLOCK_NAMES[b.type]||b.type)+(b.title?": "+b.title:"");},blockEditor,null,{tagOf:function(b){return b.hidden?{t:"đang ẩn",off:true}:null;}}));
  var sel=el("select",{style:"padding:10px;border-radius:10px;border:1.5px solid var(--line);min-height:44px"});
  HDB.BLOCK_TYPES.forEach(function(t){ sel.appendChild(el("option",{value:t,text:BLOCK_NAMES[t]})); });
  body.appendChild(panel("Thêm khối mới",[el("div",{class:"row"},[sel,el("button",{class:"b b-pri",text:"＋ Thêm khối",onclick:function(){ pg.blocks.push(newBlock(sel.value)); changed(); render(); setTimeout(function(){ window.scrollTo(0,document.body.scrollHeight); },50); }})])]));
  body.appendChild(el("div",{class:"row",style:"margin-top:8px"},[el("button",{class:"b",text:"👁 Xem trước trang này",onclick:function(){ preview(HDB.renderPage(content,pg),pg.path); }}),
    pg.id!=="home"&&pg.kind?el("button",{class:"b b-red",text:"Xóa trang",onclick:function(){ deletePage(pg); }}):null]));
}
function deletePage(pg){
  if(!confirm("Xóa trang “"+(pg.navTitle||pg.title)+"”?\n\nĐịa chỉ cũ sẽ tự chuyển về trang cha để khách bấm link cũ không bị lỗi.")) return;
  var par=pg.parent?(content.pages.find(function(p){return p.id===pg.parent;})||{}).path:"";
  content.redirects=content.redirects||[]; content.redirects.push({from:pg.path,to:"/"+(par||"")});
  content.pages=content.pages.filter(function(p){return p!==pg;}); cur.edit=null; changed(); render();
}
function newProduct(){
  var name=prompt("Tên phần mềm mới (vd: Kế Toán Pro):"); if(!name) return;
  var slug=HDB.slugify(name); if(content.pages.some(function(p){return p.path==="phan-mem/"+slug+"/";})){ alert("Đã có trang này rồi."); return; }
  var pg={id:slug,path:"phan-mem/"+slug+"/",parent:"phan-mem",kind:"product",order:(HDB.products(content).length+1),enabled:false,title:name,navTitle:name,
    card:{name:name,line:"Một câu nói phần mềm làm gì.",for:"",platform:"Máy tính Windows",price:"Liên hệ",image:{src:"",alt:""}},
    seo:{title:name+" | HuyData",desc:""},hero:{eyebrow:"",h1:name,sub:"",doors:[{label:"Nhắn Zalo xin bản dùng thử",href:"zalo",style:"zalo"},{label:"Xem cách mua",href:"/mua/",style:"outline",icon:"cart"}],image:{src:"",alt:"",frame:"laptop"}},
    blocks:[newBlock("text"),Object.assign(newBlock("cards"),{tone:"mist",title:name+" làm được gì"}),Object.assign(newBlock("plans"),{title:"Giá"}),newBlock("cta")]};
  content.pages.push(pg); changed(); cur.edit={type:"page",id:pg.id}; render();
  toast("Đã tạo trang nháp (đang tắt). Viết xong thì bật “Trang đang bật”.",6000);
}
function newService(){
  var name=prompt("Tên dịch vụ mới (hiện trong menu Dịch vụ):"); if(!name) return;
  var slug=HDB.slugify(name); if(content.pages.some(function(p){return p.path==="dich-vu/"+slug+"/";})){ alert("Đã có trang này rồi."); return; }
  var pg={id:slug,path:"dich-vu/"+slug+"/",parent:"dich-vu",kind:"service",order:(HDB.services(content).length+1),enabled:false,card:{name:name,line:"Một câu nói dịch vụ giúp được gì.",icon:"file"},title:name,navTitle:name,seo:{title:name+" | HuyData",desc:""},
    hero:{eyebrow:"",h1:name,sub:"",doors:[{label:"Nhắn Zalo hỏi",href:"zalo",style:"zalo"}]},blocks:[newBlock("text"),newBlock("cta")]};
  content.pages.push(pg); changed(); cur.edit={type:"page",id:pg.id}; render();
}

/* ---------------- Bài viết ---------------- */
function audienceFld(p){
  p.audience=p.audience||[];
  var w=el("div",{class:"f"},[el("label",{text:"Dành cho (chọn một hoặc nhiều)"})]), row=el("div",{class:"row"});
  (content.blog.audiences||[]).forEach(function(a){
    var c=el("input",{type:"checkbox"}); c.checked=p.audience.indexOf(a.slug)>=0;
    c.addEventListener("change",function(){ p.audience=p.audience.filter(function(x){return x!==a.slug;}); if(c.checked) p.audience.push(a.slug); changed(); });
    row.appendChild(el("label",{class:"chk",style:"margin-right:14px"},[c,a.name]));
  });
  w.appendChild(row); return w;
}
function postsPanel(body){
  body.appendChild(head("Kiến thức","Viết bài mới bằng nút bên dưới, chọn Chuyên mục và Dành cho để bài tự vào đúng chỗ trên trang Kiến thức. Bài chưa bật “Đăng bài này” thì chưa hiện trên web."));
  body.appendChild(el("button",{class:"b b-pri",style:"margin-bottom:14px;min-height:52px;font-size:17px",text:"＋ Viết bài mới",onclick:function(){
    var p={id:uid("p"),slug:"",title:"",date:today(),excerpt:"",metaTitle:"",metaDesc:"",category:"",audience:[],facts:[],sources:[],note:"",product:"",cover:"",coverAlt:"",published:false,body:"<p></p>"};
    content.blog.posts.unshift(p); changed(); cur.edit={type:"post",id:p.id}; render(); }}));
  var list=content.blog.posts.slice().sort(function(a,b){ return String(b.date||"").localeCompare(String(a.date||"")); });
  list.forEach(function(p){
    body.appendChild(el("button",{class:"rowlink",onclick:function(){ cur.edit={type:"post",id:p.id}; render(); }},[
      p.cover?el("img",{class:"thumb",src:p.cover,alt:""}):null,
      el("span",{},[el("b",{text:p.title||"(chưa có tiêu đề)"}),el("small",{text:((content.blog.categories||[]).filter(function(k){return k.slug===p.category;}).map(function(k){return k.name+" · ";})[0]||"Chưa chọn chuyên mục · ")+"/bai-viet/"+(p.slug||"…")+"/"})]),
      el("span",{class:"r",html:esc(HDB.fmtDate(p.date))+"<br>"+(p.published?'<span class="ok">● Đã đăng</span>':'<span class="warn">● Nháp</span>')})]));
  });
}
function postEditor(p,body){
  body.appendChild(el("button",{class:"b",text:"← Về danh sách bài",onclick:function(){ cur.edit=null; render(); }}));
  body.appendChild(head(p.published?"Sửa bài viết":"Bài viết mới"));
  var slugTouched=!!p.slug, original=p.slug;
  var fSlug=fld("Đường dẫn (tự tạo từ tiêu đề)",p.slug,function(v){
    var nx=HDB.slugify(v);
    if(p.published&&original&&nx!==original&&!confirm("Bài đã đăng mà đổi đường dẫn thì link cũ (đã chia sẻ, Google đã lưu) sẽ hỏng. Vẫn đổi?")){ fSlug.input.value=p.slug; return; }
    slugTouched=true; p.slug=nx;
  },{ph:"vi-du-duong-dan"});
  body.appendChild(panel(null,[
    fld("Tiêu đề bài (H1)",p.title,function(v){ p.title=v; if(!slugTouched){ p.slug=HDB.slugify(v); fSlug.input.value=p.slug; } }),
    fSlug,
    grid([fld("Ngày đăng",p.date,function(v){p.date=v;},{type:"date"}),fld("Ngày cập nhật (khi sửa nhiều)",p.updated,function(v){p.updated=v;},{type:"date"})]),
    grid([fld("Chuyên mục",p.category||"",function(v){p.category=v;},{select:[{v:"",t:"— Chọn chuyên mục —"}].concat((content.blog.categories||[]).map(function(k){return {v:k.slug,t:k.name};}))}),
          fld("Gợi ý phần mềm / dịch vụ cuối bài (không bắt buộc)",p.product,function(v){p.product=v;},{select:[{v:"",t:"(không)"}].concat((content.pages||[]).filter(function(x){return x.kind==="product"||x.kind==="service";}).map(function(x){return {v:x.id,t:x.navTitle||x.title};}))})]),
    audienceFld(p),
    chk("Đây là bài Cẩm nang (bài tổng quan của chuyên mục, hiện ở mục “Cẩm nang trọng tâm”)",p.pillar,function(v){p.pillar=v;}),
    fld("Tóm tắt (hiện trên thẻ bài và đầu bài)",p.excerpt,function(v){p.excerpt=v;},{area:true,rows:2})
  ]));
  p.facts=p.facts||[]; p.sources=p.sources||[];
  body.appendChild(panel("Thông tin chính (nên điền với bài chính sách)",[
    el("p",{class:"hint",text:"Hiện thành khung tóm tắt ở đầu bài. Ví dụ: Áp dụng từ — 01/01/2026; Văn bản — Thông tư 152/2025/TT-BTC; Đối tượng — Hộ kinh doanh."}),
    listEd(p.facts,function(x){return x.k+(x.v?": "+x.v:"");},function(x,bx){ bx.appendChild(grid([fld("Mục",x.k,function(v){x.k=v;}),fld("Nội dung",x.v,function(v){x.v=v;})])); },function(){ return {k:"Áp dụng từ",v:""}; },{addLabel:"Thêm dòng"})]));
  body.appendChild(panel("Ảnh bìa",[imageFld("Ảnh bìa (nên ngang, rộng 1200px)",p,"cover",function(){return p.title;}),fld("Mô tả ảnh bìa (alt)",p.coverAlt,function(v){p.coverAlt=v;})]));
  body.appendChild(el("h3",{text:"Nội dung bài",style:"margin:18px 0 8px;color:var(--g9)"}));
  var rich=richEditor(p.body,function(h){ p.body=h; upd(); }); body.appendChild(rich);
  var ck=el("div",{class:"check"}); body.appendChild(ck);
  function upd(){
    var ed=rich.ed, words=(ed.innerText||"").split(/\s+/).filter(Boolean).length, h2=ed.querySelectorAll("h2").length;
    var links=$$("a[href]",ed).map(function(a){return a.getAttribute("href");}), inner=links.filter(function(x){return !isExternalHref(x);}).length;
    var imgs=$$("img",ed), noAlt=imgs.filter(function(i){return !String(i.getAttribute("alt")||"").trim();}).length;
    var rows=[[words>=600,"Độ dài: "+words+" chữ"+(words<600?" (bài kiến thức nên từ 600 chữ)":"")],[h2>=2,"Tiêu đề mục (H2): "+h2+(h2>=3?" — tự có mục lục":" — nên chia vài mục H2")],
      [inner>=1,"Link trong web: "+inner+(inner<1?" — nên dẫn sang trang phần mềm hoặc bài liên quan":"")],[noAlt===0,imgs.length?("Ảnh: "+imgs.length+(noAlt?" — "+noAlt+" ảnh thiếu mô tả":" — đủ mô tả")):"Ảnh trong bài: chưa có (không bắt buộc)"],
      [!!String(p.metaDesc||p.excerpt||"").trim(),"Mô tả trên Google: "+(String(p.metaDesc||p.excerpt||"").trim()?"đã có":"chưa có — điền Tóm tắt")]];
    ck.innerHTML='<b>Kiểm tra nhanh trước khi đăng</b><br>'+rows.map(function(r){return (r[0]?'<span class="ok">✓</span> ':'<span class="warn">•</span> ')+esc(r[1]);}).join("<br>");
  }
  upd();
  body.appendChild(panel("Hiện trên Google (không bắt buộc)",[
    fld("Tiêu đề trên Google — trống thì dùng tiêu đề bài",p.metaTitle,function(v){p.metaTitle=v;},{max:60,countOf:function(){return p.metaTitle||p.title;}}),
    fld("Mô tả trên Google — trống thì dùng Tóm tắt",p.metaDesc,function(v){p.metaDesc=v;},{area:true,rows:2,max:160,countOf:function(){return p.metaDesc||p.excerpt||"";}})
  ]));
  body.appendChild(panel("Căn cứ và nguồn chính thức (hiện cuối bài)",[el("p",{class:"hint",text:"Chỉ dẫn văn bản gốc và trang của nhà nước: vanban.chinhphu.vn, congbao.chinhphu.vn, xaydungchinhsach.chinhphu.vn, baochinhphu.vn, gdt.gov.vn, mof.gov.vn, vbpl.vn. Không dẫn sang trang của các hãng phần mềm khác."}),
    listEd(p.sources,function(x){return x.t;},function(x,bx){ bx.appendChild(fld("Tên nguồn",x.t,function(v){x.t=v;},{ph:"vd: Thông tư 152/2025/TT-BTC"})); bx.appendChild(fld("Đường link (không bắt buộc)",x.u,function(v){x.u=v; if(v&&!/^https?:\/\/([a-z0-9-]+\.)*(chinhphu\.vn|gov\.vn|vbpl\.vn|quochoi\.vn)(\/|$)/i.test(v)) toast("Lưu ý: link này không phải trang nhà nước. Nên dẫn văn bản gốc trên vanban.chinhphu.vn hoặc trang của Cục Thuế.",7000);},{ph:"https://…"})); },function(){ return {t:"",u:""}; },{addLabel:"Thêm nguồn"}),
    fld("Ghi chú cuối bài (để trống thì dùng ghi chú chung của chuyên mục)",p.note,function(v){p.note=v;},{area:true,rows:2})]));
  body.appendChild(panel(null,[chk("Đăng bài này (hiện trên web khi bấm Đăng lên GitHub)",p.published,function(v){p.published=v;})]));
  body.appendChild(el("div",{class:"row"},[
    el("button",{class:"b",text:"👁 Xem trước",onclick:function(){ if(!p.slug){ alert("Bài chưa có tiêu đề."); return; } preview(HDB.renderPost(content,p),"bai-viet/"+p.slug+"/"); }}),
    el("button",{class:"b b-pri",text:"✓ Xong, về danh sách",onclick:function(){ if(!p.excerpt) p.excerpt=HDB.txt(p.body).slice(0,150); if(!p.slug) p.slug=HDB.slugify(p.title)||uid("bai"); cur.edit=null; render(); toast("Đã lưu vào bản nháp. Bấm “Đăng lên GitHub” để khách thấy."); }}),
    el("button",{class:"b b-red",text:"Xóa bài",onclick:function(){ if(!confirm("Xóa bài “"+(p.title||"")+"”?"+(p.published?"\n\nBài đã đăng: trang cũ vẫn còn trên GitHub, cần nhờ người gỡ file.":""))) return; content.blog.posts=content.blog.posts.filter(function(x){return x!==p;}); cur.edit=null; changed(); render(); }})]));
}

/* ---------------- Danh sách trang ---------------- */
function pagesPanel(body){
  body.appendChild(head("Các trang","Bấm vào trang để sửa chữ, ảnh, nút, giá."));
  var groups=[["Trang chính",function(p){return !p.parent;}],["Phần mềm",function(p){return p.kind==="product";}],["Dịch vụ",function(p){return p.kind==="service";}]];
  groups.forEach(function(g){
    body.appendChild(el("h3",{text:g[0],style:"margin:16px 0 8px;color:var(--g9)"}));
    content.pages.filter(g[1]).forEach(function(p){
      body.appendChild(el("button",{class:"rowlink",onclick:function(){ cur.edit={type:"page",id:p.id}; render(); }},[
        el("span",{},[el("b",{text:p.navTitle||p.title}),el("small",{text:"huydata.vn/"+(p.path||"")})]),
        el("span",{class:"r",html:p.enabled===false?'<span class="warn">● Đang tắt</span>':'<span class="ok">● Đang bật</span>'})]));
    });
  });
  body.appendChild(el("div",{class:"row",style:"margin-top:12px"},[el("button",{class:"b",text:"＋ Thêm phần mềm",onclick:newProduct}),el("button",{class:"b",text:"＋ Thêm dịch vụ",onclick:newService})]));
}

/* ---------------- Giá & gói: sửa nhanh mọi bảng giá ở một chỗ ---------------- */
function pricesPanel(body){
  body.appendChild(head("Giá & gói","Mọi bảng giá trên web gom về đây. Ghi “Liên hệ” khi chưa muốn công bố giá. Sửa xong bấm Đăng lên GitHub."));
  content.pages.forEach(function(pg){
    var rows=[];
    if(pg.kind==="product"&&pg.card) rows.push({label:"Giá trên thẻ phần mềm",o:pg.card,k:"price"});
    (pg.blocks||[]).forEach(function(b){ if(b.type==="plans") (b.items||[]).forEach(function(it){ rows.push({label:it.name+(b.hidden?" (khối đang ẩn)":""),o:it,k:"price",old:true}); }); });
    if(!rows.length) return;
    var t=el("table",{class:"qp"}); t.appendChild(el("tr",{},[el("th",{text:"Gói"}),el("th",{text:"Giá"}),el("th",{text:"Giá cũ (gạch)"})]));
    rows.forEach(function(r){
      var i1=el("input",{value:r.o[r.k]||""}); i1.addEventListener("input",function(){ r.o[r.k]=i1.value; changed(); });
      var i2=r.old?el("input",{value:r.o.oldPrice||"",placeholder:"—"}):null; if(i2) i2.addEventListener("input",function(){ r.o.oldPrice=i2.value; changed(); });
      t.appendChild(el("tr",{},[el("td",{text:r.label}),el("td",{},[i1]),el("td",{},i2?[i2]:[])]));
    });
    body.appendChild(panel(pg.navTitle||pg.title,[t]));
  });
}

/* ---------------- Khách hàng thật ---------------- */
function storiesPanel(body){
  body.appendChild(head("Khách hàng thật","Chỉ đăng lời kể đã được khách xem lại và đồng ý. Thứ tự ở đây là số thứ tự dùng trong khối “Khách hàng thật”."));
  var s=content.stories;
  body.appendChild(panel(null,[fld("Dòng ghi chú dưới các lời kể",s.note,function(v){s.note=v;},{area:true,rows:2})]));
  body.appendChild(listEd(s.items,function(x,i){return (i+1)+". "+x.name;},function(x,bx){
    bx.appendChild(grid([fld("Tên cơ sở",x.name,function(v){x.name=v;}),fld("Ngành",x.biz,function(v){x.biz=v;}),fld("Nơi",x.place,function(v){x.place=v;})],true));
    bx.appendChild(fld("Lời kể (nguyên văn)",x.quote,function(v){x.quote=v;},{area:true,rows:4}));
    bx.appendChild(linesFld("Nhãn nhỏ",x.tags,function(v){x.tags=v;},{rows:2}));
  },function(){ return {name:"",biz:"",place:"",quote:"",tags:[]}; },{addLabel:"Thêm lời kể"}));
}

/* ---------------- Văn bản (trang HTML có sẵn) ---------------- */
function docsPanel(body){
  var d=content.docs=content.docs||{items:[]};
  body.appendChild(head("Văn bản","Đăng văn bản bằng cách chọn file .html có sẵn. Web giữ nguyên định dạng của file, chỉ thêm nút “Về HuyData”."));
  body.appendChild(panel(null,[grid([fld("Tiêu đề trang Văn bản",d.title,function(v){d.title=v;}),fld("Dòng giới thiệu",d.intro,function(v){d.intro=v;})])]));
  body.appendChild(listEd(d.items,function(x){return x.title+(pendingDocs[x.slug]?" · file mới chờ đăng":"");},function(x,bx){
    bx.appendChild(grid([fld("Tên văn bản",x.title,function(v){x.title=v;}),fld("Đường dẫn",x.slug,function(v){x.slug=HDB.slugify(v);},{sub:"huydata.vn/van-ban/…"})]));
    bx.appendChild(fld("Mô tả ngắn",x.excerpt,function(v){x.excerpt=v;},{area:true,rows:2}));
    bx.appendChild(grid([fld("Ngày",x.date,function(v){x.date=v;},{type:"date"}),chk("Đang hiện",x.published!==false,function(v){x.published=v;})]));
    var fi=el("input",{type:"file",accept:".html,.htm,text/html",hidden:true}), st=el("span",{class:"hint",style:"margin:0",text:pendingDocs[x.slug]?"✓ Đã chọn file, sẽ đăng lần tới":"Chưa chọn file mới (trang đang có trên web giữ nguyên)"});
    fi.onchange=function(){ var f=fi.files[0]; if(!f) return; var r=new FileReader(); r.onload=function(){ pendingDocs[x.slug]=String(r.result); st.textContent="✓ "+f.name+" — sẽ đăng lần tới"; changed(); }; r.readAsText(f,"utf-8"); };
    bx.appendChild(el("div",{class:"row"},[el("button",{class:"b b-sm",text:"📄 Chọn file .html",onclick:function(){ if(!x.slug){ alert("Điền đường dẫn trước."); return; } fi.click(); }}),st,fi]));
  },function(){ return {slug:"",title:"Văn bản mới",excerpt:"",date:today(),published:true}; },{addLabel:"Thêm văn bản"}));
}

/* ---------------- Cài đặt chung ---------------- */
function settingsPanel(body){
  var s=content.settings; s.legal=s.legal||{}; s.payment=s.payment||{}; s.analytics=s.analytics||{};
  body.appendChild(head("Cài đặt chung"));
  body.appendChild(panel("Thương hiệu & liên hệ",[
    grid([fld("Tên thương hiệu",s.brandName,function(v){s.brandName=v;}),fld("Dòng dưới logo",s.tagline,function(v){s.tagline=v;})]),
    grid([fld("Số Zalo (chỉ số)",s.zalo,function(v){s.zalo=v.replace(/\D/g,"");}),fld("Số điện thoại (chỉ số)",s.phone,function(v){s.phone=v.replace(/[^\d+]/g,"");}),fld("Số hiển thị",s.phoneText,function(v){s.phoneText=v;})],true),
    grid([fld("Email",s.email,function(v){s.email=v;}),fld("Fanpage Facebook",s.facebook,function(v){s.facebook=v;})]),
    grid([fld("Địa chỉ",s.address,function(v){s.address=v;}),fld("Giờ làm việc",s.hours,function(v){s.hours=v;})])
  ]));
  body.appendChild(panel("Chân trang & pháp lý",[
    fld("Câu giới thiệu ở chân trang",s.footerNote,function(v){s.footerNote=v;},{area:true,rows:2}),
    grid([fld("Tên đơn vị",s.legal.entity,function(v){s.legal.entity=v;}),fld("Mã số hộ kinh doanh",s.legal.taxCode,function(v){s.legal.taxCode=v;})]),
    grid([fld("Địa chỉ pháp lý",s.legal.address,function(v){s.legal.address=v;}),fld("Người chịu trách nhiệm",s.legal.owner,function(v){s.legal.owner=v;})]),
    fld("Câu kêu gọi cuối mỗi bài viết",s.postCta,function(v){s.postCta=v;},{area:true,rows:2})
  ]));
  body.appendChild(panel("Chuyển khoản (trang Cách mua)",[
    chk("Hiện thông tin chuyển khoản trên web",s.payment.show,function(v){s.payment.show=v;}),
    grid([fld("Ngân hàng",s.payment.bank,function(v){s.payment.bank=v;}),fld("Số tài khoản",s.payment.account,function(v){s.payment.account=v;}),fld("Chủ tài khoản",s.payment.holder,function(v){s.payment.holder=v;})],true),
    fld("Mẫu nội dung chuyển khoản",s.payment.memo,function(v){s.payment.memo=v;},{ph:"vd: HDPRO20 0912xxxxxx"}),
    imageFld("Ảnh mã QR",s.payment,"qr",function(){return "ma-qr-chuyen-khoan";},800),
    fld("Ghi chú",s.payment.note,function(v){s.payment.note=v;},{area:true,rows:2})
  ]));
  body.appendChild(panel("Menu chính",[el("p",{class:"hint",text:"Rê chuột vào mục có danh sách thả xuống sẽ hiện các trang con. Chọn “Tự động” để danh sách tự cập nhật khi anh thêm phần mềm, dịch vụ hay chuyên mục mới."}),
    listEd(s.nav,function(n){return n.label+(n.auto||(n.children&&n.children.length)?" ▾":"");},function(n,bx){
      bx.appendChild(grid([fld("Chữ",n.label,function(v){n.label=v;}),fld("Đi đâu",n.href,function(v){n.href=v;}),
        fld("Danh sách thả xuống",n.auto||"",function(v){ if(v) n.auto=v; else delete n.auto; },{select:[{v:"",t:"(không tự động)"},{v:"products",t:"Tự động: các phần mềm"},{v:"services",t:"Tự động: các dịch vụ"},{v:"knowledge",t:"Tự động: chuyên mục Kiến thức"}]})],true));
      n.children=n.children||[];
      bx.appendChild(el("h3",{text:"Mục thêm tay trong danh sách thả xuống"}));
      bx.appendChild(listEd(n.children,function(x){return x.label;},function(x,b2){ b2.appendChild(grid([fld("Chữ",x.label,function(v){x.label=v;}),fld("Đi đâu",x.href,function(v){x.href=v;}),fld("Dòng mô tả nhỏ",x.desc,function(v){x.desc=v;})],true)); },function(){ return {label:"Mục mới",href:"/",desc:""}; },{addLabel:"Thêm mục con"}));
    },function(){ return {label:"Mục mới",href:"/"}; },{addLabel:"Thêm mục menu"})]));
  body.appendChild(panel("Liên kết ở chân trang",[listEd(s.footerLinks,function(n){return n.label;},function(n,bx){ bx.appendChild(grid([fld("Chữ",n.label,function(v){n.label=v;}),fld("Đi đâu",n.href,function(v){n.href=v;})])); },function(){ return {label:"Liên kết mới",href:"/"}; },{addLabel:"Thêm liên kết"})]));
  body.appendChild(panel("Chia sẻ & đo lường",[
    imageFld("Ảnh chia sẻ mặc định (khi dán link vào Zalo/Facebook, 1200×630)",s,"ogImage",function(){return "anh-chia-se";},1200),
    grid([fld("Mã Google Analytics 4 (G-…)",s.analytics.ga4,function(v){s.analytics.ga4=v.trim().toUpperCase();},{sub:"để trống nếu chưa dùng"}),fld("Mã xác minh Search Console",s.analytics.gsc,function(v){s.analytics.gsc=v.trim();})])
  ]));
  var bl=content.blog; bl.categories=bl.categories||[]; bl.audiences=bl.audiences||[];
  body.appendChild(panel("Chuyên mục Kiến thức",[
    el("p",{class:"hint",text:"Mỗi chuyên mục có trang riêng (huydata.vn/bai-viet/chuyen-muc/…). Chuyên mục chưa có bài thì tự ẩn. Đổi đường dẫn của chuyên mục đã có bài sẽ làm link cũ hỏng, nên hạn chế."}),
    listEd(bl.categories,function(k){return k.name;},function(k,bx){
      bx.appendChild(grid([fld("Tên chuyên mục",k.name,function(v){k.name=v; if(!k.slug) k.slug=HDB.slugify(v);}),fld("Đường dẫn",k.slug,function(v){k.slug=HDB.slugify(v);})]));
      bx.appendChild(fld("Mô tả ngắn",k.desc,function(v){k.desc=v;},{area:true,rows:2}));
      bx.appendChild(chk("Bài trong chuyên mục này tự có ghi chú “mang tính tham khảo”",k.disclaimer,function(v){k.disclaimer=v;}));
    },function(){ return {slug:"",name:"Chuyên mục mới",desc:""}; },{addLabel:"Thêm chuyên mục"}),
    fld("Ghi chú tham khảo dùng chung",bl.disclaimer,function(v){bl.disclaimer=v;},{area:true,rows:2})]));
  body.appendChild(panel("Nhãn “Dành cho”",[listEd(bl.audiences,function(a){return a.name;},function(a,bx){ bx.appendChild(grid([fld("Tên",a.name,function(v){a.name=v; if(!a.slug) a.slug=HDB.slugify(v);}),fld("Mã",a.slug,function(v){a.slug=HDB.slugify(v);})])); },function(){ return {slug:"",name:"Nhóm mới"}; },{addLabel:"Thêm nhãn"})]));
  var p1=el("input",{type:"password",placeholder:"PIN mới"}), p2=el("input",{type:"password",placeholder:"Nhập lại PIN mới"});
  body.appendChild(panel("Đổi mã PIN",[el("div",{class:"f"},[p1]),el("div",{class:"f"},[p2]),el("button",{class:"b",text:"Đổi PIN",onclick:async function(){
    if(p1.value.length<4){ alert("PIN nên từ 4 ký tự trở lên."); return; } if(p1.value!==p2.value){ alert("Hai lần nhập không khớp."); return; }
    s.pinHash=await sha256(p1.value); changed(); p1.value=p2.value=""; toast("Đã đổi PIN — có hiệu lực sau khi Đăng lên GitHub"); }})]));
}

/* ---------------- Xem trước, xuất/nhập ---------------- */
function preview(html,path){
  var base=location.origin+"/"+(path||"");
  var out=String(html).replace(/<head>/i,'<head>\n<base href="'+esc(base)+'">').replace(/<meta name="robots"[^>]*>/i,'<meta name="robots" content="noindex">')
    .replace(/<body>/i,'<body>\n<div style="background:#8A5A00;color:#fff;text-align:center;padding:8px 12px;font:600 14px/1.4 system-ui,sans-serif">BẢN XEM TRƯỚC — chưa đăng. Đóng tab này để quay lại soạn.</div>');
  var w=window.open(URL.createObjectURL(new Blob([out],{type:"text/html"})),"_blank");
  if(!w) toast("Trình duyệt chặn cửa sổ mới — cho phép cửa sổ bật lên rồi bấm lại");
}
function downloadBlob(name,blob){ var u=URL.createObjectURL(blob), a=el("a",{href:u,download:name}); document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(u); a.remove(); },800); }
function exportJSON(){ downloadBlob("HuyData_noi-dung_"+today()+".json",new Blob([JSON.stringify(content,null,1)],{type:"application/json"})); toast("Đã tải file nội dung .json (bản sao lưu)"); }
function importJSON(){
  var i=el("input",{type:"file",accept:".json,application/json"});
  i.onchange=function(){ var f=i.files[0]; if(!f) return; var r=new FileReader(); r.onload=function(){ try{ var c=JSON.parse(r.result); if(!c.settings||!c.pages) throw 0; content=c; changed(); cur.edit=null; render(); toast("Đã nạp nội dung từ file"); }catch(e){ alert("File không đúng định dạng nội dung HuyData v9."); } }; r.readAsText(f); };
  i.click();
}
var CRC=(function(){var t=[],c,n,k;for(n=0;n<256;n++){c=n;for(k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);t[n]=c>>>0;}return t;})();
function crc32(b){var c=0xFFFFFFFF;for(var i=0;i<b.length;i++)c=CRC[(c^b[i])&0xFF]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
function zipMake(files){
  var enc=new TextEncoder(), parts=[], cen=[], off=0;
  function u16(n){return [n&255,(n>>>8)&255];} function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];}
  files.forEach(function(f){ var nm=enc.encode(f.name), d=f.bytes||enc.encode(String(f.data==null?"":f.data)), cr=crc32(d);
    var loc=[].concat(u32(0x04034b50),u16(20),u16(0x0800),u16(0),u16(0),u16(33),u32(cr),u32(d.length),u32(d.length),u16(nm.length),u16(0));
    parts.push(new Uint8Array(loc),nm,d); cen.push({nm:nm,cr:cr,len:d.length,off:off}); off+=loc.length+nm.length+d.length; });
  var cs=off, cd=[];
  cen.forEach(function(c){ var h=[].concat(u32(0x02014b50),u16(20),u16(20),u16(0x0800),u16(0),u16(0),u16(33),u32(c.cr),u32(c.len),u32(c.len),u16(c.nm.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(c.off)); cd.push(new Uint8Array(h),c.nm); off+=h.length+c.nm.length; });
  return new Blob(parts.concat(cd,[new Uint8Array([].concat(u32(0x06054b50),u16(0),u16(0),u16(cen.length),u16(cen.length),u32(off-cs),u32(cs),u16(0)))]),{type:"application/zip"});
}
async function exportZip(){
  toast("Đang gom file…",8000);
  var files=HDB.build(content,{docRaw:function(s){return pendingDocs[s]||"";}});
  var stat=["giao-dien.css","site.js","hd-build.js","favicon.svg","favicon.png","CNAME","quan-tri/index.html","quan-tri/quan-tri.js","quan-tri/quan-tri.css"];
  for(var i=0;i<stat.length;i++){ try{ var r=await fetch("/"+stat[i],{cache:"no-store"}); if(r.ok) files.push({name:stat[i],bytes:new Uint8Array(await r.arrayBuffer())}); }catch(_){} }
  files.push({name:".nojekyll",data:""});
  downloadBlob("huydata-site_"+today()+".zip",zipMake(files)); toast("Đã tải "+files.length+" file (.zip). Ảnh trong thư mục anh/ không kèm trong gói.",6000);
}

/* ---------------- Vẽ giao diện ---------------- */
var TABS=[["posts","Kiến thức"],["pages","Trang"],["prices","Giá & gói"],["stories","Khách hàng thật"],["docs","Văn bản"],["settings","Cài đặt chung"]];
function render(){
  var app=$("#app"); app.innerHTML="";
  var top=el("div",{class:"top"},[
    el("span",{class:"ttl",html:HDB.LOGO+' Quản trị HuyData <span class="dirty" id="dirty" title="Có thay đổi chưa đăng"'+(dirty?'':' hidden')+'></span>'}),
    el("a",{class:"b",href:"/",target:"_blank",rel:"noopener",text:"Xem web"}),
    el("button",{class:"b b-pub",id:"t-pub",text:"⬆ Đăng lên GitHub",onclick:publish}),
    el("button",{class:"b",title:"Cấu hình chìa khóa GitHub",text:"⚙",onclick:function(){ openGitHubModal(); }}),
    el("button",{class:"b",text:"⋯ Khác",onclick:moreMenu})
  ]);
  var side=el("nav",{class:"side","aria-label":"Mục quản trị"});
  TABS.forEach(function(t){ side.appendChild(el("button",{class:cur.tab===t[0]?"on":"",text:t[1],onclick:function(){ cur.tab=t[0]; cur.edit=null; render(); window.scrollTo(0,0); }})); });
  var body=el("div",{class:"body"});
  if(cur.edit&&cur.edit.type==="post"){ var p=content.blog.posts.find(function(x){return x.id===cur.edit.id;}); if(p) postEditor(p,body); else cur.edit=null; }
  else if(cur.edit&&cur.edit.type==="page"){ var pg=content.pages.find(function(x){return x.id===cur.edit.id;}); if(pg) pageEditor(pg,body); else cur.edit=null; }
  if(!cur.edit){
    if(cur.tab==="posts") postsPanel(body); else if(cur.tab==="pages") pagesPanel(body); else if(cur.tab==="prices") pricesPanel(body);
    else if(cur.tab==="stories") storiesPanel(body); else if(cur.tab==="docs") docsPanel(body); else settingsPanel(body);
  }
  app.appendChild(top); app.appendChild(el("div",{class:"main"},[side,body]));
}
function moreMenu(){
  var m=modal();
  m.card.innerHTML='<h3>Việc khác</h3><div class="list">'+
    '<button class="b" id="mm-json">💾 Tải file nội dung (.json) — sao lưu</button>'+
    '<button class="b" id="mm-imp">📂 Nạp nội dung từ file .json</button>'+
    '<button class="b" id="mm-zip">📦 Tải cả bộ web (.zip)</button>'+
    '<button class="b" id="mm-reload">🔄 Bỏ thay đổi, tải lại bản đang có trên web</button>'+
    '<button class="b" id="mm-x">Đóng</button></div>';
  $("#mm-json").onclick=function(){ m.close(); exportJSON(); };
  $("#mm-imp").onclick=function(){ m.close(); importJSON(); };
  $("#mm-zip").onclick=function(){ m.close(); exportZip(); };
  $("#mm-reload").onclick=async function(){ if(!confirm("Bỏ hết thay đổi chưa đăng?")) return; m.close(); try{ localStorage.removeItem(DRAFT_KEY); }catch(_){} await loadContent(true); dirty=false; cur.edit=null; render(); toast("Đã tải lại bản đang có trên web"); };
  $("#mm-x").onclick=m.close;
}

/* ---------------- Khởi động ---------------- */
async function loadContent(skipDraft){
  var c=null, tok=ghToken(), cfg=ghCfg();
  if(tok){ try{ c=JSON.parse(await ghApi(cfg,tok,"GET","/contents/noi-dung.json?ref="+encodeURIComponent(cfg.branch),null,true)); }catch(e){ c=null; } }
  if(!c){ var r=await fetch("/noi-dung.json?t="+Date.now(),{cache:"no-store"}); if(!r.ok) throw new Error("Không đọc được noi-dung.json"); c=await r.json(); }
  content=c; loadedUpdated=c.updated||"";
  if(skipDraft) return;
  try{
    var d=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");
    if(d&&d.c&&JSON.stringify(d.c)!==JSON.stringify(c)){
      var older=d.base&&loadedUpdated&&d.base<loadedUpdated;
      if(confirm("Có bản nháp chưa đăng lúc "+new Date(d.t).toLocaleString("vi-VN")+"."+(older?"\n\n⚠ Bản nháp này soạn trên bản cũ hơn bản đang có trên web.":"")+"\n\nMở lại bản nháp? (Bấm Hủy để dùng bản đang có trên web)")){ content=d.c; dirty=true; }
    }
  }catch(_){}
}
(function boot(){
  $("#pin-logo").innerHTML=HDB.LOGO;
  var loading=loadContent().catch(function(e){ $("#pin-err").textContent=e.message; });
  $("#pin-input").focus();
  $("#pin-form").addEventListener("submit",async function(e){
    e.preventDefault(); await loading; if(!content) return;
    var h=await sha256($("#pin-input").value);
    if(h===content.settings.pinHash){ $("#pin").hidden=true; $("#app").hidden=false; render(); }
    else { $("#pin-err").textContent="Mã PIN chưa đúng. Thử lại nhé."; $("#pin-input").select(); }
  });
  window.addEventListener("beforeunload",function(e){ if(dirty){ e.preventDefault(); e.returnValue=""; } });
})();
