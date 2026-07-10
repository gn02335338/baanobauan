(function () {
  "use strict";

  const clone = (value) => JSON.parse(JSON.stringify(value));
  let data = clone(window.BAAN_CONTENT);
  let remoteSha = "";
  let selectedProductId = data.products[0]?.id || "";
  let selectedArticleId = data.articles[0]?.id || "";
  const pendingUploads = new Map();
  const i18n = window.BaanAdminI18n;
  const t = (key, values) => i18n.t(key, values);
  let connectionStatus = "disconnected";

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

  function localized(value) {
    return value?.[i18n.language] || value?.en || value?.th || value?.zh || "";
  }

  function renderConnectionStatus() {
    connectionState.textContent = t(connectionStatus);
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
    if (!owner || !repo || !token) throw new Error(t("configMissing"));
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
      throw new Error(detail.message || t("githubError", { status: response.status }));
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
    if (!match) throw new Error(t("contentFormatError"));
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
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) throw new Error(t("imageTypeError"));
    if (file.size > 8 * 1024 * 1024) throw new Error(t("imageSizeError"));
    if (pendingUploads.has(previousPath)) pendingUploads.delete(previousPath);
    const path = `assets/uploads/${sanitizeFileName(file.name)}`;
    pendingUploads.set(path, file);
    return path;
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = () => reject(new Error(t("imageReadError", { name: file.name })));
      reader.readAsDataURL(file);
    });
  }

  function renderSocials() {
    $("#social-settings").innerHTML = data.site.socials.map((social) => `
      <div class="social-setting" data-social-id="${social.id}">
        <div><strong>${social.network}</strong><small>${social.id}</small></div>
        <label><span data-admin-i18n="socialUrl">URL</span><input name="url" type="url" value="${escapeAttr(social.url)}" placeholder="https://..."></label>
        <label class="check-field"><input name="enabled" type="checkbox" ${social.enabled ? "checked" : ""}><span data-admin-i18n="socialVisible">Show</span></label>
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
    $("#product-select").innerHTML = data.products.map((product) => `<option value="${escapeAttr(product.id)}">${escapeAttr(localized(product.name) || product.id)}</option>`).join("");
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
    if (duplicate) throw new Error(t("duplicateProduct"));
    const index = data.products.findIndex((item) => item.id === selectedProductId);
    if (index < 0) throw new Error(t("productNotFound"));
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
    setStatus(t("productSaved"), "success");
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
    setStatus(t("productCreated"));
  }

  function deleteProduct() {
    const product = data.products.find((item) => item.id === selectedProductId);
    if (!product || !confirm(t("confirmDeleteProduct", { name: localized(product.name) }))) return;
    data.products = data.products.filter((item) => item.id !== selectedProductId);
    selectedProductId = data.products[0]?.id || "";
    renderProductSelect();
    updateSummary();
    setStatus(t("productDeleted"), "success");
  }

  function renderArticleSelect() {
    $("#article-select").innerHTML = data.articles.map((article) => `<option value="${escapeAttr(article.id)}">${escapeAttr(localized(article.title) || article.id)}</option>`).join("");
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
    if (duplicate) throw new Error(t("duplicateArticle"));
    const index = data.articles.findIndex((item) => item.id === selectedArticleId);
    if (index < 0) throw new Error(t("articleNotFound"));
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
    setStatus(t("articleSaved"), "success");
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
    setStatus(t("articleCreated"));
  }

  function deleteArticle() {
    const article = data.articles.find((item) => item.id === selectedArticleId);
    if (!article || !confirm(t("confirmDeleteArticle", { name: localized(article.title) }))) return;
    data.articles = data.articles.filter((item) => item.id !== selectedArticleId);
    selectedArticleId = data.articles[0]?.id || "";
    renderArticleSelect();
    updateSummary();
    setStatus(t("articleDeleted"), "success");
  }

  function updateSummary() {
    $("#publish-summary").innerHTML = `
      <div><strong>${data.products.length}</strong><span>${t("productsCount")}</span></div>
      <div><strong>${data.articles.length}</strong><span>${t("articlesCount")}</span></div>
      <div><strong>${data.site.socials.filter((item) => item.enabled && item.url).length}</strong><span>${t("socialsCount")}</span></div>
      <div><strong>${pendingUploads.size}</strong><span>${t("uploadsCount")}</span></div>
    `;
  }

  async function connect() {
    const button = $("#connect-github");
    button.disabled = true;
    setStatus(t("connecting"));
    try {
      const { branch } = config();
      const file = await github(`/contents/content.js?ref=${encodeURIComponent(branch)}`);
      data = parseContentJs(decodeBase64(file.content));
      remoteSha = file.sha;
      pendingUploads.clear();
      selectedProductId = data.products[0]?.id || "";
      selectedArticleId = data.articles[0]?.id || "";
      renderAll();
      connectionStatus = "connected";
      renderConnectionStatus();
      connectionState.classList.add("connected");
      setStatus(t("connectSuccess"), "success");
    } catch (error) {
      connectionStatus = "connectionFailed";
      renderConnectionStatus();
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
      setStatus(t("checkingLatest"));
      const current = await github(`/contents/content.js?ref=${encodeURIComponent(branch)}`);
      remoteSha = current.sha;
      let completed = 0;
      for (const [path, file] of pendingUploads) {
        completed += 1;
        setStatus(t("uploadingImage", { current: completed, total: pendingUploads.size, name: file.name }));
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
      setStatus(t("submittingContent"));
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
      setStatus(t("publishSuccess"), "success");
    } catch (error) {
      setStatus(t("publishFailed", { message: error.message }), "error");
    } finally {
      button.disabled = false;
    }
  }

  function renderAll() {
    renderSocials();
    renderProductSelect();
    renderArticleSelect();
    updateSummary();
    renderConnectionStatus();
    i18n.apply();
  }

  function localizeRecordOptions() {
    document.querySelectorAll("#product-select option").forEach((option) => {
      const product = data.products.find((item) => item.id === option.value);
      if (product) option.textContent = localized(product.name) || product.id;
    });
    document.querySelectorAll("#article-select option").forEach((option) => {
      const article = data.articles.find((item) => item.id === option.value);
      if (article) option.textContent = localized(article.title) || article.id;
    });
  }

  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-admin-tab]").forEach((item) => item.classList.toggle("active", item === button));
      document.querySelectorAll("[data-admin-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.adminPanel === button.dataset.adminTab));
    });
  });
  $("#settings-form").addEventListener("submit", (event) => { event.preventDefault(); saveSocials(); updateSummary(); setStatus(t("settingsSaved"), "success"); });
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
  document.addEventListener("baanadminlanguagechange", () => {
    localizeRecordOptions();
    updateSummary();
    renderConnectionStatus();
  });

  renderAll();
})();
