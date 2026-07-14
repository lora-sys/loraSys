<script lang="ts">
	// NOW metrics — 4 stacked rows. Static content for Round 2.
	const metrics = [
		{ label: 'BUILDING', desc: 'agents.sh — autonomous IDE for solo devs' },
		{ label: 'LEARNING', desc: 'ZK circuits · GPU shaders · Spanish' },
		{ label: 'READING', desc: 'Refik Anadol — "Unsupervised" (2022)' },
		{ label: 'VIBING', desc: 'Hania Rani — "Esja"' }
	];
</script>

<dl class="now">
	{#each metrics as m}
		<div class="row">
			<dt>{m.label}</dt>
			<dd>{m.desc}</dd>
		</div>
	{/each}
</dl>

<style>
	.now {
		display: flex;
		flex-direction: column;
		gap: clamp(16px, 3vh, 32px);
	}
	.row {
		display: grid;
		grid-template-columns: 28vw 1fr;
		align-items: baseline;
		gap: 24px;
	}
	dt {
		font-size: clamp(48px, 11vw, 140px);
		font-weight: 700;
		letter-spacing: -0.04em;
		line-height: 0.95;
		color: #fff;
	}
	dd {
		font-family: ui-monospace, 'Fragment Mono', monospace;
		font-size: clamp(11px, 2vw, 22px);
		letter-spacing: 0.06em;
		color: #a1a1aa;
		text-transform: uppercase;
	}
</style>