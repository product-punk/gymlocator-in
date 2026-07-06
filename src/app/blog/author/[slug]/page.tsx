import { getAllAuthors, getAuthorBySlug, getPostsByAuthor } from '@/lib/contentful'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import AuthorPage from '../../_components/AuthorPage'

export const revalidate = 3600

export async function generateStaticParams() {
  const authors = await getAllAuthors()
  return authors.map(a => ({ slug: a.fields.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return {}

  const { name, designation, bio } = author.fields
  const title = designation
    ? `${name} — ${designation} | Gymlocator`
    : `${name} — Author | Gymlocator`
  const description =
    bio?.split(/\n\s*\n/)[0]?.slice(0, 160) ??
    `Read workout guides, gym reviews and fitness articles by ${name} on Gymlocator.`

  const photoUrl = author.fields.photo?.fields?.file?.url

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: photoUrl ? [`https:${photoUrl}?w=1200&h=630&fit=fill`] : [],
    },
  }
}

export default async function BlogAuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const posts = await getPostsByAuthor(author.fields.name)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: author.fields.name,
          jobTitle: author.fields.designation,
          description: author.fields.bio?.split(/\n\s*\n/)[0],
          image: author.fields.photo?.fields?.file?.url
            ? `https:${author.fields.photo.fields.file.url}`
            : undefined,
          sameAs: [
            author.fields.linkedin,
            author.fields.twitter,
            author.fields.instagram,
            author.fields.website,
          ].filter(Boolean),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gymlocator.in' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://gymlocator.in/blog' },
          { '@type': 'ListItem', position: 3, name: author.fields.name },
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
      <AuthorPage author={author} posts={posts} />
    </>
  )
}
