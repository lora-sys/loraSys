import taxonomy from '../../src/data/writing-taxonomy.json' with { type: 'json' }

export { taxonomy }

export function readFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) throw new Error('YAML frontmatter is required')
  const data = Bun.YAML.parse(match[1])
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error('frontmatter must be an object')
  return { data, header: match[1], body: source.slice(match[0].length), prefix: match[0] }
}

export function validateClassification(data) {
  const errors = []
  if (!Object.hasOwn(taxonomy.contentTypes, data.contentType ?? ''))
    errors.push('contentType is required and must match writing-taxonomy.json')
  if (!Array.isArray(data.topics) || data.topics.length < 1 || data.topics.length > 5)
    errors.push('topics must contain 1–5 normalized topic IDs')
  else {
    if (new Set(data.topics).size !== data.topics.length)
      errors.push('topics must not contain duplicates')
    for (const topic of data.topics)
      if (typeof topic !== 'string' || !Object.hasOwn(taxonomy.topics, topic))
        errors.push(`unknown topic: ${String(topic)}`)
  }
  if (data.series !== undefined && !Object.hasOwn(taxonomy.series, data.series))
    errors.push(`unknown series: ${String(data.series)}`)
  if (data.series === 'agent-engineering-reading' && data.contentType !== 'news')
    errors.push('agent-engineering-reading belongs to the news content type')
  return errors
}

// Source identity is resolved by the caller. A title or tag is never a fallback type.
export function mapSourceClassification(source, sourceType) {
  const mapping = taxonomy.sourceMappings[source]?.[sourceType]
  if (!mapping)
    throw new Error(`Unmapped source type: ${source}/${sourceType}; review before publication`)
  return { ...mapping }
}

export function normalizeSourceTopics(labels) {
  return [
    ...new Set(
      labels.map((label) => {
        if (Object.hasOwn(taxonomy.topics, label)) return label
        const normalized = taxonomy.sourceTopicAliases[label]
        if (!normalized)
          throw new Error(`Unmapped source topic: ${label}; review before publication`)
        return normalized
      })
    )
  ]
}

export function validateSourceClassification(source, sourceType, data) {
  const expected = mapSourceClassification(source, sourceType)
  const errors = validateClassification(data)
  for (const [key, value] of Object.entries(expected)) {
    if (data[key] !== value) errors.push(`${source}/${sourceType} requires ${key}: ${value}`)
  }
  return errors
}
