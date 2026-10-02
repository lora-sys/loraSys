import type { CollectionEntry } from 'astro:content'

type Article = CollectionEntry<'blog'>

export const articleLanguage = (post: Article) => post.data.language ?? 'zh-CN'

export const originalArticleId = (post: Article) => post.data.translationOf ?? post.id

export function alternateArticle(post: Article, posts: Article[]): Article | undefined {
  const originalId = originalArticleId(post)
  return posts.find(
    (candidate) =>
      candidate.id !== post.id &&
      !candidate.data.draft &&
      originalArticleId(candidate) === originalId &&
      articleLanguage(candidate) !== articleLanguage(post)
  )
}

export function recentEnglishArticles<T extends { data: { language?: string } }>(posts: T[], limit = 3): T[] {
  return posts.filter((post) => post.data.language === 'en-US').slice(0, limit)
}
