<script lang="ts">
	let { data } = $props();

	interface ContributionDay {
		date: string;
		contributionCount: number;
	}

	interface ContributionData {
		totalContributions: number;
		weeks: { contributionDays: ContributionDay[] }[];
		lastUpdated: string | null;
	}

	type Level = 0 | 1 | 2 | 3 | 4;

	function getLevel(count: number): Level {
		if (count === 0) return 0;
		if (count <= 3) return 1;
		if (count <= 6) return 2;
		if (count <= 10) return 3;
		return 4;
	}

	const months: { name: string; col: number }[] = $derived.by(() => {
		if (!data.weeks?.length) return [];
		const result: { name: string; col: number }[] = [];
		let lastMonth = -1;
		const weeks = data.weeks as ContributionData['weeks'];
		for (let i = 0; i < weeks.length; i++) {
			const week = weeks[i];
			const firstDay = week.contributionDays[0];
			if (!firstDay) continue;
			const month = new Date(firstDay.date).getMonth();
			if (month !== lastMonth) {
				const names = [
					'1月',
					'2月',
					'3月',
					'4月',
					'5月',
					'6月',
					'7月',
					'8月',
					'9月',
					'10月',
					'11月',
					'12月'
				];
				result.push({ name: names[month], col: i });
				lastMonth = month;
			}
		}
		return result;
	});

	const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];

	const contributions: ContributionData = $derived(data as ContributionData);
	const total = $derived(contributions.totalContributions ?? 0);
	const weeks = $derived(contributions.weeks ?? []);

	let tooltipPos = $state<{ x: number; y: number; text: string } | null>(null);

	function showTooltip(e: MouseEvent, day: ContributionDay) {
		const date = new Date(day.date).toLocaleDateString('zh-CN', {
			month: 'long',
			day: 'numeric',
			weekday: 'short'
		});
		const text =
			day.contributionCount === 0 ? `${date}: 无贡献` : `${date}: ${day.contributionCount} 次贡献`;
		tooltipPos = { x: e.clientX, y: e.clientY, text };
	}

	function hideTooltip() {
		tooltipPos = null;
	}

	function moveTooltip(e: MouseEvent) {
		if (tooltipPos) {
			tooltipPos = { x: e.clientX, y: e.clientY, text: tooltipPos.text };
		}
	}
</script>

{#if weeks.length > 0}
	<div class="contrib-wrap">
		<div class="contrib-header">
			<div class="contrib-avatar">
				<img src="https://github.com/lora-sys.png?size=80" alt="lora-sys" loading="lazy" />
				<div>
					<span class="contrib-username">lora-sys</span>
					<span class="contrib-total">{total} 次贡献 · 过去一年</span>
				</div>
			</div>
			<a
				href="https://github.com/lora-sys"
				target="_blank"
				rel="noreferrer"
				class="contrib-gh-link"
			>
				在 GitHub 上查看 →
			</a>
		</div>

		<div class="contrib-body">
			<div class="contrib-labels">
				{#each dayLabels as label, i}
					{#if i % 2 === 1}
						<span class="day-label">{label}</span>
					{/if}
				{/each}
			</div>

			<div class="contrib-grid">
				{#each months as m}
					<span class="month-label" style="grid-column: {m.col + 1}">{m.name}</span>
				{/each}

				{#each weeks as _week}
					{#each _week.contributionDays as day, _di}
						{@const level = getLevel(day.contributionCount)}
						<div
							class="cell cell-{level}"
							role="gridcell"
							title="{day.contributionCount} 次贡献 · {day.date}"
							onmouseenter={(e) => showTooltip(e, day)}
							onmousemove={moveTooltip}
							onmouseleave={hideTooltip}
						></div>
					{/each}
				{/each}
			</div>
		</div>

		<div class="contrib-legend">
			<span class="legend-text">少</span>
			<div class="legend-cells">
				{#each [0, 1, 2, 3, 4] as lvl}
					<div class="cell cell-{lvl}"></div>
				{/each}
			</div>
			<span class="legend-text">多</span>
		</div>
	</div>

	{#if tooltipPos}
		<div class="contrib-tooltip" style="left: {tooltipPos.x + 12}px; top: {tooltipPos.y - 36}px">
			{tooltipPos.text}
		</div>
	{/if}
{:else}
	<div class="contrib-wrap">
		<div class="contrib-header">
			<div class="contrib-title">
				<span class="contrib-seal" aria-hidden="true">墨</span>
				<div>
					<h3>贡献图谱</h3>
					<p class="contrib-sub">等待数据加载…</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.contrib-wrap {
		background: var(--paper-2);
		border: 1px solid var(--ink-line);
		padding: clamp(20px, 3vw, 32px);
		position: relative;
	}

	.contrib-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--ink-line);
	}

	.contrib-avatar {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.contrib-avatar img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1.5px solid var(--ink-line-strong);
		object-fit: cover;
	}

	.contrib-username {
		font-family: var(--font-label);
		font-weight: 800;
		font-size: 0.82rem;
		letter-spacing: 0.04em;
		color: var(--ink);
		display: block;
		line-height: 1.3;
	}

	.contrib-total {
		font-family: var(--font-label);
		font-size: 0.66rem;
		letter-spacing: 0.1em;
		color: var(--ink-mute);
		display: block;
		margin-top: 2px;
	}

	.contrib-gh-link {
		font-family: var(--font-label);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		color: var(--zhu);
		text-decoration: none;
		white-space: nowrap;
		padding: 5px 12px;
		border: 1px solid var(--ink-line-strong);
		border-radius: 2px;
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}

	.contrib-gh-link:hover {
		background: var(--zhu);
		color: var(--paper);
	}

	.contrib-body {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		padding-bottom: 4px;
	}

	.contrib-labels {
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding-top: 20px;
		flex-shrink: 0;
	}

	.day-label {
		font-family: var(--font-label);
		font-size: 0.58rem;
		letter-spacing: 0.06em;
		color: var(--ink-mute);
		height: 13px;
		line-height: 13px;
	}

	.contrib-grid {
		display: grid;
		grid-template-columns: repeat(53, 13px);
		grid-template-rows: 20px repeat(7, 13px);
		gap: 3px;
		flex-shrink: 0;
	}

	.month-label {
		font-family: var(--font-label);
		font-size: 0.6rem;
		letter-spacing: 0.08em;
		color: var(--ink-mute);
		height: 20px;
		line-height: 20px;
	}

	.cell {
		width: 13px;
		height: 13px;
		border-radius: 2px;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
		cursor: pointer;
	}

	.cell:hover {
		transform: scale(1.6);
		box-shadow: 0 0 0 2px var(--zhu);
		z-index: 2;
	}

	.cell-0 {
		background: var(--ink-line);
	}
	.cell-1 {
		background: rgba(198, 65, 44, 0.25);
	}
	.cell-2 {
		background: rgba(198, 65, 44, 0.45);
	}
	.cell-3 {
		background: rgba(198, 65, 44, 0.7);
	}
	.cell-4 {
		background: var(--zhu);
	}

	.contrib-legend {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 6px;
		margin-top: 12px;
	}

	.legend-text {
		font-family: var(--font-label);
		font-size: 0.6rem;
		letter-spacing: 0.08em;
		color: var(--ink-mute);
	}

	.legend-cells {
		display: flex;
		gap: 3px;
	}

	.contrib-tooltip {
		position: fixed;
		z-index: 100;
		background: var(--ink);
		color: var(--paper);
		font-family: var(--font-label);
		font-size: 0.7rem;
		letter-spacing: 0.04em;
		padding: 6px 10px;
		border-radius: 2px;
		pointer-events: none;
		white-space: nowrap;
		transform: translateX(-50%);
	}

	@media (max-width: 760px) {
		.contrib-grid {
			grid-template-columns: repeat(53, 11px);
			gap: 2px;
		}
		.cell {
			width: 11px;
			height: 11px;
		}
		.day-label {
			height: 11px;
			line-height: 11px;
		}
		.contrib-labels {
			gap: 2px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.contrib-grid {
			gap: 2px;
		}
		.cell:hover {
			transform: none;
			box-shadow: none;
		}
	}
</style>
