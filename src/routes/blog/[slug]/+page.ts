import { getSlugs } from '$lib/utils/posts';
import { error } from '@sveltejs/kit';

export async function entries() {
	return (await getSlugs()).map((slug) => ({ slug }));
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
