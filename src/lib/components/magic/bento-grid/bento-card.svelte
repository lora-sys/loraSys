<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Component } from 'svelte';

	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRightIcon } from '@lucide/svelte';

	interface BentoCardProps extends HTMLAttributes<HTMLDivElement> {
		name: string;
		class?: string;
		background: Snippet;
		Icon: Component<any>;
		iconClass?: string;
		description: string;
		href: string;
		cta: string;
	}

	let {
		name,
		class: className,
		background,
		Icon,
		iconClass = '',
		description,
		href,
		cta,
		...props
	}: BentoCardProps = $props();
</script>

<div
	class={cn(
		'group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50',
		// light styles
		'bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
		// dark styles
		'transform-gpu dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
		className
	)}
	{...props}
>
	<div>{@render background()}</div>

	<!-- 一直显示：标题 + 图标 -->
	<div class="bg-gradient-to-b from-black/80 via-black/50 to-transparent p-4">
		<div class="z-10 flex flex-col gap-2">
			<Icon class={cn('h-12 w-12 font-bold text-yellow-400', iconClass)} />
			<h3 class="text-2xl font-bold text-foreground">{name}</h3>
		</div>
	</div>

	<!-- 悬停时显示：黑框 + 描述 + 按钮 -->
	<div
		class={cn(
			'pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
		)}
	>
		<p class="max-w-lg text-center font-medium text-foreground">{description}</p>
		<Button {href} variant="link" size="sm" class="mt-4 font-bold text-yellow-400">
			{cta}
			<ArrowRightIcon class="ms-2 h-4 w-4 rtl:rotate-180" />
		</Button>
	</div>

	<!-- 移动端：一直显示按钮 -->
	<div class={cn('pointer-events-none flex w-full flex-row items-center lg:hidden')}>
		<Button variant="link" size="sm" class="pointer-events-auto p-0 font-bold text-foreground">
			<a {href}>
				{cta}
				<ArrowRightIcon class="ms-2 h-4 w-4 rtl:rotate-180" />
			</a>
		</Button>
	</div>
</div>
