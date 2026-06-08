import { client } from '@/sanity/lib/client'
import { postQuery, postsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'

export async function generateStaticParams() {
  const posts = await client.fetch(postsQuery)
  return posts.map((post: { slug: { current: string } }) => ({
    slug: post.slug.current,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch(postQuery, { slug })
  if (!post) return {}
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.coverImage
        ? [urlFor(post.coverImage).width(1200).height(630).url()]
        : [],
    },
  }
}

const ptComponents = {
  types: {
    image: ({ value }: { value: { alt?: string } }) => (
      <img
        src={urlFor(value).width(800).url()}
        alt={value.alt || ''}
        className="rounded-lg my-8 w-full"
      />
    ),
  },
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await client.fetch(postQuery, { slug })

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

        {post.categories?.[0] && (
          <span className="text-xs text-[#888] uppercase tracking-wider">
            {post.categories[0].title}
          </span>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-[#666] mb-8">
          {post.author?.name && <span>By {post.author.name}</span>}
          {post.publishedAt && (
            <span>
              {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
        </div>

        {post.coverImage && (
          <img
            src={urlFor(post.coverImage).width(800).height(450).url()}
            alt={post.coverImage.alt || post.title}
            className="w-full rounded-xl mb-10 aspect-video object-cover"
          />
        )}

        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white
          prose-p:text-[#C0C0C0]
          prose-a:text-[#E0E0E0] prose-a:underline
          prose-strong:text-white
          prose-li:text-[#C0C0C0]
          prose-blockquote:border-[#444] prose-blockquote:text-[#999]
          prose-code:text-[#E0E0E0] prose-code:bg-[#1A1A1A]
        ">
          <PortableText value={post.body} components={ptComponents} />
        </div>
      </div>
    </main>
  )
}
