import type { SiteLocale } from './site'

// UI language belongs to the page, not to repository names or article bodies.
export const uiLocale = (pathname: string): SiteLocale => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const local = base && (pathname === base || pathname.startsWith(`${base}/`)) ? pathname.slice(base.length) : pathname
  return /^\/en(?:\/|$)/.test(local) ? 'en-US' : 'zh-CN'
}
export const text = (locale: SiteLocale, zh: string, en: string) => locale === 'en-US' ? en : zh
export const dateLabel = (value: Date | string, locale: SiteLocale) =>
  new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(value))
const labels: Record<string, string> = {
  building: '构建中', active: '持续维护', archived: '已归档', High: '优先', Medium: '后续', 'Build note': '构建笔记', 'Project update': '项目进展', 'Lab note': '实验笔记',
  'Featured work without a Story': '精选项目尚无关联记录', 'Active build needs context': '构建中的项目需要说明', 'Recent repository push': '最近有代码更新',

  'Featured': '精选', 'Open Source': '开源', 'AI Agents': '智能体',
  'Tools': '开发工具', 'Apps': '应用', 'Learning': '学习实验', 'Web3': 'Web3',
  'Contribution': '外部贡献', 'Hackathon': '黑客松', 'Multimodal': '多模态',
  'Agent Skill': '智能体技能', 'Claude Skill': 'Claude 技能', 'AI Agent': '智能体',
  'Image Generation': '图像生成', 'Video Generation': '视频生成', 'Multi-Agent': '多智能体',
  'Writing': '文章', 'Video': '视频', 'Channel': '创作者主页', 'Project': '项目',
  'Agent Systems': '智能体系统', 'Multimodal Tools': '多模态工具', 'Building in Public': '公开构建',
  'All': '全部', 'External': '外部贡献', 'Building': '构建中', 'Maintained': '持续维护', 'Archived': '已归档'
}
export const displayLabel = (value: string, locale: SiteLocale) => locale === 'en-US' ? value : labels[value] ?? value
