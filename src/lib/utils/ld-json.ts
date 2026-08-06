export function personLdJson(
	name: string,
	description: string,
	url: string,
	sameAs: string[],
	skills: string[]
): string {
	return JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name,
		description,
		url,
		sameAs: sameAs.filter(Boolean),
		knowsAbout: skills.slice(0, 10)
	});
}

export function itemListLdJson(items: { title: string; url: string }[]): string {
	return JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Lora Sys Blog Posts',
		description: '关于软件工程、AI 智能体、区块链和独立开发的写作。',
		itemListElement: items.map((post, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			url: post.url,
			name: post.title
		}))
	});
}

export function blogPostingLdJson(params: {
	title: string;
	date: string;
	description: string;
	categories: string[];
	slug: string;
	siteUrl: string;
}): string {
	const postUrl = `${params.siteUrl}/blog/${params.slug}`;
	return JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: params.title,
		datePublished: params.date,
		dateModified: params.date,
		description: params.description,
		keywords: params.categories.join(', '),
		author: { '@type': 'Person', name: 'Lora Sys', url: params.siteUrl },
		publisher: { '@type': 'Person', name: 'Lora Sys', url: params.siteUrl },
		mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
		url: postUrl,
		image: `${params.siteUrl}/og-cover.png`,
		inLanguage: 'zh-CN',
		articleSection: params.categories[0] ?? 'Technology',
		...(params.categories.length ? { articleTag: params.categories } : {}),
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: '首页', item: `${params.siteUrl}/` },
					{ '@type': 'ListItem', position: 2, name: '日志', item: `${params.siteUrl}/blog` },
					{ '@type': 'ListItem', position: 3, name: params.title }
				]
			}
		]
	});
}
