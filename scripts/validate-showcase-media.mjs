import { access } from 'node:fs/promises'
import path from 'node:path'

import { anime, favorites } from '../src/data/showcase.ts'

const groups = [
  ['anime', anime],
  ['favorites', favorites]
]

const errors = []

for (const [group, items] of groups) {
  for (const item of items) {
    const label = `${group}: ${item.name}`
    if (!item.image) {
      errors.push(`${label} is missing an image`)
      continue
    }

    const isRemote = /^https:\/\//.test(item.image)
    if (!item.name || !item.description || !item.href) errors.push(`${label} is missing archive identity copy`)
    if (item.href && /^https:\/\//.test(item.href) === false) errors.push(`${label} has a non-HTTPS external destination`)
    if (isRemote) {
      if (!item.posterSource) errors.push(`${label} uses remote media without posterSource provenance`)
      if (!item.sourceLabel) errors.push(`${label} uses remote media without sourceLabel provenance`)
    } else {
      if (!item.posterSource) errors.push(`${label} is missing posterSource provenance`)
      if (!item.sourceLabel) errors.push(`${label} is missing sourceLabel provenance`)
      const relative = item.image.replace(/^\//, '')
      const file = path.resolve('public', relative)
      try {
        await access(file)
      } catch {
        errors.push(`${label} references missing local media: ${item.image}`)
      }
    }

    if (group === 'anime') {
      if (!item.objectPosition) errors.push(`${label} is missing a focal point`)
      if (!item.broadcastPalette || item.broadcastPalette.length !== 2) errors.push(`${label} needs two broadcast palette colors`)
      if (!item.broadcastMotion || item.broadcastMotion.duration < 6 || item.broadcastMotion.duration > 14) errors.push(`${label} needs a bounded broadcast motion duration`)
    }

    if (group === 'anime' && /-card\.svg$/i.test(item.image)) {
      errors.push(`${label} still uses a generated placeholder card instead of poster media`)
    }

    if (item.objectPosition && !/^\s*\d+(?:\.\d+)?%\s+\d+(?:\.\d+)?%\s*$/.test(item.objectPosition)) {
      errors.push(`${label} has invalid objectPosition: ${item.objectPosition}`)
    }

    if (item.mediaKind && !['poster', 'cover', 'artwork'].includes(item.mediaKind)) {
      errors.push(`${label} has unsupported mediaKind: ${item.mediaKind}`)
    }
  }
}

if (errors.length) {
  console.error('Showcase media validation failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Validated ${anime.length} anime items and ${favorites.length} favorites.`)
