<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import { cn } from '$lib/utils';

	interface DockProps extends VariantProps<typeof dockVariants> {
		className?: string;
		magnification?: number;
		distance?: number;
		direction?: 'top' | 'middle' | 'bottom';
	}

	interface Props {
		class?: DockProps['className'];
		magnification?: DockProps['magnification'];
		distance?: DockProps['distance'];
		direction?: DockProps['direction'];
		children?: import('svelte').Snippet<[any]>;
	}

	let {
		class: className = undefined,
		magnification = 60,
		distance = 140,
		direction = 'middle',
		children
	}: Props = $props();

	const dockVariants = cva(
		'mx-auto w-max mt-8 h-[58px] p-2 flex gap-2 rounded-2xl border supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 backdrop-blur-md'
	);

	let mouseX = $state(Infinity);
	function handleMouseMove(e: MouseEvent) {
		mouseX = e.pageX;
	}

	function handleMouseLeave() {
		mouseX = Infinity;
	}

	let dockClass = $derived(
		cn(dockVariants({ className }), {
			'items-start': direction === 'top',
			'items-center': direction === 'middle',
			'items-end': direction === 'bottom'
		})
	);

	const children_render = $derived(children);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	id="dock"
	onmousemove={(e) => handleMouseMove(e)}
	onmouseleave={handleMouseLeave}
	class={dockClass}
	data-mouse-x={mouseX}
>
	{#if children_render}{@render children_render({ mouseX, magnification, distance })}{:else}
		Default
	{/if}
</div>

<style>
	#dock {
		transition: box-shadow 0.3s ease;
	}
	#dock:hover {
		box-shadow:
			0 0 0 1px rgba(0, 0, 0, 0.03),
			0 2px 4px rgba(0, 0, 0, 0.05),
			0 12px 24px rgba(0, 0, 0, 0.05),
			0 0 30px -5px hsl(45 100% 70% / 0.15);
	}
	:global(:root.dark) #dock:hover {
		box-shadow:
			0 -20px 80px -20px #ffffff1f inset,
			0 0 30px -5px hsl(45 100% 70% / 0.2);
	}
</style>
