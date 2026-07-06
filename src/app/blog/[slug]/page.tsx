import { getAllPosts, getPostBySlug, getPostsByCategory, authorNameToSlug } from '@/lib/contentful'
import { getCategoryBySlug, getLabelFromSlug, BLOG_CATEGORIES } from '@/lib/blog-categories'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import CategoryHubPage from '../_components/CategoryHubPage'

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
      images: post.fields.coverImage
        ? [`https:${post.fields.coverImage.fields.file.url}?w=1200&h=630&fit=fill`]
        : [],
    },
  }
}

const richTextOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: unknown, children: React.ReactNode) => (
      <p className="mb-6 text-[#C0C0C0] leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: unknown, children: React.ReactNode) => (
      <h1 className="text-3xl font-bold text-white mt-10 mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: unknown, children: React.ReactNode) => (
      <h2 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: unknown, children: React.ReactNode) => (
      <h3 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node: unknown, children: React.ReactNode) => (
      <ul className="list-disc list-inside mb-6 text-[#C0C0C0] space-y-2">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: unknown, children: React.ReactNode) => (
      <ol className="list-decimal list-inside mb-6 text-[#C0C0C0] space-y-2">{children}</ol>
    ),
    [BLOCKS.QUOTE]: (node: unknown, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-[#444] pl-6 my-6 text-[#999] italic">
        {children}
      </blockquote>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node: unknown) => {
      const n = node as { data: { target: { fields: { file: { url: string }; title: string } } } }
      const { file, title } = n.data.target.fields
      return (
        <img
          src={`https:${file.url}`}
          alt={title || ''}
          className="rounded-lg my-8 w-full"
        />
      )
    },
    [INLINES.HYPERLINK]: (node: unknown, children: React.ReactNode) => {
      const n = node as { data: { uri: string } }
      return (
        <a
          href={n.data.uri}
          className="text-white underline hover:text-[#E0E0E0]"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    },
  },
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

  const postJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.fields.title,
        description: post.fields.seoDescription || post.fields.excerpt,
        url: `https://gymlocator.in/blog/${post.fields.slug}`,
        image: post.fields.coverImage?.fields?.file?.url
          ? `https:${post.fields.coverImage.fields.file.url}`
          : undefined,
        datePublished: post.fields.publishedDate,
        dateModified: post.sys.updatedAt,
        author: post.fields.author
          ? {
              '@type': 'Person',
              name: post.fields.author,
              url: `https://gymlocator.in/blog/author/${authorNameToSlug(post.fields.author)}`,
            }
          : undefined,
        publisher: {
          '@type': 'Organization',
          name: 'Gymlocator.in',
          logo: { '@type': 'ImageObject', url: 'https://gymlocator.in/logo.png' },
        },
        mainEntityOfPage: `https://gymlocator.in/blog/${post.fields.slug}`,
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
    ],
  }

  return (
    <main className="min-h-screen bg-[#0C0C0C] text-[#E0E0E0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="text-[#888] hover:text-white text-sm mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        {categorySlug && (
          <Link
            href={`/blog/${categorySlug}`}
            className="text-xs text-[#888] uppercase tracking-wider hover:text-white transition-colors block"
          >
            {getLabelFromSlug(categorySlug)}
          </Link>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
          {post.fields.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-[#666] mb-8">
          {post.fields.author && (
            <Link
              href={`/blog/author/${authorNameToSlug(post.fields.author)}`}
              className="hover:text-white transition-colors"
            >
              By {post.fields.author}
            </Link>
          )}
          {post.fields.publishedDate && (
            <span>
              {new Date(post.fields.publishedDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
        </div>

        {post.fields.coverImage && (
          <img
            src={`https:${post.fields.coverImage.fields.file.url}?w=800&h=450&fit=fill`}
            alt={post.fields.coverImage.fields.title || post.fields.title}
            className="w-full rounded-xl mb-10 aspect-video object-cover"
          />
        )}

        <div>
          {documentToReactComponents(
          post.fields.body as Parameters<typeof documentToReactComponents>[0],
          richTextOptions as unknown as Parameters<typeof documentToReactComponents>[1]
        )}
        </div>
      </div>
    </main>
  )
}
