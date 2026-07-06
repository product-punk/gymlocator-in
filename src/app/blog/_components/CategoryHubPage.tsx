import Link from 'next/link'
import type { BlogPost } from '@/lib/contentful'
import type { BlogCategory } from '@/lib/blog-categories'
import BlogCategoryNav from './BlogCategoryNav'
import PostCard from './PostCard'

export default function CategoryHubPage({
  category,
  posts,
}: {
  category: BlogCategory
  posts: BlogPost[]
}) {
  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="bb-hair">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-16 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] text-text-muted mb-6">
            <Link href="/" className="hover:text-text transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-text transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-text-secondary">{category.label}</span>
          </nav>

          <div className="label flex items-center gap-2 mb-[18px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009A6B] inline-block" />
            Fitness Hub
          </div>
          <h1 className="h1 max-w-[760px]">{category.label}</h1>
          <p className="mt-[18px] max-w-[560px] text-[16px] leading-[1.6] text-text-secondary">
            {category.description}
          </p>
        </div>
      </section>

      <BlogCategoryNav activeSlug={category.slug} />

      {/* Posts grid */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-14">
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-text-muted text-[15px]">No articles in this category yet — check back soon.</p>
            <Link
              href="/blog"
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
            >
              <i className="ti ti-arrow-left" />
              Back to all articles
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between mb-7">
              <div>
                <div className="label mb-2">{posts.length} article{posts.length !== 1 ? 's' : ''}</div>
                <h2 className="h2">{category.label}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map(p => (
                <PostCard key={p.sys.id} post={p} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
