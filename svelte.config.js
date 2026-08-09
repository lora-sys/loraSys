import adapterAuto from '@sveltejs/adapter-auto';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import remarkHeadingId from 'remark-heading-id';
import rehypeSlug from 'rehype-slug';
import rehypeMermaid from 'rehype-mermaid';

const SUPPORTED_LANGS = [
	'javascript',
	'typescript',
	'svelte',
	'py',
	'python',
	'tsx',
	'jsx',
	'bash',
	'shell',
	'json',
	'css',
	'html',
	'markdown',
	'yaml',
	'rust',
	'go'
];

let _highlighter = null;
async function getHighlighter() {
	if (!_highlighter) {
		_highlighter = await createHighlighter({
			themes: ['github-dark-dimmed'],
			langs: SUPPORTED_LANGS
		});
	}
	return _highlighter;
}

const mdsvexOptions = {
	extensions: ['.md'],
	remarkPlugins: [remarkHeadingId],
	rehypePlugins: [
		rehypeSlug,
		[
			rehypeMermaid,
			{
				strategy: 'inline-svg', // Server-side render with Playwright
				mermaidConfig: {
					theme: 'dark',
					themeVariables: {
						primaryColor: '#7c5cff',
						primaryTextColor: '#fff',
						primaryBorderColor: '#4a3aff',
						lineColor: '#5fb3ff',
						secondaryColor: '#1e293b',
						tertiaryColor: '#0a0d1a',
						background: '#0a0d1a',
						mainBkg: '#1e293b',
						nodeBorder: '#3b4a6b',
						clusterBkg: '#0f1a2e',
						clusterBorder: '#1e293b',
						titleColor: '#f4f6ff',
						edgeLabelBackground: '#1e293b',
						textColor: '#a8b3d6'
					}
				}
			}
		]
	],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			// Skip Shiki for mermaid blocks—let rehype-mermaid handle them
			if (lang === 'mermaid') {
				return code;
			}
			const highlighter = await getHighlighter();
			const validLang = SUPPORTED_LANGS.includes(lang) ? lang : 'text';
			const html = escapeSvelte(
				highlighter.codeToHtml(code, {
					lang: validLang,
					theme: 'github-dark-dimmed'
				})
			);
			return `{@html \`${html}\` }`;
		}
	}
};
/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess({
			compilerOptions: {
				// Svelte 5 compatibility: SvelteKit 2.x runtime uses `new Component()` (legacy API)
				compatibility: { componentApi: 4 }
			}
		}),
		mdsvex(mdsvexOptions)
	],

	kit: {
		prerender: {
			handleHttpError: 'warn'
		},
		paths: {
			base: process.env.BASE_PATH ?? ''
		},
		adapter:
			process.env.ADAPTER === 'static'
				? adapterStatic({ pages: 'build', assets: 'build', fallback: '404.html' })
				: adapterAuto()
	}
};

export default config;
