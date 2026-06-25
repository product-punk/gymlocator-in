import { getAllPosts } from '@/lib/contentful'
import { Metadata } from 'next'
import BlogHubClient from './_components/BlogHubClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fitness Hub — Workout Guides, Gym Reviews & Nutrition',
  description:
    'Expert workout guides, honest gym reviews, and nutrition advice for fitness in India. The Gymlocator Fitness Hub.',
  openGraph: {
    title: 'Fitness Hub — Workout Guides, Gym Reviews & Nutrition | Gymlocator.in',
    description:
      'Expert workout guides, honest gym reviews, and nutrition advice for fitness in India.',
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  return <BlogHubClient posts={posts} />
}
