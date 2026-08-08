<script lang="ts">
	import { onMount } from 'svelte';

	let { visible = $bindable(false) } = $props();

	const commands: Record<string, (args?: string) => string> = {
		help: () =>
			'可用命令: whoami, skills, projects, blog, now, contact, theme <light|dark>, date, echo <text>, clear, cls, ls, exit',
		whoami: () => 'lora — 全栈工程师 · AI 智能体爱好者 · 独立开发者',
		skills: () => 'TypeScript · Svelte · React · Node.js · Python · LangGraph · MCP · Web3',
		projects: () => 'GitHub: github.com/lora-sys — 持续更新中',
		blog: () => '写作·日志: lora-sys.github.io/loraSys/blog',
		now: () => '/now — 正在打造 Agent 沙盒、设计生成式画布',
		contact: () => 'lora@example.com · PeerList · YouTube · Bilibili · ZhiHu',
		ls: () => 'about  contact  blog  now  skills  projects  help  clear',
		date: () => {
			try {
				return new Date().toLocaleString('zh-CN', { dateStyle: 'full', timeStyle: 'short' });
			} catch {
				return String(new Date());
			}
		},
		echo: (args?: string) => args ?? '',
		theme: (args?: string) => {
			const mode = (args ?? '').toLowerCase();
			if (mode === 'light' || mode === 'dark') {
				try {
					document.documentElement.classList.toggle('mode-dark', mode === 'dark');
					document.documentElement.classList.toggle('dark', mode === 'dark');
					localStorage.setItem('ink-mode', mode);
				} catch {}
				return `切换至 ${mode} 模式。`;
			}
			return (
				'用法: theme <light|dark> · 当前: ' +
				(document.documentElement.classList.contains('mode-dark') ? 'dark' : 'light')
			);
		},
		exit: () => {
			visible = false;
			return '';
		}
	};

	let input = $state('');
	let history: string[] = [];
	let historyIdx = $state(-1);
	let lines = $state<Array<{ text: string; isCmd?: boolean }>>([
		{ text: '欢迎来到 lora@sys 的终端 💀' },
		{ text: '输入 help 查看可用命令。' },
		{ text: '' }
	]);

	function exec(cmd: string) {
		const trimmed = cmd.trim();
		if (!trimmed) return;
		history.push(trimmed);
		historyIdx = history.length;
		if (trimmed === 'clear' || trimmed === 'cls') {
			lines = [{ text: '', isCmd: true }];
			return;
		}
		if (trimmed === 'exit') {
			visible = false;
			return;
		}
		const [cmdName, ...cmdArgs] = trimmed.split(/\s+/);
		let output = commands[cmdName];
		if (typeof output === 'function') output = output(cmdArgs.join(' '));
		if (output === undefined) output = `命令未找到: ${cmdName}。输入 help 查看可用命令。`;
		lines = [
			...lines,
			{ text: `$ ${trimmed}`, isCmd: true },
			{ text: String(output) },
			{ text: '', isCmd: true }
		];
	}

	let mounted = $state(false);
	let inputEl: HTMLInputElement | null = null;
	let bodyEl: HTMLElement | null = null;

	onMount(() => {
		mounted = true;
		const onKey = (e: KeyboardEvent) => {
			if (!visible) return;
			if (e.key === 'Escape') {
				visible = false;
				return;
			}
			if (e.key === 'ArrowUp') {
				e.preventDefault();
				if (historyIdx > 0) {
					historyIdx--;
					input = history[historyIdx];
				}
				return;
			}
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				if (historyIdx < history.length - 1) {
					historyIdx++;
					input = history[historyIdx];
				} else {
					historyIdx = history.length;
					input = '';
				}
				return;
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	function scrollToBottom() {
		if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
	}

	$effect(() => {
		if (visible && mounted) {
			scrollToBottom();
			setTimeout(() => inputEl?.focus(), 50);
		}
	});
</script>

{#if visible}
	<div class="term-overlay" onclick={() => (visible = false)} role="dialog" aria-label="Terminal">
		<div class="term-window" onclick={(e) => e.stopPropagation()}>
			<div class="term-bar">
				<span class="term-dots"><b></b><b></b><b></b></span>
				<span class="term-title">lora@sys: ~</span>
				<button onclick={() => (visible = false)} aria-label="Close" type="button">×</button>
			</div>
			<div class="term-body" bind:this={bodyEl}>
				{#each lines as line}
					<div class="term-line {line.isCmd ? 'is-cmd' : 'is-out'}">{line.text}</div>
				{/each}
				<div class="term-input-row">
					<span class="term-prompt">$</span>
					<input
						bind:this={inputEl}
						type="text"
						bind:value={input}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								exec(input);
								input = '';
							}
						}}
						spellcheck="false"
						autocomplete="off"
					/>
					<span class="term-cursor" aria-hidden="true"></span>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.term-overlay {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: grid;
		place-items: center;
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(4px);
		padding: 24px;
	}
	.term-window {
		width: 100%;
		max-width: 600px;
		max-height: min(80vh, 520px);
		background: var(--paper);
		border: 1px solid var(--ink-line-strong);
		border-radius: 2px;
		display: flex;
		flex-direction: column;
		box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}
	.term-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 14px;
		background: var(--ink);
		color: var(--paper);
		flex-shrink: 0;
	}
	.term-dots {
		display: flex;
		gap: 6px;
	}
	.term-dots b {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--paper);
		opacity: 0.6;
		display: block;
	}
	.term-dots b:first-child {
		background: #c0392b;
		opacity: 1;
	}
	.term-dots b:nth-child(2) {
		background: #f39c12;
		opacity: 1;
	}
	.term-dots b:nth-child(3) {
		background: #27ae60;
		opacity: 1;
	}
	.term-title {
		font-family: var(--font-label);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		opacity: 0.8;
	}
	.term-bar button {
		background: none;
		border: none;
		color: var(--paper);
		font-size: 1.2rem;
		cursor: pointer;
		line-height: 1;
		opacity: 0.7;
		transition: opacity 0.2s;
		padding: 0;
		width: 22px;
		height: 22px;
		display: grid;
		place-items: center;
	}
	.term-bar button:hover {
		opacity: 1;
	}

	.term-body {
		flex: 1;
		overflow-y: auto;
		padding: 16px 18px;
		font-family: 'Fragment Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
		font-size: 0.78rem;
		line-height: 1.6;
		color: var(--ink);
		min-height: 240px;
		max-height: 440px;
	}
	.term-line {
		white-space: pre-wrap;
		word-break: break-word;
	}
	.term-line.is-cmd {
		color: var(--ink);
	}
	.term-line.is-out {
		color: var(--ink-soft);
	}

	.term-input-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 4px;
	}
	.term-prompt {
		color: var(--zhu);
		font-weight: 700;
		flex: 0 0 auto;
	}
	.term-input-row input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		color: var(--ink);
		font-family: inherit;
		font-size: inherit;
		caret-color: var(--zhu);
	}
	.term-cursor {
		display: inline-block;
		width: 8px;
		height: 1em;
		background: var(--ink);
		animation: termBlink 1s steps(2, end) infinite;
		vertical-align: text-bottom;
	}
	@keyframes termBlink {
		0%,
		49% {
			opacity: 1;
		}
		50%,
		100% {
			opacity: 0;
		}
	}
</style>
