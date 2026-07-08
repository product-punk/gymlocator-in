import { getAllPosts } from '@/lib/contentful'
import { Metadata } from 'next'
import BlogHubClient from './_components/BlogHubClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fitness Hub - Workout Guides, Gym Reviews & Nutrition',
  description:
    'Expert workout guides, honest gym reviews, and nutrition advice for fitness in India. The Gymlocator Fitness Hub.',
  openGraph: {
    title: 'Fitness Hub - Workout Guides, Gym Reviews & Nutrition | Gymlocator.in',
    description:
      'Expert workout guides, honest gym reviews, and nutrition advice for fitness in India.',
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        name: 'Gymlocator Fitness Hub',
        description:
          'Expert workout guides, honest gym reviews, and nutrition advice for fitness in India.',
        url: 'https://gymlocator.in/blog',
        blogPost: posts.slice(0, 20).map(p => ({
          '@type': 'BlogPosting',
          headline: p.fields.title,
          url: `https://gymlocator.in/blog/${p.fields.slug}`,
          datePublished: p.fields.publishedDate,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gymlocator.in' },
          { '@type': 'ListItem', position: 2, name: 'Blog' },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogHubClient posts={posts} />
    </>
  )
}
