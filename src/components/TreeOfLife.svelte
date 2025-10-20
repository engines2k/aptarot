<script lang="ts">
	export let size: number | string = 280;
	export let color: string = "currentColor";
	export let strokeWidth: number = 2;
	export let showLabels: boolean = true;

	export let sephira: Record<string, number[]> = {
		Keter: [120, 20],
		Binah: [60, 60],
		Chokhmah: [180, 60],
		Gevurah: [60, 110],
		Hod: [180, 110],
		Tiferet: [120, 120],
		Netzach: [180, 160],
		Chesed: [60, 110],
		Yesod: [120, 170],
		Malkuth: [120, 220],
	};

	const links = [
		[sephira["Keter"], sephira["Binah"]],
		[sephira["Keter"], sephira["Chokhmah"]],
		[sephira["Binah"], sephira["Chokhmah"]],
		[sephira["Chokhmah"], sephira["Gewurah"]],
		[sephira["Chokhmah"], sephira["Tiphereth"]],
		[sephira["Chokhmah"], sephira["Chesed"]],
		[sephira["Gevurah"], sephira["Chesed"]],
		[sephira["Gevurah"], sephira["Tiphereth"]],
		[sephira["Gevurah"], sephira["Hod"]],
		[sephira["Chesed"], sephira["Tiphereth"]],
		[sephira["Tiphereth"], sephira["Hod"]],
		[sephira["Hod"], sephira["Netzach"]],
		[sephira["Hod"], sephira["Yesod"]],
		[sephira["Netzach"], sephira["Jesod"]],
		[sephira["Jesod"], sephira["Malkuth"]],
	];
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 240 240"
	aria-label="Tree of Life"
	role="img"
>
	<defs>
		<style>
			.node {
				fill: white;
				text-anchor: middle;
			}
			.link {
				fill: none;
			}
			.label {
				font: 10px sans-serif;
				text-anchor: middle;
			}
		</style>
	</defs>

	{#each links as [a, b]}
		<line
			class="link"
			stroke={color}
			stroke-width={strokeWidth}
			x1={sephira[a][0]}
			y1={sephira[a][1]}
			x2={sephira[b][0]}
			y2={sephira[b][1]}
		/>
	{/each}

	{#each sephira as [x, y], i}
		<g>
			<circle
				class="node"
				stroke={color}
				stroke-width={strokeWidth}
				cx={x}
				cy={y}
				r="12"
			/>
			{#if showLabels}
				<text class="label" fill={color} {x} y={y + 30}
					>{labels[i] ?? ""}</text
				>
			{/if}
		</g>
	{/each}

	<line
		class="link"
		stroke={color}
		stroke-width={strokeWidth}
		x1="120"
		y1="32"
		x2="120"
		y2="200"
		stroke-dasharray="3 4"
	/>
</svg>
