# Future deployment preparation (nothing deployed)

Run `npm ci`, `npm run verify`, then `npm run test:preview` locally first. Uploading or deploying requires a separate owner decision; no current script performs it. The build output is `dist/`. Node is needed to build, not to serve the generated static files.

Choose a static host that serves existing files before applying route fallbacks. `/projects/<slug>/` must serve that directory's generated `index.html`, preserving its project-specific metadata. Serve unknown URLs with `404.html` and a real HTTP 404 status. A blanket homepage rewrite loses project-specific HTML metadata and can return misleading 200 statuses. Vite preview checks local serving only; it does not prove a future host's HTTP behavior.

Before release:

- Choose and verify the actual public domain. Then add canonical URLs, absolute social-image URLs and a sitemap using that domain. Do not use a guessed hostname.
- Decide whether separate `/en/` and `/fr/` URLs are required. Current language switching works client-side; static metadata defaults to English. Do not add hreflang claims until those URLs actually exist.
- Test direct visits and refreshes to every project, unknown paths, image URLs and both languages on the chosen host.
- Complete `docs/frontend-qa.md`, including mobile, keyboard, contrast and reduced motion.
- Review all content with the owner and obtain genuine CV files if downloads are desired.
- Check external links in a real browser. Local link checks validate catalog structure and generated assets, not permanent availability of remote sites.
- If setting a Content Security Policy, account for the small inline initial-theme script in `index.html`; test it instead of disabling it accidentally.

No backend is currently required. Contact uses the visitor's email application; it does not send email from the website.

See `FINAL-REMAINING-WORK.md` for the concrete route/MIME/cache contract and planned hosting steps. A real robots.txt now exists; domain-dependent sitemap/canonical URLs remain deferred. `test:build` rejects unexpected release files. No host or deployment has been configured or activated.
