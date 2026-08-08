<script lang="ts">
	import { base } from '$app/paths';
	import BackToTop from '$lib/components/ui/back-to-top/back-to-top.svelte';

	type Tab = 'new-post' | 'new-note' | 'drafts' | 'recent';
	let activeTab = $state<Tab>('new-post');

	let postTitle = $state('');
	let postDesc = $state('');
	let postCategories = $state('');
	let postImage = $state('');
	let postContent = $state('');
	let postSlug = $state('');
	let postError = $state('');
	let postSuccess = $state('');

	let noteTitle = $state('');
	let noteSummary = $state('');
	let noteTags = $state('');
	let noteDate = $state(new Date().toISOString().slice(0, 7));
	let noteError = $state('');
	let noteSuccess = $state('');

	let draftsLoading = $state(true);
	let drafts: Array<{ file: string; title: string; published: boolean }> = $state([]);

	let recentLoading = $state(true);
	let recentPosts: Array<{ slug: string; title: string; date: string }> = $state([]);

	function deriveSlug(title: string): string {
		return title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');
	}

	function generatePost(): string {
		const today = new Date().toISOString().slice(0, 10);
		const cats = postCategories
			.split(',')
			.map((c) => c.trim())
			.filter(Boolean);
		const catLines = cats.map((c) => `  - ${c}`).join('\n') || '  - Uncategorized';
		const imageLine = postImage.trim() ? `\nimage: '${postImage.trim()}'` : '';

		return `---
title: '${postTitle}'
description: '${postDesc}'
date: '${today}'
categories:
${catLines}
published: false${imageLine}
---

## 背景



## 解决方案



## 实践



``````

## 总结



`;
	}

	function generateNoteEntry(): string {
		const tags = noteTags
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
		const tagsJson = JSON.stringify(tags, null, 4);
		return `	{
		title: '${noteTitle}',
		date: '${noteDate}',
		summary: '${noteSummary}',
		tags: ${tagsJson}
	},`;
	}

	async function copyPost() {
		if (!postTitle.trim()) {
			postError = '标题不能为空';
			return;
		}
		if (!postDesc.trim()) {
			postError = '描述不能为空';
			return;
		}

		const slug = deriveSlug(postTitle);
		const content = generatePost();
		const fullPath = `src/content/${slug}.md`;

		postSlug = fullPath;
		try {
			await navigator.clipboard.writeText(content);
			postSuccess = `已复制到剪贴板！请粘贴到 ${fullPath}`;
			postError = '';
		} catch {
			postSuccess = '生成完成，请手动复制下方内容到 ' + fullPath;
			postError = '';
		}
	}

	async function copyNote() {
		if (!noteTitle.trim()) {
			noteError = '标题不能为空';
			return;
		}
		if (!noteSummary.trim()) {
			noteError = '摘要不能为空';
			return;
		}

		const entry = generateNoteEntry();
		try {
			await navigator.clipboard.writeText(entry);
			noteSuccess = '已复制到剪贴板！请粘贴到 resume.ts 的 notes 数组中';
			noteError = '';
		} catch {
			noteSuccess = '生成完成，请手动复制下方内容';
			noteError = '';
		}
	}

	async function loadDrafts() {
		draftsLoading = true;
		try {
			const res = await fetch(`${base}/api/content`);
			if (res.ok) {
				const posts = await res.json();
				drafts = posts
					.filter((p: any) => !p.published)
					.map((p: any) => ({
						file: `${p.slug}.md`,
						title: p.title,
						published: p.published
					}));
			}
		} catch {
			drafts = [];
		}
		draftsLoading = false;
	}

	async function loadRecent() {
		recentLoading = true;
		try {
			const res = await fetch(`${base}/api/content`);
			if (res.ok) {
				const posts = await res.json();
				recentPosts = posts.slice(0, 8).map((p: any) => ({
					slug: p.slug,
					title: p.title,
					date: p.date
				}));
			}
		} catch {
			recentPosts = [];
		}
		recentLoading = false;
	}

	async function runValidator() {
		window.open('/wayfinder?tab=drafts', '_blank');
		alert(
			'请运行: node .claude/skills/blog-writer/scripts/validate.mjs src/content/\n\n或在 Claude Code 中说: blog check src/content/'
		);
	}

	async function previewBuild() {
		alert('请运行: pnpm run build:github\n\n或在 Claude Code 中说: pnpm run build:github');
	}

	// Load data on mount
	$effect(() => {
		if (activeTab === 'drafts') loadDrafts();
		if (activeTab === 'recent') loadRecent();
	});
</script>

<svelte:head>
	<title>Wayfinder — 创作入口 | Lora Sys</title>
	<meta name="description" content="博客文章与笔记的创作入口。创建新文章、新笔记，管理草稿。" />
</svelte:head>

<main class="wayfinder">
	<div class="wrap">
		<header class="wf-header">
			<div class="wf-brand">
				<span class="wf-compass" aria-hidden="true">✦</span>
				<div>
					<h1>Wayfinder</h1>
					<p class="wf-tagline">创作入口 · 文章 / 笔记 / 草稿</p>
				</div>
			</div>
		</header>

		<nav class="wf-tabs" role="tablist">
			{#each [{ id: 'new-post', label: '新文章', icon: '✎' }, { id: 'new-note', label: '新笔记', icon: '✦' }, { id: 'drafts', label: '草稿区', icon: '📝' }, { id: 'recent', label: '最近', icon: '→' }] as tab}
				<button
					role="tab"
					aria-selected={activeTab === tab.id}
					class="wf-tab"
					class:on={activeTab === tab.id}
					onclick={() => (activeTab = tab.id as Tab)}
				>
					<span class="wf-tab-icon">{tab.icon}</span>
					<span class="wf-tab-label">{tab.label}</span>
				</button>
			{/each}
		</nav>

		<!-- ─── New Post ─── -->
		{#if activeTab === 'new-post'}
			<section class="wf-panel">
				<div class="wf-form">
					<div class="wf-field">
						<label for="post-title">标题</label>
						<input
							id="post-title"
							type="text"
							bind:value={postTitle}
							placeholder="输入文章标题..."
							oninput={() => (postSlug = deriveSlug(postTitle))}
						/>
						{#if postSlug}
							<span class="wf-slug">→ {postSlug}.md</span>
						{/if}
					</div>

					<div class="wf-field">
						<label for="post-desc">描述（SEO / OG）</label>
						<textarea id="post-desc" bind:value={postDesc} rows="2" placeholder="1-2 句话摘要..." />
					</div>

					<div class="wf-row">
						<div class="wf-field">
							<label for="post-cats">分类（逗号分隔）</label>
							<input
								id="post-cats"
								type="text"
								bind:value={postCategories}
								placeholder="AI, Agent, Engineering"
							/>
						</div>
						<div class="wf-field">
							<label for="post-img">封面图（可选）</label>
							<input
								id="post-img"
								type="text"
								bind:value={postImage}
								placeholder="/images/my-cover.png"
							/>
						</div>
					</div>

					<div class="wf-field">
						<label for="post-body">正文（可选预填）</label>
						<textarea
							id="post-body"
							bind:value={postContent}
							rows="6"
							placeholder="可以先写一些正文内容..."
						/>
					</div>

					{#if postError}
						<p class="wf-msg wf-error">{postError}</p>
					{/if}
					{#if postSuccess}
						<p class="wf-msg wf-success">{postSuccess}</p>
					{/if}

					<button class="wf-btn wf-btn-primary" onclick={copyPost}> 生成 frontmatter 模板 </button>
				</div>

				{#if postSuccess}
					<div class="wf-preview">
						<h3>生成的文件内容：</h3>
						<pre>{generatePost()}</pre>
					</div>
				{/if}
			</section>
		{/if}

		<!-- ─── New Note ─── -->
		{#if activeTab === 'new-note'}
			<section class="wf-panel">
				<div class="wf-form">
					<div class="wf-field">
						<label for="note-title">标题</label>
						<input id="note-title" type="text" bind:value={noteTitle} placeholder="笔记标题..." />
					</div>

					<div class="wf-field">
						<label for="note-summary">摘要</label>
						<textarea
							id="note-summary"
							bind:value={noteSummary}
							rows="3"
							placeholder="一句话摘要..."
						/>
					</div>

					<div class="wf-row">
						<div class="wf-field">
							<label for="note-tags">标签（逗号分隔）</label>
							<input
								id="note-tags"
								type="text"
								bind:value={noteTags}
								placeholder="AI Agents, Research"
							/>
						</div>
						<div class="wf-field">
							<label for="note-date">日期</label>
							<input id="note-date" type="month" bind:value={noteDate} />
						</div>
					</div>

					{#if noteError}
						<p class="wf-msg wf-error">{noteError}</p>
					{/if}
					{#if noteSuccess}
						<p class="wf-msg wf-success">{noteSuccess}</p>
					{/if}

					<button class="wf-btn wf-btn-primary" onclick={copyNote}> 生成 notes 数组条目 </button>
				</div>

				{#if noteSuccess}
					<div class="wf-preview">
						<h3>要粘贴到 `resume.ts` 的 `notes` 数组中：</h3>
						<pre>{generateNoteEntry()}</pre>
					</div>
				{/if}
			</section>
		{/if}

		<!-- ─── Drafts ─── -->
		{#if activeTab === 'drafts'}
			<section class="wf-panel">
				{#if draftsLoading}
					<p class="wf-loading">加载中...</p>
				{:else if drafts.length === 0}
					<p class="wf-empty">🎉 没有草稿 — 所有文章都已发布！</p>
				{:else}
					<div class="wf-list">
						{#each drafts as d}
							<a href="{base}/blog/{d.file.replace('.md', '')}" class="wf-list-item">
								<span class="wf-list-icon">📝</span>
								<div>
									<span class="wf-list-title">{d.title || d.file}</span>
									<span class="wf-list-meta">{d.file}</span>
								</div>
								<span class="wf-list-arrow">→</span>
							</a>
						{/each}
					</div>
				{/if}
			</section>
		{/if}

		<!-- ─── Recent ─── -->
		{#if activeTab === 'recent'}
			<section class="wf-panel">
				{#if recentLoading}
					<p class="wf-loading">加载中...</p>
				{:else}
					<div class="wf-list">
						{#each recentPosts as p}
							<a href="{base}/blog/{p.slug}" class="wf-list-item">
								<span class="wf-list-arrow">→</span>
								<div>
									<span class="wf-list-title">{p.title}</span>
									<span class="wf-list-meta">{p.date}</span>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</section>
		{/if}

		<!-- ─── Quick Actions ─── -->
		<section class="wf-actions">
			<h2 class="wf-actions-title">快捷操作</h2>
			<div class="wf-actions-grid">
				<button class="wf-action" onclick={runValidator}>
					<span class="wf-action-icon">🔍</span>
					<span class="wf-action-label">运行博客校验</span>
					<span class="wf-action-hint">检查 frontmatter、分类、格式</span>
				</button>
				<button class="wf-action" onclick={previewBuild}>
					<span class="wf-action-icon">⚡</span>
					<span class="wf-action-label">预览 Build</span>
					<span class="wf-action-hint">运行 build:github</span>
				</button>
			</div>
		</section>
	</div>

	<BackToTop threshold={200} />
</main>

<style>
	.wayfinder {
		min-height: 100vh;
		padding: clamp(60px, 10vh, 120px) 0 96px;
		background: var(--paper);
		color: var(--ink);
		font-family: var(--font-serif);
	}
	.wrap {
		max-width: 860px;
		margin: 0 auto;
		padding: 0 var(--page-x);
	}

	/* Header */
	.wf-header {
		margin-bottom: clamp(32px, 5vh, 56px);
	}
	.wf-brand {
		display: flex;
		align-items: center;
		gap: 20px;
	}
	.wf-compass {
		font-size: clamp(2.5rem, 6vw, 4rem);
		color: var(--zhu);
		line-height: 1;
	}
	.wf-brand h1 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(2.5rem, 7vw, 4.5rem);
		letter-spacing: -0.03em;
		line-height: 0.9;
		margin: 0;
	}
	.wf-tagline {
		font-family: var(--font-label);
		font-size: 0.72rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin-top: 8px;
	}

	/* Tabs */
	.wf-tabs {
		display: flex;
		gap: 4px;
		border-bottom: 2px solid var(--ink);
		margin-bottom: 32px;
		overflow-x: auto;
	}
	.wf-tab {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 20px;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		cursor: pointer;
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-mute);
		white-space: nowrap;
		transition:
			color 0.2s,
			border-color 0.2s;
	}
	.wf-tab:hover {
		color: var(--ink);
	}
	.wf-tab.on {
		color: var(--zhu);
		border-bottom-color: var(--zhu);
	}
	.wf-tab-icon {
		font-size: 1rem;
	}
	.wf-tab-label {
	}

	/* Panel */
	.wf-panel {
		margin-bottom: 48px;
	}

	/* Form */
	.wf-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.wf-field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.wf-field label {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-mute);
	}
	.wf-field input,
	.wf-field textarea {
		font-family: var(--font-body);
		font-size: 1rem;
		padding: 10px 14px;
		background: transparent;
		border: 1.5px solid var(--ink-line);
		border-radius: 0;
		color: var(--ink);
		outline: none;
		transition: border-color 0.2s;
		resize: vertical;
	}
	.wf-field input:focus,
	.wf-field textarea:focus {
		border-color: var(--zhu);
	}
	.wf-field input::placeholder,
	.wf-field textarea::placeholder {
		color: var(--ink-mute);
		opacity: 0.6;
	}
	.wf-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}
	.wf-slug {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--zhu);
		opacity: 0.7;
	}

	/* Messages */
	.wf-msg {
		padding: 10px 14px;
		font-size: 0.88rem;
		border-radius: 0;
	}
	.wf-error {
		background: rgba(198, 65, 44, 0.08);
		border-left: 3px solid var(--zhu);
		color: var(--zhu);
	}
	.wf-success {
		background: rgba(39, 120, 80, 0.08);
		border-left: 3px solid #276050;
		color: #276050;
	}

	/* Buttons */
	.wf-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 28px;
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
		border: 1.5px solid var(--ink);
		background: transparent;
		color: var(--ink);
		transition: all 0.2s;
		align-self: flex-start;
	}
	.wf-btn:hover {
		background: var(--ink);
		color: var(--paper);
	}
	.wf-btn-primary {
		background: var(--ink);
		color: var(--paper);
		border-color: var(--ink);
	}
	.wf-btn-primary:hover {
		background: var(--zhu);
		border-color: var(--zhu);
	}

	/* Preview */
	.wf-preview {
		margin-top: 28px;
		padding: 20px;
		background: var(--ink);
		color: var(--paper);
		border-radius: 0;
	}
	.wf-preview h3 {
		font-family: var(--font-label);
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin: 0 0 12px 0;
		opacity: 0.6;
	}
	.wf-preview pre {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		line-height: 1.6;
		white-space: pre-wrap;
		overflow-x: auto;
		margin: 0;
	}

	/* List */
	.wf-list {
		display: flex;
		flex-direction: column;
	}
	.wf-list-item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 16px 8px;
		border-top: 1px solid var(--ink-line);
		color: var(--ink);
		text-decoration: none;
		transition: background 0.2s;
	}
	.wf-list-item:hover {
		background: linear-gradient(90deg, rgba(198, 65, 44, 0.05), transparent 50%);
	}
	.wf-list-item:last-child {
		border-bottom: 1px solid var(--ink-line);
	}
	.wf-list-icon {
		font-size: 1.1rem;
		flex-shrink: 0;
	}
	.wf-list-arrow {
		color: var(--zhu);
		margin-left: auto;
		font-size: 0.9rem;
	}
	.wf-list-title {
		display: block;
		font-size: 1.05rem;
		line-height: 1.3;
	}
	.wf-list-meta {
		display: block;
		font-family: var(--font-label);
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin-top: 3px;
	}

	/* Actions */
	.wf-actions {
		border-top: 2px solid var(--ink);
		padding-top: 32px;
	}
	.wf-actions-title {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.72rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin: 0 0 20px 0;
	}
	.wf-actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 12px;
	}
	.wf-action {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 20px;
		background: transparent;
		border: 1.5px solid var(--ink-line);
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
	}
	.wf-action:hover {
		border-color: var(--zhu);
		background: rgba(198, 65, 44, 0.03);
	}
	.wf-action-icon {
		font-size: 1.3rem;
	}
	.wf-action-label {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.78rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.wf-action-hint {
		font-size: 0.82rem;
		color: var(--ink-mute);
	}

	/* States */
	.wf-loading,
	.wf-empty {
		text-align: center;
		padding: 48px 20px;
		color: var(--ink-mute);
		font-size: 1.05rem;
	}

	@media (max-width: 600px) {
		.wf-row {
			grid-template-columns: 1fr;
		}
		.wf-tab-label {
			display: none;
		}
		.wf-tab {
			padding: 12px 16px;
		}
	}
</style>
