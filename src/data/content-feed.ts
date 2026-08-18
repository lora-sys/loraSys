export type ContentFeedKind = 'Writing' | 'Project'

export interface ContentFeedItem {
  kind: ContentFeedKind
  title: string
  meta: string
  href: string
  relation?: string
}

/**
 * Content Feed is intentionally derived from first-party site data:
 * blog collection entries and GitHub-synced project snapshots. Public social
 * profiles remain channels, not fabricated individual posts.
 */
export const CONTENT_FEED_FILTERS: Array<'All' | ContentFeedKind> = [
  'All',
  'Writing',
  'Project'
]
