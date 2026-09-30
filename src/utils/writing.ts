import taxonomy from '@/data/writing-taxonomy.json'
import type { SiteLocale } from '@/i18n/site'

export type ContentType = keyof typeof taxonomy.contentTypes
export type WritingTopic = keyof typeof taxonomy.topics
export type WritingSeries = keyof typeof taxonomy.series
export type WritingKind = 'type' | 'topic' | 'series'
export const contentTypeIds = Object.keys(taxonomy.contentTypes) as [ContentType, ...ContentType[]]
export const topicIds = Object.keys(taxonomy.topics) as [WritingTopic, ...WritingTopic[]]
export const seriesIds = Object.keys(taxonomy.series) as [WritingSeries, ...WritingSeries[]]
export const writingGroups = {
  type: taxonomy.contentTypes,
  topic: taxonomy.topics,
  series: taxonomy.series
}
export const writingLabel = (kind: WritingKind, id: string, locale: SiteLocale = 'zh-CN') => {
  const labels = writingGroups[kind] as Record<string, Record<SiteLocale, string>>
  return labels[id]?.[locale] ?? id
}
export const writingPath = (kind: WritingKind, id: string, locale: SiteLocale = 'zh-CN') =>
  `${locale === 'en-US' ? '/en/writing' : '/blog'}/${kind}/${id}`
