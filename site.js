(function () {
  "use strict";

  const content = window.BAAN_CONTENT;
  const supportedLanguages = ["th", "en", "zh"];
  const text = {
    th: {
      "nav.home": "หน้าแรก",
      "nav.articles": "เรื่องขนม",
      "nav.products": "เมนูทั้งหมด",
      "nav.contact": "ติดต่อเรา",
      "nav.menu": "เปิดเมนู",
      "common.latest": "เรื่องล่าสุด",
      "common.recommended": "เมนูแนะนำ",
      "common.read": "อ่านต่อ",
      "common.allProducts": "ดูสินค้าทั้งหมด",
      "common.allArticles": "อ่านเรื่องทั้งหมด",
      "common.priceFrom": "เริ่มต้น",
      "common.currency": "บาท",
      "common.comingSoon": "ระบบสั่งซื้อกำลังเตรียมการ",
      "common.askShop": "สอบถามร้าน",
      "common.date": "เผยแพร่",
      "home.heroEyebrow": "ขนมอบสดใหม่จากหน้าร้าน",
      "home.heroTitle": "ขนมชิ้นเล็กที่ทำให้วันธรรมดาอบอวลขึ้น",
      "home.heroCopy": "ทาร์ตผลไม้ เค้กครีมสด คัสตาร์ดถ้วย และพายอบ ทำเป็นถาดเล็กและพร้อมให้สอบถามผ่าน TikTok",
      "home.heroProducts": "ดูเมนูเด่น",
      "home.heroSocial": "ติดตามร้าน",
      "home.scrollCue": "เลื่อนลงเพื่อชมเรื่องราว",
      "home.manifestoEyebrow": "ความอบอุ่นเล็ก ๆ จากหน้าร้าน",
      "home.manifestoTitle": "อบเป็นถาดเล็ก แล้วเลือกความสดใสทีละชิ้น",
      "home.manifestoCopy": "เมนูอาจเปลี่ยนไปในแต่ละวัน แต่ความตั้งใจยังเหมือนเดิม: ขนมที่เข้าถึงง่าย ผลไม้สด และตู้ขนมที่ชวนให้หยุดมอง",
      "home.freshTitle": "ทำสดเป็นถาดเล็ก",
      "home.freshCopy": "สินค้าอาจเปลี่ยนตามวัน กรุณาสอบถามสต็อกจริงกับร้าน",
      "home.trilingualTitle": "อ่านได้ 3 ภาษา",
      "home.trilingualCopy": "ไทย English 中文 เลือกภาษาได้จากด้านบน",
      "home.reserveTitle": "สอบถามก่อนเดินทาง",
      "home.reserveCopy": "ใช้ TikTok เพื่อตรวจสอบสินค้าและเวลารับ",
      "home.featuredEyebrow": "เลือกจากหน้าร้าน",
      "home.featuredTitle": "เมนูที่อยากแนะนำวันนี้",
      "home.featuredCopy": "สินค้าจริงจากตู้ขนม พร้อมภาพและรายละเอียดที่ค้นหาได้ง่าย",
      "home.showcaseScroll": "เลื่อนลงเพื่อทำความรู้จักขนมทีละชิ้นจากหน้าร้าน",
      "home.productDetail": "ดูในเมนูสินค้า",
      "home.videoEyebrow": "บรรยากาศจริง",
      "home.videoTitle": "ดูขนมใกล้ ๆ ก่อนทักร้าน",
      "home.videoCopy": "วิดีโอสั้นจากร้านช่วยให้เห็นขนาด สี และบรรยากาศของขนมจริง",
      "home.videoFallback": "เบราว์เซอร์นี้ไม่รองรับวิดีโอ",
      "home.articleEyebrow": "เรื่องล่าสุด",
      "home.articleTitle": "อ่านเบื้องหลังเมนูแนะนำ",
      "home.articleCopy": "เรื่องล่าสุดจะแสดงบนหน้าแรกเสมอ แล้วเก็บรวมไว้ในหน้าเรื่องขนม",
      "home.socialEyebrow": "ติดตามและสอบถาม",
      "home.socialTitle": "พบกับบ้านอบอวลบนโซเชียล",
      "home.socialCopy": "ดูสินค้าใหม่ บรรยากาศหน้าร้าน และสอบถามสต็อกผ่านช่องทางของร้าน",
      "articles.eyebrow": "บันทึกจากครัวและหน้าร้าน",
      "articles.title": "เรื่องขนม เมนูใหม่ และรายละเอียดที่อยากเล่า",
      "articles.copy": "รวมบทความแนะนำสินค้าและข่าวจากบ้านอบอวล เรื่องล่าสุดจะปรากฏบนหน้าแรกด้วย",
      "products.eyebrow": "เมนูสำหรับค้นหา",
      "products.title": "ขนมทั้งหมดจากบ้านอบอวล",
      "products.copy": "หน้านี้ใช้สำหรับดูรายละเอียดและค้นหาสินค้า ระบบตะกร้ากำลังเตรียมการ กรุณาสอบถามสต็อกและราคากับร้าน",
      "products.noticeTitle": "หน้าสินค้าสำหรับดูข้อมูลก่อน",
      "products.noticeCopy": "ปุ่มสั่งซื้อยังไม่เปิดใช้งาน เพราะร้านยังไม่ได้เริ่มระบบอีคอมเมิร์ซ สามารถส่งชื่อสินค้าที่สนใจให้ร้านทาง TikTok ได้",
      "filter.all": "ทั้งหมด",
      "filter.cake": "เค้กและทาร์ต",
      "filter.pastry": "ขนมอบ",
      "filter.gift": "ของฝาก",
      "contact.eyebrow": "ติดต่อเรา",
      "contact.title": "ถามสินค้า ส่งคำแนะนำ หรือบอกสิ่งที่คุณกำลังมองหา",
      "contact.copy": "สำหรับสต็อกและการจอง กรุณาติดต่อร้านผ่านช่องทางโซเชียล สำหรับความคิดเห็นเว็บไซต์ สามารถกรอกข้อความด้านล่างแล้วคัดลอกไปส่งได้",
      "contact.socialTitle": "ช่องทางของร้าน",
      "contact.feedbackTitle": "ความคิดเห็นและคำแนะนำ",
      "contact.feedbackCopy": "แบบฟอร์มนี้จะจัดข้อความและคัดลอกให้คุณ ข้อมูลจะไม่ถูกส่งหรือเก็บบนเว็บไซต์",
      "form.name": "ชื่อ",
      "form.contact": "ช่องทางติดต่อกลับ",
      "form.topic": "หัวข้อ",
      "form.message": "ข้อความ",
      "form.submit": "คัดลอกข้อความ",
      "form.topicProduct": "สอบถามสินค้า",
      "form.topicWebsite": "แนะนำเว็บไซต์",
      "form.topicOther": "เรื่องอื่น ๆ",
      "footer.copy": "ขนมอบชิ้นเล็ก ทำสด และเรื่องราวจากหน้าร้าน",
      "footer.admin": "จัดการเว็บไซต์"
    },
    en: {
      "nav.home": "Home",
      "nav.articles": "Stories",
      "nav.products": "Products",
      "nav.contact": "Contact",
      "nav.menu": "Open menu",
      "common.latest": "Latest story",
      "common.recommended": "Recommended",
      "common.read": "Read story",
      "common.allProducts": "View all products",
      "common.allArticles": "View all stories",
      "common.priceFrom": "From",
      "common.currency": "THB",
      "common.comingSoon": "Online ordering is coming soon",
      "common.askShop": "Ask the shop",
      "common.date": "Published",
      "home.heroEyebrow": "Fresh from the bakery counter",
      "home.heroTitle": "Small sweets that make an ordinary day feel warmer",
      "home.heroCopy": "Fruit tarts, fresh cream cakes, custard cups, and golden pastries made in small batches and available to ask about on TikTok.",
      "home.heroProducts": "See featured products",
      "home.heroSocial": "Follow the shop",
      "home.scrollCue": "Scroll to explore",
      "home.manifestoEyebrow": "A little warmth from the counter",
      "home.manifestoTitle": "Baked in small batches. Chosen one colorful piece at a time.",
      "home.manifestoCopy": "The selection changes with the day, but the idea stays simple: approachable sweets, fresh fruit, and a counter worth stopping for.",
      "home.freshTitle": "Made in small batches",
      "home.freshCopy": "The selection can change daily. Please confirm availability with the shop.",
      "home.trilingualTitle": "Three languages",
      "home.trilingualCopy": "Read in Thai, English, or Chinese using the switch above.",
      "home.reserveTitle": "Ask before visiting",
      "home.reserveCopy": "Use TikTok to confirm the selection and pickup time.",
      "home.featuredEyebrow": "From the counter",
      "home.featuredTitle": "Today’s recommended sweets",
      "home.featuredCopy": "Real counter products with clear photos and searchable details.",
      "home.showcaseScroll": "Scroll to meet each sweet, one tray at a time.",
      "home.productDetail": "View in product menu",
      "home.videoEyebrow": "The real counter",
      "home.videoTitle": "See the sweets up close before messaging",
      "home.videoCopy": "A short shop video gives a better sense of the real size, color, and counter atmosphere.",
      "home.videoFallback": "Your browser does not support this video.",
      "home.articleEyebrow": "Latest story",
      "home.articleTitle": "Read the story behind a featured sweet",
      "home.articleCopy": "The newest product story appears on the homepage and remains available in the story archive.",
      "home.socialEyebrow": "Follow and ask",
      "home.socialTitle": "Find Baan Ob Auan on social media",
      "home.socialCopy": "See new sweets, counter updates, and ask about availability through the shop’s channels.",
      "articles.eyebrow": "Notes from the kitchen and counter",
      "articles.title": "Product stories, new sweets, and details worth sharing",
      "articles.copy": "Browse Baan Ob Auan product features and shop updates. The newest story also appears on the homepage.",
      "products.eyebrow": "A menu made for discovery",
      "products.title": "All sweets from Baan Ob Auan",
      "products.copy": "Browse and search product details here. Cart checkout is still in preparation; please confirm availability and pricing with the shop.",
      "products.noticeTitle": "A product catalogue for now",
      "products.noticeCopy": "Ordering buttons are disabled while the shop prepares for ecommerce. Send the product name to the shop on TikTok to ask about it.",
      "filter.all": "All",
      "filter.cake": "Cakes and tarts",
      "filter.pastry": "Pastries",
      "filter.gift": "Gift boxes",
      "contact.eyebrow": "Contact us",
      "contact.title": "Ask about a sweet, share feedback, or tell us what you are looking for",
      "contact.copy": "For availability and reservations, contact the shop through social media. For website feedback, format and copy a message below.",
      "contact.socialTitle": "Shop channels",
      "contact.feedbackTitle": "Feedback and suggestions",
      "contact.feedbackCopy": "This form formats and copies your message. The website does not send or store your information.",
      "form.name": "Name",
      "form.contact": "Reply contact",
      "form.topic": "Topic",
      "form.message": "Message",
      "form.submit": "Copy feedback",
      "form.topicProduct": "Product question",
      "form.topicWebsite": "Website suggestion",
      "form.topicOther": "Other",
      "footer.copy": "Small-batch sweets and stories from the bakery counter.",
      "footer.admin": "Site manager"
    },
    zh: {
      "nav.home": "首頁",
      "nav.articles": "甜點介紹",
      "nav.products": "商品頁",
      "nav.contact": "聯絡我們",
      "nav.menu": "開啟選單",
      "common.latest": "最新介紹",
      "common.recommended": "主推商品",
      "common.read": "閱讀全文",
      "common.allProducts": "查看全部商品",
      "common.allArticles": "查看全部介紹",
      "common.priceFrom": "參考價",
      "common.currency": "泰銖",
      "common.comingSoon": "線上購物功能籌備中",
      "common.askShop": "向店家詢問",
      "common.date": "發布日期",
      "home.heroEyebrow": "店面新鮮出爐",
      "home.heroTitle": "讓平常日子也充滿香氣的小甜點",
      "home.heroCopy": "水果塔、鮮奶油小蛋糕、布丁杯與金黃派點，每日少量製作，可透過 TikTok 向店家詢問。",
      "home.heroProducts": "查看主推商品",
      "home.heroSocial": "追蹤店家",
      "home.scrollCue": "向下滾動，開始探索",
      "home.manifestoEyebrow": "來自甜點櫃的一點溫暖",
      "home.manifestoTitle": "每日少量烘焙，一次挑選一份繽紛",
      "home.manifestoCopy": "每天的品項可能不同，但想法一直很簡單：親切的小甜點、新鮮水果，以及值得停下腳步細看的甜點櫃。",
      "home.freshTitle": "每日少量製作",
      "home.freshCopy": "供應品項可能每天不同，請向店家確認當日庫存。",
      "home.trilingualTitle": "支援三種語言",
      "home.trilingualCopy": "可從上方切換泰文、英文與中文閱讀。",
      "home.reserveTitle": "前往前先詢問",
      "home.reserveCopy": "透過 TikTok 確認品項與方便取貨的時間。",
      "home.featuredEyebrow": "店面精選",
      "home.featuredTitle": "今天想推薦給你的甜點",
      "home.featuredCopy": "以真實櫃檯商品為主，搭配清楚照片與方便搜尋的介紹。",
      "home.showcaseScroll": "繼續向下滑，一份一份認識今天的主推甜點。",
      "home.productDetail": "前往商品頁查看",
      "home.videoEyebrow": "真實店面氛圍",
      "home.videoTitle": "私訊前，先近距離看看甜點",
      "home.videoCopy": "短影片呈現商品實際大小、色澤與甜點櫃的現場感。",
      "home.videoFallback": "你的瀏覽器不支援播放這段影片。",
      "home.articleEyebrow": "最新介紹",
      "home.articleTitle": "閱讀主推甜點背後的故事",
      "home.articleCopy": "最新一篇商品介紹會顯示在首頁，之後也會保留在甜點介紹頁中。",
      "home.socialEyebrow": "追蹤與詢問",
      "home.socialTitle": "在社群上找到บ้านอบอวล",
      "home.socialCopy": "查看新品、店面近況，並透過店家的社群管道詢問當日供應。",
      "articles.eyebrow": "來自廚房與甜點櫃的筆記",
      "articles.title": "甜點介紹、新品消息，以及值得慢慢說的細節",
      "articles.copy": "收錄บ้านอบอวล的商品介紹與店面消息；最新文章也會同步出現在首頁。",
      "products.eyebrow": "方便搜尋的線上菜單",
      "products.title": "บ้านอบอวล 全部甜點商品",
      "products.copy": "目前可瀏覽與搜尋商品資料，購物車仍在籌備中；實際庫存與售價請向店家確認。",
      "products.noticeTitle": "目前先作為商品型錄",
      "products.noticeCopy": "店家尚未開始經營電商，因此訂購按鈕暫不開放。可以記下商品名稱，再到 TikTok 私訊詢問。",
      "filter.all": "全部",
      "filter.cake": "蛋糕與水果塔",
      "filter.pastry": "派點與烘焙",
      "filter.gift": "禮盒",
      "contact.eyebrow": "聯絡我們",
      "contact.title": "詢問商品、提供建議，或告訴店家你正在找什麼",
      "contact.copy": "庫存與預留請透過社群聯絡店家；網站或商品意見可在下方整理成訊息後複製傳送。",
      "contact.socialTitle": "店家社群管道",
      "contact.feedbackTitle": "意見與回饋",
      "contact.feedbackCopy": "表單只會替你整理並複製文字，網站不會自動傳送或儲存個人資料。",
      "form.name": "姓名",
      "form.contact": "方便回覆的聯絡方式",
      "form.topic": "主題",
      "form.message": "想說的內容",
      "form.submit": "複製回饋內容",
      "form.topicProduct": "商品詢問",
      "form.topicWebsite": "網站建議",
      "form.topicOther": "其他",
      "footer.copy": "每日少量製作，把甜點櫃與新鮮故事帶到線上。",
      "footer.admin": "網站管理"
    }
  };

  const pageSeo = {
    home: {
      th: ["บ้านอบอวล | Baan Ob Auan", "ขนมอบสดใหม่ ทาร์ตผลไม้ เค้กครีมสด และพายจากบ้านอบอวล ดูเมนูเด่นและติดต่อร้านผ่าน TikTok"],
      en: ["Baan Ob Auan | Fresh cakes and fruit tarts", "Discover fresh fruit tarts, cream cakes, custard cups, and pastries from Baan Ob Auan."],
      zh: ["บ้านอบอวล | Baan Ob Auan 新鮮蛋糕與水果塔", "查看บ้านอบอวล的主推水果塔、鮮奶油小蛋糕、布丁杯與派點，並從社群聯絡店家。"]
    },
    articles: {
      th: ["เรื่องขนม | บ้านอบอวล", "อ่านเรื่องราว เมนูใหม่ และรายละเอียดขนมจากบ้านอบอวล"],
      en: ["Bakery stories | Baan Ob Auan", "Read product stories, new menu notes, and bakery updates from Baan Ob Auan."],
      zh: ["甜點介紹 | บ้านอบอวล", "閱讀บ้านอบอวล的新品介紹、主打甜點故事與店面更新。"]
    },
    products: {
      th: ["เมนูขนม | บ้านอบอวล", "รวมทาร์ตผลไม้ เค้กครีมสด คัสตาร์ด และพายอบจากบ้านอบอวล"],
      en: ["Cake and pastry menu | Baan Ob Auan", "Browse fruit tarts, cream cakes, custard cups, and pastries from Baan Ob Auan."],
      zh: ["商品與甜點菜單 | บ้านอบอวล", "瀏覽水果塔、鮮奶油小蛋糕、布丁杯與各式派點；實際供應請向店家確認。"]
    },
    contact: {
      th: ["ติดต่อบ้านอบอวล", "ติดต่อ สอบถามสินค้า และส่งความคิดเห็นถึงบ้านอบอวล"],
      en: ["Contact Baan Ob Auan", "Contact the bakery, ask about products, or share feedback with Baan Ob Auan."],
      zh: ["聯絡บ้านอบอวล", "聯絡店家、詢問甜點供應，或將網站與商品意見回饋給บ้านอบอวล。"]
    }
  };

  let language = initialLanguage();

  function initialLanguage() {
    const saved = localStorage.getItem("baan-language");
    if (supportedLanguages.includes(saved)) return saved;
    const browser = (navigator.language || "th").toLowerCase();
    if (browser.startsWith("zh")) return "zh";
    if (browser.startsWith("en")) return "en";
    return "th";
  }

  function t(key) {
    return text[language]?.[key] || text.en[key] || key;
  }

  function localize(value) {
    if (typeof value === "string") return value;
    return value?.[language] || value?.en || value?.th || value?.zh || "";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function money(value) {
    return new Intl.NumberFormat(language === "zh" ? "zh-TW" : language === "en" ? "en-US" : "th-TH", {
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function date(value) {
    const locale = language === "zh" ? "zh-TW" : language === "en" ? "en-GB" : "th-TH";
    return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(
      new Date(`${value}T12:00:00`)
    );
  }

  function enabledSocials() {
    return content.site.socials.filter((social) => social.enabled && social.url);
  }

  function socialCards() {
    return enabledSocials()
      .map((social) => `
        <a class="social-link" href="${escapeHtml(social.url)}" target="_blank" rel="noreferrer">
          <span class="social-network">${escapeHtml(social.network)}</span>
          <strong>${escapeHtml(localize(social.label))}</strong>
          <span aria-hidden="true">↗</span>
        </a>
      `)
      .join("");
  }

  function setLanguage(next) {
    if (!supportedLanguages.includes(next)) return;
    language = next;
    localStorage.setItem("baan-language", language);
    document.documentElement.lang = language === "zh" ? "zh-Hant" : language;
    document.querySelectorAll("[data-t]").forEach((node) => {
      node.textContent = t(node.dataset.t);
    });
    document.querySelectorAll("[data-lang]").forEach((button) => {
      const active = button.dataset.lang === language;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    applySeo();
    document.dispatchEvent(new CustomEvent("baan:langchange"));
  }

  function applySeo() {
    const page = document.body.dataset.page || "home";
    const values = pageSeo[page]?.[language];
    if (!values) return;
    document.title = values[0];
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = values[1];
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.content = values[0];
    if (ogDescription) ogDescription.content = values[1];
  }

  function installShell() {
    const page = document.body.dataset.page || "home";
    const header = document.querySelector("#site-header");
    const footer = document.querySelector("#site-footer");
    if (header) {
      header.innerHTML = `
        <a class="brand" href="index.html" aria-label="${escapeHtml(content.site.name)}">
          <span class="brand-mark" aria-hidden="true">อบ</span>
          <span class="brand-copy"><strong>บ้านอบอวล</strong><small>Baan Ob Auan</small></span>
        </a>
        <button class="menu-button" type="button" aria-expanded="false" aria-controls="primary-nav"><span data-t="nav.menu">Open menu</span></button>
        <nav class="nav-links" id="primary-nav" aria-label="Primary navigation">
          <a href="index.html"${page === "home" ? ' aria-current="page"' : ""} data-t="nav.home">Home</a>
          <a href="articles.html"${page === "articles" || page === "article" ? ' aria-current="page"' : ""} data-t="nav.articles">Stories</a>
          <a href="products.html"${page === "products" ? ' aria-current="page"' : ""} data-t="nav.products">Products</a>
          <a href="contact.html"${page === "contact" ? ' aria-current="page"' : ""} data-t="nav.contact">Contact</a>
        </nav>
        <div class="language-switch" aria-label="Language">
          <button type="button" data-lang="th">ไทย</button>
          <button type="button" data-lang="en">EN</button>
          <button type="button" data-lang="zh">中文</button>
        </div>
      `;
      header.querySelector(".menu-button").addEventListener("click", (event) => {
        const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
        event.currentTarget.setAttribute("aria-expanded", String(!expanded));
        header.querySelector(".nav-links").classList.toggle("open", !expanded);
      });
      header.querySelectorAll("[data-lang]").forEach((button) => {
        button.addEventListener("click", () => setLanguage(button.dataset.lang));
      });
    }
    if (footer) {
      footer.innerHTML = `
        <div><strong>${escapeHtml(content.site.name)}</strong><span data-t="footer.copy">Small-batch sweets and stories from the bakery counter.</span></div>
        <div class="footer-links">${socialCards()}<a class="admin-link" href="admin.html" rel="nofollow" data-t="footer.admin">Site manager</a></div>
      `;
    }
  }

  function installStructuredData() {
    if (document.querySelector("#business-schema")) return;
    const script = document.createElement("script");
    script.id = "business-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Bakery",
      name: content.site.name,
      image: new URL("assets/hero-small-products.png", location.href).href,
      sameAs: enabledSocials().map((social) => social.url),
      hasMenu: new URL("products.html", location.href).href
    });
    document.head.append(script);
  }

  installShell();
  installStructuredData();
  setLanguage(language);

  window.Baan = {
    content,
    t,
    localize,
    escapeHtml,
    money,
    date,
    socialCards,
    get language() {
      return language;
    }
  };
})();
