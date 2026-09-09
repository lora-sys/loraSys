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
  { label: '名称', value: 'Lora' },
  { label: '简介', value: 'AI Agent 开发者与全栈工程师' },
  { label: '网址', value: 'https://lora-sys.github.io/loraSys/' },
  {
    label: '头像',
    value: 'https://lora-sys.github.io/loraSys/favicon/lora-v1-mark-512.png'
  }
] as const

export const linkApplicationText = linkApplication
  .map(({ label, value }) => `${label}: ${value}`)
  .join('\n')
