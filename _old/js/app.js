"use strict";
var SHELL = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;

var DEFAULT = {
  settings:{
    brandName:"HuyData", sub:"Giải pháp dữ liệu",
    slogan:"Giải pháp thông minh · Vận hành tinh gọn",
    zalo:"0917324328", zaloText:"0917 324 328", phone:"+84917324328", phoneText:"0917 324 328",
    email:"huydatavlo@gmail.com", location:"Bến Tre · ĐBSCL",
    ecoNote:"Một nhánh trong hệ thương hiệu của người sáng lập — cùng gốc với Khai Tâm: khai mở năng lực người đi làm, ươm mầm tư duy cho trẻ nhỏ.",
    copyright:"© 2026 HuyData · Trần Huy. Đã đăng ký bản quyền.",
    pinHash:"0166cfa348629cfc4941e91fad01a1499f430101e10f550c0bb6c1fe8e5ea534",
    seo:{ title:"", description:"", ogImage:"" },
    // Nguồn dữ liệu backend (Phase 3.8). Để enabled:false thì site chạy tĩnh như thường.
    // anonKey của Supabase là khóa công khai dùng cho trình duyệt — BẮT BUỘC bật RLS ở Supabase.
    backend:{ enabled:false, provider:"supabase", url:"", anonKey:"" },
    authors:{ "tran-huy":{ name:"Trần Huy", role:"Tư vấn Dữ liệu & AI · Người sáng lập" } },
    sections:[
      {key:"boi-canh",on:true,nav:false},
      {key:"vi-sao",on:true,nav:false},
      {key:"giai-phap",on:true,nav:true},
      {key:"bang-gia",on:true,nav:true},
      {key:"quyet-dinh",on:true,nav:false},
      {key:"khach-hang",on:true,nav:true},
      {key:"rieng-tu",on:true,nav:true},
      {key:"faq",on:true,nav:true},
      {key:"bai-viet",on:true,nav:true},
      {key:"ve-huydata",on:true,nav:true}
    ]
  },
  hero:{
    eyebrow:"HuyData · Giải pháp dữ liệu miền Tây",
    title:"Hết thuế khoán<br>không đáng sợ — nếu có <span class=\"em\">công cụ đúng</span>.",
    sub:"Phần mềm kế toán, hóa đơn và kho hàng chạy ngay trên máy của anh chị. Trả một lần, dữ liệu ở lại máy mình — làm bởi người đã 20 năm trong nghề thuế – thống kê.",
    ctaText:"Nhắn Zalo nhận tư vấn", ctaText2:"Xem giải pháp", ctaLink2:"#giai-phap",
    trust:["Chạy offline","Trả một lần","Đúng thông tư","Dữ liệu là của anh chị"]
  },
  pain:{
    eyebrow:"Bối cảnh", title:"Chuyển sang kê khai, giờ phải làm gì?",
    intro:"Nhiều hộ kinh doanh đang được chuyển từ thuế khoán sang kê khai. Việc chưa từng làm, mà làm sai thì lo bị phạt.",
    items:[
      {title:"Phải ghi sổ, giữ hóa đơn điện tử, nộp tờ khai",desc:"Những thứ trước giờ chưa từng phải làm, giờ thành bắt buộc."},
      {title:"Sợ bị phạt, bị \"mời lên làm việc\"",desc:"Làm sai mà không biết mình sai ở đâu — nỗi lo lớn nhất."},
      {title:"Ngại phần mềm phức tạp, ngại thuê bao",desc:"Đăng ký tài khoản, học giao diện rối, rồi tháng nào cũng đóng phí."},
      {title:"Sợ số liệu doanh thu lộ ra ngoài",desc:"Đẩy hết sổ sách lên mây của người lạ — không yên tâm chút nào."}
    ],
    answerTitle:"Anh chị lo bán hàng.<br>Việc đúng luật, để công cụ lo.",
    answerBody:"HuyData gói những việc rắc rối đó vào phần mềm chạy sẵn trên máy anh chị: nhập liệu gọn, lên sổ và tờ khai đúng mẫu, xuất được file nộp qua HTKK. Kẹt đâu, nhắn Zalo có người quen chỉ việc.",
    answerSig:"— Không tổng đài vòng vo. Người làm ra phần mềm trực tiếp hỗ trợ."
  },
  why:{
    eyebrow:"Vì sao chọn HuyData", title:"Ngược dòng với phần mềm thuê bao đám mây",
    intro:"Bốn điều làm nên khác biệt — cũng chính là bốn lời hứa chúng tôi giữ với anh chị.",
    cards:[
      {icon:"once",title:"Trả một lần, không thuê bao",desc:"Mua đứt, xài mãi. Không phí chồng phí mỗi năm, không mất dữ liệu khi anh chị ngừng trả tiền."},
      {icon:"offline",title:"Chạy offline, dữ liệu ở lại máy",desc:"Không đẩy số liệu doanh thu lên mây của ai. Mọi thứ nằm trong máy anh chị — đúng nghĩa dữ liệu là của mình."},
      {icon:"law",title:"Đúng thông tư, cập nhật nhanh",desc:"Bám sát TT133 và quy định hóa đơn điện tử. Tác giả sống trong pháp quy nên cập nhật kịp mỗi khi luật đổi."},
      {icon:"chat",title:"Người thật đồng hành",desc:"Kẹt đâu nhắn Zalo. Người làm ra phần mềm trực tiếp trả lời, không tổng đài, không chờ đợi."}
    ]
  },
  solutions:{
    enabled:true, eyebrow:"Giải pháp", title:"Không chỉ là phần mềm — mà là giải pháp",
    intro:"HuyData tiếp cận theo bài toán của từng nhóm. Phần mềm chỉ là một công cụ bên trong giải pháp; đi kèm là quy trình, biểu mẫu đúng chuẩn và người đồng hành.",
    groups:[
      { id:"nha-nuoc", kicker:"Khu vực công", name:"Cho cơ quan nhà nước", badge:"",
        tagline:"Công cụ và biểu mẫu đúng thông tư cho các đơn vị hành chính, thống kê.",
        items:[
          {name:"Quyết toán Thù lao Điều tra viên", badge:"live", badgeText:"Đang cung cấp", desc:"Quản lý và quyết toán thù lao điều tra viên thống kê theo TT37/2022 và TT185/2010. Nhập danh sách từ Excel, tự sinh biểu mẫu và quyết toán.", foot:"Dành cho đơn vị thống kê", url:"", linkText:"Tìm hiểu"}
        ]},
      { id:"doanh-nghiep", kicker:"Doanh nghiệp & hộ kinh doanh", name:"Cho doanh nghiệp", badge:"",
        tagline:"Bộ giải pháp vận hành: kế toán, kho hàng, hóa đơn — gọn, offline, license theo máy.",
        items:[
          {name:"Kế Toán Pro", badge:"live", badgeText:"Đang cung cấp", desc:"Kế toán hộ và siêu nhỏ theo TT133: sổ sách, phiếu thu–chi, báo cáo tài chính, xuất tờ khai chuẩn HTKK. Nhiều công ty, nhiều năm tài chính.", foot:"License theo máy · Trả một lần", url:"", linkText:"Tìm hiểu"},
          {name:"KhoPro", badge:"soon", badgeText:"Sắp ra mắt", desc:"Quản lý kho và bán hàng, kèm Trợ lý Quyết định: hàng nào lãi, hàng nào tồn lâu, nên thanh lý gì và giảm bao nhiêu để hòa vốn.", foot:"Số liệu → hành động", url:"", linkText:""},
          {name:"hddt-lite", badge:"dev", badgeText:"Đang phát triển", desc:"Tải và quản lý hóa đơn điện tử nhẹ nhàng, cho kế toán dịch vụ ôm nhiều công ty. Bỏ khâu tải từng tờ thủ công.", foot:"Xử lý hóa đơn", url:"", linkText:""},
          {name:"Nhắc Việc Pro", badge:"dev", badgeText:"Đang phát triển", desc:"Nhắc hạn kê khai, hạn nộp thuế theo tháng và quý. Không bỏ lỡ mốc quan trọng.", foot:"Không lỡ mốc quan trọng", url:"", linkText:""}
        ]},
      { id:"dich-vu-thue", kicker:"Dịch vụ", name:"Dịch vụ khai báo thuế", badge:"Đang thực hiện",
        tagline:"Không chỉ đưa công cụ — chúng tôi nhận làm cùng: kê khai, quyết toán và đồng hành theo kỳ.",
        items:[
          {name:"Khai báo & quyết toán thuế", badge:"soon", badgeText:"Đang triển khai", desc:"Dịch vụ trọn gói cho hộ và doanh nghiệp nhỏ: chuẩn hóa số liệu bằng công cụ HuyData, lập và nộp tờ khai, đồng hành theo kỳ.", foot:"Đang nhận đăng ký sớm", url:"", linkText:"Đăng ký quan tâm"}
        ]}
    ]
  },
  products:{
    eyebrow:"Hệ sinh thái", title:"Bộ công cụ cho công việc thật",
    intro:"Mỗi phần mềm giải một nỗi đau cụ thể, dùng chung một nền tảng — nhẹ, offline, license theo máy.",
    items:[
      {name:"Kế Toán Pro",badge:"live",badgeText:"Đang cung cấp",desc:"Kế toán hộ và siêu nhỏ theo Thông tư 133. Nhật ký chung, sổ cái, phiếu thu – chi, báo cáo tài chính B01a/B02, xuất tờ khai chuẩn HTKK. Quản lý nhiều công ty, nhiều năm tài chính.",foot:"License theo máy · Trả một lần",url:"",linkText:"Tìm hiểu"},
      {name:"Quyết toán Thù lao Điều tra viên",badge:"live",badgeText:"Đang cung cấp",desc:"Quản lý và quyết toán thù lao điều tra viên thống kê cho các đơn vị, theo Thông tư 37/2022/TT-BTC và 185/2010/TT-BTC. Nhập danh sách từ Excel, tự sinh biểu mẫu và quyết toán.",foot:"Dành cho đơn vị thống kê",url:"",linkText:"Tìm hiểu"},
      {name:"KhoPro",badge:"soon",badgeText:"Sắp ra mắt",desc:"Quản lý kho và bán hàng, kèm lớp Trợ lý Quyết định: mặt hàng nào lãi, mặt hàng nào tồn lâu, nên thanh lý gì và giảm bao nhiêu để hòa vốn.",foot:"Số liệu → hành động",url:"",linkText:""},
      {name:"hddt-lite",badge:"dev",badgeText:"Đang phát triển",desc:"Tải và quản lý hóa đơn điện tử nhẹ nhàng, dành cho kế toán dịch vụ ôm nhiều công ty. Bỏ khâu tải từng tờ thủ công.",foot:"Cho kế toán dịch vụ",url:"",linkText:""},
      {name:"Nhắc Việc Pro",badge:"dev",badgeText:"Đang phát triển",desc:"Nhắc hạn kê khai, hạn nộp thuế, các mốc phải làm theo tháng và quý. Không bỏ lỡ ngày quan trọng.",foot:"Không lỡ mốc quan trọng",url:"",linkText:""},
      {name:"HuyData Core",badge:"core",badgeText:"Nền tảng",desc:"Thư viện dùng chung của cả hệ sinh thái: nhận diện thương hiệu, tiện ích, engine dựng biểu mẫu, chuyển HTML → Excel và quản lý bản quyền.",foot:"Bản quyền ký số ECDSA",url:"",linkText:""}
    ]
  },
  decision:{
    eyebrow:"Tầm nhìn", title:"Không dừng ở phần mềm.<br>Chúng tôi giúp anh chị ra quyết định.",
    intro:"Phần mềm chỉ là điểm khởi đầu. Cái đáng giá là con đường từ số liệu rời rạc đến một quyết định anh chị dám làm theo.",
    rungs:[
      {k:"Tầng 1",title:"Phần mềm",desc:"Công cụ chạy trên máy, chuẩn hóa số liệu về một cấu trúc sạch — rẻ và phổ cập."},
      {k:"Tầng 2",title:"Dữ liệu",desc:"Số liệu sạch giúp so được với các hộ cùng ngành trong vùng — thứ mỗi năm một dày thêm."},
      {k:"Tầng 3",title:"Quyết định",desc:"Báo cáo sức khỏe kinh doanh: bán gì đang nuôi cửa hàng, cắt gì đang ăn vốn, quý tới làm gì."},
      {k:"Tầng 4",title:"Niềm tin",desc:"Có người đứng tên, chịu trách nhiệm cùng anh chị — điều không phần mềm nào thay được."}
    ],
    note:"Chia sẻ dữ liệu để nhận chuẩn đối sánh là hoàn toàn tự nguyện và mặc định luôn tắt. Không gửi, phần mềm vẫn chạy đủ. Số liệu điều tra – thống kê công vụ tuyệt đối không bao giờ đi vào hệ thống này."
  },
  who:{
    eyebrow:"Dành cho ai", title:"Ba người, ba nỗi lo — một lời giải",
    cards:[
      {tag:"Số đông",title:"Chủ hộ kinh doanh",desc:"Anh chị bán buôn quen tay, giờ bị chuyển sang kê khai. Cần công cụ đơn giản và một người quen chỉ việc khi kẹt — trả một lần cho yên tâm."},
      {tag:"Ưu tiên",title:"Kế toán dịch vụ",desc:"Ôm vài chục khách, nghẽn ở nhập liệu và lên tờ khai. Bộ công cụ giúp anh chị nhận thêm khách mà không tăng thêm giờ làm — ROI thấy được ngay."},
      {tag:"Chuyên ngành",title:"Đơn vị thống kê",desc:"Cần quản lý và quyết toán thù lao điều tra viên đúng thông tư, gọn trong một phần mềm — thay cho hàng chục file Excel rời rạc."}
    ]
  },
  privacy:{
    eyebrow:"Cam kết riêng tư & bảo mật", title:"Dữ liệu là của anh chị. Chấm hết.",
    intro:"Với chúng tôi, riêng tư không phải tính năng để quảng cáo — nó là nguyên tắc gốc. Đây là những gì được viết thành cam kết.",
    items:[
      {icon:"db",title:"Chạy offline, không lên mây",desc:"Số liệu nằm trong máy anh chị và không rời đi. Không tài khoản đám mây, không nguy cơ rò rỉ khi bên thứ ba bị tấn công."},
      {icon:"notrack",title:"Không cookie, không theo dõi",desc:"Trang web này không cài mã theo dõi, không phân tích hành vi, không quảng cáo. Anh chị đọc mà không bị ai ghi lại."},
      {icon:"lock",title:"License theo máy, ký số ECDSA",desc:"Bản quyền gắn với từng máy, ký số theo chuẩn ECDSA P-256 — chống sao chép mà vẫn minh bạch, không cần \"gọi về\" máy chủ nào."},
      {icon:"optin",title:"Chia sẻ là tự nguyện",desc:"Muốn nhận báo cáo chuẩn đối sánh ngành thì mới gửi dữ liệu đã ẩn danh. Mặc định luôn tắt, và anh chị rút lại bất cứ lúc nào."}
    ],
    firewallTitle:"Lằn ranh đạo đức tuyệt đối.",
    firewallBody:"Số liệu điều tra và báo cáo thống kê tiếp cận trong vai trò công vụ không bao giờ — dưới bất kỳ hình thức nào — chạm vào hệ thống HuyData. Chuẩn đối sánh của chúng tôi chỉ đến từ khách hàng tự nguyện đóng góp."
  },
  about:{
    eyebrow:"Về HuyData",
    quote:"Tôi làm công cụ cho chính công việc của mình suốt hai mươi năm. Giờ mở ra cho bà con.",
    body:"HuyData không sinh ra từ một phòng họp khởi nghiệp. Nó lớn lên từ công việc thật trong ngành thuế – thống kê ở miền Tây: những buổi ngồi gỡ rối sổ sách, những mùa quyết toán, những lần bà con hỏi \"giờ tôi phải làm sao\". Mỗi phần mềm ở đây là một câu trả lời đã được dùng thật trước khi bán cho ai.",
    name:"Trần Huy", role:"Tư vấn Dữ liệu & AI · Người sáng lập"
  },
  contact:{ eyebrow:"Liên hệ", title:"Nói chuyện với người làm ra phần mềm",
    sub:"Nhắn một câu về việc anh chị đang gặp. Không kịch bản bán hàng, không ràng buộc — chỉ là hỏi cho rõ." },
  blog:{ enabled:true, eyebrow:"Thư viện Tri thức", title:"Thư viện Tri thức",
    intro:"Kiến thức về dữ liệu, thuế – kế toán, AI và quản trị — viết bằng ngôn ngữ đời thường, để anh chị đọc là làm được.",
    posts:[
      {id:"p1", slug:"7-viec-khi-chuyen-sang-ke-khai", category:"thue-ke-toan", tags:["thue-khoan","ke-khai"], featured:true, author:"tran-huy", date:"2026-01-15", updatedAt:"2026-02-10", cover:"", published:true, level:"foundation", pillar:true,
       ai:{summary:"Danh sách 7 việc ưu tiên khi hộ kinh doanh chuyển từ thuế khoán sang kê khai: chuẩn bị hồ sơ, lập sổ sách, giữ hóa đơn điện tử và lên lịch nộp tờ khai.", keywords:["kê khai","thuế khoán","hộ kinh doanh","hóa đơn điện tử"], entities:["hoa-don-dien-tu","ke-toan-pro"], difficulty:"beginner"},
       faqs:[{q:"Hộ kinh doanh có bắt buộc chuyển sang kê khai không?",a:"Tùy diện và ngưỡng doanh thu theo quy định; khi được chuyển thì cần lập sổ sách và nộp tờ khai thay cho thuế khoán."},{q:"Có cần phần mềm để kê khai không?",a:"Không bắt buộc, nhưng một công cụ chạy trên máy giúp lên sổ và xuất tờ khai nhanh, ít sai sót."}],
       title:"7 việc phải làm khi chuyển sang kê khai",
       excerpt:"Danh sách ngắn gọn những việc một hộ kinh doanh cần làm ngay khi không còn thuế khoán, xếp theo thứ tự ưu tiên.",
       body:"<p>Khi hộ kinh doanh chuyển từ thuế khoán sang kê khai, có vài việc nên làm ngay để tránh bị phạt và đỡ rối về sau.</p><h2>Chuẩn bị hồ sơ ban đầu</h2><p>Rà lại đăng ký kinh doanh, mã số thuế và phương pháp tính thuế đang áp dụng. Ghi lại ngày bắt đầu kê khai để tính kỳ cho đúng.</p><h2>Thiết lập sổ sách</h2><p>Mở sổ theo dõi doanh thu, chi phí và hóa đơn. Ưu tiên một công cụ chạy trên máy để số liệu không thất lạc.</p><h3>Giữ hóa đơn điện tử</h3><p>Tải và lưu hóa đơn đầu vào – đầu ra theo tháng, đặt tên file rõ ràng.</p><h2>Lên lịch nộp tờ khai</h2><p>Đánh dấu hạn kê khai theo tháng và quý. Nộp sớm vài ngày để còn thời gian sửa nếu sai.</p>"},
      {id:"p2", slug:"du-lieu-sach-la-gi", category:"data-foundation", tags:["du-lieu-sach","nhap-mon"], featured:true, author:"tran-huy", date:"2026-01-20", updatedAt:"", cover:"", published:true, level:"foundation", pillar:true,
       ai:{summary:"Dữ liệu sạch là dữ liệu đúng, đủ, nhất quán và đúng định dạng — nền tảng để báo cáo, dashboard và AI cho kết quả đáng tin.", keywords:["dữ liệu sạch","chất lượng dữ liệu","nhập môn dữ liệu"], entities:["du-lieu-sach","data-platform"], difficulty:"beginner"},
       faqs:[{q:"Làm sao biết dữ liệu có sạch hay không?",a:"Kiểm tra trùng lặp, ô trống, sự nhất quán về đơn vị và định dạng ngày tháng."},{q:"Dữ liệu sạch có liên quan gì đến AI?",a:"AI chỉ tốt bằng dữ liệu đầu vào; dữ liệu bẩn khiến kết quả sai dù mô hình mạnh."}],
       title:"Dữ liệu sạch là gì và vì sao quan trọng",
       excerpt:"Dữ liệu sạch là nền của mọi báo cáo đáng tin. Hiểu đúng khái niệm này giúp anh chị ra quyết định không bị sai từ gốc.",
       body:"<p>Mọi con số anh chị nhìn để ra quyết định đều bắt đầu từ dữ liệu. Nếu dữ liệu bẩn, quyết định sẽ sai — dù công cụ có hiện đại đến đâu.</p><h2>Định nghĩa</h2><p>Dữ liệu sạch là dữ liệu đúng, đủ, nhất quán và đúng định dạng: không trùng, không thiếu, không lẫn đơn vị.</p><h2>Vì sao quan trọng</h2><p>Báo cáo, dashboard và cả AI đều chỉ tốt bằng dữ liệu đầu vào. Sạch từ gốc thì về sau đỡ phải sửa.</p><h3>Ví dụ thường gặp</h3><ul><li>Cùng một khách hàng nhập hai kiểu tên khác nhau.</li><li>Số tiền lúc ghi nghìn, lúc ghi đồng.</li><li>Ngày tháng mỗi nơi một định dạng.</li></ul>"},
      {id:"p3", slug:"5-loi-nhap-lieu-pho-bien", category:"data-foundation", tags:["du-lieu-sach"], featured:false, author:"tran-huy", date:"2026-01-28", updatedAt:"", cover:"", published:true, level:"intermediate",
       ai:{summary:"Năm lỗi nhập liệu phổ biến — nhập trùng, sai đơn vị, bỏ trống — và cách phòng tránh để báo cáo không lệch.", keywords:["nhập liệu","lỗi dữ liệu","chất lượng dữ liệu"], entities:["du-lieu-sach"], difficulty:"beginner"},
       title:"5 lỗi nhập liệu khiến báo cáo sai",
       excerpt:"Những lỗi nhỏ khi nhập liệu tích lại thành báo cáo lệch. Đây là năm lỗi hay gặp nhất và cách tránh.",
       body:"<p>Phần lớn báo cáo sai không phải do công thức, mà do khâu nhập liệu.</p><h2>Năm lỗi phổ biến</h2><h3>Nhập trùng</h3><p>Một giao dịch ghi hai lần làm doanh thu phồng lên.</p><h3>Sai đơn vị</h3><p>Lẫn nghìn với đồng khiến số liệu lệch cả nghìn lần.</p><h3>Bỏ trống</h3><p>Ô để trống làm tổng cộng thiếu.</p><h2>Cách tránh</h2><p>Dùng biểu mẫu cố định, kiểm tra tổng cuối ngày, và để công cụ tự nhắc khi thiếu.</p>"},
      {id:"p4", slug:"tu-so-lieu-ban-hang-den-quyet-dinh-nhap-hang", category:"data-to-decision", tags:["dashboard","ton-kho"], featured:false, author:"tran-huy", date:"2026-02-05", updatedAt:"", cover:"", published:true, level:"foundation", pillar:true,
       ai:{summary:"Cách đọc số liệu bán hàng theo vòng quay và biên lãi để quyết định nhập thêm hay thanh lý hàng.", keywords:["quyết định nhập hàng","vòng quay hàng","tồn kho","dashboard"], entities:["dashboard","decision-support"], difficulty:"intermediate"},
       faqs:[{q:"Nên nhập thêm mặt hàng nào?",a:"Ưu tiên hàng bán nhanh và lãi tốt; hạn chế hàng tồn lâu chiếm vốn."}],
       title:"Từ số liệu bán hàng đến quyết định nhập hàng",
       excerpt:"Số liệu bán hàng không chỉ để xem cho biết. Đây là cách đọc chúng để quyết định nhập gì, bỏ gì.",
       body:"<p>Bán hàng xong, con số ở lại. Biết đọc, chúng sẽ nói cho anh chị nên nhập gì kỳ tới.</p><h2>Nhìn theo vòng quay</h2><p>Mặt hàng bán nhanh, lãi tốt thì tăng nhập. Hàng tồn lâu, chiếm vốn thì cân nhắc giảm giá thanh lý.</p><h2>Ba câu hỏi trước khi nhập</h2><ul><li>Hàng này tháng qua bán được bao nhiêu?</li><li>Lãi trên mỗi đơn có đủ bù chi phí giữ hàng?</li><li>Nếu không bán hết trong 60 ngày thì sao?</li></ul>"},
      {id:"p5", slug:"hieu-thong-tu-133-trong-10-phut", category:"thue-ke-toan", tags:["tt133","ke-khai"], featured:false, author:"tran-huy", date:"2026-02-12", updatedAt:"", cover:"", published:true, level:"intermediate",
       ai:{summary:"Tóm tắt Thông tư 133: áp dụng cho ai, những sổ và báo cáo tài chính rút gọn cần có.", keywords:["Thông tư 133","kế toán doanh nghiệp nhỏ","báo cáo tài chính"], entities:["ke-toan-pro","hoa-don-dien-tu"], difficulty:"intermediate"},
       title:"Hiểu Thông tư 133 trong 10 phút",
       excerpt:"Thông tư 133 nghe phức tạp nhưng với hộ và doanh nghiệp nhỏ, phần cốt lõi khá gọn. Tóm tắt những điểm cần nhớ.",
       body:"<p>Thông tư 133 hướng dẫn chế độ kế toán cho doanh nghiệp nhỏ và vừa. Dưới đây là phần cốt lõi.</p><h2>Áp dụng cho ai</h2><p>Doanh nghiệp nhỏ và vừa, gồm cả siêu nhỏ, trừ một số ngành đặc thù.</p><h2>Những sổ và báo cáo chính</h2><p>Sổ nhật ký chung, sổ cái, và bộ báo cáo tài chính rút gọn (B01a/B02).</p><h3>Mẹo thực hành</h3><p>Dùng công cụ tự lên sổ và xuất tờ khai chuẩn để đỡ làm tay.</p>"},
      {id:"p6", slug:"chatgpt-cho-ke-toan-dich-vu", category:"ai-cho-doanh-nghiep", tags:["chatgpt"], featured:true, author:"tran-huy", date:"2026-02-18", updatedAt:"", cover:"", published:true, level:"foundation", pillar:true,
       ai:{summary:"Những việc AI như ChatGPT làm tốt cho kế toán dịch vụ và những việc nên giữ cho con người quyết định.", keywords:["ChatGPT","AI cho kế toán","tự động hóa"], entities:["decision-support"], difficulty:"beginner"},
       title:"ChatGPT giúp gì cho kế toán dịch vụ",
       excerpt:"AI không thay kế toán, nhưng làm giúp phần lặp đi lặp lại. Vài cách dùng thực tế cho người ôm nhiều khách.",
       body:"<p>Với kế toán dịch vụ ôm vài chục khách, thời gian là tiền. AI làm giúp phần việc lặp lại để anh chị tập trung vào việc cần đầu óc.</p><h2>Việc AI làm tốt</h2><ul><li>Soạn email nhắc khách nộp chứng từ.</li><li>Tóm tắt quy định mới thành ngôn ngữ dễ hiểu.</li><li>Kiểm tra nhanh một đoạn số liệu bất thường.</li></ul><h2>Việc nên tự làm</h2><p>Quyết định nghiệp vụ và chịu trách nhiệm pháp lý vẫn là của con người.</p>"},
      {id:"p7", slug:"dashboard-giam-ton-kho", category:"case-study", tags:["dashboard","ton-kho"], featured:false, author:"tran-huy", date:"2026-02-22", updatedAt:"", cover:"", published:true, level:"foundation", pillar:true,
       ai:{summary:"Case study: cửa hàng tạp hóa dùng dashboard xếp hạng hàng theo vòng quay và lãi, giảm khoảng 30% tồn kho sau ba tháng.", keywords:["case study","dashboard","giảm tồn kho","quyết định"], entities:["dashboard","khopro","decision-support"], difficulty:"intermediate"},
       title:"Dashboard giúp cửa hàng giảm 30% tồn kho",
       excerpt:"Một cửa hàng tạp hóa dùng dashboard đơn giản để thấy hàng nào ăn vốn — và giảm tồn kho gần một phần ba sau ba tháng.",
       body:"<p>Đây là câu chuyện thật (đã ẩn danh) về một cửa hàng tạp hóa ở miền Tây.</p><h2>Vấn đề</h2><p>Vốn kẹt trong hàng tồn, chủ không biết mặt hàng nào đang ăn vốn.</p><h2>Cách làm</h2><p>Chuẩn hóa số liệu bán hàng, dựng một dashboard xếp hạng hàng theo vòng quay và lãi.</p><h2>Kết quả</h2><p>Sau ba tháng, tồn kho giảm khoảng 30%, tiền mặt xoay vòng tốt hơn.</p>"},
      {id:"p8", slug:"3-chi-so-suc-khoe-kinh-doanh", category:"quan-tri-doanh-nghiep", tags:["chi-so"], featured:false, author:"tran-huy", date:"2026-02-26", updatedAt:"", cover:"", published:true, level:"foundation", pillar:true,
       ai:{summary:"Ba chỉ số cốt lõi để theo dõi sức khỏe kinh doanh: dòng tiền, vòng quay hàng và biên lãi.", keywords:["chỉ số kinh doanh","dòng tiền","biên lãi","vòng quay hàng"], entities:["decision-support","dashboard"], difficulty:"beginner"},
       title:"3 chỉ số sức khỏe mọi hộ kinh doanh nên theo dõi",
       excerpt:"Không cần báo cáo phức tạp. Ba chỉ số này đủ để biết cửa hàng đang khỏe hay đang đuối.",
       body:"<p>Quản trị không cần nhiều số. Ba chỉ số dưới đây đủ để nắm sức khỏe kinh doanh.</p><h2>Dòng tiền</h2><p>Tiền vào trừ tiền ra mỗi tháng. Âm kéo dài là dấu hiệu cần xử lý ngay.</p><h2>Vòng quay hàng</h2><p>Hàng nằm kho bao lâu mới bán được. Càng lâu càng kẹt vốn.</p><h2>Biên lãi</h2><p>Lãi còn lại trên mỗi đồng doanh thu sau khi trừ chi phí.</p>"},
      {id:"p9", slug:"bat-dau-voi-huydata-5-buoc", category:"hoc-cung-huydata", tags:["nhap-mon"], featured:false, author:"tran-huy", date:"2026-03-01", updatedAt:"", cover:"", published:true, level:"foundation", pillar:true,
       ai:{summary:"Hướng dẫn 5 bước bắt đầu với HuyData: tải và cài, khai báo cơ sở, nhập giao dịch mẫu, xem báo cáo, nhắn Zalo khi kẹt.", keywords:["bắt đầu","hướng dẫn","HuyData"], entities:["huydata"], difficulty:"beginner"},
       title:"Bắt đầu với HuyData: hướng dẫn 5 bước",
       excerpt:"Chưa quen công cụ? Năm bước dưới đây giúp anh chị chạy được ngay từ hôm nay.",
       body:"<p>Bài này dành cho anh chị mới bắt đầu. Làm theo năm bước là chạy được.</p><h2>Năm bước</h2><h3>Tải và cài</h3><p>Tải bản dùng thử, cài trên máy của mình.</p><h3>Nhập thông tin cơ sở</h3><p>Khai báo cửa hàng và kỳ kế toán.</p><h3>Nhập vài giao dịch mẫu</h3><p>Làm quen thao tác.</p><h3>Xem báo cáo</h3><p>Kiểm tra số liệu lên đúng.</p><h3>Nhắn Zalo khi kẹt</h3><p>Có người chỉ tận nơi.</p>"}
    ]
  },
  pricing:{
    enabled:true, eyebrow:"Bảng giá & Bản quyền", title:"Trả một lần, license theo máy",
    intro:"Không thuê bao, không phí hằng tháng. Mua đứt dùng mãi; bản quyền gắn với từng máy, minh bạch bằng ký số.",
    note:"Giá mang tính tham khảo. Nhắn Zalo để nhận báo giá đúng theo số máy và nhu cầu thực tế của anh chị.",
    tiers:[
      {name:"Dùng thử", price:"Miễn phí", period:"30 ngày, không ràng buộc", desc:"Trải nghiệm đầy đủ trước khi quyết định.",
       features:["Đầy đủ tính năng chính","Không cần thẻ, không tài khoản","Dữ liệu giữ nguyên khi mua bản quyền"], cta:"Nhận bản dùng thử", ctaLink:"", highlight:false, badge:""},
      {name:"Bản quyền 1 máy", price:"Liên hệ", period:"/ máy · trả một lần", desc:"Phù hợp hộ kinh doanh và cá nhân làm dịch vụ.",
       features:["License ký số ECDSA theo máy","Cập nhật theo thông tư trong kỳ","Hỗ trợ trực tiếp qua Zalo"], cta:"Nhận báo giá", ctaLink:"", highlight:true, badge:"Phổ biến"},
      {name:"Gói đơn vị / nhiều máy", price:"Ưu đãi", period:"theo số lượng máy", desc:"Cho phòng kế toán dịch vụ và đơn vị nhiều máy.",
       features:["Chiết khấu theo số máy","Ưu tiên hỗ trợ và cập nhật","Tùy chỉnh biểu mẫu theo đơn vị"], cta:"Trao đổi nhu cầu", ctaLink:"", highlight:false, badge:""}
    ]
  },
  faq:{
    enabled:true, eyebrow:"Hỏi đáp", title:"Câu hỏi thường gặp",
    intro:"Những điều anh chị hay hỏi trước khi bắt đầu.",
    items:[
      {q:"Không rành máy tính có dùng được không?", a:"Được. Phần mềm làm cho người bận bán hàng nên thao tác tối giản; kẹt đâu nhắn Zalo có người chỉ tận nơi."},
      {q:"Dữ liệu của tôi có bị đưa lên mạng không?", a:"Không. Phần mềm chạy offline, số liệu nằm trong máy anh chị. Chúng tôi không thu thập và không đẩy lên đám mây của ai."},
      {q:"Trả một lần hay đóng phí hằng tháng?", a:"Trả một lần, dùng mãi. Bản quyền gắn theo máy; không mất dữ liệu khi anh chị ngừng trả tiền như phần mềm thuê bao."},
      {q:"Phần mềm có cập nhật khi thông tư thay đổi không?", a:"Có. Tác giả làm việc trong ngành nên cập nhật kịp theo quy định mới trong kỳ hỗ trợ."},
      {q:"Có xuất được tờ khai để nộp thuế không?", a:"Có. Kế Toán Pro xuất file chuẩn để nộp qua HTKK; HTKK vẫn là bước trung gian khi nộp."},
      {q:"Muốn mua hoặc dùng thử thì liên hệ ai?", a:"Nhắn Zalo 0917 324 328 hoặc gọi trực tiếp — người làm ra phần mềm trả lời."}
    ]
  },
  categories:[
    {slug:"data-foundation", name:"Data Foundation", desc:"Nền tảng dữ liệu sạch: khái niệm, chuẩn hóa và chất lượng số liệu.", order:1},
    {slug:"data-to-decision", name:"Data to Decision", desc:"Biến số liệu rời rạc thành quyết định kinh doanh cụ thể.", order:2},
    {slug:"quan-tri-doanh-nghiep", name:"Quản trị doanh nghiệp", desc:"Vận hành, chỉ số và ra quyết định cho hộ và doanh nghiệp nhỏ.", order:3},
    {slug:"thue-ke-toan", name:"Thuế & Kế toán", desc:"Kê khai, sổ sách, hóa đơn và pháp quy — bằng ngôn ngữ đời thường.", order:4},
    {slug:"ai-cho-doanh-nghiep", name:"AI cho doanh nghiệp", desc:"Ứng dụng AI thực tế cho kế toán, dữ liệu và vận hành.", order:5},
    {slug:"case-study", name:"Case Study", desc:"Câu chuyện thật: từ số liệu đến kết quả đo được.", order:6},
    {slug:"hoc-cung-huydata", name:"Học cùng HuyData", desc:"Hướng dẫn từng bước để bắt đầu và dùng thành thạo.", order:7}
  ],
  tags:[
    {slug:"du-lieu-sach", name:"Dữ liệu sạch"},
    {slug:"nhap-mon", name:"Nhập môn"},
    {slug:"thue-khoan", name:"Thuế khoán"},
    {slug:"ke-khai", name:"Kê khai"},
    {slug:"tt133", name:"Thông tư 133"},
    {slug:"ton-kho", name:"Tồn kho"},
    {slug:"dashboard", name:"Dashboard"},
    {slug:"chatgpt", name:"ChatGPT"},
    {slug:"chi-so", name:"Chỉ số"}
  ],
  entities:[
    {slug:"huydata", name:"HuyData", type:"Thương hiệu", desc:"Nền tảng dữ liệu và tri thức cho hộ kinh doanh và doanh nghiệp nhỏ.", related:["data-platform","decision-support"]},
    {slug:"data-platform", name:"Data Platform", type:"Nền tảng", desc:"Lớp chuẩn hóa và lưu trữ dữ liệu sạch làm nền cho phân tích.", related:["du-lieu-sach","dashboard","decision-support"]},
    {slug:"dashboard", name:"Dashboard", type:"Công cụ", desc:"Bảng số liệu trực quan giúp thấy nhanh tình hình kinh doanh.", related:["data-platform","decision-support","khopro"]},
    {slug:"decision-support", name:"Decision Support", type:"Khái niệm", desc:"Lớp biến số liệu thành khuyến nghị hành động.", related:["dashboard","data-platform"]},
    {slug:"ke-toan-pro", name:"Kế Toán Pro", type:"Sản phẩm", desc:"Phần mềm kế toán hộ và siêu nhỏ theo Thông tư 133.", related:["hoa-don-dien-tu"]},
    {slug:"khopro", name:"KhoPro", type:"Sản phẩm", desc:"Quản lý kho và bán hàng kèm trợ lý quyết định.", related:["dashboard"]},
    {slug:"hoa-don-dien-tu", name:"Hóa đơn điện tử", type:"Khái niệm", desc:"Chứng từ hóa đơn dạng điện tử theo quy định pháp luật.", related:["ke-toan-pro"]},
    {slug:"du-lieu-sach", name:"Dữ liệu sạch", type:"Khái niệm", desc:"Dữ liệu đúng, đủ, nhất quán — nền của báo cáo đáng tin.", related:["data-platform"]}
  ],
  users:[
    {id:"tran-huy", name:"Trần Huy", email:"huydatavlo@gmail.com", role:"super-admin"}
  ],
  media:[]
};

function $(s,r){return (r||document).querySelector(s);}
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function clone(o){return JSON.parse(JSON.stringify(o));}
function deepMerge(base,over){
  if(over===null||over===undefined) return base;
  if(Array.isArray(over)) return over;
  if(typeof over!=="object") return over;
  var out=Array.isArray(base)?base.slice():Object.assign({},base);
  for(var k in over){ out[k]=deepMerge(base?base[k]:undefined, over[k]); }
  return out;
}
var ICONS={
  once:'<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  offline:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M4 12h2M18 12h2M12 4v2M12 18v2"/>',
  law:'<path d="M9 12l2 2 4-4"/><path d="M21 12c0 5-3.5 8-9 9-5.5-1-9-4-9-9V6l9-3 9 3v6z"/>',
  chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  db:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 4v16"/><circle cx="8" cy="9" r="1"/><circle cx="8" cy="15" r="1"/>',
  notrack:'<path d="M18 6 6 18M6 6l12 12"/><circle cx="12" cy="12" r="10"/>',
  lock:'<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V8a5 5 0 0 1 10 0v3"/><circle cx="12" cy="16" r="1.5"/>',
  optin:'<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  box:'<path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v9"/>',
  doc:'<path d="M14 3v5h5"/><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>'
};
function svgIc(k){return '<svg viewBox="0 0 24 24">'+(ICONS[k]||ICONS.doc)+'</svg>';}
var LOGO='<svg viewBox="0 0 180 180" aria-hidden="true"><rect width="180" height="180" rx="40" fill="#102A1D"/><line x1="50" y1="36" x2="50" y2="144" stroke="#74C69D" stroke-width="16" stroke-linecap="round"/><line x1="130" y1="36" x2="130" y2="144" stroke="#74C69D" stroke-width="16" stroke-linecap="round"/><line x1="50" y1="90" x2="130" y2="90" stroke="#2DD4A8" stroke-width="16" stroke-linecap="round"/><circle cx="50" cy="36" r="14" fill="#B7E4C7"/><circle cx="130" cy="36" r="14" fill="#2DD4A8"/><circle cx="50" cy="144" r="14" fill="#2DD4A8"/><circle cx="130" cy="144" r="14" fill="#B7E4C7"/><circle cx="90" cy="90" r="12" fill="#40916C"/></svg>';
var MARK='<svg viewBox="0 0 180 180"><line x1="50" y1="36" x2="50" y2="144" stroke="#74C69D" stroke-width="17" stroke-linecap="round"/><line x1="130" y1="36" x2="130" y2="144" stroke="#74C69D" stroke-width="17" stroke-linecap="round"/><line x1="50" y1="90" x2="130" y2="90" stroke="#2DD4A8" stroke-width="17" stroke-linecap="round"/><circle cx="50" cy="36" r="15" fill="#B7E4C7"/><circle cx="130" cy="36" r="15" fill="#2DD4A8"/><circle cx="50" cy="144" r="15" fill="#2DD4A8"/><circle cx="130" cy="144" r="15" fill="#B7E4C7"/><circle cx="90" cy="90" r="13" fill="#40916C"/></svg>';
function brandName(s){ var b=String(s.brandName||"HuyData"); if(/data$/i.test(b)) return esc(b.slice(0,-4))+'<span class="accent">'+esc(b.slice(-4))+'</span>'; return esc(b); }
function zaloURL(s){return "https://zalo.me/"+encodeURIComponent(s.zalo||"");}

function sanitize(html, mode){
  var allow = mode==="inline"
    ? {BR:[],EM:[],I:[],STRONG:[],B:[],SPAN:["class"]}
    : {P:[],BR:[],H2:[],H3:[],STRONG:[],B:[],EM:[],I:[],U:[],A:["href","target","rel"],UL:[],OL:[],LI:[],BLOCKQUOTE:[],IMG:["src","alt"],DIV:[],SPAN:["class"]};
  var doc=new DOMParser().parseFromString("<div>"+(html||"")+"</div>","text/html");
  var root=doc.body.firstChild;
  function walk(node){
    Array.prototype.slice.call(node.childNodes).forEach(function(ch){
      if(ch.nodeType===3) return;
      if(ch.nodeType!==1){ ch.remove(); return; }
      var tag=ch.tagName;
      if(!allow[tag]){ var f=doc.createDocumentFragment(); while(ch.firstChild)f.appendChild(ch.firstChild); ch.replaceWith(f); return; }
      Array.prototype.slice.call(ch.attributes).forEach(function(at){
        var ok=allow[tag].indexOf(at.name)>=0;
        if(!ok || /^on/i.test(at.name)){ ch.removeAttribute(at.name); return; }
        if((at.name==="href"||at.name==="src") && /^\s*javascript:/i.test(at.value)) ch.removeAttribute(at.name);
        if(tag==="SPAN" && at.name==="class" && at.value.indexOf("em")<0) ch.removeAttribute("class");
      });
      if(tag==="A" && ch.getAttribute("href")){ ch.setAttribute("target","_blank"); ch.setAttribute("rel","noopener noreferrer"); }
      walk(ch);
    });
  }
  walk(root);
  return root.innerHTML;
}
function stripTags(html){var d=document.createElement("div");d.innerHTML=html||"";return (d.textContent||"").trim();}
function fmtDate(s){ if(!s) return ""; var p=String(s).split("-"); if(p.length===3) return p[2]+"/"+p[1]+"/"+p[0]; return s; }

var DRAFT_KEY="huydata_draft_v1";
function readEmbedded(){ try{ var raw=$("#site-content").textContent.trim(); if(!raw||raw==="null")return null; return JSON.parse(raw);}catch(e){return null;} }
var content = deepMerge(clone(DEFAULT), readEmbedded());
function lsGet(k){ try{return localStorage.getItem(k);}catch(e){return null;} }
function lsSet(k,v){ try{localStorage.setItem(k,v);}catch(e){} }
var draftTimer=null;
function scheduleDraft(){ clearTimeout(draftTimer); draftTimer=setTimeout(function(){ lsSet(DRAFT_KEY, JSON.stringify({t:Date.now(),c:content})); },500); }

var SECTION_META={
  "boi-canh":{label:"Bối cảnh", nav:"Bối cảnh"},
  "vi-sao":{label:"Vì sao chọn HuyData", nav:"Vì sao"},
  "giai-phap":{label:"Giải pháp", nav:"Giải pháp"},
  "bang-gia":{label:"Bảng giá & Bản quyền", nav:"Bảng giá"},
  "quyet-dinh":{label:"Tầm nhìn (Số liệu → Quyết định)", nav:"Tầm nhìn"},
  "khach-hang":{label:"Dành cho ai", nav:"Dành cho ai"},
  "rieng-tu":{label:"Cam kết riêng tư", nav:"Riêng tư"},
  "faq":{label:"Hỏi đáp", nav:"Hỏi đáp"},
  "bai-viet":{label:"Thư viện Tri thức", nav:"Thư viện"},
  "ve-huydata":{label:"Về HuyData", nav:"Về HuyData"}
};
var SECTION_KEYS=Object.keys(SECTION_META);
function reconcileSections(){
  var s=DataService.getSettings();
  if(!s.sections||!s.sections.length) s.sections=SECTION_KEYS.map(function(k){return {key:k,on:true,nav:true};});
  var have={}; s.sections.forEach(function(x){have[x.key]=1;});
  SECTION_KEYS.forEach(function(k){ if(!have[k]) s.sections.push({key:k,on:true,nav:true}); });
  s.sections=s.sections.filter(function(x){return SECTION_META[x.key];});
}
function orderedSections(){ return DataService.getSections().slice(); }
function sectionAvailable(key){
  var sol=DataService.getSolutions(), pr=DataService.getPricing(), fq=DataService.getFaq(), bl=DataService.getBlog();
  if(key==="giai-phap") return !!(sol && sol.enabled!==false && sol.groups && sol.groups.length);
  if(key==="bang-gia") return !!(pr && pr.enabled!==false && pr.tiers && pr.tiers.length);
  if(key==="faq") return !!(fq && fq.enabled!==false && fq.items && fq.items.length);
  if(key==="bai-viet") return !!(bl && bl.enabled!==false && DataService.getPublishedPosts().length);
  return true;
}
function applyLayout(){
  var anchor=document.getElementById("lien-he");
  orderedSections().forEach(function(x){
    var el=document.getElementById(x.key); if(!el)return;
    el.classList.toggle("hide", !(x.on!==false && sectionAvailable(x.key)));
    if(anchor && anchor.parentNode) anchor.parentNode.insertBefore(el, anchor);
  });
}
function setSEO(){
  var s=DataService.getSettings(), seo=s.seo||{}, h=DataService.getHero();
  var title = seo.title || (brandTextPlain(s)+" — "+stripTags(sanitize(h.title,"inline")));
  var desc = seo.description || h.sub || "";
  var img = seo.ogImage || "";
  function meta(id,val,attr){ var el=document.getElementById(id); if(el){ if(id==="page-title") el.textContent=val; else el.setAttribute(attr||"content",val); } }
  document.title=title; meta("page-title",title);
  meta("meta-desc",desc); meta("og-title",title); meta("og-desc",desc); meta("tw-title",title); meta("tw-desc",desc);
  var oi=document.getElementById("og-img"), ti=document.getElementById("tw-img");
  if(img){ if(oi){oi.setAttribute("content",img);oi.removeAttribute("data-off");} if(ti)ti.setAttribute("content",img); }
  if(window.SEO) SEO.applyHome();
}
function brandTextPlain(s){ return String(s.brandName||"HuyData"); }


function renderAll(){
  var s=DataService.getSettings();
  var bsvg=LOGO;
  $("#brand").innerHTML = bsvg + '<span class="brand-text"><span class="brand-name">'+brandName(s)+'</span><span class="brand-sub">'+esc(s.sub)+'</span></span>';
  reconcileSections();
  $("#navlinks").innerHTML = orderedSections().filter(function(x){
      return x.nav!==false && SECTION_META[x.key] && SECTION_META[x.key].nav && sectionAvailable(x.key);
    }).map(function(x){ return '<a href="#'+x.key+'">'+esc(SECTION_META[x.key].nav)+'</a>'; }).join('');
  var zaloIc='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9436 0 1.0746.8697 1.9453 1.945 1.9453z"/></svg>';
  var nz=$("#nav-zalo"); nz.href=zaloURL(s); nz.innerHTML=zaloIc+" Nhắn Zalo";

  var h=DataService.getHero();
  $("#r-hero").innerHTML=
    '<span class="eyebrow on-dark">'+esc(h.eyebrow)+'</span>'+
    '<h1>'+sanitize(h.title,"inline")+'</h1>'+
    '<p class="hero-sub">'+esc(h.sub)+'</p>'+
    '<div class="hero-cta"><a class="btn btn-primary" href="'+zaloURL(s)+'" target="_blank" rel="noopener noreferrer">'+zaloIc+' '+esc(h.ctaText)+'</a>'+
    '<a class="btn btn-ghost on-dark" href="'+esc(h.ctaLink2||"#giai-phap")+'">'+esc(h.ctaText2)+'</a></div>'+
    '<div class="hero-trust">'+(h.trust||[]).map(function(t){return '<span>'+esc(t)+'</span>';}).join('')+'</div>';

  var pa=DataService.getPain();
  $("#r-pain").innerHTML=
    '<div class="head reveal"><span class="eyebrow">'+esc(pa.eyebrow)+'</span><h2 class="section-title">'+esc(pa.title)+'</h2><p class="section-intro">'+esc(pa.intro)+'</p></div>'+
    '<div class="pain-grid"><div class="pain-list reveal d1">'+
    pa.items.map(function(it){return '<div class="pain-item"><span class="pain-x">✕</span><div><b>'+esc(it.title)+'</b><p>'+esc(it.desc)+'</p></div></div>';}).join('')+
    '</div><div class="pain-answer reveal d2"><div class="q">'+sanitize(pa.answerTitle,"inline")+'</div><p>'+esc(pa.answerBody)+'</p><div class="sig">'+esc(pa.answerSig)+'</div></div></div>';

  var w=DataService.getWhy();
  $("#r-why").innerHTML=
    '<div class="head reveal"><span class="eyebrow">'+esc(w.eyebrow)+'</span><h2 class="section-title">'+esc(w.title)+'</h2><p class="section-intro">'+esc(w.intro)+'</p></div>'+
    '<div class="why-grid">'+w.cards.map(function(c,i){return '<div class="why-card reveal d'+(i+1)+'"><div class="why-ic">'+svgIc(c.icon)+'</div><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p></div>';}).join('')+'</div>';

  renderSolutions();

  var d=DataService.getDecision();
  $("#r-decision").innerHTML=
    '<div class="head reveal"><span class="eyebrow on-dark">'+esc(d.eyebrow)+'</span><h2 class="section-title">'+sanitize(d.title,"inline")+'</h2><p class="section-intro">'+esc(d.intro)+'</p></div>'+
    '<div class="ladder">'+d.rungs.map(function(r,i){return '<div class="rung reveal d'+(i+1)+'"><div class="node"></div><div class="k">'+esc(r.k)+'</div><h3>'+esc(r.title)+'</h3><p>'+esc(r.desc)+'</p></div>';}).join('')+'</div>'+
    '<div class="ladder-note reveal"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg><span>'+esc(d.note)+'</span></div>';

  var wh=DataService.getWho();
  $("#r-who").innerHTML=
    '<div class="head reveal"><span class="eyebrow">'+esc(wh.eyebrow)+'</span><h2 class="section-title">'+esc(wh.title)+'</h2></div>'+
    '<div class="who-grid">'+wh.cards.map(function(c,i){return '<div class="who reveal d'+(i+1)+'"><div class="tag">'+esc(c.tag)+'</div><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p></div>';}).join('')+'</div>';

  var pv=DataService.getPrivacy();
  $("#r-privacy").innerHTML=
    '<div class="head reveal"><span class="eyebrow">'+esc(pv.eyebrow)+'</span><h2 class="section-title">'+esc(pv.title)+'</h2><p class="section-intro">'+esc(pv.intro)+'</p></div>'+
    '<div class="priv-grid">'+pv.items.map(function(c,i){return '<div class="priv reveal d'+(i+1)+'"><div class="priv-ic">'+svgIc(c.icon)+'</div><div><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p></div></div>';}).join('')+'</div>'+
    '<div class="firewall reveal"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg><p><b>'+esc(pv.firewallTitle)+'</b> '+esc(pv.firewallBody)+'</p></div>';

  renderPricing();
  renderFaq();
  renderBlogList();

  var ab=DataService.getAbout();
  $("#r-about").innerHTML=
    '<div class="founder"><div class="reveal"><span class="eyebrow">'+esc(ab.eyebrow)+'</span><p class="founder-quote">'+esc(ab.quote)+'</p><p class="founder-body">'+esc(ab.body)+'</p></div>'+
    '<aside class="fcard reveal d2"><div class="fmark">'+LOGO+'</div><div class="fname">'+esc(ab.name)+'</div><div class="frole">'+esc(ab.role)+'</div>'+
    '<a class="fline" href="mailto:'+esc(s.email)+'"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'+esc(s.email)+'</a>'+
    '<a class="fline" href="tel:'+esc(s.phone)+'"><svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>'+esc(s.phoneText)+'</a>'+
    '<div class="fline"><svg viewBox="0 0 24 24"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'+esc(s.location)+'</div></aside></div>';

  var ct=DataService.getContact();
  $("#r-contact").innerHTML=
    '<div style="text-align:center"><div class="reveal"><span class="eyebrow on-dark" style="justify-content:center">'+esc(ct.eyebrow)+'</span><h2 class="section-title" style="color:var(--cream)">'+esc(ct.title)+'</h2><p style="font-size:16.5px;color:var(--green-pale);font-weight:300;max-width:500px;margin:14px auto 44px">'+esc(ct.sub)+'</p></div>'+
    '<div class="contact-cards">'+
    ccard(zaloIc,"Nhanh nhất","Zalo: "+esc(s.zaloText),zaloURL(s),true)+
    ccard('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>',"Gọi trực tiếp",esc(s.phoneText),"tel:"+esc(s.phone),false)+
    ccard('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',"Email",esc(s.email),"mailto:"+esc(s.email),false)+
    '</div></div>';

  $("#r-footer").innerHTML=
    '<div class="foot-top"><div class="foot-brand">'+LOGO+'<div class="bn">'+brandName(s)+'</div><div class="slg">'+esc(s.slogan)+'</div><div class="eco">'+esc(s.ecoNote)+'</div></div>'+
    '<div class="foot-col"><h4>Giải pháp</h4>'+(function(_s){return _s&&_s.groups?_s.groups.map(function(g){return '<a href="#giai-phap">'+esc(g.name)+'</a>';}).join(''):'';})(DataService.getSolutions())+'</div>'+
    '<div class="foot-col"><h4>Liên hệ</h4><a href="'+zaloURL(s)+'" target="_blank" rel="noopener noreferrer">Zalo: '+esc(s.zaloText)+'</a><a href="tel:'+esc(s.phone)+'">Điện thoại: '+esc(s.phoneText)+'</a><a href="mailto:'+esc(s.email)+'">'+esc(s.email)+'</a><p>'+esc(s.location)+'</p></div></div>'+
    '<div class="foot-bottom"><span>'+esc(s.copyright)+'</span><span class="priv-line"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Trang này không dùng cookie, không theo dõi anh chị.</span></div>';

  applyLayout();
  setSEO();
  setupReveal();
}
function solItemCard(p,i){
  var link = p.url ? '<a class="prod-link" href="'+esc(p.url)+'" target="_blank" rel="noopener noreferrer">'+esc(p.linkText||"Tìm hiểu")+' <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' : '';
  return '<article class="prod reveal d'+((i%3)+1)+'"><div class="prod-top"><div class="prod-mark">'+MARK+'</div><span class="badge '+esc(p.badge)+'">'+esc(p.badgeText)+'</span></div>'+
    '<h3>'+esc(p.name)+'</h3><p>'+esc(p.desc)+'</p>'+link+
    '<div class="prod-foot"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'+esc(p.foot)+'</div></article>';
}
function renderSolutions(){
  var sol=DataService.getSolutions(), sec=$("#giai-phap");
  if(!sol || sol.enabled===false || !sol.groups || !sol.groups.length){ if(sec)sec.classList.add("hide"); return; }
  $("#r-solutions").innerHTML=
    '<div class="head reveal"><span class="eyebrow">'+esc(sol.eyebrow)+'</span><h2 class="section-title">'+esc(sol.title)+'</h2><p class="section-intro">'+esc(sol.intro)+'</p></div>'+
    sol.groups.map(function(g){
      return '<div class="sol-group reveal"><div class="sol-ghead">'+(g.kicker?'<span class="sol-kick">'+esc(g.kicker)+'</span>':'')+
        '<h3 class="sol-gname">'+esc(g.name)+(g.badge?'<span class="badge soon">'+esc(g.badge)+'</span>':'')+'</h3>'+
        (g.tagline?'<p class="sol-gtag">'+esc(g.tagline)+'</p>':'')+'</div>'+
        '<div class="prod-grid">'+(g.items||[]).map(solItemCard).join('')+'</div></div>';
    }).join('');
  setupReveal();
}
function ccard(ic,label,val,href,blank){
  var icon=ic.replace(/stroke="currentColor"/g,'stroke="#fff"').replace(/fill="currentColor"/g,'fill="#fff"');
  return '<a class="ccard" href="'+href+'"'+(blank?' target="_blank" rel="noopener noreferrer"':'')+' style="background:rgba(255,255,255,.045);border:1px solid rgba(215,243,220,.14);border-radius:16px;padding:30px 22px;transition:transform .3s,background .3s,border-color .3s;display:block">'+
    '<div style="width:48px;height:48px;border-radius:13px;background:var(--teal);display:grid;place-items:center;margin:0 auto 16px">'+icon+'</div>'+
    '<div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--green-soft);margin-bottom:6px">'+label+'</div>'+
    '<div style="font-size:16px;font-weight:600;color:var(--cream)">'+val+'</div></a>';
}
function renderPricing(){
  var pr=DataService.getPricing(), sec=$("#bang-gia");
  if(!pr || pr.enabled===false || !pr.tiers || !pr.tiers.length){ sec.classList.add("hide"); return; }
  sec.classList.remove("hide");
  var s=DataService.getSettings(), chk='<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>';
  $("#r-pricing").innerHTML=
    '<div class="head reveal" style="text-align:center;margin-left:auto;margin-right:auto"><span class="eyebrow" style="justify-content:center">'+esc(pr.eyebrow)+'</span><h2 class="section-title">'+esc(pr.title)+'</h2><p class="section-intro" style="margin-left:auto;margin-right:auto">'+esc(pr.intro)+'</p></div>'+
    '<div class="price-grid">'+pr.tiers.map(function(t,i){
      var href=t.ctaLink?esc(t.ctaLink):zaloURL(s), blank=t.ctaLink?'':' target="_blank" rel="noopener noreferrer"', extBlank=(t.ctaLink&&/^https?:/i.test(t.ctaLink))?' target="_blank" rel="noopener noreferrer"':blank;
      return '<div class="price reveal d'+(i+1)+(t.highlight?' hl':'')+'">'+(t.badge?'<span class="ptag">'+esc(t.badge)+'</span>':'')+
        '<div class="pname">'+esc(t.name)+'</div><div class="pprice">'+esc(t.price)+'</div><div class="pper">'+esc(t.period)+'</div>'+
        '<div class="pdesc">'+esc(t.desc)+'</div><ul>'+(t.features||[]).map(function(f){return '<li>'+chk+'<span>'+esc(f)+'</span></li>';}).join('')+'</ul>'+
        '<a class="btn '+(t.highlight?'btn-primary':'btn-ghost')+'" href="'+href+'"'+extBlank+'>'+esc(t.cta||"Liên hệ")+'</a></div>';
    }).join('')+'</div>'+
    (pr.note?'<p class="price-note reveal">'+esc(pr.note)+'</p>':'');
  setupReveal();
}
function renderFaq(){
  var fq=DataService.getFaq(), sec=$("#faq");
  if(!fq || fq.enabled===false || !fq.items || !fq.items.length){ sec.classList.add("hide"); return; }
  sec.classList.remove("hide");
  var plus='<span class="fq-ic"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span>';
  $("#r-faq").innerHTML=
    '<div class="head reveal" style="text-align:center;margin-left:auto;margin-right:auto"><span class="eyebrow" style="justify-content:center">'+esc(fq.eyebrow)+'</span><h2 class="section-title">'+esc(fq.title)+'</h2><p class="section-intro" style="margin-left:auto;margin-right:auto">'+esc(fq.intro)+'</p></div>'+
    '<div class="faq-list reveal">'+fq.items.map(function(it){
      return '<details class="faq-item"><summary>'+esc(it.q)+plus+'</summary><div class="fa">'+esc(it.a)+'</div></details>';
    }).join('')+'</div>';
  setupReveal();
}
var blogPage=0, blogQuery="", blogCategory="", blogTag="";
function blogFiltered(){
  var pub=Search.filter(DataService.getPublishedPosts(), {query:blogQuery, category:blogCategory, tag:blogTag});
  // Bài nổi bật lên đầu, rồi đến ngày mới nhất
  pub.sort(function(a,b){
    var fa=a.featured?1:0, fb=b.featured?1:0;
    if(fa!==fb) return fb-fa;
    return String(b.date||"").localeCompare(String(a.date||""));
  });
  return pub;
}
function blogCard(p,i){
  var cover = p.cover ? 'style="background-image:url('+"'"+esc(p.cover)+"'"+')"' : '';
  var cat = DataService.getCategory(p.category);
  var catChip = cat ? '<span class="pcard-cat">'+esc(cat.name)+'</span>' : '';
  var feat = p.featured ? '<span class="pcard-featured">Nổi bật</span>' : '';
  return '<article class="pcard reveal d'+((i%3)+1)+'" data-slug="'+esc(p.slug)+'"><div class="pcard-cover '+(p.cover?'':'empty')+'" '+cover+'>'+feat+'</div>'+
    '<div class="pcard-body"><div class="pcard-meta">'+catChip+'<span class="pcard-time">'+Blog.readingTime(p)+' phút đọc</span></div>'+
    '<h3>'+esc(p.title)+'</h3><p>'+esc(p.excerpt||stripTags(p.body).slice(0,120))+'</p>'+
    '<div class="pcard-foot"><span class="date">'+esc(fmtDate(p.date))+'</span><span class="more">Đọc tiếp <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div></div></article>';
}
function renderBlogResults(){
  var host=$("#blog-results"); if(!host)return;
  var list=blogFiltered(), PS=9, pages=Math.max(1,Math.ceil(list.length/PS));
  if(blogPage>=pages)blogPage=pages-1; if(blogPage<0)blogPage=0;
  var slice=list.slice(blogPage*PS,(blogPage+1)*PS);
  var cnt=$("#blog-count"); if(cnt) cnt.textContent=list.length+" bài";
  var grid = slice.length ? '<div class="post-grid">'+slice.map(blogCard).join('')+'</div>' : '<p class="blog-empty">Không tìm thấy bài phù hợp.</p>';
  var pager = pages>1 ? '<div class="pager"><button class="pgbtn" id="pg-prev"'+(blogPage===0?' disabled':'')+'>← Trước</button><span class="pgnum">Trang '+(blogPage+1)+' / '+pages+'</span><button class="pgbtn" id="pg-next"'+(blogPage>=pages-1?' disabled':'')+'>Sau →</button></div>' : '';
  host.innerHTML=grid+pager;
  var pv=$("#pg-prev"), nx=$("#pg-next");
  if(pv) pv.addEventListener("click",function(){ blogPage--; renderBlogResults(); var s=document.getElementById("bai-viet"); if(s)s.scrollIntoView({behavior:"smooth"}); });
  if(nx) nx.addEventListener("click",function(){ blogPage++; renderBlogResults(); var s=document.getElementById("bai-viet"); if(s)s.scrollIntoView({behavior:"smooth"}); });
  Array.prototype.forEach.call(host.querySelectorAll(".pcard"),function(c){ c.addEventListener("click",function(){ var slug=c.getAttribute("data-slug"); if(window.Router && Router.goPost(slug)){ route(); } else { location.hash="#/bai/"+slug; } }); });
  setupReveal();
}
function renderBlogList(){
  var b=DataService.getBlog(), sec=$("#bai-viet");
  var pubAll=DataService.getPublishedPosts();
  if(b.enabled===false || pubAll.length===0){ if(sec)sec.classList.add("hide"); return; }
  // Chỉ hiện category / tag có bài
  var cats=DataService.getCategories().filter(function(c){ return DataService.getPostsByCategory(c.slug).length; });
  var catChips='<button class="kb-chip'+(blogCategory===""?" on":"")+'" data-cat="">Tất cả</button>'+
    cats.map(function(c){ return '<button class="kb-chip'+(blogCategory===c.slug?" on":"")+'" data-cat="'+esc(c.slug)+'">'+esc(c.name)+'</button>'; }).join('');
  var tags=DataService.getTags().filter(function(t){ return DataService.getPostsByTag(t.slug).length; });
  var tagChips=tags.length? '<div class="kb-tags reveal">'+tags.map(function(t){ return '<button class="kb-tag'+(blogTag===t.slug?" on":"")+'" data-tag="'+esc(t.slug)+'">#'+esc(t.name)+'</button>'; }).join('')+'</div>' : '';
  var searchBox='<div class="blog-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><input id="blog-q" type="search" placeholder="Tìm trong thư viện…" value="'+esc(blogQuery)+'"></div>';
  $("#r-blog").innerHTML=
    '<div class="head reveal" style="margin-bottom:26px"><span class="eyebrow">'+esc(b.eyebrow)+'</span><h2 class="section-title">'+esc(b.title)+'</h2><p class="section-intro">'+esc(b.intro)+'</p></div>'+
    '<div class="kb-toolbar reveal"><div class="kb-cats">'+catChips+'</div>'+searchBox+'</div>'+
    tagChips+
    '<div class="blog-count" id="blog-count"></div>'+
    '<div id="blog-results"></div>';
  Array.prototype.forEach.call($("#r-blog").querySelectorAll(".kb-chip"),function(btn){
    btn.addEventListener("click",function(){ blogCategory=btn.getAttribute("data-cat")||""; blogPage=0; renderBlogList(); });
  });
  Array.prototype.forEach.call($("#r-blog").querySelectorAll(".kb-tag"),function(btn){
    btn.addEventListener("click",function(){ var t=btn.getAttribute("data-tag")||""; blogTag=(blogTag===t?"":t); blogPage=0; renderBlogList(); });
  });
  var q=$("#blog-q"); if(q) q.addEventListener("input",function(){ blogQuery=q.value; blogPage=0; renderBlogResults(); });
  renderBlogResults();
}

// Dựng HTML nội dung bài (dùng chung cho xem bài runtime và sinh trang tĩnh SEO).
// Trả { html, toc } — html là toàn bộ phần trong <article>.
function difficultyLabel(d){ return ({beginner:"Cơ bản", intermediate:"Trung cấp", advanced:"Nâng cao"})[d]||""; }
function levelLabel(l){ return ({foundation:"Nền tảng", intermediate:"Nâng cao", advanced:"Chuyên sâu"})[l]||""; }
function articleInnerHTML(p){
  var cat=DataService.getCategory(p.category);
  var author=DataService.getAuthor(p.author);
  var built=Blog.buildTOC(sanitize(p.body,"post"));
  var rt=Blog.readingTime(p);
  var rel=Blog.related(p, DataService.getPublishedPosts(), 3);
  var ai=p.ai||{};

  var crumb='<nav class="breadcrumb" aria-label="Breadcrumb"><a href="#" data-nav="home">Trang chủ</a><span class="sep">›</span>'+
    (cat?'<a href="#" data-nav="cat" data-cat="'+esc(p.category)+'">'+esc(cat.name)+'</a><span class="sep">›</span>':'')+
    '<span class="cur">'+esc(p.title)+'</span></nav>';

  var diff=difficultyLabel(ai.difficulty);
  var headTop='<div class="article-tags">'+(cat?'<span class="article-cat">'+esc(cat.name)+'</span>':'')+(diff?'<span class="article-diff">'+esc(diff)+'</span>':'')+'</div>';

  var mb=[];
  if(author&&author.name) mb.push(esc(author.name));
  if(p.date) mb.push(esc(fmtDate(p.date)));
  if(p.updatedAt) mb.push('Cập nhật '+esc(fmtDate(p.updatedAt)));
  mb.push(rt+' phút đọc');
  var meta='<div class="article-meta">'+mb.join('<span class="dot-sep">·</span>')+'</div>';

  var summary=ai.summary? '<div class="article-summary"><span class="as-label">Tóm tắt</span><p>'+esc(ai.summary)+'</p></div>' : '';

  var toc = built.toc.length>=2 ? '<nav class="toc"><div class="toc-title">Mục lục</div><ul>'+
    built.toc.map(function(t){ return '<li class="lv'+t.level+'"><a href="#'+esc(t.id)+'" data-toc="'+esc(t.id)+'">'+esc(t.text)+'</a></li>'; }).join('')+'</ul></nav>' : '';

  var faqBox=(p.faqs&&p.faqs.length)? '<section class="article-faq"><h2>Câu hỏi thường gặp</h2>'+
    p.faqs.map(function(f){ return '<details class="faq-item"><summary>'+esc(f.q)+'<span class="fq-ic"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span></summary><div class="fa">'+esc(f.a)+'</div></details>'; }).join('')+'</section>' : '';

  var ents=DataService.getPostEntities(p);
  var entityBox=ents.length? '<aside class="entity-box"><div class="eb-title">Chủ đề &amp; thực thể liên quan</div><div class="eb-chips">'+
    ents.map(function(e){ return '<span class="entity-chip" title="'+esc(e.desc||'')+'"><b>'+esc(e.name)+'</b>'+(e.type?'<span class="ec-type">'+esc(e.type)+'</span>':'')+'</span>'; }).join('')+'</div></aside>' : '';

  var chain=DataService.getLearningChain(p.category);
  var clusterBox=(chain.length>1)? '<nav class="cluster-nav"><div class="cluster-title">Chuỗi học tập'+(cat?' · '+esc(cat.name):'')+'</div><ol class="chain">'+
    chain.map(function(c){ var lv=levelLabel(c.level), pin=c.pillar?'<span class="chain-pillar">Nền tảng</span>':(lv?'<span class="chain-lv">'+esc(lv)+'</span>':''); var href=(window.Router?Router.postUrl(c):('#/bai/'+c.slug));
      return '<li class="'+(c.slug===p.slug?'cur':'')+'">'+(c.slug===p.slug
        ? '<span class="chain-cur">'+pin+esc(c.title)+'</span>'
        : '<a class="chain-link" href="'+esc(href)+'" data-slug="'+esc(c.slug)+'">'+pin+esc(c.title)+'</a>')+'</li>'; }).join('')+'</ol></nav>' : '';

  var related = rel.length ? '<aside class="related-posts"><h2>Bài liên quan</h2><div class="related-grid">'+
    rel.map(function(r){ var rc=DataService.getCategory(r.category); var href=(window.Router?Router.postUrl(r):('#/bai/'+r.slug));
      return '<a class="related-card" href="'+esc(href)+'" data-slug="'+esc(r.slug)+'">'+(rc?'<span class="pcard-cat">'+esc(rc.name)+'</span>':'')+'<h3>'+esc(r.title)+'</h3><span class="rc-time">'+Blog.readingTime(r)+' phút đọc</span></a>'; }).join('')+
    '</div></aside>' : '';

  var html=
    crumb+
    '<div class="article-head">'+headTop+'<h1>'+esc(p.title)+'</h1>'+meta+'</div>'+
    summary+
    (p.cover?'<div class="cover-wrap"><img class="article-cover" src="'+esc(p.cover)+'" alt="'+esc(p.title)+'" loading="lazy" decoding="async" draggable="false"><span class="cover-wm">© '+esc(DataService.getSettings().brandName||"HuyData")+'</span></div>':'')+
    toc+
    '<div class="prose">'+built.html+'</div>'+
    faqBox+
    entityBox+
    clusterBox+
    related;
  return { html:html, toc:built.toc };
}
function wireArticle(art){
  var hl=art.querySelector('[data-nav=home]'); if(hl) hl.addEventListener("click",function(e){ e.preventDefault(); if(window.Router)Router.goHome(); route(); window.scrollTo(0,0); });
  var cl=art.querySelector('[data-nav=cat]'); if(cl) cl.addEventListener("click",function(e){ e.preventDefault(); backToLibrary(cl.getAttribute("data-cat")); });
  Array.prototype.forEach.call(art.querySelectorAll('[data-toc]'),function(a){ a.addEventListener("click",function(e){ e.preventDefault(); var el=document.getElementById(a.getAttribute("data-toc")); if(el) el.scrollIntoView({behavior:"smooth",block:"start"}); }); });
  Array.prototype.forEach.call(art.querySelectorAll('a[data-slug]'),function(a){ a.addEventListener("click",function(e){ e.preventDefault(); var rs=a.getAttribute("data-slug"); if(window.Router && Router.goPost(rs)){ route(); } else { location.hash="#/bai/"+rs; } }); });
}
function openPost(slug){
  var p=DataService.getPublishedPosts().find(function(x){return x.slug===slug;});
  if(!p){ closePost(); return; }
  if(window.Router) Router.setCanonical(p);
  var s=DataService.getSettings();
  $("#pv-brand").innerHTML=LOGO+'<span class="brand-text"><span class="brand-name">'+brandName(s)+'</span></span>';
  var art=$("#pv-article");
  art.innerHTML=articleInnerHTML(p).html;
  wireArticle(art);
  if(window.SEO) SEO.applyPost(p);
  $("#postview").classList.add("open"); window.scrollTo(0,0); document.body.style.overflow="hidden";
}
function closePost(){ $("#postview").classList.remove("open"); if(!$("#admin").classList.contains("open")) document.body.style.overflow=""; }
function backToLibrary(catSlug){
  if(window.Router) Router.goHome();
  blogCategory=catSlug||""; blogTag=""; blogQuery=""; blogPage=0;
  route();
  renderBlogList();
  var s=document.getElementById("bai-viet"); if(s) s.scrollIntoView({behavior:"smooth"});
}
$("#pv-back").addEventListener("click",function(){
  if(window.Router){ Router.goHome(); route(); var s=document.getElementById("bai-viet"); if(s)s.scrollIntoView({behavior:"smooth"}); }
  else { location.hash="#bai-viet"; }
});
function route(){
  var r = window.Router ? Router.resolve()
        : (function(){ var m=location.hash.match(/^#\/bai\/(.+)$/); return m?{type:"post",slug:decodeURIComponent(m[1])}:(location.hash==="#quan-tri"?{type:"admin"}:{type:"home"}); })();
  if(r.type==="post"){ openPost(r.slug); }
  else if(r.type==="admin"){ closePost(); setSEO(); openAdmin(); }
  else { closePost(); setSEO(); }
}
window.addEventListener("hashchange",route);
window.addEventListener("popstate",route);

var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function setupReveal(){
  var items=document.querySelectorAll('.reveal:not(.obs)');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.14,rootMargin:'0px 0px -8% 0px'});
    items.forEach(function(el){el.classList.add('obs');io.observe(el);});
  } else { items.forEach(function(el){el.classList.add('in','obs');}); }
}
(function(){
  var hdr=$("#hdr"),hero=$("#top"),ticking=false;
  function onScroll(){ if(ticking)return; ticking=true; requestAnimationFrame(function(){
    var y=window.scrollY||0; hdr.classList.toggle('scrolled',y>20);
    if(hero) hdr.classList.toggle('on-hero', y<(hero.offsetHeight-90)); ticking=false; });}
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
})();
(function(){
  var burger=$("#burger"),links=$("#navlinks");
  burger.addEventListener('click',function(){var o=links.classList.toggle('open');burger.setAttribute('aria-expanded',o?'true':'false');});
  links.addEventListener('click',function(e){if(e.target.tagName==='A'){links.classList.remove('open');burger.setAttribute('aria-expanded','false');}});
})();
(function(){
  var canvas=$("#constellation"); if(!canvas)return;
  var ctx=canvas.getContext('2d'),dpr=Math.min(window.devicePixelRatio||1,2),W=0,H=0,nodes=[],raf=null,running=false,LINK=132;
  function count(){var a=window.innerWidth*window.innerHeight;return Math.max(26,Math.min(64,Math.round(a/26000)));}
  function size(){var r=canvas.getBoundingClientRect();W=r.width;H=r.height;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  function seed(){nodes=[];var n=count();for(var i=0;i<n;i++)nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.6+1});}
  function frame(){ctx.clearRect(0,0,W,H);for(var i=0;i<nodes.length;i++){var p=nodes[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;}
    for(var a=0;a<nodes.length;a++)for(var b=a+1;b<nodes.length;b++){var dx=nodes[a].x-nodes[b].x,dy=nodes[a].y-nodes[b].y,dd=Math.sqrt(dx*dx+dy*dy);if(dd<LINK){var o=(1-dd/LINK)*.5;ctx.strokeStyle='rgba(116,198,157,'+o.toFixed(3)+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y);ctx.lineTo(nodes[b].x,nodes[b].y);ctx.stroke();}}
    for(var k=0;k<nodes.length;k++){var q=nodes[k];ctx.fillStyle='rgba(45,212,168,.85)';ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,Math.PI*2);ctx.fill();}
    raf=requestAnimationFrame(frame);}
  function start(){if(running)return;running=true;frame();}
  function stop(){running=false;if(raf)cancelAnimationFrame(raf);raf=null;}
  if(reduce){size();seed();for(var k=0;k<nodes.length;k++){ctx.fillStyle='rgba(45,212,168,.8)';ctx.beginPath();ctx.arc(nodes[k].x,nodes[k].y,nodes[k].r,0,Math.PI*2);ctx.fill();}return;}
  size();seed();start();
  document.addEventListener('visibilitychange',function(){document.hidden?stop():start();});
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){e[0].isIntersecting?start():stop();},{threshold:0}).observe(canvas);
  var rt=null;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){size();seed();},200);});
})();

var toastTimer=null;
function toast(msg){var t=$("#toast");t.innerHTML='<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>'+esc(msg);t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.classList.remove("show");},3000);}

async function sha256(str){
  var buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(str));
  return Array.prototype.map.call(new Uint8Array(buf),function(b){return b.toString(16).padStart(2,"0");}).join("");
}
var unlocked=false;
$("#adminbtn").addEventListener("click",function(){ if(unlocked) openAdmin(); else showPin(); });
function showPin(){ $("#pinmodal").classList.add("open"); $("#pinerr").textContent=""; $("#pininput").value=""; setTimeout(function(){$("#pininput").focus();},50); }
$("#pincancel").addEventListener("click",function(){ $("#pinmodal").classList.remove("open"); if(location.hash==="#quan-tri") location.hash=""; });
$("#pinok").addEventListener("click",tryPin);
$("#pininput").addEventListener("keydown",function(e){if(e.key==="Enter")tryPin();});
async function tryPin(){
  var h=await sha256($("#pininput").value);
  if(h===content.settings.pinHash){ unlocked=true; $("#pinmodal").classList.remove("open"); openAdmin(); }
  else { $("#pinerr").textContent="Mã PIN chưa đúng. Thử lại nhé."; $("#pininput").select(); }
}

var TABS=[
  {id:"dashboard",label:"Thống kê"},
  {id:"layout",label:"Bố cục trang"},
  {id:"brand",label:"Thương hiệu & Liên hệ"},
  {id:"hero",label:"Đầu trang (Hero)"},
  {id:"pain",label:"Bối cảnh & Vì sao"},
  {id:"solutions",label:"Giải pháp"},
  {id:"decision",label:"Tầm nhìn & Khách hàng"},
  {id:"privacy",label:"Riêng tư & Giới thiệu"},
  {id:"pricing",label:"Bảng giá & Bản quyền"},
  {id:"faq",label:"Hỏi đáp (FAQ)"},
  {id:"blog",label:"Thư viện Tri thức"},
  {id:"media",label:"Media & Kho tri thức"},
  {id:"users",label:"Người dùng & Phân quyền"},
  {id:"seo",label:"SEO & Xuất bản"},
  {id:"pin",label:"Đổi mã PIN"}
];
var curTab="dashboard";
// Code-splitting (Phase 3.7): nạp các module chỉ dùng trong admin theo yêu cầu,
// để người đọc thông thường không phải tải chúng.
var _loaded={};
function loadScript(src){
  return new Promise(function(resolve,reject){
    if(_loaded[src] || document.querySelector('script[data-dyn="'+src+'"]')){ _loaded[src]=true; resolve(); return; }
    var s=document.createElement("script"); s.src=src; s.async=true; s.setAttribute("data-dyn",src);
    s.onload=function(){ _loaded[src]=true; resolve(); };
    s.onerror=function(){ reject(new Error("Không nạp được "+src)); };
    document.head.appendChild(s);
  });
}
function ensureAdminModules(){ return Promise.all([loadScript("js/dashboard.js"), loadScript("js/zip.js")]); }
function openAdmin(){
  if(!unlocked){ showPin(); return; }
  var show=function(){ buildAdmin(); $("#admin").classList.add("open"); document.body.style.overflow="hidden"; };
  ensureAdminModules().then(show).catch(function(e){ if(window.console)console.warn(e); show(); });
}
function closeAdmin(){ $("#admin").classList.remove("open"); document.body.style.overflow=""; if(location.hash==="#quan-tri")location.hash=""; }
function buildAdmin(){
  var draft=lsGet(DRAFT_KEY), hasDraft=false, draftInfo="";
  if(draft){ try{var dj=JSON.parse(draft); if(JSON.stringify(dj.c)!==JSON.stringify(content)){hasDraft=true; draftInfo=new Date(dj.t).toLocaleString("vi-VN");}}catch(e){} }
  var top='<div class="admin-top"><span class="at-title">'+LOGO+' Quản trị nội dung</span>'+
    (hasDraft?'<button class="abtn" id="a-restore" title="Bản nháp lúc '+esc(draftInfo)+'"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg> Khôi phục nháp</button>':'')+
    '<button class="abtn" id="a-import"><svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="M8 11l4 4 4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg> Nhập .json</button>'+
    '<button class="abtn" id="a-json"><svg viewBox="0 0 24 24"><path d="M12 21V9"/><path d="M8 13l4-4 4 4"/><path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/></svg> Xuất .json</button>'+
    '<button class="abtn primary" id="a-html"><svg viewBox="0 0 24 24"><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M8 21V9h8"/></svg> Xuất trang (.html)</button>'+
    '<button class="abtn" id="a-close"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg> Đóng</button></div>';
  var tabs='<div class="admin-tabs">'+TABS.map(function(t){return '<button data-tab="'+t.id+'" class="'+(t.id===curTab?'active':'')+'">'+t.label+'</button>';}).join('')+'</div>';
  $("#admin").innerHTML=top+'<div class="admin-main">'+tabs+'<div class="admin-body" id="admin-body"></div></div>';
  $("#a-close").addEventListener("click",closeAdmin);
  $("#a-html").addEventListener("click",exportHTML);
  $("#a-json").addEventListener("click",exportJSON);
  $("#a-import").addEventListener("click",importJSON);
  if(hasDraft) $("#a-restore").addEventListener("click",function(){ try{content=deepMerge(clone(DEFAULT),JSON.parse(draft).c); renderAll(); buildAdmin(); toast("Đã khôi phục bản nháp");}catch(e){} });
  Array.prototype.forEach.call($("#admin").querySelectorAll(".admin-tabs button"),function(b){
    b.addEventListener("click",function(){ curTab=b.getAttribute("data-tab"); buildAdmin(); });
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
  var ev=function(){ onInput(inp.value); renderAll(); scheduleDraft(); };
  inp.addEventListener("input",ev);
  if(opt.select) inp.addEventListener("change",ev);
  return el;
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
  if(curTab==="dashboard"){
    p.appendChild(h2("Thống kê quản trị"));
    var dc=document.createElement("div"); p.appendChild(dc);
    if(window.Dashboard) Dashboard.render(dc); else dc.appendChild(hint("Chưa nạp module thống kê."));
  }
  else if(curTab==="users"){ renderUsersPanel(p); }
  else if(curTab==="media"){ renderMediaPanel(p); }
  else if(curTab==="layout"){
    reconcileSections();
    p.appendChild(h2("Bố cục trang"));
    p.appendChild(hint("Đổi thứ tự các mục bằng ▲▼. Bỏ chọn \"Hiện\" để ẩn một mục; \"Menu\" để đưa lên/khỏi thanh điều hướng. Đầu trang và Liên hệ luôn cố định."));
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
          '<label style="font-size:13px;color:var(--text-mid);cursor:pointer;display:inline-flex;align-items:center;gap:6px"><input type="checkbox" data-a="nav" '+(x.nav!==false?"checked":"")+' style="width:auto">Menu</label></div>';
        card.querySelector('[data-a=up]').onclick=function(){if(i>0){var a=content.settings.sections;a.splice(i-1,0,a.splice(i,1)[0]);refreshL();renderAll();scheduleDraft();}};
        card.querySelector('[data-a=down]').onclick=function(){var a=content.settings.sections;if(i<a.length-1){a.splice(i+1,0,a.splice(i,1)[0]);refreshL();renderAll();scheduleDraft();}};
        card.querySelector('[data-a=on]').onchange=function(e){x.on=e.target.checked;renderAll();scheduleDraft();};
        card.querySelector('[data-a=nav]').onchange=function(e){x.nav=e.target.checked;renderAll();scheduleDraft();};
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
    p.appendChild(fld("Slogan (chân trang)",s.slogan,function(v){s.slogan=v;}));
    var g=document.createElement("div");g.className="grid2";
    g.appendChild(fld("Số Zalo (chỉ số)",s.zalo,function(v){s.zalo=v;},{ph:"0917324328"}));
    g.appendChild(fld("Zalo hiển thị",s.zaloText,function(v){s.zaloText=v;}));
    g.appendChild(fld("Điện thoại (tel:)",s.phone,function(v){s.phone=v;},{ph:"+84917324328"}));
    g.appendChild(fld("SĐT hiển thị",s.phoneText,function(v){s.phoneText=v;}));
    g.appendChild(fld("Email",s.email,function(v){s.email=v;}));
    g.appendChild(fld("Địa điểm",s.location,function(v){s.location=v;}));
    p.appendChild(g);
    p.appendChild(fld("Ghi chú hệ thương hiệu (chân trang)",s.ecoNote,function(v){s.ecoNote=v;},{textarea:true}));
    p.appendChild(fld("Dòng bản quyền",s.copyright,function(v){s.copyright=v;}));
  }
  else if(curTab==="hero"){
    p.appendChild(h2("Đầu trang (Hero)"));
    p.appendChild(hint("Tiêu đề cho phép xuống dòng bằng <code>&lt;br&gt;</code> và tô nhấn teal bằng <code>&lt;span class=\"em\"&gt;chữ&lt;/span&gt;</code>."));
    var h=c.hero;
    p.appendChild(fld("Nhãn nhỏ (eyebrow)",h.eyebrow,function(v){h.eyebrow=v;}));
    p.appendChild(fld("Tiêu đề chính",h.title,function(v){h.title=v;},{textarea:true,rows:2}));
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
    p.appendChild(fld("Tiêu đề trang (title / OG)",seo.title,function(v){seo.title=v;},{ph:"HuyData — Giải pháp dữ liệu..."}));
    p.appendChild(fld("Mô tả (description / OG)",seo.description,function(v){seo.description=v;},{textarea:true,rows:3}));
    p.appendChild(fld("Ảnh chia sẻ (OG image URL)",seo.ogImage,function(v){seo.ogImage=v;},{type:"url",ph:"https://.../anh-chia-se.jpg"}));
    p.appendChild(fld("Địa chỉ website (siteBase)",c.settings.siteBase,function(v){c.settings.siteBase=v;},{type:"url",ph:"https://tenban.github.io/repo/  (để trống = tự nhận)"}));
    p.appendChild(hint("<b>siteBase</b> dùng cho canonical, sitemap và RSS. Để trống thì tự nhận theo địa chỉ đang mở; nên điền đúng địa chỉ GitHub Pages (hoặc tên miền riêng) trước khi xuất bản."));
    p.appendChild(h2("Xuất bản site (SEO đầy đủ)"));
    p.appendChild(hint("Đóng gói toàn bộ site thành <b>.zip</b>: trang chủ, css/js, dữ liệu, <b>sitemap.xml</b>, <b>rss.xml</b>, <b>robots.txt</b> và một <b>trang HTML tĩnh cho mỗi bài</b> (để Google/Zalo/AI đọc được từng bài mà không cần JS). Giải nén rồi tải cả thư mục lên GitHub Pages. <i>Cần mở trang qua web server (http), không chạy được khi mở bằng file://.</i>"));
    var pubBtn=document.createElement("button"); pubBtn.className="btn btn-primary"; pubBtn.style.marginTop="4px";
    pubBtn.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="M8 11l4 4 4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg> Xuất bản site (.zip)';
    pubBtn.addEventListener("click",function(){ publishSite(); });
    p.appendChild(pubBtn);
    p.appendChild(hint("Vẫn giữ nút <b>Xuất trang (.html)</b> ở thanh trên nếu anh chỉ cần một file đơn (không có SEO tĩnh cho từng bài)."));
    p.appendChild(h2("Sao lưu & Khôi phục"));
    p.appendChild(hint("<b>Sao lưu:</b> Xuất <b>.json</b> (toàn bộ nội dung) hoặc <b>Markdown (.zip)</b> (mỗi bài một file .md + noi-dung.json) — dùng nút bên dưới và nút <b>Xuất .json</b> ở thanh trên. <b>Khôi phục:</b> toàn bộ bằng nút <b>Nhập .json</b> (thanh trên); từng bài bằng <b>Lịch sử phiên bản</b> trong trình soạn thảo bài."));
    var mdBtn=document.createElement("button"); mdBtn.className="abtn"; mdBtn.style.marginTop="2px";
    mdBtn.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3v5h5"/><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> Backup Markdown (.zip)';
    mdBtn.addEventListener("click",function(){ exportMarkdown(); });
    p.appendChild(mdBtn);

    // --- Nguồn dữ liệu / Backend (Phase 3.8) ---
    var bk=c.settings.backend||(c.settings.backend={enabled:false,provider:"supabase",url:"",anonKey:""});
    p.appendChild(h2("Nguồn dữ liệu (Backend)"));
    p.appendChild(hint("Mặc định site chạy <b>tĩnh</b> (đọc thư mục <code>data/</code>) — không cần backend. Khi cần <b>đăng nhập nhiều người, phân quyền thật, kho media thật hoặc quy mô rất lớn</b>, bật Supabase ở đây; giao diện <b>không đổi</b>. Xem <code>docs/supabase-schema.sql</code> để tạo bảng và bật RLS, và <code>docs/04-Bao-mat-va-luu-y.md</code> trước khi bật."));
    var bkEn=document.createElement("div");bkEn.className="fld";
    bkEn.innerHTML='<label style="cursor:pointer"><input type="checkbox" id="bk-en" '+(bk.enabled?"checked":"")+' style="width:auto;margin-right:8px;vertical-align:middle">Dùng backend Supabase thay cho dữ liệu tĩnh</label>';
    bkEn.querySelector("#bk-en").addEventListener("change",function(e){bk.enabled=e.target.checked;scheduleDraft();toast(e.target.checked?"Đã bật backend — tải lại trang để áp dụng":"Đã tắt backend");});
    p.appendChild(bkEn);
    p.appendChild(fld("Supabase URL",bk.url,function(v){bk.url=v;scheduleDraft();},{type:"url",ph:"https://xxxx.supabase.co"}));
    p.appendChild(fld("Supabase anon key (khóa công khai)",bk.anonKey,function(v){bk.anonKey=v;scheduleDraft();},{ph:"dán khóa anon/public của dự án"}));
    p.appendChild(hint("<b>Quan trọng:</b> anon key là khóa <i>công khai</i> dùng cho trình duyệt — nó KHÔNG bí mật. An toàn nằm ở việc <b>bật RLS</b> trên Supabase (cho đọc công khai, chỉ cho ghi khi đã đăng nhập). Tuyệt đối không dán <i>service_role key</i> vào đây. Ngoài ra phải thêm địa chỉ Supabase vào <code>connect-src</code> của thẻ CSP trong <code>index.html</code>."));
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

function renderUsersPanel(p){
  p.appendChild(h2("Người dùng & Phân quyền"));
  p.appendChild(hint("Quản lý danh sách người dùng và vai trò (Super Admin → Contributor). <b>Lưu ý:</b> bản tĩnh hiện tại lưu đây như <i>cấu hình dữ liệu</i>; việc thực thi phân quyền và đăng nhập nhiều người cần backend (Phase 3.8) — hiện một mã PIN mở toàn quyền."));
  content.users=content.users||[];
  p.appendChild(listEditor("Danh sách người dùng", content.users, function(it){return (it.name||"(chưa tên)")+" · "+(it.role||"");},
    [{k:"name",l:"Họ tên"},{k:"email",l:"Email",type:"email"},
     {k:"role",l:"Vai trò",select:DataService.ROLES.map(function(r){return {v:r,t:r};})}],
    {addLabel:"Thêm người dùng", add:function(){content.users.push({id:"u"+Date.now().toString(36),name:"Người dùng mới",email:"",role:"contributor"});}}));
}
function renderMediaPanel(p){
  p.appendChild(h2("Media & Kho tri thức (Data Vault)"));
  p.appendChild(hint("Đăng ký tài sản dữ liệu: ảnh, PDF, Excel, video, prompt, dataset, template — quản lý thống nhất như tài sản. <b>Lưu ý:</b> bản tĩnh lưu <i>đường dẫn</i> tới tài sản (đã đăng ở nơi khác hoặc trong thư mục images/uploads); tải file trực tiếp vào kho cần backend (Phase 3.8)."));
  content.media=content.media||[];
  p.appendChild(listEditor("Tài sản", content.media, function(it){return (it.name||"(chưa tên)")+" · "+(it.type||"");},
    [{k:"name",l:"Tên"},
     {k:"type",l:"Loại",select:[{v:"image",t:"Ảnh"},{v:"pdf",t:"PDF"},{v:"excel",t:"Excel"},{v:"video",t:"Video"},{v:"prompt",t:"Prompt"},{v:"dataset",t:"Dataset"},{v:"template",t:"Template"}]},
     {k:"url",l:"Đường dẫn (URL)",type:"url",ph:"images/... hoặc https://..."},
     {k:"desc",l:"Mô tả",textarea:true,rows:2}],
    {addLabel:"Thêm tài sản", add:function(){content.media.push({id:"m"+Date.now().toString(36),name:"Tài sản mới",type:"image",url:"",desc:""});}}));
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
      card.innerHTML='<div class="li-head"><div class="li-name"><span class="dot"></span>'+esc(post.title||"(chưa có tiêu đề)")+' '+(postStatus(post)!=="published"?'<span style="color:#B8860B;font-weight:500;font-size:12px">· '+esc(statusLabel(postStatus(post)))+'</span>':'')+'</div>'+
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
    add.onclick=function(){var np={id:"p"+Date.now(),slug:"bai-viet-moi-"+Date.now().toString(36),title:"Bài viết mới",category:"",tags:[],author:"tran-huy",date:new Date().toISOString().slice(0,10),updatedAt:"",excerpt:"",cover:"",status:"draft",published:false,featured:false,ai:{},faqs:[],body:"<p></p>"};b.posts.unshift(np);editPost(np);};
    listWrap.appendChild(add);
  }
  refresh();
  p.appendChild(listWrap);
}

function slugify(s){return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"bai-viet";}

function simpleHash(s){ s=String(s||""); var h=0,i; for(i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))|0; } return (h>>>0).toString(16); }
function statusLabel(s){ return ({draft:"Nháp",pending:"Chờ duyệt",published:"Đã xuất bản",archived:"Lưu trữ"})[s]||"Nháp"; }
function postStatus(post){ return post.status || (post.published?"published":"draft"); }
// Lưu một ảnh chụp phiên bản khi nội dung đổi (không xóa bản cũ). Giới hạn 20 bản.
function snapshotVersion(post){
  post.history=post.history||[];
  var h=simpleHash((post.title||"")+"|"+(post.body||""));
  var last=post.history[post.history.length-1];
  if(last && last.hash===h){ return; }
  var v=(post.version||post.history.length||0)+1;
  post.version=v; post.hash=h;
  post.history.push({version:v, at:new Date().toISOString(), title:post.title, body:post.body, hash:h});
  if(post.history.length>20) post.history=post.history.slice(-20);
}
function editPost(post){
  var b=$("#admin-body"); b.innerHTML="";
  var p=document.createElement("div");p.className="panel active";b.appendChild(p);
  var back=document.createElement("button");back.className="addbtn";back.style.cssText="width:auto;margin-bottom:18px;background:var(--green-mist)";
  back.innerHTML='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 18l-6-6 6-6"/></svg> Xong, về danh sách bài';
  back.onclick=function(){renderPanel();};
  p.appendChild(back);
  p.appendChild(h2(post.published?"Sửa bài viết":"Bài viết mới"));
  var slugTouched = !!post.slug && post.slug.indexOf("bai-viet-moi-")<0;
  var fSlug=fld("Đường dẫn (slug)",post.slug,function(v){slugTouched=true;post.slug=slugify(v);},{ph:"vi-du-duong-dan"});
  p.appendChild(fld("Tiêu đề bài",post.title,function(v){post.title=v; if(!slugTouched){post.slug=slugify(v); fSlug.querySelector("input").value=post.slug;}}));
  var g=document.createElement("div");g.className="grid2";
  g.appendChild(fld("Ngày đăng",post.date,function(v){post.date=v;},{type:"date"}));
  g.appendChild(fSlug);
  p.appendChild(g);
  p.appendChild(fld("Ảnh bìa (URL, tùy chọn)",post.cover,function(v){post.cover=v;},{type:"url",ph:"https://... hoặc để trống"}));
  p.appendChild(fld("Tóm tắt (hiện trên thẻ)",post.excerpt,function(v){post.excerpt=v;},{textarea:true,rows:2}));

  // --- Phân loại & Workflow (Phase 3.6) ---
  var catOpts=[{v:"",t:"— Chưa phân loại —"}].concat(DataService.getCategories().map(function(c){return {v:c.slug,t:c.name};}));
  var gA=document.createElement("div");gA.className="grid2";
  gA.appendChild(fld("Chuyên mục",post.category||"",function(v){post.category=v;renderAll();scheduleDraft();},{select:catOpts}));
  gA.appendChild(fld("Trạng thái",postStatus(post),function(v){post.status=v;post.published=(v==="published");renderAll();scheduleDraft();},{select:DataService.STATUSES.map(function(s){return {v:s,t:statusLabel(s)};})}));
  p.appendChild(gA);
  var gB=document.createElement("div");gB.className="grid2";
  gB.appendChild(fld("Tác giả",post.author||"tran-huy",function(v){post.author=v;renderAll();scheduleDraft();},{select:DataService.getUsers().map(function(u){return {v:u.id,t:u.name};})}));
  gB.appendChild(fld("Ngày cập nhật (tùy chọn)",post.updatedAt||"",function(v){post.updatedAt=v;renderAll();scheduleDraft();},{type:"date"}));
  p.appendChild(gB);
  p.appendChild(fld("Tag (cách nhau bằng dấu phẩy)",(post.tags||[]).join(", "),function(v){post.tags=v.split(",").map(function(x){return slugify(x);}).filter(Boolean);renderAll();scheduleDraft();},{ph:"vd: du-lieu-sach, nhap-mon"}));
  var gC=document.createElement("div");gC.className="grid2";
  gC.appendChild(fld("Cấp độ (chuỗi học tập)",post.level||"",function(v){post.level=v;renderAll();scheduleDraft();},{select:[{v:"",t:"—"},{v:"foundation",t:"Nền tảng"},{v:"intermediate",t:"Nâng cao"},{v:"advanced",t:"Chuyên sâu"}]}));
  post.ai=post.ai||{};
  gC.appendChild(fld("Độ khó",post.ai.difficulty||"",function(v){post.ai.difficulty=v;renderAll();scheduleDraft();},{select:[{v:"",t:"—"},{v:"beginner",t:"Cơ bản"},{v:"intermediate",t:"Trung cấp"},{v:"advanced",t:"Nâng cao"}]}));
  p.appendChild(gC);
  var chkFP=document.createElement("div");chkFP.className="fld";
  chkFP.innerHTML='<label style="cursor:pointer;margin-right:20px"><input type="checkbox" id="p-feat" '+(post.featured?"checked":"")+' style="width:auto;margin-right:7px;vertical-align:middle">Bài nổi bật</label>'+
    '<label style="cursor:pointer"><input type="checkbox" id="p-pillar" '+(post.pillar?"checked":"")+' style="width:auto;margin-right:7px;vertical-align:middle">Bài trụ (pillar) của chuyên mục</label>';
  chkFP.querySelector("#p-feat").addEventListener("change",function(e){post.featured=e.target.checked;renderAll();scheduleDraft();});
  chkFP.querySelector("#p-pillar").addEventListener("change",function(e){post.pillar=e.target.checked;renderAll();scheduleDraft();});
  p.appendChild(chkFP);

  var lab=document.createElement("label");lab.style.cssText="display:block;font-size:12.5px;font-weight:600;color:var(--green-deep);margin-bottom:7px";lab.textContent="Nội dung bài viết";
  p.appendChild(lab);
  var tools=document.createElement("div");tools.className="wy-tools";
  var buttons=[
    {c:"formatBlock:H2",h:"H2"},{c:"formatBlock:H3",h:"H3"},{c:"formatBlock:P",h:"¶"},{sep:1},
    {c:"bold",h:"<b>B</b>"},{c:"italic",h:"<i>I</i>"},{c:"underline",h:"<u>U</u>"},{sep:1},
    {c:"insertUnorderedList",h:"• DS"},{c:"insertOrderedList",h:"1. Số"},{c:"formatBlock:BLOCKQUOTE",h:"❝"},{sep:1},
    {c:"createLink",h:"🔗 Link"},{c:"insertImage",h:"🖼 Ảnh"},{sep:1},{c:"removeFormat",h:"✕ Xóa ĐD"}
  ];
  buttons.forEach(function(bt){
    if(bt.sep){var s=document.createElement("span");s.className="sep";tools.appendChild(s);return;}
    var btn=document.createElement("button");btn.type="button";btn.innerHTML=bt.h;
    btn.addEventListener("mousedown",function(e){e.preventDefault();});
    btn.addEventListener("click",function(){ exec(bt.c); });
    tools.appendChild(btn);
  });
  p.appendChild(tools);
  var ed=document.createElement("div");ed.className="editor";ed.contentEditable="true";ed.setAttribute("data-ph","Viết nội dung ở đây…");ed.innerHTML=sanitize(post.body||"","post");
  p.appendChild(ed);
  function exec(cmd){
    ed.focus();
    if(cmd.indexOf("formatBlock:")===0) document.execCommand("formatBlock",false,cmd.split(":")[1]);
    else if(cmd==="createLink"){ var u=prompt("Dán liên kết (URL):","https://"); if(u)document.execCommand("createLink",false,u); }
    else if(cmd==="insertImage"){ var im=prompt("Dán địa chỉ ảnh (URL):","https://"); if(im)document.execCommand("insertImage",false,im); }
    else document.execCommand(cmd,false,null);
    post.body=sanitize(ed.innerHTML,"post"); scheduleDraft();
  }
  ed.addEventListener("input",function(){ post.body=sanitize(ed.innerHTML,"post"); scheduleDraft(); });
  // --- AI & Tri thức (Phase 3.5/3.6) ---
  p.appendChild(h2("AI & Tri thức"));
  p.appendChild(hint("Giúp AI hiểu và trích dẫn bài. Tóm tắt và Câu hỏi thường gặp cũng được ghi vào JSON-LD khi xuất bản."));
  post.ai=post.ai||{};
  p.appendChild(fld("Tóm tắt cho AI (Summary)",post.ai.summary||"",function(v){post.ai.summary=v;renderAll();scheduleDraft();},{textarea:true,rows:2,sub:"1–2 câu súc tích"}));
  p.appendChild(fld("Từ khóa (cách nhau bằng dấu phẩy)",(post.ai.keywords||[]).join(", "),function(v){post.ai.keywords=v.split(",").map(function(x){return x.trim();}).filter(Boolean);scheduleDraft();}));
  var entWrap=document.createElement("div");entWrap.className="fld";
  entWrap.innerHTML='<label>Thực thể liên quan</label>';
  var entBox=document.createElement("div");entBox.style.cssText="display:flex;flex-wrap:wrap;gap:8px 16px;padding:4px 0";
  DataService.getEntities().forEach(function(en2){
    var lb=document.createElement("label");lb.style.cssText="font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;color:var(--text-mid)";
    var checked=(post.ai.entities||[]).indexOf(en2.slug)>=0;
    lb.innerHTML='<input type="checkbox" '+(checked?"checked":"")+' style="width:auto">'+esc(en2.name);
    lb.querySelector("input").addEventListener("change",function(e){ post.ai.entities=post.ai.entities||[]; var a=post.ai.entities,i=a.indexOf(en2.slug); if(e.target.checked){if(i<0)a.push(en2.slug);}else{if(i>=0)a.splice(i,1);} renderAll();scheduleDraft(); });
    entBox.appendChild(lb);
  });
  entWrap.appendChild(entBox);p.appendChild(entWrap);
  post.faqs=post.faqs||[];
  p.appendChild(listEditor("Câu hỏi thường gặp (FAQ của bài)", post.faqs, function(it){return it.q;},
    [{k:"q",l:"Câu hỏi"},{k:"a",l:"Trả lời",textarea:true,rows:2}],
    {addLabel:"Thêm câu hỏi", add:function(){post.faqs.push({q:"Câu hỏi mới",a:""});}}));

  // --- Lịch sử phiên bản (Phase 3.6) ---
  if(post.history && post.history.length){
    p.appendChild(h2("Lịch sử phiên bản ("+post.history.length+")"));
    p.appendChild(hint("Mỗi lần lưu tạo một bản. Không xóa bản cũ; có thể khôi phục lại tiêu đề và nội dung của bản bất kỳ."));
    var vlist=document.createElement("div");
    post.history.slice().reverse().forEach(function(hentry){
      var row=document.createElement("div");row.className="card-block";row.style.cssText="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 15px";
      row.innerHTML='<span style="font-size:12.5px;color:var(--text-mid)">v'+hentry.version+' · '+esc(new Date(hentry.at).toLocaleString("vi-VN"))+' · '+esc(String(hentry.title||"").slice(0,42))+'</span>';
      var rb=document.createElement("button");rb.className="abtn";rb.style.cssText="padding:6px 12px;font-size:12px";rb.textContent="Khôi phục";
      rb.onclick=function(){ if(confirm("Khôi phục phiên bản v"+hentry.version+"?")){ post.title=hentry.title; post.body=hentry.body; scheduleDraft(); toast("Đã khôi phục v"+hentry.version); editPost(post); } };
      row.appendChild(rb);vlist.appendChild(row);
    });
    p.appendChild(vlist);
  }

  var save=document.createElement("button");save.className="btn btn-primary";save.style.marginTop="10px";save.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg> Lưu bài & về danh sách';
  save.onclick=function(){ post.body=sanitize(ed.innerHTML,"post"); if(!post.excerpt)post.excerpt=stripTags(post.body).slice(0,140); snapshotVersion(post); renderAll();scheduleDraft();toast("Đã lưu bài (v"+post.version+"). Xuất bản site để đăng lên mạng."); renderPanel(); };
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
function exportHTML(){
  var jsonSafe=JSON.stringify(content).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026");
  var out=SHELL.replace(/(<script id="site-content" type="application\/json">)[\s\S]*?(<\/script>)/, function(_,a,z){ return a+jsonSafe+z; });
  // Nhúng SEO/OG vào <head> để trình quét (Zalo/Facebook) đọc được mà không cần chạy JS
  var s=content.settings, seo=s.seo||{}, h=content.hero;
  var t=(seo.title||(String(s.brandName||"HuyData")+" — "+stripTags(sanitize(h.title,"inline")))).trim();
  var d=(seo.description||h.sub||"").trim();
  var img=(seo.ogImage||"").trim();
  function attr(v){ return String(v||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function setContent(id,val){ out=out.replace(new RegExp('(<[^>]*id="'+id+'"[^>]*content=")[^"]*(")'), '$1'+attr(val)+'$2'); }
  out=out.replace(/(<title id="page-title">)[\s\S]*?(<\/title>)/, '$1'+attr(t)+'$2');
  setContent("meta-desc",d); setContent("og-title",t); setContent("og-desc",d);
  setContent("tw-title",t); setContent("tw-desc",d);
  if(img){ setContent("og-img",img); setContent("tw-img",img); }
  download("HuyData_Website.html",out,"text/html");
  toast("Đã tải file trang. Tải file này lên hosting để xuất bản.");
}

// Đóng gói toàn bộ site tĩnh (Phase 3.4): index.html + css/js + data/*.json (từ nội dung
// hiện tại) + sitemap.xml + rss.xml + robots.txt + trang HTML tĩnh cho mỗi bài -> .zip.
async function publishSite(){
  if(!window.SEO || !window.Zip){ toast("Thiếu module SEO/Zip"); return; }
  try{
    toast("Đang đóng gói site…");
    var files={};
    var assets=["index.html","404.html",".nojekyll","css/main.css",
      "js/backend-adapter.js","js/data-service.js","js/search.js","js/blog.js","js/router.js","js/seo.js","js/app.js",
      "js/dashboard.js","js/zip.js"];
    for(var i=0;i<assets.length;i++){
      var res=await fetch(assets[i],{cache:"no-cache"});
      if(!res.ok) throw new Error(assets[i]+" "+res.status);
      files[assets[i]]=new Uint8Array(await res.arrayBuffer());
    }
    // data/*.json từ nội dung hiện tại (nguồn dữ liệu của SPA sau khi deploy)
    files["data/config.json"]=JSON.stringify(content.settings,null,2);
    files["data/content.json"]=JSON.stringify({hero:content.hero,pain:content.pain,why:content.why,solutions:content.solutions,decision:content.decision,who:content.who,privacy:content.privacy,about:content.about,contact:content.contact,pricing:content.pricing,faq:content.faq},null,2);
    files["data/products.json"]=JSON.stringify(content.products,null,2);
    files["data/posts.json"]=JSON.stringify(content.blog,null,2);
    files["data/categories.json"]=JSON.stringify(content.categories||[],null,2);
    files["data/tags.json"]=JSON.stringify(content.tags||[],null,2);
    files["data/entities.json"]=JSON.stringify(content.entities||[],null,2);
    files["data/users.json"]=JSON.stringify(content.users||[],null,2);
    files["data/media.json"]=JSON.stringify(content.media||[],null,2);
    // SEO
    files["sitemap.xml"]=SEO.buildSitemap();
    files["rss.xml"]=SEO.buildRSS();
    files["robots.txt"]=SEO.buildRobots();
    // trang HTML tĩnh cho mỗi bài đã xuất bản
    var contentJson=JSON.stringify(content);
    DataService.getPublishedPosts().forEach(function(p){
      files[SEO.postPath(p)+"index.html"]=SEO.buildPostPage(p, contentJson);
    });
    var blob=Zip.build(files);
    download2("HuyData_site.zip", blob);
    toast("Đã đóng gói site (.zip) — giải nén rồi tải cả thư mục lên GitHub Pages.");
  }catch(e){ toast("Lỗi đóng gói: "+((e&&e.message)||e)); if(window.console) console.error("[publishSite]",e); }
}
function download2(name, blob){
  var url=URL.createObjectURL(blob);
  var a=document.createElement("a"); a.href=url; a.download=name; document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(url); a.remove(); },600);
}
// Backup Markdown (Phase 3.6): mỗi bài một file .md + kèm noi-dung.json, gói .zip.
function htmlToMarkdown(html){
  var d=document.createElement("div"); d.innerHTML=html||""; var out=[];
  function walk(node){
    Array.prototype.forEach.call(node.childNodes,function(ch){
      if(ch.nodeType===3){ out.push(ch.textContent); return; }
      if(ch.nodeType!==1) return;
      var t=ch.tagName;
      if(t==="H2") out.push("\n## "+ch.textContent+"\n");
      else if(t==="H3") out.push("\n### "+ch.textContent+"\n");
      else if(t==="P") out.push("\n"+ch.textContent+"\n");
      else if(t==="UL"||t==="OL"){ out.push("\n"); Array.prototype.forEach.call(ch.querySelectorAll("li"),function(li,i){ out.push((t==="OL"?(i+1)+". ":"- ")+li.textContent+"\n"); }); }
      else if(t==="BLOCKQUOTE") out.push("\n> "+ch.textContent+"\n");
      else if(t==="BR") out.push("\n");
      else walk(ch);
    });
  }
  walk(d);
  return out.join("").replace(/\n{3,}/g,"\n\n").trim();
}
function postToMarkdown(p){
  var L=["# "+(p.title||""),""];
  var meta=[];
  if(p.category) meta.push("category: "+p.category);
  if(p.tags&&p.tags.length) meta.push("tags: "+p.tags.join(", "));
  if(p.date) meta.push("date: "+p.date);
  meta.push("status: "+postStatus(p));
  L.push("> "+meta.join(" · "),"");
  if(p.excerpt) L.push("_"+p.excerpt+"_","");
  L.push(htmlToMarkdown(p.body||""));
  if(p.faqs&&p.faqs.length){ L.push("","## Câu hỏi thường gặp"); p.faqs.forEach(function(f){ L.push("","**"+f.q+"**","",f.a); }); }
  return L.join("\n")+"\n";
}
function exportMarkdown(){
  if(!window.Zip){ toast("Thiếu module Zip"); return; }
  var files={}; var posts=(content.blog&&content.blog.posts)||[];
  posts.forEach(function(p){ files["posts/"+(p.slug||p.id||"bai")+".md"]=postToMarkdown(p); });
  files["noi-dung.json"]=JSON.stringify(content,null,2);
  download2("HuyData_backup_markdown.zip", Zip.build(files));
  toast("Đã tải backup Markdown (.zip)");
}

// Bảo vệ nội dung (Phase 3.7): khi copy trong bài tự thêm nguồn; chặn kéo/menu ảnh.
// Không ảnh hưởng SEO (bot không chạy các trình xử lý này; văn bản vẫn nằm trong DOM).
function setupProtect(){
  var s=DataService.getSettings();
  if(s && s.protect===false) return;
  document.addEventListener("copy", function(e){
    try{
      var sel=window.getSelection(); if(!sel||sel.isCollapsed) return;
      var art=document.getElementById("pv-article"); if(!art) return;
      var node=sel.anchorNode; node=node&&(node.nodeType===1?node:node.parentNode);
      if(!node||!art.contains(node)) return;
      var text=sel.toString(); if(text.length<40) return;
      var title=(art.querySelector("h1")||{}).textContent||"";
      var brand=(DataService.getSettings().brandName||"HuyData");
      var note=text+"\n\n— Nguồn: "+title+" · "+brand+"\n"+location.href;
      if(e.clipboardData){ e.clipboardData.setData("text/plain", note); e.preventDefault(); }
    }catch(err){}
  });
  document.addEventListener("contextmenu", function(e){
    var pv=document.getElementById("postview");
    if(pv && pv.classList.contains("open") && e.target && e.target.tagName==="IMG"){ e.preventDefault(); }
  });
  document.addEventListener("dragstart", function(e){
    if(e.target && e.target.tagName==="IMG" && e.target.closest && e.target.closest("#pv-article")){ e.preventDefault(); }
  });
}
setupProtect();

/* Đọc ?q= (khớp SearchAction JSON-LD): mở trang với sẵn từ khóa tìm trong Thư viện */
(function(){ try{ var m=(location.search||"").match(/[?&]q=([^&]*)/); if(m){ blogQuery=decodeURIComponent(m[1].replace(/\+/g," ")); } }catch(e){} })();

/* Boot (Phase 3.1): vẽ ngay từ dữ liệu đang có (giữ đúng hành vi trước đó),
   sau đó nạp lớp dữ liệu tĩnh data/*.json ở nền qua DataService, và chỉ vẽ lại
   nếu nội dung thực sự khác — tránh mọi nhấp nháy khi hai nguồn trùng nhau. */
renderAll();
route();
if (window.DataService && DataService.load) {
  DataService.load().then(function(model){
    if (JSON.stringify(model) !== JSON.stringify(content)) {
      content = model;
      renderAll();
      route();
    }
  }).catch(function(e){ if(window.console) console.warn("[DataService] bỏ qua nạp dữ liệu:", e && e.message); });
}
