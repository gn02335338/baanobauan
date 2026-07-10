(function () {
  "use strict";

  const B = window.Baan;
  if (!B) return;
  const page = document.body.dataset.page;
  let filter = "all";

  function productCard(product) {
    return `
      <article class="product-card" id="product-${B.escapeHtml(product.id)}">
        <a class="product-media" href="products.html#product-${B.escapeHtml(product.id)}" aria-label="${B.escapeHtml(B.localize(product.name))}">
          <img src="${B.escapeHtml(product.image)}" alt="${B.escapeHtml(B.localize(product.name))}" loading="lazy">
          <span class="product-badge">${B.escapeHtml(B.localize(product.badge))}</span>
        </a>
        <div class="product-body">
          <h3>${B.escapeHtml(B.localize(product.name))}</h3>
          <p>${B.escapeHtml(B.localize(product.desc))}</p>
        </div>
        <div class="product-footer">
          <span class="price"><small>${B.t("common.priceFrom")}</small> ฿${B.money(product.price)}</span>
          <button class="coming-soon-button" type="button" disabled title="${B.escapeHtml(B.t("common.comingSoon"))}">${B.escapeHtml(B.t("common.comingSoon"))}</button>
        </div>
      </article>
    `;
  }

  function articleCard(article, featured = false) {
    return `
      <article class="article-card${featured ? " article-card-featured" : ""}">
        <a class="article-media" href="article.html?slug=${encodeURIComponent(article.id)}">
          <img src="${B.escapeHtml(article.image)}" alt="${B.escapeHtml(B.localize(article.title))}" loading="lazy">
        </a>
        <div class="article-card-body">
          <p class="article-meta">${featured ? `${B.escapeHtml(B.t("common.latest"))} · ` : ""}${B.escapeHtml(B.date(article.date))}</p>
          <h2><a href="article.html?slug=${encodeURIComponent(article.id)}">${B.escapeHtml(B.localize(article.title))}</a></h2>
          <p>${B.escapeHtml(B.localize(article.summary))}</p>
          <a class="text-link" href="article.html?slug=${encodeURIComponent(article.id)}">${B.escapeHtml(B.t("common.read"))}<span aria-hidden="true"> →</span></a>
        </div>
      </article>
    `;
  }

  function renderHome() {
    const products = B.content.products.filter((product) => product.featured).slice(0, 4);
    const latest = [...B.content.articles].sort((a, b) => b.date.localeCompare(a.date))[0];
    document.querySelector("#featured-products").innerHTML = products.map(productCard).join("");
    document.querySelector("#latest-article").innerHTML = articleCard(latest, true);
    document.querySelector("#social-links").innerHTML = B.socialCards();
  }

  function renderProducts() {
    const products = B.content.products.filter((product) => filter === "all" || product.category === filter);
    document.querySelector("#product-grid").innerHTML = products.map(productCard).join("");
    installProductSchema(products);
  }

  function installProductSchema(products) {
    document.querySelector("#product-schema")?.remove();
    const script = document.createElement("script");
    script.id = "product-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: B.localize(product.name),
          description: B.localize(product.desc),
          image: new URL(product.image, location.href).href,
          offers: {
            "@type": "Offer",
            priceCurrency: "THB",
            price: product.price,
            availability: "https://schema.org/LimitedAvailability"
          }
        }
      }))
    });
    document.head.append(script);
  }

  function renderArticles() {
    const articles = [...B.content.articles].sort((a, b) => b.date.localeCompare(a.date));
    document.querySelector("#article-list").innerHTML = articles.map((article, index) => articleCard(article, index === 0)).join("");
  }

  function renderArticle() {
    const slug = new URLSearchParams(location.search).get("slug") || B.content.articles[0]?.id;
    const article = B.content.articles.find((item) => item.id === slug) || B.content.articles[0];
    if (!article) return;
    const body = B.localize(article.body);
    document.querySelector("#article-detail").innerHTML = `
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">${B.escapeHtml(B.t("nav.home"))}</a><span>/</span><a href="articles.html">${B.escapeHtml(B.t("nav.articles"))}</a></nav>
      <header class="article-header">
        <p class="eyebrow">${B.escapeHtml(B.t("common.latest"))}</p>
        <h1>${B.escapeHtml(B.localize(article.title))}</h1>
        <p class="article-intro">${B.escapeHtml(B.localize(article.summary))}</p>
        <p class="article-meta">${B.escapeHtml(B.t("common.date"))} · ${B.escapeHtml(B.date(article.date))}</p>
      </header>
      <figure class="article-cover"><img src="${B.escapeHtml(article.image)}" alt="${B.escapeHtml(B.localize(article.title))}"></figure>
      <div class="article-prose">${body.map((paragraph) => `<p>${B.escapeHtml(paragraph)}</p>`).join("")}</div>
      <aside class="article-cta">
        <div><strong>${B.escapeHtml(B.t("common.askShop"))}</strong><p>${B.escapeHtml(B.t("common.comingSoon"))}</p></div>
        <a class="button primary" href="contact.html">${B.escapeHtml(B.t("nav.contact"))}</a>
      </aside>
    `;
    document.title = `${B.localize(article.title)} | Baan Ob Auan`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = B.localize(article.summary);
    installArticleSchema(article);
  }

  function installArticleSchema(article) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: B.localize(article.title),
      description: B.localize(article.summary),
      datePublished: article.date,
      dateModified: article.date,
      image: new URL(article.image, location.href).href,
      author: { "@type": "Organization", name: B.content.site.name },
      publisher: { "@type": "Organization", name: B.content.site.name }
    });
    document.head.append(script);
  }

  function renderContact() {
    document.querySelector("#contact-socials").innerHTML = B.socialCards();
    const form = document.querySelector("#feedback-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const message = [
        "Baan Ob Auan website feedback",
        `Name: ${data.get("name") || "-"}`,
        `Contact: ${data.get("contact") || "-"}`,
        `Topic: ${data.get("topic") || "-"}`,
        "",
        data.get("message") || "-"
      ].join("\n");
      const status = document.querySelector("#feedback-status");
      try {
        await navigator.clipboard.writeText(message);
        status.textContent = B.language === "zh" ? "回饋內容已複製，請貼到店家的 TikTok 私訊。" : B.language === "th" ? "คัดลอกข้อความแล้ว กรุณาส่งให้ร้านทาง TikTok" : "Feedback copied. Please send it to the shop on TikTok.";
      } catch {
        status.textContent = message;
      }
    });
  }

  function render() {
    if (page === "home") renderHome();
    if (page === "products") renderProducts();
    if (page === "articles") renderArticles();
    if (page === "article") renderArticle();
    if (page === "contact") renderContact();
  }

  if (page === "products") {
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        filter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
        renderProducts();
      });
    });
  }

  document.addEventListener("baan:langchange", render);
  render();
})();
