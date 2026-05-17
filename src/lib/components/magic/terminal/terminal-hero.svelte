<script lang="ts">
	import { onMount } from 'svelte';
	import { setMode } from 'mode-watcher';
	import { goto } from '$app/navigation';
	import { DATA } from '$lib/data/resume';
	import BorderBeam from '$lib/components/magic/border-beam/border-beam.svelte';
	import MagicCard from '$lib/components/magic/magic-card.svelte';
	import Signature from '$lib/components/spell/signature.svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let commandInput = $state('');
	let commandHistory = $state<string[]>([]);
	let showSignature = $state(false);
	let konamiIndex = $state(0);
	let toastMessage = $state('');
	let showToast = $state(false);
	let bootComplete = $state(false);
	let inputEl: HTMLInputElement | undefined = $state();

	const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

	const bootLines = [
		'Initializing system...',
		'Loading portfolio modules...',
		'Connecting to /dev/awesome...',
		'Mounting /skills ... OK',
		'Mounting /projects ... OK',
		'System ready. Welcome, visitor.',
		'',
		'Type "help" to see available commands.'
	];

	function showToastMsg(msg: string) {
		toastMessage = msg;
		showToast = true;
		setTimeout(() => { showToast = false; }, 2000);
	}

	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			showToastMsg('Copied to clipboard!');
		} catch {
			showToastMsg('Copy failed');
		}
	}

	function handleCommand(cmd: string) {
		const trimmed = cmd.trim().toLowerCase();
		commandHistory = [...commandHistory, `$ ${cmd}`];

		if (trimmed === 'help') {
			commandHistory = [
				...commandHistory,
				'  Available commands:',
				'  help      Show this help message',
				'  dark      Switch to dark mode',
				'  light     Switch to light mode',
				'  projects  View my projects',
				'  about     Learn about me',
				'  contact   Get in touch',
				'  clear     Clear terminal',
				'  neofetch  System info'
			];
		} else if (trimmed === 'dark') {
			setMode('dark');
			commandHistory = [...commandHistory, '  Switched to dark mode'];
		} else if (trimmed === 'light') {
			setMode('light');
			commandHistory = [...commandHistory, '  Switched to light mode'];
		} else if (trimmed === 'projects') {
			commandHistory = [
				...commandHistory,
				'  Projects:',
				...DATA.projects.map((p, i) => `  [${i + 1}] ${p.title} - ${p.description.slice(0, 60)}...`),
				'  Type "open <number>" to visit a project'
			];
		} else if (trimmed.startsWith('open ')) {
			const num = parseInt(trimmed.split(' ')[1]) - 1;
			if (num >= 0 && num < DATA.projects.length) {
				const p = DATA.projects[num];
				commandHistory = [...commandHistory, `  Opening ${p.title}...`];
				if (p.href) goto(p.href);
			} else {
				commandHistory = [...commandHistory, '  Invalid project number'];
			}
		} else if (trimmed === 'about') {
			commandHistory = [
				...commandHistory,
				`  Name: ${DATA.name}`,
				`  Location: ${DATA.location}`,
				`  ${DATA.description}`
			];
		} else if (trimmed === 'contact') {
			commandHistory = [
				...commandHistory,
				'  Contact:',
				...Object.values(DATA.contact.social).map(link => `  ${link.name}: ${link.url}`),
				'  Type "copy <name>" to copy a link'
			];
		} else if (trimmed.startsWith('copy ')) {
			const name = trimmed.split(' ').slice(1).join(' ');
			const social = Object.values(DATA.contact.social).find(
				s => s.name.toLowerCase() === name.toLowerCase()
			);
			if (social) {
				copyToClipboard(social.url);
				commandHistory = [...commandHistory, `  Copied ${social.name} URL`];
			} else {
				commandHistory = [...commandHistory, `  Unknown: ${name}`];
			}
		} else if (trimmed === 'neofetch') {
			commandHistory = [
				...commandHistory,
				'       .--.        ' + DATA.name,
				'      |o_o |       OS: Portfolio OS v2.0',
				'      |:_/ |       Host: SvelteKit + MagicUI',
				'     //   \\ \\      Kernel: TypeScript 5.x',
				'    (|     | )     Shell: terminal-hero',
				`   /\'\\_   _/\'\\     Resolution: responsive`,
				'   \\___)=(___/     Theme: terminal-geek'
			];
		} else if (trimmed === 'clear') {
			commandHistory = [];
		} else if (trimmed === 'sudo') {
			commandHistory = [...commandHistory, '  Permission denied. Nice try though.'];
		} else if (trimmed === 'exit') {
			commandHistory = [...commandHistory, '  There is no escape from this terminal.'];
		} else if (trimmed) {
			commandHistory = [
				...commandHistory,
				`  Command not found: ${cmd}`,
				'  Type "help" for available commands'
			];
		}

		commandInput = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && commandInput.trim()) {
			handleCommand(commandInput);
		}

		// Konami code detection
		if (e.key === KONAMI_CODE[konamiIndex]) {
			konamiIndex++;
			if (konamiIndex === KONAMI_CODE.length) {
				triggerKonami();
				konamiIndex = 0;
			}
		} else {
			konamiIndex = 0;
		}
	}

	function triggerKonami() {
		showSignature = true;
		setTimeout(() => { showSignature = false; }, 3000);
	}

	onMount(() => {
		// Typewriter boot sequence
		let i = 0;
		const interval = setInterval(() => {
			if (i < bootLines.length) {
				commandHistory = [...commandHistory, bootLines[i] ? `> ${bootLines[i]}` : ''];
				i++;
			} else {
				clearInterval(interval);
				bootComplete = true;
				inputEl?.focus();
			}
		}, 300);

		return () => clearInterval(interval);
	});
</script>

<div class="relative {className}">
	<MagicCard glowColor="rgba(34,197,94,0.12)" class="border-term-green/20">
		<!-- Terminal Header -->
		<div class="flex items-center gap-2 border-b border-border/50 bg-term-main px-4 py-2.5">
			<div class="flex gap-1.5">
				<div class="h-3 w-3 rounded-full bg-red-500/80 transition-colors hover:bg-red-500"></div>
				<div class="h-3 w-3 rounded-full bg-yellow-500/80 transition-colors hover:bg-yellow-500"></div>
				<div class="h-3 w-3 rounded-full bg-green-500/80 transition-colors hover:bg-green-500"></div>
			</div>
			<div class="flex-1 text-center">
				<span class="font-mono text-xs text-muted-foreground">guest@portfolio ~ /home/{DATA.name}</span>
			</div>
			<div class="w-12"></div>
		</div>

		<!-- Terminal Body -->
		<div class="min-h-[20rem] p-4 font-mono text-sm">
			<!-- Command History -->
			<div class="mb-4 max-h-72 space-y-0.5 overflow-y-auto scrollbar-thin">
				{#each commandHistory as line, idx (idx)}
					<div
						class="whitespace-pre-wrap {line.startsWith('$')
							? 'text-foreground font-bold'
							: line.startsWith('>')
								? 'text-term-green animate-[fadeIn_0.3s_ease-out]'
								: 'text-muted-foreground'}"
					>
						{line}
					</div>
				{/each}
			</div>

			<!-- Input Line -->
			{#if bootComplete}
				<div class="flex items-center gap-2 border-t border-border/30 pt-3">
					<span class="select-none text-term-green">$</span>
					<input
						bind:this={inputEl}
						bind:value={commandInput}
						onkeydown={handleKeydown}
						class="flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
						placeholder="type a command..."
						autocomplete="off"
						autocorrect="off"
						autocapitalize="off"
						spellcheck="false"
					/>
					<span class="animate-pulse text-term-green">|</span>
				</div>
			{/if}
		</div>

		<!-- Border Beam -->
		<BorderBeam
			size={180}
			colorFrom="var(--term-green, #22c55e)"
			colorTo="#9c40ff"
			duration={8}
		/>
	</MagicCard>

	<!-- Toast -->
	{#if showToast}
		<div class="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 animate-[slideUp_0.3s_ease-out]">
			<div class="rounded-lg border border-term-green/30 bg-term-main px-4 py-2 font-mono text-sm text-term-green shadow-lg shadow-term-green/10">
				{toastMessage}
			</div>
		</div>
	{/if}

	<!-- Konami Signature Animation -->
	{#if showSignature}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
			role="dialog"
			aria-modal="true"
		>
			<Signature text={DATA.name} fontSize={72} />
		</div>
	{/if}
</div>

<style>
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(4px); }
		to { opacity: 1; transform: translateY(0); }
	}
	@keyframes slideUp {
		from { opacity: 0; transform: translate(-50%, 10px); }
		to { opacity: 1; transform: translate(-50%, 0); }
	}
</style>
