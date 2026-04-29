# bciriak.com

Personal blog of Brano Ciriak. Software engineer based in Bratislava — writing about Go, TypeScript, and the systems underneath them.

## Stack

- **[Astro](https://astro.build/)** — static site generation, `output: 'static'`.
- **[MDX](https://mdxjs.com/)** (`@astrojs/mdx`) — posts authored as `.mdx` in `src/content/blog/`.
- **TypeScript** in strict mode (no `any`).
- **Astro Content Collections** with a Zod schema for type-safe frontmatter.
- **[Shiki](https://shiki.style/)** with a custom transformer that emits `tk-kw / tk-fn / tk-str / tk-num / tk-com / tk-typ / tk-pun` classes so the design's hand-tuned code-token colors apply unchanged.
- **Astro `<Image />`** (sharp) for in-post image optimization.
- **`@astrojs/rss`** — RSS feed at `/rss.xml`.
- **`@astrojs/sitemap`** — sitemap at `/sitemap-index.xml`.
- **[Plausible CE](https://plausible.io/)** — privacy-friendly analytics, self-hosted on the same Dokploy at `plausible.bciriak.com`.
- **[Dokploy](https://dokploy.com/)** + **Traefik** + **Let's Encrypt** — hosting, reverse proxy, automatic HTTPS.
- **Inter** + **JetBrains Mono** via Google Fonts.

## Authoring

Drop a new file in `src/content/blog/<slug>.mdx`:

```mdx
---
title: "Reading raft, line by line"
description: "Notes from a slow walk through the etcd raft package."
pubDate: 2026-04-18
tags: [go, distributed-systems]
draft: false
---

Body here.
```

`draft: true` posts are visible in `npm run dev` but excluded from the production build, RSS, and sitemap.

For code blocks with a filename header, use the `title=` meta:

````mdx
```go title="worker.go"
func main() { ... }
```
````

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serve dist/ locally
```

## Publish

Push to `main`. Dokploy's GitHub App rebuilds and serves the new `dist/` automatically.

## Reference

The original visual design lives in `design/` (single-page HTML + CSS, light theme). It's unbuilt and unserved — kept as a reference target.
