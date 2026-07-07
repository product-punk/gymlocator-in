---
name: blog-contentful
description: How the Gymlocator blog works — Contentful content model, category/author routing, adding new categories or authors, and the blog design system. Use when working on anything under /blog.
---

# Gymlocator Blog + Contentful

## Architecture at a glance

- CMS: **Contentful** — client + all queries in `src/lib/contentful.ts`
- Env: `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`
- All blog pages use ISR: `export const revalidate = 3600`
- Design prototypes (source of truth for visuals): `design-handoff/gym-locator/project/blog/`
  (`Blog Hub.html`, `Author.html`, `Post.html`, `Archive.html`, shared `blog.css`)

## Routes

| URL | File | Notes |
|---|---|---|
| `/blog` | `src/app/blog/page.tsx` | Hub — renders `BlogHubClient` |
| `/blog/{post-slug}` | `src/app/blog/[slug]/page.tsx` | Post detail |
| `/blog/{category-slug}` | same shared route | Resolved via `getCategoryBySlug()` — renders `CategoryHubPage` |
| `/blog/author/{author-slug}` | `src/app/blog/author/[slug]/page.tsx` | Author profile — renders `AuthorPage` |

The `[slug]` route disambiguates: if the slug matches one of the 12 fixed
categories in `src/lib/blog-categories.ts`, it's a category hub; otherwise
it's treated as a post slug.

## Critical data contracts

1. **Categories are stored as SLUGS in Contentful**, never labels.
   `blogPost.categories = ['supplements-nutrition']`, not `['Supplements & Nutrition']`.
   Slug→label mapping is `getLabelFromSlug()` in `src/lib/blog-categories.ts`.
   The Contentful query `fields.categories[in]` matches on the slug.

2. **Authors are linked by Reference.** `blogPost.author` is a Reference field
   validated to accept only `author` entries — editors pick from existing
   authors. Code handles both shapes via `postAuthorName()` / `postAuthorSlug()`
   (`PostAuthor = string | linked entry`) because legacy posts may still hold a
   name string. `getPostsByAuthor(author)` queries by linked entry ID first,
   then falls back to exact-name matching; `getAuthorBySlug(slug)` fetches the
   profile.

## Adding a new category

1. Add `{ label, slug, description }` to `BLOG_CATEGORIES` in `src/lib/blog-categories.ts`
2. In Contentful, allow the new **slug** as a value on `blogPost.categories`
3. The category hub page, nav chip, and metadata generate automatically

## Adding a new author

1. In Contentful, create an `author` entry:
   - `name` — display name (e.g. "Arjun Kapoor")
   - `slug` — kebab-case (e.g. `arjun-kapoor`)
   - Optional: `designation`, `photo`, `bio` (blank-line-separated paragraphs),
     `quote`, `credentials` (list), `verified`, `linkedin`, `twitter`,
     `instagram`, `website`, `gymsReviewed`, `totalReads`
   - Publish the entry AND its photo asset (assets publish separately)
2. On blog posts, pick the author via the Reference field
3. `/blog/author/{slug}` works automatically (ISR, prerendered via `generateStaticParams`)

## Shared components (`src/app/blog/_components/`)

- `PostCard.tsx` — canonical article card + `PostMeta`, `CategoryPill`,
  `resolveImgUrl`, `formatDate`, `initials`. Reuse this — don't duplicate.
- `BlogHubClient.tsx` — hub page (client, has newsletter state + its own
  Featured/Mini card variants)
- `CategoryHubPage.tsx` — category hub (server)
- `AuthorPage.tsx` — author profile (server)
- `BlogCategoryNav.tsx` — sticky category chip scroller

## Design system (blog)

Dark theme, tokens registered in `src/app/globals.css` (`@theme`):
`base #0C0C0C · surface #111111 · raised #1A1A1A · border #222222 ·
border-hi #333333 · accent #D4D4D4 (silver) · accent-dim #1E1E1E ·
signal #009A6B (emerald dot) · text #F0F0F0 / secondary #AAAAAA / muted #555555`

Utility classes: `.h1 .h2 .label .bb-hair .img-placeholder`. Hair borders are
`border-[0.5px]`. Cards: `bg-surface`, `rounded-[12px]`, hover `border-hi` +
`-translate-y-0.5`. Icons: Tabler webfont (`<i className="ti ti-*" />`).
Contentful image URLs are protocol-relative — always pass through `resolveImgUrl()`.
