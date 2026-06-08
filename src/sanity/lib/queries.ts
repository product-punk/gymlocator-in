import { groq } from 'next-sanity'

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage,
    "author": author->{ name, image },
    "categories": categories[]->{ title },
  }
`

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    publishedAt,
    coverImage,
    seoTitle,
    seoDescription,
    "author": author->{ name, image, bio },
    "categories": categories[]->{ title },
  }
`

export const recentPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage,
  }
`
