(function () {
  "use strict";

  const clone = (value) => JSON.parse(JSON.stringify(value));
  let data = clone(window.BAAN_CONTENT);
  let remoteSha = "";
  let selectedProductId = data.products[0]?.id || "";
  let selectedArticleId = data.articles[0]?.id || "";
  const pendingUploads = new Map();

  const $ = (selector) => document.querySelector(selector);
  const status = $("#admin-status");
  const connectionState = $("#connection-state");
  const productForm = $("#product-form");
  const articleForm = $("#article-form");

  function setStatus(message, type = "info") {
    status.textContent = message;
    status.dataset.type = type;
    status.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function config() {
    return {
      owner: $("#github-owner").value.trim(),
      repo: $("#github-repo").value.trim(),
      branch: $("#github-branch").value.trim() || "main",
      token: $("#github-token").value.trim()
    };
  }

  async function github(path, options = {}) {
    const { owner, repo, token } = config();
    if (!owner || !repo || !token) throw new Error("請先填入 GitHub repository 與權杖。");
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
      ...options,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(options.headers || {})
      }
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(detail.message || `GitHub 回應錯誤 ${response.status}`);
    }
    return response.json();
  }

  function decodeBase64(value) {
    const binary = atob(value.replace(/\s/g, ""));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function encodeBase64(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  function parseContentJs(source) {
    const match = source.match(/^window\.BAAN_CONTENT\s*=\s*([\s\S]*);\s*$/);
    if (!match) throw new Error("content.js 格式無法辨識。");
    return JSON.parse(match[1]);
  }

  function serializeContentJs() {
    data.updatedAt = new Date().toISOString();
    return `window.BAAN_CONTENT = ${JSON.stringify(data, null, 2)};\n`;
  }

  function sanitizeFileName(name) {
    const dot = name.lastIndexOf(".");
    const extension = dot >= 0 ? name.slice(dot).toLowerCase() : ".jpg";
    const stem = (dot >= 0 ? name.slice(0, dot) : name)
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "image";
    return `${Date.now()}-${stem}${extension}`;
  }

  function stageImage(file, previousPath) {
    if (!file) return previousPath;
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) throw new Error("圖片只支援 JPG、PNG 或 WebP。");
    if (file.size > 8 * 1024 * 1024) throw new Error("圖片需小於 8 MB。");
    if (pendingUploads.has(previousPath)) pendingUploads.delete(previousPath);
    const path = `assets/uploads/${sanitizeFileName(file.name)}`;
    pendingUploads.set(path, file);
    return path;
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = () => reject(new Error(`無法讀取圖片 ${file.name}`));
      reader.readAsDataURL(file);
    });
  }

  function renderSocials() {
    $("#social-settings").innerHTML = data.site.socials.map((social) => `
      <div class="social-setting" data-social-id="${social.id}">
        <div><strong>${social.network}</strong><small>${social.id}</small></div>
        <label><span>網址</span><input name="url" type="url" value="${escapeAttr(social.url)}" placeholder="https://..."></label>
        <label class="check-field"><input name="enabled" type="checkbox" ${social.enabled ? "checked" : ""}><span>顯示</span></label>
      </div>
    `).join("");
  }

  function escapeAttr(value) {
    return String(value || "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }

  function saveSocials() {
    document.querySelectorAll("[data-social-id]").forEach((row) => {
      const social = data.site.socials.find((item) => item.id === row.dataset.socialId);
      if (!social) return;
      social.url = row.querySelector('[name="url"]').value.trim();
      social.enabled = row.querySelector('[name="enabled"]').checked && Boolean(social.url);
    });
  }

  function renderProductSelect() {
    $("#product-select").innerHTML = data.products.map((product) => `<option value="${escapeAttr(product.id)}">${escapeAttr(product.name.zh || product.name.en || product.id)}</option>`).join("");
    if (!data.products.some((product) => product.id === selectedProductId)) selectedProductId = data.products[0]?.id || "";
    $("#product-select").value = selectedProductId;
    fillProductForm();
  }

  function fillProductForm() {
    const product = data.products.find((item) => item.id === selectedProductId);
    if (!product) {
      productForm.reset();
      return;
    }
    const values = {
      id: product.id, category: product.category, price: product.price, image: product.image,
      nameTh: product.name.th, nameEn: product.name.en, nameZh: product.name.zh,
      badgeTh: product.badge.th, badgeEn: product.badge.en, badgeZh: product.badge.zh,
      descTh: product.desc.th, descEn: product.desc.en, descZh: product.desc.zh
    };
    Object.entries(values).forEach(([name, value]) => { productForm.elements[name].value = value ?? ""; });
    productForm.elements.featured.checked = Boolean(product.featured);
    productForm.elements.imageFile.value = "";
  }

  function saveProduct() {
    if (!productForm.reportValidity()) return false;
    const form = new FormData(productForm);
    const nextId = String(form.get("id")).trim();
    const duplicate = data.products.some((item) => item.id === nextId && item.id !== selectedProductId);
    if (duplicate) throw new Error("商品代碼已存在，請換一個英文代碼。");
    const index = data.products.findIndex((item) => item.id === selectedProductId);
    if (index < 0) throw new Error("找不到目前商品。");
    const current = data.products[index];
    const image = stageImage(productForm.elements.imageFile.files[0], String(form.get("image")).trim());
    data.products[index] = {
      id: nextId,
      category: form.get("category"),
      price: Number(form.get("price")),
      image,
      featured: form.get("featured") === "on",
      badge: { th: form.get("badgeTh"), en: form.get("badgeEn"), zh: form.get("badgeZh") },
      name: { th: form.get("nameTh"), en: form.get("nameEn"), zh: form.get("nameZh") },
      desc: { th: form.get("descTh"), en: form.get("descEn"), zh: form.get("descZh") }
    };
    if (current.id !== nextId) selectedProductId = nextId;
    renderProductSelect();
    setStatus("商品草稿已儲存，尚未發布到 GitHub。", "success");
    updateSummary();
    return true;
  }

  function newProduct() {
    const id = `new-product-${Date.now()}`;
    data.products.unshift({
      id, category: "cake", price: 0, image: "assets/mixed-fruit-tart-ai.png", featured: false,
      badge: { th: "เมนูใหม่", en: "New", zh: "新品" },
      name: { th: "ชื่อสินค้าใหม่", en: "New product", zh: "新商品" },
      desc: { th: "รายละเอียดสินค้า", en: "Product description", zh: "商品介紹" }
    });
    selectedProductId = id;
    renderProductSelect();
    productForm.elements.id.focus();
    setStatus("已建立新商品草稿，請填寫內容後按「儲存商品草稿」。");
  }

  function deleteProduct() {
    const product = data.products.find((item) => item.id === selectedProductId);
    if (!product || !confirm(`確定刪除「${product.name.zh || product.name.en}」？發布後才會從網站移除。`)) return;
    data.products = data.products.filter((item) => item.id !== selectedProductId);
    selectedProductId = data.products[0]?.id || "";
    renderProductSelect();
    updateSummary();
    setStatus("商品已從草稿刪除，尚未發布。", "success");
  }

  function renderArticleSelect() {
    $("#article-select").innerHTML = data.articles.map((article) => `<option value="${escapeAttr(article.id)}">${escapeAttr(article.title.zh || article.title.en || article.id)}</option>`).join("");
    if (!data.articles.some((article) => article.id === selectedArticleId)) selectedArticleId = data.articles[0]?.id || "";
    $("#article-select").value = selectedArticleId;
    fillArticleForm();
  }

  function fillArticleForm() {
    const article = data.articles.find((item) => item.id === selectedArticleId);
    if (!article) {
      articleForm.reset();
      return;
    }
    const values = {
      id: article.id, date: article.date, image: article.image,
      titleTh: article.title.th, titleEn: article.title.en, titleZh: article.title.zh,
      summaryTh: article.summary.th, summaryEn: article.summary.en, summaryZh: article.summary.zh,
      bodyTh: article.body.th.join("\n\n"), bodyEn: article.body.en.join("\n\n"), bodyZh: article.body.zh.join("\n\n")
    };
    Object.entries(values).forEach(([name, value]) => { articleForm.elements[name].value = value ?? ""; });
    articleForm.elements.featured.checked = Boolean(article.featured);
    articleForm.elements.imageFile.value = "";
  }

  function paragraphs(value) {
    return String(value).split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
  }

  function saveArticle() {
    if (!articleForm.reportValidity()) return false;
    const form = new FormData(articleForm);
    const nextId = String(form.get("id")).trim();
    const duplicate = data.articles.some((item) => item.id === nextId && item.id !== selectedArticleId);
    if (duplicate) throw new Error("文章代碼已存在，請換一個英文代碼。");
    const index = data.articles.findIndex((item) => item.id === selectedArticleId);
    if (index < 0) throw new Error("找不到目前文章。");
    const current = data.articles[index];
    const image = stageImage(articleForm.elements.imageFile.files[0], String(form.get("image")).trim());
    data.articles[index] = {
      id: nextId,
      date: form.get("date"),
      featured: form.get("featured") === "on",
      image,
      title: { th: form.get("titleTh"), en: form.get("titleEn"), zh: form.get("titleZh") },
      summary: { th: form.get("summaryTh"), en: form.get("summaryEn"), zh: form.get("summaryZh") },
      body: { th: paragraphs(form.get("bodyTh")), en: paragraphs(form.get("bodyEn")), zh: paragraphs(form.get("bodyZh")) }
    };
    if (current.id !== nextId) selectedArticleId = nextId;
    data.articles.sort((a, b) => b.date.localeCompare(a.date));
    renderArticleSelect();
    setStatus("文章草稿已儲存，尚未發布到 GitHub。", "success");
    updateSummary();
    return true;
  }

  function newArticle() {
    const id = `new-story-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);
    data.articles.unshift({
      id, date: today, featured: false, image: "assets/mixed-fruit-tart-ai.png",
      title: { th: "เรื่องขนมใหม่", en: "New bakery story", zh: "新的甜點介紹" },
      summary: { th: "สรุปเรื่องขนม", en: "A short story summary", zh: "介紹文摘要" },
      body: { th: ["เนื้อหา"], en: ["Article content"], zh: ["文章內容"] }
    });
    selectedArticleId = id;
    renderArticleSelect();
    articleForm.elements.id.focus();
    setStatus("已建立新文章草稿，請填寫後按「儲存文章草稿」。");
  }

  function deleteArticle() {
    const article = data.articles.find((item) => item.id === selectedArticleId);
    if (!article || !confirm(`確定刪除「${article.title.zh || article.title.en}」？發布後才會從網站移除。`)) return;
    data.articles = data.articles.filter((item) => item.id !== selectedArticleId);
    selectedArticleId = data.articles[0]?.id || "";
    renderArticleSelect();
    updateSummary();
    setStatus("文章已從草稿刪除，尚未發布。", "success");
  }

  function updateSummary() {
    $("#publish-summary").innerHTML = `
      <div><strong>${data.products.length}</strong><span>項商品</span></div>
      <div><strong>${data.articles.length}</strong><span>篇介紹文</span></div>
      <div><strong>${data.site.socials.filter((item) => item.enabled && item.url).length}</strong><span>個公開社群連結</span></div>
      <div><strong>${pendingUploads.size}</strong><span>張待上傳圖片</span></div>
    `;
  }

  async function connect() {
    const button = $("#connect-github");
    button.disabled = true;
    setStatus("正在從 GitHub 讀取最新內容…");
    try {
      const { branch } = config();
      const file = await github(`/contents/content.js?ref=${encodeURIComponent(branch)}`);
      data = parseContentJs(decodeBase64(file.content));
      remoteSha = file.sha;
      pendingUploads.clear();
      selectedProductId = data.products[0]?.id || "";
      selectedArticleId = data.articles[0]?.id || "";
      renderAll();
      connectionState.textContent = "已連接";
      connectionState.classList.add("connected");
      setStatus("已讀取 GitHub 上的最新內容，可以開始編輯。", "success");
    } catch (error) {
      connectionState.textContent = "連接失敗";
      connectionState.classList.remove("connected");
      setStatus(error.message, "error");
    } finally {
      button.disabled = false;
    }
  }

  async function publish() {
    const button = $("#publish-content");
    button.disabled = true;
    try {
      saveSocials();
      const { branch } = config();
      setStatus("正在確認 GitHub 最新版本…");
      const current = await github(`/contents/content.js?ref=${encodeURIComponent(branch)}`);
      remoteSha = current.sha;
      let completed = 0;
      for (const [path, file] of pendingUploads) {
        completed += 1;
        setStatus(`正在上傳圖片 ${completed}/${pendingUploads.size}：${file.name}`);
        await github(`/contents/${path}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Add website image ${file.name}`,
            content: await fileToBase64(file),
            branch
          })
        });
      }
      setStatus("正在提交網站內容…");
      const result = await github("/contents/content.js", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Update website content from admin",
          content: encodeBase64(serializeContentJs()),
          sha: remoteSha,
          branch
        })
      });
      remoteSha = result.content.sha;
      pendingUploads.clear();
      updateSummary();
      setStatus("發布完成。GitHub 已收到更新，請等 Zeabur 自動重新部署後再查看網站。", "success");
    } catch (error) {
      setStatus(`發布失敗：${error.message}`, "error");
    } finally {
      button.disabled = false;
    }
  }

  function renderAll() {
    renderSocials();
    renderProductSelect();
    renderArticleSelect();
    updateSummary();
  }

  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-admin-tab]").forEach((item) => item.classList.toggle("active", item === button));
      document.querySelectorAll("[data-admin-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.adminPanel === button.dataset.adminTab));
    });
  });
  $("#settings-form").addEventListener("submit", (event) => { event.preventDefault(); saveSocials(); updateSummary(); setStatus("社群設定草稿已儲存，尚未發布。", "success"); });
  $("#product-select").addEventListener("change", (event) => { selectedProductId = event.target.value; fillProductForm(); });
  $("#article-select").addEventListener("change", (event) => { selectedArticleId = event.target.value; fillArticleForm(); });
  productForm.addEventListener("submit", (event) => { event.preventDefault(); try { saveProduct(); } catch (error) { setStatus(error.message, "error"); } });
  articleForm.addEventListener("submit", (event) => { event.preventDefault(); try { saveArticle(); } catch (error) { setStatus(error.message, "error"); } });
  $("#new-product").addEventListener("click", newProduct);
  $("#delete-product").addEventListener("click", deleteProduct);
  $("#new-article").addEventListener("click", newArticle);
  $("#delete-article").addEventListener("click", deleteArticle);
  $("#connect-github").addEventListener("click", connect);
  $("#publish-content").addEventListener("click", publish);

  renderAll();
})();
