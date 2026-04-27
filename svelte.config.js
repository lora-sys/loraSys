import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import remarkHeadingId from 'remark-heading-id';

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
			themes: ['github-light', 'vesper'],
			langs: SUPPORTED_LANGS
		});
	}
	return _highlighter;
}

const mdsvexOptions = {
	extensions: ['.md'],
	remarkPlugins: [remarkHeadingId],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await getHighlighter();
			const validLang = SUPPORTED_LANGS.includes(lang) ? lang : 'text';
			const html = escapeSvelte(highlighter.codeToHtml(code, { 
				lang: validLang, 
				themes: { light: 'github-light', dark: 'vesper' },
				defaultColor: false
			}));
			return `{@html \`${html}\` }`;
		}
	}
};
/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

	kit: {
		adapter: adapter()
	}
};

export default config;
