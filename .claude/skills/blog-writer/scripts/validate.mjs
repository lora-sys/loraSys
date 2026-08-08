#!/usr/bin/env node
/**
 * Blog content validator for loraSys.
 *
 * Usage:
 *   node validate.mjs <path-to-post.md>       Validate a single post
 *   node validate.mjs <path-to-dir>            Validate all .md files in directory
 *   node validate.mjs --list                    List drafts and published posts
 *   node validate.mjs --categories              Print known categories
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.resolve(SKILL_DIR, '..', '..', '..', 'src', 'content');
const STATIC_DIR = path.resolve(SKILL_DIR, '..', '..', '..', 'static');

// ─── Known categories ───
const CANONICAL_CATEGORIES = new Set([
	'AI',
	'Agent',
	'Architecture',
	'Benchmark',
	'Engineering',
	'Frontend',
	'Hackathon',
	'Hermes Agent',
	'Image Generation',
	'LangGraph',
	'Loop',
	'MiniMax',
	'MCP',
	'Monad',
	'Next.js',
	'Node.js',
	'Open Source',
	'Performance',
	'Plugin',
	'Python',
	'React',
	'Research',
	'Rust',
	'Security',
	'Svelte',
	'SvelteKit',
	'StepFun',
	'Technology',
	'Tutorial',
	'TypeScript',
	'Vercel',
	'Video Generation',
	'Vision',
	'Web3',
	'技术',
	'安全',
	'沙箱'
]);

// Legacy forms found in existing posts — accepted with a suggestion
const LEGACY_CATEGORY_MAP = {
	ai: 'AI',
	agent: 'Agent',
	agents: 'Agent',
	svelte: 'Svelte',
	sveltekit: 'SvelteKit',
	vercel: 'Vercel',
	engineering: 'Engineering',
	hackathon: 'Hackathon',
	Nextjs: 'Next.js',
	Trpc: 'TRPC'
};

const REQUIRED_FIELDS = ['title', 'description', 'date', 'categories', 'published'];
const FIELD_ORDER = ['title', 'description', 'date', 'categories', 'published', 'image'];

// ─── YAML frontmatter parser (simple, no external deps) ───
function parseFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return { frontmatter: null, body: content };

	const fmText = match[1];
	const frontmatter = {};
	const lines = fmText.split('\n');
	let lastKey = null;

	for (const line of lines) {
		if (line.startsWith('  - ') || line.startsWith('   - ')) {
			const item = line.replace(/^ {2}- |^ {3}- /, '').trim();
			if (lastKey) {
				if (!Array.isArray(frontmatter[lastKey])) {
					frontmatter[lastKey] = [];
				}
				frontmatter[lastKey].push(item);
			}
			continue;
		}

		const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.*)/);
		if (kvMatch) {
			const key = kvMatch[1];
			let value = kvMatch[2].trim();

			if (
				(value.startsWith("'") && value.endsWith("'")) ||
				(value.startsWith('"') && value.endsWith('"'))
			) {
				value = value.slice(1, -1);
			}

			if (value === 'true') value = true;
			else if (value === 'false') value = false;

			frontmatter[key] = value;
			lastKey = key;
		}
	}

	return { frontmatter, body: content.slice(match[0].length) };
}

// ─── Validators ───
function validateFrontmatter(frontmatter, filePath) {
	const errors = [];
	const warnings = [];

	if (!frontmatter) {
		errors.push({ msg: 'Missing frontmatter (needs --- delimiters)', file: filePath });
		return { errors, warnings };
	}

	// Check required fields
	for (const field of REQUIRED_FIELDS) {
		if (
			frontmatter[field] === undefined ||
			frontmatter[field] === null ||
			frontmatter[field] === ''
		) {
			if (field === 'image') {
				warnings.push({ msg: `Optional field 'image' is empty`, file: filePath });
			} else {
				errors.push({ msg: `Missing required field: ${field}`, file: filePath });
			}
		}
	}

	// Check field order
	const actualOrder = Object.keys(frontmatter);
	for (let i = 0; i < actualOrder.length; i++) {
		if (i < FIELD_ORDER.length && actualOrder[i] !== FIELD_ORDER[i]) {
			const fieldIdx = FIELD_ORDER.indexOf(actualOrder[i]);
			if (fieldIdx === -1) {
				errors.push({ msg: `Unknown field: ${actualOrder[i]}`, file: filePath });
			} else if (fieldIdx < i) {
				errors.push({
					msg: `Field '${actualOrder[i]}' is out of order (should be at position ${fieldIdx + 1})`,
					file: filePath
				});
			}
		}
	}

	// Check categories
	if (frontmatter.categories && Array.isArray(frontmatter.categories)) {
		for (const cat of frontmatter.categories) {
			if (CANONICAL_CATEGORIES.has(cat)) continue;
			const canonical = LEGACY_CATEGORY_MAP[cat];
			if (canonical) {
				warnings.push({
					msg: `Category "${cat}" is legacy form — use "${canonical}" instead`,
					file: filePath
				});
			} else {
				warnings.push({ msg: `Unknown category: "${cat}" (not in known list)`, file: filePath });
			}
		}
	} else if (frontmatter.categories && !Array.isArray(frontmatter.categories)) {
		errors.push({
			msg: `'categories' must be an array, got: ${typeof frontmatter.categories}`,
			file: filePath
		});
	}

	// Check date format — accept YYYY-M-D and YYYY-MM-DD
	if (frontmatter.date && typeof frontmatter.date === 'string') {
		if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(frontmatter.date)) {
			warnings.push({
				msg: `Date format should be YYYY-MM-DD, got: "${frontmatter.date}"`,
				file: filePath
			});
		} else {
			const parts = frontmatter.date.split('-');
			if (parts[1].length !== 2 || parts[2].length !== 2) {
				const fixed = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
				warnings.push({
					msg: `Date should be zero-padded: "${frontmatter.date}" → "${fixed}"`,
					file: filePath
				});
			}
		}
	}

	// Check published is boolean
	if (frontmatter.published !== undefined && typeof frontmatter.published !== 'boolean') {
		errors.push({
			msg: `'published' must be boolean, got: ${typeof frontmatter.published}`,
			file: filePath
		});
	}

	// Check image exists
	if (
		frontmatter.image &&
		typeof frontmatter.image === 'string' &&
		frontmatter.image !== '/images/'
	) {
		const imagePath = path.join(STATIC_DIR, frontmatter.image.replace(/^\//, ''));
		if (!fs.existsSync(imagePath)) {
			warnings.push({ msg: `Image file not found: ${frontmatter.image}`, file: filePath });
		}
	}

	return { errors, warnings, frontmatter };
}

function validateBody(body, filePath) {
	const errors = [];
	const warnings = [];
	const lines = body.split('\n');
	let prevLevel = 0;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
		if (headingMatch) {
			const level = headingMatch[1].length;

			if (level <= 1) {
				warnings.push({
					msg: `H${level} found in body at line ${i + 1}: "${headingMatch[2]}" (body should start at H2)`,
					file: filePath
				});
			}
			if (prevLevel > 0 && level > prevLevel + 1) {
				errors.push({
					msg: `Heading jump at line ${i + 1}: H${prevLevel} → H${level} ("${headingMatch[2]}")`,
					file: filePath
				});
			}
			prevLevel = level;
		}

		const codeMatch = line.match(/^```(\w*)/);
		if (codeMatch && !codeMatch[1]) {
			warnings.push({ msg: `Code block without language at line ${i + 1}`, file: filePath });
		}

		if (line.match(/\[\]\(|\[\s*\]\(/)) {
			errors.push({ msg: `Empty link at line ${i + 1}`, file: filePath });
		}
	}

	return { errors, warnings };
}

function validateFile(filePath) {
	const content = fs.readFileSync(filePath, 'utf-8');
	const { frontmatter, body } = parseFrontmatter(content);

	const fmResult = validateFrontmatter(frontmatter, filePath);
	const bodyResult = validateBody(body, filePath);

	return {
		errors: [...fmResult.errors, ...bodyResult.errors],
		warnings: [...fmResult.warnings, ...bodyResult.warnings],
		frontmatter: fmResult.frontmatter,
		published: frontmatter?.published ?? false
	};
}

// ─── List mode ───
function listPosts() {
	if (!fs.existsSync(CONTENT_DIR)) {
		console.error('Content directory not found:', CONTENT_DIR);
		process.exit(1);
	}

	const files = fs
		.readdirSync(CONTENT_DIR)
		.filter((f) => f.endsWith('.md'))
		.sort();

	const drafts = [];
	const published = [];

	for (const file of files) {
		const filePath = path.join(CONTENT_DIR, file);
		const result = validateFile(filePath);
		if (result.published) {
			published.push({ file, frontmatter: result.frontmatter });
		} else {
			drafts.push({ file, frontmatter: result.frontmatter });
		}
	}

	console.log('\n📝 Published Posts:');
	if (published.length === 0) {
		console.log('  (none)');
	} else {
		for (const p of published) {
			const title = p.frontmatter?.title || '(no title)';
			const date = p.frontmatter?.date || 'no date';
			console.log(`  ✅ ${p.file} — "${title}" (${date})`);
		}
	}

	console.log('\n📄 Drafts:');
	if (drafts.length === 0) {
		console.log('  (none)');
	} else {
		for (const d of drafts) {
			const title = d.frontmatter?.title || '(no title)';
			console.log(`  📝 ${d.file} — "${title}"`);
		}
	}
	console.log(`\nTotal: ${published.length} published, ${drafts.length} drafts\n`);
}

// ─── Categories mode ───
function printCategories() {
	console.log('\nKnown categories:');
	for (const cat of [...CANONICAL_CATEGORIES].sort()) {
		console.log(`  - ${cat}`);
	}
	console.log(`\nTotal: ${CANONICAL_CATEGORIES.size} categories\n`);
}

// ─── Main ───
function main() {
	const args = process.argv.slice(2);

	if (args.includes('--list')) {
		listPosts();
		return;
	}

	if (args.includes('--categories')) {
		printCategories();
		return;
	}

	if (args.length === 0) {
		console.log('Usage:');
		console.log('  node validate.mjs <file-or-dir>   Validate content');
		console.log('  node validate.mjs --list           List drafts and published posts');
		console.log('  node validate.mjs --categories     Print known categories');
		process.exit(0);
	}

	const target = args[0];
	let filesToCheck = [];

	if (fs.statSync(target).isDirectory()) {
		filesToCheck = fs
			.readdirSync(target)
			.filter((f) => f.endsWith('.md'))
			.map((f) => path.join(target, f));
	} else if (target.endsWith('.md')) {
		filesToCheck = [target];
	} else {
		console.error(`Error: ${target} is not a .md file or directory`);
		process.exit(1);
	}

	let totalErrors = 0;
	let totalWarnings = 0;
	let exitCode = 0;

	for (const file of filesToCheck) {
		const result = validateFile(file);
		const relPath = path.relative(process.cwd(), file);
		const icon = result.errors.length > 0 ? '❌' : '✅';

		console.log(`\n${icon} ${relPath}`);

		if (result.frontmatter) {
			console.log(`   published: ${result.frontmatter.published}`);
			console.log(`   title: "${result.frontmatter.title}"`);
			console.log(`   date: ${result.frontmatter.date}`);
			console.log(`   categories: [${(result.frontmatter.categories || []).join(', ')}]`);
		}

		for (const e of result.errors) {
			console.log(`   ❌ ${e.msg}`);
			totalErrors++;
		}
		for (const w of result.warnings) {
			console.log(`   ⚠️  ${w.msg}`);
			totalWarnings++;
		}

		if (result.errors.length === 0 && result.warnings.length === 0) {
			console.log('   ✅ All checks passed');
		}

		if (result.errors.length > 0) exitCode = 1;
	}

	console.log(`\n${'─'.repeat(40)}`);
	console.log(
		`Files: ${filesToCheck.length} | Errors: ${totalErrors} | Warnings: ${totalWarnings}`
	);
	if (totalErrors === 0 && totalWarnings === 0) {
		console.log('✅ All files passed validation');
	} else if (totalErrors === 0) {
		console.log('⚠️  No errors, but warnings need attention');
	}

	process.exit(exitCode);
}

main();
