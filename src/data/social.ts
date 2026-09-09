export type SocialIcon =
  | 'github-circle'
  | 'linkedin'
  | 'x'
  | 'peerlist'
  | 'youtube'
  | 'bilibili'
  | 'zhihu'
  | 'xiaohongshu'
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
  },
  {
    name: '小红书',
    handle: '63887411156',
    description: '中文内容、项目记录与创作日常。',
    href: 'https://www.xiaohongshu.com/user/profile/63887411156',
    icon: 'xiaohongshu',
    brand: '#ff2442'
  }
]

export const primarySocialLinks = socialLinks.filter((link) => link.primary)
export const secondarySocialLinks = socialLinks.filter((link) => !link.primary)

const descriptions: Record<SocialIcon, [string, string]> = {
  "email": [
    "项目讨论与合作提议。",
    "Project discussions and collaboration proposals."
  ],
  "github-circle": [
    "源码、问题记录与开源协作。",
    "Source code, issues and open-source collaboration."
  ],
  "linkedin": [
    "工作经历与职业交流。",
    "Professional experience and career conversations."
  ],
  "x": [
    "短笔记与正在探索的想法。",
    "Short notes and ideas in progress."
  ],
  "peerlist": [
    "开发者资料、项目发布与更新。",
    "Builder profile, project releases and updates."
  ],
  "youtube": [
    "项目视频与实验演示。",
    "Project videos and experiment demos."
  ],
  "bilibili": [
    "中文视频、项目演示与开发记录。",
    "Chinese videos, project demos and build logs."
  ],
  "zhihu": [
    "中文技术文章与学习记录。",
    "Chinese technical articles and learning notes."
  ],
  "xiaohongshu": [
    "中文内容、项目记录与创作日常。",
    "Chinese posts, project notes and creative work."
  ]
}
export const localizedSocial = (link: SocialLink, locale: 'zh-CN' | 'en-US'): SocialLink => ({
  ...link,
  name: locale === 'en-US' ? ({ '知乎': 'Zhihu', '小红书': 'Xiaohongshu' }[link.name] ?? link.name) : link.name === 'Email' ? '邮箱' : link.name,
  description: descriptions[link.icon][locale === 'en-US' ? 1 : 0]
})
