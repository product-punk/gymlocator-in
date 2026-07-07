import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
  getAuthorBySlug,
  postAuthorName,
  postAuthorSlug,
  normalizeFaqs,
} from '@/lib/contentful'
import { getCategoryBySlug, getLabelFromSlug, BLOG_CATEGORIES } from '@/lib/blog-categories'
import { extractToc, estimateReadMinutes, slugifyHeading, nodeText } from '@/lib/rich-text'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import CategoryHubPage from '../_components/CategoryHubPage'
import PostCard, { resolveImgUrl, initials } from '../_components/PostCard'
import PostSidebar from '../_components/PostSidebar'
import ReadingProgress from '../_components/ReadingProgress'

export const revalidate = 3600

export async function generateStaticParams() {
  const [posts] = await Promise.all([getAllPosts()])
  const postParams = posts.map((post: { fields: { slug: string } }) => ({ slug: post.fields.slug }))
  const categoryParams = BLOG_CATEGORIES.map(c => ({ slug: c.slug }))
  return [...categoryParams, ...postParams]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const category = getCategoryBySlug(slug)
  if (category) {
    return {
      title: `${category.label} — Guides, Tips & Advice | Gymlocator`,
      description: category.description,
      openGraph: {
        title: `${category.label} | Gymlocator Fitness Hub`,
        description: category.description,
      },
    }
  }

  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.fields.seoTitle || post.fields.title,
    description: post.fields.seoDescription || post.fields.excerpt,
    openGraph: {
      title: post.fields.seoTitle || post.fields.title,
      description: post.fields.seoDescription || post.fields.excerpt,
      images: post.fields.coverImage?.fields?.file?.url
        ? [`https:${post.fields.coverImage.fields.file.url}?w=1200&h=630&fit=fill`]
        : [],
    },
  }
}

function headingId(node: unknown): string {
  return slugifyHeading(nodeText(node as Parameters<typeof nodeText>[0]).trim())
}

// Prose styling from the Post.html design (.prose rules in blog.css)
const richTextOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => (
      <strong className="text-text font-bold">{text}</strong>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: unknown, children: React.ReactNode) => (
      <p className="mt-6 first:mt-0 text-[17px] leading-[1.75] text-text-secondary">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: unknown, children: React.ReactNode) => (
      <h1 className="mt-12 text-[32px] font-bold tracking-[-1px] text-text">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: unknown, children: React.ReactNode) => (
      <h2
        id={headingId(node)}
        className="mt-12 text-[28px] font-bold tracking-[-0.8px] text-text scroll-mt-[90px]"
      >
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (node: unknown, children: React.ReactNode) => (
      <h3
        id={headingId(node)}
        className="mt-9 text-[21px] font-bold tracking-[-0.4px] text-text scroll-mt-[90px]"
      >
        {children}
      </h3>
    ),
    [BLOCKS.UL_LIST]: (node: unknown, children: React.ReactNode) => (
      <ul className="mt-6 flex flex-col gap-3 list-none p-0">{children}</ul>
    ),
    [BLOCKS.LIST_ITEM]: (node: unknown, children: React.ReactNode) => (
      <li className="relative pl-7 text-[17px] leading-[1.75] text-text-secondary before:content-[''] before:absolute before:left-1.5 before:top-[11px] before:w-[7px] before:h-[7px] before:bg-accent before:rounded-[1px] [&>p]:mt-0 [&>p]:inline">
        {children}
      </li>
    ),
    [BLOCKS.OL_LIST]: (node: unknown, children: React.ReactNode) => (
      <ol className="mt-6 flex flex-col gap-3 list-decimal pl-6 text-[17px] leading-[1.75] text-text-secondary [&>li>p]:mt-0 [&>li>p]:inline">
        {children}
      </ol>
    ),
    [BLOCKS.QUOTE]: (node: unknown, children: React.ReactNode) => (
      <blockquote className="mt-6 border-l-[3px] border-accent pl-6 py-1 text-[21px] leading-[1.5] font-medium tracking-[-0.3px] text-text [&>p]:mt-0 [&>p]:text-[21px] [&>p]:leading-[1.5] [&>p]:text-text">
        {children}
      </blockquote>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node: unknown) => {
      const n = node as { data: { target: { fields?: { file?: { url: string }; title?: string } } } }
      const file = n.data.target.fields?.file
      if (!file?.url) return null
      return (
        <img
          src={`https:${file.url}`}
          alt={n.data.target.fields?.title || ''}
          className="rounded-[12px] my-8 w-full border-[0.5px] border-border"
        />
      )
    },
    [INLINES.HYPERLINK]: (node: unknown, children: React.ReactNode) => {
      const n = node as { data: { uri: string } }
      const isInternal = n.data.uri.startsWith('/') || n.data.uri.includes('gymlocator.in')
      return (
        <a
          href={n.data.uri}
          className="text-accent border-b border-accent-dim hover:border-accent transition-colors"
          {...(isInternal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {children}
        </a>
      )
    },
  },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function MetaStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={`font-mono text-[11px] uppercase tracking-[0.08em] ${accent ? 'text-accent' : 'text-text-muted'}`}
      >
        {label}
      </span>
      <span className="text-[13px] text-text-secondary">{value}</span>
    </div>
  )
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Category hub route
  const category = getCategoryBySlug(slug)
  if (category) {
    const posts = await getPostsByCategory(slug)
    const categoryJsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: `${category.label} — Gymlocator Fitness Hub`,
          description: category.description,
          url: `https://gymlocator.in/blog/${category.slug}`,
          hasPart: posts.map(p => ({
            '@type': 'Article',
            headline: p.fields.title,
            url: `https://gymlocator.in/blog/${p.fields.slug}`,
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gymlocator.in' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://gymlocator.in/blog' },
            { '@type': 'ListItem', position: 3, name: category.label },
          ],
        },
      ],
    }
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
        />
        <CategoryHubPage category={category} posts={posts} />
      </>
    )
  }

  // Blog post route
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const categorySlug = post.fields.categories?.[0]
  const authorName = postAuthorName(post.fields.author)
  const authorSlug = postAuthorSlug(post.fields.author)
  const postUrl = `https://gymlocator.in/blog/${post.fields.slug}`

  const [authorEntry, categoryPosts] = await Promise.all([
    authorSlug ? getAuthorBySlug(authorSlug) : Promise.resolve(null),
    categorySlug ? getPostsByCategory(categorySlug) : Promise.resolve([]),
  ])

  let related = categoryPosts.filter(p => p.fields.slug !== slug).slice(0, 3)
  if (related.length === 0) {
    const recent = await getAllPosts()
    related = recent.filter(p => p.fields.slug !== slug).slice(0, 3)
  }

  const toc = extractToc(post.fields.body)
  const readMinutes = estimateReadMinutes(post.fields.body)
  const faqs = normalizeFaqs(post.fields.faqs)
  // Fall back to entry creation date when the editor hasn't set publishedDate
  const published = post.fields.publishedDate || post.sys.createdAt
  const updated = post.sys.updatedAt
  const showUpdated =
    published &&
    updated &&
    new Date(updated).toDateString() !== new Date(published).toDateString()

  const coverUrl = resolveImgUrl(post.fields.coverImage?.fields?.file?.url)
  const authorPhotoUrl = resolveImgUrl(authorEntry?.fields.photo?.fields?.file?.url)

  const postJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.fields.title,
        description: post.fields.seoDescription || post.fields.excerpt,
        url: postUrl,
        image: post.fields.coverImage?.fields?.file?.url
          ? `https:${post.fields.coverImage.fields.file.url}`
          : undefined,
        datePublished: published,
        dateModified: updated,
        author: authorName
          ? {
              '@type': 'Person',
              name: authorName,
              url: authorSlug
                ? `https://gymlocator.in/blog/author/${authorSlug}`
                : undefined,
            }
          : undefined,
        publisher: {
          '@type': 'Organization',
          name: 'Gymlocator.in',
          logo: { '@type': 'ImageObject', url: 'https://gymlocator.in/logo.png' },
        },
        mainEntityOfPage: postUrl,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gymlocator.in' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://gymlocator.in/blog' },
          ...(categorySlug
            ? [{
                '@type': 'ListItem',
                position: 3,
                name: getLabelFromSlug(categorySlug),
                item: `https://gymlocator.in/blog/${categorySlug}`,
              }]
            : []),
          {
            '@type': 'ListItem',
            position: categorySlug ? 4 : 3,
            name: post.fields.title,
          },
        ],
      },
      ...(faqs.length > 0
        ? [{
            '@type': 'FAQPage',
            mainEntity: faqs.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }]
        : []),
    ],
  }

  return (
    <main className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />
      <ReadingProgress />

      {/* Article header */}
      <section className="max-w-[760px] mx-auto px-5 pt-10">
        <nav className="flex flex-wrap items-center gap-2 text-[12px] text-text-muted mb-6">
          <Link href="/" className="hover:text-text-secondary transition-colors">Home</Link>
          <span className="text-text-disabled">/</span>
          <Link href="/blog" className="hover:text-text-secondary transition-colors">Blog</Link>
          {categorySlug && (
            <>
              <span className="text-text-disabled">/</span>
              <Link href={`/blog/${categorySlug}`} className="hover:text-text-secondary transition-colors">
                {getLabelFromSlug(categorySlug)}
              </Link>
            </>
          )}
          <span className="text-text-disabled">/</span>
          <span className="text-text-secondary line-clamp-1">{post.fields.title}</span>
        </nav>

        {categorySlug && (
          <Link
            href={`/blog/${categorySlug}`}
            className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-pill bg-accent-dim text-accent"
          >
            {getLabelFromSlug(categorySlug)}
          </Link>
        )}

        <h1 className="h1 !text-[34px] md:!text-[46px] mt-[18px]">{post.fields.title}</h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3.5 mt-[26px]">
          {authorName && (
            (() => {
              const chip = (
                <span className="flex items-center gap-[11px]">
                  <span className="w-10 h-10 rounded-full bg-raised border-[0.5px] border-border flex items-center justify-center text-[14px] font-bold text-accent flex-none overflow-hidden relative">
                    {authorPhotoUrl ? (
                      <Image
                        src={`${authorPhotoUrl}?w=80&h=80&fit=fill`}
                        alt={authorName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      initials(authorName)
                    )}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[14px] font-bold text-text">{authorName}</span>
                    {authorEntry?.fields.designation && (
                      <span className="text-[12px] text-text-muted">{authorEntry.fields.designation}</span>
                    )}
                  </span>
                </span>
              )
              return authorSlug ? (
                <Link href={`/blog/author/${authorSlug}`} className="hover:opacity-80 transition-opacity">
                  {chip}
                </Link>
              ) : chip
            })()
          )}
          {authorName && <span className="w-px h-8 bg-border" />}
          {published && <MetaStat label="Published" value={formatDate(published)} />}
          {showUpdated && <MetaStat label="Updated" value={formatDate(updated)} accent />}
          <MetaStat label="Read" value={`${readMinutes} min`} />
        </div>
      </section>

      {/* Featured image */}
      {coverUrl && (
        <section className="max-w-[760px] mx-auto px-5 pt-8">
          <div className="aspect-[16/8] relative rounded-[16px] border-[0.5px] border-border overflow-hidden">
            <Image
              src={`${coverUrl}?w=1600&h=800&fit=fill`}
              alt={post.fields.coverImage?.fields?.title || post.fields.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>
      )}

      {/* Body — sidebar + prose */}
      <section className="max-w-[1100px] mx-auto px-5 md:px-10 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 lg:gap-14">
          <aside className="hidden lg:block">
            <PostSidebar
              toc={faqs.length > 0 ? [...toc, { id: 'faq', text: 'FAQ', level: 2 }] : toc}
              url={postUrl}
              title={post.fields.title}
            />
          </aside>

          <div className="max-w-[680px]">
            <article>
              {documentToReactComponents(
                post.fields.body as Parameters<typeof documentToReactComponents>[0],
                richTextOptions as unknown as Parameters<typeof documentToReactComponents>[1]
              )}
            </article>

            {/* Inline CTA */}
            <div className="mt-10 bg-accent rounded-[14px] px-6 py-[22px] flex flex-wrap items-center justify-between gap-4">
              <div className="text-base">
                <div className="text-[11px] font-bold uppercase tracking-[0.1em] opacity-60">
                  Skip the research
                </div>
                <div className="text-[19px] font-extrabold tracking-[-0.5px] mt-0.5">
                  Looking for a gym near you?
                </div>
              </div>
              <Link
                href="/cities"
                className="bg-base text-accent font-bold text-[13px] px-[18px] py-[11px] rounded-[8px] inline-flex items-center gap-2 whitespace-nowrap hover:bg-raised transition-colors"
              >
                Search gyms near you
                <i className="ti ti-arrow-right" />
              </Link>
            </div>

            {/* FAQ */}
            {faqs.length > 0 && (
              <div id="faq" className="mt-14 scroll-mt-[90px]">
                <div className="label mb-2">FAQ</div>
                <h2 className="h2 !text-[28px] mb-6">Frequently asked questions</h2>
                <div className="flex flex-col gap-3">
                  {faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="bg-surface border-[0.5px] border-border rounded-[12px] group"
                    >
                      <summary className="p-4 cursor-pointer text-[15px] font-semibold text-text list-none flex items-center justify-between gap-4 hover:text-accent transition-colors">
                        {faq.q}
                        <i className="ti ti-chevron-down text-[16px] text-accent flex-none group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-4 pb-4 pt-3 border-t-[0.5px] border-border text-[14px] leading-[1.7] text-text-secondary">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Post footer: tags + author box */}
      <section className="max-w-[1100px] mx-auto px-5 md:px-10 pt-14">
        <div className="max-w-[760px] lg:ml-auto">
          {/* Tags */}
          {(post.fields.categories?.length ?? 0) > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="label !text-text-muted mr-1.5">Tags</span>
              {post.fields.categories!.map(c => (
                <Link
                  key={c}
                  href={`/blog/${c}`}
                  className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-[8px] bg-raised border-[0.5px] border-border text-text-secondary hover:border-accent hover:text-accent transition-all"
                >
                  {getLabelFromSlug(c)}
                </Link>
              ))}
            </div>
          )}

          {/* Author box (EEAT) */}
          {authorEntry && (
            <div className="mt-9 bg-surface border-[0.5px] border-border rounded-[16px] p-6 flex flex-wrap gap-5">
              <div className="w-[72px] h-[72px] rounded-[14px] border-[0.5px] border-border overflow-hidden relative flex-none bg-raised">
                {authorPhotoUrl ? (
                  <Image
                    src={`${authorPhotoUrl}?w=144&h=144&fit=fill`}
                    alt={authorEntry.fields.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[20px] font-bold text-accent">
                    {initials(authorEntry.fields.name)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-[240px]">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    href={`/blog/author/${authorEntry.fields.slug}`}
                    className="text-[18px] font-bold tracking-[-0.4px] text-text hover:text-white transition-colors"
                  >
                    {authorEntry.fields.name}
                  </Link>
                  {authorEntry.fields.verified && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-[9px] py-1 rounded-[8px] bg-accent-dim text-accent">
                      <i className="ti ti-rosette-discount-check-filled text-[13px]" />
                      Verified
                    </span>
                  )}
                </div>
                {(authorEntry.fields.designation || authorEntry.fields.credentials?.length) && (
                  <p className="text-[13px] text-text-muted mt-1">
                    {[authorEntry.fields.designation, authorEntry.fields.credentials?.join(', ')]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}
                {authorEntry.fields.bio && (
                  <p className="text-[14px] leading-[1.6] text-text-secondary mt-3">
                    {authorEntry.fields.bio.split(/\n\s*\n/)[0]}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-3.5">
                  <Link
                    href={`/blog/author/${authorEntry.fields.slug}`}
                    className="inline-flex items-center gap-2 text-[13px] font-bold text-accent border-[0.5px] border-accent rounded-[8px] px-3.5 py-2 hover:border-border-hi transition-colors"
                  >
                    View profile
                    <i className="ti ti-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-16">
          <div className="flex items-end justify-between gap-6 mb-7">
            <div>
              <div className="label mb-2">Keep reading</div>
              <h2 className="h2">Related articles</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map(p => (
              <PostCard key={p.sys.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
