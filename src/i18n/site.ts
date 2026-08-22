export type SiteLocale = 'zh-CN' | 'en-US'

export const DEFAULT_LOCALE: SiteLocale = 'zh-CN'

export const isEnglishPath = (pathname: string) => /^\/en(?:\/|$)/.test(pathname)
export const getLocale = (pathname: string): SiteLocale => (isEnglishPath(pathname) ? 'en-US' : 'zh-CN')

const zhToEn: Record<string, string> = {
  '/': '/en/',
  '/projects': '/en/work',
  '/blog': '/en/writing',
  '/now': '/en/now',
  '/links': '/en/links',
  '/about': '/en/about',
  '/contact': '/en/contact',
  '/guestbook': '/en/guestbook',
  '/resume': '/en/resume'
}

const enToZh = Object.fromEntries(Object.entries(zhToEn).map(([zh, en]) => [en.replace(/\/$/, ''), zh]))

const normalizePath = (pathname: string) => {
  const clean = pathname.replace(/\/+$|^$/g, '')
  return clean || '/'
}

export const localizedPath = (pathname: string, target: SiteLocale): string => {
  const normalized = normalizePath(pathname)
  if (target === 'en-US') {
    if (normalized in zhToEn) return zhToEn[normalized]
    if (normalized.startsWith('/blog/language/')) return '/en/writing'
    if (normalized.startsWith('/blog/')) return `/en/writing/${normalized.slice('/blog/'.length)}`
    return '/en/'
  }
  if (normalized in enToZh) return enToZh[normalized]
  if (normalized.startsWith('/en/writing/')) return `/blog/${normalized.slice('/en/writing/'.length)}`
  return '/'
}

export const primaryNavigation = (locale: SiteLocale) =>
  locale === 'en-US'
    ? [
        { title: 'Work', href: '/en/work' },
        { title: 'Writing', href: '/en/writing' },
        { title: 'Now', href: '/en/now' },
        { title: 'Links', href: '/en/links' },
        { title: 'About', href: '/en/about' }
      ]
    : [
        { title: '作品', href: '/projects' },
        { title: '写作', href: '/blog' },
        { title: '正在构建', href: '/now' },
        { title: '友链', href: '/links' },
        { title: '关于', href: '/about' }
      ]

export const footerNavigation = (locale: SiteLocale) =>
  locale === 'en-US'
    ? [
        { title: 'Notes', href: '/notes' },
        { title: 'Lab', href: '/lab' },
        { title: 'Archive', href: '/archives' },
        { title: 'Guestbook', href: '/en/guestbook' },
        { title: 'Résumé', href: '/en/resume' },
        { title: 'RSS', href: '/rss.xml' }
      ]
    : [
        { title: '短笔记', href: '/notes' },
        { title: '实验室', href: '/lab' },
        { title: '归档', href: '/archives' },
        { title: '留言板', href: '/guestbook' },
        { title: '简历', href: '/resume' },
        { title: 'RSS', href: '/rss.xml' }
      ]

export const localeMeta = (locale: SiteLocale) =>
  locale === 'en-US'
    ? { htmlLang: 'en-US', ogLocale: 'en_US', switchLabel: '中文', contactLabel: 'Contact', searchLabel: 'Search' }
    : { htmlLang: 'zh-CN', ogLocale: 'zh_CN', switchLabel: 'EN', contactLabel: '联系', searchLabel: '搜索' }
