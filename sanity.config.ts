import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'gymlocator',
  title: 'Gymlocator.in',
  projectId: 'o0nhrf5u',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev) => prev,
  },
})
