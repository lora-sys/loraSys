import { text } from '@sveltejs/kit';
import type { Post } from '$lib/types';

function escXml(s: string): string {
	return String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

async function getPosts() {
	let posts: Post[] = [];
	const paths = import.meta.glob('/src/content/*.md');
	for (const path in paths) {
		const module = (await paths[path]()) as { metadata?: Omit<Post, 'slug'> };
		const slug = path.split('/').at(-1)?.replace('.md', '');
		if (module?.metadata && slug) {
			const post = { ...module.metadata, slug } satisfies Post;
			post.published && posts.push(post);
		}
	}
	return posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);
}

export async function GET() {
	const posts = await getPosts();
	const items = posts
		.map(
			(p) => `
    <item>
      <title>${escXml(p.title)}</title>
      <link>https://lora4.dpdns.org/blog/${p.slug}</link>
      <description>${escXml(p.description || '')}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      ${(p.categories || []).map((c) => `<category>${escXml(c)}</category>`).join('\n')}
    </item>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>lora's blog</title>
    <link>https://lora4.dpdns.org/</link>
    <description>Builder of evolving systems</description>
    <language>en</language>
    ${items}
  </channel>
</rss>`;

	return text(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
}
