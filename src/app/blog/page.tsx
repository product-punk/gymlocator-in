import { getAllPosts } from '@/lib/contentful'
import Link from 'next/link'
import { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Gym & Fitness Blog – Tips, Guides & More | Gymlocator',
  description:
    'Gym membership guides, fitness tips, workout advice and city-wise gym comparisons across India.',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

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
            {posts.map((post: any) => (
              <Link
                key={post.sys.id}
                href={`/blog/${post.fields.slug}`}
                className="group block bg-[#141414] rounded-xl overflow-hidden border border-[#222] hover:border-[#444] transition-colors"
              >
                {post.fields.coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={`https:${post.fields.coverImage.fields.file.url}?w=600&h=338&fit=fill`}
                      alt={post.fields.coverImage.fields.title || post.fields.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.fields.categories?.[0] && (
                    <span className="text-xs text-[#888] uppercase tracking-wider">
                      {post.fields.categories[0]}
                    </span>
                  )}
                  <h2 className="text-white font-semibold text-lg mt-2 mb-3 line-clamp-2">
                    {post.fields.title}
                  </h2>
                  {post.fields.excerpt && (
                    <p className="text-[#888] text-sm line-clamp-3">
                      {post.fields.excerpt}
                    </p>
                  )}
                  <div className="mt-4 text-xs text-[#666]">
                    {post.fields.publishedDate
                      ? new Date(post.fields.publishedDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : ''}
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
