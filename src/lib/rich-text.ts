/**
 * Helpers for Contentful rich text documents — TOC extraction, heading
 * anchors and read-time estimation. Client-safe (no SDK import).
 */

type RichNode = {
  nodeType?: string
  value?: string
  content?: RichNode[]
}

export type TocItem = { id: string; text: string; level: 2 | 3 }

export function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function nodeText(node: RichNode): string {
  if (typeof node.value === 'string') return node.value
  return (node.content ?? []).map(nodeText).join('')
}

export function extractToc(doc: unknown): TocItem[] {
  const root = doc as RichNode
  const items: TocItem[] = []
  for (const node of root?.content ?? []) {
    if (node.nodeType === 'heading-2' || node.nodeType === 'heading-3') {
      const text = nodeText(node).trim()
      if (text) {
        items.push({
          id: slugifyHeading(text),
          text,
          level: node.nodeType === 'heading-2' ? 2 : 3,
        })
      }
    }
  }
  return items
}

export function estimateReadMinutes(doc: unknown): number {
  const words = nodeText((doc as RichNode) ?? {}).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
