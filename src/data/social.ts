export type SocialIcon =
  | 'github-circle'
  | 'linkedin'
  | 'x'
  | 'peerlist'
  | 'youtube'
  | 'bilibili'
  | 'zhihu'
  | 'email'

export interface SocialLink {
  name: string
  handle: string
  description: string
  href: string
  icon: SocialIcon
  brand: string
  primary?: boolean
}

export const socialLinks: SocialLink[] = [
  {
    name: 'Email',
    handle: 'lorasys@outlook.com',
    description: 'Project ideas, thoughtful conversations, and collaboration proposals.',
    href: 'mailto:lorasys@outlook.com',
    icon: 'email',
    brand: '#0ea5e9',
    primary: true
  },
  {
    name: 'GitHub',
    handle: '@lora-sys',
    description: 'Source code, open-source work, issues, and technical collaboration.',
    href: 'https://github.com/lora-sys',
    icon: 'github-circle',
    brand: '#6e5494',
    primary: true
  },
  {
    name: 'LinkedIn',
    handle: 'lora-sys',
    description: 'Professional context, experience, and longer-term opportunities.',
    href: 'https://www.linkedin.com/in/lora-sys/',
    icon: 'linkedin',
    brand: '#0a66c2',
    primary: true
  },
  {
    name: 'X',
    handle: '@MierPiter33280',
    description: 'Short notes, ideas in progress, and what I am exploring now.',
    href: 'https://x.com/MierPiter33280',
    icon: 'x',
    brand: '#71717a'
  },
  {
    name: 'Peerlist',
    handle: 'mierpiter',
    description: 'Builder profile, shipped work, and project updates.',
    href: 'https://peerlist.io/mierpiter',
    icon: 'peerlist',
    brand: '#00aa45'
  },
  {
    name: 'YouTube',
    handle: '@MierPiter33280',
    description: 'Video demos, experiments, and things that are easier to show than tell.',
    href: 'https://www.youtube.com/@MierPiter33280',
    icon: 'youtube',
    brand: '#ff0033'
  },
  {
    name: 'Bilibili',
    handle: 'Lora',
    description: '中文视频、项目演示与开发记录。',
    href: 'https://space.bilibili.com/431821023',
    icon: 'bilibili',
    brand: '#00aeec'
  },
  {
    name: '知乎',
    handle: 'lorry-23-28-30',
    description: '中文长文、技术思考与学习记录。',
    href: 'https://www.zhihu.com/people/lorry-23-28-30',
    icon: 'zhihu',
    brand: '#0084ff'
  }
]

export const primarySocialLinks = socialLinks.filter((link) => link.primary)
export const secondarySocialLinks = socialLinks.filter((link) => !link.primary)
