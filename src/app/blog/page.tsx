import { client } from '@/sanity/lib/client'
import { postsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gym & Fitness Blog – Tips, Guides & More | Gymlocator',
  description:
    'Gym membership guides, fitness tips, workout advice and city-wise gym comparisons across India.',
}

export default async function BlogPage() {
  const posts = await client.fetch(postsQuery)

  return (
    <main className="min-h-screen bg-[#0C0C0C] text-[#E0E0E0]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">
          Gym & Fitness Blog
        </h1>
        <p className="text-[#999] mb-12 text-lg">
          Tips, guides and gym comparisons across India.
        </p>

        {posts.length === 0 ? (
          <p className="text-[#666]">No posts published yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: {
              _id: string
              title: string
              slug: { current: string }
              excerpt?: string
              publishedAt?: string
              coverImage?: { alt?: string }
              categories?: { title: string }[]
            }) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group block bg-[#141414] rounded-xl overflow-hidden border border-[#222] hover:border-[#444] transition-colors"
              >
                {post.coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={urlFor(post.coverImage).width(600).height(338).url()}
                      alt={post.coverImage.alt || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.categories?.[0] && (
                    <span className="text-xs text-[#888] uppercase tracking-wider">
                      {post.categories[0].title}
                    </span>
                  )}
                  <h2 className="text-white font-semibold text-lg mt-2 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-[#888] text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 text-xs text-[#666]">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Draft'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
