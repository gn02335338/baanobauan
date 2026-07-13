# บ้านอบอวล | Baan Ob Auan

Multilingual static bakery website deployed from GitHub to Zeabur.

## Pages

- `index.html`: immersive scrolling homepage with a full-screen counter scene, scroll-driven featured products, video, latest story, and social links
- `articles.html` / `article.html`: product stories and article detail
- `products.html`: SEO-friendly product catalogue; checkout is intentionally disabled
- `contact.html`: social links and feedback-message helper
- `admin.html`: Thai-first, trilingual content manager that publishes through the GitHub Contents API

## Content Management

Public content lives in `content.js`. Open `/admin.html`, choose Thai, English, or Chinese, enter a fine-grained GitHub personal access token with read/write access to repository Contents, then connect to the repository. Thai is the default manager language, and the last language choice is remembered. Product images uploaded through the manager are stored in `assets/uploads/`.

The token stays in page memory and is not written to local storage or committed to the repository. After publishing, GitHub receives the update and Zeabur redeploys from `main`.

## SEO

Each public page has a unique title and description, semantic headings, Open Graph metadata, internal links, image alt text, and Schema.org structured data for the bakery, products, and articles. `robots.txt` excludes the management page from indexing.

Add a `sitemap.xml` after a permanent production domain has been chosen, because sitemap URLs must be absolute.
