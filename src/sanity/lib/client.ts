import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'o0nhrf5u',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
