import { error } from '@sveltejs/kit';
import type { Post } from '$lib/types';

const paths = import.meta.glob('/src/content/*.md');

async function getPosts() {
	const posts: Post[] = [];
	for (const path in paths) {
		const module = (await paths[path]()) as { metadata?: Omit<Post, 'slug'> };
		const slug = path.split('/').at(-1)?.replace('.md', '');
		if (module?.metadata && slug) {
			const post = { ...module.metadata, slug } satisfies Post;
			if (post.published) posts.push(post);
		}
	}
	return posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);
}

export async function entries() {
	const posts = await getPosts();
	return posts.map((p) => ({ slug: p.slug }));
}

export async function load({ params }) {
	try {
		const post = await import(`../../../content/${params.slug}.md`);
		return {
			content: post.default,
			meta: post.metadata
		};
	} catch {
		error(404, `Could not find ${params.slug}`);
	}
}
