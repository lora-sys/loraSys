import assert from 'node:assert/strict'
import test from 'node:test'

import { validateArticleTranslations } from '../lib/article-translations.mjs'
import { alternateArticle, articleLanguage, originalArticleId } from '../../src/utils/article-translations.ts'

const original = { id: 'source', language: 'zh-CN', draft: false }
const translation = { id: 'source-en', language: 'en-US', translationOf: 'source', draft: false }

test('accepts unpaired originals and one complete translation pair', () => {
  assert.deepEqual(validateArticleTranslations([original]), [])
  assert.deepEqual(validateArticleTranslations([original, translation]), [])
})

test('rejects an orphan translation', () => {
  assert.match(validateArticleTranslations([translation]).join('\n'), /does not exist/)
})

test('rejects same-language pairs and unsupported locales', () => {
  assert.match(validateArticleTranslations([original, { ...translation, language: 'zh-CN' }]).join('\n'), /different languages/)
  assert.match(validateArticleTranslations([original, { ...translation, language: 'fr' }]).join('\n'), /supported/)
})

test('rejects self references, translation chains, and cycles', () => {
  assert.match(validateArticleTranslations([{ ...original, translationOf: 'source' }]).join('\n'), /itself/)
  assert.match(validateArticleTranslations([original, translation, { id: 'third', language: 'zh-CN', translationOf: 'source-en' }]).join('\n'), /not another translation/)
  assert.match(validateArticleTranslations([{ ...original, translationOf: 'source-en' }, translation]).join('\n'), /not another translation/)
})

test('rejects duplicate language editions and draft originals', () => {
  assert.match(validateArticleTranslations([original, translation, { ...translation, id: 'second-en' }]).join('\n'), /duplicate/)
  assert.match(validateArticleTranslations([{ ...original, draft: true }, translation]).join('\n'), /draft original/)
})

test('rejects malformed relation paths', () => {
  for (const translationOf of ['', '../source', '/blog/source', 'https://example.com']) {
    assert.match(validateArticleTranslations([original, { ...translation, translationOf }]).join('\n'), /article slug/)
  }
})

test('resolves only the published opposite-language edition in both directions', () => {
  const source = { id: original.id, data: original }
  const english = { id: translation.id, data: translation }
  const unrelated = { id: 'unrelated', data: { language: 'en-US' } }
  const entries = [unrelated, source, english]
  assert.equal(alternateArticle(source, entries), english)
  assert.equal(alternateArticle(english, entries), source)
  assert.equal(alternateArticle(unrelated, entries), undefined)
  assert.equal(originalArticleId(english), source.id)
  assert.equal(articleLanguage({ id: 'legacy', data: {} }), 'zh-CN')
  assert.equal(alternateArticle(source, [source, { ...english, data: { ...english.data, draft: true } }]), undefined)
})
