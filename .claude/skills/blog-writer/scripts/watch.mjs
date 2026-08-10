#!/usr/bin/env node
/**
 * Blog file watcher — auto-fix on write.
 *
 * Watches src/content/ for .md file changes and runs --fix automatically.
 * Also fixes all existing files on startup.
 *
 * Usage:
 *   node watch.mjs                    Watch mode, fix on change
 *   node watch.mjs --once             Fix all existing files once, then exit
 *
 * Install as git post-commit hook (optional):
 *   echo "node .claude/skills/blog-writer/scripts/watch.mjs --once" >> .git/hooks/post-commit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '..', '..', '..', 'src', 'content');
const VALIDATE_SCRIPT = path.resolve(__dirname, 'validate.mjs');

const args = process.argv.slice(2);
const once = args.includes('--once');
const watch = args.includes('--watch');

function runFix(filePath) {
	try {
		const { execSync } = require('child_process');
		const relPath = path.relative(process.cwd(), filePath);
		console.log(`\n📝 Blog file changed: ${relPath}`);
		console.log('   Running auto-fix...');
		const output = execSync(`node "${VALIDATE_SCRIPT}" --fix "${filePath}"`, {
			encoding: 'utf-8',
			stdio: 'pipe'
		}).trim();
		if (output) {
			console.log(output.split('\n').map((l) => `   ${l}`).join('\n'));
		}
	} catch {
		// fix script handles its own output
	}
}

if (once) {
	console.log('🔧 One-shot fix-all mode\n');
	const { execSync } = require('child_process');
	try {
		const output = execSync(`node "${VALIDATE_SCRIPT}" --fix-all`, {
			encoding: 'utf-8',
			stdio: 'inherit'
		});
	} catch {
		process.exit(0);
	}
	process.exit(0);
}

if (!fs.existsSync(CONTENT_DIR)) {
	console.error('Content directory not found:', CONTENT_DIR);
	process.exit(1);
}

// Run once on startup for all existing files
console.log('🔧 Blog watcher starting — fixing all existing files on startup...');
const { execSync } = require('child_process');
try {
	execSync(`node "${VALIDATE_SCRIPT}" --fix-all`, { encoding: 'utf-8', stdio: 'inherit' });
} catch {
	// non-fatal
}

// Then watch for changes
console.log(`👀 Watching ${CONTENT_DIR} for changes...`);
console.log('   Press Ctrl+C to stop\n');

let debounceTimer;
const debouncedFix = (filePath) => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => runFix(filePath), 300);
};

fs.watch(CONTENT_DIR, { recursive: false }, (eventType, filename) => {
	if (filename && filename.endsWith('.md')) {
		debouncedFix(path.join(CONTENT_DIR, filename));
	}
});

// Graceful shutdown
process.on('SIGINT', () => {
	console.log('\n\n👋 Blog watcher stopped.');
	process.exit(0);
});

process.on('SIGTERM', () => {
	console.log('\n\n👋 Blog watcher stopped.');
	process.exit(0);
});
