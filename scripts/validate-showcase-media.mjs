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
    if (!item.name || !item.description || !item.href)
      errors.push(`${label} is missing archive identity copy`)
    if (item.href && /^https:\/\//.test(item.href) === false)
      errors.push(`${label} has a non-HTTPS external destination`)
    if (isRemote) {
      if (!item.posterSource)
        errors.push(`${label} uses remote media without posterSource provenance`)
      if (!item.sourceLabel)
        errors.push(`${label} uses remote media without sourceLabel provenance`)
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
      if (!item.broadcastPalette || item.broadcastPalette.length !== 2)
        errors.push(`${label} needs two broadcast palette colors`)
      if (
        !item.broadcastMotion ||
        item.broadcastMotion.duration < 6 ||
        item.broadcastMotion.duration > 14
      )
        errors.push(`${label} needs a bounded broadcast motion duration`)
    }

    if (group === 'anime' && /-card\.svg$/i.test(item.image)) {
      errors.push(`${label} still uses a generated placeholder card instead of poster media`)
    }

    if (
      item.objectPosition &&
      !/^\s*\d+(?:\.\d+)?%\s+\d+(?:\.\d+)?%\s*$/.test(item.objectPosition)
    ) {
      errors.push(`${label} has invalid objectPosition: ${item.objectPosition}`)
    }

    if (item.mediaKind && !['poster', 'cover', 'artwork'].includes(item.mediaKind)) {
      errors.push(`${label} has unsupported mediaKind: ${item.mediaKind}`)
    }

    if (item.video) {
      const media = item.video
      if (
        !media.title ||
        !media.titleEn ||
        !media.uploader ||
        !media.checkedAt ||
        !media.sourceUrl ||
        !media.watchUrl
      ) {
        errors.push(
          `${label} needs a bilingual media title, uploader, source, watch URL, and verification date`
        )
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(media.checkedAt ?? ''))
        errors.push(`${label} has an invalid media verification date`)
      for (const url of [media.sourceUrl, media.watchUrl]) {
        if (!url?.startsWith('https://')) errors.push(`${label} has a non-HTTPS media source`)
      }
      if (media.provider === 'youtube') {
        if (!/^[A-Za-z0-9_-]{11}$/.test(media.id)) errors.push(`${label} has an invalid YouTube ID`)
        if (media.watchUrl !== `https://www.youtube.com/watch?v=${media.id}`)
          errors.push(`${label} has a mismatched YouTube watch URL`)
      } else if (media.provider === 'bilibili') {
        if (!/^BV[A-Za-z0-9]{10}$/.test(media.id))
          errors.push(`${label} has an invalid Bilibili ID`)
        if (media.embed !== false)
          errors.push(`${label} must keep Bilibili external under the current frame policy`)
        if (media.watchUrl !== `https://www.bilibili.com/video/${media.id}/`)
          errors.push(`${label} has a mismatched Bilibili watch URL`)
      } else {
        errors.push(`${label} has an unsupported video provider`)
      }
    }
  }
}

if (errors.length) {
  console.error('Showcase media validation failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Validated ${anime.length} anime items and ${favorites.length} favorites.`)
