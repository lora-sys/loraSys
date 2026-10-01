export const searchKinds = ['project', 'article', 'note', 'lab', 'page', 'talk', 'archive'] as const
export type SearchKind = (typeof searchKinds)[number]
export type SearchType = SearchKind | 'all'
export const SEARCH_KIND_FILTER = 'search-kind'

export function searchKindForPath(pathname: string, baseUrl = '/'): SearchKind {
  const base = baseUrl.replace(/\/$/, '')
  const hasBase = base && (pathname === base || pathname.startsWith(`${base}/`))
  const path = hasBase ? pathname.slice(base.length) || '/' : pathname
  if (/^\/(?:projects|en\/work|en\/projects)(?:\/|$)/.test(path)) return 'project'
  if (/^\/(?:blog|en\/writing)(?:\/|$)/.test(path)) return 'article'
  if (/^\/notes(?:\/|$)/.test(path)) return 'note'
  if (/^\/lab(?:\/|$)/.test(path)) return 'lab'
  if (/^\/talks(?:\/|$)/.test(path)) return 'talk'
  if (/^\/(?:archives|tags)(?:\/|$)/.test(path)) return 'archive'
  return 'page'
}

export function searchType(value: string | null | undefined): SearchType {
  return searchKinds.includes(value as SearchKind) ? (value as SearchKind) : 'all'
}

export function searchKindFilters(type: SearchType) {
  return { [SEARCH_KIND_FILTER]: type === 'all' ? [] : [type] }
}

export interface SearchState {
  query: string
  type: SearchType
  filters: Record<string, string[]>
}

const publicFilters = ['主题', '内容类型', 'Topics', 'Content type']

export function readSearchState(params: URLSearchParams): SearchState {
  const filters: SearchState['filters'] = {}
  for (const entry of params.getAll('filter')) {
    const separator = entry.indexOf(':')
    const key = entry.slice(0, separator)
    const value = entry.slice(separator + 1)
    if (separator < 0 || !publicFilters.includes(key) || !value) continue
    const values = (filters[key] ??= [])
    if (!values.includes(value)) values.push(value)
  }
  return { query: params.get('q') ?? '', type: searchType(params.get('type')), filters }
}

export function writeSearchState(url: URL, state: SearchState): URL {
  const next = new URL(url)
  if (state.query.trim()) next.searchParams.set('q', state.query)
  else next.searchParams.delete('q')
  if (state.type !== 'all') next.searchParams.set('type', state.type)
  else next.searchParams.delete('type')
  next.searchParams.delete('filter')
  for (const [key, values] of Object.entries(state.filters)) {
    if (!publicFilters.includes(key)) continue
    for (const value of new Set(values)) next.searchParams.append('filter', `${key}:${value}`)
  }
  return next
}
