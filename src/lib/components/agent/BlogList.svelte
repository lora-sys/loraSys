<script lang="ts">
	// BlogList — monospace, 1 line per post
	import type { Post } from '$lib/types';

	interface Props {
		posts: Post[];
	}
	let { posts }: Props = $props();
</script>

<ul class="posts">
	{#each posts as post}
		<li>
			<a href="/blog/{post.slug}">
				<span class="date">{post.date}</span>
				<span class="title">{post.title}</span>
				<span class="arrow">→</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	.posts {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
	}
	li {
		border-bottom: 1px solid #18181b;
	}
	a {
		display: grid;
		grid-template-columns: 140px 1fr 40px;
		gap: 24px;
		padding: 16px 0;
		text-decoration: none;
		color: #a1a1aa;
		font-family: ui-monospace, 'Fragment Mono', monospace;
		font-size: 14px;
		letter-spacing: 0.04em;
		align-items: baseline;
	}
	a:hover {
		color: #67e8f9;
	}
	.date {
		color: #52525b;
		font-size: 12px;
	}
	.title {
		color: inherit;
	}
	.arrow {
		text-align: right;
	}
</style>