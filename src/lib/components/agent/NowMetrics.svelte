<script lang="ts">
	// NOW metrics — 4 stacked rows. Restrained grid per AGENT brief.
	const metrics: { label: string; desc: string }[] = [
		{ label: 'BUILDING', desc: 'agents.sh — autonomous IDE for solo devs' },
		{ label: 'LEARNING', desc: 'ZK circuits · GPU shaders · Spanish' },
		{ label: 'READING', desc: 'Refik Anadol — "Unsupervised" (2022)' },
		{ label: 'VIBING', desc: 'Hania Rani — "Esja"' }
	];
</script>

<dl class="now">
	{#each metrics as m, i}
		<div class="row">
			<dt>
				<span class="row-num">{String(i + 1).padStart(2, '0')}</span>
				{m.label}
			</dt>
			<dd>{m.desc}</dd>
		</div>
	{/each}
</dl>

<style>
	.now {
		display: flex;
		flex-direction: column;
		gap: clamp(12px, 2vh, 20px);
		margin: 0;
		padding: 0;
	}
	.row {
		display: grid;
		grid-template-columns: minmax(220px, 28vw) 1fr;
		align-items: baseline;
		gap: clamp(16px, 4vw, 48px);
		border-top: 1px solid var(--agent-line);
		padding-top: clamp(16px, 2vh, 24px);
	}
	dt {
		font-family: var(--font-display);
		font-size: var(--type-now-label);
		font-weight: 700;
		letter-spacing: -0.04em;
		line-height: 0.95;
		color: var(--agent-fg);
		margin: 0;
		display: flex;
		align-items: baseline;
		gap: 16px;
	}
	.row-num {
		font-family: var(--font-mono);
		font-size: var(--type-mono-sm);
		color: var(--agent-fg-ghost);
		font-weight: 400;
		letter-spacing: 0.18em;
	}
	dd {
		font-family: var(--font-mono);
		font-size: var(--type-now-desc);
		letter-spacing: 0.06em;
		color: var(--agent-fg-dim);
		text-transform: uppercase;
		margin: 0;
		line-height: 1.5;
	}
	@media (max-width: 767px) {
		.row {
			grid-template-columns: 1fr;
			gap: 8px;
		}
	}
</style>