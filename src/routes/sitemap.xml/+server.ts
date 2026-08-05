import type { Post } from '$lib/types';

const SITE_URL = 'https://lora-sys.github.io/loraSys';

export async function GET() {
	const paths = import.meta.glob('/src/content/*.md', {
		eager: true,
		query: '?metadata'
	});
	const posts: { slug: string; published: boolean; date?: string }[] = [];
	for (const path in paths) {
		const module = paths[path] as { metadata?: Omit<Post, 'slug'> };
		const slug = path.split('/').at(-1)?.replace('.md', '');
		if (module?.metadata && slug) {
			posts.push({
				slug,
				published: module.metadata.published,
				date: module.metadata.date
			});
		}
	}

	const nowLastmod = '2026-08-05';
	const today = new Date().toISOString().split('T')[0];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${SITE_URL}/</loc>
		<lastmod>${today}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
	</url>
	<url>
		<loc>${SITE_URL}/blog</loc>
		<lastmod>${today}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>
	<url>
		<loc>${SITE_URL}/now</loc>
		<lastmod>${nowLastmod}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.6</priority>
	</url>
	${posts
		.filter((p) => p.published)
		.map(
			(post) => `	<url>
		<loc>${SITE_URL}/blog/${post.slug}</loc>
		<lastmod>${post.date ?? today}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.6</priority>
	</url>`
		)
		.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
