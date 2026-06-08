import { getAllPosts, getPostBySlug } from '@/lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post: any) => ({ slug: post.fields.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
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
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
      <p className="mb-6 text-[#C0C0C0] leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: any) => (
      <h1 className="text-3xl font-bold text-white mt-10 mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-disc list-inside mb-6 text-[#C0C0C0] space-y-2">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-decimal list-inside mb-6 text-[#C0C0C0] space-y-2">{children}</ol>
    ),
    [BLOCKS.QUOTE]: (node: any, children: any) => (
      <blockquote className="border-l-4 border-[#444] pl-6 my-6 text-[#999] italic">
        {children}
      </blockquote>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { file, title } = node.data.target.fields
      return (
        <img
          src={`https:${file.url}`}
          alt={title || ''}
          className="rounded-lg my-8 w-full"
        />
      )
    },
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <a
        href={node.data.uri}
        className="text-white underline hover:text-[#E0E0E0]"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-[#0C0C0C] text-[#E0E0E0]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="text-[#888] hover:text-white text-sm mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        {post.fields.categories?.[0] && (
          <span className="text-xs text-[#888] uppercase tracking-wider">
            {post.fields.categories[0]}
          </span>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
          {post.fields.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-[#666] mb-8">
          {post.fields.author && <span>By {post.fields.author}</span>}
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
          {documentToReactComponents(post.fields.body, richTextOptions)}
        </div>
      </div>
    </main>
  )
}
