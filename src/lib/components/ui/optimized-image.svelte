<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		src: string;
		alt: string;
		class?: string;
		width?: number;
		height?: number;
		loading?: 'lazy' | 'eager';
		sizes?: string;
		placeholder?: string;
	}

	let {
		src,
		alt,
		class: className = '',
		width,
		height,
		loading = 'lazy',
		sizes = '100vw',
		placeholder
	}: Props = $props();

	// Generate modern image sources
	const getImageSrc = (imageSrc: string) => {
		// If it's already a full URL, return as is
		if (imageSrc.startsWith('http') || imageSrc.startsWith('//')) {
			return imageSrc;
		}

		// For local images, assume they're in /static
		return imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
	};

	const imageSrc = getImageSrc(src);

	// Generate WebP and AVIF versions (assuming your build process handles this)
	const webpSrc = imageSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
	const avifSrc = imageSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
</script>

<picture class={cn('block', className)}>
	{#if avifSrc !== imageSrc}
		<source srcset={avifSrc} type="image/avif" {sizes} />
	{/if}
	{#if webpSrc !== imageSrc}
		<source srcset={webpSrc} type="image/webp" {sizes} />
	{/if}
	<img
		src={imageSrc}
		{alt}
		{width}
		{height}
		{loading}
		{sizes}
		class="w-full h-full object-cover"
		style={placeholder ? `background: url(${placeholder}) center/cover no-repeat;` : undefined}
	/>
</picture>