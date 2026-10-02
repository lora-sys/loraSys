import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { validateArticleTranslations } from './lib/article-translations.mjs'
import { readFrontmatter } from './lib/writing-classification.mjs'

const root = path.resolve(import.meta.dirname, '..')
const directory = path.join(root, 'src/content/blog')
const posts = readdirSync(directory).filter((file) => /\.mdx?$/.test(file)).map((file) => {
  const source = readFileSync(path.join(directory, file), 'utf8')
  const { data, body } = readFrontmatter(source)
  return { id: file.replace(/\.mdx?$/, ''), data, body, source }
})
const byId = new Map(posts.map((post) => [post.id, post]))
const translations = posts.filter((post) => post.data.translationOf)
const published = posts.filter((post) => !post.data.draft)
const english = published.filter((post) => post.data.language === 'en-US')
const withoutCode = (body) => body.replace(/```[\s\S]*?```/g, '')
const headings = (body) => [...withoutCode(body).matchAll(/^#{1,6}\s/gm)].length
const fences = (body) => [...body.matchAll(/^```/gm)].length
const urls = (body) => [...new Set(body.match(/https?:\/\/[^\s)\]"<>]+/g) ?? [])].sort()
const components = (body) => [...withoutCode(body).matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((match) => match[1]).sort()
const media = (body) => [...body.matchAll(/!\[[^\]]*\]\(([^)]+)\)|\bsrc="([^"]+)"/g)]
  .map((match) => (match[1] ?? match[2]).replace(/-en\.svg$/, '.svg')).sort()

assert.deepEqual(validateArticleTranslations(posts.map((post) => ({ id: post.id, ...post.data }))), [])
const report = []
for (const translated of translations) {
  const original = byId.get(translated.data.translationOf)
  assert.ok(original, `${translated.id}: source exists`)
  assert.equal(translated.data.publishDate, original.data.publishDate, `${translated.id}: original date`)
  assert.equal(translated.data.updatedDate, original.data.updatedDate, `${translated.id}: original update date`)
  assert.equal(translated.data.contentType, original.data.contentType, `${translated.id}: content type`)
  assert.deepEqual(translated.data.topics, original.data.topics, `${translated.id}: topics`)
  assert.equal(headings(translated.body), headings(original.body), `${translated.id}: all headings retained`)
  assert.equal(fences(translated.body), fences(original.body), `${translated.id}: all code blocks retained`)
  assert.deepEqual(urls(translated.body), urls(original.body), `${translated.id}: all source URLs retained`)
  assert.deepEqual(components(translated.body), components(original.body), `${translated.id}: MDX components retained`)
  assert.deepEqual(media(translated.body), media(original.body), `${translated.id}: all media retained`)
  assert.equal(translated.data.heroImage?.src?.replace(/-en\.svg$/, '.svg'), original.data.heroImage?.src, `${translated.id}: source cover retained`)
  assert.ok(translated.data.title.length <= 60 && translated.data.description.length <= 160)
  report.push({ original: original.id, translation: translated.id, headings: headings(translated.body), codeBlocks: fences(translated.body) / 2, media: media(translated.body).length })
}

if (!process.argv.includes('--source-only')) {
  const dist = path.join(root, 'dist')
  assert.ok(existsSync(dist), 'Build dist first, or use --source-only')
  const base = '/loraSys'
  const site = 'https://lora-sys.github.io'
  const href = (id) => `${site}${base}/blog/${id}`
  const rss = readFileSync(path.join(dist, 'rss.xml'), 'utf8')
  const rssLinks = [...rss.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)].map((match) => match[1])
  assert.equal(rssLinks.length, published.length, 'RSS includes every published language edition once')
  assert.equal(new Set(rssLinks).size, rssLinks.length, 'RSS has no duplicate canonical URLs')
  for (const translated of translations) {
    const original = byId.get(translated.data.translationOf)
    for (const [post, alternate] of [[translated, original], [original, translated]]) {
      const html = readFileSync(path.join(dist, `blog/${post.id}/index.html`), 'utf8')
      assert.ok(html.includes(`<html lang="${post.data.language}"`), `${post.id}: document language`)
      assert.ok(html.includes(`rel="canonical" href="${href(post.id)}"`), `${post.id}: self canonical`)
      assert.ok(html.includes(`hreflang="${alternate.data.language}" href="${href(alternate.id)}"`), `${post.id}: reciprocal hreflang`)
      assert.ok(html.includes(`href="${base}/blog/${alternate.id}"`), `${post.id}: visible translation switch`)
      assert.ok(rssLinks.includes(href(post.id)), `${post.id}: RSS canonical`)
      if (post.data.language === 'en-US') {
        assert.ok(html.includes(`href="${base}/en/writing?language=en-US"`), `${post.id}: English reading return path`)
        const breadcrumb = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
          .map((match) => JSON.parse(match[1])).find((entry) => entry['@type'] === 'BreadcrumbList')
        assert.equal(breadcrumb.itemListElement[1].item, `${site}${base}/en/writing`)
      }
    }
    const alias = readFileSync(path.join(dist, `en/writing/${translated.id}/index.html`), 'utf8')
    assert.ok(alias.includes('noindex, follow') && alias.includes(`href="${href(translated.id)}"`), `${translated.id}: legacy alias remains canonicalized`)
  }
  const listing = readFileSync(path.join(dist, 'en/writing/index.html'), 'utf8')
  assert.equal([...listing.matchAll(/data-article(?:\s|>)/g)].length, published.length)
  assert.ok(listing.includes(`English (${english.length})`), 'English selector shows actual count')
}

console.log(JSON.stringify({ passed: true, published: published.length, english: english.length, translatedPairs: report }, null, 2))
