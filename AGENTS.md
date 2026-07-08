# Gymlocator.in - Agent Context

India's gym discovery and comparison platform (Zomato UX for fitness centers).
Users find, filter, and compare gyms by city, locality, and amenity.
Live repo: https://github.com/product-punk/gymlocator-in - deploys to Vercel on push to `main`.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack

- Next.js (App Router, `src/app/`), TypeScript strict, Tailwind CSS v4 (tokens in `src/app/globals.css` `@theme`, NOT tailwind.config.ts)
- Supabase (Postgres) for gyms/cities/localities - queries in `src/lib/supabase/queries.ts`
- Contentful for the blog (posts, authors) - client + queries in `src/lib/contentful.ts`
- Tabler icons webfont (`<i className="ti ti-*" />`), Inter font
- Env: `.env.local` - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`

## Commands

- `npm run dev` - dev server on :3000 (usually already running)
- `npx tsc --noEmit` - typecheck (run after every change)
- `npx next build` - production build (run before pushing)
- Query Contentful/Supabase ad hoc: `node --env-file=.env.local -e "..."`

## Route map

```
/                                homepage (hero, trending cities, featured gyms)
/cities                          all cities hub
/gyms/[city]                     city page (?price=&gender=&... filters via URL params)
/gyms/[city]/[slug]              SHARED: locality OR facet page
                                 facets: women|budget|premium|cardio|with-personal-trainer|
                                         with-swimming-pool|with-steam-sauna (src/lib/facets.ts)
/gym/[slug]                      gym detail (slug: cult-fit-koramangala-bangalore)
/blog                            blog hub
/blog/[slug]                     SHARED: post OR category hub (12 categories,
                                 src/lib/blog-categories.ts resolves)
/blog/author/[slug]              author profile
/search?q=                       search (robots-disallowed)
/calculators/protein             protein calculator
/about /contact /privacy /list-your-gym
/robots.txt (src/app/robots.ts)  and 7 sitemap routes (sitemap*.xml/route.ts)
```

## Data contracts (break these and pages 404 or render wrong)

1. **Blog categories are stored as SLUGS in Contentful** (`categories: ['gym-equipment']`),
   never labels. Slug-to-label map: `src/lib/blog-categories.ts`.
2. **Blog post slugs are single URL segments**: `mass-gainer`, never `/blog/x/mass-gainer`.
3. **blogPost.author is a Contentful Reference** to an `author` entry. Legacy posts may
   hold a plain name string - always go through `postAuthorName()` / `postAuthorSlug()`
   from `src/lib/post-author.ts`.
4. **Client components must NOT value-import `@/lib/contentful`** (it instantiates the
   SDK with server-only env vars and crashes the browser). `import type` is fine;
   runtime helpers live in client-safe `src/lib/post-author.ts` and `src/lib/rich-text.ts`.
5. **Contentful asset links can be unresolved** (unpublished asset = no `fields`).
   Always optional-chain: `photo?.fields?.file?.url`.
6. **Gym images are scraped Google Maps URLs that expire (403)**. Never render them with
   a bare `<img>`; use `src/components/shared/GymImage.tsx` (onError fallback).
7. **Contentful image URLs are protocol-relative** (`//images.ctfassets.net/...`) -
   pass through `resolveImgUrl()` before use.
8. **publishedDate may be empty** on posts - code falls back to `sys.createdAt`.
9. `faqs` on blogPost is a JSON field: array of `{question, answer}` (or `{q, a}`);
   normalize via `normalizeFaqs()`.

## Publishing thresholds (SEO)

- City pages/nav/sitemaps: only cities with >= 10 gyms
- Locality pages: >= 5 gyms
- Facet pages in sitemap: >= 3 matching gyms
- Cities in scope: mumbai, delhi, bangalore, pune, hyderabad, chennai, kolkata, ahmedabad
  (gurgaon/noida/ghaziabad exist in DB but are below threshold - keep them out of nav/sitemaps)

## Design system (dark, monochrome silver)

Tokens (globals.css): base `#0C0C0C`, surface `#111111`, raised `#1A1A1A`,
border `#222222`, border-hi `#333333`, accent `#D4D4D4` (silver), accent-dim `#1E1E1E`,
signal `#009A6B` (emerald dot only), text `#F0F0F0` / secondary `#AAAAAA` / muted `#555555`.

- Hair borders everywhere: `border-[0.5px]` / `.b-hair .bb-hair .bt-hair`
- Cards: `bg-surface rounded-[12px]`, hover `border-hi` + `-translate-y-0.5`
- Utility classes: `.h1 .h2 .label .img-placeholder` (see globals.css)
- Mobile-first: build for 375px, then scale. No component libraries. Tailwind only,
  no custom CSS files, no inline styles (style={} only for truly dynamic values).
- Design source of truth: `design-handoff/gym-locator/project/` HTML prototypes
  (blog/Blog Hub.html, Post.html, Author.html, Archive.html + blog.css)

## Content & copy rules

- **NO EM DASHES (U+2014) anywhere** - site copy, SEO text, comments. Use ` - ` instead.
- Meta title templates and per-page schema types: see CLAUDE.md SEO section.
- Every page: title, meta description, OG tags, JSON-LD (dynamically populated).
- Internal links via `next/link`, images via `next/image` (except GymImage fallback case).

## SEO infrastructure

- JSON-LD per page type: WebSite+SearchAction (home), CollectionPage+ItemList+FAQPage
  (city/locality/facet), HealthClub/LocalBusiness (gym), Article (post), Blog (hub),
  CollectionPage (category hub), ProfilePage+Person (author), BreadcrumbList everywhere.
- Sitemaps: index at /sitemap.xml -> static/cities/localities/gyms/facets/blog,
  all DB/CMS-driven with `revalidate = 3600`.
- ISR: blog pages 3600s, gym/city pages 3600s, static sitemap 86400s.

## Review agents

Project agents live in `.claude/agents/`:
- `ui-reviewer` - design-system and prototype fidelity review
- `code-reviewer` - correctness, TS strict, project-contract review
- `content-reviewer` - blog/Contentful content quality + data-contract audit
- `seo-auditor` - meta/schema/sitemap/robots/internal-linking audit

Invoke them via the Agent tool (subagent_type = name above) or ask Claude to
"run the ui review" etc. All four are read-only reviewers: they report findings
with file:line references and severity, they do not edit code.
