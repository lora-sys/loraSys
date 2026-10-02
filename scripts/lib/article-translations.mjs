/**
 * A translation points to a published original, never to another translation.
 * The original stays untouched so upstream content synchronization remains independent.
 * @param {{id: string, language?: string, translationOf?: string, draft?: boolean}[]} articles
 * @returns {string[]}
 */
export function validateArticleTranslations(articles) {
  const errors = []
  const byId = new Map(articles.map((article) => [article.id, article]))
  const editions = new Set()
  for (const article of articles) {
    const sourceId = article.translationOf
    if (sourceId === undefined) continue
    if (typeof sourceId !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sourceId)) {
      errors.push(`${article.id}: translationOf must be an article slug`)
      continue
    }
    const source = byId.get(sourceId)
    if (!source) {
      errors.push(`${article.id}: translation source ${sourceId} does not exist`)
      continue
    }
    if (source.id === article.id) errors.push(`${article.id}: translation cannot refer to itself`)
    if (source.translationOf !== undefined)
      errors.push(`${article.id}: translation source must be an original, not another translation`)
    const language = article.language ?? 'zh-CN'
    const sourceLanguage = source.language ?? 'zh-CN'
    if (!['zh-CN', 'en-US'].includes(language) || !['zh-CN', 'en-US'].includes(sourceLanguage))
      errors.push(`${article.id}: translation pairs require supported zh-CN or en-US languages`)
    if (language === sourceLanguage)
      errors.push(`${article.id}: translation and original must use different languages`)
    if (!article.draft && source.draft)
      errors.push(`${article.id}: a published translation cannot refer to a draft original`)
    const key = `${sourceId}:${language}`
    if (editions.has(key)) errors.push(`${article.id}: duplicate ${language} translation of ${sourceId}`)
    editions.add(key)
  }
  return errors
}
