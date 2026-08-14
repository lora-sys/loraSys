export type FriendLinkStatus = 'active' | 'offline' | 'retired'

export interface FriendLink {
  name: string
  url: string
  description: string
  avatar?: string
  /** Offline links stay visible in the status archive instead of the constellation. */
  status: FriendLinkStatus
  since?: string
  note?: string
}

/**
 * Only verified, reciprocal connections belong here. An empty collection is intentional:
 * the page renders an open constellation rather than inventing people to fill the design.
 */
export const friendLinks: FriendLink[] = []

export const linkApplication = [
  { label: 'Name', value: 'Lora' },
  { label: 'Desc', value: 'AI Agent Developer & Full-stack Engineer' },
  { label: 'Link', value: 'https://lora-sys.github.io/loraSys/' },
  {
    label: 'Avatar',
    value: 'https://lora-sys.github.io/loraSys/favicon/android-chrome-512x512.png'
  }
] as const

export const linkApplicationText = linkApplication
  .map(({ label, value }) => `${label}: ${value}`)
  .join('\n')
